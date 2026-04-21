import { useEffect, useState } from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import api from '../../api/axios'

const statusColors = {
  delivered: 'bg-green-400/10 text-green-400',
  cancelled: 'bg-red-400/10 text-red-400',
}

export default function SellerOrderHistory() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    api.get('/seller/order-history')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter)

  return (
    <SellerLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Order History</h1>
          <p className="text-gray-400 text-sm mt-1">
            {orders.length} completed orders
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'delivered', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize
                          transition ${filter === f
                            ? 'bg-cyan-400 text-gray-950'
                            : 'bg-gray-900 text-gray-400 border border-gray-800'
                          }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-cyan-400
                          border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl
                        p-12 text-center">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-gray-400">No orders found</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl
                        overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                {['Customer','Product','Qty','Amount','Status','Date'].map(h => (
                  <th key={h}
                      className="text-left text-gray-400 text-xs font-medium
                                 uppercase tracking-wider px-6 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4">
                    <p className="text-white text-sm">
                      {item.order?.customer?.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {item.order?.customer?.email}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {item.product?.name}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-cyan-400 text-sm font-medium">
                    Rs. {Number(item.price * item.quantity).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs
                                      font-medium capitalize
                                      ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SellerLayout>
  )
}