/*  src/api/stripe/webhook.ts
    Handles every event in your list:
    - Checkout (4)
    - Invoice  (5)
    - PaymentIntent (3)
    - Product   (3)
    - Price     (3)
-------------------------------------------------------------------------- */
import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});
const resend = new Resend(process.env.RESEND_API_KEY!);

/* ───────── Helpers ───────── */
const CHEF = "info@bodegadanes.com";

async function sendEmail(to: string, subject: string, html: string) {
  await resend.emails.send({
    from: process.env.SEND_FROM_EMAIL!,
    to,
    subject,
    html,
  });
}

/**
 * Creates an invoice for the remaining balance
 * Uses the price metadata `full_price_cents`
 */
async function createRemainingBalanceInvoice(
  session: Stripe.Checkout.Session
) {
  const priceId = session.metadata!.serviceId as string;
  const price = await stripe.prices.retrieve(priceId);
  const full = Number(price.metadata.full_price_cents);
  const deposit = price.unit_amount!;
  const remaining = full - deposit;
  if (remaining <= 0) return;

  const customer = session.customer as string;
  await stripe.invoiceItems.create({
    customer,
    amount: remaining,
    currency: "usd",
    description: `Remaining balance – ${session.metadata!.serviceId}`,
  });
  await stripe.invoices.create({
    customer,
    collection_method: "send_invoice",
    days_until_due: 7,
  });
}

/**
 * Simple ISR/SSG revalidation (optional)
 */
async function revalidateCatalog() {
  if (!process.env.REVALIDATE_TOKEN) return;
  await fetch(
    `${process.env.BASE_URL}/api/revalidate?tag=services&secret=${process.env.REVALIDATE_TOKEN}`
  ).catch(() => {});
}

/* ───────── Webhook entrypoint ───────── */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  /* ---------- Verify signature ---------- */
  const sig = req.headers["stripe-signature"] as string;
  const raw = await buffer(req);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("⚠️  Invalid webhook signature", err);
    return res.status(400).end("Webhook Error");
  }

  /* ---------- Handle events ---------- */
  switch (event.type) {
    /* ════════════ CHECKOUT ════════════ */
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const s = event.data.object as Stripe.Checkout.Session;

      // Create invoice for remaining balance (if any)
      await createRemainingBalanceInvoice(s);

      // Confirmation email
      const code = "BD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      const html = `
        <h1>Booking confirmed · ${s.metadata!.serviceId}</h1>
        <p>Date: <strong>${s.metadata!.date}</strong></p>
        <p>Theme: ${s.metadata!.theme}</p>
        <p>Time: ${s.metadata!.time}</p>
        <p>Location: ${s.metadata!.location}</p>
        <p>Guests: ${s.metadata!.guests}</p>
        <p>Notes: ${s.metadata!.notes || "—"}</p>
        <p>Confirmation code: <strong>${code}</strong></p>
      `;
      if (s.customer_email) {
        await sendEmail(s.customer_email, "Your booking is confirmed!", html);
      }
      await sendEmail(
        CHEF,
        `NEW EVENT – ${s.metadata!.serviceId} on ${s.metadata!.date}`,
        html
      );
      break;
    }

    case "checkout.session.async_payment_failed": {
      const s = event.data.object as Stripe.Checkout.Session;
      const msg =
        "<p>Your deposit payment failed. Please try booking again or use a different method.</p>";
      if (s.customer_email)
        await sendEmail(s.customer_email, "Booking payment failed", msg);
      await sendEmail(CHEF, "Deposit payment failed", msg);
      // TODO: free slot in DB
      break;
    }

    case "checkout.session.expired": {
      // Customer abandoned checkout; free the slot
      // TODO: release hold in DB
      break;
    }

    /* ════════════ INVOICE ════════════ */
    case "invoice.finalized": {
      const inv = event.data.object as Stripe.Invoice;
      const link = inv.hosted_invoice_url;
      await sendEmail(
        inv.customer_email!,
        "Your final invoice is ready",
        `<p>Please pay your remaining balance:</p><p><a href="${link}">${link}</a></p>`
      );
      break;
    }
    case "invoice.payment_succeeded": {
      const inv = event.data.object as Stripe.Invoice;
      await sendEmail(inv.customer_email!, "Payment received – thank you!", "<p>We’ll see you soon!</p>");
      await sendEmail(CHEF, "Client paid final invoice", `<p>${inv.number} paid.</p>`);
      break;
    }
    case "invoice.payment_failed": {
      const inv = event.data.object as Stripe.Invoice;
      const notice =
        "<p>Your payment failed. Please update your card details.</p>";
      await sendEmail(inv.customer_email!, "Payment failed", notice);
      await sendEmail(CHEF, "Invoice payment failed", `<p>${inv.number}</p>`);
      break;
    }
    case "invoice.voided":
    case "invoice.marked_uncollectible": {
      const inv = event.data.object as Stripe.Invoice;
      await sendEmail(
        CHEF,
        `Invoice ${inv.number} ${event.type.split(".")[1]}`,
        "<p>Check Stripe dashboard for details.</p>"
      );
      break;
    }

    /* ════════════ PAYMENT INTENT (if you auto‑charge) ════════════ */
    case "payment_intent.processing":
      // Optional logging
      break;
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      await sendEmail(pi.receipt_email!, "Balance charged successfully", "<p>Thank you!</p>");
      break;
    }
    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      await sendEmail(
        pi.receipt_email || CHEF,
        "Card charge failed",
        "<p>Please retry or contact support.</p>"
      );
      break;
    }

    /* ════════════ CATALOG SYNC ════════════ */
    case "product.created":
    case "product.updated":
    case "product.deleted":
    case "price.created":
    case "price.updated":
    case "price.deleted": {
      // TODO: upsert into DB if you store catalog
      await revalidateCatalog();
      break;
    }

    /* ════════════ default ════════════ */
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}
