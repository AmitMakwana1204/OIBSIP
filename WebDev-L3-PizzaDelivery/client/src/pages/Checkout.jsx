import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  User,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createUserOrder } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CART_KEY = "pizzaCart";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);

  // =========================================================
  // CHECKOUT FORM
  // =========================================================

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "COD",
  });

  // =========================================================
  // AUTO-FILL DELIVERY DETAILS FROM USER PROFILE
  // =========================================================

  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,

      name: prev.name || user.name || "",
      phone: prev.phone || user.phone || "",
      address: prev.address || user.address || "",
      city: prev.city || user.city || "",
      pincode: prev.pincode || user.pincode || "",
    }));
  }, [user]);

  // =========================================================
  // LOAD CART
  // =========================================================

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);

      const parsedCart = savedCart ? JSON.parse(savedCart) : [];

      if (!Array.isArray(parsedCart) || parsedCart.length === 0) {
        navigate("/cart");
        return;
      }

      setCart(parsedCart);
    } catch (error) {
      console.error("Checkout cart loading error:", error);
      navigate("/cart");
    } finally {
      setCartLoading(false);
    }
  }, [navigate]);

  // =========================================================
  // SUBTOTAL
  // =========================================================

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;

      return total + price * quantity;
    }, 0);
  }, [cart]);

  // =========================================================
  // DELIVERY FEE
  // =========================================================

  const deliveryFee =
    subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 40;

  // =========================================================
  // DISCOUNT
  // =========================================================

  const discount =
    subtotal >= 999 ? Math.round(subtotal * 0.2) : 0;

  // =========================================================
  // TOTAL
  // =========================================================

  const total = subtotal + deliveryFee - discount;

  // =========================================================
  // TOTAL ITEMS
  // =========================================================

  const totalItems = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + (Number(item.quantity) || 1),
      0
    );
  }, [cart]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    const name = form.name.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();
    const city = form.city.trim();
    const pincode = form.pincode.trim();

    if (!name) {
      alert("Please enter your full name.");
      return false;
    }

    if (!phone) {
      alert("Please enter your phone number.");
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10 digit phone number.");
      return false;
    }

    if (!address) {
      alert("Please enter your delivery address.");
      return false;
    }

    if (!city) {
      alert("Please enter your city.");
      return false;
    }

    if (!pincode) {
      alert("Please enter your pincode.");
      return false;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      alert("Please enter a valid 6 digit pincode.");
      return false;
    }

    if (!["COD", "ONLINE"].includes(form.paymentMethod)) {
      alert("Please select a valid payment method.");
      return false;
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      alert("Your cart is empty.");
      navigate("/cart");
      return false;
    }

    return true;
  };

  // =========================================================
  // PLACE ORDER
  // =========================================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (loading) return;

    const isValid = validateForm();

    if (!isValid) return;

    try {
      setLoading(true);

      // =====================================================
      // PREPARE ORDER ITEMS
      // =====================================================

      const items = cart.map((item) => {
        const productId =
          item._id ||
          item.id ||
          item.product?._id ||
          item.product?.id;

        return {
          product: productId,
          name: item.name || "Pizza",
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          image: item.image || "",
        };
      });

      // =====================================================
      // CHECK PRODUCT IDS
      // =====================================================

      const invalidItem = items.find(
        (item) => !item.product
      );

      if (invalidItem) {
        console.error("Invalid cart item:", invalidItem);

        alert(
          "Product information is missing. Please remove this item from cart and add it again."
        );

        return;
      }

      // =====================================================
      // ORDER PAYLOAD
      // =====================================================

      const orderData = {
        items,

        // ===================================================
        // CUSTOMER DETAILS
        // ===================================================

        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
        },

        // ===================================================
        // DELIVERY ADDRESS
        // ===================================================

        shippingAddress: {
          address: form.address.trim(),
          city: form.city.trim(),
          pincode: form.pincode.trim(),
        },

        // ===================================================
        // PAYMENT
        // ===================================================

        paymentMethod: form.paymentMethod,

        // ===================================================
        // PRICING
        // ===================================================

        subtotal: Number(subtotal),
        deliveryFee: Number(deliveryFee),
        discount: Number(discount),
        total: Number(total),
      };

      // =====================================================
      // DEBUG
      // =====================================================

      console.log("=================================");
      console.log("ORDER PAYLOAD:");
      console.log(JSON.stringify(orderData, null, 2));
      console.log("=================================");

      // =====================================================
      // CREATE ORDER
      // =====================================================

      const response = await createUserOrder(orderData);

      console.log("ORDER CREATED:", response);

      // =====================================================
      // CLEAR CART
      // =====================================================

      localStorage.removeItem(CART_KEY);

      window.dispatchEvent(new Event("cartUpdated"));

      // =====================================================
      // ORDER SUCCESS
      // =====================================================

      navigate("/order-success", {
        replace: true,
        state: {
          order:
            response?.order ||
            response?.data?.order ||
            response?.data ||
            response,
        },
      });
    } catch (error) {
      console.error("=================================");
      console.error("PLACE ORDER ERROR:", error);

      console.error(
        "STATUS:",
        error?.response?.status
      );

      console.error(
        "BACKEND RESPONSE:",
        error?.response?.data
      );

      console.error(
        "REQUEST DATA:",
        error?.config?.data
      );

      console.error("=================================");

      const backendMessage =
        error?.response?.data?.message;

      alert(
        backendMessage ||
          "Unable to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (cartLoading) {
    return (
      <>
        <Navbar />

        <main className="min-h-[75vh] bg-[#fafafa] flex items-center justify-center">
          <div className="text-center">
            <Loader2
              size={40}
              className="text-red-600 animate-spin mx-auto"
            />

            <p className="mt-4 text-sm font-bold text-gray-500">
              Loading checkout...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================================
  // CHECKOUT PAGE
  // =========================================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fafafa]">

        {/* ===================================================
            HEADER
        =================================================== */}

        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-8">

            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition"
            >
              <ArrowLeft size={17} />

              Back to Cart
            </button>

            <div className="mt-5">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                Almost There
              </p>

              <h1 className="text-3xl md:text-4xl font-black mt-2">
                Checkout
              </h1>

              <p className="text-gray-500 mt-2">
                Enter your delivery details and place your order.
              </p>

            </div>
          </div>
        </section>

        {/* ===================================================
            CHECKOUT
        =================================================== */}

        <section className="max-w-7xl mx-auto px-6 py-10">

          <form onSubmit={handlePlaceOrder}>

            <div className="grid lg:grid-cols-[1fr_380px] gap-7">

              {/* =================================================
                  LEFT
              ================================================= */}

              <div className="space-y-6">

                {/* ===============================================
                    DELIVERY DETAILS
                =============================================== */}

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                  <div className="p-6 border-b border-gray-100">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                        <MapPin size={21} />
                      </div>

                      <div>

                        <h2 className="text-xl font-black">
                          Delivery Details
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                          Your saved profile details are automatically filled.
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="p-6 grid md:grid-cols-2 gap-5">

                    {/* =========================================
                        NAME
                    ========================================= */}

                    <div>

                      <label className="text-sm font-bold text-gray-700">
                        Full Name
                      </label>

                      <div className="relative mt-2">

                        <User
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          autoComplete="name"
                          className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        />

                      </div>

                    </div>

                    {/* =========================================
                        PHONE
                    ========================================= */}

                    <div>

                      <label className="text-sm font-bold text-gray-700">
                        Phone Number
                      </label>

                      <div className="relative mt-2">

                        <Phone
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          maxLength={10}
                          inputMode="numeric"
                          autoComplete="tel"
                          placeholder="10 digit mobile number"
                          className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        />

                      </div>

                    </div>

                    {/* =========================================
                        ADDRESS
                    ========================================= */}

                    <div className="md:col-span-2">

                      <label className="text-sm font-bold text-gray-700">
                        Delivery Address
                      </label>

                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows={3}
                        autoComplete="street-address"
                        placeholder="House / Flat / Street / Area"
                        className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3.5 outline-none resize-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      />

                    </div>

                    {/* =========================================
                        CITY
                    ========================================= */}

                    <div>

                      <label className="text-sm font-bold text-gray-700">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        autoComplete="address-level2"
                        placeholder="Enter city"
                        className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      />

                    </div>

                    {/* =========================================
                        PINCODE
                    ========================================= */}

                    <div>

                      <label className="text-sm font-bold text-gray-700">
                        Pincode
                      </label>

                      <input
                        type="text"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        maxLength={6}
                        inputMode="numeric"
                        autoComplete="postal-code"
                        placeholder="6 digit pincode"
                        className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      />

                    </div>

                  </div>

                </div>

                {/* ===============================================
                    PAYMENT
                =============================================== */}

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                  <div className="p-6 border-b border-gray-100">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                        <CreditCard size={21} />
                      </div>

                      <div>

                        <h2 className="text-xl font-black">
                          Payment Method
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                          Choose how you want to pay.
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="p-6 space-y-3">

                    {/* =========================================
                        COD
                    ========================================= */}

                    <label
                      className={`flex items-center gap-4 border rounded-2xl p-4 cursor-pointer transition ${
                        form.paymentMethod === "COD"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >

                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={
                          form.paymentMethod === "COD"
                        }
                        onChange={handleChange}
                        className="w-5 h-5 accent-red-600"
                      />

                      <div>

                        <p className="font-black">
                          Cash on Delivery
                        </p>

                        <p className="text-sm text-gray-500">
                          Pay when your order arrives.
                        </p>

                      </div>

                    </label>

                    {/* =========================================
                        ONLINE
                    ========================================= */}

                    <label
                      className={`flex items-center gap-4 border rounded-2xl p-4 cursor-pointer transition ${
                        form.paymentMethod === "ONLINE"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >

                      <input
                        type="radio"
                        name="paymentMethod"
                        value="ONLINE"
                        checked={
                          form.paymentMethod === "ONLINE"
                        }
                        onChange={handleChange}
                        className="w-5 h-5 accent-red-600"
                      />

                      <div>

                        <p className="font-black">
                          Online Payment
                        </p>

                        <p className="text-sm text-gray-500">
                          Pay securely online.
                        </p>

                      </div>

                    </label>

                  </div>

                </div>

              </div>

              {/* =================================================
                  RIGHT - ORDER SUMMARY
              ================================================= */}

              <div className="lg:sticky lg:top-6 h-fit">

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                  {/* TITLE */}

                  <div className="p-6 border-b border-gray-100">

                    <div className="flex items-center justify-between">

                      <h2 className="text-xl font-black">
                        Order Summary
                      </h2>

                      <span className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-full">
                        {totalItems}{" "}
                        {totalItems === 1
                          ? "item"
                          : "items"}
                      </span>

                    </div>

                  </div>

                  {/* ITEMS */}

                  <div className="p-6 space-y-4 max-h-[350px] overflow-y-auto">

                    {cart.map((item, index) => {

                      const quantity =
                        Number(item.quantity) || 1;

                      const price =
                        Number(item.price) || 0;

                      return (
                        <div
                          key={
                            item._id ||
                            item.id ||
                            index
                          }
                          className="flex gap-3"
                        >

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400";
                            }}
                          />

                          <div className="flex-1 min-w-0">

                            <p className="font-bold truncate">
                              {item.name || "Pizza"}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              Qty: {quantity}
                            </p>

                          </div>

                          <p className="font-black">
                            ₹{price * quantity}
                          </p>

                        </div>
                      );
                    })}

                  </div>

                  {/* PRICE */}

                  <div className="p-6 border-t border-gray-100 space-y-4">

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-500">
                        Subtotal
                      </span>

                      <span className="font-bold">
                        ₹{subtotal}
                      </span>

                    </div>

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-500">
                        Delivery Fee
                      </span>

                      <span
                        className={
                          deliveryFee === 0
                            ? "font-bold text-green-600"
                            : "font-bold"
                        }
                      >
                        {deliveryFee === 0
                          ? "FREE"
                          : `₹${deliveryFee}`}
                      </span>

                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-sm">

                        <span className="text-green-600">
                          Discount
                        </span>

                        <span className="font-bold text-green-600">
                          -₹{discount}
                        </span>

                      </div>
                    )}

                    <div className="border-t border-dashed pt-4">

                      <div className="flex justify-between items-center">

                        <span className="font-black text-lg">
                          Total
                        </span>

                        <span className="font-black text-2xl text-red-600">
                          ₹{total}
                        </span>

                      </div>

                    </div>

                    {/* PLACE ORDER */}

                    <button
                      type="submit"
                      disabled={
                        loading ||
                        cart.length === 0
                      }
                      className="w-full bg-red-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-lg shadow-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >

                      {loading ? (
                        <>
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />

                          Placing Order...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={19} />

                          Place Order
                        </>
                      )}

                    </button>

                    {/* SECURITY */}

                    <div className="flex gap-3 bg-gray-50 rounded-2xl p-4">

                      <ShieldCheck
                        size={20}
                        className="text-green-600 shrink-0"
                      />

                      <p className="text-xs text-gray-500 leading-relaxed">
                        Your order information is
                        securely processed and
                        protected.
                      </p>

                    </div>

                  </div>

                </div>

                {/* FREE DELIVERY */}

                {subtotal > 0 &&
                  subtotal < 499 && (
                    <div className="mt-4 bg-orange-50 border border-orange-100 rounded-2xl p-4">

                      <p className="text-sm font-bold text-orange-700">
                        Add ₹{499 - subtotal} more
                        for FREE delivery 🚚
                      </p>

                    </div>
                  )}

              </div>

            </div>

          </form>

        </section>

      </main>

      <Footer />
    </>
  );
}