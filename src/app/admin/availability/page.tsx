import AvailabilityCalendar from '@/components/admin/AvailabilityCalendar';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export default async function AvailabilityPage() {
  const rows = await prisma.availability.findMany({
    orderBy: { date: 'asc' },
    select: { date: true, status: true },
  });

  async function save(data: typeof rows) {
    'use server';
    await prisma.$transaction([
      prisma.availability.deleteMany(),
      prisma.availability.createMany({ data }),
    ]);
    revalidatePath('/admin/availability');
  }

  return (
    <section className="space-y-6">
      <h2 className="font-header text-2xl">Set&nbsp;Availability</h2>

      {/* ───────── legend bar ───────── */}
    
<div className="flex flex-wrap gap-4 text-sm">
  {[
    ['bg-avail-open',   'Available (OPEN)'],
    ['bg-avail-future', 'Booked – upcoming'],
    ['bg-avail-past',   'Booked – past'],
    ['bg-avail-off',    'Unavailable (OFF)'],
  ].map(([clr, label]) => (
    <div key={label} className="flex items-center gap-2">
      <span className={`h-4 w-4 rounded ${clr as string}`} />
      <span className="font-header">{label}</span>
    </div>
  ))}
</div>



      <AvailabilityCalendar events={rows} onSave={save} />
    </section>
  );
}
