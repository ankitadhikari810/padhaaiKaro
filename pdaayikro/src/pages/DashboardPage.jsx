import { useMemo, useState } from 'react'
import useTasks from '../hooks/useTasks'

function isoToday() {
  return new Date().toISOString().slice(0, 10)
}

// ─── Mock time-spent data (replace with real API data later) ──────────────────
const TIME_STATS = [
  { label: 'Mock Tests',  minutes: 90,  icon: '📝' },
  { label: 'Goals',       minutes: 45,  icon: '🎯' },
  { label: 'Tasks',       minutes: 60,  icon: '✅' },
  { label: 'Revision',    minutes: 75,  icon: '📖' },
]

function totalMinutes(stats) {
  return stats.reduce((sum, s) => sum + s.minutes, 0)
}

function fmtTime(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

// ─── Info Banner ──────────────────────────────────────────────────────────────
function InfoBanner() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-600/50 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-300">
      <div className="flex items-center gap-2.5">
        <span className="text-sky-400 text-base" aria-hidden="true">ℹ️</span>
        <span>It may take up to <strong className="text-slate-100 font-semibold">24 hours</strong> for your progress to get reflected on the dashboard.</span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss notice"
        className="ml-2 shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
      >
        ✕
      </button>
    </div>
  )
}

// ─── Progress Insight Section ─────────────────────────────────────────────────
function InsightCard({ label, minutes, icon }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-3">
      <span className="text-lg" aria-hidden="true">{icon}</span>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-lg font-semibold text-slate-100">{fmtTime(minutes)}</p>
    </div>
  )
}

function ProgressInsights({ stats }) {
  const total = totalMinutes(stats)
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
      {/* Header row */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Today's activity</h2>
          <p className="text-xs text-slate-400 mt-0.5">Your learning breakdown for today</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-400">{fmtTime(total)}</p>
          <p className="text-xs text-slate-400">total today</p>
        </div>
      </div>

      {/* Mini progress bar */}
      <div className="mb-4 flex h-2 w-full overflow-hidden rounded-full bg-slate-700">
        {stats.map((s, i) => {
          const colors = ['bg-sky-500', 'bg-lime-500', 'bg-amber-400', 'bg-violet-400']
          return (
            <div
              key={s.label}
              className={`h-full ${colors[i % colors.length]} transition-all`}
              style={{ width: `${Math.round((s.minutes / total) * 100)}%` }}
              title={`${s.label}: ${fmtTime(s.minutes)}`}
            />
          )
        })}
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((s) => (
          <InsightCard key={s.label} {...s} />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3">
        {stats.map((s, i) => {
          const colors = ['text-sky-400', 'text-lime-400', 'text-amber-400', 'text-violet-400']
          return (
            <span key={s.label} className={`flex items-center gap-1 text-xs ${colors[i % colors.length]}`}>
              <span className="inline-block h-2 w-2 rounded-full bg-current" />
              {s.label}
            </span>
          )
        })}
      </div>
    </article>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
function DashboardPage({ user }) {
  // streak blocks — replace with real data later; [] means no activity
  const streakBlocks = [70, 65, 72, 58, 68, 82, 74, 60, 76, 67, 64, 80, 73, 69]
  const currentStreak = streakBlocks.length > 0 ? 14 : 0

  const today = useMemo(() => isoToday(), [])
  const { tasks, status: taskStatus, updateTask, deleteTask } = useTasks(user.id, today)
  const [toast, setToast] = useState('')

  // Scores — empty array = no tests attempted yet
  const scoreList = [
    ['JEE Mains Mock #12', '212 / 300', 'text-lime-400'],
    ['JEE Adv. Mock #7',   '156 / 306', 'text-amber-300'],
    ['JEE Mains Mock #11', '188 / 300', 'text-yellow-300'],
    ['Physics PYQ Set',    '74 / 100',  'text-lime-400'],
    ['Chemistry Mock #5',  '61 / 100',  'text-rose-400'],
  ]
  const hasTests = scoreList.length > 0

  const progress = [
    ['Physics',     62, 'bg-sky-500'],
    ['Chemistry',   78, 'bg-lime-500'],
    ['Mathematics', 49, 'bg-amber-500'],
  ]

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 1200)
  }

  return (
    <section className="space-y-4 text-slate-100">

      {/* 1 ── Informational banner */}
      <InfoBanner />

      {/* 2 ── Progress insights */}
      <ProgressInsights stats={TIME_STATS} />

      {/* 3 ── Metric cards */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Study streak"      value={`${currentStreak} days`} subtext="Personal best: 21"      color="text-amber-400" />
        <MetricCard title="Hours today"       value="6.5 h"                   subtext="Goal: 8 h"              color="text-lime-500"  />
        <MetricCard title="Tasks done"        value="4 / 7"                   subtext="57% complete"           color="text-slate-100" />
        <MetricCard title="Mock avg (last 5)" value="168 / 300"               subtext="Up 12 from last week"   color="text-amber-400" />
      </section>

      {/* 4 ── Tasks + Streak / Progress */}
      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">

        {/* Tasks */}
        <article className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Today's tasks</h2>
            {taskStatus.loading ? <p className="text-xs text-slate-400">Loading…</p> : null}
          </div>
          {taskStatus.error ? <p className="mb-3 text-sm text-rose-300">{taskStatus.error}</p> : null}
          <div className="space-y-2">
            {tasks.length ? (
              tasks.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-2"
                >
                  <p className="text-sm text-slate-100">{t.title}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => { await updateTask(t.id, 'complete'); showToast('Task completed') }}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                    >Complete</button>
                    <button
                      type="button"
                      onClick={async () => { await updateTask(t.id, 'shiftTomorrow'); showToast('Shifted to tomorrow') }}
                      className="rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-950/70"
                    >Tomorrow</button>
                    <button
                      type="button"
                      onClick={async () => { await deleteTask(t.id); showToast('Task deleted') }}
                      className="rounded-lg border border-rose-400/30 bg-slate-950/40 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/10"
                    >Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No tasks for today. Set a goal from Study.</p>
            )}
          </div>
        </article>

        {/* Streak + Syllabus */}
        <div className="space-y-4">
          <article className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
            <h3 className="text-lg font-semibold">Study streak</h3>
            <p className={`mt-2 text-5xl ${currentStreak > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
              {currentStreak}
            </p>
            <p className="text-slate-300">{currentStreak > 0 ? 'days in a row' : 'Start studying to begin your streak!'}</p>
            {currentStreak > 0 ? (
              <>
                <div className="mt-4 grid grid-cols-7 gap-1">
                  {streakBlocks.map((opacity, idx) => (
                    <div key={idx} className="h-4 rounded bg-lime-500" style={{ opacity: opacity / 100 }} />
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-400">Last {streakBlocks.length} days of study activity</p>
              </>
            ) : (
              <div className="mt-4 grid grid-cols-7 gap-1">
                {Array.from({ length: 14 }).map((_, idx) => (
                  <div key={idx} className="h-4 rounded bg-slate-700" style={{ opacity: 0.4 }} />
                ))}
              </div>
            )}
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

      {/* Toast */}
      {toast ? (
        <div className="fixed bottom-5 right-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 shadow-lg">
          {toast}
        </div>
      ) : null}

      {/* 5 ── Mock scores + AI buddy / countdown */}
      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">

        {/* Recent mock scores */}
        <article className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
          <h3 className="mb-4 text-lg font-semibold">Recent mock scores</h3>

          {hasTests ? (
            <div className="space-y-2">
              {scoreList.map(([label, score, tone]) => (
                <div key={label} className="flex items-center justify-between rounded-xl bg-slate-900/50 px-3 py-2">
                  <span className="text-sm text-slate-200">{label}</span>
                  <span className={`font-semibold ${tone}`}>{score}</span>
                </div>
              ))}
            </div>
          ) : (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-600 bg-slate-900/30 px-4 py-8 text-center">
              <span className="text-3xl" aria-hidden="true">📋</span>
              <p className="text-sm font-semibold text-slate-300">No Tests Found</p>
              <p className="text-xs text-slate-500">You haven't attempted any mock tests yet. Start one to track your performance.</p>
              <a
                href="/tests"
                className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
              >
                <span>Explore Tests</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          )}
        </article>

        {/* AI buddy + countdown */}
        <div className="space-y-4">
          <article className="rounded-2xl bg-violet-100 p-4 text-slate-700">
            <h3 className="font-semibold">AI study buddy suggestion</h3>
            <p className="mt-2 text-sm">
              You've been weak in <strong>Sequences &amp; Series</strong> for 3 weeks. Spend 90 mins on it before
              today's mock — your rank can jump 2000+ spots.
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

// ─── Shared components ────────────────────────────────────────────────────────
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