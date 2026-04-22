import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function CheckoutPage() {
  const navigate              = useNavigate()
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [error, setError]     = useState('')

  const [form, setForm] = useState({
    shipping_address: '',
    shipping_phone:   '',
  })

  useEffect(() => {
    api.get('/cart')
      .then(res => {
        if (res.data.length === 0) navigate('/cart')
        setItems(res.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  )

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setPlacing(true)
    try {
      await api.post('/orders', form)
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.')
    } finally {
      setPlacing(false)
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

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/cart')}
            className="text-gray-400 hover:text-white transition text-sm"
          >
            ← Back to Cart
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

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-white text-2xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Shipping Form */}
          <div>
            <h2 className="text-white font-semibold text-lg mb-4">
              Shipping Details
            </h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30
                              text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-gray-900 border border-gray-800
                              rounded-2xl p-6 space-y-4">

                <div>
                  <label className="text-gray-400 text-sm block mb-1.5">
                    Delivery Address
                  </label>
                  <textarea
                    name="shipping_address"
                    value={form.shipping_address}
                    onChange={handleChange}
                    placeholder="Enter your full delivery address"
                    required rows={3}
                    className="w-full bg-gray-800 border border-gray-700
                               text-white rounded-xl px-4 py-3 text-sm
                               outline-none focus:border-cyan-500
                               placeholder:text-gray-600 resize-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    name="shipping_phone"
                    value={form.shipping_phone}
                    onChange={handleChange}
                    placeholder="+92 300 0000000"
                    required
                    className="w-full bg-gray-800 border border-gray-700
                               text-white rounded-xl px-4 py-3 text-sm
                               outline-none focus:border-cyan-500
                               placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-900 border border-gray-800
                              rounded-2xl p-6">
                <h3 className="text-white font-medium mb-3">
                  Payment Method
                </h3>
                <div className="flex items-center gap-3 bg-gray-800
                                rounded-xl px-4 py-3">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full
                                  flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-950 rounded-full"/>
                  </div>
                  <span className="text-white text-sm">
                    Cash on Delivery
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="w-full bg-cyan-400 hover:bg-cyan-300
                           disabled:opacity-50 text-gray-950 font-semibold
                           py-3.5 rounded-xl text-sm transition"
              >
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-white font-semibold text-lg mb-4">
              Your Order
            </h2>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl
                                    overflow-hidden flex items-center
                                    justify-center flex-shrink-0">
                      {item.product?.primary_image ? (
                        <img
                          src={`http://localhost:8000/storage/${item.product.primary_image.image_path}`}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <span className="text-lg">📦</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm line-clamp-1">
                        {item.product?.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-white text-sm flex-shrink-0">
                      Rs. {Number(
                        item.product?.price * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">
                    Rs. {Number(total).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between font-semibold
                                pt-2 border-t border-gray-800">
                  <span className="text-white">Total</span>
                  <span className="text-cyan-400 text-lg">
                    Rs. {Number(total).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}