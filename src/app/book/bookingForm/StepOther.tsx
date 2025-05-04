'use client';
import { useFormContext } from 'react-hook-form';
import type { FormValues } from './BookingWizard';

interface Props { onBack: () => void; onNext: () => void; }

/** 6 · Other Useful Information */
export default function StepOther({ onBack, onNext }: Props) {
  const { register, resetField } = useFormContext<FormValues>();

  function markNA() {
    const fields: (keyof FormValues)[] = [
      'eventTimeline',
      'culturalConsiderations',
      'equipmentNeeds',
      'wastePlan',
    ];
    fields.forEach((f) => resetField(f));
    onNext();
  }

  const base =
    'mt-2 w-full rounded-md border border-silver-light/30 bg-silver-light/5 px-3 py-2 text-sm ' +
    'placeholder-silver-light/60 focus:border-chalk-red focus:ring-2 focus:ring-chalk-red';

  return (
    <section className="space-y-10">
      <h2 className="text-center font-header text-2xl">
        6&nbsp;·&nbsp;Other&nbsp;Useful&nbsp;Information
      </h2>

      <fieldset className="space-y-6 rounded-xl border border-white/10 bg-black/30 p-6">
        <legend className="font-header px-2 text-steam/90">
          Other Useful Information
        </legend>

        <label>
          <span className="font-header">Event&nbsp;Flow&nbsp;/&nbsp;Timeline&nbsp;Highlights</span>
          <textarea
            rows={2}
            {...register('eventTimeline')}
            placeholder="Guests arrive 5 pm, cocktail hour 5:30–6:30…"
            className={base}
          />
        </label>

        <label>
          <span className="font-header">Cultural&nbsp;/&nbsp;Religious&nbsp;Considerations</span>
          <textarea
            rows={2}
            {...register('culturalConsiderations')}
            placeholder="Halal, Kosher, vegetarian Friday…"
            className={base}
          />
        </label>

        <label>
          <span className="font-header">Equipment&nbsp;Rental&nbsp;Needs</span>
          <textarea
            rows={2}
            {...register('equipmentNeeds')}
            placeholder="8‑top rounds, linen colour, chafers…"
            className={base}
          />
        </label>

        <label>
          <span className="font-header">Waste&nbsp;Disposal&nbsp;Plan</span>
          <textarea
            rows={2}
            {...register('wastePlan')}
            placeholder="Venue dumpster access, compost bins, haul‑away…"
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
