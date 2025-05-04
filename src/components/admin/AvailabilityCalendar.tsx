// src/components/admin/AvailabilityCalendar.tsx
'use client';

import type { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import type { AvailabilityStatus } from '@prisma/client';
import dynamic from 'next/dynamic';
import React, { useMemo, useState } from 'react';

/* ─────── Types ─────── */
export interface CalendarEvent {
  date: Date;
  status: AvailabilityStatus; // 'OPEN' | 'BOOKED' | 'OFF'
}

interface Props {
  events: CalendarEvent[];                      // initial from DB
  onSave: (draft: CalendarEvent[]) => Promise<void>;
}

/* ─────── Helpers ─────── */
const cycleStatus = (s: AvailabilityStatus): AvailabilityStatus =>
  s === 'OPEN'   ? 'BOOKED'
: s === 'BOOKED' ? 'OFF'
: 'OPEN';

/* ─────── Dynamic FullCalendar import ─────── */
/**
 * We import @fullcalendar/react dynamically (SSR: false),
 * then assert its type so TS/ESLint stop complaining about `any`.
 */
const FullCalendar = dynamic(
  () => import('@fullcalendar/react'),
  { ssr: false }
) as React.ComponentType<CalendarOptions>;

/* ─────── Component ─────── */
export default function AvailabilityCalendar({ events, onSave }: Props) {
  /* Local draft of events + currently selected cell */
  const [draft, setDraft]       = useState<CalendarEvent[]>(events);
  const [selected, setSelected] = useState<string | null>(null); // ISO yyyy-mm-dd

  /* When a day is clicked, toggle its status in the draft */
  const handleDateClick = (arg: DateClickArg) => {
    const key = arg.date.toDateString();
    setSelected(arg.dateStr);

    setDraft((prev) => {
      const idx = prev.findIndex((e) => e.date.toDateString() === key);
      if (idx === -1) {
        // new → OPEN
        return [...prev, { date: arg.date, status: 'OPEN' }];
      }
      // cycle existing
      const next = [...prev];
      next[idx] = { ...next[idx], status: cycleStatus(next[idx].status) };
      return next;
    });
  };

  /* Buttons: delete one, clear all, undo, save */
  const deleteSelected = () => {
    if (!selected) return;
    const selKey = new Date(selected).toDateString();
    setDraft((prev) => prev.filter((e) => e.date.toDateString() !== selKey));
    setSelected(null);
  };
  const clearAll    = () => setDraft([]);
  const undoChanges = () => setDraft(events);

  /* Build FullCalendar “events” with background-fill colours */
  const fcEvents = useMemo<CalendarOptions['events']>(() => {
    const todayMidnight = new Date().setHours(0, 0, 0, 0);

    return draft.map(({ date, status }) => {
      const isPast = date.getTime() < todayMidnight;
      const bgColor =
        status === 'OPEN'
          ? '#2563eb'               // blue → available
          : status === 'BOOKED'
          ? isPast
            ? '#dc2626'             // red  → booked (past)
            : '#10b981'             // green → booked (future)
          : '#6b7280';              // gray → off

      return {
        start           : date,
        allDay          : true,
        display         : 'background',      // fill full cell
        backgroundColor : bgColor,
      };
    });
  }, [draft]);

  /* Calendar configuration */
  const options: CalendarOptions = {
    plugins         : [dayGridPlugin, interactionPlugin],
    initialView     : 'dayGridMonth',
    height          : 'auto',
    events          : fcEvents,
    dateClick       : handleDateClick,
    headerToolbar   : { start: 'prev', center: 'title', end: 'next' },
    titleFormat     : { year: 'numeric', month: 'long' },
    dayCellDidMount : (info) => {
      info.el.classList.add(
        'rounded-md',
        'transition',
        'duration-200',
        'ease-out',
        'hover:scale-[1.03]'
      );
      if (info.dateStr === selected) {
        info.el.classList.add('ring-2', 'ring-amber-400');
      }
    },
  };

  return (
    <section className="flex justify-center">
      <div className="w-full max-w-4xl rounded-2xl bg-black/60 p-6 shadow-xl">
        {/* Calendar itself */}
        <FullCalendar {...options} />

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap justify-end gap-3 text-sm">
          <button
            onClick={deleteSelected}
            disabled={!selected}
            className="rounded-full bg-red-700 px-3 py-1 text-white disabled:opacity-40"
          >
            Delete Selected
          </button>
          <button
            onClick={clearAll}
            className="rounded-full bg-gray-600 px-3 py-1 text-white hover:bg-gray-500"
          >
            Remove All
          </button>
          <button
            onClick={undoChanges}
            className="rounded-full bg-yellow-600 px-3 py-1 text-white hover:bg-yellow-500"
          >
            Undo Changes
          </button>
          <button
            onClick={() => onSave(draft)}
            className="rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500"
          >
            Save Calendar
          </button>
        </div>
      </div>
    </section>
  );
}
