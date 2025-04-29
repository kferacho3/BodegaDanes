// src/app/my-events/[code]/page.tsx
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'

/** 
 * Next.js 15 now passes `params` and `searchParams` as Promises.
 * We declare them as such, then `await` them inside the component. 
 */
interface Props {
  params: Promise<{ code: string }>
  searchParams: Promise<{ id?: string }>
}

export default async function Page({ params, searchParams }: Props) {
  // 1️⃣ Resolve the incoming async params
  const { code } = await params
  const { id }   = await searchParams

  if (!id) notFound()

  // 2️⃣ Load & guard
  const booking = await prisma.booking.findFirst({
    where: {
      confirmationCode: code,
      OR: [
        { customerEmail: id },
        { customerId:    id },
      ],
    },
  })
  if (!booking) notFound()

  // 3️⃣ Normalize JSON meta into typed locals
  const metaObj = (booking.meta ?? {}) as Record<string, unknown>
  const themeValue    = typeof metaObj.theme    === 'string' ? metaObj.theme    : ''
  const timeValue     = typeof metaObj.time     === 'string' ? metaObj.time     : ''
  const locationValue = typeof metaObj.location === 'string' ? metaObj.location : ''
  const guestsValue   = typeof metaObj.guests   === 'number' ? metaObj.guests   : 0
  const notesValue    = typeof metaObj.notes    === 'string' ? metaObj.notes    : ''

  // 4️⃣ Server action to PATCH updates & revalidate
  async function updateBooking(formData: FormData) {
    'use server'
    const theme    = formData.get('theme')    as string
    const time     = formData.get('time')     as string
    const location = formData.get('location') as string
    const guests   = Number(formData.get('guests'))
    const notes    = formData.get('notes')    as string

    await prisma.booking.update({
      where: { confirmationCode: code },
      data: {
        meta: {
          ...metaObj,
          theme,
          time,
          location,
          guests,
          notes,
        },
      },
    })

    // re-render this page with fresh data
    revalidatePath(`/my-events/${code}`)
  }

  return (
    <main className="mx-auto max-w-lg py-12 space-y-6 text-silver-light">
      <h1 className="text-center font-header text-3xl">Your Event</h1>

      {/* Read‐only details */}
      <p><strong>Date:</strong>          {booking.date.toISOString().slice(0, 10)}</p>
      <p><strong>Service:</strong>       {booking.serviceId}</p>
      <p><strong>Confirmation #:</strong> {booking.confirmationCode}</p>

      {/* ✏️ Editable form */}
      <form action={updateBooking} className="space-y-4 bg-charcoal/50 p-6 rounded">
        <h2 className="font-header text-xl">Edit Your Details</h2>

        <label className="block">
          <span className="font-medium">Theme</span>
          <input
            name="theme"
            defaultValue={themeValue}
            className="mt-1 w-full rounded bg-black/30 p-2"
          />
        </label>

        <label className="block">
          <span className="font-medium">Time</span>
          <input
            type="time"
            name="time"
            defaultValue={timeValue}
            className="mt-1 w-full rounded bg-black/30 p-2"
          />
        </label>

        <label className="block">
          <span className="font-medium">Location</span>
          <input
            name="location"
            defaultValue={locationValue}
            className="mt-1 w-full rounded bg-black/30 p-2"
          />
        </label>

        <label className="block">
          <span className="font-medium">Guests</span>
          <input
            type="number"
            name="guests"
            defaultValue={String(guestsValue)}
            className="mt-1 w-full rounded bg-black/30 p-2"
          />
        </label>

        <label className="block">
          <span className="font-medium">Notes</span>
          <textarea
            name="notes"
            defaultValue={notesValue}
            className="mt-1 w-full rounded bg-black/30 p-2"
            rows={3}
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-full bg-chalk-red py-2 text-white"
        >
          Save Changes
        </button>
      </form>
    </main>
  )
}
