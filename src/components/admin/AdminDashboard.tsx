'use client';

import type { Availability, Booking } from '@/generated/prisma';
import { useState } from 'react';
import AvailabilityAdmin from './AvailabilityAdmin';
import BookingsTable from './BookingsTable';

interface Props {
  serverAvailability: Availability[];
  serverBookings: Booking[];
}

export default function AdminDashboard({ serverAvailability, serverBookings }: Props) {
  const [tab, setTab] = useState<'availability' | 'bookings'>('availability');

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <h1 className="text-4xl font-header text-center">Bodega Danes Admin</h1>

      {/* Tabs */}
      <nav className="flex justify-center space-x-4">
        <button
          className={`px-4 py-2 font-medium rounded-t-lg ${
            tab === 'availability'
              ? 'bg-chalk-red text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setTab('availability')}
        >
          Availability
        </button>
        <button
          className={`px-4 py-2 font-medium rounded-t-lg ${
            tab === 'bookings'
              ? 'bg-chalk-red text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setTab('bookings')}
        >
          Bookings
        </button>
      </nav>

      {/* Content */}
      <div className="bg-white rounded-b-lg shadow p-4">
        {tab === 'availability' ? (
          <AvailabilityAdmin initialData={serverAvailability} />
        ) : (
          <BookingsTable bookings={serverBookings} />
        )}
      </div>
    </div>
  );
}
