import { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
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
  const [user, setUser] = useState(() => getStoredUser())

  const isLoggedIn = useMemo(() => Boolean(user), [user])

  const handleLogin = (loggedInUser) => {
    saveUser(loggedInUser)
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    clearUser()
    setUser(null)
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Navigate to={isLoggedIn ? '/home' : '/register'} replace />} />
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
              <Route path="/home" element={<DashboardPage user={user} />} />
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

export default App
