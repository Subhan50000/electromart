import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function CustomerHome() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-3xl font-bold mb-2">
          ElectroMart
        </h1>
        <p className="text-gray-400 mb-6">Welcome, {user?.name}!</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-400 text-white
                     px-6 py-2 rounded-xl text-sm transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}