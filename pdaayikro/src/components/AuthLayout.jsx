import { ArrowLeft, CalendarDays, Flame, ListChecks } from 'lucide-react'

function AuthLayout({ title, subtitle, children, onBack }) {
  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      {/* Left brand panel — desktop only */}
      <aside className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-10 text-white lg:flex">
        {/* Logo banner card at top */}
        <div className="flex justify-center rounded-2xl bg-white p-6 shadow-lg ring-1 ring-white/20">
          <img src="/brand-logo.png" alt="padhaiKaro" className="h-24 w-auto object-contain" />
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Plan. Focus.<br />Achieve.
          </h2>
          <p className="mt-4 max-w-sm text-blue-100">
            Your personal companion for JEE, NEET &amp; every exam you’re preparing for.
          </p>

          <ul className="mt-8 space-y-4 text-blue-50">
            <li className="flex items-center gap-3">
              <ListChecks size={20} className="text-blue-200" /> Smart timetable &amp; tasks
            </li>
            <li className="flex items-center gap-3">
              <Flame size={20} className="text-blue-200" /> Daily streaks to stay consistent
            </li>
            <li className="flex items-center gap-3">
              <CalendarDays size={20} className="text-blue-200" /> Mock tests &amp; smart calendar
            </li>
          </ul>
        </div>

        <p className="text-sm text-blue-200">© padhaiKaro</p>
      </aside>

      {/* Right form panel */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="px-6 pt-6">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            >
              <ArrowLeft size={18} />
            </button>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col justify-center px-6 py-8">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-8 flex flex-col items-center text-center">
              <img
                src="/auth-logo.jpeg"
                alt="padhaiKaro"
                className="mb-6 h-24 w-auto rounded-2xl object-contain ring-1 ring-slate-200 lg:hidden"
              />
              <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
              {subtitle ? <p className="mt-3 text-sm leading-relaxed text-slate-500">{subtitle}</p> : null}
            </div>

            {children}
          </div>
        </div>

        <p className="px-6 pb-6 text-center text-xs text-slate-400">
          By continuing, you agree to our Terms &amp; Privacy Policy.
        </p>
      </div>
    </div>
  )
}

export default AuthLayout
