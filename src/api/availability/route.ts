// src/api/availability/route.ts
import type { Availability, AvailabilityStatus } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const rows: Pick<Availability, 'date' | 'status'>[] =
    await prisma.availability.findMany({
      select: { date: true, status: true },
    });

  const map = rows.reduce(
    (
      acc: Record<string, AvailabilityStatus>,
      r: { date: Date; status: AvailabilityStatus }
    ) => {
      acc[r.date.toISOString().slice(0, 10)] = r.status;
      return acc;
    },
    {} as Record<string, AvailabilityStatus>
  );

  return NextResponse.json(map);
}

export async function PUT(req: Request) {
  const { date, status } = (await req.json()) as {
    date: string;
    status: AvailabilityStatus;
  };

  await prisma.availability.upsert({
    where:  { date: new Date(date) },
    update: { status },
    create: { date: new Date(date), status },
  });

  return NextResponse.json({ ok: true });
}
