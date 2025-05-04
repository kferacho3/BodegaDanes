import EventDetails from '@/components/admin/EventDetails';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EventDetail({ params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(params.id) },
  });
  if (!booking) notFound();

  return <EventDetails booking={booking} />;
}
