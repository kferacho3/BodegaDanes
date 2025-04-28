/*  Stripe Webhook — App-Router endpoint
    ──────────────────────────────────────────────────────────────
    Listens to:
      • checkout.session.*     (completed / async_* / failed / expired)
      • invoice.*              (finalized / payment_succeeded / payment_failed)
      • payment_intent.*       (processing / succeeded / payment_failed)
      • product.*, price.*     (catalog re-validation tag = “services”)
----------------------------------------------------------------- */

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client'; // ← for JSON typing
import { buffer } from 'micro';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { Resend } from 'resend';
import Stripe from 'stripe';

export const config = { api: { bodyParser: false } };   // keep raw body

/* ────── SDKs ────── */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});
const resend  = new Resend(process.env.RESEND_API_KEY!);

const SEND_FROM = process.env.SEND_FROM_EMAIL!;
const CHEF      = 'info@bodegadanes.com';

/* convenience wrapper – keeps all mail sends in one place */
function sendMail(to: string, subject: string, html: string) {
  return resend.emails.send({ from: SEND_FROM, to, subject, html });
}

/* ---------- helpers ---------- */
async function createRemainingInvoice(s: Stripe.Checkout.Session): Promise<void> {
  const priceId = s.metadata!.serviceId;
  const price   = await stripe.prices.retrieve(priceId);

  const full      = Number(price.metadata.full_price_cents ?? 0);
  const remaining = full - (price.unit_amount ?? 0);
  if (remaining <= 0) return;                              // nothing else to bill

  await stripe.invoiceItems.create({
    customer   : s.customer as string,
    amount     : remaining,
    currency   : 'usd',
    description: `Remaining balance – ${priceId}`,
  });
  await stripe.invoices.create({
    customer        : s.customer as string,
    collection_method: 'send_invoice',
    days_until_due  : 7,
  });
}

/** bust `/book` static tag when anything in catalog changes */
async function revalidateCatalog() {
  if (!process.env.REVALIDATE_TOKEN) return;
  await fetch(
    `${process.env.BASE_URL}/api/revalidate?tag=services&secret=${process.env.REVALIDATE_TOKEN}`,
  ).catch(() => void 0);
}

/* ---------- webhook entry point ---------- */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST')
    return res.status(405).end('Method Not Allowed');

  /* 1 · verify Stripe signature */
  let event: Stripe.Event;
  try {
    const sig = req.headers['stripe-signature'] as string;
    const raw = await buffer(req);
    event     = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error('⚠️  Invalid webhook signature', err);
    return res.status(400).end('Webhook Error');
  }

  /* 2 · route by event type */
  switch (event.type) {
    /* ───────── CHECKOUT SUCCESS ───────── */
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      const s       = event.data.object as Stripe.Checkout.Session;
      const meta    = s.metadata! as Record<string, string>;   // strongly-typed
      const dateUTC = new Date(meta.date);                     // yyyy-MM-dd

      await createRemainingInvoice(s);

      /* 2-A · upsert booking (row may already exist from /api/booking) */
      await prisma.booking.upsert({
        where : { confirmationCode: meta.confirmationCode },
        update: {
          stripeId   : s.id,
          customerId : s.customer as string | null,
        },
        create: {
          date            : dateUTC,
          serviceId       : meta.serviceId,
          confirmationCode: meta.confirmationCode,
          customerId      : s.customer as string | null,
          customerEmail   : s.customer_email!,
          stripeId        : s.id,
          meta            : meta as Prisma.InputJsonValue,
        },
      });

      /* 2-B · mark calendar BOOKED (green for owner / red for others) */
      await prisma.availability.upsert({
        where : { date: dateUTC },
        update: { status: 'BOOKED' },
        create: { date: dateUTC, status: 'BOOKED' },
      });

      /* 2-C · email receipts */
      const html = `
        <h1>Booking confirmed · ${meta.serviceId}</h1>
        <p><b>Date:</b> ${meta.date}</p>
        <p><b>Theme:</b> ${meta.theme}</p>
        <p><b>Time:</b> ${meta.time}</p>
        <p><b>Location:</b> ${meta.location}</p>
        <p><b>Guests:</b> ${meta.guests}</p>
        <p><b>Confirmation #:</b> ${meta.confirmationCode}</p>
        <p>You can review or edit your event at:<br/>
           <a href="${process.env.BASE_URL}/my-events">${process.env.BASE_URL}/my-events</a></p>
      `;
      if (s.customer_email)
        await sendMail(s.customer_email, 'Your booking is confirmed!', html);

      await sendMail(
        CHEF,
        `NEW EVENT – ${meta.serviceId} on ${meta.date}`,
        html,
      );
      break;
    }

    /* ───────── CHECKOUT FAILURE ───────── */
    case 'checkout.session.async_payment_failed': {
      const s   = event.data.object as Stripe.Checkout.Session;
      const msg = '<p>Your deposit payment failed. Please retry.</p>';
      if (s.customer_email) await sendMail(s.customer_email, 'Payment failed', msg);
      await sendMail(CHEF, 'Client deposit payment failed', msg);
      break;
    }
    case 'checkout.session.expired':
      /* user abandoned – optional: reopen slot */
      break;

    /* ───────── INVOICE LIFECYCLE ───────── */
    case 'invoice.finalized': {
      const inv  = event.data.object as Stripe.Invoice;
      const link = inv.hosted_invoice_url;
      await sendMail(
        inv.customer_email!,
        'Your final invoice is ready',
        `<p>Please pay your remaining balance:</p><p><a href="${link}">${link}</a></p>`,
      );
      break;
    }
    case 'invoice.payment_succeeded': {
      const inv = event.data.object as Stripe.Invoice;
      await sendMail(
        inv.customer_email!,
        'Payment received – thank you!',
        '<p>See you soon!</p>',
      );
      await sendMail(CHEF, 'Client paid final invoice', `<p>${inv.number} paid.</p>`);
      break;
    }
    case 'invoice.payment_failed': {
      const inv = event.data.object as Stripe.Invoice;
      const msg = '<p>Your payment failed. Please update your card.</p>';
      await sendMail(inv.customer_email!, 'Payment failed', msg);
      await sendMail(CHEF, 'Invoice payment failed', `<p>${inv.number}</p>`);
      break;
    }
    case 'invoice.voided':
    case 'invoice.marked_uncollectible': {
      const inv = event.data.object as Stripe.Invoice;
      await sendMail(
        CHEF,
        `Invoice ${inv.number} ${event.type.split('.')[1]}`,
        '<p>See Stripe dashboard for details.</p>',
      );
      break;
    }

    /* ───────── AUTOMATIC CARD CHARGE ───────── */
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      await sendMail(
        pi.receipt_email!,
        'Balance charged successfully',
        '<p>Thank you!</p>',
      );
      break;
    }
    case 'payment_intent.payment_failed': {
      const pi  = event.data.object as Stripe.PaymentIntent;
      const msg = '<p>Your card was declined. Please retry or contact us.</p>';
      await sendMail(pi.receipt_email || CHEF, 'Card charge failed', msg);
      break;
    }

    /* ───────── CATALOG CHANGES ───────── */
    case 'product.created':
    case 'product.updated':
    case 'product.deleted':
    case 'price.created':
    case 'price.updated':
    case 'price.deleted':
      await revalidateCatalog();
      break;

    /* — default — */
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}
