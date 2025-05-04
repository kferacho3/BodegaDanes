import WidgetCard from '@/components/admin/WidgetCard';
import { prisma } from '@/lib/prisma';
import { Calendar, Clock, Inbox, List, Receipt } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const [confirmed, messages, past, receipts] = await Promise.all([
    prisma.booking.count({
      where: { date: { gte: new Date() } },
    }),
    prisma.message.count({ where: { replied: false } }),
    prisma.booking.count({
      where: { date: { lt: new Date() } },
    }),
    prisma.receipt.count(),
  ]);

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <WidgetCard
        title="Set Availability"
        icon={<Calendar />}
        href="/admin/availability"
      />
      <WidgetCard
        title="Confirmed Events"
        count={confirmed}
        icon={<List />}
        href="/admin/events"
      />
      <WidgetCard
        title="Messages"
        count={messages}
        icon={<Inbox />}
        href="/admin/messages"
      />
      <WidgetCard
        title="Past Events"
        count={past}
        icon={<Clock />}
        href="/admin/past-events"
      />
      <WidgetCard
        title="Receipts"
        count={receipts}
        icon={<Receipt />}
        href="/admin/receipts"
      />
    </section>
  );
}
