import EventsTable from '@/components/admin/EventsTable';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const rows = await prisma.booking.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
  });

  return (
    <>
      <h2 className="mb-4 font-header text-2xl">Upcoming Events</h2>
      <EventsTable rows={rows} />
    </>
  );
}
