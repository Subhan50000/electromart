import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function BecomeSeller() {
  const navigate    = useNavigate()
  const [status, setStatus]         = useState(null)
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState('')

  const [form, setForm] = useState({
    shop_name: '', shop_description: '',
    phone: '', address: '', cnic: '',
  })

  useEffect(() => {
    api.get('/seller-request/status')
      .then(res => setStatus(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post('/seller-request', form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyan-400
                      border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-white transition text-sm">
            ← Home
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-cyan-400 rounded-lg flex items-center
                            justify-center text-gray-950 font-black text-xs">E</div>
            <span className="text-white font-bold">
              Electro<span className="text-cyan-400">Mart</span>
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        {status?.status === 'pending' ? (
          <div className="bg-yellow-400/10 border border-yellow-400/30
                          rounded-2xl p-8 text-center">
            <p className="text-4xl mb-4">⏳</p>
            <h2 className="text-white text-xl font-bold mb-2">
              Request Pending
            </h2>
            <p className="text-gray-400 text-sm">
              Your seller request is under review. Please wait for admin approval.
            </p>
          </div>
        ) : status?.status === 'declined' ? (
          <div className="bg-red-400/10 border border-red-400/30
                          rounded-2xl p-8 text-center">
            <p className="text-4xl mb-4">❌</p>
            <h2 className="text-white text-xl font-bold mb-2">
              Request Declined
            </h2>
            <p className="text-gray-400 text-sm">
              Your seller request was declined by the admin.
            </p>
          </div>
        ) : success ? (
          <div className="bg-green-400/10 border border-green-400/30
                          rounded-2xl p-8 text-center">
            <p className="text-4xl mb-4">✅</p>
            <h2 className="text-white text-xl font-bold mb-2">
              Request Submitted!
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Your request has been sent. Admin will review and approve it.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-cyan-400 hover:bg-cyan-300 text-gray-950
                         font-medium px-6 py-2.5 rounded-xl text-sm transition"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-white text-2xl font-bold">Become a Seller</h1>
              <p className="text-gray-400 text-sm mt-1">
                Fill out the form below — admin will review your request
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400
                              text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1.5">
                    Shop Name
                  </label>
                  <input name="shop_name" value={form.shop_name}
                    onChange={handleChange} placeholder="Your shop name"
                    required
                    className="w-full bg-gray-800 border border-gray-700 text-white
                               rounded-xl px-4 py-3 text-sm outline-none
                               focus:border-cyan-500 placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-1.5">
                    Shop Description
                  </label>
                  <textarea name="shop_description" value={form.shop_description}
                    onChange={handleChange}
                    placeholder="What do you sell?" required rows={3}
                    className="w-full bg-gray-800 border border-gray-700 text-white
                               rounded-xl px-4 py-3 text-sm outline-none
                               focus:border-cyan-500 placeholder:text-gray-600
                               resize-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-1.5">
                    Phone Number
                  </label>
                  <input name="phone" value={form.phone}
                    onChange={handleChange} placeholder="+92 300 0000000"
                    required
                    className="w-full bg-gray-800 border border-gray-700 text-white
                               rounded-xl px-4 py-3 text-sm outline-none
                               focus:border-cyan-500 placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-1.5">
                    Address
                  </label>
                  <textarea name="address" value={form.address}
                    onChange={handleChange} placeholder="Your business address"
                    required rows={2}
                    className="w-full bg-gray-800 border border-gray-700 text-white
                               rounded-xl px-4 py-3 text-sm outline-none
                               focus:border-cyan-500 placeholder:text-gray-600
                               resize-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-1.5">
                    CNIC{' '}
                    <span className="text-gray-600">(optional)</span>
                  </label>
                  <input name="cnic" value={form.cnic}
                    onChange={handleChange} placeholder="xxxxx-xxxxxxx-x"
                    className="w-full bg-gray-800 border border-gray-700 text-white
                               rounded-xl px-4 py-3 text-sm outline-none
                               focus:border-cyan-500 placeholder:text-gray-600"
                  />
                </div>

                <button type="submit" disabled={submitting}
                  className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50
                             text-gray-950 font-semibold rounded-xl py-3 text-sm
                             transition-all mt-2"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}