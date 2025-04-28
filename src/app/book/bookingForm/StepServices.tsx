/* app/book/bookingForm/StepServices.tsx
   – list-row services + full event questionnaire                        */
   'use client';

   import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { Availability, Service } from './BookingWizard';
   
   /* ---------- helper: pop-up for service blurbs ---------- */
   function InfoButton({ blurb }: { blurb: string }) {
     const [open, setOpen] = useState(false);
     return (
       <>
         <button
           aria-label="Read more"
           onClick={() => setOpen(true)}
           className="absolute top-3 right-3 rounded-full bg-black/40 p-1 text-silver-light hover:bg-black/70"
         >
           <InformationCircleIcon className="h-5 w-5" />
         </button>
   
         {open && (
           <div onClick={() => setOpen(false)} className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">
             <div
               onClick={e => e.stopPropagation()}
               className="w-full max-w-md space-y-4 rounded-xl bg-charcoal/90 p-6 text-silver-light shadow-2xl"
             >
               <h3 className="font-header text-xl">Service details</h3>
               <p className="whitespace-pre-line">{blurb}</p>
               <button onClick={() => setOpen(false)} className="w-full rounded-full bg-chalk-red py-2">Close</button>
             </div>
           </div>
         )}
       </>
     );
   }
   
   /* ---------- main component ---------- */
   interface Props {
     availability    : Availability[];
     selectedDate    : string | undefined;
     selectedService : string | undefined;
     globalServices  : Service[];
     loadError       : string | null;
     onBack          : () => void;
     onNext          : () => void;
   }
   
   export default function StepServices({
     availability,
     selectedDate,
     selectedService,
     globalServices,
     loadError,
     onBack,
     onNext,
   }: Props) {
     const { register } = useFormContext();
   
     /* ------ resolve date status & services list ------ */
     const { status, services } = useMemo(() => {
       if (!selectedDate) return { status: 'OFF' as const, services: [] as Service[] };
   
       const row   = availability.find(a => a.date === selectedDate);
       const state = (row?.status ?? 'OPEN') as Availability['status'];
       const list  = state === 'OPEN' ? (row?.services?.length ? row.services : globalServices) : [];
   
       return { status: state, services: list };
     }, [availability, selectedDate, globalServices]);
   
     /* ------ group identical names together ------ */
     const grouped = useMemo(() => {
       return services.reduce((acc, s) => {
         const g = acc.find(x => x.name === s.name);
         if (g) g.tiers.push(s);
         else acc.push({ name: s.name, image: s.image, blurb: s.blurb, tiers: [s] });
         return acc;
       }, [] as { name: string; image: string; blurb: string; tiers: Service[] }[]);
     }, [services]);
   
     /* ------ banner logic ------ */
     let banner: string | null = loadError;
     if (!banner) {
       if (!selectedDate)            banner = 'Please select a date first.';
       else if (status === 'BOOKED') banner = 'Selected date is already booked — please pick another day.';
       else if (status !== 'OPEN')   banner = 'No services available on the selected date — please pick another day.';
       else if (!services.length)    banner = 'No services found for this date.';
     }
   
     /* ------------- render ------------- */
     return (
       <section className="space-y-12">
         <h2 className="text-center font-header text-2xl">
           2&nbsp;·&nbsp;Select Service&nbsp;&amp;&nbsp;Describe Event
         </h2>
   
         {/* ---------- services list ---------- */}
         {banner ? (
           <p className="text-center italic opacity-70">{banner}</p>
         ) : (
           <ul className="space-y-6">
             {grouped.map(g => (
               <li key={g.name} className="flex flex-col gap-4 rounded-lg border border-white/10 bg-black/40 p-4 shadow-inner sm:flex-row">
                 {/* image */}
                 <div className="sm:w-40 flex-shrink-0 self-center">
                   <Image
                     src={g.image}
                     alt={g.name}
                     width={160}
                     height={160}
                     className="h-40 w-auto rounded-md object-contain"
                   />
                 </div>
   
                 {/* copy + tiers */}
                 <div className="flex flex-1 flex-col">
                   <div className="relative">
                     <h3 className="font-header text-xl">{g.name}</h3>
                     <InfoButton blurb={g.blurb} />
                   </div>
                   <p className="mt-1 text-sm opacity-80">{g.blurb}</p>
   
                   <div className="mt-4 flex flex-wrap gap-2">
                     {g.tiers.map(t => (
                       <label
                         key={t.id}
                         className={`flex items-center gap-2 rounded-lg border px-3 py-1 text-sm font-header transition ${
                           selectedService === t.id
                             ? 'border-chalk-red bg-chalk-red/20'
                             : 'border-transparent bg-silver-light/10 hover:bg-silver-light/20'
                         }`}
                       >
                         <input
                           type="radio"
                           value={t.id}
                           {...register('serviceId', { required: true })}
                           className="sr-only"
                         />
                         {(t.price / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                         {selectedService === t.id && <CheckCircleIcon className="h-4 w-4 text-chalk-red" />}
                       </label>
                     ))}
                   </div>
                 </div>
               </li>
             ))}
           </ul>
         )}
   
         {/* ---------- event questionnaire ---------- */}
         <div className="space-y-8">
           {/* — LOGISTICS — */}
           <fieldset className="space-y-4 rounded-lg border border-white/10 p-4">
             <legend className="font-header px-2">Essential Event Logistics</legend>
   
             <div className="grid gap-4 sm:grid-cols-2">
               <label>
                 <span className="block font-header">Event Start Time <small className="opacity-70">(HH:MM)</small></span>
                 <input
                   type="time"
                   {...register('eventStartTime', { required: true })}
                   className="mt-1 w-full rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 />
               </label>
   
               <label>
                 <span className="block font-header">Event End Time</span>
                 <input
                   type="time"
                   {...register('eventEndTime', { required: true })}
                   className="mt-1 w-full rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 />
               </label>
   
               <label>
                 <span className="block font-header">Estimated Guest Count</span>
                 <input
                   type="number"
                   min={1}
                   {...register('guestCount', { required: true })}
                   className="mt-1 w-full rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                   placeholder="e.g. 150"
                 />
               </label>
   
               <label>
                 <span className="block font-header">Main Age Demographic <small className="opacity-70">(optional)</small></span>
                 <input
                   type="text"
                   {...register('ageDemographics')}
                   className="mt-1 w-full rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                   placeholder="Kids, teens, adults 25-40…"
                 />
               </label>
             </div>
   
             <label className="block">
               <span className="block font-header">Venue Contact / On-site Coordinator</span>
               <input
                 type="text"
                 {...register('venueContact', { required: true })}
                 className="mt-1 w-full rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 placeholder="Name, phone & email"
               />
             </label>
   
             <label className="block">
               <span className="block font-header">Kitchen Facilities Available</span>
               <textarea
                 rows={2}
                 {...register('kitchenFacilities')}
                 className="mt-1 w-full resize-y rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 placeholder="Ovens, burners, fridge space, prep tables…"
               />
             </label>
   
             <label className="block">
               <span className="block font-header">Setup / Teardown Restrictions</span>
               <textarea
                 rows={2}
                 {...register('setupRestrictions')}
                 className="mt-1 w-full resize-y rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 placeholder="Earliest access time, must clear by midnight…"
               />
             </label>
           </fieldset>
   
           {/* — FOOD & SERVICE PREFERENCES — */}
           <fieldset className="space-y-4 rounded-lg border border-white/10 p-4">
             <legend className="font-header px-2">Food &amp; Service Preferences</legend>
   
             <label className="block">
               <span className="block font-header">Cuisine Styles</span>
               <input
                 type="text"
                 {...register('cuisineStyles')}
                 className="mt-1 w-full rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 placeholder="Italian, BBQ, Asian-fusion…"
               />
             </label>
   
             <label className="block">
               <span className="block font-header">Meal Type</span>
               <select
                 {...register('mealType')}
                 className="mt-1 w-full rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
               >
                 <option value="">Select…</option>
                 <option>Passed Appetizers</option>
                 <option>Buffet</option>
                 <option>Plated Dinner</option>
                 <option>Food Stations</option>
                 <option>Family Style</option>
               </select>
             </label>
   
             <label className="block">
               <span className="block font-header">Menu Preferences / Ideas</span>
               <textarea
                 rows={2}
                 {...register('menuIdeas')}
                 className="mt-1 w-full resize-y rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 placeholder="Favourite dishes, seasonal focus, local ingredients…"
               />
             </label>
   
             <label className="block">
               <span className="block font-header">Dietary Restrictions &amp; Allergies</span>
               <textarea
                 rows={2}
                 {...register('dietaryRestrictions')}
                 className="mt-1 w-full resize-y rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 placeholder="e.g. 5 vegetarian, 2 gluten-free; no peanuts"
               />
             </label>
   
             <label className="block">
               <span className="block font-header">Beverage Service Needs</span>
               <textarea
                 rows={2}
                 {...register('beverageNeeds')}
                 className="mt-1 w-full resize-y rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 placeholder="Full bar, beer & wine only, signature mocktails…"
               />
             </label>
   
             <label className="block">
               <span className="block font-header">Service Style Details</span>
               <textarea
                 rows={2}
                 {...register('serviceStyleDetails')}
                 className="mt-1 w-full resize-y rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 placeholder="3-course plated with salad, entrée, dessert…"
               />
             </label>
   
             <label className="block">
               <span className="block font-header">Desired Staffing Level</span>
               <input
                 type="text"
                 {...register('staffingLevel')}
                 className="mt-1 w-full rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 placeholder="e.g. 1 server per 15 guests, 2 bartenders"
               />
             </label>
           </fieldset>
   
           {/* — BUDGET & CONTRACT — */}
           <fieldset className="space-y-4 rounded-lg border border-white/10 p-4">
             <legend className="font-header px-2">Budget &amp; Billing</legend>
   
             <div className="grid gap-4 sm:grid-cols-2">
               <label>
                 <span className="block font-header">Budget Range (approx.)</span>
                 <input
                   type="text"
                   {...register('budgetRange')}
                   className="mt-1 w-full rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                   placeholder="$5 000 – $7 500"
                 />
               </label>
   
               <label>
                 <span className="block font-header">Billing Contact</span>
                 <input
                   type="text"
                   {...register('billingContact')}
                   className="mt-1 w-full rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                   placeholder="Name / email for invoices"
                 />
               </label>
             </div>
   
             <label className="block">
               <span className="block font-header">Deposit / Payment Schedule</span>
               <textarea
                 rows={2}
                 {...register('paymentSchedule')}
                 className="mt-1 w-full resize-y rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 placeholder="50 % on booking, balance 1 week before event…"
               />
             </label>
           </fieldset>
   
           {/* — OTHER — */}
           <fieldset className="space-y-4 rounded-lg border border-white/10 p-4">
             <legend className="font-header px-2">Other Useful Information</legend>
   
             <label className="block">
               <span className="block font-header">Event Flow / Timeline Highlights</span>
               <textarea
                 rows={2}
                 {...register('eventTimeline')}
                 className="mt-1 w-full resize-y rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 placeholder="Guests arrive 5 pm, cocktail hour 5:30 – 6:30…"
               />
             </label>
   
             <label className="block">
               <span className="block font-header">Cultural / Religious Considerations</span>
               <textarea
                 rows={2}
                 {...register('culturalConsiderations')}
                 className="mt-1 w-full resize-y rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 placeholder="Halal, Kosher, vegetarian Friday…"
               />
             </label>
   
             <label className="block">
               <span className="block font-header">Equipment Rental Needs</span>
               <textarea
                 rows={2}
                 {...register('equipmentNeeds')}
                 className="mt-1 w-full resize-y rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 placeholder="8-top rounds, linen colour, chafers…"
               />
             </label>
   
             <label className="block">
               <span className="block font-header">Waste Disposal Plan</span>
               <textarea
                 rows={2}
                 {...register('wastePlan')}
                 className="mt-1 w-full resize-y rounded-md bg-silver-light/10 p-2 text-sm outline-none focus:ring-2 focus:ring-chalk-red"
                 placeholder="Venue dumpster access, compost bins, haul-away…"
               />
             </label>
           </fieldset>
         </div>
   
         {/* ---------- nav ---------- */}
         <div className="flex justify-between pt-8">
           <button onClick={onBack} type="button" className="rounded-full bg-silver-dark px-6 py-2">
             Back
           </button>
           <button
             onClick={onNext}
             type="button"
             disabled={!selectedService}
             className="rounded-full bg-chalk-red px-6 py-2 disabled:opacity-40"
           >
             Next
           </button>
         </div>
       </section>
     );
   }
   