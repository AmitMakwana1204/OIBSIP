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
  ArrowRight,
  ShoppingBag,
  Loader2,
  RefreshCw,
  XCircle,
  Copy,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  getUserOrders,
  cancelUserOrder,
} from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancellingId, setCancellingId] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(null);
  const [reorderingId, setReorderingId] = useState(null);

  // =========================================================
  // FETCH ORDERS
  // =========================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await getUserOrders();

      if (res.data?.success) {
        setOrders(
          res.data.orders ||
            res.data.data ||
            []
        );
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(
        "Fetch user orders error:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================================================
  // ORDER GROUPS
  // =========================================================

  const latestOrder =
    orders.length > 0 ? orders[0] : null;

  const previousOrders =
    orders.length > 1
      ? orders.slice(1)
      : [];

  // =========================================================
  // STATUS STEP
  // =========================================================

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

  // =========================================================
  // STATUS LABEL
  // =========================================================

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

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-600";

      case "OUT_FOR_DELIVERY":
      case "SENT_TO_DELIVERY":
        return "bg-blue-100 text-blue-700";

      case "PREPARING":
      case "IN_KITCHEN":
        return "bg-orange-100 text-orange-700";

      case "CONFIRMED":
      case "PLACED":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // =========================================================
  // ORDER ITEMS SUMMARY
  // =========================================================

  const getOrderItemsSummary = (order) => {
    if (
      Array.isArray(order.items) &&
      order.items.length > 0
    ) {
      return order.items
        .map(
          (item) =>
            `${item.name} × ${item.quantity}`
        )
        .join(", ");
    }

    if (
      order.pizzaConfiguration?.base?.name
    ) {
      return `${order.pizzaConfiguration.base.name} (Custom Pizza)`;
    }

    return "Pizza";
  };

  // =========================================================
  // ADDRESS
  // =========================================================

  const getOrderAddress = (order) => {
    if (order.shippingAddress) {
      const {
        address,
        city,
        pincode,
      } = order.shippingAddress;

      return [
        address,
        city,
        pincode,
      ]
        .filter(Boolean)
        .join(", ");
    }

    if (
      typeof order.deliveryAddress ===
      "string"
    ) {
      return order.deliveryAddress;
    }

    return (
      order.deliveryAddress?.fullAddress ||
      "Address not available"
    );
  };

  // =========================================================
  // ORDER AMOUNT
  // =========================================================

  const getOrderAmount = (order) => {
    return Number(
      order.total ??
        order.totalAmount ??
        0
    );
  };

  // =========================================================
  // ORDER DATE
  // =========================================================

  const getOrderDate = (order) => {
    if (!order?.createdAt) {
      return "Date not available";
    }

    return new Date(
      order.createdAt
    ).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // CAN CANCEL
  // =========================================================

  const canCancelOrder = (order) => {
    return (
      order &&
      ["PLACED", "CONFIRMED"].includes(
        order.orderStatus
      )
    );
  };

  // =========================================================
  // CANCEL ORDER
  // =========================================================

  const handleCancelOrder = async (order) => {
  if (!order) return;

  // Display ID only
  const displayOrderId =
    order.orderId || `#PH${order._id?.slice(-4)}`;

  // MongoDB ID for API
  const mongoOrderId = order._id;

  if (!mongoOrderId) {
    alert("Order ID is missing. Unable to cancel this order.");
    return;
  }

  if (!canCancelOrder(order)) {
    alert("This order can no longer be cancelled.");
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to cancel order ${displayOrderId}?`
  );

  if (!confirmed) return;

  try {
    setCancellingId(mongoOrderId);

    console.log("====================================");
    console.log("CANCEL ORDER REQUEST");
    console.log({
      displayOrderId,
      mongoOrderId,
      user: order.user,
      status: order.orderStatus,
    });
    console.log("====================================");

    // IMPORTANT:
    // Send MongoDB _id, NOT "#PH623322"
    const response = await cancelUserOrder(order._id);

    console.log("CANCEL ORDER RESPONSE:", response.data);

    if (!response?.data?.success) {
      throw new Error(
        response?.data?.message ||
          "Failed to cancel order."
      );
    }

    const updatedOrder =
      response.data.order ||
      response.data.data;

    // Update order immediately in UI
    setOrders((currentOrders) =>
      currentOrders.map((item) =>
        item._id === order._id
          ? {
              ...item,
              ...(updatedOrder || {}),
              orderStatus:
                updatedOrder?.orderStatus ||
                "CANCELLED",
            }
          : item
      )
    );

    alert(
      response.data.message ||
        "Order cancelled successfully."
    );

  } catch (error) {
    console.error(
      "===================================="
    );
    console.error("CANCEL ORDER ERROR");
    console.error("Status:", error?.response?.status);
    console.error(
      "Response:",
      error?.response?.data
    );
    console.error(
      "Message:",
      error?.message
    );
    console.error(
      "===================================="
    );

    alert(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to cancel order. Please try again."
    );

  } finally {
    setCancellingId(null);
 }
};

  // =========================================================
  // COPY ORDER ID
  // =========================================================

  const handleCopyOrderId = async (
    orderId
  ) => {
    if (!orderId) return;

    try {
      await navigator.clipboard.writeText(
        orderId
      );

      setCopiedOrderId(orderId);

      setTimeout(() => {
        setCopiedOrderId(null);
      }, 1500);
    } catch (error) {
      console.error(
        "Copy order ID error:",
        error
      );
    }
  };

  // =========================================================
  // TOGGLE DETAILS
  // =========================================================

  const toggleDetails = (orderId) => {
    setExpandedOrder((current) =>
      current === orderId
        ? null
        : orderId
    );
  };

  // =========================================================
  // REORDER
  // =========================================================

  const handleReorder = async (order) => {
    if (!order) return;

    if (
      !Array.isArray(order.items) ||
      order.items.length === 0
    ) {
      alert(
        "Items from this order are not available for reorder."
      );
      return;
    }

    try {
      setReorderingId(order._id);

      const CART_KEY = "pizzaCart";

      let currentCart = [];

      try {
        const savedCart =
          localStorage.getItem(
            CART_KEY
          );

        if (savedCart) {
          const parsed =
            JSON.parse(savedCart);

          if (Array.isArray(parsed)) {
            currentCart = parsed;
          }
        }
      } catch (error) {
        console.error(
          "Cart read error:",
          error
        );
      }

      order.items.forEach((item) => {
        const productId = String(
          item.product ||
            item._id ||
            item.id ||
            ""
        );

        if (!productId) return;

        const existingIndex =
          currentCart.findIndex(
            (cartItem) =>
              String(
                cartItem.id ||
                  cartItem._id ||
                  cartItem.product ||
                  ""
              ) === productId
          );

        if (existingIndex !== -1) {
          currentCart[
            existingIndex
          ] = {
            ...currentCart[
              existingIndex
            ],
            quantity:
              Number(
                currentCart[
                  existingIndex
                ].quantity
              ) +
              Number(
                item.quantity || 1
              ),
          };
        } else {
          currentCart.push({
            id: productId,
            _id: productId,
            name:
              item.name || "Pizza",
            price:
              Number(item.price) || 0,
            quantity:
              Number(item.quantity) || 1,
            image:
              item.image || "",
            category:
              item.category || "Pizza",
          });
        }
      });

      localStorage.setItem(
        CART_KEY,
        JSON.stringify(currentCart)
      );

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      window.location.href = "/cart";
    } catch (error) {
      console.error(
        "Reorder error:",
        error
      );

      alert(
        "Unable to reorder this item."
      );
    } finally {
      setReorderingId(null);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-[75vh] bg-gradient-to-b from-orange-50/60 via-white to-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2
              size={40}
              className="text-red-600 animate-spin mx-auto mb-3"
            />

            <p className="text-sm font-bold text-gray-500">
              Fetching your orders from database...
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-gray-50 pb-14">
        {/* =====================================================
            TOP BANNER
        ===================================================== */}

        <div className="bg-gray-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
            <Truck
              size={15}
              className="text-orange-400"
            />

            <span>
              Hot, delicious pizzas prepared fresh to order!
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
                <ShoppingBag size={15} />
                My Orders
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 mt-4 tracking-tight">
                Track Your{" "}
                <span className="text-red-600">
                  Order
                </span>
              </h1>

              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Follow your pizza from our kitchen to your doorstep.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-red-600 transition disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh Status
            </button>
          </div>

          {/* =====================================================
              EMPTY
          ===================================================== */}

          {!latestOrder ? (
            <div className="bg-white rounded-[28px] border border-gray-100 p-12 text-center shadow-sm mt-8">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={30} />
              </div>

              <h2 className="text-2xl font-black text-gray-900">
                No Orders Placed Yet
              </h2>

              <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                You haven't placed any pizza orders yet.
                Customise your dream pizza now!
              </p>

              <Link
                to="/pizza-builder"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 bg-red-600 text-white rounded-xl font-black text-sm hover:bg-red-700 shadow-lg shadow-red-200 transition"
              >
                <span>
                  Build a Pizza
                </span>

                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[minmax(0,1fr)_370px] gap-7 mt-8">
              {/* =================================================
                  CURRENT ORDER
              ================================================= */}

              <section className="bg-white rounded-[28px] border border-gray-100 shadow-[0_15px_50px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* HEADER */}

                <div className="p-5 sm:p-7 bg-gradient-to-r from-white to-orange-50/60 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                        <PackageCheck size={29} />
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                          Latest Order
                        </p>

                        <div className="flex items-center gap-2">
                          <h2 className="font-black text-xl sm:text-2xl text-gray-950 mt-1">
                            Order{" "}
                            {latestOrder.orderId ||
                              `#PH${latestOrder._id?.slice(
                                -4
                              )}`}
                          </h2>

                          <button
                            type="button"
                            onClick={() =>
                              handleCopyOrderId(
                                latestOrder.orderId ||
                                  latestOrder._id
                              )
                            }
                            className="w-8 h-8 mt-1 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition"
                            title="Copy Order ID"
                          >
                            {copiedOrderId ===
                            (latestOrder.orderId ||
                              latestOrder._id) ? (
                              <CheckCircle2
                                size={15}
                              />
                            ) : (
                              <Copy
                                size={15}
                              />
                            )}
                          </button>
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          {getOrderItemsSummary(
                            latestOrder
                          )}{" "}
                          • ₹
                          {getOrderAmount(
                            latestOrder
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`w-fit px-4 py-2 rounded-full text-xs font-black tracking-wide ${getStatusStyle(
                          latestOrder.orderStatus
                        )}`}
                      >
                        {getStatusLabel(
                          latestOrder.orderStatus
                        )}
                      </span>

                      {canCancelOrder(
                        latestOrder
                      ) && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCancelOrder(
                              latestOrder
                            )
                          }
                          disabled={
                            cancellingId ===
                            latestOrder._id
                          }
                          className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-100 text-xs font-black hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                        >
                          {cancellingId ===
                          latestOrder._id ? (
                            <>
                              <Loader2
                                size={14}
                                className="inline mr-1 animate-spin"
                              />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <XCircle
                                size={14}
                                className="inline mr-1"
                              />
                              Cancel Order
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* =================================================
                    CANCELLED
                ================================================= */}

                {latestOrder.orderStatus ===
                "CANCELLED" ? (
                  <div className="p-5 sm:p-7">
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
                      <XCircle
                        size={46}
                        className="text-red-500 mx-auto"
                      />

                      <h3 className="text-lg font-black text-red-600 mt-3">
                        Order Cancelled
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        This order has been cancelled.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleReorder(
                            latestOrder
                          )
                        }
                        disabled={
                          reorderingId ===
                          latestOrder._id
                        }
                        className="mt-5 inline-flex items-center gap-2 bg-gray-950 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition disabled:opacity-50"
                      >
                        {reorderingId ===
                        latestOrder._id ? (
                          <>
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                            Adding...
                          </>
                        ) : (
                          <>
                            <RotateCcw
                              size={16}
                            />
                            Order Again
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* =================================================
                      ACTIVE ORDER
                  ================================================= */

                  <div className="p-5 sm:p-7">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="font-black text-lg">
                          Order Status
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {latestOrder.orderStatus ===
                          "DELIVERED"
                            ? "Your order has been delivered! Enjoy your meal."
                            : "Your pizza is being prepared fresh in our kitchen."}
                        </p>
                      </div>

                      <ChefHat
                        size={24}
                        className="text-red-600"
                      />
                    </div>

                    {/* PROGRESS */}

                    <div className="bg-gray-50 rounded-2xl p-5 sm:p-7">
                      <OrderStatus
                        current={getStatusStep(
                          latestOrder.orderStatus
                        )}
                      />
                    </div>

                    {/* ETA */}

                    {latestOrder.orderStatus !==
                      "DELIVERED" && (
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
                    )}

                    {/* ADDRESS */}

                    <div className="mt-5 rounded-2xl border border-gray-100 p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                          <MapPin size={20} />
                        </div>

                        <div>
                          <p className="font-black">
                            Delivery Address
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {getOrderAddress(
                              latestOrder
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ORDER INFO */}

                    <div className="mt-5 grid sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-gray-50 p-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Order Date
                        </p>

                        <p className="font-bold text-gray-900 mt-1">
                          {getOrderDate(
                            latestOrder
                          )}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Payment
                        </p>

                        <p className="font-bold text-gray-900 mt-1">
                          {latestOrder.paymentMethod ||
                            "COD"}
                        </p>

                        <p className={`text-xs font-bold mt-1 ${
                          latestOrder.paymentStatus === "PAID"
                            ? "text-green-600"
                            : latestOrder.paymentStatus === "FAILED"
                            ? "text-red-600"
                            : "text-orange-600"
                        }`}>
                          Status:{" "}
                          {latestOrder.paymentStatus ||
                            "PENDING"}
                        </p>

                        {latestOrder.manualPayment?.transactionId && (
                          <p className="text-xs text-gray-500 mt-1 font-mono">
                            Txn: {latestOrder.manualPayment.transactionId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* =================================================
                  ORDER SUMMARY SIDEBAR
              ================================================= */}

              <aside className="lg:sticky lg:top-24 h-fit">
                <div className="bg-gray-950 rounded-[28px] text-white overflow-hidden shadow-2xl">
                  <div className="p-5 sm:p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black tracking-widest text-orange-400">
                          ORDER ITEMS
                        </p>

                        <h2 className="text-xl font-black mt-1">
                          Order Summary
                        </h2>
                      </div>

                      <ReceiptText
                        size={23}
                        className="text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4 max-h-[350px] overflow-y-auto">
                    {Array.isArray(
                      latestOrder.items
                    ) &&
                    latestOrder.items.length >
                      0 ? (
                      latestOrder.items.map(
                        (item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0"
                          >
                            <img
                              src={
                                item.image ||
                                "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400"
                              }
                              alt={
                                item.name ||
                                "Pizza"
                              }
                              className="w-12 h-12 rounded-xl object-cover bg-white/10 shrink-0"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400";
                              }}
                            />

                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate">
                                {item.name ||
                                  "Pizza"}
                              </p>

                              <p className="text-xs text-gray-400">
                                Qty:{" "}
                                {item.quantity ||
                                  1}{" "}
                                × ₹
                                {item.price ||
                                  0}
                              </p>
                            </div>

                            <span className="font-bold text-sm text-orange-400">
                              ₹
                              {(Number(
                                item.price
                              ) || 0) *
                                (Number(
                                  item.quantity
                                ) || 1)}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center text-3xl shadow-lg">
                          🍕
                        </div>

                        <div>
                          <h3 className="font-black text-base">
                            Custom Pizza
                          </h3>

                          <p className="text-xs text-gray-400 mt-1">
                            {latestOrder
                              .pizzaConfiguration
                              ?.base?.name ||
                              "Classic Crust"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* PRICE */}

                    <div className="border-t border-white/10 pt-4 space-y-2">
                      {latestOrder.subtotal !==
                        undefined && (
                        <SummaryRow
                          label="Subtotal"
                          value={`₹${latestOrder.subtotal}`}
                        />
                      )}

                      {latestOrder.deliveryFee !==
                        undefined && (
                        <SummaryRow
                          label="Delivery Fee"
                          value={
                            latestOrder.deliveryFee ===
                            0
                              ? "FREE"
                              : `₹${latestOrder.deliveryFee}`
                          }
                        />
                      )}

                      {latestOrder.discount >
                        0 && (
                        <SummaryRow
                          label="Discount"
                          value={`- ₹${latestOrder.discount}`}
                        />
                      )}
                    </div>

                    <div className="border-t border-white/10 mt-4 pt-4 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-400">
                          TOTAL AMOUNT
                        </p>

                        <p className="text-2xl font-black mt-1 text-white">
                          ₹
                          {getOrderAmount(
                            latestOrder
                          )}
                        </p>
                      </div>

                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        latestOrder.paymentStatus === "PAID"
                          ? "bg-green-500/20 text-green-400"
                          : latestOrder.paymentStatus === "FAILED"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-orange-500/20 text-orange-400"
                      }`}>
                        {latestOrder.paymentStatus ||
                          "PENDING"}{" "}
                        (
                        {latestOrder.paymentMethod ||
                          "COD"}
                        )
                      </span>
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 pb-6">
                    <button
                      type="button"
                      className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 transition font-bold text-sm flex items-center justify-center gap-2"
                      onClick={() => {
                        alert(
                          "Customer support will be available soon."
                        );
                      }}
                    >
                      <Phone size={17} />
                      Need Help?
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* =====================================================
              PREVIOUS ORDERS
          ===================================================== */}

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

                <p className="text-sm text-gray-500">
                  {previousOrders.length} previous{" "}
                  {previousOrders.length === 1
                    ? "order"
                    : "orders"}
                </p>
              </div>

              <div className="mt-6 space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {previousOrders.map((ord) => {
                  const orderId =
                    ord.orderId ||
                    `#PH${ord._id?.slice(
                      -4
                    )}`;

                  const isExpanded =
                    expandedOrder ===
                    ord._id;

                  return (
                    <div
                      key={ord._id}
                      className="rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition overflow-hidden"
                    >
                      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl shrink-0">
                            🍕
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-black text-gray-950">
                                {orderId}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyOrderId(
                                    orderId
                                  )
                                }
                                className="text-gray-400 hover:text-red-600 transition"
                                title="Copy Order ID"
                              >
                                {copiedOrderId ===
                                orderId ? (
                                  <CheckCircle2
                                    size={14}
                                  />
                                ) : (
                                  <Copy
                                    size={14}
                                  />
                                )}
                              </button>
                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                              {getOrderItemsSummary(
                                ord
                              )}{" "}
                              • ₹
                              {getOrderAmount(
                                ord
                              )}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {getOrderDate(ord)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-black ${getStatusStyle(
                              ord.orderStatus
                            )}`}
                          >
                            {getStatusLabel(
                              ord.orderStatus
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              toggleDetails(
                                ord._id
                              )
                            }
                            className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition"
                          >
                            {isExpanded ? (
                              <>
                                Hide Details
                                <ChevronUp
                                  size={14}
                                />
                              </>
                            ) : (
                              <>
                                View Details
                                <ChevronDown
                                  size={14}
                                />
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleReorder(ord)
                            }
                            disabled={
                              reorderingId ===
                              ord._id
                            }
                            className="px-3 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                          >
                            {reorderingId ===
                            ord._id ? (
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                            ) : (
                              <RotateCcw
                                size={14}
                              />
                            )}

                            Order Again
                          </button>
                        </div>
                      </div>

                      {/* DETAILS */}

                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50 p-5">
                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <InfoBox
                              label="Order ID"
                              value={orderId}
                            />

                            <InfoBox
                              label="Date"
                              value={getOrderDate(
                                ord
                              )}
                            />

                            <InfoBox
                              label="Payment"
                              value={
                                ord.paymentMethod ||
                                "COD"
                              }
                            />

                            <InfoBox
                              label="Payment Status"
                              value={
                                ord.paymentStatus ||
                                "PENDING"
                              }
                            />
                          </div>

                          {ord.manualPayment?.transactionId && (
                            <div className="mt-3 grid sm:grid-cols-2 gap-4">
                              <InfoBox
                                label="Transaction ID"
                                value={ord.manualPayment.transactionId}
                              />
                            </div>
                          )}

                          <div className="mt-4 rounded-2xl bg-white border border-gray-100 p-4">
                            <p className="text-xs font-black uppercase tracking-wider text-gray-400">
                              Delivery Address
                            </p>

                            <div className="flex items-start gap-2 mt-2">
                              <MapPin
                                size={17}
                                className="text-red-600 mt-0.5 shrink-0"
                              />

                              <p className="text-sm text-gray-600">
                                {getOrderAddress(
                                  ord
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 rounded-2xl bg-white border border-gray-100 p-4">
                            <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
                              Items
                            </p>

                            <div className="space-y-3">
                              {Array.isArray(
                                ord.items
                              ) &&
                              ord.items.length >
                                0 ? (
                                ord.items.map(
                                  (
                                    item,
                                    index
                                  ) => (
                                    <div
                                      key={
                                        index
                                      }
                                      className="flex items-center justify-between gap-4"
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        <img
                                          src={
                                            item.image ||
                                            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400"
                                          }
                                          alt={
                                            item.name ||
                                            "Pizza"
                                          }
                                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                                        />

                                        <div className="min-w-0">
                                          <p className="font-bold text-sm truncate">
                                            {item.name ||
                                              "Pizza"}
                                          </p>

                                          <p className="text-xs text-gray-400">
                                            Qty:{" "}
                                            {item.quantity ||
                                              1}
                                          </p>
                                        </div>
                                      </div>

                                      <p className="font-black text-sm">
                                        ₹
                                        {(
                                          Number(
                                            item.price
                                          ) ||
                                          0
                                        ) *
                                          (Number(
                                            item.quantity
                                          ) ||
                                            1)}
                                      </p>
                                    </div>
                                  )
                                )
                              ) : (
                                <p className="text-sm text-gray-500">
                                  Custom pizza order
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 flex justify-between items-center border-t border-gray-200 pt-4">
                            <div>
                              <p className="text-xs text-gray-400">
                                TOTAL
                              </p>

                              <p className="text-xl font-black">
                                ₹
                                {getOrderAmount(
                                  ord
                                )}
                              </p>
                            </div>

                            {canCancelOrder(
                              ord
                            ) && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCancelOrder(
                                    ord
                                  )
                                }
                                disabled={
                                  cancellingId ===
                                  ord._id
                                }
                                className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold text-sm hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                              >
                                {cancellingId ===
                                ord._id ? (
                                  <>
                                    <Loader2
                                      size={15}
                                      className="inline mr-1 animate-spin"
                                    />
                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    <XCircle
                                      size={15}
                                      className="inline mr-1"
                                    />
                                    Cancel Order
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

// =========================================================
// SUMMARY ROW
// =========================================================

function SummaryRow({
  label,
  value,
}) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-400">
        {label}
      </span>

      <span className="font-semibold text-right text-gray-200">
        {value}
      </span>
    </div>
  );
}

// =========================================================
// INFO BOX
// =========================================================

function InfoBox({
  label,
  value,
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <p className="text-[11px] font-black uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="text-sm font-bold text-gray-900 mt-1 break-words">
        {value}
      </p>
    </div>
  );
}