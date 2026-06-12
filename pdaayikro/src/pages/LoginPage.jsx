import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'
import { getApiBaseUrl } from '../utils/api'

const API_BASE_URL = getApiBaseUrl()

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
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
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
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
      title="Welcome back"
      subtitle="Log in to open your personalized study dashboard."
      onBack={() => navigate('/register')}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <FormInput
          name="email"
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-blue-600 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Checking...' : 'Log in'}
        </button>
      </form>

      {error ? <p className="mt-4 text-center text-sm text-rose-500">{error}</p> : null}

      <p className="mt-6 text-center text-sm text-slate-500">
        New user?{' '}
        <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/register">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}

export default LoginPage
