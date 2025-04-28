// src/app/book/StepServices.tsx
'use client'

import {
    CheckCircleIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

import type { Availability, Service } from './BookingWizard'

/* ---------- little pop-up ---------- */
function InfoButton({ blurb }: { blurb: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label="Read more"
        className="absolute top-3 right-3 rounded-full bg-black/40 p-1 text-silver-light hover:bg-black/70"
        onClick={() => setOpen(true)}
      >
        <InformationCircleIcon className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md space-y-4 rounded-xl bg-charcoal/90 p-6 text-silver-light shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-header text-xl">Service details</h3>
            <p className="whitespace-pre-line">{blurb}</p>
            <button
              className="w-full rounded-full bg-chalk-red py-2"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

interface Props {
  availability: Availability[]
  selectedDate: string | undefined
  selectedService: string | undefined
  onBack: () => void
  onNext: () => void
}

export default function StepServices({
  availability,
  selectedDate,
  selectedService,
  onBack,
  onNext,
}: Props) {
  const { register } = useFormContext()

  /* ---- collapse services for that date ------------------------ */
  const servicesForDate =
    availability.find((a) => a.date === selectedDate)?.services ?? []

  const grouped = servicesForDate.reduce(
    (acc, s) => {
      const g = acc.find((x) => x.name === s.name)
      if (g) g.tiers.push(s)
      else acc.push({ name: s.name, image: s.image, blurb: s.blurb, tiers: [s] })
      return acc
    },
    [] as { name: string; image: string; blurb: string; tiers: Service[] }[],
  )

  return (
    <section className="space-y-10">
      <h2 className="text-center font-header text-2xl">
        2&nbsp;·&nbsp;Select Service&nbsp;&amp;&nbsp;Describe Event
      </h2>

      {/* --- three ROWS, unlimited columns ------------------------ */}
      <div className="grid grid-flow-col grid-rows-3 auto-cols-fr gap-6">
        {grouped.map((g) => (
          <div
            key={g.name}
            className="relative flex flex-col overflow-hidden rounded-2xl bg-black/40 shadow-inner ring-1 ring-white/10 transition hover:shadow-2xl"
          >
            <div className="relative h-40 w-full">
              <Image
                src={g.image}
                alt={g.name}
                fill
                className="object-cover brightness-90"
                sizes="(max-width:768px) 100vw, 33vw"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between p-6 text-silver-light backdrop-blur-sm">
              <div>
                <h3 className="font-header text-xl">{g.name}</h3>
                <p className="mt-1 text-sm opacity-80">{g.blurb}</p>
              </div>

              <div className="mt-4 flex flex-col space-y-2">
                {g.tiers.map((t) => (
                  <label
                    key={t.id}
                    className={`flex items-center justify-between rounded-lg border px-4 py-2 font-header cursor-pointer transition ${
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
                    <span>
                      {(t.price / 100).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}{' '}
                      deposit
                    </span>
                    {selectedService === t.id && (
                      <CheckCircleIcon className="h-5 w-5 text-chalk-red" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <InfoButton blurb={g.blurb} />
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full bg-silver-dark px-6 py-2"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!selectedService}
          onClick={onNext}
          className="rounded-full bg-chalk-red px-6 py-2 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  )
}
