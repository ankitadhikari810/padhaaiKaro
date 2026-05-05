import { useEffect, useMemo, useState } from 'react'
const COUNTRY_CODE = 'IN'

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1)
}

function toISODate(date) {
  return date.toISOString().slice(0, 10)
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getMondayFirstIndex(date) {
  // JS: 0=Sun..6=Sat. Convert to 0=Mon..6=Sun
  const d = date.getDay()
  return (d + 6) % 7
}

function CalendarPage({ user }) {
  const today = useMemo(() => new Date(), [])
  const [activeMonth, setActiveMonth] = useState(() => startOfMonth(today))
  const [selectedDate, setSelectedDate] = useState(() => today)
  const [holidayByIso, setHolidayByIso] = useState({})
  const [status, setStatus] = useState({ loading: false, error: '' })

  const monthLabel = useMemo(
    () => activeMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    [activeMonth],
  )

  const weekDays = useMemo(() => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], [])

  const monthDays = useMemo(() => {
    const start = startOfMonth(activeMonth)
    const end = endOfMonth(activeMonth)
    const leadingBlanks = getMondayFirstIndex(start)
    const totalDays = end.getDate()

    const cells = []
    for (let i = 0; i < leadingBlanks; i += 1) cells.push(null)
    for (let day = 1; day <= totalDays; day += 1) cells.push(new Date(start.getFullYear(), start.getMonth(), day))
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [activeMonth])

  const selectedIso = useMemo(() => toISODate(selectedDate), [selectedDate])
  const selectedHolidays = holidayByIso[selectedIso] || []

  useEffect(() => {
    let isCancelled = false

    async function loadHolidays() {
      const year = activeMonth.getFullYear()
      const cacheKey = `holidays-${COUNTRY_CODE}-${year}`

      try {
        setStatus({ loading: true, error: '' })

        const cached = sessionStorage.getItem(cacheKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (!isCancelled) {
            setHolidayByIso((prev) => ({ ...prev, ...parsed }))
            setStatus({ loading: false, error: '' })
          }
          return
        }

        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${COUNTRY_CODE}`)
        if (!response.ok) throw new Error('Holiday API failed')
        const data = await response.json()

        const byIso = data.reduce((acc, item) => {
          const iso = item.date
          const entry = {
            name: item.localName || item.name,
            type: item.type || 'Holiday',
          }
          acc[iso] = acc[iso] ? [...acc[iso], entry] : [entry]
          return acc
        }, {})

        sessionStorage.setItem(cacheKey, JSON.stringify(byIso))
        if (!isCancelled) {
          setHolidayByIso((prev) => ({ ...prev, ...byIso }))
          setStatus({ loading: false, error: '' })
        }
      } catch (e) {
        if (!isCancelled) setStatus({ loading: false, error: e?.message || 'Failed to load holidays' })
      }
    }

    loadHolidays()
    return () => {
      isCancelled = true
    }
  }, [activeMonth])

  return (
    <section className="space-y-4 text-slate-100">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Calendar</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{monthLabel}</h2>
              {status.error ? <p className="mt-1 text-sm text-rose-300">{status.error}</p> : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveMonth((m) => addMonths(m, -1))}
                className="rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900/70"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMonth(startOfMonth(today))
                  setSelectedDate(today)
                }}
                className="rounded-lg bg-amber-200 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-amber-100"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setActiveMonth((m) => addMonths(m, 1))}
                className="rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900/70"
              >
                Next
              </button>

              <input
                type="month"
                value={`${activeMonth.getFullYear()}-${String(activeMonth.getMonth() + 1).padStart(2, '0')}`}
                onChange={(e) => {
                  const [y, mo] = e.target.value.split('-').map(Number)
                  if (!y || !mo) return
                  setActiveMonth(new Date(y, mo - 1, 1))
                }}
                className="rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-amber-300/40"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2">
            {weekDays.map((label) => (
              <div key={label} className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {label}
              </div>
            ))}

            {monthDays.map((cell, idx) => {
              if (!cell) {
                return <div key={`blank-${idx}`} className="h-20 rounded-xl border border-transparent" />
              }

              const iso = toISODate(cell)
              const holidays = holidayByIso[iso] || []
              const isToday = isSameDay(cell, today)
              const isSelected = isSameDay(cell, selectedDate)
              const isWeekend = cell.getDay() === 0 || cell.getDay() === 6

              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedDate(cell)}
                  className={[
                    'h-20 rounded-xl border p-2 text-left transition',
                    isSelected ? 'border-amber-300 bg-amber-200/15' : 'border-slate-700 bg-slate-900/30 hover:bg-slate-900/60',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={isWeekend ? 'text-sm font-semibold text-slate-200' : 'text-sm font-semibold text-white'}>
                      {cell.getDate()}
                    </p>
                    {isToday ? (
                      <span className="rounded-full bg-lime-400/15 px-2 py-0.5 text-[11px] font-semibold text-lime-300">
                        Today
                      </span>
                    ) : null}
                  </div>

                  {holidays.length ? (
                    <p className="mt-2 line-clamp-2 text-xs text-rose-200">
                      {holidays[0].name}
                      {holidays.length > 1 ? ` +${holidays.length - 1}` : ''}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">{isWeekend ? 'Weekend' : 'Study day'}</p>
                  )}
                </button>
              )
            })}
          </div>
        </article>

        <aside className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
          <p className="text-sm text-slate-400">Selected</p>
          <h3 className="mt-1 text-xl font-semibold text-white">
            {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h3>

          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/30 p-3">
            <p className="text-sm font-semibold text-slate-200">Holidays (real-time API)</p>
            {selectedHolidays.length ? (
              <ul className="mt-2 space-y-2">
                {selectedHolidays.map((h) => (
                  <li key={`${selectedIso}-${h.name}`} className="rounded-lg bg-rose-500/10 px-3 py-2">
                    <p className="text-sm font-semibold text-rose-100">{h.name}</p>
                    <p className="text-xs text-rose-200/80">{h.type}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-400">No holiday found for this date.</p>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/30 p-3">
            <p className="text-sm font-semibold text-slate-200">Quick jump</p>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="date"
                value={selectedIso}
                onChange={(e) => {
                  const value = e.target.value
                  if (!value) return
                  const d = new Date(`${value}T00:00:00`)
                  setSelectedDate(d)
                  setActiveMonth(startOfMonth(d))
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-amber-300/40"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Data source: Nager.Date public holidays for {COUNTRY_CODE}.
            </p>
          </div>
        </aside>
      </section>
    </section>
  )
}

export default CalendarPage

