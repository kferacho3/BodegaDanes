// src/components/admin/AdminDashboard.tsx
'use client'

import type { Booking, Availability as PrismaAvailability } from '@/generated/prisma'
import { useState } from 'react'
import AvailabilityAdmin from './AvailabilityAdmin'
import BookingsTable from './BookingsTable'

// Import the same types your AvailabilityAdmin expects:
import type { Availability as AdminAvailability, Service } from '@/app/book/bookingForm/BookingWizard'

interface Props {
  serverAvailability: PrismaAvailability[]
  serverBookings: Booking[]
}

export default function AdminDashboard({
  serverAvailability,
  serverBookings,
}: Props) {
  const [tab, setTab] = useState<'availability' | 'bookings'>('availability')

  // Map your Prisma rows → the AdminAvailability shape
  const availabilityRows: AdminAvailability[] = serverAvailability.map((a) => ({
    date: a.date.toISOString().slice(0, 10),  // YYYY-MM-DD string
    status: a.status,
    // Cast the JSON blob to Service[]; fall back to empty array if null or not an array
    services: Array.isArray(a.services)
      ? (a.services as Service[])
      : [],
  }))

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <h1 className="text-4xl font-header text-center">Bodega Danes Admin</h1>

      {/* Tabs */}
      <nav className="flex justify-center space-x-4">
        {(['availability', 'bookings'] as const).map((t) => (
          <button
            key={t}
            className={`px-4 py-2 font-medium rounded-t-lg ${
              tab === t
                ? 'bg-chalk-red text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setTab(t)}
          >
            {t === 'availability' ? 'Availability' : 'Bookings'}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="bg-white rounded-b-lg shadow p-4">
        {tab === 'availability' ? (
          <AvailabilityAdmin initialData={availabilityRows} />
        ) : (
          <BookingsTable bookings={serverBookings} />
        )}
      </div>
    </div>
  )
}
