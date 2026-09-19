import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  AlertTriangle,
  Edit3,
  Package,
  Plus,
  Search,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import {
  getAdminInventory,
  createAdminInventory,
  updateAdminInventory,
  updateAdminInventoryStock,
  deleteAdminInventory,
} from "../../services/api";

const CATEGORIES = [
  "Pizza Base",
  "Sauce",
  "Cheese",
  "Vegetable",
  "Meat",
  "Beverage",
  "Other",
];

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const [activeItem, setActiveItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Pizza Base",
    stock: "",
    threshold: "20",
    unit: "units",
    price: "0",
  });

  const [quickStockValue, setQuickStockValue] = useState("");

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch Inventory from MongoDB
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminInventory();
      if (res.data && res.data.success) {
        setInventory(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch inventory error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load inventory from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Filter items
  const filtered = inventory.filter((item) => {
    const matchesSearch = `${item.name} ${item.category}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = inventory.filter(
    (item) => item.stock < item.threshold
  ).length;

  // Handlers
  const handleOpenAdd = () => {
    setFormData({
      name: "",
      category: "Pizza Base",
      stock: "50",
      threshold: "20",
      unit: "units",
      price: "0",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setActiveItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      stock: item.stock.toString(),
      threshold: item.threshold.toString(),
      unit: item.unit || "units",
      price: item.price !== undefined ? item.price.toString() : "0",
    });
    setIsEditModalOpen(true);
  };

  const handleOpenStock = (item) => {
    setActiveItem(item);
    setQuickStockValue(item.stock.toString());
    setIsStockModalOpen(true);
  };

  const handleOpenDelete = (item) => {
    setActiveItem(item);
    setIsDeleteModalOpen(true);
  };

  // Create Item Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      const res = await createAdminInventory({
        name: formData.name.trim(),
        category: formData.category,
        stock: Number(formData.stock),
        threshold: Number(formData.threshold),
        unit: formData.unit.trim() || "units",
        price: Number(formData.price) || 0,
      });

      if (res.data?.success) {
        setIsAddModalOpen(false);
        showNotification(`"${formData.name}" added successfully.`);
        fetchInventory();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add inventory item.");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Item Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!activeItem || !formData.name.trim()) return;

    try {
      setSubmitting(true);
      const res = await updateAdminInventory(activeItem._id, {
        name: formData.name.trim(),
        category: formData.category,
        stock: Number(formData.stock),
        threshold: Number(formData.threshold),
        unit: formData.unit.trim() || "units",
        price: Number(formData.price) || 0,
      });

      if (res.data?.success) {
        setIsEditModalOpen(false);
        showNotification(`"${formData.name}" updated successfully.`);
        fetchInventory();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update item.");
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Stock Submit
  const handleStockSubmit = async (e) => {
    e.preventDefault();
    if (!activeItem) return;

    const num = Number(quickStockValue);
    if (isNaN(num) || num < 0) {
      alert("Please enter a valid stock quantity (0 or greater).");
      return;
    }

    try {
      setSubmitting(true);
      const res = await updateAdminInventoryStock(activeItem._id, num);
      if (res.data?.success) {
        setIsStockModalOpen(false);
        showNotification(`Stock for "${activeItem.name}" updated to ${num}.`);
        fetchInventory();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update stock.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Item Submit
  const handleDeleteSubmit = async () => {
    if (!activeItem) return;

    try {
      setSubmitting(true);
      const res = await deleteAdminInventory(activeItem._id);
      if (res.data?.success) {
        setIsDeleteModalOpen(false);
        showNotification(`"${activeItem.name}" deleted successfully.`);
        fetchInventory();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete item.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-7">
        {/* Toast Notification */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-800 animate-slide-up">
            <CheckCircle2 size={18} className="text-green-400 shrink-0" />
            <span className="text-sm font-semibold">{notification.msg}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <p className="text-sm text-red-600 font-bold uppercase tracking-widest">
              Management
            </p>
            <h1 className="text-3xl md:text-4xl font-black mt-1">
              Inventory
            </h1>
            <p className="text-gray-500 mt-2">
              Manage pizza ingredients, pricing, and stock levels in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchInventory}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-gray-300 transition"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin text-red-600" : ""}
              />
              Refresh
            </button>

            <button
              onClick={handleOpenAdd}
              className="bg-red-600 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 shadow-lg shadow-red-200 transition"
            >
              <Plus size={18} />
              Add Item
            </button>
          </div>
        </div>

        {/* Dynamic Low Stock Alert Banner */}
        {lowStockCount > 0 ? (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <AlertTriangle size={19} />
            </div>

            <div>
              <h3 className="font-black text-orange-800">
                Low Stock Alert
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                {lowStockCount} inventory item
                {lowStockCount > 1 ? "s are" : " is"} below the configured
                threshold.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 text-green-800 text-sm font-semibold">
            <CheckCircle2 size={18} className="text-green-600 shrink-0" />
            <span>All inventory items are currently well stocked.</span>
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 flex-1 w-full">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory items or categories..."
              className="bg-transparent outline-none w-full text-sm placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-gray-400 shrink-0 hidden sm:inline">
              Category:
            </span>
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 size={36} className="text-red-600 animate-spin" />
              <p className="text-sm font-bold text-gray-500">
                Loading inventory from MongoDB...
              </p>
            </div>
          ) : error ? (
            <div className="py-16 text-center text-red-600 px-4">
              <p className="font-bold">{error}</p>
              <button
                onClick={fetchInventory}
                className="mt-3 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100"
              >
                Try Again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Package size={28} />
              </div>
              <h3 className="font-black text-gray-800 text-lg">
                No Inventory Items Found
              </h3>
              <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">
                {search || selectedCategory !== "All"
                  ? "No items match your filter criteria."
                  : "Your database currently has no inventory items. Click 'Add Item' to add one."}
              </p>
              <button
                onClick={handleOpenAdd}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4">Item</th>
                    <th className="text-left px-6 py-4">Category</th>
                    <th className="text-left px-6 py-4">Current Stock</th>
                    <th className="text-left px-6 py-4">Threshold</th>
                    <th className="text-left px-6 py-4">Status</th>
                    <th className="text-right px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => {
                    const low = item.stock < item.threshold;
                    const maxRef = Math.max(item.threshold * 2, 50);
                    const percentage = Math.min(
                      (item.stock / maxRef) * 100,
                      100
                    );

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50/70 transition"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                              <Package size={18} />
                            </div>
                            <div>
                              <span className="font-bold text-gray-900 block">
                                {item.name}
                              </span>
                              {item.price > 0 && (
                                <span className="text-xs text-gray-400">
                                  +₹{item.price}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-gray-600 font-medium">
                          {item.category}
                        </td>

                        <td className="px-6 py-5 min-w-48">
                          <div className="flex justify-between mb-2">
                            <span className="font-bold text-gray-900">
                              {item.stock}
                            </span>
                            <span className="text-xs text-gray-400 font-semibold">
                              {item.unit || "units"}
                            </span>
                          </div>

                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${percentage}%` }}
                              className={`h-full rounded-full transition-all duration-300 ${
                                low ? "bg-red-500" : "bg-green-500"
                              }`}
                            />
                          </div>
                        </td>

                        <td className="px-6 py-5 font-bold text-gray-700">
                          {item.threshold} {item.unit || "units"}
                        </td>

                        <td className="px-6 py-5">
                          {low ? (
                            <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-bold inline-flex items-center gap-1">
                              <AlertTriangle size={12} />
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold inline-flex items-center gap-1">
                              <CheckCircle2 size={12} />
                              In Stock
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenStock(item)}
                              title="Update stock quantity"
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 font-semibold text-xs transition"
                            >
                              <Sliders size={14} />
                              Stock
                            </button>

                            <button
                              onClick={() => handleOpenEdit(item)}
                              title="Edit item details"
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                            >
                              <Edit3 size={15} />
                            </button>

                            <button
                              onClick={() => handleOpenDelete(item)}
                              title="Delete item"
                              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          ADD INVENTORY ITEM MODAL
      ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <Package size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">Add Inventory Item</h2>
                <p className="text-xs text-gray-500">
                  Save new ingredient to MongoDB
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mozzarella Cheese"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold bg-white cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Unit
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="units, kg, pcs"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Threshold
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.threshold}
                    onChange={(e) =>
                      setFormData({ ...formData, threshold: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition flex items-center gap-2 shadow-lg shadow-red-200 disabled:opacity-50"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          EDIT INVENTORY ITEM MODAL
      ========================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Edit3 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">Edit Inventory Item</h2>
                <p className="text-xs text-gray-500">
                  Update details in MongoDB
                </p>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold bg-white cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Threshold
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.threshold}
                    onChange={(e) =>
                      setFormData({ ...formData, threshold: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition flex items-center gap-2 shadow-lg shadow-red-200 disabled:opacity-50"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          QUICK UPDATE STOCK MODAL
      ========================================================= */}
      {isStockModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setIsStockModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-black">Update Stock</h2>
            <p className="text-xs text-gray-500 mt-1">
              Adjust current quantity for{" "}
              <strong className="text-gray-900">{activeItem.name}</strong>
            </p>

            <form onSubmit={handleStockSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  New Stock ({activeItem.unit || "units"})
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  autoFocus
                  value={quickStockValue}
                  onChange={(e) => setQuickStockValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-lg font-black"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-200 disabled:opacity-50"
                >
                  {submitting ? "Updating..." : "Update Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          DELETE CONFIRMATION MODAL
      ========================================================= */}
      {isDeleteModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center animate-scale-up">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={26} />
            </div>

            <h2 className="text-xl font-black">Delete Item?</h2>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">{activeItem.name}</strong> from
              MongoDB? This cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteSubmit}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-200 disabled:opacity-50"
              >
                {submitting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}