import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import DashboardHeader from './DashboardHeader'
import Sidebar from './Sidebar'
import useActivityTracker from '../hooks/useActivityTracker'

function AppShell({ user }) {
  const location = useLocation()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useActivityTracker(user)

  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen w-full bg-slate-100">
      <DashboardHeader user={user} onOpenSidebar={() => setIsMobileSidebarOpen(true)} />

      {isMobileSidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <div
        className={[
          'fixed top-14 z-50 h-[calc(100vh-3.5rem)] w-72 bg-white shadow-xl transition-transform lg:hidden',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        role="dialog"
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">Menu</p>
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
        <div className="h-full overflow-auto">
          <div className="px-2 py-2">
            <Sidebar variant="mobile" onNavigate={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>
      </div>

      <div className="flex w-full">
        <div className="sticky top-14 h-[calc(100vh-3.5rem)]">
          <Sidebar />
        </div>
        <main className="min-w-0 flex-1">
          <div className="px-4 py-4 md:px-6 md:py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppShell

