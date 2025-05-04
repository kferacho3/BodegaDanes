/* app/book/bookingForm/StepSelectService.tsx */
'use client';

import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { Availability, Service } from './BookingWizard';

/* ---------- helper: pop‑up for service blurbs ---------- */
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
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-xl bg-charcoal/90 p-6 text-silver-light shadow-2xl"
          >
            <h3 className="font-header text-xl">Service Details</h3>
            <p className="whitespace-pre-line">{blurb}</p>
            <button
              onClick={() => setOpen(false)}
              className="w-full rounded-full bg-chalk-red py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- props ---------- */
interface Props {
  availability: Availability[];
  selectedDate: string | undefined;
  selectedService: string | undefined;
  globalServices: Service[];
  loadError: string | null;
  onBack: () => void;
  onNext: () => void;
}

/* ---------- component ---------- */
export default function StepSelectService({
  availability,
  selectedDate,
  selectedService,
  globalServices,
  loadError,
  onBack,
  onNext,
}: Props) {
  const { register } = useFormContext();

  /* resolve date status & services list */
  const { status, services } = useMemo(() => {
    if (!selectedDate) return { status: 'OFF' as const, services: [] as Service[] };

    const row = availability.find((a) => a.date === selectedDate);
    const state = (row?.status ?? 'OPEN') as Availability['status'];
    const list = state === 'OPEN' ? (row?.services?.length ? row.services : globalServices) : [];

    return { status: state, services: list };
  }, [availability, selectedDate, globalServices]);

  /* group identical names together */
  const grouped = useMemo(() => {
    return services.reduce((acc, s) => {
      const g = acc.find((x) => x.name === s.name);
      if (g) g.tiers.push(s);
      else acc.push({ name: s.name, image: s.image, blurb: s.blurb, tiers: [s] });
      return acc;
    }, [] as { name: string; image: string; blurb: string; tiers: Service[] }[]);
  }, [services]);

  /* banner logic */
  let banner: string | null = loadError;
  if (!banner) {
    if (!selectedDate) banner = 'Please select a date first.';
    else if (status === 'BOOKED') banner = 'Selected date is already booked — please pick another day.';
    else if (status !== 'OPEN') banner = 'No services available on the selected date — please pick another day.';
    else if (!services.length) banner = 'No services found for this date.';
  }

  /* render */
  return (
    <section className="space-y-12">
      <h2 className="text-center font-header text-2xl">
        2&nbsp;·&nbsp;Select&nbsp;Service
      </h2>

      {/* services list */}
      {banner ? (
        <p className="text-center italic opacity-70">{banner}</p>
      ) : (
        <ul className="space-y-6">
          {grouped.map((g) => (
            <li
              key={g.name}
              className="flex flex-col gap-4 rounded-lg border border-white/10 bg-black/40 p-4 shadow-inner sm:flex-row"
            >
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
                  {g.tiers.map((t) => (
                    <label
                      key={t.id}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-1 text-sm font-header transition
                        ${
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
                      {(t.price / 100).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                      {selectedService === t.id && (
                        <CheckCircleIcon className="h-4 w-4 text-chalk-red" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* nav */}
      <div className="flex justify-between pt-8">
        <button
          onClick={onBack}
          type="button"
          className="rounded-full bg-silver-dark px-6 py-2"
        >
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
