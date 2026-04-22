import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import api from '../../api/axios'

export default function AdminSellerRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/admin/seller-requests')
      .then(res => setRequests(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleAccept = async (id) => {
    await api.post(`/admin/seller-requests/${id}/accept`)
    setRequests(requests.filter(r => r.id !== id))
  }

  const handleDecline = async (id) => {
    await api.post(`/admin/seller-requests/${id}/decline`)
    setRequests(requests.filter(r => r.id !== id))
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Seller Requests</h1>
        <p className="text-gray-400 text-sm mt-1">
          {requests.length} pending requests
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-cyan-400
                          border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl
                        p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-400">No pending requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id}
                 className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6">

              {/* Top: Avatar + Info + Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-start
                              sm:justify-between gap-4">

                {/* Left: Avatar + Details */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-400/10 text-yellow-400
                                  rounded-full flex items-center justify-center
                                  font-medium flex-shrink-0">
                    {req.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-medium">{req.user?.name}</h3>
                    <p className="text-gray-400 text-sm break-all">
                      {req.user?.email}
                    </p>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm">
                        <span className="text-gray-500">Shop Name: </span>
                        <span className="text-white">{req.shop_name}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Description: </span>
                        <span className="text-gray-300">
                          {req.shop_description}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Phone: </span>
                        <span className="text-gray-300">{req.phone}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Address: </span>
                        <span className="text-gray-300">{req.address}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 sm:flex-col sm:items-end
                                flex-row flex-wrap">
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="flex-1 sm:flex-none bg-green-400/10 text-green-400
                               hover:bg-green-400 hover:text-gray-950 px-4 py-2
                               rounded-xl text-sm font-medium
                               transition-all duration-200 text-center"
                  >
                    ✓ Accept
                  </button>
                  <button
                    onClick={() => handleDecline(req.id)}
                    className="flex-1 sm:flex-none bg-red-400/10 text-red-400
                               hover:bg-red-400 hover:text-white px-4 py-2
                               rounded-xl text-sm font-medium
                               transition-all duration-200 text-center"
                  >
                    ✕ Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}