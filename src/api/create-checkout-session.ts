import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// Option B: Casting the API version to bypass the type mismatch, or update to latest package version.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as unknown as Stripe.LatestApiVersion,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { date, serviceId, addons, notes } = req.body;

  // TODO: re‑fetch availability from DB and throw if no slots left
  // …

  // Hard‑coded price IDs for demo — replace with real Stripe Prices
  const PRICE_MAP: Record<string, string> = {
    "chef-table": "price_123",
    "backyard-bbq": "price_456",
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: PRICE_MAP[serviceId],
        quantity: 1,
      },
    ],
    metadata: {
      date,
      serviceId,
      addons: JSON.stringify(addons),
      notes,
    },
    success_url: `${process.env.BASE_URL}/book/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/book?canceled=1`,
  });

  res.status(200).json({ id: session.id });
}
