'use client';

import { useFormContext } from 'react-hook-form';
import type { FormValues } from './BookingWizard';
interface Props {
  onBack: () => void;
  onNext: () => void;
}

/** 3 · Essential Event Logistics */
export default function StepLogistics({ onBack, onNext }: Props) {
    const { register, resetField } = useFormContext<FormValues>();
  
    function markNA() {
      const fields: (keyof FormValues)[] = [
        'eventStartTime',
        'eventEndTime',
        'guestCount',
        'ageDemographics',
        'venueContact',
        'kitchenFacilities',
        'setupRestrictions',
      ];
      fields.forEach((f) => resetField(f));
      onNext();
    }

  /** shared input styles */
  const base =
    'mt-2 w-full rounded-md border border-silver-light/30 bg-silver-light/5 px-3 py-2 text-sm ' +
    'placeholder-silver-light/60 focus:border-chalk-red focus:ring-2 focus:ring-chalk-red';

  return (
    <section className="space-y-10">
      <h2 className="text-center font-header text-2xl">
        3&nbsp;·&nbsp;Essential&nbsp;Event&nbsp;Logistics
      </h2>

      <fieldset className="space-y-6 rounded-xl border border-white/10 bg-black/30 p-6">
        <legend className="font-header px-2 text-steam/90">
          Essential Event Logistics
        </legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <label>
            <span className="font-header">
              Event&nbsp;Start&nbsp;Time&nbsp;
              <small className="opacity-70">(HH:MM)</small>
            </span>
            <input type="time" {...register('eventStartTime')} className={base} />
          </label>

          <label>
            <span className="font-header">Event&nbsp;End&nbsp;Time</span>
            <input type="time" {...register('eventEndTime')} className={base} />
          </label>

          <label>
            <span className="font-header">Estimated&nbsp;Guest&nbsp;Count</span>
            <input
              type="number"
              min={1}
              {...register('guestCount')}
              placeholder="e.g. 150"
              className={base}
            />
          </label>

          <label>
            <span className="font-header">
              Main&nbsp;Age&nbsp;Demographic&nbsp;
              <small className="opacity-70">(optional)</small>
            </span>
            <input
              type="text"
              {...register('ageDemographics')}
              placeholder="Kids, teens, adults 25‑40…"
              className={base}
            />
          </label>
        </div>

        <label>
          <span className="font-header">
            Venue&nbsp;Contact&nbsp;/&nbsp;On‑site&nbsp;Coordinator
          </span>
          <input
            type="text"
            {...register('venueContact')}
            placeholder="Name, phone & email"
            className={base}
          />
        </label>

        <label>
          <span className="font-header">Kitchen&nbsp;Facilities&nbsp;Available</span>
          <textarea
            rows={2}
            {...register('kitchenFacilities')}
            placeholder="Ovens, burners, fridge space, prep tables…"
            className={base}
          />
        </label>

        <label>
          <span className="font-header">Setup / Teardown&nbsp;Restrictions</span>
          <textarea
            rows={2}
            {...register('setupRestrictions')}
            placeholder="Earliest access time, must clear by midnight…"
            className={base}
          />
        </label>
      </fieldset>

      {/* nav */}
      <div className="flex justify-between pt-8">
        <button
          onClick={onBack}
          type="button"
          className="rounded-full bg-silver-dark px-6 py-2"
        >
          Back
        </button>

        <div className="flex gap-4">
          <button
            onClick={markNA}
            type="button"
            className="rounded-full bg-silver-light/30 px-6 py-2 hover:bg-silver-light/50"
          >
            N/A
          </button>

          <button
            onClick={onNext}
            type="button"
            className="rounded-full bg-chalk-red px-6 py-2"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
