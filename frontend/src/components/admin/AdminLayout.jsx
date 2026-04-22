import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AdminSidebar />
     
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 p-4 lg:p-8 w-full min-w-0">
        {children}
      </main>
    </div>
  )
}