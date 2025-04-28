/*  app/api/booking/route.ts
    ---------------------------------------------------------------
    • Called by the wizard *before* the Stripe redirect.
    • Locks the date (status → BOOKED) and stores a unique
      confirmation-code so the webhook can safely “upsert” later.
------------------------------------------------------------------ */

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Prisma, PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const prisma = new PrismaClient();

/* ---------- payload expected from the wizard ---------- */
const Body = z.object({
  date     : z.string().regex(/^\d{4}-\d{2}-\d{2}$/),   // YYYY-MM-DD
  serviceId: z.string(),
  meta     : z.record(z.unknown()),
});

export async function POST(req: Request) {
  /* 1 ▸ validate -------------------------------------------------------- */
  const { date, serviceId, meta } = Body.parse(await req.json());

  /* 2 ▸ helper values --------------------------------------------------- */
  const day              = new Date(`${date}T00:00:00.000Z`); // UTC midnight
  const confirmationCode = nanoid(6).toUpperCase();           // e.g. “F3K2P9”

  /* If user is signed-in, `id` lives on the session’s user object.
     We cast to surface it because next-auth doesn’t type custom fields. */
  const session       = await getServerSession(authOptions);
  const customerId    = (session?.user as { id?: string })?.id;

  /* meta.email comes from the RHF form (optional) */
  const emailInMeta   = (meta as { email?: unknown }).email;
  const customerEmail = typeof emailInMeta === 'string' ? emailInMeta : undefined;

  /* 3 ▸ single transaction --------------------------------------------- */
  await prisma.$transaction([
    /* 3-A  lock the calendar slot */
    prisma.availability.upsert({
      where : { date: day },
      update: { status: 'BOOKED' },
      create: { date: day, status: 'BOOKED' },
    }),

    /* 3-B  provisional booking row
       — optional keys only added when they contain a string — */
    prisma.booking.create({
      data: {
        date            : day,                       // DateTime
        serviceId,
        confirmationCode,
        meta            : meta as Prisma.InputJsonValue,
        ...(customerId    && { customerId }),        // String?
        ...(customerEmail && { customerEmail }),     // String?
      },
    }),
  ]);

  /* 4 ▸ return code so the wizard can push it into Stripe metadata */
  return NextResponse.json({ ok: true, confirmationCode });
}
