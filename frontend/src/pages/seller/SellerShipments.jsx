import { useEffect, useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import api from "../../api/axios";

const statusColors = {
  pending: "bg-yellow-400/10 text-yellow-400",
  confirmed: "bg-blue-400/10 text-blue-400",
  shipped: "bg-purple-400/10 text-purple-400",
};

const nextStatus = {
  pending: "confirmed",
  confirmed: "shipped",
  shipped: "delivered",
};

const nextLabel = {
  pending: "Confirm Order",
  confirmed: "Mark Shipped",
  shipped: "Mark Delivered",
};

export default function SellerShipments() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = () => {
    setLoading(true);
    api
      .get("/seller/shipments")
      .then((res) => setShipments(res.data))
      .finally(() => setLoading(false));
  };

  const handleUpdate = async (itemId, status) => {
    setUpdating(itemId);
    try {
      await api.put(`/seller/orders/${itemId}/status`, { status });
      fetchShipments();
    } finally {
      setUpdating(null);
    }
  };

  const handleCancel = async (itemId) => {
    if (!confirm("Cancel this order?")) return;
    setUpdating(itemId);
    try {
      await api.put(`/seller/orders/${itemId}/status`, { status: "cancelled" });
      fetchShipments();
    } finally {
      setUpdating(null);
    }
  };

  return (
    <SellerLayout>
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Shipments</h1>
        <p className="text-gray-400 text-sm mt-1">
          {shipments.length} active orders
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div
            className="w-8 h-8 border-2 border-cyan-400
                          border-t-transparent rounded-full animate-spin"
          />
        </div>
      ) : shipments.length === 0 ? (
        <div
          className="bg-gray-900 border border-gray-800 rounded-2xl
                        p-12 text-center"
        >
          <p className="text-5xl mb-4">🚚</p>
          <p className="text-gray-400">No active shipments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shipments.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 border border-gray-800
                            rounded-2xl p-4 sm:p-6"
            >
              {/* Status Badge — top on mobile */}
              <div className="flex items-center justify-between mb-4 sm:hidden">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
                                  capitalize ${statusColors[item.status]}`}
                >
                  {item.status}
                </span>
                <div className="flex gap-2">
                  {nextStatus[item.status] && (
                    <button
                      onClick={() =>
                        handleUpdate(item.id, nextStatus[item.status])
                      }
                      disabled={updating === item.id}
                      className="bg-cyan-400 hover:bg-cyan-300
                                 disabled:opacity-50 text-gray-950
                                 font-medium text-xs px-3 py-1.5
                                 rounded-xl transition"
                    >
                      {updating === item.id ? "..." : nextLabel[item.status]}
                    </button>
                  )}
                  <button
                    onClick={() => handleCancel(item.id)}
                    disabled={updating === item.id}
                    className="text-red-400 hover:text-red-300 text-xs
                               hover:bg-red-400/10 px-3 py-1.5
                               rounded-lg transition border
                               border-red-400/20"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex items-start justify-between gap-4">
                {/* Left: Customer Info */}
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-cyan-400/10
                                  text-cyan-400 rounded-full flex items-center
                                  justify-center font-medium text-sm
                                  flex-shrink-0"
                  >
                    {item.order?.customer?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-medium text-sm sm:text-base">
                      {item.order?.customer?.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm break-all">
                      {item.order?.customer?.email}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {item.order?.customer?.phone || "No phone"}
                    </p>

                    <div className="mt-3 space-y-1">
                      <p className="text-xs sm:text-sm">
                        <span className="text-gray-500">Product: </span>
                        <span className="text-white line-clamp-1">
                          {item.product?.name}
                        </span>
                      </p>
                      <p className="text-xs sm:text-sm">
                        <span className="text-gray-500">Qty: </span>
                        <span className="text-white">{item.quantity}</span>
                      </p>
                      <p className="text-xs sm:text-sm">
                        <span className="text-gray-500">Amount: </span>
                        <span className="text-cyan-400 font-medium">
                          Rs.{" "}
                          {Number(item.price * item.quantity).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-xs sm:text-sm">
                        <span className="text-gray-500">Ship to: </span>
                        <span className="text-gray-300">
                          {item.order?.shipping_address}
                        </span>
                      </p>
                      <p className="text-xs sm:text-sm">
                        <span className="text-gray-500">Phone: </span>
                        <span className="text-gray-300">
                          {item.order?.shipping_phone}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Status + Actions — desktop only */}
                <div
                  className="hidden sm:flex flex-col items-end gap-3
                                flex-shrink-0"
                >
                  <span
                    className={`px-3 py-1 rounded-full text-xs
                                    font-medium capitalize
                                    ${statusColors[item.status]}`}
                  >
                    {item.status}
                  </span>

                  {nextStatus[item.status] && (
                    <button
                      onClick={() =>
                        handleUpdate(item.id, nextStatus[item.status])
                      }
                      disabled={updating === item.id}
                      className="bg-cyan-400 hover:bg-cyan-300
                                 disabled:opacity-50 text-gray-950
                                 font-medium text-sm px-4 py-2
                                 rounded-xl transition"
                    >
                      {updating === item.id
                        ? "Updating..."
                        : nextLabel[item.status]}
                    </button>
                  )}

                  <button
                    onClick={() => handleCancel(item.id)}
                    disabled={updating === item.id}
                    className="text-red-400 hover:text-red-300 text-sm
                               hover:bg-red-400/10 px-3 py-1.5
                               rounded-lg transition"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SellerLayout>
  );
}
