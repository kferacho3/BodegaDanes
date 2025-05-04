// src/app/admin/events/[id]/page.tsx
import EventDetails from '@/components/admin/EventDetails';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(params.id) },
  });

  if (!booking) notFound();

  return <EventDetails booking={booking} />;
}
