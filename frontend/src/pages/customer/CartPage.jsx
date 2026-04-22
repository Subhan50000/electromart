import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function CartPage() {
  const navigate              = useNavigate()
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => { fetchCart() }, [])

  const fetchCart = () => {
    setLoading(true)
    api.get('/cart')
      .then(res => setItems(res.data))
      .finally(() => setLoading(false))
  }

  const handleUpdate = async (id, quantity) => {
    if (quantity < 1) return
    setUpdatingId(id)
    await api.put(`/cart/${id}`, { quantity })
    await fetchCart()
    setUpdatingId(null)
  }

  const handleRemove = async (id) => {
    setRemovingId(id)
    await api.delete(`/cart/${id}`)
    await fetchCart()
    setRemovingId(null)
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  )

  return (
    <div className="min-h-screen bg-gray-950">

      {/* ───────────── NAVBAR ───────────── */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 
                        flex items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition 
                         text-sm flex items-center gap-1.5"
            >
              <span>←</span>
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Shop</span>
            </button>
          </div>

          {/* Logo — center */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-cyan-400 rounded-lg flex items-center
                            justify-center text-gray-950 font-black text-xs">
              E
            </div>
            <span className="text-white font-bold text-sm sm:text-base">
              Electro<span className="text-cyan-400">Mart</span>
            </span>
          </div>

          {/* Right — total badge on mobile */}
          {items.length > 0 && (
            <div className="lg:hidden flex items-center gap-1 
                            bg-cyan-400/10 border border-cyan-400/20 
                            rounded-xl px-2.5 py-1.5">
              <span className="text-cyan-400 text-xs font-bold">
                Rs. {Number(total).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </nav>

      {/* ───────────── CONTENT ───────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Heading */}
        <h1 className="text-white text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
          Shopping Cart
          <span className="text-gray-500 text-sm sm:text-base font-normal ml-2">
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
        </h1>

        {/* ── Loading ── */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-cyan-400
                            border-t-transparent rounded-full animate-spin"/>
          </div>

        /* ── Empty Cart ── */
        ) : items.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <p className="text-5xl sm:text-6xl mb-4">🛒</p>
            <p className="text-gray-400 mb-2">Your cart is empty</p>
            <p className="text-gray-600 text-sm mb-6">
              Add some products to get started
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-cyan-400 hover:bg-cyan-300 text-gray-950
                         font-medium px-6 py-2.5 rounded-xl text-sm transition"
            >
              Browse Products
            </button>
          </div>

        /* ── Cart Items + Summary ── */
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* ── Cart Items ── */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`bg-gray-900 border rounded-2xl p-3 sm:p-4 
                              flex gap-3 sm:gap-4 transition-all duration-200 ${
                    removingId === item.id
                      ? 'opacity-50 scale-95 border-red-500/30'
                      : 'border-gray-800'
                  }`}
                >
                  {/* Image */}
                  <div
                    onClick={() => navigate(`/product/${item.product?.id}`)}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 
                               rounded-xl flex items-center justify-center
                               overflow-hidden flex-shrink-0 cursor-pointer
                               hover:opacity-80 transition"
                  >
                    {item.product?.primary_image ? (
                      <img
                        src={`http://localhost:8000/storage/${item.product.primary_image.image_path}`}
                        className="w-full h-full object-cover"
                        alt={item.product?.name}
                      />
                    ) : (
                      <span className="text-xl sm:text-2xl">📦</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      onClick={() => navigate(`/product/${item.product?.id}`)}
                      className="text-white font-medium text-xs sm:text-sm
                                 line-clamp-2 cursor-pointer hover:text-cyan-400 
                                 transition leading-snug"
                    >
                      {item.product?.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">
                      by {item.product?.seller?.name}
                    </p>
                    <p className="text-cyan-400 font-bold text-sm sm:text-base mt-1.5">
                      Rs. {Number(item.product?.price).toLocaleString()}
                    </p>

                    {/* Subtotal — mobile only */}
                    <p className="text-gray-600 text-xs mt-0.5 sm:hidden">
                      Subtotal: Rs.{' '}
                      {Number(item.product?.price * item.quantity)
                        .toLocaleString()}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col items-end justify-between 
                                  flex-shrink-0">
                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={removingId === item.id}
                      className="text-gray-600 hover:text-red-400
                                 transition text-xl leading-none 
                                 w-7 h-7 flex items-center justify-center
                                 hover:bg-red-400/10 rounded-lg"
                      title="Remove"
                    >
                      {removingId === item.id ? (
                        <span className="text-xs">...</span>
                      ) : '×'}
                    </button>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleUpdate(item.id, item.quantity - 1)}
                        disabled={updatingId === item.id || item.quantity <= 1}
                        className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-800 
                                   hover:bg-gray-700 disabled:opacity-40
                                   text-white rounded-lg text-sm transition
                                   flex items-center justify-center"
                      >
                        −
                      </button>

                      <span className="text-white text-sm w-5 sm:w-6 
                                       text-center font-medium">
                        {updatingId === item.id ? (
                          <span className="text-gray-500 text-xs">•</span>
                        ) : item.quantity}
                      </span>

                      <button
                        onClick={() => handleUpdate(item.id, item.quantity + 1)}
                        disabled={updatingId === item.id}
                        className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-800 
                                   hover:bg-gray-700 disabled:opacity-40
                                   text-white rounded-lg text-sm transition
                                   flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 border border-gray-800
                              rounded-2xl p-4 sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-white font-semibold text-base sm:text-lg mb-5">
                  Order Summary
                </h2>

                {/* Item breakdown */}
                <div className="space-y-2.5 mb-5 
                                max-h-48 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="flex justify-between text-xs sm:text-sm gap-2"
                    >
                      <span className="text-gray-400 line-clamp-1 flex-1">
                        {item.product?.name}
                        <span className="text-gray-600 ml-1">
                          × {item.quantity}
                        </span>
                      </span>
                      <span className="text-white flex-shrink-0">
                        Rs.{' '}
                        {Number(item.product?.price * item.quantity)
                          .toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider + Total */}
                <div className="border-t border-gray-800 pt-4 mb-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-white">
                      Rs. {Number(total).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-green-400 text-xs font-medium">
                      Free
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t 
                                  border-gray-800">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-cyan-400 font-bold text-base sm:text-lg">
                      Rs. {Number(total).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-cyan-400 hover:bg-cyan-300
                             text-gray-950 font-semibold py-3 rounded-xl
                             text-sm transition"
                >
                  Proceed to Checkout →
                </button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 
                                mt-4 pt-4 border-t border-gray-800">
                  <span className="text-gray-600 text-xs flex items-center gap-1">
                    🔒 Secure
                  </span>
                  <span className="text-gray-600 text-xs flex items-center gap-1">
                    🚚 Free Delivery
                  </span>
                  <span className="text-gray-600 text-xs flex items-center gap-1">
                    ↩️ Easy Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Sticky Checkout Bar ── */}
      {!loading && items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40
                        bg-gray-900 border-t border-gray-800 
                        px-4 py-3 safe-area-bottom">
          <div className="flex items-center gap-3 max-w-5xl mx-auto">
            <div className="flex-1">
              <p className="text-gray-500 text-xs">Total</p>
              <p className="text-cyan-400 font-bold text-base">
                Rs. {Number(total).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="bg-cyan-400 hover:bg-cyan-300 text-gray-950 
                         font-semibold px-6 py-3 rounded-xl text-sm 
                         transition flex-shrink-0"
            >
              Checkout →
            </button>
          </div>
        </div>
      )}

      {/* Bottom padding for mobile sticky bar */}
      {!loading && items.length > 0 && (
        <div className="lg:hidden h-20" />
      )}
    </div>
  )
}