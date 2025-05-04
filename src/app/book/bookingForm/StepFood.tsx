'use client';

import { useFormContext } from 'react-hook-form';
import type { FormValues } from './BookingWizard';

interface Props { onBack: () => void; onNext: () => void; }

/** 4 · Food & Service Preferences */
export default function StepFood({ onBack, onNext }: Props) {
  const { register, resetField } = useFormContext<FormValues>();

  function markNA() {
    const fields: (keyof FormValues)[] = [
      'cuisineStyles',
      'mealType',
      'menuIdeas',
      'dietaryRestrictions',
      'beverageNeeds',
      'serviceStyleDetails',
      'staffingLevel',
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
        4&nbsp;·&nbsp;Food&nbsp;&amp;&nbsp;Service&nbsp;Preferences
      </h2>

      <fieldset className="space-y-6 rounded-xl border border-white/10 bg-black/30 p-6">
        <legend className="font-header px-2 text-steam/90">
          Food &amp; Service Preferences
        </legend>

        <label>
          <span className="font-header">Cuisine&nbsp;Styles</span>
          <input
            type="text"
            {...register('cuisineStyles')}
            placeholder="Italian, BBQ, Asian‑fusion…"
            className={base}
          />
        </label>

        <label>
          <span className="font-header">Meal&nbsp;Type</span>
          <select {...register('mealType')} className={base}>
            <option value="">Select…</option>
            <option>Passed Appetizers</option>
            <option>Buffet</option>
            <option>Plated Dinner</option>
            <option>Food Stations</option>
            <option>Family Style</option>
          </select>
        </label>

        <label>
          <span className="font-header">Menu&nbsp;Preferences&nbsp;/&nbsp;Ideas</span>
          <textarea
            rows={2}
            {...register('menuIdeas')}
            placeholder="Favourite dishes, seasonal focus, local ingredients…"
            className={base}
          />
        </label>

        <label>
          <span className="font-header">
            Dietary&nbsp;Restrictions&nbsp;&amp;&nbsp;Allergies
          </span>
          <textarea
            rows={2}
            {...register('dietaryRestrictions')}
            placeholder="e.g. 5 vegetarian, 2 gluten‑free; no peanuts"
            className={base}
          />
        </label>

        <label>
          <span className="font-header">Beverage&nbsp;Service&nbsp;Needs</span>
          <textarea
            rows={2}
            {...register('beverageNeeds')}
            placeholder="Full bar, beer & wine only, signature mocktails…"
            className={base}
          />
        </label>

        <label>
          <span className="font-header">Service&nbsp;Style&nbsp;Details</span>
          <textarea
            rows={2}
            {...register('serviceStyleDetails')}
            placeholder="3‑course plated with salad, entrée, dessert…"
            className={base}
          />
        </label>

        <label>
          <span className="font-header">Desired&nbsp;Staffing&nbsp;Level</span>
          <input
            type="text"
            {...register('staffingLevel')}
            placeholder="e.g. 1 server per 15 guests, 2 bartenders"
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
