import EventDetails from '@/components/admin/EventDetails';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

// --- local type for the route params ---------------------------------------
interface RouteParams {
  id: string;
}

/**
 * Dynamic event‑detail page
 * ────────────────────────
 *  • `params.id` always arrives as a string from Next.js.
 *  • Cast to `number` **only** if your Prisma `booking.id` column is an `Int`.
 *    Otherwise use the raw string.
 */
export default async function EventDetailPage({
  params,
}: {
  params: RouteParams;
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(params.id) }, // ← change to `params.id` if the column is a string
  });

  if (!booking) {
    notFound();
  }

  return <EventDetails booking={booking} />;
}
