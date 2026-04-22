import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin/dashboard',       icon: '▣', label: 'Dashboard'       },
  { to: '/admin/customers',       icon: '👥', label: 'Customers'       },
  { to: '/admin/sellers',         icon: '🏪', label: 'Sellers'         },
  { to: '/admin/seller-requests', icon: '📋', label: 'Seller Requests' },
]

export default function AdminSidebar() {
  const { logout }        = useAuth()
  const navigate           = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center
                            justify-center text-gray-950 font-black text-sm">E</div>
            <span className="text-white font-bold text-lg tracking-tight">
              Electro<span className="text-cyan-400">Mart</span>
            </span>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
        <p className="text-gray-500 text-xs mt-1">Admin Panel</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setMobileOpen(false)}
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
    </>
  )

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900
                      border-b border-gray-800 px-4 py-3 flex items-center
                      justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center
                          justify-center text-gray-950 font-black text-sm">E</div>
          <span className="text-white font-bold text-lg tracking-tight">
            Electro<span className="text-cyan-400">Mart</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-gray-400 hover:text-white transition p-1"
        >
          {/* Hamburger Icon */}
          <div className="space-y-1.5">
            <div className="w-6 h-0.5 bg-current"/>
            <div className="w-6 h-0.5 bg-current"/>
            <div className="w-6 h-0.5 bg-current"/>
          </div>
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-gray-900
                         border-r border-gray-800 flex flex-col z-50
                         transition-transform duration-300
                         ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-gray-900
                        border-r border-gray-800 flex-col fixed left-0 top-0">
        <SidebarContent />
      </aside>
    </>
  )
}