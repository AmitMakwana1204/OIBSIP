import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import {
  IndianRupee,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Eye,
  Clock3,
  CheckCircle2,
  ChefHat,
  Truck,
  XCircle,
  Plus,
  RefreshCw,
  Package,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getAdminDashboardStats } from "../../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminDashboardStats();
      if (res.data && res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard statistics from MongoDB."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalRevenue = data?.totalRevenue || 0;
  const totalOrders = data?.totalOrders || 0;
  const totalCustomers = data?.totalCustomers || 0;
  const lowStockItems = data?.lowStockItems || 0;
  const recentOrders = data?.recentOrders || [];
  const salesOverview = data?.salesOverview || [];
  const lowStockAlerts = data?.lowStockAlerts || [];
  const statusCounts = data?.statusCounts || {
    DELIVERED: 0,
    IN_KITCHEN: 0,
    SENT_TO_DELIVERY: 0,
    ORDER_RECEIVED: 0,
    CANCELLED: 0,
  };

  const maxRevenue = Math.max(
    ...salesOverview.map((item) => item.revenue),
    1
  );

  const hasSalesData = salesOverview.some(
    (item) => item.revenue > 0 || item.orders > 0
  );

  // Status mapping for distribution
  const statusDistribution = [
    {
      label: "Delivered",
      count: statusCounts.DELIVERED || 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "In Kitchen",
      count: statusCounts.IN_KITCHEN || 0,
      icon: ChefHat,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Sent to Delivery",
      count: statusCounts.SENT_TO_DELIVERY || 0,
      icon: Truck,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Order Received",
      count: statusCounts.ORDER_RECEIVED || 0,
      icon: Clock3,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Cancelled",
      count: statusCounts.CANCELLED || 0,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto space-y-7">
        {/* =================================================
            HEADER
        ================================================= */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Live Overview
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Monitor your pizza business performance, inventory alerts, and real-time operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:border-gray-300 transition shadow-sm"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin text-red-600" : ""}
              />
              Refresh Live
            </button>

            <button
              onClick={() => navigate("/admin/inventory")}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200 transition"
            >
              <Plus size={17} />
              Manage Inventory
            </button>
          </div>
        </div>

        {loading && !data ? (
          <div className="py-28 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-gray-100">
            <Loader2 size={40} className="text-red-600 animate-spin" />
            <p className="text-sm font-bold text-gray-500">
              Fetching real-time statistics from MongoDB...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center text-red-700">
            <AlertCircle size={32} className="mx-auto mb-2 text-red-600" />
            <p className="font-bold">{error}</p>
            <button
              onClick={fetchStats}
              className="mt-4 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* =================================================
                KPI CARDS (100% DATABASE CALCULATED)
            ================================================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              <KpiCard
                icon={IndianRupee}
                title="Total Revenue"
                value={`₹${totalRevenue.toLocaleString("en-IN")}`}
                subtitle="Calculated from confirmed orders"
              />
              <KpiCard
                icon={ShoppingBag}
                title="Total Orders"
                value={totalOrders.toString()}
                subtitle="All-time recorded orders"
              />
              <KpiCard
                icon={Users}
                title="Total Customers"
                value={totalCustomers.toString()}
                subtitle="Registered customer accounts"
              />
              <KpiCard
                icon={AlertTriangle}
                title="Low Stock Items"
                value={lowStockItems.toString()}
                subtitle="Items below threshold"
                isAlert={lowStockItems > 0}
              />
            </div>

            {/* =================================================
                ANALYTICS SECTION
            ================================================= */}
            <div className="grid xl:grid-cols-[1fr_380px] gap-6">
              {/* SALES CHART */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black">
                        Revenue Analytics
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Daily revenue and order volume for the current week.
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total Revenue</p>
                      <p className="text-2xl font-black text-gray-900">
                        ₹{totalRevenue.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-5 mt-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      Revenue (₹)
                    </div>
                  </div>
                </div>

                {/* Chart or Empty state */}
                {!hasSalesData ? (
                  <div className="h-[280px] mt-6 flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-6 text-center border border-dashed border-gray-200">
                    <ShoppingBag size={32} className="text-gray-400 mb-2" />
                    <p className="text-gray-600 font-bold text-base">
                      No sales data available.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Sales figures will dynamically appear here when customer orders are placed.
                    </p>
                  </div>
                ) : (
                  <div className="h-[280px] mt-8 flex items-end gap-3 sm:gap-5">
                    {salesOverview.map((item) => {
                      const height =
                        maxRevenue > 0
                          ? Math.max((item.revenue / maxRevenue) * 100, item.revenue > 0 ? 8 : 4)
                          : 4;

                      return (
                        <div
                          key={item.day}
                          className="flex-1 h-full flex flex-col justify-end"
                        >
                          <div className="relative h-full flex items-end">
                            <div
                              className="w-full bg-red-500 hover:bg-red-600 rounded-t-xl transition-all duration-300 group relative cursor-pointer"
                              style={{ height: `${height}%` }}
                            >
                              <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap transition pointer-events-none z-10 shadow-lg">
                                <span className="font-bold">
                                  ₹{item.revenue.toLocaleString("en-IN")}
                                </span>
                                <br />
                                <span>{item.orders} orders</span>
                              </div>
                            </div>
                          </div>

                          <span className="text-xs font-bold text-gray-400 text-center mt-3">
                            {item.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ORDER STATUS DISTRIBUTION */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black">
                        Order Status
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Current order lifecycle distribution
                      </p>
                    </div>
                    <ShoppingBag size={20} className="text-gray-300" />
                  </div>

                  {/* Orders Total Summary */}
                  <div className="flex justify-center my-6">
                    <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-red-50 to-orange-50 border-4 border-red-500/20 flex flex-col items-center justify-center text-center shadow-inner">
                      <span className="text-3xl font-black text-gray-900">
                        {totalOrders}
                      </span>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Total Orders
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  {statusDistribution.map((item) => {
                    const Icon = item.icon;
                    const percentage =
                      totalOrders > 0
                        ? Math.round((item.count / totalOrders) * 100)
                        : 0;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}
                          >
                            <Icon size={16} />
                          </div>

                          <div>
                            <p className="text-xs font-bold text-gray-900">
                              {item.label}
                            </p>
                            <p className="text-[10px] text-gray-400 font-semibold">
                              {percentage}% of orders
                            </p>
                          </div>
                        </div>

                        <span className="font-black text-sm text-gray-800">
                          {item.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* =================================================
                INVENTORY ALERTS & RECENT ORDERS
            ================================================= */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* INVENTORY ALERTS */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="p-6 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black">
                          Inventory Alerts
                        </h2>
                        <p className="text-sm text-gray-500">
                          Real-time low stock ingredients
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/admin/inventory"
                      className="text-red-600 text-xs font-bold uppercase tracking-wider hover:text-red-700"
                    >
                      Manage All →
                    </Link>
                  </div>

                  {lowStockAlerts.length === 0 ? (
                    <div className="p-10 text-center text-gray-400 text-sm">
                      <CheckCircle2
                        size={28}
                        className="text-green-500 mx-auto mb-2"
                      />
                      <p className="font-bold text-gray-700">
                        All ingredients sufficiently stocked.
                      </p>
                      <p className="text-xs mt-1 text-gray-400">
                        No items are currently below their threshold.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {lowStockAlerts.map((item) => (
                        <div
                          key={item._id || item.name}
                          className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                              <Package size={18} className="text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {item.category} • Threshold: {item.threshold}{" "}
                                {item.unit || "units"}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-600">
                              {item.stock} {item.unit || "units"} left
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                  <Link
                    to="/admin/inventory"
                    className="text-xs font-bold text-red-600 hover:text-red-700"
                  >
                    View & Update Inventory Stock →
                  </Link>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-black mb-1">
                    Quick Operations
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Direct access to core admin controls
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => navigate("/admin/inventory")}
                      className="p-5 rounded-2xl bg-gray-50 hover:bg-red-50 hover:border-red-200 border border-gray-100 text-left transition group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition shadow-sm">
                        <Package size={20} />
                      </div>
                      <h3 className="font-black text-gray-900 mt-4 text-sm">
                        Inventory
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Add & update ingredients
                      </p>
                    </button>

                    <button
                      onClick={() => navigate("/admin/orders")}
                      className="p-5 rounded-2xl bg-gray-50 hover:bg-red-50 hover:border-red-200 border border-gray-100 text-left transition group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition shadow-sm">
                        <ShoppingBag size={20} />
                      </div>
                      <h3 className="font-black text-gray-900 mt-4 text-sm">
                        Customer Orders
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Track & update status
                      </p>
                    </button>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-800 text-xs font-semibold flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span>
                    MongoDB connected. All admin actions will persist in the database.
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                RECENT ORDERS TABLE (DATABASE DRIVEN)
            ================================================= */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-black">
                    Recent Customer Orders
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Latest orders registered in MongoDB
                  </p>
                </div>

                <Link
                  to="/admin/orders"
                  className="inline-flex items-center gap-2 text-red-600 font-bold text-sm hover:text-red-700"
                >
                  View All Orders
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-sm">
                  <ShoppingBag size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="font-bold text-gray-700">No orders recorded yet.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    When customers place orders, they will appear here in real time.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-400">
                      <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Pizza Details</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Time</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {recentOrders.map((order) => (
                        <tr
                          key={order._id || order.id}
                          className="hover:bg-gray-50/70 transition"
                        >
                          <td className="px-6 py-5 font-black text-gray-900">
                            {order.id}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-black text-xs uppercase">
                                {order.customer
                                  ? order.customer.slice(0, 2)
                                  : "CU"}
                              </div>
                              <span className="font-semibold text-gray-900">
                                {order.customer}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-gray-600 font-medium">
                            {order.pizza}
                          </td>

                          <td className="px-6 py-5 font-black text-gray-900">
                            {order.amount}
                          </td>

                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-1.5 text-gray-400 text-xs">
                              <Clock3 size={14} />
                              {order.time}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                              {order.status}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-right">
                            <Link
                              to="/admin/orders"
                              className="inline-flex w-8 h-8 rounded-lg border border-gray-200 items-center justify-center hover:bg-gray-100 transition text-gray-600"
                            >
                              <Eye size={15} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function KpiCard({ icon: Icon, title, value, subtitle, isAlert }) {
  return (
    <div
      className={`bg-white border ${
        isAlert ? "border-orange-200 ring-2 ring-orange-100" : "border-gray-100"
      } rounded-2xl p-6 shadow-sm hover:shadow-md transition`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-12 h-12 rounded-2xl ${
            isAlert ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
          } flex items-center justify-center`}
        >
          <Icon size={22} />
        </div>
      </div>

      <p className="text-sm font-semibold text-gray-400 mt-4">{title}</p>
      <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">
        {value}
      </h2>
      <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
}