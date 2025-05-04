import EventsTable from '@/components/admin/EventsTable';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function PastEventsPage() {
  const rows = await prisma.booking.findMany({
    where: { date: { lt: new Date() } },
    orderBy: { date: 'desc' },
  });

  return (
    <>
      <h2 className="mb-4 font-header text-2xl">Past Events</h2>
      <EventsTable rows={rows} />
    </>
  );
}
