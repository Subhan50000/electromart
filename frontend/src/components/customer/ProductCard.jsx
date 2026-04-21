import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const navigate = useNavigate()

  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) /
       product.reviews.length).toFixed(1)
    : null

  const image = product.primary_image?.image_path
    ? `http://localhost:8000/storage/${product.primary_image.image_path}`
    : null

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden
                 cursor-pointer hover:border-cyan-500/50 hover:shadow-lg
                 hover:shadow-cyan-500/5 transition-all duration-300 group"
    >
      {/* Image */}
      <div className="h-48 bg-gray-800 flex items-center justify-center
                      overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105
                       transition-transform duration-300"
          />
        ) : (
          <span className="text-5xl">📦</span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-cyan-400 mb-1">
          {product.category?.name}
        </p>
        <h3 className="text-white font-medium text-sm line-clamp-2 mb-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-3">
          <p className="text-cyan-400 font-bold text-lg">
            Rs. {Number(product.price).toLocaleString()}
          </p>
          {avgRating && (
            <div className="flex items-center gap-1 text-yellow-400 text-xs">
              <span>★</span>
              <span>{avgRating}</span>
            </div>
          )}
        </div>

        <p className="text-gray-500 text-xs mt-1">
          by {product.seller?.name}
        </p>
      </div>
    </div>
  )
}