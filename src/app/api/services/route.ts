// app/api/services/route.ts
import { NextResponse } from 'next/server'; // <-- dropped NextRequest
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
  });

/**
 * GET /api/services
 * Returns every *active* one-time Price with its Product metadata,
 * collapsed into the <Service> shape used by the client.
 */
export async function GET() {                        // <-- no unused param
  try {
    const prices = await stripe.prices.list({
      active: true,
      limit : 100,
      expand: ['data.product'],                      // expand = 1 RTT :contentReference[oaicite:2]{index=2}
    });

    const services = prices.data
      .filter(
        p => p.type === 'one_time' && p.unit_amount && p.product, // skip subs :contentReference[oaicite:3]{index=3}
      )
      .map(p => {
        const prod = p.product as Stripe.Product;                 // Price.product is union :contentReference[oaicite:4]{index=4}
        return {
          id   : p.id,
          name : prod.name,
          price: p.unit_amount,                                  // deposit (¢)
          full : Number(prod.metadata.full ?? p.unit_amount),    // fallback
          image: prod.images?.[0] ?? '/images/placeholder-service.webp',
          blurb: prod.metadata.blurb ?? prod.description ?? '',
          slots: Number(prod.metadata.slots ?? 1),
        };
      });

    return NextResponse.json(services);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'; // safe-typed :contentReference[oaicite:5]{index=5}
    console.error('Stripe fetch failed', err);
    return NextResponse.json({ error: 'stripe_error', message }, { status: 500 });
  }
}
