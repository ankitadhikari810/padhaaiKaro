import { NavLink } from 'react-router-dom'
import { BookOpen, FileText, Info, Mail, NotebookPen } from 'lucide-react'

function Sidebar({ onNavigate, variant = 'desktop' }) {
  const navClass = ({ isActive }) =>
    [
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
      isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    ].join(' ')

  return (
    <aside
      className={[
        'h-full w-64 flex-col border-r border-slate-200 bg-white',
        variant === 'desktop' ? 'hidden lg:flex' : 'flex',
      ].join(' ')}
    >
      <nav className="flex-1 space-y-1 px-3 py-3">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Learn online</p>
        <NavLink to="/home" className={navClass} onClick={onNavigate}>
          <BookOpen size={18} />
          Study
        </NavLink>
        <NavLink to="/library" className={navClass} onClick={onNavigate}>
          <NotebookPen size={18} />
          Library
        </NavLink>
        <NavLink to="/mock-tests" className={navClass} onClick={onNavigate}>
          <FileText size={18} />
          Mock Test
        </NavLink>
      </nav>

      <div className="mt-auto border-t border-slate-200 px-3 py-3">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Support</p>
        <NavLink to="/about" className={navClass} onClick={onNavigate}>
          <Info size={18} />
          About us
        </NavLink>
        <NavLink to="/contact" className={navClass} onClick={onNavigate}>
          <Mail size={18} />
          Contact us
        </NavLink>
        <NavLink to="/privacy" className={navClass} onClick={onNavigate}>
          <Info size={18} />
          Privacy policy
        </NavLink>
        <p className="px-3 pt-3 text-xs text-slate-400">© {new Date().getFullYear()} PdaayiKro</p>
      </div>
    </aside>
  )
}

export default Sidebar

