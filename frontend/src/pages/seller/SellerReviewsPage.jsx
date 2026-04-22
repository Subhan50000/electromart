import { useEffect, useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import api from "../../api/axios";

export default function SellerReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/seller/reviews")
      .then((res) => setReviews(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SellerLayout>
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold">Customer Reviews</h1>
        <p className="text-gray-400 text-sm mt-1">
          All reviews on your products
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">⭐</p>
          <p className="text-gray-400">No Reviews Found</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-800 text-gray-300 text-sm">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Review</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {reviews.map((r, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-800 hover:bg-gray-800/50 transition"
                >
                  <td className="p-4 text-white font-medium">
                    {r.product?.name || "N/A"}
                  </td>

                  <td className="p-4 text-gray-300">
                    {r.user?.name || "Guest"}
                  </td>

                  <td className="p-4 text-yellow-400">
                    {"⭐".repeat(r.rating)} ({r.rating})
                  </td>

                  <td className="p-4 text-gray-400 max-w-xs">
                    {r.review || r.comment || "No review"}
                  </td>

                  <td className="p-4 text-gray-500 text-sm">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SellerLayout>
  );
}
