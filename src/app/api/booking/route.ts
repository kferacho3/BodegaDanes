// src/app/api/booking/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const prisma = new PrismaClient()

/* -------------------------------------------------------------
   1 ▸ body validator — nothing here is Prisma-specific
---------------------------------------------------------------- */
const Body = z.object({
  date     : z.string().regex(/^\d{4}-\d{2}-\d{2}$/),   // YYYY-MM-DD
  serviceId: z.string(),
  meta     : z.record(z.unknown()),                    // arbitrary JSON
})

/* -------------------------------------------------------------
   2 ▸ POST handler
---------------------------------------------------------------- */
export async function POST (req: Request) {
  /* 2-A ▸ parse & coerce                                               */
  const { date, serviceId, meta } = Body.parse(await req.json())
  const day = new Date(`${date}T00:00:00.000Z`)        // force UTC midnight

  /* 2-B ▸ run both writes in a single transaction                     */
  await prisma.$transaction([
    prisma.availability.upsert({
      where : { date: day },
      update: { status: 'BOOKED' },
      create: { date: day, status: 'BOOKED' },
    }),

    prisma.booking.create({
      // ←↓↓ NO manual annotation needed; Prisma’s generated type
      //      already contains `meta?: Prisma.JsonValue | null`
      data: { date: day, serviceId, meta },
    }),
  ])

  /* 2-C ▸ respond                                                     */
  return NextResponse.json({ ok: true })
}
