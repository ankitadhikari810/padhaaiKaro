import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, Menu } from 'lucide-react'
import { getInitials } from '../utils/user'

function DashboardHeader({ user, onOpenSidebar }) {
  const navigate = useNavigate()
  const today = useMemo(() => new Date(), [])
  const firstName = useMemo(() => (user?.fullName || '').trim().split(/\s+/)[0] || 'Student', [user?.fullName])

  const dateLabel = useMemo(() => {
    return today.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }, [today])

  const initials = getInitials(user?.fullName)

  return (
    <header className="sticky top-0 z-20 w-full bg-slate-950">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-100 hover:bg-slate-900 lg:hidden"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <Menu size={18} />
          </button>
          <Link to="/home" className="inline-flex items-center gap-2">
          <img src="/favicon.svg" alt="PdaayiKro logo" className="h-7 w-7 rounded-md bg-white object-contain" />
          <p className="text-sm font-semibold text-slate-100">PdaayiKro</p>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/calendar')}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-950/70"
            title="Open calendar"
            aria-label="Open calendar"
          >
            <CalendarDays size={14} className="text-amber-300" />
            {dateLabel}
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-slate-700 bg-slate-950/20 px-3 py-1.5 sm:flex">
            <p className="text-xs font-semibold text-slate-200">Hi, {firstName}</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="grid h-9 w-9 place-items-center rounded-full bg-amber-100 text-xs font-semibold text-slate-700 transition hover:bg-amber-200"
            title="Open profile"
            aria-label="Open profile"
          >
            {initials}
          </button>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
