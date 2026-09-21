import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  ChefHat,
  Search,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  Clock3,
  Loader2,
  RefreshCw,
  AlertCircle,
  Package,
} from "lucide-react";
import { getAdminOrders, updateAdminOrderStatus } from "../../services/api";

const STATUS_OPTIONS = [
  "Order Placed",
  "Confirmed",
  "In Kitchen",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch real orders from MongoDB
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminOrders();
      if (res.data && res.data.success) {
        setOrders(res.data.data || res.data.orders || []);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load orders from database."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Status in MongoDB
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await updateAdminOrderStatus(id, newStatus);
      if (res.data?.success) {
        showNotification(`Order status updated to "${newStatus}".`);
        // Update state locally
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter orders
  const filtered = orders.filter((order) => {
    const term = `${order.id} ${order.customer} ${order.email} ${order.pizza}`.toLowerCase();
    const matchesSearch = term.includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter ||
      order.rawStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Dynamic status counts calculated from real DB data
  const newOrdersCount = orders.filter(
    (o) =>
      o.status === "Order Placed" ||
      o.status === "Confirmed" ||
      o.status === "Order Received" ||
      o.rawStatus === "PLACED" ||
      o.rawStatus === "CONFIRMED"
  ).length;
  const inKitchenCount = orders.filter(
    (o) =>
      o.status === "In Kitchen" ||
      o.status === "Preparing" ||
      o.rawStatus === "PREPARING"
  ).length;
  const outForDeliveryCount = orders.filter(
    (o) =>
      o.status === "Out for Delivery" ||
      o.status === "Sent to Delivery" ||
      o.rawStatus === "OUT_FOR_DELIVERY"
  ).length;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-7">
        {/* Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-800 animate-slide-up">
            <CheckCircle2 size={18} className="text-green-400 shrink-0" />
            <span className="text-sm font-semibold">{notification}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <p className="text-sm text-red-600 font-bold uppercase tracking-widest">
              Management
            </p>
            <h1 className="text-3xl md:text-4xl font-black mt-1">
              Orders
            </h1>
            <p className="text-gray-500 mt-2">
              Manage incoming customer orders and track kitchen & delivery status.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-gray-300 transition w-fit"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin text-red-600" : ""}
            />
            Refresh Orders
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-5">
          <OrderCount
            icon={<ShoppingBag />}
            label="New Orders"
            value={newOrdersCount}
            color="text-purple-600"
            bg="bg-purple-50"
          />
          <OrderCount
            icon={<ChefHat />}
            label="In Kitchen"
            value={inKitchenCount}
            color="text-orange-600"
            bg="bg-orange-50"
          />
          <OrderCount
            icon={<Truck />}
            label="Out for Delivery"
            value={outForDeliveryCount}
            color="text-blue-600"
            bg="bg-blue-50"
          />
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 flex-1 w-full">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, customer, email, or pizza..."
              className="bg-transparent outline-none w-full text-sm placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-gray-400 shrink-0 hidden sm:inline">
              Status:
            </span>
            {["All", ...STATUS_OPTIONS].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                  statusFilter === st
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl py-20 flex flex-col items-center justify-center gap-3 shadow-sm">
            <Loader2 size={36} className="text-red-600 animate-spin" />
            <p className="text-sm font-bold text-gray-500">
              Loading orders from database...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white border border-gray-100 rounded-2xl py-16 text-center text-red-600 px-4 shadow-sm">
            <AlertCircle size={32} className="mx-auto mb-2 text-red-500" />
            <p className="font-bold">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center px-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <Package size={28} />
            </div>
            <h3 className="font-black text-gray-800 text-lg">
              No Orders Found
            </h3>
            <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">
              {search || statusFilter !== "All"
                ? "No customer orders matched your filter."
                : "No customer orders have been placed yet in the database."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 hover:shadow-md transition shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                  {/* Order info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <ShoppingBag size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-black text-gray-900 text-base">
                          {order.id}
                        </h3>
                        <StatusBadge status={order.status} />
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            order.paymentStatus === "PAID"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          {order.paymentStatus || "PAID"}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-gray-800 mt-1 truncate">
                        {order.customer}
                      </p>

                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {order.email} • {order.time}
                      </p>
                    </div>
                  </div>

                  {/* Pizza */}
                  <div className="lg:w-56">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">
                      Pizza Item
                    </p>
                    <p className="font-bold text-gray-900 text-sm mt-1">
                      {order.pizza}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="lg:w-28">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">
                      Amount
                    </p>
                    <p className="text-xl font-black text-gray-900 mt-1">
                      ₹{order.amount}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="lg:w-52">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1.5">
                      Update Status
                    </p>

                    <div className="relative">
                      <select
                        disabled={updatingId === order._id}
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(order._id, e.target.value)
                        }
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-red-500 bg-white cursor-pointer disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {updatingId === order._id && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2
                            size={16}
                            className="animate-spin text-red-600"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function OrderCount({ icon, label, value, color, bg }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
      <div
        className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center`}
      >
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-black text-gray-900 mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "Order Placed": {
      className: "bg-purple-100 text-purple-700",
      icon: Clock3,
    },
    Confirmed: {
      className: "bg-blue-100 text-blue-700",
      icon: CheckCircle2,
    },
    "Order Received": {
      className: "bg-purple-100 text-purple-700",
      icon: Clock3,
    },
    "In Kitchen": {
      className: "bg-orange-100 text-orange-700",
      icon: ChefHat,
    },
    Preparing: {
      className: "bg-orange-100 text-orange-700",
      icon: ChefHat,
    },
    "Out for Delivery": {
      className: "bg-indigo-100 text-indigo-700",
      icon: Truck,
    },
    "Sent to Delivery": {
      className: "bg-blue-100 text-blue-700",
      icon: Truck,
    },
    Delivered: {
      className: "bg-green-100 text-green-700",
      icon: CheckCircle2,
    },
    Cancelled: {
      className: "bg-red-100 text-red-700",
      icon: XCircle,
    },
  };

  const config = styles[status] || {
    className: "bg-gray-100 text-gray-700",
    icon: Clock3,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide ${config.className}`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}