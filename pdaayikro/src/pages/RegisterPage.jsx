import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5057'

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

function RegisterPage({ onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
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

  return (
    <AuthLayout
      title="Create Student Profile"
      subtitle="Tell us your class and prep status. We will personalize syllabus and dashboard for you."
    >
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <FormInput
          name="firstName"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <FormInput
          name="lastName"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <FormInput
          name="email"
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
        />
        <FormInput
          name="phone"
          type="tel"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
        />

        <select
          name="preparationGoal"
          value={formData.preparationGoal}
          onChange={handleChange}
          className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-slate-700 outline-none ring-fuchsia-300/60 focus:ring"
        >
          <option>JEE Main + Advanced</option>
          <option>JEE Main</option>
          <option>NEET</option>
          <option>Foundation (Class 9-10)</option>
        </select>

        <select
          name="currentClass"
          value={formData.currentClass}
          onChange={handleChange}
          className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-slate-700 outline-none ring-fuchsia-300/60 focus:ring"
        >
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
          <option value="11">Class 11</option>
          <option value="12">Class 12</option>
          <option value="Dropper">Dropper</option>
        </select>

        <select
          name="studyLevel"
          value={formData.studyLevel}
          onChange={handleChange}
          className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-slate-700 outline-none ring-fuchsia-300/60 focus:ring"
        >
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
          placeholder="Previous percentage"
          value={formData.previousPercentage}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="md:col-span-2 w-full rounded-lg bg-fuchsia-600 px-4 py-2 font-semibold text-white transition hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Creating profile...' : 'Register and Continue'}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}

      <p className="mt-6 text-sm text-slate-600">
        Already have an account?{' '}
        <Link className="text-fuchsia-700 hover:text-fuchsia-600" to="/login">
          Login
        </Link>
      </p>
    </AuthLayout>
  )
}

export default RegisterPage
