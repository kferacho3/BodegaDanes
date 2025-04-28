'use client'

/* =========================================================================
   BOOKING WIZARD
   • blue  = admin-set OPEN dates
   • red   = BOOKED dates (other users can’t select)
   • green = date this user selects
   • gray  = OFF / unavailable
   ======================================================================== */

import {
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid'
import { loadStripe } from '@stripe/stripe-js'
import {
  format,
  isBefore,
  parse,
  startOfToday,
} from 'date-fns'
import Image from 'next/image'
import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { FormProvider, useForm } from 'react-hook-form'

/* ---------- TYPES ---------- */
export type Service = {
  id: string
  name: string
  price: number          // deposit (¢)
  full: number           // full price (¢)
  image: string
  blurb: string
  slots: number
}

export type Availability = {
  date: string                       // yyyy-MM-dd (UTC)
  status: 'OPEN' | 'OFF' | 'BOOKED'
  services: Service[]
}

export type FormValues = {
  date: string
  serviceId: string
  theme: string
  time: string
  location: string
  guests: number
  notes: string
  tos: boolean
  ua: boolean
}

/* ---------- Info pop-up ---------- */
function InfoButton({ blurb }: { blurb: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        aria-label="Read more"
        className="absolute top-3 right-3 rounded-full bg-black/40 p-1 text-silver-light hover:bg-black/60"
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
            className="w-full max-w-md space-y-4 rounded-xl bg-charcoal p-6 text-silver-light"
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

/* ---------- MAIN ---------- */
export default function BookingWizard({
  availability,
}: { availability: Availability[] }) {
  const methods = useForm<FormValues>({ mode: 'onChange' })
  const { watch, setValue, handleSubmit, formState } = methods
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const selectedDate    = watch('date')
  const selectedService = watch('serviceId')

  /* calendar paging */
  const [month, setMonth] = useState(new Date())

  /* --- colour buckets (past days stripped) ---------------------- */
  const todayISO = format(startOfToday(), 'yyyy-MM-dd')

  const openDays = availability
    .filter((d) => d.status === 'OPEN' && d.date >= todayISO)
    .map((d) => parse(d.date, 'yyyy-MM-dd', new Date()))

  const bookedDays = availability
    .filter((d) => d.status === 'BOOKED')
    .map((d) => parse(d.date, 'yyyy-MM-dd', new Date()))

  /* ---------- STEP 1 – DATE ---------- */
  const renderStep1 = () => (
    <section className="space-y-6 text-center">
      <h2 className="font-header text-2xl">1&nbsp;·&nbsp;Choose a Date</h2>

      <div className="mx-auto w-full max-w-md rounded-lg bg-[url('/textures/chalk-Menuboard2.png')] bg-cover p-6 shadow-inner">
        {/* month nav */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
            }
          >
            ‹ Prev
          </button>
          <span className="font-header text-lg">
            {format(month, 'MMMM yyyy')}
          </span>
          <button
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
          >
            Next ›
          </button>
        </div>

        <DayPicker
          mode="single"
          month={month}
          onMonthChange={setMonth}
          selected={selectedDate ? parse(selectedDate, 'yyyy-MM-dd', new Date()) : undefined}
          onSelect={(d) => d && setValue('date', format(d, 'yyyy-MM-dd'))}
          disabled={(d) =>
            isBefore(d, startOfToday()) ||
            !openDays.some((x) => x.getTime() === d.getTime())
          }
          modifiers={{ open: openDays, booked: bookedDays }}
          modifiersClassNames={{
            open  : 'bg-blue-600 text-white hover:bg-blue-700',
            booked: 'bg-red-600 text-white cursor-not-allowed',
          }}
          className="mx-auto font-header"
          classNames={{
            caption_label: 'font-header text-lg',
            head_cell    : 'text-center font-header text-xs text-gray-600',
            day          : 'h-10 w-10 font-header items-center justify-center rounded-full',
            day_selected : 'bg-emerald-500 text-white',
            day_today    : 'ring-2 ring-chalk-red',
          }}
        />
      </div>

      <button
        type="button"
        disabled={!selectedDate}
        onClick={() => setStep(2)}
        className="mt-4 rounded-full bg-chalk-red px-8 py-2 disabled:opacity-40"
      >
        Next
      </button>
    </section>
  )

  /* ---------- STEP 2 & 3 ---------- */
  const servicesForDate =
    availability.find((d) => d.date === selectedDate)?.services ?? []

  const grouped = servicesForDate.reduce(
    (acc, s) => {
      const g = acc.find((x) => x.name === s.name)
      if (g) g.tiers.push(s)
      else
        acc.push({
          name : s.name,
          image: s.image,
          blurb: s.blurb,
          tiers: [s],
        })
      return acc
    },
    [] as { name: string; image: string; blurb: string; tiers: Service[] }[],
  )

  async function onSubmit(data: FormValues) {
    /* 1 · lock date + store meta */
    await fetch('/api/booking', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        date     : data.date,
        serviceId: data.serviceId,
        meta     : data,
      }),
    })

    /* 2 · Stripe checkout */
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!)
    const res = await fetch('/api/create-checkout-session', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(data),
    }).then((r) => r.json())

    await stripe?.redirectToCheckout({ sessionId: res.id })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {step === 1 && renderStep1()}

        {/* ---------- STEP 2 – SERVICES ---------- */}
        {step === 2 && (
          <section className="space-y-10">
            <h2 className="text-center font-header text-2xl">
              2&nbsp;·&nbsp;Select Service&nbsp;&amp;&nbsp;Describe Event
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {grouped.map((g) => (
                <div
                  key={g.name}
                  className="relative flex flex-col overflow-hidden rounded-2xl shadow-xl"
                >
                  <div className="relative h-44 w-full">
                    <Image
                      src={g.image}
                      alt={g.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="bg-black/40 p-6 text-silver-light">
                    <h3 className="font-header text-2xl">{g.name}</h3>
                    <p className="mt-1 text-sm opacity-80">{g.blurb}</p>

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
                            {...methods.register('serviceId', {
                              required: true,
                            })}
                            className="sr-only"
                          />
                          <span>
                            {(t.price / 100).toLocaleString('en-US', {
                              style   : 'currency',
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
                onClick={() => setStep(1)}
                className="rounded-full bg-silver-dark px-6 py-2"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!selectedService}
                onClick={() => setStep(3)}
                className="rounded-full bg-chalk-red px-6 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </section>
        )}

        {/* ---------- STEP 3 – AGREEMENTS ---------- */}
        {step === 3 && (
          <section className="space-y-6">
            <h2 className="text-center font-header text-2xl">3 · Agreements</h2>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                {...methods.register('tos', { required: true })}
                className="mt-1"
              />
              <span>
                I agree to the{' '}
                <a
                  href="/legal/terms"
                  target="_blank"
                  className="underline"
                >
                  Terms&nbsp;of&nbsp;Service
                </a>
                .
              </span>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                {...methods.register('ua', { required: true })}
                className="mt-1"
              />
              <span>
                I accept the{' '}
                <a
                  href="/legal/user-agreement"
                  target="_blank"
                  className="underline"
                >
                  User&nbsp;Agreement
                </a>
                .
              </span>
            </label>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-full bg-silver-dark px-6 py-2"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!formState.isValid}
                className="rounded-full bg-chalk-red px-6 py-2 disabled:opacity-40"
              >
                Pay&nbsp;&amp;&nbsp;Reserve
              </button>
            </div>
          </section>
        )}
      </form>
    </FormProvider>
  )
}
