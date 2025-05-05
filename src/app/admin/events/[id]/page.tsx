// src/app/admin/events/[id]/page.tsx
import EventDetails from '@/components/admin/EventDetails';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;   // ← correct annotation
}) {
  const { id } = await params;       // unpack the promise

  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },       // drop Number(...) if your PK is string
  });

  if (!booking) notFound();

  return <EventDetails booking={booking} />;
}
