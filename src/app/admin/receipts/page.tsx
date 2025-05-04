import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
  });
export default async function ReceiptsPage() {
  // load recent charges directly from Stripe
  const { data: charges } = await stripe.charges.list({ limit: 50 });

  // upsert into local Receipt table (optional but handy)
  await Promise.all(
    charges.map((c) =>
      prisma.receipt.upsert({
        where: { stripeId: c.id },
        create: {
          stripeId: c.id,
          amount: c.amount,
          currency: c.currency,
          bookingId: 0, // TODO: link via metadata.confirmationCode if you store it
        },
        update: { amount: c.amount },
      })
    )
  );

  return (
    <>
      <h2 className="mb-4 font-header text-2xl">Receipts (Stripe)</h2>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-black/40">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Charge ID</th>
            </tr>
          </thead>
          <tbody>
            {charges.map((c) => (
              <tr key={c.id} className="odd:bg-white/5">
                <td className="p-2">
                  {format(c.created * 1000, 'yyyy-MM-dd')}
                </td>
                <td className="p-2">
                  {(c.amount / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: c.currency.toUpperCase(),
                  })}
                </td>
                <td className="p-2">{c.billing_details.email ?? '—'}</td>
                <td className="p-2">{c.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
