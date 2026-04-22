import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ProductCard from '../../components/customer/ProductCard'
import api from '../../api/axios'

export default function CustomerHome() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/categories'),
    ]).then(([prodRes, catRes]) => {
      setProducts(prodRes.data)
      setAllProducts(prodRes.data)
      setCategories(catRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const handleCategorySelect = (catId) => {
    setSelectedCat(catId)
    setSearch('')
    setSuggestions([])
    setShowSuggestions(false)
    if (!catId) {
      setProducts(allProducts)
    } else {
      setProducts(
        allProducts.filter(p => String(p.category_id) === String(catId))
      )
    }
  }

  const handleSearch = (searchTerm = search) => {
    setShowSuggestions(false)
    setSuggestions([])
    setMobileSearchOpen(false)

    if (!searchTerm.trim()) {
      if (selectedCat) {
        setProducts(
          allProducts.filter(
            p => String(p.category_id) === String(selectedCat)
          )
        )
      } else {
        setProducts(allProducts)
      }
      return
    }

    const term = searchTerm.toLowerCase()
    setProducts(
      allProducts.filter(p => {
        const matchSearch =
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.category?.name?.toLowerCase().includes(term)
        const matchCat = selectedCat
          ? String(p.category_id) === String(selectedCat)
          : true
        return matchSearch && matchCat
      })
    )
  }

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearch(val)

    if (val.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const term = val.toLowerCase()
    const base = selectedCat
      ? allProducts.filter(p => String(p.category_id) === String(selectedCat))
      : allProducts

    const productSuggestions = base
      .filter(p => p.name.toLowerCase().includes(term))
      .slice(0, 4)
      .map(p => ({ type: 'product', label: p.name, id: p.id }))

    const catSuggestions = categories
      .filter(c => c.name.toLowerCase().includes(term))
      .slice(0, 2)
      .map(c => ({ type: 'category', label: c.name, id: c.id, icon: c.icon }))

    const all = [...catSuggestions, ...productSuggestions]
    setSuggestions(all)
    setShowSuggestions(all.length > 0)
  }

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'category') {
      handleCategorySelect(suggestion.id)
      setSearch('')
    } else {
      navigate(`/product/${suggestion.id}`)
    }
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Reusable Search Box Component (used in both desktop & mobile)
  const SearchBox = ({ autoFocus = false }) => (
    <div className="flex gap-2 w-full relative">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search Products..."
          value={search}
          autoFocus={autoFocus}
          onChange={handleSearchChange}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSearch()
            if (e.key === 'Escape') setShowSuggestions(false)
          }}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className="w-full bg-gray-800 border border-gray-700 text-white text-sm 
                     rounded-xl px-4 py-2.5 outline-none focus:border-cyan-500 
                     placeholder:text-gray-500"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 
                          border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onMouseDown={() => handleSuggestionClick(s)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 
                           transition text-left border-b border-gray-800 last:border-0"
              >
                <span className="text-base flex-shrink-0">
                  {s.type === 'category' ? s.icon : '📦'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{s.label}</p>
                  <p className="text-gray-500 text-xs">
                    {s.type === 'category' ? 'Category' : 'Product'}
                  </p>
                </div>
                <span className="text-gray-600 text-xs flex-shrink-0">
                  {s.type === 'category' ? '→ Browse' : '→ View'}
                </span>
              </button>
            ))}

            <button
              onMouseDown={() => handleSearch(search)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 
                         transition text-left bg-gray-800/50"
            >
              <span className="text-base">🔍</span>
              <p className="text-cyan-400 text-sm">
                Search all results for "
                <span className="font-medium">{search}</span>"
              </p>
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => handleSearch()}
        className="bg-cyan-400 hover:bg-cyan-300 text-gray-950 font-medium 
                   text-sm px-4 py-2.5 rounded-xl transition shrink-0"
      >
        Search
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">

      {/* ───────────── NAVBAR ───────────── */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">

          {/* Row 1 — Logo + Icons (always visible) */}
          <div className="flex items-center justify-between gap-3">

            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-cyan-400 rounded-xl 
                              flex items-center justify-center text-gray-950 
                              font-black text-sm">
                E
              </div>
              <span className="text-white font-bold text-base sm:text-lg">
                Electro<span className="text-cyan-400">Mart</span>
              </span>
            </div>

            {/* Desktop Search — hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <SearchBox />
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 shrink-0 relative">

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden text-gray-400 hover:text-white p-2 
                           rounded-xl border border-gray-700 hover:border-gray-500 
                           transition text-base"
              >
                🔍
              </button>

              {/* My Orders — text hidden on small */}
              <button
                onClick={() => navigate('/orders')}
                className="hidden sm:block text-gray-400 hover:text-white text-sm 
                           border border-gray-700 hover:border-gray-500 px-3 py-2 
                           rounded-xl transition"
              >
                My Orders
              </button>

              {/* Orders icon — only on xs */}
              <button
                onClick={() => navigate('/orders')}
                className="sm:hidden text-gray-400 hover:text-white p-2 
                           rounded-xl border border-gray-700 hover:border-gray-500 
                           transition text-base"
                title="My Orders"
              >
                📦
              </button>

              {/* Cart */}
              <button
                onClick={() => navigate('/cart')}
                className="text-gray-400 hover:text-white text-sm border 
                           border-gray-700 hover:border-gray-500 px-3 py-2 
                           rounded-xl transition"
              >
                🛒
                <span className="hidden sm:inline ml-1">Cart</span>
              </button>

              {/* Become a Seller — hidden on mobile */}
              <button
                onClick={() => navigate('/become-seller')}
                className="hidden lg:block text-cyan-400 hover:text-cyan-300 
                           text-sm border border-cyan-400/30 hover:border-cyan-400 
                           px-3 py-2 rounded-xl transition whitespace-nowrap"
              >
                Become a Seller
              </button>

              {/* Avatar / Menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-cyan-400/10 text-cyan-400 
                           rounded-full flex items-center justify-center font-medium 
                           text-sm hover:bg-cyan-400/20 transition shrink-0"
              >
                {user?.name?.charAt(0).toUpperCase()}
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 top-12 bg-gray-900 border 
                                border-gray-800 rounded-xl shadow-xl w-48 
                                z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-white text-sm font-medium">{user?.name}</p>
                    <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                  </div>

                  {/* Become Seller — inside menu on mobile */}
                  <button
                    onClick={() => { navigate('/become-seller'); setMenuOpen(false) }}
                    className="lg:hidden w-full text-left px-4 py-3 text-cyan-400 
                               hover:bg-cyan-400/10 text-sm transition border-b 
                               border-gray-800"
                  >
                    Become a Seller
                  </button>

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

          {/* Row 2 — Mobile Search Bar (slide down) */}
          {mobileSearchOpen && (
            <div className="md:hidden mt-3 pb-1">
              <SearchBox autoFocus />
            </div>
          )}
        </div>
      </nav>

      {/* ───────────── MAIN CONTENT ───────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Categories */}
        <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto 
                        pb-2 scrollbar-hide">
          <button
            onClick={() => handleCategorySelect('')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm 
                        font-medium whitespace-nowrap transition-all ${
              !selectedCat
                ? 'bg-cyan-400 text-gray-950'
                : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
            }`}
          >
            All
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm 
                          font-medium whitespace-nowrap transition-all ${
                String(selectedCat) === String(cat.id)
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
                            border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-400">No Products Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 
                          lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}