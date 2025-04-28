import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
// Assuming Service type is defined in BookingWizard.tsx and exported
import type { Service } from '../../book/bookingForm/BookingWizard'; // Adjust the import path if necessary


/* single-row PUT validation schema ----------------------------------- */
const Single = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['OPEN', 'OFF', 'BOOKED']),
  // Add services to the validation schema, but keep it optional and nullable
  services: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    full: z.number(),
    image: z.string(),
    blurb: z.string(),
    slots: z.number(),
  })).nullable().optional(), // services field can be null or undefined
});

/* GET - Fetch availability with services --------------------------- */
export async function GET() {
  try {
    const rows = await prisma.availability.findMany({
      select: { date: true, status: true, services: true }, // Select the services field
      orderBy: { date: 'asc' },
    });

    // Map the results to format the date and cast the services JSON value
    const formattedRows = rows.map(row => {
      // Prisma returns Json? as Prisma.JsonValue | null
      // We cast it to Service[] | null which is what the frontend expects
      const services = row.services as Service[] | null;

      return {
        ...row,
        date: row.date.toISOString().split('T')[0], // Format Date to YYYY-MM-DD string
        services: services // Use the correctly typed services
      };
    });

    return NextResponse.json(formattedRows);
  } catch (error) {
    console.error("Error fetching availability:", error);
    // Provide a more informative error response
    return NextResponse.json({ error: 'Failed to fetch availability', details: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}

/* PUT - Update availability (status only, based on admin UI) -------- */
// This handler currently only updates date and status, ignoring incoming services data
// based on the assumption that the admin UI only manages status.
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];

    // Validate only the date and status fields from the incoming items
    const validationResult = z.array(Single.pick({ date: true, status: true })).safeParse(items);

    if (!validationResult.success) {
        // Handle validation errors
        return NextResponse.json({ error: 'Invalid request body', details: validationResult.error.errors }, { status: 400 });
    }

    // Use the validated data
    const validatedItems = validationResult.data;


    await prisma.$transaction(
      validatedItems.map(({ date, status }) =>
        prisma.availability.upsert({
          where: { date: new Date(`${date}T00:00:00.000Z`) },
          update: { status },
          create: { date: new Date(`${date}T00:00:00.000Z`), status },
          // Note: This upsert does NOT update or set the 'services' field
          // based on the current logic and admin UI. If you need to update
          // services from the admin, the PUT body validation and upsert
          // logic would need to be modified.
        }),
      ),
    );

    return NextResponse.json({ ok: true, count: validatedItems.length });
  } catch (error) {
    console.error("Error updating availability:", error);
     // Provide a more informative error response
    return NextResponse.json({ error: 'Failed to update availability', details: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}

/* DELETE - Clear all availability ---------------------------------- */
export async function DELETE() {
  try {
    await prisma.availability.deleteMany();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error clearing availability:", error);
     // Provide a more informative error response
    return NextResponse.json({ error: 'Failed to clear availability', details: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}