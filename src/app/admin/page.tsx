import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AvailabilityAdmin from '@/components/admin/AvailabilityAdmin';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import type { Service } from '@/app/book/bookingForm/BookingWizard'; // for casting

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/auth/signin');

  /* ─ fetch ─ */
  const [rawRows, bookings] = await Promise.all([
    prisma.availability.findMany({
      select : { date:true, status:true, services:true },
      orderBy: { date:'asc' },
    }),
    prisma.booking.findMany({ orderBy:{ date:'asc' } }),
  ]);

  /* ─ normalise: Date → string, JsonValue → Service[] | undefined ─ */
  const rows = rawRows.map(r => ({
    date    : r.date.toISOString().split('T')[0],      // string
    status  : r.status,
    services: Array.isArray(r.services) ? (r.services as Service[]) : undefined,
  }));

  /* ─ render ─ */
  return (
    <main className="mx-auto max-w-5xl space-y-10 p-6">
      <h1 className="font-header text-3xl">Bodega Danes Admin</h1>

      <section>
        <h2 className="mb-2 font-header text-xl">Set Availability</h2>
        <AvailabilityAdmin initialData={rows} />
      </section>

      <section>
        <h2 className="mb-2 font-header text-xl">Confirmed Events</h2>
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-black/40">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Service</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="odd:bg-white/5">
                  <td className="p-2">{format(b.date, 'yyyy-MM-dd')}</td>
                  <td className="p-2">{b.serviceId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
