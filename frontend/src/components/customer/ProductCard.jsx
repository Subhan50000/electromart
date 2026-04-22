import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function ProductCard({ product }) {
  const navigate = useNavigate()

  const avgRating = product.reviews?.length
    ? (
        product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      ).toFixed(1)
    : null

  const image = product.primary_image?.image_path
    ? `http://localhost:8000/storage/${product.primary_image.image_path}`
    : null

  const handleAddToCart = async (e) => {
    e.stopPropagation() // card click navigate na ho
    try {
      await api.post('/cart', {
        product_id: product.id,
        quantity: 1,
      })
      navigate('/cart')
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to cart.')
    }
  }

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden
                 cursor-pointer hover:border-cyan-500/50 hover:shadow-lg
                 hover:shadow-cyan-500/5 transition-all duration-300 group
                 flex flex-col"
    >
      {/* ── Image ── */}
      <div className="h-36 xs:h-40 sm:h-44 md:h-48 bg-gray-800 
                      flex items-center justify-center overflow-hidden 
                      flex-shrink-0 relative">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105
                       transition-transform duration-300"
          />
        ) : (
          <span className="text-4xl sm:text-5xl">📦</span>
        )}

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-gray-950/70 flex items-center 
                          justify-center">
            <span className="text-xs font-semibold text-gray-400 
                             bg-gray-900 border border-gray-700 
                             px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">

        {/* Category */}
        <p className="text-xs text-cyan-400 mb-0.5 sm:mb-1 truncate">
          {product.category?.name}
        </p>

        {/* Name */}
        <h3 className="text-white font-medium text-xs sm:text-sm 
                       line-clamp-2 mb-2 leading-snug flex-1">
          {product.name}
        </h3>

        {/* Price + Rating Row */}
        <div className="flex items-center justify-between mt-auto mb-1">
          <p className="text-cyan-400 font-bold text-sm sm:text-base md:text-lg 
                        leading-none">
            Rs.{' '}
            <span className="tracking-tight">
              {Number(product.price).toLocaleString()}
            </span>
          </p>

          {avgRating && (
            <div className="flex items-center gap-0.5 sm:gap-1 
                            text-yellow-400 text-xs bg-yellow-400/10 
                            border border-yellow-400/20 rounded-lg 
                            px-1.5 py-0.5">
              <span>★</span>
              <span className="font-medium">{avgRating}</span>
            </div>
          )}
        </div>

        {/* Seller */}
        <p className="text-gray-500 text-xs truncate mb-3">
          by {product.seller?.name}
        </p>

        {/* Add to Cart Button */}
        {product.stock > 0 ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-cyan-400/10 hover:bg-cyan-400 border 
                       border-cyan-400/30 hover:border-cyan-400 text-cyan-400 
                       hover:text-gray-950 text-xs font-semibold py-2 
                       rounded-xl transition-all duration-200 
                       opacity-0 group-hover:opacity-100
                       translate-y-1 group-hover:translate-y-0"
          >
            🛒 Add to Cart
          </button>
        ) : (
          <div className="w-full bg-gray-800 border border-gray-700 
                          text-gray-600 text-xs font-medium py-2 
                          rounded-xl text-center">
            Unavailable
          </div>
        )}
      </div>
    </div>
  )
}