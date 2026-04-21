import SellerSidebar from './SellerSidebar'

export default function SellerLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <SellerSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}