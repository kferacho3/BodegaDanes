import EventDetails from '@/components/admin/EventDetails';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ReactElement } from 'react';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: { id: string };
}): Promise<ReactElement> {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(params.id) }, // ← or use params.id directly if your ID column is a string
  });

  if (!booking) {
    notFound();
  }

  return <EventDetails booking={booking} />;
}
