import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import api from '../../api/axios'

export default function AdminSellers() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    api.get('/admin/sellers')
      .then(res => setSellers(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = sellers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center
                      justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">All Sellers</h1>
          <p className="text-gray-400 text-sm mt-1">
            {sellers.length} sellers registered
          </p>
        </div>
        <input
          type="text" placeholder="Search sellers..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-white text-sm
                     rounded-xl px-4 py-2.5 outline-none w-full sm:w-64
                     focus:border-cyan-500 placeholder:text-gray-600"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-cyan-400
                          border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl
                        p-12 text-center">
          <p className="text-gray-500 text-sm">No sellers found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-gray-900 border border-gray-800
                          rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Name','Email','Phone','Joined'].map(h => (
                    <th key={h} className="text-left text-gray-400 text-xs
                                           font-medium uppercase tracking-wider
                                           px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map(seller => (
                  <tr key={seller.id}
                      className="hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-400/10 text-green-400
                                        rounded-full flex items-center
                                        justify-center text-sm font-medium
                                        flex-shrink-0">
                          {seller.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white text-sm">
                          {seller.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {seller.email}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {seller.phone || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(seller.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(seller => (
              <div key={seller.id}
                   className="bg-gray-900 border border-gray-800
                              rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-green-400/10 text-green-400
                                  rounded-full flex items-center justify-center
                                  text-sm font-medium flex-shrink-0">
                    {seller.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {seller.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(seller.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 pl-12">
                  <p className="text-gray-400 text-xs">{seller.email}</p>
                  <p className="text-gray-400 text-xs">
                    {seller.phone || 'No phone'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  )
}