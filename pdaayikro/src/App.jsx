import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/AppShell'
import DashboardPage from './pages/DashboardPage'
import CalendarPage from './pages/CalendarPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import LibraryPage from './pages/LibraryPage'
import MockTestsPage from './pages/MockTestsPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import { clearUser, getStoredUser, saveUser } from './utils/auth'

function App() {
  const location = useLocation()
  const [user, setUser] = useState(() => getStoredUser())
  const [displayLocation, setDisplayLocation] = useState(() => location)
  const [isRouteLoading, setIsRouteLoading] = useState(true)

  const isLoggedIn = useMemo(() => Boolean(user), [user])

  const handleLogin = (loggedInUser) => {
    saveUser(loggedInUser)
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    clearUser()
    setUser(null)
  }

  useEffect(() => {
    setIsRouteLoading(true)
    const timer = setTimeout(() => {
      setDisplayLocation(location)
      setIsRouteLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="w-full">
        {isRouteLoading ? <RouteLoader /> : null}
        <Routes location={displayLocation}>
          <Route path="/" element={<Navigate to={isLoggedIn ? '/home' : '/login'} replace />} />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/home" replace /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={isLoggedIn ? <Navigate to="/home" replace /> : <RegisterPage onLogin={handleLogin} />}
          />

          <Route element={<ProtectedRoute user={user} />}>
            <Route element={<AppShell user={user} />}>
              <Route path="/home" element={<HomePage user={user} />} />
              <Route path="/dashboard" element={<DashboardPage user={user} />} />
              <Route path="/calendar" element={<CalendarPage user={user} />} />
              <Route path="/library" element={<LibraryPage user={user} />} />
              <Route path="/mock-tests" element={<MockTestsPage user={user} />} />
              <Route path="/about" element={<AboutPage user={user} />} />
              <Route path="/contact" element={<ContactPage user={user} />} />
              <Route path="/privacy" element={<PrivacyPolicyPage user={user} />} />
              <Route path="/profile" element={<ProfilePage user={user} onLogout={handleLogout} />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </main>
  )
}

function RouteLoader() {
  return (
    <div className="fixed left-0 top-14 z-10 h-[calc(100vh-3.5rem)] w-full bg-white/75 backdrop-blur-sm lg:left-64 lg:w-[calc(100%-16rem)]">
      <div className="grid h-full place-items-center">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
        <p className="text-sm font-semibold text-slate-900">Loading…</p>
      </div>
      </div>
    </div>
  )
}

export default App
