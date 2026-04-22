import { useEffect, useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import api from "../../api/axios";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category_id: "",
  images: [],
};

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    api
      .get("/seller/products")
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  const openCreate = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
      images: [],
    });
    setError("");
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImages = (e) =>
    setForm({ ...form, images: Array.from(e.target.files) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("stock", form.stock);
      data.append("category_id", form.category_id);
      form.images.forEach((img) => data.append("images[]", img));

      if (editProduct) {
        await api.post(`/seller/products/${editProduct.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/seller/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(", "));
      } else {
        setError(err.response?.data?.message || "Something went wrong.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/seller/products/${id}`);
    fetchProducts();
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm("Delete this image?")) return;
    await api.delete(`/seller/images/${imageId}`);
    fetchProducts();
  };

  return (
    <SellerLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">My Products</h1>
          <p className="text-gray-400 text-sm mt-1">
            {products.length} products listed
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-cyan-400 hover:bg-cyan-300 text-gray-950 font-semibold
          text-sm px-5 py-2.5 rounded-xl transition"
        >
          + Add Product
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div
            className="w-8 h-8 border-2 border-cyan-400
            border-t-transparent rounded-full animate-spin"
          />
        </div>
      ) : products.length === 0 ? (
        <div
          className="bg-gray-900 border border-gray-800 rounded-2xl
                        p-12 text-center"
        >
          <p className="text-5xl mb-4">📦</p>
          <p className="text-gray-400 mb-4">No products yet</p>
          <button
            onClick={openCreate}
            className="bg-cyan-400 hover:bg-cyan-300 text-gray-950
                       font-medium text-sm px-5 py-2.5 rounded-xl transition"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl
              overflow-hidden"
            >
              {/* Image */}
              <div
                className="h-40 bg-gray-800 flex items-center justify-center
                overflow-hidden"
              >
                {product.images?.[0] ? (
                  <img
                    src={`http://localhost:8000/storage/${product.images[0].image_path}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">📦</span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-cyan-400 mb-1">
                  {product.category?.name}
                </p>
                <h3 className="text-white font-medium text-sm line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-cyan-400 font-bold">
                    Rs. {Number(product.price).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Stock: {product.stock}
                  </p>
                </div>

                {/* Images Row */}
                {product.images?.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {product.images.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={`http://localhost:8000/storage/${img.image_path}`}
                          className="w-10 h-10 rounded-lg object-cover
                          border border-gray-700"
                          alt=""
                        />
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          className="absolute -top-1 -right-1 w-4 h-4
                                     bg-red-500 text-white rounded-full
                                     text-xs items-center justify-center
                                     hidden group-hover:flex"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openEdit(product)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700
                               text-white text-xs py-2 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-400/10 hover:bg-red-400
                               text-red-400 hover:text-white text-xs
                               py-2 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            className="bg-gray-900 border border-gray-800 rounded-2xl
                          w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div
              className="flex items-center justify-between p-6
                            border-b border-gray-800"
            >
              <h2 className="text-white font-semibold text-lg">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div
                  className="bg-red-500/10 border border-red-500/30
                                text-red-400 text-sm rounded-xl px-4 py-3"
                >
                  {error}
                </div>
              )}

              <div>
                <label className="text-gray-400 text-sm block mb-1.5">
                  Product Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Samsung Galaxy S24"
                  className="w-full bg-gray-800 border border-gray-700
                             text-white rounded-xl px-4 py-3 text-sm
                             outline-none focus:border-cyan-500
                             placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Describe your product..."
                  className="w-full bg-gray-800 border border-gray-700
                             text-white rounded-xl px-4 py-3 text-sm
                             outline-none focus:border-cyan-500
                             placeholder:text-gray-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1.5">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="0"
                    className="w-full bg-gray-800 border border-gray-700
                               text-white rounded-xl px-4 py-3 text-sm
                               outline-none focus:border-cyan-500
                               placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1.5">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="0"
                    className="w-full bg-gray-800 border border-gray-700
                               text-white rounded-xl px-4 py-3 text-sm
                               outline-none focus:border-cyan-500
                               placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1.5">
                  Category
                </label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700
                             text-white rounded-xl px-4 py-3 text-sm
                             outline-none focus:border-cyan-500"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1.5">
                  Product Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                  className="w-full bg-gray-800 border border-gray-700
                             text-gray-400 rounded-xl px-4 py-3 text-sm
                             outline-none focus:border-cyan-500
                             file:mr-3 file:bg-cyan-400 file:text-gray-950
                             file:border-0 file:rounded-lg file:px-3
                             file:py-1 file:text-xs file:font-medium
                             file:cursor-pointer"
                />
                {editProduct && (
                  <p className="text-gray-600 text-xs mt-1">
                    Upload new images to add more
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white
                             py-3 rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-cyan-400 hover:bg-cyan-300
                             disabled:opacity-50 text-gray-950 font-semibold
                             py-3 rounded-xl text-sm transition"
                >
                  {submitting
                    ? "Saving..."
                    : editProduct
                      ? "Update Product"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SellerLayout>
  );
}
