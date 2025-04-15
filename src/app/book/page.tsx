"use client";

import { loadStripe } from "@stripe/stripe-js";
import { format } from "date-fns";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FormProvider, useForm } from "react-hook-form";

export type Availability = {
  date: string; // YYYY‑MM‑DD
  services: { id: string; name: string; slots: number }[];
};

interface BookingFormProps {
  availability: Availability[];
}

export type FormValues = {
  date: string;
  serviceId: string;
  addons: string[];
  tos: boolean;
  ua: boolean;
};

export default function BookingForm({ availability }: BookingFormProps) {
  const methods = useForm<FormValues>({ mode: "onChange" });
  const { watch, setValue, handleSubmit, formState } = methods;
  const [step, setStep] = useState<number>(1);

  const selectedDate = watch("date");
  const selectedService = watch("serviceId");

  // STEP 1: Calculate disabled days (those with no service slots left)
  const disabledDays = (availability || [])
    .filter((d) => d.services?.every((s) => s.slots === 0))
    .map((d) => new Date(d.date));

  // Use a fallback for availability if it's undefined.
  const safeAvailability = availability || [];
  // STEP 2: Find available services for the selected date.
  const servicesForDate =
    (safeAvailability.find((d) => d.date === selectedDate) ?? { services: [] })
      .services;

  // STEP 3: On form submission, create a Stripe Checkout session.
  async function onSubmit(data: FormValues) {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json());
    await stripe?.redirectToCheckout({ sessionId: res.id });
  }

  return (
    <main className="min-h-screen bg-[url('/textures/chalk-black.png')] bg-repeat text-silver-light">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-center font-header text-4xl mb-10">
          Book&nbsp;Your&nbsp;Event
        </h1>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* STEP 1 — Date Selection */}
            {step === 1 && (
              <section className="space-y-6 text-center">
                <h2 className="font-header text-2xl">1 · Choose a Date</h2>
                <DayPicker
                  mode="single"
                  selected={selectedDate ? new Date(selectedDate) : undefined}
                  onSelect={(d) => {
                    if (d) setValue("date", format(d, "yyyy-MM-dd"));
                  }}
                  disabled={disabledDays}
                />
                <button
                  type="button"
                  className="mt-4 rounded-full bg-chalk-red px-6 py-2 disabled:opacity-40"
                  disabled={!selectedDate}
                  onClick={() => setStep(2)}
                >
                  Next
                </button>
              </section>
            )}

            {/* STEP 2 — Service Selection */}
            {step === 2 && (
              <section className="space-y-6">
                <h2 className="font-header text-2xl text-center">
                  2 · Select Service
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {servicesForDate.map((s) => (
                    <label
                      key={s.id}
                      className={`block cursor-pointer rounded-lg border p-4 ${
                        selectedService === s.id
                          ? "border-chalk-red"
                          : "border-transparent"
                      }`}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        value={s.id}
                        {...methods.register("serviceId", { required: true })}
                      />
                      <span className="font-bold">{s.name}</span>
                      <span className="block text-sm opacity-70">
                        {s.slots} slots left
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="rounded-full bg-silver-dark px-6 py-2"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-chalk-red px-6 py-2 disabled:opacity-40"
                    disabled={!selectedService}
                    onClick={() => setStep(3)}
                  >
                    Next
                  </button>
                </div>
              </section>
            )}

            {/* STEP 3 — Agreements */}
            {step === 3 && (
              <section className="space-y-6">
                <h2 className="font-header text-2xl text-center">
                  3 · Agreements
                </h2>

                <div className="space-y-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      {...methods.register("tos", { required: true })}
                      className="mt-1"
                    />
                    <span>
                      I agree to the{" "}
                      <a
                        href="/legal/terms"
                        target="_blank"
                        className="underline"
                      >
                        Terms of Service
                      </a>
                      .
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      {...methods.register("ua", { required: true })}
                      className="mt-1"
                    />
                    <span>
                      I have read and accept the{" "}
                      <a
                        href="/legal/user-agreement"
                        target="_blank"
                        className="underline"
                      >
                        User Agreement
                      </a>
                      .
                    </span>
                  </label>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="rounded-full bg-silver-dark px-6 py-2"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-chalk-red px-6 py-2 disabled:opacity-40"
                    disabled={!formState.isValid}
                  >
                    Pay&nbsp;&amp;&nbsp;Reserve
                  </button>
                </div>
              </section>
            )}
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
