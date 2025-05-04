import EventDetails from '@/components/admin/EventDetails';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(params.id) }, // or just `params.id` if your Prisma ID is a string
  });

  if (!booking) notFound();

  return <EventDetails booking={booking} />;
}
