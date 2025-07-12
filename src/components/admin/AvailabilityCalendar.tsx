// src/components/admin/AvailabilityCalendar.tsx
'use client';

import type { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import type { AvailabilityStatus } from '@prisma/client';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';

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
const FullCalendar = dynamic(
  () => import('@fullcalendar/react'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[400px] animate-pulse">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }
) as React.ComponentType<CalendarOptions>;

/* ─────── Component ─────── */
export default function AvailabilityCalendar({ events, onSave }: Props) {
  /* Local draft of events + currently selected cell */
  const [draft, setDraft]       = useState<CalendarEvent[]>(events);
  const [selected, setSelected] = useState<string | null>(null); // ISO yyyy-mm-dd
  const [isVisible, setIsVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(draft);
    } finally {
      setIsSaving(false);
    }
  };

  /* Build FullCalendar "events" with background-fill colours */
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
        classNames      : [`avail-${status.toLowerCase()}`]
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
    dayHeaderFormat : { weekday: 'short' },
    fixedWeekCount  : false,
    showNonCurrentDates: false,
    dayCellDidMount : (info) => {
      // Base styling
      info.el.classList.add(
        'relative',
        'overflow-hidden',
        'transition-all',
        'duration-300',
        'ease-out'
      );

      const isSelected = selected && info.dateStr === selected;

      // Add appropriate styling based on state
      if (isSelected) {
        info.el.classList.add(
          'ring-2',
          'ring-gold',
          'ring-offset-2',
          'ring-offset-charcoal',
          'scale-[1.02]',
          'shadow-lg'
        );
      } else {
        info.el.classList.add(
          'hover:scale-[1.05]',
          'hover:shadow-md',
          'cursor-pointer'
        );
      }

      // Add chalk texture effect to day number
      const dayNumberEl = info.el.querySelector('.fc-daygrid-day-number');
      if (dayNumberEl) {
        dayNumberEl.classList.add(
          'relative',
          'z-10',
          'font-header',
          'text-lg',
          'transition-colors',
          'duration-300'
        );
      }
    },
  };

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(events);

  return (
    <section 
      className={`flex justify-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      aria-label="Admin availability calendar"
    >
      <div className="w-full max-w-4xl">
        {/* Calendar container */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          {/* Chalk board texture background */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url('/textures/chalk-Menuboard.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Calendar wrapper */}
          <div className="relative bg-charcoal/90 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
            {/* Calendar component */}
            <div className="fc-custom-wrapper rounded-2xl overflow-hidden">
              <FullCalendar {...options} />
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-silver-dark/20">
              <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {[
                  { color: 'bg-avail-open', label: 'Available', icon: '✓' },
                  { color: 'bg-avail-past', label: 'Booked (Past)', icon: '×' },
                  { color: 'bg-avail-future', label: 'Booked (Future)', icon: '★' },
                  { color: 'bg-avail-off', label: 'Day Off', icon: '−' }
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-2 group">
                    <span className={`relative w-4 h-4 ${item.color} rounded-full shadow-sm group-hover:scale-110 transition-transform`}>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold">
                        {item.icon}
                      </span>
                    </span>
                    <span className="text-silver-light/80 text-sm font-body">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-chalk-red/10 rounded-full blur-3xl" />
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap justify-end gap-3 text-sm">
          <button
            onClick={deleteSelected}
            disabled={!selected}
            className="rounded-full bg-chalk-red hover:bg-chalk-red-dark disabled:bg-charcoal-light px-4 py-2 text-silver-light font-header disabled:opacity-40 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          >
            Delete Selected
          </button>
          <button
            onClick={clearAll}
            className="rounded-full bg-charcoal-light hover:bg-charcoal px-4 py-2 text-silver-light font-header transition-all duration-300 hover:scale-105"
          >
            Remove All
          </button>
          <button
            onClick={undoChanges}
            disabled={!hasChanges}
            className="rounded-full bg-gold hover:bg-gold/90 disabled:bg-charcoal-light px-4 py-2 text-charcoal disabled:text-silver-dark font-header disabled:opacity-40 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          >
            Undo Changes
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`rounded-full px-6 py-3 font-header text-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100 ${
              hasChanges && !isSaving
                ? 'bg-emerald-600 hover:bg-emerald-700 text-silver-light shadow-lg' 
                : 'bg-charcoal-light text-silver-dark opacity-40 cursor-not-allowed'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Calendar'}
          </button>
        </div>

        {/* Status indicator */}
        {hasChanges && (
          <div className="text-center mt-4 animate-fade-in">
            <p className="text-gold text-sm font-body">
              You have unsaved changes
            </p>
          </div>
        )}
      </div>

      {/* Add custom styles for FullCalendar - matching user calendar */}
      <style jsx global>{`
        /* Calendar container styling */
        .fc-custom-wrapper .fc {
          font-family: 'BodegaChalk', sans-serif;
          background: transparent;
          color: #F5F1E6;
        }

        /* Header toolbar styling */
        .fc .fc-toolbar {
          padding: 1rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .fc .fc-toolbar-title {
          font-size: 1.5rem;
          font-weight: 600;
          background: linear-gradient(to right, #D4B483, #F5F1E6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform: capitalize;
        }

        @media (min-width: 640px) {
          .fc .fc-toolbar-title {
            font-size: 2rem;
          }
        }

        /* Navigation buttons */
        .fc .fc-button {
          background: #C24032;
          border: none;
          border-radius: 9999px;
          padding: 0.5rem 1rem;
          font-family: 'BodegaChalk', sans-serif;
          color: #F5F1E6;
          transition: all 0.3s;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .fc .fc-button:hover:not(:disabled) {
          background: #8E2A20;
          transform: scale(1.05);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .fc .fc-button:disabled {
          background: #6b7280;
          opacity: 0.5;
          cursor: not-allowed;
        }

        .fc .fc-button-active {
          background: #8E2A20 !important;
        }

        /* Day grid styling */
        .fc .fc-daygrid {
          border: none;
          background: rgba(42, 42, 38, 0.4);
          border-radius: 1rem;
          overflow: hidden;
          backdrop-filter: blur(8px);
        }

        .fc .fc-scrollgrid {
          border: none;
        }

        .fc .fc-scrollgrid-section > td {
          border: none;
        }

                /* Day header styling */
        .fc .fc-col-header-cell {
          background: rgba(194, 64, 50, 0.1);
          padding: 0.75rem 0;
          border: none;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
          color: #D4B483;
        }

        /* Day cell styling */
        .fc .fc-daygrid-day {
          border: 1px solid rgba(194, 188, 176, 0.1);
          padding: 0.25rem;
          background: rgba(27, 27, 24, 0.4);
          transition: all 0.3s ease;
          min-height: 3.5rem;
        }

        @media (min-width: 640px) {
          .fc .fc-daygrid-day {
            min-height: 4.5rem;
          }
        }

        .fc .fc-daygrid-day:hover {
          background: rgba(212, 180, 131, 0.1);
          border-color: rgba(212, 180, 131, 0.3);
        }

        /* Day number styling */
        .fc .fc-daygrid-day-number {
          color: #F5F1E6;
          font-size: 1rem;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 640px) {
          .fc .fc-daygrid-day-number {
            font-size: 1.125rem;
          }
        }

        /* Event background colors - full cell coverage */
        .fc .fc-daygrid-day.fc-day-today {
          background: rgba(212, 180, 131, 0.15);
          border-color: rgba(212, 180, 131, 0.3);
        }

        .fc .fc-bg-event {
          opacity: 0.9;
          border-radius: 0.375rem;
        }

        /* Specific day state styling */
        .fc .fc-daygrid-day-frame {
          min-height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Available days */
        .fc .fc-event.avail-open {
          background: #2563eb !important;
        }

        /* Booked days */
        .fc .fc-event.avail-booked {
          background: #dc2626 !important;
        }

        /* Off days */
        .fc .fc-event.avail-off {
          background: #6b7280 !important;
        }

        /* Other month days */
        .fc .fc-day-other {
          opacity: 0.3;
        }

        /* Remove default borders */
        .fc th, .fc td {
          border: none;
        }

        .fc .fc-scrollgrid-sync-table {
          border: none;
        }

        /* Mobile responsiveness */
        @media (max-width: 639px) {
          .fc .fc-toolbar {
            font-size: 0.875rem;
          }
          
          .fc .fc-button {
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
          }
          
          .fc .fc-col-header-cell {
            font-size: 0.75rem;
            padding: 0.5rem 0;
          }
        }

        /* Animation for fade-in */
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        /* Custom scrollbar for calendar */
        .fc-scroller {
          scrollbar-width: thin;
          scrollbar-color: #D4B483 #2A2A26;
        }

        .fc-scroller::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .fc-scroller::-webkit-scrollbar-track {
          background: #2A2A26;
          border-radius: 4px;
        }

        .fc-scroller::-webkit-scrollbar-thumb {
          background: #D4B483;
          border-radius: 4px;
        }

        .fc-scroller::-webkit-scrollbar-thumb:hover {
          background: #C24032;
        }
      `}</style>
    </section>
  );
}