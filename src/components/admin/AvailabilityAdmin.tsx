'use client'

import {
  format,
  isBefore,
  parse,
  startOfToday,
} from 'date-fns'
import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

/* ---------- types ---------- */
type AvailabilityStatus = 'OPEN' | 'OFF' | 'BOOKED'
type Row = { date: Date; status: AvailabilityStatus }
interface Props { initialData: Row[] }

/* ---------- util ---------- */
const keyFromDate = (d: Date) => format(d, 'yyyy-MM-dd')
const dateFromKey = (k: string) =>
  /* local-time midnight, not UTC → no TZ shift */
  parse(k, 'yyyy-MM-dd', new Date())

/* ===================================================================
   Component
   =================================================================== */
export default function AvailabilityAdmin ({ initialData }: Props) {
  /* state maps YYYY-MM-DD → status  ------------------------------- */
  const [map,   setMap]   = useState<Record<string, AvailabilityStatus>>({})
  const [month, setMonth] = useState(new Date())
  const [dirty, setDirty] = useState(false)   // track unsaved edits

  /* hydrate once -------------------------------------------------- */
  useEffect(() => {
    const m: Record<string, AvailabilityStatus> = {}
    initialData.forEach(r => { m[keyFromDate(r.date)] = r.status })
    setMap(m)
  }, [initialData])

  /* click --------------------------------------------------------- */
  async function onDayClick (d: Date) {
    if (isBefore(d, startOfToday())) return
    const k    = keyFromDate(d)
    const next = (map[k] ?? 'OFF') === 'OPEN' ? 'OFF' : 'OPEN'
    setMap(p => ({ ...p, [k]: next }))
    setDirty(true)
  }

  /* bulk save ----------------------------------------------------- */
  async function saveAll () {
    const body = Object.entries(map).map(([date, status]) => ({ date, status }))
    await fetch('/api/availability', {
      method : 'PUT',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify(body),
    })
    setDirty(false)
    alert('Availability saved ✔')
  }

  /* clear --------------------------------------------------------- */
  async function clearAll () {
    if (!confirm('Remove ALL availability?')) return
    await fetch('/api/availability', { method:'DELETE' })
    setMap({})
    setDirty(false)
  }

  /* colour helpers ----------------------------------------------- */
  const toDates = (s: AvailabilityStatus) =>
    Object.entries(map)
      .filter(([, st]) => st === s)
      .map(([d]) => dateFromKey(d))

  const open   = toDates('OPEN')      // blue
  const booked = toDates('BOOKED')    // green
  const off    = toDates('OFF')       // grey

  /* --------------------------------------------------------------- */
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
            }
          >‹ Prev</button>

          <h3 className="font-header text-lg">
            {format(month, 'MMMM yyyy')}
          </h3>

          <button
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
          >Next ›</button>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={!dirty}
            onClick={saveAll}
            className="rounded-full bg-emerald-600 px-4 py-1 text-sm disabled:opacity-40"
          >
            Save availability
          </button>
          <button
            onClick={clearAll}
            className="rounded-full bg-red-600 px-4 py-1 text-sm"
          >
            Clear all
          </button>
        </div>
      </div>

      <DayPicker
        mode="single"
        month={month}
        onMonthChange={setMonth}
        fromDate={startOfToday()}
        onDayClick={onDayClick}
        showOutsideDays
        fixedWeeks
        modifiers={{ open, booked, disabled: off }}
        modifiersClassNames={{
          open    : 'bg-blue-600 text-white',
          booked  : 'bg-emerald-500 text-white',
          disabled: 'bg-gray-400 text-white opacity-60',
        }}
        disabled={d => map[keyFromDate(d)] === 'BOOKED'}
        classNames={{
          caption_label:'font-header text-lg',
          head_cell    :'text-center font-header text-xs text-gray-600',
          day          :'h-10 w-10 items-center justify-center rounded-full',
          day_today    :'ring-2 ring-chalk-red',
        }}
      />
    </>
  )
}
