import { useEffect, useState } from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import api from '../../api/axios'

const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className={`text-3xl font-bold ${color}`}>{value ?? '...'}</p>
  </div>
)

export default function SellerDashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/seller/stats')
      .then(res => setStats(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SellerLayout>
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Your store overview
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-cyan-400
                          border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <StatCard
              label="Total Products"
              value={stats?.total_products}
              color="text-cyan-400" icon="📦"
            />
            <StatCard
              label="Total Orders"
              value={stats?.total_orders}
              color="text-purple-400" icon="🛒"
            />
            <StatCard
              label="Total Revenue"
              value={`Rs. ${Number(stats?.total_revenue || 0).toLocaleString()}`}
              color="text-emerald-400" icon="💰"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Pending Orders"
              value={stats?.pending}
              color="text-yellow-400" icon="⏳"
            />
            <StatCard
              label="Delivered"
              value={stats?.delivered}
              color="text-green-400" icon="✅"
            />
            <StatCard
              label="Cancelled"
              value={stats?.cancelled}
              color="text-red-400" icon="❌"
            />
          </div>

          <div className="mt-6">
            <StatCard
              label="Total Reviews"
              value={stats?.total_reviews}
              color="text-yellow-400" icon="⭐"
            />
          </div>
        </>
      )}
    </SellerLayout>
  )
}