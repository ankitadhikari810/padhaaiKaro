import { useState } from 'react'
import { Mail, Phone, School, Target, UserCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'

function ProfilePage({ user, onLogout }) {
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleLogout = () => {
    onLogout()
    setShowConfirm(false)
    navigate('/login', { replace: true })
  }

  return (
    <>
      <section className="rounded-2xl border border-rose-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <UserCircle size={40} className="text-fuchsia-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{user.fullName}</h1>
            <p className="text-sm text-slate-500">Your student profile</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ProfileItem icon={<Mail size={16} />} label="Email" value={user.email} />
          <ProfileItem icon={<Phone size={16} />} label="Phone" value={user.phone} />
          <ProfileItem
            icon={<School size={16} />}
            label="Class"
            value={user.currentClass === 'Dropper' ? 'Dropper' : `Class ${user.currentClass}`}
          />
          <ProfileItem icon={<Target size={16} />} label="Goal" value={user.preparationGoal} />
          <ProfileItem icon={<Target size={16} />} label="Current level" value={user.studyLevel} />
          <ProfileItem
            icon={<Target size={16} />}
            label="Previous percentage"
            value={`${user.previousPercentage}%`}
          />
        </div>

        <div className="mt-8 border-t border-rose-200 pt-5">
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="rounded-lg bg-rose-500 px-4 py-2 font-semibold text-white hover:bg-rose-400"
          >
            Logout
          </button>
        </div>
      </section>

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout? Your session will be cleared from this device."
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleLogout}
      />
    </>
  )
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
      <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-sm text-slate-700">{value}</p>
    </div>
  )
}

export default ProfilePage
