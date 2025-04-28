import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

/* single-row PUT --------------------------------------------------- */
const Single = z.object({
  date  : z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['OPEN', 'OFF', 'BOOKED']),
})

export async function GET () {
  const rows = await prisma.availability.findMany({
    select : { date:true, status:true, services:true },
    orderBy: { date:'asc' },
  })
  return NextResponse.json(rows)
}

/*  PUT  (single row OR bulk array)  -------------------------------- */
export async function PUT (req: Request) {
  const body = await req.json()

  const items = Array.isArray(body) ? body : [body]
  items.forEach(item => Single.parse(item))

  await prisma.$transaction(
    items.map(({ date, status }) =>
      prisma.availability.upsert({
        where : { date: new Date(`${date}T00:00:00.000Z`) },
        update: { status },
        create: { date: new Date(`${date}T00:00:00.000Z`), status },
      }),
    ),
  )

  return NextResponse.json({ ok:true, count: items.length })
}

/*  DELETE  – clear all -------------------------------------------- */
export async function DELETE () {
  await prisma.availability.deleteMany()
  return NextResponse.json({ ok:true })
}
