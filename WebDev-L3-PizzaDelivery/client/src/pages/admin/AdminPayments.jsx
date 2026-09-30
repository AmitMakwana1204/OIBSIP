import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock3,
  XCircle,
  Loader2,
  User,
  CalendarDays,
  IndianRupee,
  Receipt,
  ShieldCheck,
  ArrowUpRight,
  X,
  Hash,
  Mail,
  Phone,
  MapPin,
  Package,
  AlertTriangle,
} from "lucide-react";

import AdminLayout from "./AdminLayout";
import api from "../../services/api";

// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING:
      "bg-orange-50 text-orange-700 border-orange-200",
    PAID: "bg-green-50 text-green-700 border-green-200",
    FAILED:
      "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border ${
        styles[status] || styles.PENDING
      }`}
    >
      {status === "PENDING" && (
        <Clock3 size={12} />
      )}
      {status === "PAID" && (
        <CheckCircle2 size={12} />
      )}
      {status === "FAILED" && (
        <XCircle size={12} />
      )}
      {status}
    </span>
  );
};

// =====================================================
// METHOD BADGE
// =====================================================

const MethodBadge = ({ method }) => {
  const styles = {
    MANUAL:
      "bg-purple-50 text-purple-700 border-purple-200",
    COD: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border ${
        styles[method] || styles.COD
      }`}
    >
      {method === "MANUAL" ? (
        <CreditCard size={12} />
      ) : (
        <IndianRupee size={12} />
      )}
      {method === "MANUAL"
        ? "Manual"
        : "COD"}
    </span>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function AdminPayments() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] =
    useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [methodFilter, setMethodFilter] =
    useState("ALL");

  const [stats, setStats] = useState(null);
  const [selectedOrder, setSelectedOrder] =
    useState(null);
  const [showModal, setShowModal] =
    useState(false);
  const [confirmAction, setConfirmAction] =
    useState(null);

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/admin/orders");

      const fetchedOrders =
        data?.orders ||
        data?.data ||
        data?.results ||
        [];

      setOrders(
        Array.isArray(fetchedOrders)
          ? fetchedOrders
          : []
      );
    } catch (err) {
      console.error(
        "Payment orders fetch error:",
        err
      );
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load payment data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH STATS
  // =====================================================

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/payment/admin/stats");

      if (data?.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error(
        "Payment stats error:",
        err
      );
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  // =====================================================
  // UPDATE PAYMENT STATUS
  // =====================================================

  const updatePaymentStatus = async (
    order,
    paymentStatus
  ) => {
    try {
      setUpdatingId(order._id);
      setError("");

      await api.patch(`/payment/admin/${order._id}/status`, {
        paymentStatus,
      });

      await fetchOrders();
      await fetchStats();

      setShowModal(false);
      setSelectedOrder(null);
      setConfirmAction(null);
    } catch (err) {
      console.error(
        "Update payment status error:",
        err
      );
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update payment status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // COMPUTED STATS (from orders if stats API unavailable)
  // =====================================================

  const computedStats = useMemo(() => {
    if (stats) return stats;

    const totalPayments = orders.length;
    const pendingPayments = orders.filter(
      (o) => o.paymentStatus === "PENDING"
    ).length;
    const paidPayments = orders.filter(
      (o) => o.paymentStatus === "PAID"
    ).length;
    const failedPayments = orders.filter(
      (o) => o.paymentStatus === "FAILED"
    ).length;

    const totalPaidAmount = orders
      .filter(
        (o) => o.paymentStatus === "PAID"
      )
      .reduce(
        (sum, o) => sum + (o.amount || 0),
        0
      );

    const pendingAmount = orders
      .filter(
        (o) => o.paymentStatus === "PENDING"
      )
      .reduce(
        (sum, o) => sum + (o.amount || 0),
        0
      );

    const failedAmount = orders
      .filter(
        (o) => o.paymentStatus === "FAILED"
      )
      .reduce(
        (sum, o) => sum + (o.amount || 0),
        0
      );

    return {
      totalPayments,
      pendingPayments,
      paidPayments,
      failedPayments,
      totalPaidAmount,
      pendingAmount,
      failedAmount,
    };
  }, [orders, stats]);

  // =====================================================
  // FILTERED ORDERS
  // =====================================================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (
        statusFilter !== "ALL" &&
        order.paymentStatus !== statusFilter
      ) {
        return false;
      }

      // Method filter
      if (
        methodFilter !== "ALL" &&
        order.paymentMethod !== methodFilter
      ) {
        return false;
      }

      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const orderId = (
          order.id ||
          order.orderId ||
          order._id ||
          ""
        )
          .toString()
          .toLowerCase();
        const customer = (
          order.customer || ""
        ).toLowerCase();
        const phone = (
          order.phone || ""
        ).toLowerCase();
        const txnId = (
          order.manualPayment
            ?.transactionId || ""
        ).toLowerCase();
        const email = (
          order.email || ""
        ).toLowerCase();

        if (
          !orderId.includes(q) &&
          !customer.includes(q) &&
          !phone.includes(q) &&
          !txnId.includes(q) &&
          !email.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    orders,
    statusFilter,
    methodFilter,
    search,
  ]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(
        dateStr
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(
        dateStr
      ).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  // =====================================================
  // OPEN DETAIL MODAL
  // =====================================================

  const openDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    setConfirmAction(null);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <AdminLayout>
      {/* ============================================
          HEADER
      ============================================ */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
            Finance
          </p>
          <h1 className="text-3xl font-black mt-1">
            Payments
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage and verify payment records.
          </p>
        </div>

        <button
          onClick={() => {
            fetchOrders();
            fetchStats();
          }}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={
              loading ? "animate-spin" : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* ============================================
          KPI CARDS
      ============================================ */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
              <Receipt size={20} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total
            </p>
          </div>
          <p className="text-2xl font-black">
            {computedStats.totalPayments}
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock3 size={20} />
            </div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Pending
            </p>
          </div>
          <p className="text-2xl font-black text-orange-600">
            {computedStats.pendingPayments}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ₹
            {(
              computedStats.pendingAmount || 0
            ).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Paid */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-xs font-bold text-green-600 uppercase tracking-wider">
              Paid
            </p>
          </div>
          <p className="text-2xl font-black text-green-600">
            {computedStats.paidPayments}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ₹
            {(
              computedStats.totalPaidAmount || 0
            ).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Failed */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle size={20} />
            </div>
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Failed
            </p>
          </div>
          <p className="text-2xl font-black text-red-600">
            {computedStats.failedPayments}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ₹
            {(
              computedStats.failedAmount || 0
            ).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* ============================================
          FILTERS
      ============================================ */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by Order ID, customer, phone, transaction ID..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 text-sm"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 text-sm font-bold"
          >
            <option value="ALL">
              All Status
            </option>
            <option value="PENDING">
              Pending
            </option>
            <option value="PAID">Paid</option>
            <option value="FAILED">
              Failed
            </option>
          </select>

          {/* Method */}
          <select
            value={methodFilter}
            onChange={(e) =>
              setMethodFilter(e.target.value)
            }
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 text-sm font-bold"
          >
            <option value="ALL">
              All Methods
            </option>
            <option value="COD">COD</option>
            <option value="MANUAL">
              Manual
            </option>
          </select>
        </div>
      </div>

      {/* ============================================
          ERROR
      ============================================ */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-6 text-sm font-medium flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* ============================================
          LOADING
      ============================================ */}

      {loading && (
        <div className="flex justify-center py-20">
          <div className="text-center">
            <Loader2
              size={40}
              className="text-red-600 animate-spin mx-auto"
            />
            <p className="mt-4 text-sm font-bold text-gray-500">
              Loading payments...
            </p>
          </div>
        </div>
      )}

      {/* ============================================
          EMPTY STATE
      ============================================ */}

      {!loading &&
        filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <CreditCard
              size={48}
              className="text-gray-300 mx-auto mb-4"
            />
            <h3 className="text-lg font-bold text-gray-500">
              No payments found
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {search || statusFilter !== "ALL" || methodFilter !== "ALL"
                ? "Try adjusting your filters."
                : "Payments will appear here once orders are placed."}
            </p>
          </div>
        )}

      {/* ============================================
          TABLE (Desktop)
      ============================================ */}

      {!loading &&
        filteredOrders.length > 0 && (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-center px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-center px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Verified By
                      </th>
                      <th className="text-center px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredOrders.map(
                      (order) => (
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50/50 transition cursor-pointer"
                          onClick={() =>
                            openDetail(order)
                          }
                        >
                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-gray-900">
                              {order.id ||
                                order.orderId ||
                                `#PH${order._id
                                  ?.toString()
                                  .slice(-6)
                                  .toUpperCase()}`}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-gray-900">
                              {order.customer}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.phone ||
                                order.email ||
                                ""}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span className="text-sm font-black">
                              ₹
                              {(
                                order.amount || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <MethodBadge
                              method={
                                order.paymentMethod
                              }
                            />
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-gray-700 font-mono">
                              {order
                                .manualPayment
                                ?.transactionId ||
                                "—"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-gray-600">
                              {formatDate(
                                order.createdAt
                              )}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <StatusBadge
                              status={
                                order.paymentStatus
                              }
                            />
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs text-gray-500">
                              {order
                                .manualPayment
                                ?.verifiedBy ||
                                "—"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetail(
                                  order
                                );
                              }}
                              className="text-red-600 hover:text-red-700 font-bold text-xs inline-flex items-center gap-1"
                            >
                              View
                              <ArrowUpRight
                                size={12}
                              />
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition"
                  onClick={() =>
                    openDetail(order)
                  }
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-black text-gray-900">
                      {order.id ||
                        order.orderId ||
                        `#PH${order._id
                          ?.toString()
                          .slice(-6)
                          .toUpperCase()}`}
                    </span>
                    <StatusBadge
                      status={
                        order.paymentStatus
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User
                        size={14}
                        className="text-gray-400"
                      />
                      <span className="text-sm text-gray-700">
                        {order.customer}
                      </span>
                    </div>
                    <span className="text-sm font-black">
                      ₹
                      {(
                        order.amount || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <MethodBadge
                      method={
                        order.paymentMethod
                      }
                    />
                    <span className="text-xs text-gray-500">
                      {formatDate(
                        order.createdAt
                      )}
                    </span>
                  </div>

                  {order.manualPayment
                    ?.transactionId && (
                    <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2">
                      <Hash
                        size={12}
                        className="text-gray-400"
                      />
                      <span className="text-xs font-mono text-gray-600">
                        {
                          order.manualPayment
                            .transactionId
                        }
                      </span>
                    </div>
                  )}

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetail(order);
                      }}
                      className="text-red-600 font-bold text-xs inline-flex items-center gap-1"
                    >
                      View Details
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      {/* ============================================
          DETAIL MODAL
      ============================================ */}

      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowModal(false);
              setConfirmAction(null);
            }}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => {
                setShowModal(false);
                setConfirmAction(null);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition z-10"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-5 rounded-t-3xl">
              <h2 className="text-xl font-black">
                Payment Details
              </h2>
              <p className="text-white/70 text-sm mt-1">
                {selectedOrder.id ||
                  selectedOrder.orderId ||
                  `#PH${selectedOrder._id
                    ?.toString()
                    .slice(-6)
                    .toUpperCase()}`}
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Order Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">
                  Order Information
                </h3>

                <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Package size={14} />
                      Order ID
                    </span>
                    <span className="font-bold">
                      {selectedOrder.id ||
                        selectedOrder.orderId ||
                        `#PH${selectedOrder._id
                          ?.toString()
                          .slice(-6)
                          .toUpperCase()}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <User size={14} />
                      Customer
                    </span>
                    <span className="font-bold">
                      {selectedOrder.customer}
                    </span>
                  </div>

                  {selectedOrder.email && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Mail size={14} />
                        Email
                      </span>
                      <span className="font-medium text-gray-700">
                        {selectedOrder.email}
                      </span>
                    </div>
                  )}

                  {selectedOrder.phone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Phone size={14} />
                        Phone
                      </span>
                      <span className="font-medium text-gray-700">
                        {selectedOrder.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">
                  Payment Information
                </h3>

                <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <IndianRupee size={14} />
                      Amount
                    </span>
                    <span className="text-lg font-black text-red-600">
                      ₹
                      {(
                        selectedOrder.amount || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <CreditCard size={14} />
                      Method
                    </span>
                    <MethodBadge
                      method={
                        selectedOrder.paymentMethod
                      }
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Clock3 size={14} />
                      Status
                    </span>
                    <StatusBadge
                      status={
                        selectedOrder.paymentStatus
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Transaction Info (Manual) */}
              {selectedOrder.paymentMethod ===
                "MANUAL" && (
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">
                    Transaction Information
                  </h3>

                  <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Hash size={14} />
                        Transaction ID
                      </span>
                      <span className="font-bold font-mono">
                        {selectedOrder
                          .manualPayment
                          ?.transactionId ||
                          "Not submitted"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <CalendarDays
                          size={14}
                        />
                        Payment Date
                      </span>
                      <span className="font-medium">
                        {formatDate(
                          selectedOrder
                            .manualPayment
                            ?.paymentDate
                        )}
                      </span>
                    </div>

                    {selectedOrder.manualPayment
                      ?.note && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Note
                        </span>
                        <span className="font-medium text-right max-w-[200px]">
                          {
                            selectedOrder
                              .manualPayment
                              .note
                          }
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Submitted At
                      </span>
                      <span className="font-medium">
                        {formatDateTime(
                          selectedOrder
                            .manualPayment
                            ?.submittedAt
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Info */}
              {selectedOrder.manualPayment
                ?.verifiedAt && (
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">
                    Verification
                  </h3>

                  <div className="bg-green-50 rounded-2xl p-4 space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <ShieldCheck size={14} />
                        Verified At
                      </span>
                      <span className="font-medium">
                        {formatDateTime(
                          selectedOrder
                            .manualPayment
                            .verifiedAt
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <User size={14} />
                        Verified By
                      </span>
                      <span className="font-bold">
                        {selectedOrder
                          .manualPayment
                          .verifiedBy || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================
                  ACTIONS
              ============================================ */}

              {!confirmAction && (
                <div className="space-y-3 pt-2">
                  {selectedOrder.paymentStatus !==
                    "PAID" && (
                    <button
                      onClick={() =>
                        setConfirmAction("PAID")
                      }
                      disabled={
                        updatingId ===
                        selectedOrder._id
                      }
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      <CheckCircle2 size={18} />
                      Mark as Paid
                    </button>
                  )}

                  {selectedOrder.paymentStatus !==
                    "FAILED" && (
                    <button
                      onClick={() =>
                        setConfirmAction(
                          "FAILED"
                        )
                      }
                      disabled={
                        updatingId ===
                        selectedOrder._id
                      }
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      <XCircle size={18} />
                      Mark as Failed
                    </button>
                  )}

                  {selectedOrder.paymentStatus !==
                    "PENDING" && (
                    <button
                      onClick={() =>
                        setConfirmAction(
                          "PENDING"
                        )
                      }
                      disabled={
                        updatingId ===
                        selectedOrder._id
                      }
                      className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      <Clock3 size={18} />
                      Keep Pending
                    </button>
                  )}
                </div>
              )}

              {/* Confirmation */}
              {confirmAction && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle
                      size={18}
                      className="text-yellow-600"
                    />
                    <p className="font-bold text-sm text-gray-900">
                      Confirm Action
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to mark
                    this payment as{" "}
                    <strong>
                      {confirmAction}
                    </strong>
                    ?
                    {confirmAction === "PAID" &&
                      " The order will be auto-confirmed."}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        updatePaymentStatus(
                          selectedOrder,
                          confirmAction
                        )
                      }
                      disabled={
                        updatingId ===
                        selectedOrder._id
                      }
                      className={`flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition text-white ${
                        confirmAction === "PAID"
                          ? "bg-green-600 hover:bg-green-700"
                          : confirmAction ===
                            "FAILED"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-orange-500 hover:bg-orange-600"
                      } disabled:opacity-50`}
                    >
                      {updatingId ===
                      selectedOrder._id ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                          Updating...
                        </>
                      ) : (
                        <>Confirm</>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        setConfirmAction(null)
                      }
                      disabled={
                        updatingId ===
                        selectedOrder._id
                      }
                      className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
