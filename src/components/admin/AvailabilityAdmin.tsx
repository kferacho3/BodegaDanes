'use client';

import { format, parse } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import type { Availability } from '@/app/book/bookingForm/BookingWizard';

/* ---------- local types ---------- */
type AvailabilityStatus = 'OPEN' | 'OFF' | 'BOOKED';

interface Row extends Omit<Availability, 'services'> {
  services?: Availability['services'];   // may be undefined
}

interface Props { initialData: Row[] }

/* ---------- util ---------- */
const keyFromDate = (d: Date) => format(d, 'yyyy-MM-dd');
const dateFromKey = (k: string) => parse(k, 'yyyy-MM-dd', new Date());

/* ===================================================================
   Component
   =================================================================== */
export default function AvailabilityAdmin({ initialData }: Props) {
  const [map,   setMap]   = useState<Record<string, AvailabilityStatus>>({});
  const [month, setMonth] = useState(new Date());
  const [dirty, setDirty] = useState(false);          // unsaved edits

  /* hydrate once -------------------------------------------------- */
  useEffect(() => {
    const m: Record<string, AvailabilityStatus> = {};
    initialData.forEach(r => { m[r.date] = r.status; });
    setMap(m);
  }, [initialData]);

  /* click = cycle THROUGH OFF → OPEN → BOOKED → OFF -------------- */
  function onDayClick(d: Date) {
    const k   = keyFromDate(d);
    const cur = map[k] ?? 'OFF';
    const nxt: AvailabilityStatus = cur === 'OFF' ? 'OPEN' : cur === 'OPEN' ? 'BOOKED' : 'OFF';
    setMap(p => ({ ...p, [k]: nxt }));
    setDirty(true);
  }

  /* save all ------------------------------------------------------ */
  async function saveAll() {
    const body = Object.entries(map).map(([date, status]) => ({ date, status }));
    const ok   = await fetch('/api/availability', {
      method :'PUT',
      headers:{ 'Content-Type':'application/json' },
      body   : JSON.stringify(body),
    }).then(r => r.ok);
    if (ok) { setDirty(false); alert('Availability saved ✔'); }
    else   { alert('Save failed – check console'); }
  }

  /* clear all ----------------------------------------------------- */
  async function clearAll() {
    if (!confirm('Remove ALL availability?')) return;
    const ok = await fetch('/api/availability', { method:'DELETE' }).then(r => r.ok);
    if (ok) { setMap({}); setDirty(false); alert('All availability cleared'); }
  }

  /* colour helpers ------------------------------------------------ */
  const toDates = (s: AvailabilityStatus) =>
    Object.entries(map).filter(([,v])=>v===s).map(([d])=>dateFromKey(d));

  const openDates   = useMemo(()=>toDates('OPEN')  , [map]);
  const bookedDates = useMemo(()=>toDates('BOOKED'), [map]);
  const offDates    = useMemo(()=>toDates('OFF')   , [map]);

  /* render -------------------------------------------------------- */
  return (
    <>
      {/* top bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <button onClick={()=>setMonth(new Date(month.getFullYear(), month.getMonth()-1, 1))}>‹ Prev</button>
          <h3 className="font-header text-lg">{format(month,'MMMM yyyy')}</h3>
          <button onClick={()=>setMonth(new Date(month.getFullYear(), month.getMonth()+1, 1))}>Next ›</button>
        </div>
        <div className="flex items-center gap-3">
          <button disabled={!dirty} onClick={saveAll}  className="rounded-full bg-emerald-600 px-4 py-1 text-sm disabled:opacity-40">Save</button>
          <button onClick={clearAll}                    className="rounded-full bg-red-600 px-4 py-1 text-sm">Clear all</button>
        </div>
      </div>

      {/* calendar */}
      <DayPicker
        mode="single"
        month={month}
        onMonthChange={setMonth}
        onDayClick={onDayClick}
        showOutsideDays
        fixedWeeks
        modifiers={{ open:openDates, booked:bookedDates, disabled:offDates }}
        modifiersClassNames={{
          open    :'bg-blue-600 text-white',
          booked  :'bg-emerald-500 text-white',
          disabled:'bg-gray-400 text-white opacity-60',
        }}
        disabled={d => map[keyFromDate(d)] === 'OFF'}   // OFF is grey & unclickable
        classNames={{
          caption_label:'font-header text-lg',
          head_cell    :'text-center font-header text-xs text-gray-600',
          day          :'h-10 w-10 items-center justify-center rounded-full',
          day_today    :'ring-2 ring-chalk-red',
        }}
      />
    </>
  );
}
