'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import StepAgreements from './StepAgreements';
import StepBudget from './StepBudget';
import StepDate from './StepDate';
import StepFood from './StepFood';
import StepLogistics from './StepLogistics';
import StepOther from './StepOther';
import StepSelectService from './StepSelectService';

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
  date            : string;
  serviceId       : string;
  /* logistics */
  eventStartTime? : string;
  eventEndTime?   : string;
  guestCount?     : number;
  ageDemographics?: string;
  venueContact?   : string;
  kitchenFacilities?: string;
  setupRestrictions?: string;
  /* food & service */
  cuisineStyles?  : string;
  mealType?       : string;
  menuIdeas?      : string;
  dietaryRestrictions?: string;
  beverageNeeds?  : string;
  serviceStyleDetails?: string;
  staffingLevel?  : string;
  /* budget */
  budgetRange?    : string;
  billingContact? : string;
  paymentSchedule?: string;
  /* other info */
  eventTimeline?  : string;
  culturalConsiderations?: string;
  equipmentNeeds? : string;
  wastePlan?      : string;
  /* agreements */
  tos             : boolean;
  ua              : boolean;
};

export default function BookingWizard({ availability: initial }: { availability: Availability[] }) {
  const methods = useForm<FormValues>({ mode: 'onChange' });
  const { watch, handleSubmit, formState } = methods;

  const [step, setStep] = useState<1|2|3|4|5|6|7>(1);
  const [availability, setAvailability] = useState<Availability[]>(initial);
  const [services, setServices]         = useState<Service[]>([]);
  const [loadErr, setLoadErr]           = useState<string | null>(null);

  /* refresh availability (no‑cache) */
  useEffect(() => {
    fetch('/api/availability',{cache:'no-store'})
      .then(r=>r.ok?r.json():initial)
      .then(setAvailability)
      .catch(()=>{/* ignore */});
  },[initial]);

  /* fetch Stripe services */
  useEffect(() => {
    fetch('/api/services',{cache:'no-store'})
      .then(async r=>{ if(!r.ok)throw new Error(`Status ${r.status}`); return r.json(); })
      .then(setServices)
      .catch(err=>{
        console.error('Service load failed:',err);
        setLoadErr('Unable to load services. Please try again later.');
      });
  },[]);

  const selectedDate    = watch('date');
  const selectedService = watch('serviceId');

  async function onSubmit(data: FormValues){
    await fetch('/api/booking',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ date:data.date, serviceId:data.serviceId, meta:data })
    });

    const stripe=await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);
    const { id }=await fetch('/api/create-checkout-session',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(data)
    }).then(r=>r.json());

    await stripe?.redirectToCheckout({sessionId:id});
  }

  return(
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {step===1&&(
          <StepDate
            availability={availability}
            selectedDate={selectedDate}
            onNext={()=>setStep(2)}
          />
        )}

        {step===2&&(
          <StepSelectService
            availability={availability}
            selectedDate={selectedDate}
            selectedService={selectedService}
            globalServices={services}
            loadError={loadErr}
            onBack={()=>setStep(1)}
            onNext={()=>setStep(3)}
          />
        )}

        {step===3&&(
          <StepLogistics
            onBack={()=>setStep(2)}
            onNext={()=>setStep(4)}
          />
        )}

        {step===4&&(
          <StepFood
            onBack={()=>setStep(3)}
            onNext={()=>setStep(5)}
          />
        )}

        {step===5&&(
          <StepBudget
            onBack={()=>setStep(4)}
            onNext={()=>setStep(6)}
          />
        )}

        {step===6&&(
          <StepOther
            onBack={()=>setStep(5)}
            onNext={()=>setStep(7)}
          />
        )}

        {step===7&&(
          <StepAgreements
            isValid={formState.isValid}
            onBack={()=>setStep(6)}
          />
        )}
      </form>
    </FormProvider>
  );
}
