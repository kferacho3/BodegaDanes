import type { Booking } from '@prisma/client';
import { format } from 'date-fns';
import Link from 'next/link';

export default function EventsTable({ rows }: { rows: Booking[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-black/40">
          <tr>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Service</th>
            <th className="p-2 text-left">Customer</th>
            <th className="p-2 text-left" />
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id} className="odd:bg-white/5">
              <td className="p-2">
                {b.date ? format(b.date, 'yyyy-MM-dd') : '—'}
              </td>
              <td className="p-2">{b.serviceId ?? '—'}</td>
              <td className="p-2">{b.customerEmail ?? '—'}</td>
              <td className="p-2 text-right">
                <Link
                  href={`/admin/events/${b.id}`}
                  className="rounded-full bg-neptune px-3 py-1 text-xs font-bold"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
