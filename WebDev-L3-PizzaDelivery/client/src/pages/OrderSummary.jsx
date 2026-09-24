import { useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Truck,
  ShieldCheck,
} from "lucide-react";

import { createUserOrder } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function OrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // CHECKOUT STATE
  // =========================

  const state = location.state || {};

  const pizza = state.pizza || {
    name: "Custom Pizza",
    image: "",

    base: {
      name: "Classic Crust",
      price: 0,
    },

    sauce: {
      name: "Classic Tomato",
      price: 0,
    },

    cheese: {
      name: "Mozzarella",
      price: 0,
    },

    vegetables: [],
  };

  const quantity = Math.max(
    Number(state.quantity) || 1,
    1
  );

  const selectedPizza =
    state.selectedPizza || null;

  // =========================
  // USER DATA
  // =========================

  const userName =
    user?.name?.trim() || "Customer";

  const userEmail =
    user?.email?.trim() || "";

  const userPhone =
    user?.phone?.trim() || "";

  const userAddress =
    user?.address?.trim() || "";

  const userCity =
    user?.city?.trim() || "";

  const userState =
    user?.state?.trim() || "";

  const userPincode =
    user?.pincode?.trim() || "";

  // =========================
  // ADDRESS DISPLAY
  // =========================

  const formattedAddress = [
    userAddress,
    userCity,
    userState,
    userPincode,
  ]
    .filter(Boolean)
    .join(", ");

  // =========================
  // PRICING
  // =========================

  const pricing = useMemo(() => {
    const basePrice =
      Number(pizza.base?.price) || 0;

    const saucePrice =
      Number(pizza.sauce?.price) || 0;

    const cheesePrice =
      Number(pizza.cheese?.price) || 0;

    const toppingsPrice =
      Array.isArray(
        pizza.vegetables
      )
        ? pizza.vegetables.reduce(
            (sum, item) =>
              sum +
              (Number(item.price) || 0),
            0
          )
        : 0;

    // No starting price
    const singlePizzaPrice =
      basePrice +
      saucePrice +
      cheesePrice +
      toppingsPrice;

    const itemTotal =
      singlePizzaPrice * quantity;

    const deliveryFee =
      itemTotal >= 499
        ? 0
        : 40;

    const discount =
      itemTotal >= 999
        ? Math.round(
            itemTotal * 0.2
          )
        : 0;

    const finalTotal =
      itemTotal +
      deliveryFee -
      discount;

    return {
      basePrice,
      saucePrice,
      cheesePrice,
      toppingsPrice,
      singlePizzaPrice,
      itemTotal,
      deliveryFee,
      discount,
      finalTotal,
    };
  }, [pizza, quantity]);

  // =========================
  // VALIDATE USER DETAILS
  // =========================

  const validateUserDetails = () => {
    if (!user) {
      return "Please log in before placing your order.";
    }

    if (!user.name?.trim()) {
      return "Please update your name in your profile.";
    }

    if (!user.phone?.trim()) {
      return "Please add your phone number in your profile.";
    }

    if (!user.address?.trim()) {
      return "Please add your delivery address in your profile.";
    }

    if (!user.city?.trim()) {
      return "Please add your city in your profile.";
    }

    if (!user.state?.trim()) {
      return "Please add your state in your profile.";
    }

    if (!user.pincode?.trim()) {
      return "Please add your pincode in your profile.";
    }

    return "";
  };

  // =========================
  // PLACE ORDER
  // =========================

  const handlePay = async () => {
    try {
      setLoading(true);
      setError("");

      // =========================
      // VALIDATE LOGIN + PROFILE
      // =========================

      const validationError =
        validateUserDetails();

      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      // =========================
      // ORDER DATA
      // =========================

      const orderData = {
        items: [
          {
            product:
              selectedPizza?._id ||
              selectedPizza?.id ||
              null,

            name:
              selectedPizza?.name ||
              pizza.name ||
              "Custom Pizza",

            price:
              pricing.singlePizzaPrice,

            quantity,

            image:
              selectedPizza?.image ||
              pizza.image ||
              "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
          },
        ],

        // =========================
        // ACTUAL LOGGED-IN USER
        // =========================

        customer: {
          name: userName,
          email: userEmail,
          phone: userPhone,
        },

        // =========================
        // ACTUAL USER ADDRESS
        // =========================

        shippingAddress: {
          address: userAddress,
          city: userCity,
          state: userState,
          pincode: userPincode,
        },

        // =========================
        // PAYMENT
        // =========================

        paymentMethod: "COD",
        paymentStatus: "PENDING",

        // =========================
        // PRICING
        // =========================

        subtotal:
          pricing.itemTotal,

        deliveryFee:
          pricing.deliveryFee,

        discount:
          pricing.discount,

        total:
          pricing.finalTotal,
      };

      console.log(
        "Creating Order:",
        orderData
      );

      // =========================
      // CREATE ORDER
      // =========================

      const res =
        await createUserOrder(
          orderData
        );

      const placedOrder =
        res.data?.order ||
        res.data?.data ||
        res.data ||
        res;

      // =========================
      // SUCCESS
      // =========================

      if (
        res.data?.success ||
        res.status === 201
      ) {
        navigate(
          "/order-success",
          {
            replace: true,

            state: {
              order: placedOrder,
            },
          }
        );

        return;
      }

      // =========================
      // FAILED RESPONSE
      // =========================

      setError(
        res.data?.message ||
          "Order could not be placed. Please try again."
      );
    } catch (err) {
      console.error(
        "Order creation error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-6">

          {/* =========================
              BACK
          ========================= */}

          <Link
            to="/pizza-builder"
            className="inline-flex items-center gap-2 text-gray-600 font-semibold mb-7 hover:text-red-600 transition"
          >
            <ArrowLeft size={18} />

            Back to Builder
          </Link>

          {/* =========================
              HEADER
          ========================= */}

          <div>
            <p className="text-sm font-bold text-red-600 uppercase tracking-wider">
              Checkout
            </p>

            <h1 className="text-4xl md:text-5xl font-black mt-1">
              Order Summary
            </h1>

            <p className="text-gray-500 mt-2">
              Review your custom pizza before placing your order.
            </p>
          </div>

          {/* =========================
              ERROR
          ========================= */}

          {error && (
            <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
              <AlertCircle
                size={19}
                className="shrink-0 text-red-600"
              />

              <span>
                {error}
              </span>
            </div>
          )}

          {/* =========================
              MAIN GRID
          ========================= */}

          <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-8">

            {/* =================================================
                LEFT
            ================================================= */}

            <div className="space-y-6">

              {/* =========================
                  PIZZA CARD
              ========================= */}

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                <div className="p-7 border-b border-gray-100">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                      <ShoppingBag size={22} />
                    </div>

                    <div>
                      <h2 className="font-black text-xl">
                        Your Custom Pizza
                      </h2>

                      <p className="text-sm text-gray-500">
                        {quantity} × Pizza
                      </p>
                    </div>

                  </div>

                </div>

                {/* =========================
                    PIZZA IMAGE
                ========================= */}

                {selectedPizza?.image ||
                pizza.image ? (
                  <div className="h-64 bg-gray-100 overflow-hidden">

                    <img
                      src={
                        selectedPizza?.image ||
                        pizza.image
                      }
                      alt={
                        selectedPizza?.name ||
                        pizza.name ||
                        "Pizza"
                      }
                      className="w-full h-full object-cover"
                    />

                  </div>
                ) : null}

                {/* =========================
                    INGREDIENTS
                ========================= */}

                <div className="p-7">

                  <Item
                    title="Pizza Base"
                    value={
                      pizza.base?.name ||
                      "Classic Crust"
                    }
                    price={
                      Number(
                        pizza.base?.price
                      ) || 0
                    }
                  />

                  <Item
                    title="Sauce"
                    value={
                      pizza.sauce?.name ||
                      "Classic Tomato"
                    }
                    price={
                      Number(
                        pizza.sauce?.price
                      ) || 0
                    }
                  />

                  <Item
                    title="Cheese"
                    value={
                      pizza.cheese?.name ||
                      "Mozzarella"
                    }
                    price={
                      Number(
                        pizza.cheese?.price
                      ) || 0
                    }
                  />

                  <Item
                    title="Toppings"
                    value={
                      pizza.vegetables?.length
                        ? pizza.vegetables
                            .map(
                              (item) =>
                                item.name
                            )
                            .join(", ")
                        : "No extra toppings"
                    }
                    price={
                      pricing.toppingsPrice
                    }
                  />

                  <Item
                    title="Quantity"
                    value={`× ${quantity}`}
                    price={0}
                  />

                </div>
              </div>

              {/* =================================================
                  CUSTOMER DETAILS
              ================================================= */}

              <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                    <MapPin size={21} />
                  </div>

                  <div>
                    <h2 className="font-black text-xl">
                      Delivery Details
                    </h2>

                    <p className="text-sm text-gray-500">
                      Your order will be delivered to your profile address
                    </p>
                  </div>

                </div>

                <div className="mt-6 p-5 bg-gray-50 rounded-2xl">

                  {/* Name */}

                  <p className="font-black">
                    {userName}
                  </p>

                  {/* Email */}

                  {userEmail && (
                    <p className="text-sm text-gray-500 mt-1">
                      {userEmail}
                    </p>
                  )}

                  {/* Phone */}

                  {userPhone && (
                    <p className="text-sm text-gray-500 mt-1">
                      {userPhone}
                    </p>
                  )}

                  {/* Address */}

                  <p className="text-sm text-gray-500 mt-3 leading-6">
                    {formattedAddress ||
                      "Delivery address not added"}
                  </p>

                </div>

              </div>

              {/* =========================
                  TRUST
              ========================= */}

              <div className="grid sm:grid-cols-3 gap-4">

                <TrustCard
                  icon={
                    <ShieldCheck size={19} />
                  }
                  title="Secure"
                  text="Safe checkout"
                />

                <TrustCard
                  icon={
                    <Truck size={19} />
                  }
                  title="Fast Delivery"
                  text="Fresh & hot"
                />

                <TrustCard
                  icon={
                    <CheckCircle2 size={19} />
                  }
                  title="Quality"
                  text="Made fresh"
                />

              </div>

            </div>

            {/* =================================================
                RIGHT
            ================================================= */}

            <div>

              <div className="bg-gray-950 text-white rounded-3xl p-7 shadow-2xl lg:sticky lg:top-6">

                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">
                  Bill Details
                </p>

                <h2 className="text-2xl font-black mt-1">
                  Payment Summary
                </h2>

                <div className="space-y-4 mt-7">

                  <PriceRow
                    label={`Pizza × ${quantity}`}
                    value={`₹${pricing.itemTotal}`}
                  />

                  <PriceRow
                    label="Delivery Fee"
                    value={
                      pricing.deliveryFee === 0
                        ? "FREE"
                        : `₹${pricing.deliveryFee}`
                    }
                    valueClass={
                      pricing.deliveryFee === 0
                        ? "text-green-400"
                        : "text-white"
                    }
                  />

                  {pricing.discount > 0 && (
                    <PriceRow
                      label="Discount"
                      value={`- ₹${pricing.discount}`}
                      valueClass="text-green-400"
                    />
                  )}

                </div>

                <div className="border-t border-gray-800 mt-6 pt-6">

                  <div className="flex justify-between items-end">

                    <div>
                      <p className="text-gray-400 text-sm">
                        Total Amount
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Inclusive of applicable charges
                      </p>
                    </div>

                    <span className="text-3xl font-black">
                      ₹{pricing.finalTotal}
                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full mt-7 py-4 bg-red-600 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-950"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />

                      <span>
                        Placing Order...
                      </span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={19} />

                      <span>
                        Place Order · ₹
                        {pricing.finalTotal}
                      </span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-5">
                  <CheckCircle2 size={14} />

                  Secure order processing
                </div>

              </div>

            </div>

          </div>
        </div>
      </main>
    </>
  );
}

// =========================================================
// ITEM
// =========================================================

function Item({
  title,
  value,
  price,
}) {
  return (
    <div className="flex justify-between gap-5 py-4 border-b border-gray-100 last:border-0">

      <div className="min-w-0">

        <p className="font-bold">
          {title}
        </p>

        <p className="text-sm text-gray-500 mt-1 break-words">
          {value}
        </p>

      </div>

      <span className="font-bold whitespace-nowrap">
        {price > 0
          ? `+ ₹${price}`
          : "Included"}
      </span>

    </div>
  );
}

// =========================================================
// PRICE ROW
// =========================================================

function PriceRow({
  label,
  value,
  valueClass = "",
}) {
  return (
    <div className="flex justify-between text-sm">

      <span className="text-gray-400">
        {label}
      </span>

      <span
        className={`font-bold ${valueClass}`}
      >
        {value}
      </span>

    </div>
  );
}

// =========================================================
// TRUST CARD
// =========================================================

function TrustCard({
  icon,
  title,
  text,
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">

      <div className="w-9 h-9 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
        {icon}
      </div>

      <p className="font-black text-sm mt-3">
        {title}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {text}
      </p>

    </div>
  );
}