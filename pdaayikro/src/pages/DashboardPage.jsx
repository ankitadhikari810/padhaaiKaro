import { useMemo, useState } from 'react'
import useTasks from '../hooks/useTasks'

function isoToday() {
  return new Date().toISOString().slice(0, 10)
}

function DashboardPage({ user }) {
  const streakBlocks = [70, 65, 72, 58, 68, 82, 74, 60, 76, 67, 64, 80, 73, 69]
  const today = useMemo(() => isoToday(), [])
  const { tasks, status: taskStatus, updateTask, deleteTask } = useTasks(user.id, today)
  const [toast, setToast] = useState('')
  const scoreList = [
    ['JEE Mains Mock #12', '212 / 300', 'text-lime-400'],
    ['JEE Adv. Mock #7', '156 / 306', 'text-amber-300'],
    ['JEE Mains Mock #11', '188 / 300', 'text-yellow-300'],
    ['Physics PYQ Set', '74 / 100', 'text-lime-400'],
    ['Chemistry Mock #5', '61 / 100', 'text-rose-400'],
  ]
  const progress = [
    ['Physics', 62, 'bg-sky-500'],
    ['Chemistry', 78, 'bg-lime-500'],
    ['Mathematics', 49, 'bg-amber-500'],
  ]

  return (
    <section className="space-y-4 text-slate-100">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Study streak" value="14 days" subtext="Personal best: 21" color="text-amber-400" />
        <MetricCard title="Hours today" value="6.5 h" subtext="Goal: 8 h" color="text-lime-500" />
        <MetricCard title="Tasks done" value="4 / 7" subtext="57% complete" color="text-slate-100" />
        <MetricCard title="Mock avg (last 5)" value="168 / 300" subtext="Up 12 from last week" color="text-amber-400" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Today's tasks</h2>
            {taskStatus.loading ? <p className="text-xs text-slate-400">Loading…</p> : null}
          </div>
          {taskStatus.error ? <p className="mb-3 text-sm text-rose-300">{taskStatus.error}</p> : null}
          <div className="space-y-2">
            {tasks.length ? (
              tasks.map((t) => (
                <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-2">
                  <p className="text-sm text-slate-100">{t.title}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await updateTask(t.id, 'complete')
                        setToast('Task completed')
                        setTimeout(() => setToast(''), 1200)
                      }}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                    >
                      Complete
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await updateTask(t.id, 'shiftTomorrow')
                        setToast('Shifted to tomorrow')
                        setTimeout(() => setToast(''), 1200)
                      }}
                      className="rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-950/70"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteTask(t.id)
                        setToast('Task deleted')
                        setTimeout(() => setToast(''), 1200)
                      }}
                      className="rounded-lg border border-rose-400/30 bg-slate-950/40 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No tasks for today. Set a goal from Study.</p>
            )}
          </div>
        </article>

        <div className="space-y-4">
          <article className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
            <h3 className="text-lg font-semibold">Study streak</h3>
            <p className="mt-2 text-5xl text-amber-400">14</p>
            <p className="text-slate-300">days in a row</p>
            <div className="mt-4 grid grid-cols-7 gap-1">
              {streakBlocks.map((opacity, idx) => (
                <div key={idx} className="h-4 rounded bg-lime-500" style={{ opacity: opacity / 100 }} />
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">Last 14 days of study activity</p>
          </article>

          <article className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
            <h3 className="text-lg font-semibold">Syllabus progress</h3>
            <div className="mt-3 space-y-3">
              {progress.map(([subject, value, barClass]) => (
                <div key={subject}>
                  <div className="mb-1 flex justify-between text-sm text-slate-300">
                    <span>{subject}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700">
                    <div className={`h-full rounded-full ${barClass}`} style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      {toast ? (
        <div className="fixed bottom-5 right-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 shadow-lg">
          {toast}
        </div>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
          <h3 className="mb-4 text-lg font-semibold">Recent mock scores</h3>
          <div className="space-y-2">
            {scoreList.map(([label, score, tone]) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-slate-900/50 px-3 py-2">
                <span className="text-sm text-slate-200">{label}</span>
                <span className={`font-semibold ${tone}`}>{score}</span>
              </div>
            ))}
          </div>
        </article>

        <div className="space-y-4">
          <article className="rounded-2xl bg-violet-100 p-4 text-slate-700">
            <h3 className="font-semibold">AI study buddy suggestion</h3>
            <p className="mt-2 text-sm">
              You've been weak in <strong>Sequences & Series</strong> for 3 weeks. Spend 90 mins on it before
              today's mock - your rank can jump 2000+ spots.
            </p>
            <button className="mt-4 rounded-lg bg-white/80 px-4 py-2 text-sm font-semibold text-violet-700">
              Build my plan
            </button>
          </article>

          <article className="rounded-2xl bg-rose-100 p-4 text-rose-900">
            <h3 className="font-semibold">JEE Advanced countdown</h3>
            <p className="mt-2 text-5xl font-bold">38</p>
            <p>days remaining</p>
            <p className="mt-2 text-sm">War mode: HIGH intensity</p>
            <div className="mt-3 h-2 rounded-full bg-rose-200">
              <div className="h-full w-3/4 rounded-full bg-orange-500" />
            </div>
          </article>
        </div>
      </section>
    </section>
  )
}

function MetricCard({ title, value, subtext, color }) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`mt-1 text-4xl font-semibold ${color}`}>{value}</p>
      <p className="text-sm text-slate-400">{subtext}</p>
    </article>
  )
}

export default DashboardPage
