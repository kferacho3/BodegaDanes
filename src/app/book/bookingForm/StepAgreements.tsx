'use client'

import { useFormContext } from 'react-hook-form'

interface Props {
  isValid: boolean
  onBack : () => void
}

export default function StepAgreements ({ isValid, onBack }: Props) {
  const { register } = useFormContext()

  return (
    <section className="space-y-6">
      <h2 className="text-center font-header text-2xl">3 · Agreements</h2>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          {...register('tos', { required:true })}
          className="mt-1"
        />
        <span>
          I agree to the{' '}
          <a href="/legal/terms" target="_blank" className="underline">
            Terms&nbsp;of&nbsp;Service
          </a>
          .
        </span>
      </label>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          {...register('ua', { required:true })}
          className="mt-1"
        />
        <span>
          I accept the{' '}
          <a href="/legal/user-agreement" target="_blank" className="underline">
            User&nbsp;Agreement
          </a>
          .
        </span>
      </label>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="rounded-full bg-silver-dark px-6 py-2">
          Back
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="rounded-full bg-chalk-red px-6 py-2 disabled:opacity-40"
        >
          Pay&nbsp;&amp;&nbsp;Reserve
        </button>
      </div>
    </section>
  )
}
