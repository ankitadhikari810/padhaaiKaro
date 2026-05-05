import { useMemo } from 'react'
import { Flame, X } from 'lucide-react'

function formatMinutes(seconds) {
  return Math.floor((Number(seconds) || 0) / 60)
}

function StreakModal({ isOpen, onClose, streakCount, dailyActiveSeconds }) {
  const minutes = useMemo(() => formatMinutes(dailyActiveSeconds), [dailyActiveSeconds])
  const targetMinutes = 15
  const clamped = Math.min(targetMinutes, Math.max(0, minutes))
  const progress = clamped / targetMinutes
  const ring = 2 * Math.PI * 40
  const dash = ring * progress

  if (!isOpen) return null

  const hasStarted = (streakCount || 0) > 0
  const isComplete = minutes >= targetMinutes

  return (
    <div className="fixed left-0 top-14 z-40 grid h-[calc(100vh-3.5rem)] w-full place-items-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Streak"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-orange-600">
              <Flame size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{hasStarted ? `${streakCount} day streak` : 'Start your streak'}</p>
              <p className="text-xs text-slate-500">Do 15 minutes of activity today</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Close"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid place-items-center">
          <div className="relative grid h-28 w-28 place-items-center">
            <svg className="h-28 w-28 -rotate-90">
              <circle cx="56" cy="56" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="10" />
              <circle
                cx="56"
                cy="56"
                r="40"
                fill="transparent"
                stroke={isComplete ? '#22C55E' : '#F59E0B'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${ring - dash}`}
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-xl font-bold text-slate-900">
                {Math.min(targetMinutes, minutes)}/{targetMinutes}
              </p>
              <p className="text-xs text-slate-500">Minutes</p>
            </div>
          </div>
        </div>

        <h2 className="mt-6 text-center text-xl font-bold text-slate-900">
          {hasStarted ? (isComplete ? 'Streak Saved!' : 'Complete your streak') : 'Restart Your Streak!'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isComplete ? 'Nice! Today is counted. Come back tomorrow to continue.' : "It's never too late to begin again. Keep going."}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          {isComplete ? 'Okay' : 'Complete My Streak'}
        </button>
      </div>
    </div>
  )
}

export default StreakModal

