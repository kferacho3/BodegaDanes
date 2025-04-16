"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { loadStripe } from "@stripe/stripe-js";
import { format } from "date-fns";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
    Controller,
    FormProvider,
    useForm,
} from "react-hook-form";

export type Availability = {
  date: string; // ISO date
  services: { id: string; name: string; slots: number; blurb: string }[];
};

export type FormValues = {
  date: string;
  serviceId: string;
  addons: string[];
  notes: string;
  tos: boolean;
  ua: boolean;
};

interface Props {
  availability: Availability[];
}

/* ---------- tiny helper components ---------- */
const InfoButton = ({ blurb }: { blurb: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ml-2 inline-flex items-center rounded-full bg-silver-dark/20 p-1 hover:bg-silver-dark/40"
      >
        <InformationCircleIcon className="h-4 w-4" />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-xl bg-charcoal p-6 text-silver-light"
          >
            <h3 className="font-header text-xl">Service details</h3>
            <p className="whitespace-pre-line">{blurb}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-full bg-chalk-red py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/* ---------- wizard ---------- */
export default function BookingWizard({ availability }: Props) {
  const methods = useForm<FormValues>({ mode: "onChange" });
  const { watch, setValue, handleSubmit, formState } = methods;
  const [step, setStep] = useState(1);

  const selectedDate = watch("date");
  const selectedService = watch("serviceId");

  /* ----- calendar helpers ----- */
  const disabledDays = availability
    .filter((d) => d.services.every((s) => s.slots === 0))
    .map((d) => new Date(d.date));

  const servicesForDate =
    availability.find((d) => d.date === selectedDate)?.services ?? [];

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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* STEP 1 — date */}
        {step === 1 && (
          <section className="space-y-6 text-center">
            <h2 className="font-header text-2xl">1 · Choose a Date</h2>
            <DayPicker
              mode="single"
              selected={selectedDate ? new Date(selectedDate) : undefined}
              onSelect={(d) => d && setValue("date", format(d, "yyyy-MM-dd"))}
              disabled={disabledDays}
              className="mx-auto inline-block rounded-lg bg-charcoal-light p-4 shadow-inner"
              classNames={{
                caption_label: "font-header",
                day: "font-header rounded-full w-9 h-9 flex items-center justify-center",
                day_selected:
                  "bg-chalk-red text-silver-light hover:bg-chalk-red",
              }}
            />
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!selectedDate}
              className="mt-4 rounded-full bg-chalk-red px-6 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </section>
        )}

        {/* STEP 2 — service */}
        {step === 2 && (
          <section className="space-y-6">
            <h2 className="text-center font-header text-2xl">
              2 · Select Service
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {servicesForDate.map((s) => (
                <label
                  key={s.id}
                  className={`relative cursor-pointer rounded-lg border p-4 ${
                    selectedService === s.id
                      ? "border-chalk-red"
                      : "border-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    value={s.id}
                    {...methods.register("serviceId", { required: true })}
                    className="sr-only"
                  />
                  <span className="font-bold">{s.name}</span>
                  <span className="block text-sm opacity-70">
                    {s.slots} slots left
                  </span>
                  <InfoButton blurb={s.blurb} />
                </label>
              ))}
            </div>

            {/* add‑ons & notes */}
            {selectedService && (
              <div className="space-y-4">
                <Controller
                  name="addons"
                  control={methods.control}
                  render={({ field }) => (
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        value="custom-requests"
                        checked={field.value?.includes("custom-requests") || false}
                        onChange={(e) => {
                          if (e.target.checked)
                            field.onChange([...(field.value || []), e.target.value]);
                          else
                            field.onChange(
                              (field.value || []).filter((v) => v !== e.target.value)
                            );
                        }}
                        className="mt-1"
                      />
                      <span>
                        Special requests / accommodations&nbsp;
                        <span className="opacity-60 text-xs">
                          (fee may apply)
                        </span>
                      </span>
                    </label>
                  )}
                />

                <textarea
                  {...methods.register("notes")}
                  placeholder="Describe allergies, dietary restrictions, or special set‑up requests…"
                  className="w-full rounded-lg bg-silver-light/10 p-3"
                  rows={3}
                />
              </div>
            )}

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
                onClick={() => setStep(3)}
                disabled={!selectedService}
                className="rounded-full bg-chalk-red px-6 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </section>
        )}

        {/* STEP 3 — agreements */}
        {step === 3 && (
          <section className="space-y-6">
            <h2 className="text-center font-header text-2xl">
              3 · Agreements
            </h2>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                {...methods.register("tos", { required: true })}
                className="mt-1"
              />
              <span>
                I agree to the{" "}
                <a href="/legal/terms" target="_blank" className="underline">
                  Terms&nbsp;of&nbsp;Service
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
  );
}
