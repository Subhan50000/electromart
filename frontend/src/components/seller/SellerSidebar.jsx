import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/seller/dashboard', icon: '▣', label: 'Dashboard'     },
  { to: '/seller/products',  icon: '📦', label: 'My Products'   },
  { to: '/seller/shipments', icon: '🚚', label: 'Shipments'     },
  { to: '/seller/history',   icon: '📋', label: 'Order History' },
]

export default function SellerSidebar() {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800
                      flex flex-col fixed left-0 top-0">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center
                          justify-center text-gray-950 font-black text-sm">E</div>
          <span className="text-white font-bold text-lg tracking-tight">
            Electro<span className="text-cyan-400">Mart</span>
          </span>
        </div>
        <p className="text-gray-500 text-xs mt-1">Seller Panel</p>
      </div>

      {/* Seller Info */}
      <div className="px-4 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-cyan-400/10 text-cyan-400 rounded-full
                          flex items-center justify-center font-medium text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.name}
            </p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to} to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
               transition-all duration-200
               ${isActive
                 ? 'bg-cyan-400/10 text-cyan-400 font-medium'
                 : 'text-gray-400 hover:text-white hover:bg-gray-800'
               }`
            }
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                     text-sm text-gray-400 hover:text-red-400
                     hover:bg-red-400/10 transition-all duration-200"
        >
          <span>⎋</span>
          Sign Out
        </button>
      </div>
    </aside>
  )
}