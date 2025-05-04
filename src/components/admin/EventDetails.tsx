import type { Booking } from '@prisma/client';
import { format } from 'date-fns';

export default function EventDetails({ booking }: { booking: Booking }) {
  const meta = (booking.meta ?? {}) as Record<string, unknown>;
  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-black/40 p-6">
      <h2 className="font-header text-2xl">Event #{booking.id}</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <p><b>Date:</b> {format(booking.date, 'yyyy-MM-dd')}</p>
        <p><b>Service ID:</b> {booking.serviceId}</p>
        <p><b>Customer Email:</b> {booking.customerEmail ?? '—'}</p>
        <p><b>Confirmation Code:</b> {booking.confirmationCode}</p>
      </div>

      <hr className="my-4 border-white/10" />

      <h3 className="font-header text-xl">Event Questionnaire</h3>
      <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed">
        {JSON.stringify(meta, null, 2)}
      </pre>
    </div>
  );
}
