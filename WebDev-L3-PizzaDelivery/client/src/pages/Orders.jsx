import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import OrderStatus from "../components/OrderStatus";
import {
  PackageCheck,
  Clock3,
  MapPin,
  Phone,
  ReceiptText,
  ChefHat,
  Truck,
  CheckCircle2,
  Star,
  ArrowRight,
  ShoppingBag,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { getUserOrders } from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getUserOrders();
      if (res.data?.success) {
        setOrders(res.data.orders || res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch user orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const latestOrder = orders.length > 0 ? orders[0] : null;
  const previousOrders = orders.length > 1 ? orders.slice(1) : [];

  const getStatusStep = (status) => {
    switch (status) {
      case "PLACED":
      case "CONFIRMED":
      case "ORDER_RECEIVED":
        return 1;
      case "PREPARING":
      case "IN_KITCHEN":
        return 2;
      case "OUT_FOR_DELIVERY":
      case "SENT_TO_DELIVERY":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return 1;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PLACED":
        return "ORDER PLACED";
      case "CONFIRMED":
        return "CONFIRMED";
      case "PREPARING":
      case "IN_KITCHEN":
        return "IN KITCHEN / PREPARING";
      case "OUT_FOR_DELIVERY":
      case "SENT_TO_DELIVERY":
        return "OUT FOR DELIVERY";
      case "DELIVERED":
        return "DELIVERED";
      case "CANCELLED":
        return "CANCELLED";
      default:
        return status || "PLACED";
    }
  };

  const getOrderItemsSummary = (order) => {
    if (Array.isArray(order.items) && order.items.length > 0) {
      return order.items.map((it) => `${it.name} × ${it.quantity}`).join(", ");
    }
    if (order.pizzaConfiguration?.base?.name) {
      return `${order.pizzaConfiguration.base.name} (Custom Pizza)`;
    }
    return "Pizza";
  };

  const getOrderAddress = (order) => {
    if (order.shippingAddress) {
      const { address, city, pincode } = order.shippingAddress;
      return [address, city, pincode].filter(Boolean).join(", ");
    }
    if (typeof order.deliveryAddress === "string") {
      return order.deliveryAddress;
    }
    return order.deliveryAddress?.fullAddress || "221B Baker Street, Mumbai, Maharashtra 400001";
  };

  const getOrderAmount = (order) => {
    return Number(order.total ?? order.totalAmount ?? 0);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-gray-50 pb-14">
        {/* Top Banner */}
        <div className="bg-gray-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
            <Truck size={15} className="text-orange-400" />
            <span>Hot, delicious pizzas prepared fresh to order!</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
                <ShoppingBag size={15} />
                My Orders
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 mt-4 tracking-tight">
                Track Your <span className="text-red-600">Order</span>
              </h1>

              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Follow your pizza from our kitchen to your doorstep in real time.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-red-600 transition"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh Status
            </button>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <Loader2 size={36} className="text-red-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-500">
                Fetching your orders from database...
              </p>
            </div>
          ) : !latestOrder ? (
            <div className="bg-white rounded-[28px] border border-gray-100 p-12 text-center shadow-sm mt-8">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={30} />
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                No Orders Placed Yet
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                You haven't placed any pizza orders yet. Customise your dream pizza now!
              </p>
              <Link
                to="/pizza-builder"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 bg-red-600 text-white rounded-xl font-black text-sm hover:bg-red-700 shadow-lg shadow-red-200 transition"
              >
                <span>Build a Pizza</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            /* Main Grid */
            <div className="grid lg:grid-cols-[minmax(0,1fr)_370px] gap-7 mt-8">
              {/* Current Order */}
              <section className="bg-white rounded-[28px] border border-gray-100 shadow-[0_15px_50px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Order Header */}
                <div className="p-5 sm:p-7 bg-gradient-to-r from-white to-orange-50/60 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                        <PackageCheck size={29} />
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                          Active Order
                        </p>

                        <h2 className="font-black text-xl sm:text-2xl text-gray-950 mt-1">
                          Order {latestOrder.orderId || `#PH${latestOrder._id?.slice(-4)}`}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                          {getOrderItemsSummary(latestOrder)} • ₹{getOrderAmount(latestOrder)}
                        </p>
                      </div>
                    </div>

                    <span className="w-fit px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-xs font-black tracking-wide">
                      {getStatusLabel(latestOrder.orderStatus)}
                    </span>
                  </div>
                </div>

                {/* Delivery Progress */}
                <div className="p-5 sm:p-7">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-black text-lg">Order Status</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {latestOrder.orderStatus === "DELIVERED"
                          ? "Your order has been delivered! Enjoy your meal."
                          : "Your pizza is being prepared fresh in our kitchen."}
                      </p>
                    </div>

                    <ChefHat size={24} className="text-red-600" />
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-5 sm:p-7">
                    <OrderStatus current={getStatusStep(latestOrder.orderStatus)} />
                  </div>

                  {/* ETA */}
                  <div className="grid sm:grid-cols-2 gap-4 mt-5">
                    <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5 flex gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white text-orange-600 flex items-center justify-center shrink-0">
                        <Clock3 size={21} />
                      </div>

                      <div>
                        <p className="font-black text-gray-900">
                          Estimated Delivery
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          20–25 minutes
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-green-50 border border-green-100 p-5 flex gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white text-green-600 flex items-center justify-center shrink-0">
                        <Truck size={21} />
                      </div>

                      <div>
                        <p className="font-black text-gray-900">
                          Delivery Partner
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PizzaHub Express Delivery
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mt-5 rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                        <MapPin size={20} />
                      </div>

                      <div>
                        <p className="font-black">Delivery Address</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {getOrderAddress(latestOrder)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Order Summary Sidebar */}
              <aside className="lg:sticky lg:top-24 h-fit">
                <div className="bg-gray-950 rounded-[28px] text-white overflow-hidden shadow-2xl">
                  <div className="p-5 sm:p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black tracking-widest text-orange-400">
                          ORDER ITEMS
                        </p>
                        <h2 className="text-xl font-black mt-1">Order Summary</h2>
                      </div>
                      <ReceiptText size={23} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4 max-h-[350px] overflow-y-auto">
                    {Array.isArray(latestOrder.items) && latestOrder.items.length > 0 ? (
                      latestOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400"}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover bg-white/10 shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{item.name}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                          <span className="font-bold text-sm text-orange-400">
                            ₹{(Number(item.price) || 0) * (Number(item.quantity) || 1)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center text-3xl shadow-lg">
                          🍕
                        </div>
                        <div>
                          <h3 className="font-black text-base">Custom Pizza</h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {latestOrder.pizzaConfiguration?.base?.name || "Classic Crust"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-white/10 pt-4 space-y-2">
                      {latestOrder.subtotal !== undefined && (
                        <SummaryRow label="Subtotal" value={`₹${latestOrder.subtotal}`} />
                      )}
                      {latestOrder.deliveryFee !== undefined && (
                        <SummaryRow label="Delivery Fee" value={latestOrder.deliveryFee === 0 ? "FREE" : `₹${latestOrder.deliveryFee}`} />
                      )}
                      {latestOrder.discount > 0 && (
                        <SummaryRow label="Discount" value={`- ₹${latestOrder.discount}`} />
                      )}
                    </div>

                    <div className="border-t border-white/10 mt-4 pt-4 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-400">TOTAL AMOUNT</p>
                        <p className="text-2xl font-black mt-1 text-white">
                          ₹{getOrderAmount(latestOrder)}
                        </p>
                      </div>

                      <span className="px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                        {latestOrder.paymentStatus || "PENDING"} ({latestOrder.paymentMethod || "COD"})
                      </span>
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 pb-6">
                    <button
                      type="button"
                      className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 transition font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <Phone size={17} />
                      Need Help?
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* Previous Orders History */}
          {previousOrders.length > 0 && (
            <section className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-5 sm:p-7 mt-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-red-600">
                    Order History
                  </p>
                  <h2 className="text-2xl font-black text-gray-950 mt-1">
                    Previous Orders
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {previousOrders.map((ord) => (
                  <div
                    key={ord._id}
                    className="rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition p-5 flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl">
                        🍕
                      </div>
                      <div>
                        <p className="font-black text-gray-950">
                          {ord.orderId || `#PH${ord._id?.slice(-4)}`}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {getOrderItemsSummary(ord)} • ₹{getOrderAmount(ord)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-600 text-xs font-black">
                        {getStatusLabel(ord.orderStatus)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold text-right text-gray-200">{value}</span>
    </div>
  );
}