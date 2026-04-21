import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProductCard from '../../components/customer/ProductCard'
import api from '../../api/axios'

export default function SellerStorePage() {
  const { sellerId }              = useParams()
  const navigate                   = useNavigate()
  const [products, setProducts]    = useState([])
  const [seller, setSeller]        = useState(null)
  const [loading, setLoading]      = useState(true)

  useEffect(() => {
    api.get(`/sellers/${sellerId}/products`)
      .then(res => {
        setProducts(res.data)
        if (res.data.length > 0) setSeller(res.data[0].seller)
      })
      .finally(() => setLoading(false))
  }, [sellerId])

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

        {/* Seller Header */}
        {seller && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl
                          p-6 mb-8 flex items-center gap-4">
            <div className="w-14 h-14 bg-cyan-400/10 text-cyan-400
                            rounded-full flex items-center justify-center
                            text-xl font-bold">
              {seller.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">{seller.name}</h1>
              <p className="text-gray-400 text-sm">{seller.email}</p>
              <p className="text-cyan-400 text-sm mt-1">
                {products.length} Products listed
              </p>
            </div>
          </div>
        )}

        {/* Products */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-cyan-400
                            border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-400">This seller has no products listed</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}