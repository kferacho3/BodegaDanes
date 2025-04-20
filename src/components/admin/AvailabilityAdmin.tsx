'use client';

import { format, isBefore, startOfToday } from 'date-fns';
import { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export type AvailabilityStatus = 'OPEN' | 'OFF' | 'BOOKED';

interface Props {
  initialData: { date: Date; status: AvailabilityStatus }[];
}

export default function AvailabilityAdmin({ initialData }: Props) {
  const [map, setMap] = useState<Record<string, AvailabilityStatus>>({});
  const [month, setMonth] = useState(new Date());

  /* hydrate map */
  useEffect(() => {
    const m: Record<string, AvailabilityStatus> = {};
    initialData.forEach(({ date, status }) => {
      m[format(date, 'yyyy-MM-dd')] = status;
    });
    setMap(m);
  }, [initialData]);

  /* toggle handler */
  const handleDayClick = (date: Date) => {
    if (isBefore(date, startOfToday())) return;
    const key = format(date, 'yyyy-MM-dd');
    const current = map[key] ?? 'OFF';
    const next = current === 'OPEN' ? 'OFF' : 'OPEN';

    fetch('/api/availability', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: key, status: next }),
    }).then(() => setMap((p) => ({ ...p, [key]: next })));
  };

  /* helper */
  const toDates = (s: AvailabilityStatus) =>
    Object.entries(map)
      .filter(([, st]) => st === s)
      .map(([d]) => new Date(d));

  const available = toDates('OPEN');
  const booked    = toDates('BOOKED');
  const off       = toDates('OFF');

  return (
    <div>
      {/* month nav */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
          ‹ Prev
        </button>
        <h3 className="font-header text-lg">{format(month, 'MMMM yyyy')}</h3>
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
          Next ›
        </button>
      </div>

      <DayPicker
        mode="single"
        month={month}
        onMonthChange={setMonth}
        selected={undefined}
        onDayClick={handleDayClick}
        fromDate={startOfToday()}
        fixedWeeks
        showOutsideDays
        modifiers={{ available, booked, disabled: off }}
        modifiersClassNames={{
          available: 'bg-emerald-500 text-white',
          booked:    'bg-red-600 text-white cursor-not-allowed',
          disabled:  'bg-gray-500 text-white opacity-50 cursor-not-allowed',
        }}
        disabled={(d) => map[format(d, 'yyyy-MM-dd')] === 'BOOKED'}
        className="mx-auto font-header"
        /* *** NO row / table overrides => 7‑column grid works everywhere *** */
        classNames={{
          caption_label : 'font-header text-lg',
          head_cell     : 'text-center font-header text-xs text-gray-600',
          day           : 'h-10 w-10 items-center justify-center rounded-full',
          day_selected  : 'bg-chalk-red text-white',
          day_today     : 'ring-2 ring-chalk-red',
        }}
      />
    </div>
  );
}
