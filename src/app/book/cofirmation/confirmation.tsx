import Image from "next/image";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as unknown as Stripe.LatestApiVersion,
});

export default async function Confirmation({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  if (!sessionId) return null;

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const { date, serviceId, code } = session.metadata || {};

  return (
    <main className="min-h-screen flex items-center justify-center bg-[url('/textures/chalk-black.png')] bg-repeat text-silver-light p-8">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-silver-dark/30 bg-charcoal/70 p-8 text-center">
        <Image
          src="/logos/BodegaDanesHomeSymbol.png"
          alt="Bodega Danes"
          width={70}
          height={70}
          className="mx-auto"
        />
        <h1 className="font-header text-3xl">Booking Confirmed!</h1>
        <p className="text-lg font-bold">{serviceId}</p>
        <p>{date}</p>
        <p className="text-2xl font-mono">{code}</p>
        <p className="opacity-70">
          An e‑mail receipt has been sent. We’ll reach out 48 h before your
          event with final details.
        </p>
      </div>
    </main>
  );
}
