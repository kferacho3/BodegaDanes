'use client';

import type { Booking } from '@/generated/prisma';
import { format } from 'date-fns';

interface Props { bookings: Booking[] }

export default function BookingsTable({ bookings }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-200">
          <tr>
            {['Date','Service','Stripe ID'].map((h) => (
              <th key={h} className="p-2 text-left font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="odd:bg-gray-50">
              <td className="p-2">{format(b.date, 'yyyy‑MM‑dd')}</td>
              <td className="p-2">{b.serviceId}</td>
              <td className="p-2">{b.stripeId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
