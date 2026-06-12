import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertTriangle, Mail, X } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'
import { getApiBaseUrl } from '../utils/api'

const API_BASE_URL = getApiBaseUrl()

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  preparationGoal: 'JEE Main + Advanced',
  currentClass: '11',
  studyLevel: 'Average',
  previousPercentage: '',
}

const selectClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring focus:ring-blue-500/30'

function RegisterPage({ onLogin }) {
  const navigate = useNavigate()
  const [step, setStep] = useState('method') // 'method' | 'details'
  const [formData, setFormData] = useState(initialForm)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const showToast = (message) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 5000)
  }

  const handleContinueMobile = () => {
    // Mobile sign-up is not available yet — nudge the user toward email.
    showToast('This service is unavailable right now. Please sign up using email.')
  }

  const handleContinueEmail = () => {
    setError('')
    setStep('details')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim()
      const payload = {
        fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        preparationGoal: formData.preparationGoal,
        currentClass: formData.currentClass,
        studyLevel: formData.studyLevel,
        previousPercentage: Number(formData.previousPercentage),
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      onLogin(data.user)
      navigate('/home', { replace: true })
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ---- Step 1: choose method ----
  if (step === 'method') {
    return (
      <>
        {toast ? (
          <div className="fixed right-4 top-4 z-50 flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl bg-red-600 px-4 py-3 text-white shadow-lg sm:max-w-sm">
            <AlertTriangle size={20} className="mt-0.5 shrink-0" />
            <p className="text-sm font-medium leading-snug">{toast}</p>
            <button
              type="button"
              onClick={() => setToast('')}
              aria-label="Dismiss"
              className="ml-1 shrink-0 text-white/80 transition hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        ) : null}

        <AuthLayout title="Create your account" subtitle="Plan, focus & achieve your exam goals.">
        <div className="space-y-4">
          {/* Mobile number with floating label */}
          <div className="relative">
            <label className="absolute -top-2 left-3 z-10 bg-white px-1.5 text-xs font-medium text-slate-500">
              Mobile number
            </label>
            <div className="flex items-center overflow-hidden rounded-xl border border-slate-300 focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-500/30">
              <span className="border-r border-slate-200 px-4 py-3.5 text-slate-600">+91</span>
              <input
                type="tel"
                name="phone"
                inputMode="numeric"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white px-4 py-3.5 text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinueMobile}
            className="w-full rounded-full bg-blue-600 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400">OR</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleContinueEmail}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-4 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Mail size={18} className="text-blue-600" /> Continue with email
          </button>

          {error ? <p className="text-center text-sm text-rose-500">{error}</p> : null}

          <p className="pt-2 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/login">
              Log in
            </Link>
          </p>
        </div>
        </AuthLayout>
      </>
    )
  }

  // ---- Step 2: full details ----
  return (
    <AuthLayout
      title="Signup Using Email!"
      subtitle="Fill in your details to finish signing up"
      onBack={() => {
        setError('')
        setStep('method')
      }}
    >
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
        <FormInput name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} />
        <FormInput name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} />
        <div className="sm:col-span-2">
          <FormInput name="email" type="email" placeholder="Email address" value={formData.email} onChange={handleChange} />
        </div>
        <div className="sm:col-span-2">
          <FormInput name="phone" type="tel" placeholder="Phone number" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="sm:col-span-2">
          <FormInput
            name="password"
            type="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <select name="preparationGoal" value={formData.preparationGoal} onChange={handleChange} className={selectClass}>
          <option>JEE Main + Advanced</option>
          <option>JEE Main</option>
          <option>NEET</option>
          <option>Foundation (Class 9-10)</option>
        </select>

        <select name="currentClass" value={formData.currentClass} onChange={handleChange} className={selectClass}>
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
          <option value="11">Class 11</option>
          <option value="12">Class 12</option>
          <option value="Dropper">Dropper</option>
        </select>

        <select name="studyLevel" value={formData.studyLevel} onChange={handleChange} className={selectClass}>
          <option>Beginner</option>
          <option>Average</option>
          <option>Good</option>
          <option>Excellent</option>
        </select>

        <FormInput
          name="previousPercentage"
          type="number"
          min="0"
          max="100"
          step="any"
          placeholder="Previous percentage (e.g. 96.54)"
          value={formData.previousPercentage}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 w-full rounded-full bg-blue-600 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
        >
          {isLoading ? 'Creating profile...' : 'Create account'}
        </button>
      </form>

      {error ? <p className="mt-4 text-center text-sm text-rose-500">{error}</p> : null}
    </AuthLayout>
  )
}

export default RegisterPage
