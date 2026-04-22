import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const statusColors = {
  pending:   'bg-yellow-400/10 text-yellow-400',
  confirmed: 'bg-blue-400/10 text-blue-400',
  shipped:   'bg-purple-400/10 text-purple-400',
  delivered: 'bg-green-400/10 text-green-400',
  cancelled: 'bg-red-400/10 text-red-400',
}

export default function OrdersPage() {
  const navigate              = useNavigate()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewModal, setReviewModal] = useState(null)
  const [review, setReview]   = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting]   = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState('')

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleReviewSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/reviews', {
        product_id: reviewModal.product_id,
        rating:     review.rating,
        comment:    review.comment,
      })
      setReviewModal(null)
      setReviewSuccess('Review submitted successfully!')
      setTimeout(() => setReviewSuccess(''), 3000)
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting review.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition text-sm"
          >
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

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-white text-2xl font-bold mb-8">My Orders</h1>

        {reviewSuccess && (
          <div className="bg-green-400/10 border border-green-400/30
                          text-green-400 text-sm rounded-xl px-4 py-3 mb-6">
            {reviewSuccess}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-cyan-400
                            border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-gray-400 mb-6">No orders yet</p>
            <button
              onClick={() => navigate('/')}
              className="bg-cyan-400 hover:bg-cyan-300 text-gray-950
                         font-medium px-6 py-2.5 rounded-xl text-sm transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id}
                   className="bg-gray-900 border border-gray-800 rounded-2xl
                              overflow-hidden">

                {/* Order Header */}
                <div className="flex items-center justify-between px-6 py-4
                                border-b border-gray-800">
                  <div>
                    <p className="text-white font-medium text-sm">
                      Order #{order.id}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-bold">
                      Rs. {Number(order.total_amount).toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {order.items?.length} item(s)
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="divide-y divide-gray-800">
                  {order.items?.map(item => (
                    <div key={item.id}
                         className="px-6 py-4 flex items-center gap-4">

                      {/* Image */}
                      <div className="w-14 h-14 bg-gray-800 rounded-xl
                                      overflow-hidden flex items-center
                                      justify-center flex-shrink-0">
                        {item.product?.primary_image ? (
                          <img
                            src={`http://localhost:8000/storage/${item.product.primary_image.image_path}`}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <span className="text-xl">📦</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium
                                      line-clamp-1">
                          {item.product?.name}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          Qty: {item.quantity} ×
                          Rs. {Number(item.price).toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Seller: {item.seller?.name}
                        </p>
                      </div>

                      {/* Status + Review */}
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs
                                          font-medium capitalize
                                          ${statusColors[item.status]}`}>
                          {item.status}
                        </span>

                        {item.status === 'delivered' && (
                          <button
                            onClick={() => setReviewModal(item)}
                            className="text-yellow-400 hover:text-yellow-300
                                       text-xs transition"
                          >
                            ★ Write Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Info */}
                <div className="px-6 py-3 bg-gray-800/50 flex gap-6 text-xs
                                text-gray-400">
                  <span>📍 {order.shipping_address}</span>
                  <span>📞 {order.shipping_phone}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center
                        justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl
                          w-full max-w-md">
            <div className="flex items-center justify-between p-6
                            border-b border-gray-800">
              <h2 className="text-white font-semibold">Write a Review</h2>
              <button
                onClick={() => setReviewModal(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
              <p className="text-gray-400 text-sm">
                {reviewModal.product?.name}
              </p>

              {/* Star Rating */}
              <div>
                <label className="text-gray-400 text-sm block mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button
                      key={s} type="button"
                      onClick={() => setReview({ ...review, rating: s })}
                      className={`text-2xl transition ${
                        s <= review.rating
                          ? 'text-yellow-400'
                          : 'text-gray-700'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="text-gray-400 text-sm block mb-1.5">
                  Comment
                  <span className="text-gray-600 ml-1">(optional)</span>
                </label>
                <textarea
                  value={review.comment}
                  onChange={e =>
                    setReview({ ...review, comment: e.target.value })
                  }
                  placeholder="Share your experience..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700
                             text-white rounded-xl px-4 py-3 text-sm
                             outline-none focus:border-cyan-500
                             placeholder:text-gray-600 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white
                             py-3 rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  className="flex-1 bg-cyan-400 hover:bg-cyan-300
                             disabled:opacity-50 text-gray-950 font-semibold
                             py-3 rounded-xl text-sm transition"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}