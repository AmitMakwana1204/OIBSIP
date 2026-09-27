import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  Flame,
  Search,
  MapPin,
  ShoppingBag,
  Tag,
  Truck,
  SlidersHorizontal,
  Loader2,
  RefreshCw,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PizzaCard from "../components/PizzaCard";
import { getUserOrders } from "../services/api";

const API_URL = "http://localhost:5000/api/pizzas";
const CART_KEY = "pizzaCart";

const CATEGORIES = [
  "All",
  "Classic",
  "Veg",
  "Loaded",
  "Spicy",
  "Cheesy",
  "Mexican",
];

const ACTIVE_ORDER_STATUSES = new Set([
  "PLACED",
  "CONFIRMED",
  "ORDER_RECEIVED",
  "PREPARING",
  "IN_KITCHEN",
  "OUT_FOR_DELIVERY",
  "SENT_TO_DELIVERY",
]);

const normalizeId = (value) => {
  if (value === null || value === undefined) return "";
  return String(value);
};

const getOrderProgress = (status) => {
  switch (status) {
    case "PLACED":
    case "ORDER_RECEIVED":
      return 20;

    case "CONFIRMED":
      return 35;

    case "PREPARING":
    case "IN_KITCHEN":
      return 55;

    case "OUT_FOR_DELIVERY":
    case "SENT_TO_DELIVERY":
      return 80;

    case "DELIVERED":
      return 100;

    default:
      return 10;
  }
};

const getOrderStatusText = (status) => {
  switch (status) {
    case "PLACED":
      return "Order placed successfully 🍕";

    case "ORDER_RECEIVED":
      return "Your order has been received";

    case "CONFIRMED":
      return "Your order has been confirmed";

    case "PREPARING":
      return "Your pizza is being prepared 🍕";

    case "IN_KITCHEN":
      return "Your pizza is cooking in the kitchen 🔥";

    case "OUT_FOR_DELIVERY":
    case "SENT_TO_DELIVERY":
      return "Your pizza is on the way 🚚";

    case "DELIVERED":
      return "Your order has been delivered 🎉";

    default:
      return "Your order is being processed";
  }
};

const getOrderStatusLabel = (status) => {
  switch (status) {
    case "PLACED":
      return "Order Placed";

    case "ORDER_RECEIVED":
      return "Order Received";

    case "CONFIRMED":
      return "Confirmed";

    case "PREPARING":
    case "IN_KITCHEN":
      return "Preparing";

    case "OUT_FOR_DELIVERY":
    case "SENT_TO_DELIVERY":
      return "Out for Delivery";

    case "DELIVERED":
      return "Delivered";

    case "CANCELLED":
      return "Cancelled";

    default:
      return "Processing";
  }
};

const getOrderAddress = (order) => {
  if (!order) return "Delivery address unavailable";

  if (typeof order.deliveryAddress === "string") {
    return order.deliveryAddress;
  }

  if (typeof order.shippingAddress === "string") {
    return order.shippingAddress;
  }

  const address =
    order.shippingAddress ||
    order.deliveryAddress ||
    order.address ||
    {};

  if (typeof address === "object") {
    const parts = [
      address.address,
      address.street,
      address.area,
      address.city,
      address.state,
      address.pincode,
      address.zipCode,
    ].filter(Boolean);

    if (parts.length) return parts.join(", ");

    if (address.fullAddress) return address.fullAddress;
  }

  return "Delivery address unavailable";
};

const getOrderTotal = (order) => {
  const value =
    order?.totalAmount ??
    order?.total ??
    order?.amount ??
    order?.grandTotal ??
    0;

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) return "0.00";

  return numericValue.toFixed(2);
};

const getOrderItemCount = (order) => {
  if (!Array.isArray(order?.items)) return 0;

  return order.items.reduce((total, item) => {
    return total + Number(item.quantity || 1);
  }, 0);
};

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "GOOD MORNING";
  }

  if (hour >= 12 && hour < 17) {
    return "GOOD AFTERNOON";
  }

  if (hour >= 17 && hour < 21) {
    return "GOOD EVENING";
  }

  return "GOOD NIGHT";
};

const getUserName = () => {
  try {
    const storedUser = localStorage.getItem("pizzahub_user");

    if (!storedUser) return "Pizza Lover";

    const user = JSON.parse(storedUser);

    return (
      user?.name ||
      user?.fullName ||
      user?.username ||
      user?.firstName ||
      "Pizza Lover"
    );
  } catch {
    return "Pizza Lover";
  }
};

const formatDate = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Dashboard = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pizzaError, setPizzaError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const [cart, setCart] = useState([]);

  const [greeting, setGreeting] = useState(getGreeting());
  const [userName, setUserName] = useState(getUserName());

  const [location, setLocation] = useState("Detecting location...");
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState("");

  const [activeOrder, setActiveOrder] = useState(null);
  const [activeOrderLoading, setActiveOrderLoading] = useState(true);
  const [activeOrderError, setActiveOrderError] = useState("");

  // ---------------------------------------------------------
  // GREETING
  // ---------------------------------------------------------

  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting());
      setUserName(getUserName());
    };

    updateGreeting();

    const interval = setInterval(updateGreeting, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------------------
  // CART
  // ---------------------------------------------------------

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch {
      setCart([]);
    }

    const handleCartUpdate = () => {
      try {
        const savedCart = localStorage.getItem(CART_KEY);

        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);

          setCart(Array.isArray(parsedCart) ? parsedCart : []);
        } else {
          setCart([]);
        }
      } catch {
        setCart([]);
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  // ---------------------------------------------------------
  // FETCH PIZZAS
  // ---------------------------------------------------------

  const fetchPizzas = async () => {
    try {
      setLoading(true);
      setPizzaError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch pizzas");
      }

      const data = await response.json();

      const pizzaList = Array.isArray(data)
        ? data
        : data?.pizzas || data?.data || [];

      setPizzas(Array.isArray(pizzaList) ? pizzaList : []);
    } catch (error) {
      console.error("Pizza fetch error:", error);
      setPizzaError(
        "Unable to load pizzas right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  // ---------------------------------------------------------
  // ACTIVE ORDER - DATABASE
  // ---------------------------------------------------------

  const fetchActiveOrder = async () => {
    try {
      setActiveOrderLoading(true);
      setActiveOrderError("");

      const response = await getUserOrders();

      const orders =
        response?.data?.orders ||
        response?.data?.data ||
        [];

      if (!Array.isArray(orders)) {
        setActiveOrder(null);
        return;
      }

      // Newest order first
      const sortedOrders = [...orders].sort((a, b) => {
        return (
          new Date(b?.createdAt || 0).getTime() -
          new Date(a?.createdAt || 0).getTime()
        );
      });

      // Find newest active order
      const currentActiveOrder =
        sortedOrders.find((order) =>
          ACTIVE_ORDER_STATUSES.has(
            String(order?.orderStatus || order?.status || "").toUpperCase()
          )
        ) || null;

      setActiveOrder(currentActiveOrder);
    } catch (error) {
      console.error("Active order fetch error:", error);
      setActiveOrderError(
        "Unable to load your active order."
      );
      setActiveOrder(null);
    } finally {
      setActiveOrderLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrder();

    const interval = setInterval(() => {
      fetchActiveOrder();
    }, 30 * 1000);

    const handleOrderUpdate = () => {
      fetchActiveOrder();
    };

    window.addEventListener("orderUpdated", handleOrderUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener(
        "orderUpdated",
        handleOrderUpdate
      );
    };
  }, []);

  // ---------------------------------------------------------
  // LOCATION
  // ---------------------------------------------------------

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported by your browser.");
      setLocationLoading(false);
      return;
    }

    setLocationLoading(true);
    setLocationError("");
    setLocation("Detecting location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Location lookup failed");
          }

          const data = await response.json();

          const address = data?.address || {};

          const detectedLocation =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.suburb ||
            address.state_district ||
            address.state ||
            "Your Location";

          setLocation(detectedLocation);
        } catch (error) {
          console.error("Reverse geocoding error:", error);

          setLocationError(
            "Unable to detect your location."
          );
          setLocation("Location unavailable");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);

        setLocationError(
          "Location permission denied or unavailable."
        );
        setLocation("Location unavailable");
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

// ---------------------------------------------------------
// ADD TO CART
// ---------------------------------------------------------

const handleAddToCart = (pizza) => {
  if (!pizza) return;

  const pizzaId = normalizeId(
    pizza?._id || pizza?.id
  );

  if (!pizzaId) return;

  const price = Number(
    pizza?.price ??
      pizza?.sellingPrice ??
      pizza?.salePrice ??
      0
  );

  const oldPrice = Number(
    pizza?.oldPrice ??
      pizza?.originalPrice ??
      pizza?.mrp ??
      0
  );

  try {
    // Always get the latest cart directly from localStorage
    const savedCart = localStorage.getItem(CART_KEY);

    let currentCart = [];

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        currentCart = parsedCart;
      }
    }

    const existingItemIndex = currentCart.findIndex(
      (item) =>
        normalizeId(item?.id || item?._id) === pizzaId
    );

    let updatedCart;

    if (existingItemIndex !== -1) {
      // Existing pizza → increase ONLY ONCE
      updatedCart = [...currentCart];

      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity:
          Number(
            updatedCart[existingItemIndex]?.quantity || 0
          ) + 1,
      };
    } else {
      // New pizza → add quantity 1
      updatedCart = [
        ...currentCart,
        {
          id: pizzaId,
          _id: pizza?._id || pizza?.id,
          name: pizza?.name || "Pizza",
          price,
          oldPrice,
          image:
            pizza?.image ||
            pizza?.imageUrl ||
            pizza?.photo ||
            "",
          quantity: 1,
        },
      ];
    }

    // Save ONLY ONCE
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(updatedCart)
    );

    // Update React state
    setCart(updatedCart);

    // Notify other cart components
    window.dispatchEvent(
      new Event("cartUpdated")
    );

  } catch (error) {
    console.error(
      "Cart save error:",
      error
    );
  }
};
  // ---------------------------------------------------------
  // FILTER + SEARCH + SORT
  // ---------------------------------------------------------

  const filteredPizzas = useMemo(() => {
    let result = [...pizzas];

    if (selectedCategory !== "All") {
      result = result.filter((pizza) => {
        const category =
          String(pizza?.category || "").toLowerCase();

        const tags = Array.isArray(pizza?.tags)
          ? pizza.tags.map((tag) =>
              String(tag).toLowerCase()
            )
          : [];

        const selected =
          selectedCategory.toLowerCase();

        return (
          category === selected ||
          tags.includes(selected)
        );
      });
    }

    const search = searchTerm.trim().toLowerCase();

    if (search) {
      result = result.filter((pizza) => {
        const name =
          String(pizza?.name || "").toLowerCase();

        const description =
          String(pizza?.description || "").toLowerCase();

        const category =
          String(pizza?.category || "").toLowerCase();

        return (
          name.includes(search) ||
          description.includes(search) ||
          category.includes(search)
        );
      });
    }

    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(a?.price || 0) -
          Number(b?.price || 0)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(b?.price || 0) -
          Number(a?.price || 0)
      );
    }

    if (sortBy === "rating") {
      result.sort(
        (a, b) =>
          Number(b?.rating || 0) -
          Number(a?.rating || 0)
      );
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b?.createdAt || 0).getTime() -
          new Date(a?.createdAt || 0).getTime()
      );
    }

    return result;
  }, [
    pizzas,
    selectedCategory,
    searchTerm,
    sortBy,
  ]);

  // ---------------------------------------------------------
  // CART TOTALS
  // ---------------------------------------------------------

  const cartItemCount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item?.quantity || 0),
      0
    );
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item?.price || 0) *
          Number(item?.quantity || 0),
      0
    );
  }, [cart]);

  // ---------------------------------------------------------
  // ACTIVE ORDER DATA
  // ---------------------------------------------------------

  const activeOrderStatus = String(
    activeOrder?.orderStatus ||
      activeOrder?.status ||
      "PLACED"
  ).toUpperCase();

  const activeOrderProgress =
    getOrderProgress(activeOrderStatus);

  const activeOrderStatusText =
    getOrderStatusText(activeOrderStatus);

  const activeOrderStatusLabel =
    getOrderStatusLabel(activeOrderStatus);

  const activeOrderId =
    activeOrder?._id ||
    activeOrder?.id ||
    activeOrder?.orderNumber ||
    "";

  const displayOrderId =
    activeOrder?.orderNumber ||
    (activeOrderId
      ? String(activeOrderId).slice(-8).toUpperCase()
      : "N/A");

  const activeOrderItemCount =
    getOrderItemCount(activeOrder);

  const activeOrderTotal =
    getOrderTotal(activeOrder);

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-[1500px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">

        {/* =====================================================
            WELCOME HEADER
        ===================================================== */}

        <section className="mb-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p className="mb-1 text-xs font-black tracking-[0.22em] text-orange-500">
                {greeting}
              </p>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Welcome back, {userName} 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Your next delicious pizza is just a few clicks away.
                Explore our fresh menu and order your favorite.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">

              {/* LOCATION */}

              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Delivering to
                  </p>

                  <p className="max-w-[150px] truncate text-sm font-bold text-slate-800">
                    {locationLoading
                      ? "Detecting..."
                      : location}
                  </p>
                </div>

                {!locationLoading && (
                  <button
                    type="button"
                    onClick={detectLocation}
                    className="ml-1 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-orange-500"
                    title="Refresh location"
                  >
                    <RefreshCw size={14} />
                  </button>
                )}
              </div>

              {/* CART */}

              <Link
                to="/cart"
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
                  <ShoppingBag size={18} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Your Cart
                  </p>

                  <p className="text-sm font-black text-slate-800">
                    {cartItemCount}{" "}
                    {cartItemCount === 1
                      ? "item"
                      : "items"}
                  </p>
                </div>
              </Link>

            </div>
          </div>

          {locationError && (
            <p className="mt-2 text-xs font-medium text-slate-400">
              {locationError}
            </p>
          )}
        </section>

        {/* =====================================================
            OFFER BANNER
        ===================================================== */}

        <section className="mb-7 overflow-hidden rounded-[28px] bg-gradient-to-r from-orange-500 via-orange-500 to-red-500 p-5 text-white shadow-xl shadow-orange-100 sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Tag size={24} />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-100">
                  Today's Special
                </p>

                <h2 className="mt-1 text-xl font-black sm:text-2xl">
                  Delicious pizzas, delivered hot.
                </h2>

                <p className="mt-1 text-sm text-orange-50">
                  Fresh ingredients • Fast delivery • Great taste
                </p>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-orange-600 transition hover:bg-orange-50"
            >
              Explore Menu
              <ArrowRight size={17} />
            </Link>

          </div>
        </section>

        {/* =====================================================
            ACTIVE ORDER - DATABASE BACKED
        ===================================================== */}

        <section className="mb-9">

          {activeOrderLoading ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />
                </div>

                <div>
                  <p className="text-sm font-black text-slate-800">
                    Checking your active order...
                  </p>

                  <p className="text-xs text-slate-400">
                    Please wait a moment.
                  </p>
                </div>
              </div>
            </div>
          ) : activeOrderError ? (
            <div className="rounded-[28px] border border-red-100 bg-red-50 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-red-700">
                    {activeOrderError}
                  </p>

                  <p className="mt-1 text-xs text-red-500">
                    Check your connection and try again.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchActiveOrder}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-red-600 shadow-sm"
                >
                  <RefreshCw size={15} />
                  Retry
                </button>
              </div>
            </div>
          ) : activeOrder ? (
            <div className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm">

              {/* ORDER HEADER */}

              <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                    <Truck size={22} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
                        Active Order
                      </p>

                      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-black text-orange-600">
                        #{displayOrderId}
                      </span>
                    </div>

                    <h2 className="mt-1 text-lg font-black text-slate-900 sm:text-xl">
                      {activeOrderStatusText}
                    </h2>
                  </div>

                </div>

                <div className="flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                    {activeOrderItemCount}{" "}
                    {activeOrderItemCount === 1
                      ? "item"
                      : "items"}
                  </span>

                  <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600">
                    ₹{activeOrderTotal}
                  </span>

                </div>
              </div>

              {/* ORDER BODY */}

              <div className="p-5 sm:p-6">

                <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">

                  <div>

                    {/* STATUS */}

                    <div className="mb-5 flex flex-wrap gap-2">

                      {[
                        "PLACED",
                        "CONFIRMED",
                        "PREPARING",
                        "OUT_FOR_DELIVERY",
                      ].map((status, index) => {
                        const statusProgress = [
                          20,
                          35,
                          55,
                          80,
                        ][index];

                        const isCompleted =
                          activeOrderProgress >=
                          statusProgress;

                        const label =
                          status === "PLACED"
                            ? "Order Placed"
                            : status === "CONFIRMED"
                            ? "Confirmed"
                            : status === "PREPARING"
                            ? "Preparing"
                            : "Out for Delivery";

                        return (
                          <div
                            key={status}
                            className={`rounded-full px-3 py-1.5 text-[11px] font-black transition ${
                              isCompleted
                                ? "bg-orange-500 text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {label}
                          </div>
                        );
                      })}

                    </div>

                    {/* PROGRESS */}

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">
                          Order progress
                        </span>

                        <span className="text-xs font-black text-orange-500">
                          {activeOrderProgress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-700"
                          style={{
                            width: `${activeOrderProgress}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* ORDER DETAILS */}

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">

                      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                        <MapPin
                          size={18}
                          className="mt-0.5 shrink-0 text-orange-500"
                        />

                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Delivery Address
                          </p>

                          <p className="mt-1 text-xs font-semibold leading-5 text-slate-700">
                            {getOrderAddress(activeOrder)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                        <Clock3
                          size={18}
                          className="mt-0.5 shrink-0 text-orange-500"
                        />

                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Order Date
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-700">
                            {formatDate(
                              activeOrder?.createdAt
                            ) || "Recently"}
                          </p>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* TRACK ORDER */}

                  <Link
                    to="/orders"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-orange-500"
                  >
                    Track Order
                    <ArrowRight size={17} />
                  </Link>

                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-7 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <ShoppingBag size={25} />
              </div>

              <h2 className="mt-4 text-lg font-black text-slate-900">
                No active orders
              </h2>

              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                You don't have an order currently being prepared
                or delivered. Ready to order something delicious?
              </p>

              <Link
                to="/dashboard"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600"
              >
                Order Pizza
                <ArrowRight size={17} />
              </Link>

            </div>
          )}

        </section>

        {/* =====================================================
            MENU HEADER
        ===================================================== */}

        <section id="menu">

          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-1 flex items-center gap-2">
                <Flame
                  size={18}
                  className="text-orange-500"
                />

                <span className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
                  Fresh & Hot
                </span>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Explore Our Menu
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Find your perfect pizza from our delicious collection.
              </p>
            </div>

            <Link
              to="/pizza-builder"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-500"
            >
              Build Your Pizza
              <ArrowRight size={16} />
            </Link>

          </div>

          {/* SEARCH + SORT */}

          <div className="mb-5 flex flex-col gap-3 md:flex-row">

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search pizzas..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div className="relative md:w-52">
              <SlidersHorizontal
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              >
                <option value="featured">
                  Featured
                </option>

                <option value="newest">
                  Newest
                </option>

                <option value="rating">
                  Top Rated
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>
              </select>
            </div>

          </div>

          {/* CATEGORIES */}

          <div className="mb-7 flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((category) => {
              const isActive =
                selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-black transition ${
                    isActive
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-100"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-500"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* =====================================================
              PIZZA GRID
          ===================================================== */}

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-[390px] animate-pulse rounded-[24px] bg-slate-100"
                  />
                )
              )}
            </div>
          ) : pizzaError ? (
            <div className="rounded-[28px] border border-red-100 bg-red-50 p-8 text-center">

              <p className="text-sm font-black text-red-700">
                {pizzaError}
              </p>

              <button
                type="button"
                onClick={fetchPizzas}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-red-600 shadow-sm"
              >
                <RefreshCw size={16} />
                Try Again
              </button>

            </div>
          ) : filteredPizzas.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Search size={24} />
              </div>

              <h3 className="mt-4 text-lg font-black text-slate-900">
                No pizzas found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try another search or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="mt-4 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-600"
              >
                Clear Filters
              </button>

            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPizzas.map((pizza) => (
                <PizzaCard
                  key={
                    pizza?._id ||
                    pizza?.id ||
                    pizza?.name
                  }
                  pizza={pizza}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

        </section>

        {/* =====================================================
            BUILD YOUR OWN CTA
        ===================================================== */}

        <section className="mt-10 overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">
                Create Something Special
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Build your own perfect pizza 🍕
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Choose your size, crust, sauce, cheese and toppings.
                Make every bite exactly the way you like it.
              </p>
            </div>

            <Link
              to="/pizza-builder"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-black text-white transition hover:bg-orange-600"
            >
              Start Building
              <ArrowRight size={17} />
            </Link>

          </div>
        </section>

        {/* =====================================================
            CART SUMMARY
        ===================================================== */}

        {cartItemCount > 0 && (
          <div className="fixed bottom-5 left-1/2 z-40 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
            <Link
              to="/cart"
              className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950 px-5 py-4 text-white shadow-2xl shadow-slate-300"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
                  <ShoppingBag size={19} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400">
                    {cartItemCount}{" "}
                    {cartItemCount === 1
                      ? "item"
                      : "items"}{" "}
                    in cart
                  </p>

                  <p className="text-sm font-black">
                    View your cart
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-black">
                  ₹{cartTotal.toFixed(2)}
                </span>

                <ArrowRight size={18} />
              </div>
            </Link>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;