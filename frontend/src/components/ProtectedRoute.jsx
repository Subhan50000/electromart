import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin')    return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'seller')   return <Navigate to="/seller/dashboard" replace />
    if (user.role === 'customer') return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute