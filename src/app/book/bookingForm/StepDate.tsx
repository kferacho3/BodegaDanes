// src/components/book/bookingForm/StepDate.tsx
'use client';

import type { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { format, parse, startOfToday } from 'date-fns';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { Availability } from './BookingWizard';

/* ─────── helper – convert "YYYY‑MM‑DD" <‑> Date (local) ─────── */
const fromKey = (k: string) => parse(k, 'yyyy-MM-dd', new Date());

/* ─────── FullCalendar dynamic import (SSR disabled) ─────── */
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

interface Props {
  availability : Availability[];
  selectedDate : string | undefined;   // initial selection from form state
  onNext       : () => void;
}

/* ───────────────────────── Component ───────────────────────── */
export default function StepDate({ availability, selectedDate, onNext }: Props) {
  const { setValue }      = useFormContext();
  const [chosen, setChosen] = useState<string | undefined>(selectedDate); // yyyy‑MM‑dd
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
          classNames     : ['avail-open']
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
        classNames     : ['avail-past']
      }),
    );

    // OFF (gray – rendered but not in legend)
    buckets.off.forEach((d) =>
      arr.push({
        start          : d,
        allDay         : true,
        display        : 'background',
        backgroundColor: '#6b7280',
        classNames     : ['avail-off']
      }),
    );

    // USER‑SELECTED (green)  – if any
    if (chosen) {
      arr.push({
        start          : fromKey(chosen),
        allDay         : true,
        display        : 'background',
        backgroundColor: '#10b981',
        classNames     : ['avail-future']
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
    dayHeaderFormat: { weekday: 'short' },
    fixedWeekCount: false,
    showNonCurrentDates: false,
    dayCellDidMount(info) {
      // Base styling
      info.el.classList.add(
        'relative',
        'overflow-hidden',
        'transition-all',
        'duration-300',
        'ease-out'
      );

      const isOpen = openKeySet.has(info.date.toDateString());
      const isChosen = chosen && info.dateStr === chosen;

      // Add appropriate styling based on state
      if (isChosen) {
        info.el.classList.add(
          'ring-2',
          'ring-gold',
          'ring-offset-2',
          'ring-offset-charcoal',
          'scale-[1.02]',
          'shadow-lg'
        );
      } else if (isOpen) {
        info.el.classList.add(
          'hover:scale-[1.05]',
          'hover:shadow-md',
          'cursor-pointer'
        );
      } else {
        info.el.classList.add(
          'cursor-not-allowed',
          'opacity-60'
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

  /* ---------- render ---------- */
  return (
    <section 
      className={`space-y-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      aria-label="Date selection step"
    >
      {/* Enhanced header */}
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-16 sm:w-24" />
          <span className="text-gold font-display text-sm uppercase tracking-wider">Step 1</span>
          <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-16 sm:w-24" />
        </div>
        
        <h2 className="font-header text-3xl sm:text-4xl lg:text-5xl">
          <span 
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `url('/textures/chalk-white.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(1.1)',
            }}
          >
            Choose Your Date
          </span>
        </h2>
        
        <p className="text-silver-light/80 max-w-md mx-auto">
          Select an available date for your bodega experience. Green days are open for booking.
        </p>
      </header>

      {/* Enhanced calendar container */}
      <div className="mx-auto w-full max-w-4xl">
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

            {/* Enhanced legend */}
            <div className="mt-6 pt-6 border-t border-silver-dark/20">
              <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {[
                  { color: 'bg-avail-open', label: 'Available', icon: '✓' },
                  { color: 'bg-avail-past', label: 'Booked', icon: '×' },
                  { color: 'bg-avail-future', label: 'Your Selection', icon: '★' }
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
      </div>

      {/* Enhanced CTA button */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          disabled={!chosen}
          onClick={onNext}
          className={`
            group relative px-10 py-4 rounded-full font-header text-lg
            bg-chalk-red text-silver-light shadow-xl
            hover:bg-chalk-red-dark hover:shadow-2xl hover:scale-105
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
            transition-all duration-300 overflow-hidden
          `}
          aria-label="Proceed to next step"
        >
          <span className="relative z-10 flex items-center gap-2">
            <span>Continue to Services</span>
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-chalk-red-dark to-chalk-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </button>
      </div>

      {/* Selected date display */}
      {chosen && (
        <div 
          className="text-center mt-4 animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <p className="text-silver-light/70 text-sm">
            Selected date: <span className="text-gold font-semibold">
              {format(fromKey(chosen), 'EEEE, MMMM do, yyyy')}
            </span>
          </p>
        </div>
      )}

      {/* Add custom styles for FullCalendar */}
            {/* Add custom styles for FullCalendar */}
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
        .fc .fc-event.avail-past {
          background: #dc2626 !important;
        }

        /* Selected day */
        .fc .fc-event.avail-future {
          background: #10b981 !important;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
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