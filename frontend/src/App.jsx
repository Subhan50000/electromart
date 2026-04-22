import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminSellers from "./pages/admin/AdminSellers";
import AdminSellerRequests from "./pages/admin/AdminSellerRequests";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerShipments from "./pages/seller/SellerShipments";
import SellerOrderHistory from "./pages/seller/SellerOrderHistory";
import CustomerHome from "./pages/customer/CustomerHome";
import ProductDetail from "./pages/customer/ProductDetail";
import SellerStorePage from "./pages/customer/SellerStorePage";
import BecomeSeller from "./pages/customer/BecomeSeller";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrdersPage from "./pages/customer/OrdersPage";
import SellerReviewsPage from "./pages/seller/SellerReviewsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sellers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminSellers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/seller-requests"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminSellerRequests />
              </ProtectedRoute>
            }
          />

          {/* Seller */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/products"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/shipments"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerShipments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/history"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerOrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/reviews"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerReviewsPage />
              </ProtectedRoute>
            }
          />

          {/* Customer */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/:sellerId"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <SellerStorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/become-seller"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <BecomeSeller />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
