import AvailabilityAdmin from '@/components/admin/AvailabilityAdmin';
import type { Booking } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const ses = (await cookies()).get('bd_admin')?.value;
  if (ses !== 'true') redirect('/404');        // should never hit thanks to middleware

  const [bookings, availabilityRows] = await Promise.all([
    prisma.booking.findMany({ orderBy: { date: 'asc' } }),
    prisma.availability.findMany({ select: { date: true, status: true } }),
  ]);

  return (
    <main className="mx-auto max-w-4xl space-y-10 p-4">
      <h1 className="font-header text-3xl">Bodega&nbsp;Danes&nbsp;Admin</h1>

      <section>
        <h2 className="mb-2 font-header text-xl">Set&nbsp;Availability</h2>
        <AvailabilityAdmin initialData={availabilityRows} />
      </section>

      <section>
        <h2 className="mb-2 font-header text-xl">Confirmed&nbsp;Events</h2>
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-black/40">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Service</th>
                <th className="p-2 text-left">Stripe&nbsp;ID</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: Booking) => (
                <tr key={b.id} className="odd:bg-white/5">
                  <td className="p-2">{format(b.date, 'yyyy-MM-dd')}</td>
                  <td className="p-2">{b.serviceId}</td>
                  <td className="p-2">{b.stripeId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
