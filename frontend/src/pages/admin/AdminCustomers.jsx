import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import api from '../../api/axios'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')

  useEffect(() => {
    api.get('/admin/customers')
      .then(res => setCustomers(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this customer?')) return
    await api.delete(`/admin/users/${id}`)
    setCustomers(customers.filter(c => c.id !== id))
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">All Customers</h1>
          <p className="text-gray-400 text-sm mt-1">
            {customers.length} customers registered
          </p>
        </div>
        <input
          type="text" placeholder="Search customers..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-white text-sm
                     rounded-xl px-4 py-2.5 outline-none w-64
                     focus:border-cyan-500 placeholder:text-gray-600"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-cyan-400
                          border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl
                        overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                {['Name','Email','Phone','Joined','Action'].map(h => (
                  <th key={h} className="text-left text-gray-400 text-xs
                                         font-medium uppercase tracking-wider
                                         px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}
                      className="text-center text-gray-500 py-12 text-sm">
                    No customers found
                  </td>
                </tr>
              ) : filtered.map(customer => (
                <tr key={customer.id}
                    className="hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-400/10 text-cyan-400
                                      rounded-full flex items-center
                                      justify-center text-sm font-medium">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white text-sm">
                        {customer.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {customer.phone || '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-400 hover:text-red-300 text-sm
                                 hover:bg-red-400/10 px-3 py-1 rounded-lg
                                 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}