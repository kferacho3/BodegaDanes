import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as unknown as Stripe.LatestApiVersion,
  });

export type Service = {
  id: string;
  name: string;
  priceId: string;
  unitAmount: number; // in cents
  blurb: string;
};

export async function fetchStripeServices(): Promise<Service[]> {
  // Assumes each Product has exactly one active Price (simple case)
  const products = await stripe.products.list({ active: true, limit: 100 });

  const services: Service[] = [];
  for (const product of products.data) {
    const price = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 1,
    });
    if (!price.data[0]) continue;

    services.push({
      id: product.metadata?.slug || product.id,
      name: product.name,
      blurb: product.description || "",
      priceId: price.data[0].id,
      unitAmount: price.data[0].unit_amount ?? 0,
    });
  }
  return services;
}
