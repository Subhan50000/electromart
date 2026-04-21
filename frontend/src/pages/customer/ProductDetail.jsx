import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function ProductDetail() {
  const { id }                      = useParams()
  const navigate                     = useNavigate()
  const [product, setProduct]        = useState(null)
  const [loading, setLoading]        = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyan-400
                      border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Product not found</p>
    </div>
  )

  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) /
       product.reviews.length).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition text-sm
                       flex items-center gap-2"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-cyan-400 rounded-lg flex items-center
                            justify-center text-gray-950 font-black text-xs">
              E
            </div>
            <span className="text-white font-bold">
              Electro<span className="text-cyan-400">Mart</span>
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl
                            h-80 flex items-center justify-center overflow-hidden mb-4">
              {product.images?.[selectedImage]?.image_path ? (
                <img
                  src={`http://localhost:8000/storage/${product.images[selectedImage].image_path}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-7xl">📦</span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2
                                transition ${selectedImage === idx
                                  ? 'border-cyan-400'
                                  : 'border-gray-800'
                                }`}
                  >
                    <img
                      src={`http://localhost:8000/storage/${img.image_path}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-cyan-400 text-sm mb-2">
              {product.category?.name}
            </p>
            <h1 className="text-white text-2xl font-bold mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(s => (
                    <span key={s}
                          className={s <= Math.round(avgRating)
                            ? 'text-yellow-400' : 'text-gray-700'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  {avgRating} ({product.reviews?.length} reviews)
                </span>
              </div>
            )}

            <p className="text-3xl font-bold text-cyan-400 mb-6">
              Rs. {Number(product.price).toLocaleString()}
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-xl
                            p-4 mb-6">
              <p className="text-gray-400 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock */}
            <p className="text-sm mb-6">
              <span className="text-gray-500">Stock: </span>
              <span className={product.stock > 0
                ? 'text-green-400' : 'text-red-400'}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </p>

            {/* Seller Info */}
            <div
              onClick={() => navigate(`/seller/${product.seller_id}`)}
              className="bg-gray-900 border border-gray-800 hover:border-cyan-500/50
                         rounded-xl p-4 cursor-pointer transition group"
            >
              <p className="text-gray-500 text-xs mb-1">Seller</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-cyan-400/10 text-cyan-400
                                rounded-full flex items-center justify-center
                                font-medium text-sm">
                  {product.seller?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-medium
                                group-hover:text-cyan-400 transition">
                    {product.seller?.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    View Products →
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <h2 className="text-white text-xl font-bold mb-6">
            Customer Reviews
            {avgRating && (
              <span className="text-gray-400 text-base font-normal ml-2">
                ({product.reviews?.length} reviews)
              </span>
            )}
          </h2>

          {product.reviews?.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl
                            p-8 text-center">
              <p className="text-gray-400">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews?.map(review => (
                <div key={review.id}
                     className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-cyan-400/10 text-cyan-400
                                    rounded-full flex items-center justify-center
                                    text-sm font-medium">
                      {review.customer?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {review.customer?.name}
                      </p>
                      <div className="flex text-yellow-400 text-xs">
                        {[1,2,3,4,5].map(s => (
                          <span key={s}
                                className={s <= review.rating
                                  ? 'text-yellow-400' : 'text-gray-700'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-400 text-sm">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}