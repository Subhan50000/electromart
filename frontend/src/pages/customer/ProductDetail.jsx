import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMsg, setCartMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent 
                        rounded-full animate-spin" />
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-gray-400">Product not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm transition"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );

  const avgRating = product.reviews?.length
    ? (
        product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      ).toFixed(1)
    : null;

  const handleAddToCart = async () => {
    setCartLoading(true);
    try {
      await api.post("/cart", {
        product_id: product.id,
        quantity: 1,
      });
      setCartMsg("Added!");
      setTimeout(() => navigate("/cart"), 800);
    } catch (err) {
      setCartMsg(err.response?.data?.message || "Error adding to cart.");
      setTimeout(() => setCartMsg(""), 2000);
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">

      {/* ───────────── NAVBAR ───────────── */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 
                        flex items-center justify-between gap-4">

          {/* Left — Back + Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white transition text-sm 
                         flex items-center gap-1.5 shrink-0"
            >
              <span>←</span>
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-cyan-400 rounded-lg flex items-center 
                              justify-center text-gray-950 font-black text-xs">
                E
              </div>
              <span className="text-white font-bold text-sm sm:text-base">
                Electro<span className="text-cyan-400">Mart</span>
              </span>
            </div>
          </div>

          {/* Right — Cart shortcut */}
          <button
            onClick={() => navigate("/cart")}
            className="text-gray-400 hover:text-white text-sm border border-gray-700 
                       hover:border-gray-500 px-3 py-1.5 rounded-xl transition"
          >
            🛒 <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </nav>

      {/* ───────────── CONTENT ───────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Product — Image + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* ── Images ── */}
          <div>
            {/* Main Image */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl 
                            h-64 sm:h-80 lg:h-96 flex items-center justify-center 
                            overflow-hidden mb-3 sm:mb-4">
              {product.images?.[selectedImage]?.image_path ? (
                <img
                  src={`http://localhost:8000/storage/${product.images[selectedImage].image_path}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl sm:text-7xl">📦</span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden 
                                border-2 transition flex-shrink-0 ${
                      selectedImage === idx
                        ? "border-cyan-400"
                        : "border-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={`http://localhost:8000/storage/${img.image_path}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col">

            {/* Category Badge */}
            <span className="inline-block text-cyan-400 text-xs sm:text-sm 
                             bg-cyan-400/10 border border-cyan-400/20 rounded-lg 
                             px-3 py-1 w-fit mb-3">
              {product.category?.name}
            </span>

            {/* Name */}
            <h1 className="text-white text-xl sm:text-2xl lg:text-3xl 
                           font-bold mb-3 leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={`text-sm sm:text-base ${
                        s <= Math.round(avgRating)
                          ? "text-yellow-400"
                          : "text-gray-700"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-400 text-xs sm:text-sm">
                  {avgRating} ({product.reviews?.length} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <p className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-5">
              Rs. {Number(product.price).toLocaleString()}
            </p>

            {/* Description */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl 
                            p-4 mb-5">
              <p className="text-gray-400 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock */}
            <p className="text-sm mb-5">
              <span className="text-gray-500">Stock: </span>
              <span
                className={
                  product.stock > 0 ? "text-green-400" : "text-red-400"
                }
              >
                {product.stock > 0
                  ? `${product.stock} available`
                  : "Out of stock"}
              </span>
            </p>

            {/* Add to Cart */}
            {product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className={`w-full font-semibold py-3 sm:py-3.5 rounded-xl 
                            text-sm transition mb-4 flex items-center 
                            justify-center gap-2 ${
                  cartLoading
                    ? "bg-cyan-400/50 text-gray-950 cursor-not-allowed"
                    : "bg-cyan-400 hover:bg-cyan-300 text-gray-950"
                }`}
              >
                {cartLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-950 
                                    border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : cartMsg ? (
                  <>✅ {cartMsg}</>
                ) : (
                  <>🛒 Add to Cart</>
                )}
              </button>
            )}

            {/* Out of Stock Badge */}
            {product.stock === 0 && (
              <div className="w-full bg-gray-800 border border-gray-700 
                              text-gray-500 font-medium py-3 rounded-xl 
                              text-sm text-center mb-4">
                Out of Stock
              </div>
            )}

            {/* Seller Info */}
            <div
              onClick={() => navigate(`/seller/${product.seller_id}`)}
              className="bg-gray-900 border border-gray-800 hover:border-cyan-500/50 
                         rounded-xl p-4 cursor-pointer transition group mt-auto"
            >
              <p className="text-gray-500 text-xs mb-2">Sold by</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-cyan-400/10 text-cyan-400 rounded-full 
                                flex items-center justify-center font-medium 
                                text-sm shrink-0">
                  {product.seller?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium 
                                group-hover:text-cyan-400 transition truncate">
                    {product.seller?.name}
                  </p>
                  <p className="text-gray-500 text-xs">View all products →</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ───────────── REVIEWS ───────────── */}
        <div className="mt-10 sm:mt-12">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h2 className="text-white text-lg sm:text-xl font-bold">
              Customer Reviews
              {avgRating && (
                <span className="text-gray-400 text-sm font-normal ml-2">
                  ({product.reviews?.length})
                </span>
              )}
            </h2>

            {/* Avg Rating Badge */}
            {avgRating && (
              <div className="flex items-center gap-1.5 bg-yellow-400/10 
                              border border-yellow-400/20 rounded-xl px-3 py-1.5">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-yellow-400 text-sm font-bold">
                  {avgRating}
                </span>
              </div>
            )}
          </div>

          {product.reviews?.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl 
                            p-8 sm:p-12 text-center">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-gray-400 text-sm">No reviews yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.reviews?.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5"
                >
                  {/* Reviewer */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-cyan-400/10 text-cyan-400 
                                    rounded-full flex items-center justify-center 
                                    text-sm font-medium shrink-0">
                      {(review.customer?.name || review.user?.name)
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {review.customer?.name || review.user?.name}
                      </p>
                      {/* Stars */}
                      <div className="flex text-xs">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={
                              s <= review.rating
                                ? "text-yellow-400"
                                : "text-gray-700"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  {(review.comment || review.review) && (
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {review.comment || review.review}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}