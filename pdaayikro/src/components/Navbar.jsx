import { Link, NavLink } from 'react-router-dom'
import { GraduationCap, LayoutDashboard, LogIn, UserPlus } from 'lucide-react'

function Navbar({ user }) {
  const navClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
      isActive
        ? 'bg-slate-700 text-white'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`

  return (
    <nav className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-3 md:flex-row md:items-center md:justify-between">
      <Link
        className="inline-flex items-center gap-2 px-2 text-lg font-semibold text-white"
        to={user ? '/home' : '/login'}
      >
        <span className="rounded-full bg-slate-800 p-1.5 text-amber-300">
          <GraduationCap size={17} />
        </span>
        pdaayiKro
      </Link>
      <div className="flex flex-wrap gap-2">
        {user ? (
          <>
            <NavLink className={navClass} to="/home">
              <LayoutDashboard size={16} />
              Home
            </NavLink>
            <NavLink className={navClass} to="/dashboard">
              <LayoutDashboard size={16} />
              Dashboard
            </NavLink>
          </>
        ) : (
          <>
            <NavLink className={navClass} to="/login">
              <LogIn size={16} />
              Login
            </NavLink>
            <NavLink className={navClass} to="/register">
              <UserPlus size={16} />
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
