/*  Stripe Webhook — Next.js App Router
    Handles:
      • checkout.session.*     (completed / async_* / failed / expired)
      • invoice.*              (finalized / payment_succeeded / payment_failed …
      • payment_intent.*       (processing / succeeded / payment_failed)
      • product.*, price.*     (catalog revalidation)
----------------------------------------------------------------------- */
import { prisma } from '@/lib/prisma'; // ← your shared client
import { buffer } from 'micro'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'
import Stripe from 'stripe'

/* ---------- Stripe & Resend ---------- */
export const config = { api: { bodyParser: false } }  // <-- keep raw body  :contentReference[oaicite:3]{index=3}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

const resend = new Resend(process.env.RESEND_API_KEY!)
const CHEF   = 'info@bodegadanes.com'                 // owner address

async function sendEmail(to: string, subject: string, html: string) {
  await resend.emails.send({ from: process.env.SEND_FROM_EMAIL!, to, subject, html })
}

/* ---------- Helpers ---------- */
async function createRemainingBalanceInvoice(s: Stripe.Checkout.Session) {
  const priceId   = s.metadata!.serviceId as string
  const price     = await stripe.prices.retrieve(priceId)          // fetch tier price
  const full      = Number(price.metadata.full_price_cents)        // full event price
  const deposit   = price.unit_amount!
  const remaining = full - deposit
  if (remaining <= 0) return

  const customer = s.customer as string
  await stripe.invoiceItems.create({
    customer,
    amount   : remaining,
    currency : 'usd',
    description: `Remaining balance – ${s.metadata!.serviceId}`,
  })
  await stripe.invoices.create({
    customer,
    collection_method: 'send_invoice',
    days_until_due   : 7,
  })
}

async function revalidateCatalog() {
  if (!process.env.REVALIDATE_TOKEN) return
  await fetch(
    `${process.env.BASE_URL}/api/revalidate?tag=services&secret=${process.env.REVALIDATE_TOKEN}`,
  ).catch(() => {})
}

/* ---------- Webhook entrypoint ---------- */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')

  let event: Stripe.Event
  try {
    const sig = req.headers['stripe-signature'] as string
    const raw = await buffer(req)                                   // raw body :contentReference[oaicite:4]{index=4}
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('⚠️  Invalid webhook signature', err)
    return res.status(400).end('Webhook Error')
  }

  /* ---------- Dispatch ---------- */
  switch (event.type) {
    /* ═════════════ CHECKOUT ═════════════ */
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      const s = event.data.object as Stripe.Checkout.Session

      /* 1 · optional remaining-balance invoice */
      await createRemainingBalanceInvoice(s)

      /* 2 · Persist booking … and mark availability → BOOKED */
      await prisma.booking.create({
        data: {
          date      : new Date(s.metadata!.date),       // yyyy-MM-dd
          serviceId : s.metadata!.serviceId,
          customerId: s.customer as string,
          stripeId  : s.id,
        },
      })
      await prisma.availability.upsert({
        where : { date: new Date(s.metadata!.date) },
        update: { status: 'BOOKED' },
        create: { date: new Date(s.metadata!.date), status: 'BOOKED' },
      })                                                              // upsert row → green

      /* 3 · Email confirmations */
      const code = 'BD-' + Math.random().toString(36).slice(2, 8).toUpperCase()
      const html = `
        <h1>Booking confirmed · ${s.metadata!.serviceId}</h1>
        <p>Date: <strong>${s.metadata!.date}</strong></p>
        <p>Theme: ${s.metadata!.theme}</p>
        <p>Time: ${s.metadata!.time}</p>
        <p>Location: ${s.metadata!.location}</p>
        <p>Guests: ${s.metadata!.guests}</p>
        <p>Notes: ${s.metadata!.notes || '—'}</p>
        <p>Confirmation code: <strong>${code}</strong></p>
      `
      if (s.customer_email) {
        await sendEmail(s.customer_email, 'Your booking is confirmed!', html)
      }
      await sendEmail(CHEF, `NEW EVENT – ${s.metadata!.serviceId} on ${s.metadata!.date}`, html)
      break
    }

    case 'checkout.session.async_payment_failed': {
      const s   = event.data.object as Stripe.Checkout.Session
      const msg = '<p>Your deposit payment failed. Please try again or use another card.</p>'
      if (s.customer_email) await sendEmail(s.customer_email, 'Booking payment failed', msg)
      await sendEmail(CHEF, 'Deposit payment failed', msg)
      // optional: prisma logic to reopen slot
      break
    }

    case 'checkout.session.expired':
      // Customer abandoned checkout – optional slot release
      break

    /* ═════════════ INVOICE ═════════════ */
    case 'invoice.finalized': {
      const inv  = event.data.object as Stripe.Invoice
      const link = inv.hosted_invoice_url
      await sendEmail(
        inv.customer_email!,
        'Your final invoice is ready',
        `<p>Please pay your remaining balance:</p><p><a href="${link}">${link}</a></p>`,
      )
      break
    }
    case 'invoice.payment_succeeded': {
      const inv = event.data.object as Stripe.Invoice
      await sendEmail(inv.customer_email!, 'Payment received – thank you!', '<p>We’ll see you soon!</p>')
      await sendEmail(CHEF, 'Client paid final invoice', `<p>${inv.number} paid.</p>`)
      break
    }
    case 'invoice.payment_failed': {
      const inv = event.data.object as Stripe.Invoice
      const notice = '<p>Your payment failed. Please update your card details.</p>'
      await sendEmail(inv.customer_email!, 'Payment failed', notice)
      await sendEmail(CHEF, 'Invoice payment failed', `<p>${inv.number}</p>`)
      break
    }
    case 'invoice.voided':
    case 'invoice.marked_uncollectible': {
      const inv = event.data.object as Stripe.Invoice
      await sendEmail(
        CHEF,
        `Invoice ${inv.number} ${event.type.split('.')[1]}`,
        '<p>Check Stripe dashboard for details.</p>',
      )
      break
    }

    /* ═════════ PAYMENT INTENT (auto-charge) ═════════ */
    case 'payment_intent.processing':
      break
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      await sendEmail(pi.receipt_email!, 'Balance charged successfully', '<p>Thank you!</p>')
      break
    }
    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      await sendEmail(pi.receipt_email || CHEF, 'Card charge failed', '<p>Please retry or contact support.</p>')
      break
    }

    /* ═════════ CATALOG CHANGES ═════════ */
    case 'product.created':
    case 'product.updated':
    case 'product.deleted':
    case 'price.created':
    case 'price.updated':
    case 'price.deleted':
      await revalidateCatalog()
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.status(200).json({ received: true })
}
