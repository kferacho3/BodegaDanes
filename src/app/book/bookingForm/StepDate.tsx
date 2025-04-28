'use client';

import {
  format,
  isBefore,
  isSameDay,
  /* ⬇ NEW: use parse (local) instead of parseISO (UTC) */
  parse,
  startOfToday,
} from 'date-fns';
import { useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useFormContext } from 'react-hook-form';
import type { Availability } from './BookingWizard';

/* helper — translate “YYYY-MM-DD” ↔ Date in **local** time */
const dateFromKey = (k: string) => parse(k, 'yyyy-MM-dd', new Date());

interface Props {
  availability : Availability[];
  selectedDate : string | undefined;
  onNext       : () => void;
}

export default function StepDate({ availability, selectedDate, onNext }: Props) {
  const { setValue }      = useFormContext();
  const [month, setMonth] = useState(new Date());

  /* ---------- colour buckets ---------- */
  const { openDays, bookedDays, offDays } = useMemo(() => {
    const today  = startOfToday();
    const open   : Date[] = [];
    const booked : Date[] = [];
    const off    : Date[] = [];

    availability.forEach(a => {
      const d = dateFromKey(a.date);       // ← local, no TZ drift
      switch (a.status) {
        case 'OPEN'  : if (d >= today) open.push(d);  break;
        case 'BOOKED': booked.push(d);                break;
        case 'OFF'   : off.push(d);                   break;
      }
    });
    return { openDays: open, bookedDays: booked, offDays: off };
  }, [availability]);

  /* ---------- render ---------- */
  return (
    <section className="space-y-6 text-center">
      <h2 className="font-header text-2xl">1&nbsp;·&nbsp;Choose a Date</h2>

      <div className="mx-auto w-full max-w-md rounded-lg bg-[url('/textures/chalk-Menuboard2.png')] bg-cover p-6 shadow-inner">
        {/* month navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth()-1, 1))}>‹ Prev</button>
          <span className="font-header text-lg">{format(month,'MMMM yyyy')}</span>
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth()+1, 1))}>Next ›</button>
        </div>

        <DayPicker
          mode="single"
          month={month}
          onMonthChange={setMonth}
          selected={selectedDate ? dateFromKey(selectedDate) : undefined}
          onSelect={d => d && setValue('date', format(d,'yyyy-MM-dd'))}
          showOutsideDays
          fixedWeeks
          fromDate={startOfToday()}

          modifiers={{ open:openDays, booked:bookedDays, disabled:offDays }}
          modifiersClassNames={{
            open    :'bg-blue-600  text-white hover:bg-blue-700',
            booked  :'bg-red-600   text-white cursor-not-allowed',
            disabled:'bg-gray-400 text-white opacity-60',
            selected:'!bg-emerald-500 !text-white',
          }}
          /* click-guard: only OPEN days */
          disabled={d =>
            isBefore(d, startOfToday()) ||
            !openDays.some(x => isSameDay(x, d))
          }
          classNames={{
            caption_label:'font-header text-lg',
            head_cell    :'text-center font-header text-xs text-gray-600',
            day          :'h-10 w-10 font-header items-center justify-center rounded-full',
            day_today    :'ring-2 ring-chalk-red',
          }}
        />

        {/* legend */}
        <ul className="mt-4 grid grid-cols-2 gap-2 text-left text-xs sm:grid-cols-4">
          <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-600"    /> Available</li>
          <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-600"     /> Booked</li>
          <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" /> Your choice</li>
          <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-gray-400"    /> Unavailable</li>
        </ul>
      </div>

      <button
        type="button"
        disabled={!selectedDate}
        onClick={onNext}
        className="mt-4 rounded-full bg-chalk-red px-8 py-2 disabled:opacity-40"
      >
        Next
      </button>
    </section>
  );
}
