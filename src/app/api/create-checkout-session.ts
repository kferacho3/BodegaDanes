import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  const {
    date,
    serviceId,
    theme,
    time,
    location,
    guests,
    notes,
  } = req.body;

  /* ---------- fetch the price to charge (reservation fee) ---------- */
  const price = await stripe.prices.retrieve(serviceId);

  if (!price || price.unit_amount == null)
    return res.status(400).json({ error: "Invalid price ID" });

  /* ---------- metadata to store all booking info ---------- */
  const metadata = {
    date,
    serviceId,
    theme,
    time,
    location,
    guests: String(guests),
    notes,
  };

  /* ---------- create session ---------- */
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{ price: serviceId, quantity: 1 }],
    metadata,
    customer_email: req.body.email ?? undefined,
    success_url: `${process.env.BASE_URL}/book/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/book?canceled=1`,
  });

  res.status(200).json({ id: session.id });
}
