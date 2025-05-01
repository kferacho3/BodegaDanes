/* --------------------------------------------------------------------------
   src/app/admin/page.tsx
   -------------------------------------------------------------------------- */
   import AvailabilityAdmin from '@/components/admin/AvailabilityAdmin'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
   
   import type { Service } from '@/app/book/bookingForm/BookingWizard'
   
   export const dynamic = 'force-dynamic'
   
   export default async function AdminPage() {
     const session = await getServerSession(authOptions)
     if (!session || session.user.role !== 'ADMIN') redirect('/auth/signin')
   
     /* ───────────── database ───────────── */
     let rawRows, bookings
     try {
       ;[rawRows, bookings] = await Promise.all([
         prisma.availability.findMany({
           select : { date: true, status: true, services: true },
           orderBy: { date: 'asc' },
         }),
         prisma.booking.findMany({ orderBy: { date: 'asc' } }),
       ])
     } catch (err) {
       console.error('🔥 Prisma query failed in /admin:', err) // NEW
       throw new Error('Unable to query database')              // surfaces nicely
     }
   
     /* ───────────── normalise availability rows ───────────── */
     const rows = rawRows.map((r) => ({
       date    : r.date.toISOString().substring(0, 10),
       status  : r.status,
       services:
         Array.isArray(r.services) && r.services.length
           ? (r.services as Service[])
           : [], // NEW – always return an array
     }))
   
     /* ───────────── filter out bad bookings ───────────── */
     const safeBookings = bookings.filter(
       (b) => b.date instanceof Date && !Number.isNaN(b.date.getTime()) // NEW
     )
   
     /* ───────────── UI ───────────── */
     return (
       <main className="mx-auto max-w-5xl space-y-10 p-6">
         <h1 className="font-header text-3xl">Bodega Danes Admin</h1>
   
         {/* Availability editor */}
         <section>
           <h2 className="mb-2 font-header text-xl">Set Availability</h2>
           <AvailabilityAdmin initialData={rows} />
         </section>
   
         {/* Bookings table */}
         <section>
           <h2 className="mb-2 font-header text-xl">Confirmed Events</h2>
           <div className="overflow-x-auto rounded-lg border border-white/10">
             <table className="w-full text-sm">
               <thead className="bg-black/40">
                 <tr>
                   <th className="p-2 text-left">Date</th>
                   <th className="p-2 text-left">Service</th>
                 </tr>
               </thead>
               <tbody>
                 {safeBookings.map((b) => (
                   <tr key={b.id} className="odd:bg-white/5">
                     <td className="p-2">
                       {b.date ? format(b.date, 'yyyy-MM-dd') : '—'} {/* NEW */}
                     </td>
                     <td className="p-2">{b.serviceId ?? '—'}</td>   {/* NEW */}
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </section>
       </main>
     )
   }
   