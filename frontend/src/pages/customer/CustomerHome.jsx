import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ProductCard from '../../components/customer/ProductCard'
import api from '../../api/axios'

export default function CustomerHome() {
  const { user, logout }        = useAuth()
  const navigate                 = useNavigate()
  const [products, setProducts]  = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]    = useState(true)
  const [search, setSearch]      = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [menuOpen, setMenuOpen]  = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/categories'),
    ]).then(([prodRes, catRes]) => {
      setProducts(prodRes.data)
      setCategories(catRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    const params = {}
    if (search)      params.search      = search
    if (selectedCat) params.category_id = selectedCat
    const res = await api.get('/products', { params })
    setProducts(res.data)
    setLoading(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center
                        justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center
                            justify-center text-gray-950 font-black text-sm">
              E
            </div>
            <span className="text-white font-bold text-lg">
              Electro<span className="text-cyan-400">Mart</span>
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8 flex gap-2">
            <input
              type="text"
              placeholder="Search Products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-gray-800 border border-gray-700 text-white
                         text-sm rounded-xl px-4 py-2.5 outline-none
                         focus:border-cyan-500 placeholder:text-gray-500"
            />
            <button
              onClick={handleSearch}
              className="bg-cyan-400 hover:bg-cyan-300 text-gray-950
                         font-medium text-sm px-4 py-2.5 rounded-xl transition"
            >
              Search
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => navigate('/become-seller')}
              className="text-cyan-400 hover:text-cyan-300 text-sm
                         border border-cyan-400/30 hover:border-cyan-400
                         px-3 py-2 rounded-xl transition"
            >
              Bacome A Seller
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 bg-cyan-400/10 text-cyan-400 rounded-full
                         flex items-center justify-center font-medium text-sm"
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 bg-gray-900 border
                              border-gray-800 rounded-xl shadow-xl w-48 z-50">
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="text-white text-sm font-medium">
                    {user?.name}
                  </p>
                  <p className="text-gray-500 text-xs">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-400
                             hover:bg-red-400/10 text-sm transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Categories */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => { setSelectedCat(''); handleSearch() }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                        transition-all ${!selectedCat
                          ? 'bg-cyan-400 text-gray-950'
                          : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                        }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCat(cat.id)
                setTimeout(handleSearch, 100)
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium
                          whitespace-nowrap transition-all
                          ${selectedCat === cat.id
                            ? 'bg-cyan-400 text-gray-950'
                            : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                          }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-cyan-400
                            border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-400">No Products Found</p>
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