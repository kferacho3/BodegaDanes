'use client';

import { useFormContext } from 'react-hook-form';
import type { FormValues } from './BookingWizard';

interface Props { onBack: () => void; onNext: () => void; }

/** 5 · Budget & Billing */
export default function StepBudget({ onBack, onNext }: Props) {
  const { register, resetField } = useFormContext<FormValues>();

  function markNA() {
    const fields: (keyof FormValues)[] = ['budgetRange', 'billingContact', 'paymentSchedule'];
    fields.forEach((f) => resetField(f));
    onNext();
  }
  const base =
    'mt-2 w-full rounded-md border border-silver-light/30 bg-silver-light/5 px-3 py-2 text-sm ' +
    'placeholder-silver-light/60 focus:border-chalk-red focus:ring-2 focus:ring-chalk-red';

  return (
    <section className="space-y-10">
      <h2 className="text-center font-header text-2xl">
        5&nbsp;·&nbsp;Budget&nbsp;&amp;&nbsp;Billing
      </h2>

      <fieldset className="space-y-6 rounded-xl border border-white/10 bg-black/30 p-6">
        <legend className="font-header px-2 text-steam/90">Budget &amp; Billing</legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <label>
            <span className="font-header">Budget&nbsp;Range&nbsp;(approx.)</span>
            <input
              type="text"
              {...register('budgetRange')}
              placeholder="$5 000 – $7 500"
              className={base}
            />
          </label>

          <label>
            <span className="font-header">Billing&nbsp;Contact</span>
            <input
              type="text"
              {...register('billingContact')}
              placeholder="Name / email for invoices"
              className={base}
            />
          </label>
        </div>

        <label>
          <span className="font-header">Deposit&nbsp;/&nbsp;Payment&nbsp;Schedule</span>
          <textarea
            rows={2}
            {...register('paymentSchedule')}
            placeholder="50 % on booking, balance 1 week before event…"
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
