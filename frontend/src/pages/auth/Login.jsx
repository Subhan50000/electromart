import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role === 'admin')       navigate('/admin/dashboard')
      else if (user.role === 'seller') navigate('/seller/dashboard')
      else                             navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96
                        bg-cyan-500/10 rounded-full blur-3xl"/>
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-cyan-400 rounded-xl flex items-center
                            justify-center text-gray-950 font-black text-lg">E</div>
            <span className="text-white font-bold text-2xl tracking-tight">
              Electro<span className="text-cyan-400">Mart</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-white font-semibold text-xl mb-6">Welcome back</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400
                            text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-1.5">
                Email Address
              </label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white
                           rounded-xl px-4 py-3 text-sm outline-none
                           focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30
                           placeholder:text-gray-600 transition"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1.5">
                Password
              </label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white
                           rounded-xl px-4 py-3 text-sm outline-none
                           focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30
                           placeholder:text-gray-600 transition"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50
                         text-gray-950 font-semibold rounded-xl py-3 text-sm
                         transition-all duration-200 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register"
                  className="text-cyan-400 hover:text-cyan-300 transition">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}