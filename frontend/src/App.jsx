import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login           from './pages/auth/Login'
import Register        from './pages/auth/Register'
import AdminDashboard  from './pages/admin/AdminDashboard'
import SellerDashboard from './pages/seller/SellerDashboard'
import CustomerHome    from './pages/customer/CustomerHome'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Seller Routes */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerHome />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}