// src/app/api/booking/route.ts
/*  
  Locks the slot and stores a provisional booking before Stripe checkout
*/
import { authOptions } from '@/lib/authOptions'
import { Prisma, PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const prisma = new PrismaClient()

const Body = z.object({
  date     : z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceId: z.string(),
  meta     : z.record(z.unknown()),
})

export async function POST(req: Request) {
  // 1 · validate
  const { date, serviceId, meta } = Body.parse(await req.json())

  // 2 · helpers
  const day              = new Date(`${date}T00:00:00.000Z`)
  const confirmationCode = nanoid(6).toUpperCase()

  // getSession with the correct import
  const session       = await getServerSession(authOptions)
  const customerId    = (session?.user as { id?: string })?.id ?? null

  const rawEmail      = (meta as { email?: unknown }).email
  const customerEmail = typeof rawEmail === 'string' ? rawEmail : null

  // 3 · transaction
  await prisma.$transaction([
    prisma.availability.upsert({
      where : { date: day },
      update: { status: 'BOOKED' },
      create: { date: day, status: 'BOOKED' },
    }),
    prisma.booking.create({
      data: {
        date,
        serviceId,
        confirmationCode,
        meta            : meta as Prisma.InputJsonValue,
        customerId,     // string | null
        customerEmail,  // string | null
      },
    }),
  ])

  // 4 · respond
  return NextResponse.json({ ok: true, confirmationCode })
}
