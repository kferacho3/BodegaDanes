'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import StepAgreements from './StepAgreements';
import StepDate from './StepDate';
import StepServices from './StepServices';

/* ---------- shared types ---------- */
export type Service = {
  id   : string;
  name : string;
  price: number;
  full : number;
  image: string;
  blurb: string;
  slots: number;
};

export type Availability = {
  date    : string;
  status  : 'OPEN' | 'OFF' | 'BOOKED';
  services: Service[];
};

export type FormValues = {
  date      : string;
  serviceId : string;
  theme     : string;
  time      : string;
  location  : string;
  guests    : number;
  notes     : string;
  tos       : boolean;
  ua        : boolean;
};

export default function BookingWizard({ availability: initial }: { availability: Availability[] }) {
  const methods = useForm<FormValues>({ mode: 'onChange' });
  const { watch, handleSubmit, formState } = methods;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [availability, setAvailability] = useState<Availability[]>(initial);
  const [services, setServices]         = useState<Service[]>([]);
  const [loadErr, setLoadErr]           = useState<string | null>(null);

  /* refresh availability without caching :contentReference[oaicite:6]{index=6} */
  useEffect(() => {
    fetch('/api/availability', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : initial)
      .then(setAvailability)
      .catch(() => {/* ignore */});
  }, [initial]);

  /* fetch Stripe services */
  useEffect(() => {
    fetch('/api/services', { cache: 'no-store' })
      .then(async r => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json();
      })
      .then(setServices)
      .catch(err => {
        console.error('Service load failed:', err);
        setLoadErr('Unable to load services. Please try again later.');
      });
  }, []);

  const selectedDate    = watch('date');
  const selectedService = watch('serviceId');

  async function onSubmit(data: FormValues) {
    await fetch('/api/booking', {
      method : 'POST',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify({ date: data.date, serviceId: data.serviceId, meta: data }),
    });

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);
    const { id } = await fetch('/api/create-checkout-session', {
      method : 'POST',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify(data),
    }).then(r => r.json());

    await stripe?.redirectToCheckout({ sessionId: id });
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {step === 1 && (
          <StepDate
            availability={availability}
            selectedDate={selectedDate}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepServices
            availability={availability}
            selectedDate={selectedDate}
            selectedService={selectedService}
            globalServices={services}
            loadError={loadErr}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <StepAgreements
            isValid={formState.isValid}
            onBack={() => setStep(2)}
          />
        )}
      </form>
    </FormProvider>
  );
}
