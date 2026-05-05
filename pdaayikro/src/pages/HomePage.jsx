import { useEffect, useMemo, useState } from 'react'
import { Bell, Flame } from 'lucide-react'
import StreakModal from '../components/StreakModal'
import useTasks from '../hooks/useTasks'

function HomePage({ user }) {
  const syllabusHint =
    user.currentClass === '9' || user.currentClass === '10'
      ? 'Foundation syllabus activated for your class.'
      : 'JEE syllabus plan activated for your class.'

  const API_BASE_URL = useMemo(() => import.meta.env.VITE_API_BASE_URL || 'http://localhost:5057', [])
  const [streakInfo, setStreakInfo] = useState({ streakCount: user?.streakCount || 0, dailyActiveSeconds: user?.dailyActiveSeconds || 0 })
  const [isStreakOpen, setIsStreakOpen] = useState(false)

  useEffect(() => {
    let isCancelled = false
    async function load() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/streak/${user.id}`)
        const data = await res.json()
        if (!res.ok) return
        if (!isCancelled) {
          setStreakInfo({
            streakCount: data.streakCount || 0,
            dailyActiveSeconds: data.dailyActiveSeconds || 0,
          })
        }
      } catch {
        // ignore
      }
    }
    load()
    const t = setInterval(load, 15000)
    return () => {
      isCancelled = true
      clearInterval(t)
    }
  }, [API_BASE_URL, user.id])

  const streakDays = streakInfo.streakCount
  const minutes = Math.floor((streakInfo.dailyActiveSeconds || 0) / 60)
  const streakLabel = streakDays > 0 ? `${streakDays} day streak` : 'Start streak'

  const { tasks, status: taskStatus, createTask, updateTask, deleteTask } = useTasks(user.id)
  const [goalText, setGoalText] = useState('')

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Study</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsStreakOpen(true)}
            className="group relative grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:cursor-pointer"
            aria-label={streakLabel}
          >
            <Flame size={16} className="text-orange-500" />

            <span className="pointer-events-none absolute right-full top-1/2 mr-2 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm group-hover:inline-flex">
              {streakLabel} · {Math.min(15, minutes)}/15
            </span>
          </button>

          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            title="Notifications"
            aria-label="Notifications"
            onClick={() => {}}
          >
            <Bell size={18} />
          </button>
        </div>
      </div>

      <StreakModal
        isOpen={isStreakOpen}
        onClose={() => setIsStreakOpen(false)}
        streakCount={streakInfo.streakCount}
        dailyActiveSeconds={streakInfo.dailyActiveSeconds}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Your today&apos;s goal</p>
            <p className="mt-1 text-xs text-slate-500">
              Set one task for today. Complete it, delete it, or shift it to tomorrow.
            </p>
          </div>
          <p className="text-xs text-slate-500">{syllabusHint}</p>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            placeholder="Eg. Maths: Quadratic 30 PYQs"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="button"
            onClick={async () => {
              await createTask(goalText)
              setGoalText('')
            }}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Set goal
          </button>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Study Zone</p>
            {taskStatus.loading ? <p className="text-xs text-slate-500">Loading…</p> : null}
          </div>

          {taskStatus.error ? <p className="mt-2 text-sm text-rose-600">{taskStatus.error}</p> : null}

          <div className="mt-3 space-y-2">
            {tasks.length ? (
              tasks.map((t) => (
                <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">{t.title}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateTask(t.id, 'complete')}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                    >
                      Complete
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTask(t.id, 'shiftTomorrow')}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTask(t.id)}
                      className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No goal set for today yet.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
