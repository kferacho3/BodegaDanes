// src/components/book/bookingForm/StepDate.tsx
'use client';

import type { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { format, parse, startOfToday } from 'date-fns';
import dynamic from 'next/dynamic';
import React, { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { Availability } from './BookingWizard';

/* ─────── helper – convert "YYYY‑MM‑DD" <‑> Date (local) ─────── */
const fromKey = (k: string) => parse(k, 'yyyy-MM-dd', new Date());

/* ─────── FullCalendar dynamic import (SSR disabled) ─────── */
const FullCalendar = dynamic(
  () => import('@fullcalendar/react'),
  { ssr: false }
) as React.ComponentType<CalendarOptions>;

interface Props {
  availability : Availability[];
  selectedDate : string | undefined;   // initial selection from form state
  onNext       : () => void;
}

/* ───────────────────────── Component ───────────────────────── */
export default function StepDate({ availability, selectedDate, onNext }: Props) {
  const { setValue }      = useFormContext();
  const [chosen, setChosen] = useState<string | undefined>(selectedDate); // yyyy‑MM‑dd

  /* ---------- bucket availability into OPEN / BOOKED / OFF ---------- */
  const buckets = useMemo(() => {
    const today = startOfToday();
    const open  : Date[] = [];
    const booked: Date[] = [];
    const off   : Date[] = [];

    availability.forEach((a) => {
      const d = fromKey(a.date);
      switch (a.status) {
        case 'OPEN'  : if (d >= today) open.push(d);  break;
        case 'BOOKED': booked.push(d);                break;
        case 'OFF'   : off.push(d);                   break;
      }
    });
    return { open, booked, off };
  }, [availability]);

  /* ---------- build calendar events (colour blocks) ---------- */
  const fcEvents = useMemo<EventInput[]>(() => {
    const arr: EventInput[] = [];

    // OPEN (blue)
    buckets.open.forEach((d) => {
      const key = d.toISOString();
      if (key !== chosen) {         // chosen day will be green instead
        arr.push({
          start          : d,
          allDay         : true,
          display        : 'background',
          backgroundColor: '#2563eb',
        });
      }
    });

    // BOOKED (red)
    buckets.booked.forEach((d) =>
      arr.push({
        start          : d,
        allDay         : true,
        display        : 'background',
        backgroundColor: '#dc2626',
      }),
    );

    // OFF (gray – rendered but not in legend)
    buckets.off.forEach((d) =>
      arr.push({
        start          : d,
        allDay         : true,
        display        : 'background',
        backgroundColor: '#6b7280',
      }),
    );

    // USER‑SELECTED (green)  – if any
    if (chosen) {
      arr.push({
        start          : fromKey(chosen),
        allDay         : true,
        display        : 'background',
        backgroundColor: '#10b981',
      });
    }

    return arr;
  }, [buckets, chosen]);

  /* ---------- day click ---------- */
  const openKeySet = useMemo(() => new Set(buckets.open.map((d) => d.toDateString())), [buckets.open]);

  const handleDateClick = (arg: DateClickArg) => {
    // only allow picking OPEN days
    if (!openKeySet.has(arg.date.toDateString())) return;

    const key = format(arg.date, 'yyyy-MM-dd');
    setChosen(key);
    setValue('date', key);          // expose to react‑hook‑form
  };

  /* ---------- calendar options ---------- */
  const options: CalendarOptions = {
    plugins       : [dayGridPlugin, interactionPlugin],
    initialView   : 'dayGridMonth',
    height        : 'auto',
    events        : fcEvents,
    dateClick     : handleDateClick,
    headerToolbar : { start: 'prev', center: 'title', end: 'next' },
    titleFormat   : { year: 'numeric', month: 'long' },
    dayCellDidMount(info) {
      // decorative rounding & hover grow
      info.el.classList.add(
        'rounded-md',
        'transition',
        'duration-200',
        'ease-out',
        'hover:scale-[1.03]',
        'cursor-pointer'
      );

      // show ring on selected cell
      if (chosen && info.dateStr === chosen) {
        info.el.classList.add('ring-2', 'ring-emerald-400');
      }

      // grey out non‑open days cursor
      if (!openKeySet.has(info.date.toDateString())) {
        info.el.classList.add('cursor-not-allowed');
      }
    },
  };

  /* ---------- render ---------- */
  return (
    <section className="space-y-6 text-center">
      <h2 className="font-header text-2xl">1&nbsp;·&nbsp;Choose a Date</h2>

      <div className="mx-auto w-full max-w-4xl rounded-2xl bg-black/60 p-6 shadow-xl">
        <FullCalendar {...options} />

        {/* legend */}
        <ul className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-silver-light">
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-600" /> Available
          </li>
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-600" /> Booked
          </li>
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" /> Your choice
          </li>
        </ul>
      </div>

      <button
        type="button"
        disabled={!chosen}
        onClick={onNext}
        className="mt-4 rounded-full bg-chalk-red px-8 py-2 font-header text-white disabled:opacity-40"
      >
        Next
      </button>
    </section>
  );
}
