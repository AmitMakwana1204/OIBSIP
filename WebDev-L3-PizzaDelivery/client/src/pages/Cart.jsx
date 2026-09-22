import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  ShieldCheck,
  Tag,
  Pizza,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderSuccess from "./OrderSuccess";

const CART_KEY = "pizzaCart";

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // =========================================================
  // LOAD CART
  // =========================================================

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);

      if (!savedCart) {
        setCart([]);
        setLoaded(true);
        return;
      }

      const parsedCart = JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        const normalizedCart = parsedCart
          .map((item) => ({
            ...item,

            // MongoDB _id OR frontend id
            id: String(item.id || item._id || ""),

            name: item.name || "Pizza",

            category: item.category || "Pizza",

            description: item.description || "",

            image:
              item.image ||
              "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",

            price: Number(item.price) || 0,

            oldPrice:
              item.oldPrice !== null &&
              item.oldPrice !== undefined &&
              item.oldPrice !== ""
                ? Number(item.oldPrice)
                : null,

            quantity:
              Number(item.quantity) > 0
                ? Number(item.quantity)
                : 1,
          }))
          .filter((item) => item.id);

        setCart(normalizedCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Cart loading error:", error);
      setCart([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  // =========================================================
  // SAVE CART
  // =========================================================

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    // Optional event for Navbar/cart badge
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart, loaded]);

  // =========================================================
  // GET ITEM ID
  // =========================================================

  const getItemId = (item) => {
    return String(item.id || item._id || "");
  };

  // =========================================================
  // UPDATE QUANTITY
  // =========================================================

  const updateQuantity = (id, change) => {
    const targetId = String(id);

    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (getItemId(item) !== targetId) {
            return item;
          }

          const newQuantity =
            Number(item.quantity || 1) + change;

          return {
            ...item,
            quantity: newQuantity,
          };
        })
        .filter((item) => Number(item.quantity) > 0)
    );
  };

  // =========================================================
  // REMOVE ITEM
  // =========================================================

  const removeItem = (id) => {
    const targetId = String(id);

    setCart((currentCart) =>
      currentCart.filter(
        (item) => getItemId(item) !== targetId
      )
    );
  };

  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_KEY);

    window.dispatchEvent(new Event("cartUpdated"));
  };

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
  // DELIVERY
  // =========================================================

  const deliveryFee =
    subtotal === 0
      ? 0
      : subtotal >= 499
      ? 0
      : 40;

  // =========================================================
  // DISCOUNT
  // =========================================================

  const discount =
    subtotal >= 999
      ? Math.round(subtotal * 0.2)
      : 0;

  // =========================================================
  // TOTAL
  // =========================================================

  const total =
    subtotal +
    deliveryFee -
    discount;

  // =========================================================
  // TOTAL ITEMS
  // =========================================================

  const totalItems = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + (Number(item.quantity) || 1),
      0
    );
  }, [cart]);

  // =========================================================
  // CHECKOUT
  // =========================================================

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }

    navigate("/checkout");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (!loaded) {
    return (
      <>
        <Navbar />

        <main className="min-h-[75vh] bg-[#fafafa] flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 text-red-600 flex items-center justify-center animate-pulse">
              <ShoppingBag size={26} />
            </div>

            <p className="mt-4 text-sm font-bold text-gray-500">
              Loading your cart...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================================
  // EMPTY CART
  // =========================================================

  if (cart.length === 0) {
    return (
      <>
        <Navbar />

        <main className="min-h-[75vh] bg-[#fafafa] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <ShoppingBag size={42} />
            </div>

            <h1 className="text-3xl font-black mt-6">
              Your cart is empty
            </h1>

            <p className="text-gray-500 mt-3 leading-relaxed">
              Looks like you haven't added any delicious
              pizza yet. Explore our menu and build your
              perfect order.
            </p>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 mt-7 bg-red-600 text-white px-6 py-3.5 rounded-xl font-black hover:bg-red-700 transition shadow-lg shadow-red-200"
            >
              <Pizza size={18} />
              Explore Pizzas
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================================
  // CART PAGE
  // =========================================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fafafa]">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-8">

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition"
            >
              <ArrowLeft size={17} />
              Continue Shopping
            </Link>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-5">

              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                  Your Order
                </p>

                <h1 className="text-3xl md:text-4xl font-black mt-2">
                  Shopping Cart 🛒
                </h1>

                <p className="text-gray-500 mt-2">
                  {totalItems}{" "}
                  {totalItems === 1 ? "item" : "items"} in
                  your cart
                </p>
              </div>

              <button
                type="button"
                onClick={clearCart}
                className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition"
              >
                <Trash2 size={17} />
                Clear Cart
              </button>

            </div>
          </div>
        </section>

        {/* =====================================================
            MAIN
        ===================================================== */}

        <section className="max-w-7xl mx-auto px-6 py-10">

          <div className="grid lg:grid-cols-[1fr_380px] gap-7">

            {/* =================================================
                CART ITEMS
            ================================================= */}

            <div className="space-y-4">

              {cart.map((item) => {
                const itemId = getItemId(item);

                const itemPrice =
                  Number(item.price) || 0;

                const quantity =
                  Number(item.quantity) || 1;

                const itemTotal =
                  itemPrice * quantity;

                return (
                  <div
                    key={itemId}
                    className="bg-white rounded-3xl border border-gray-100 p-4 md:p-5 shadow-sm hover:shadow-md transition"
                  >

                    <div className="flex gap-4">

                      {/* IMAGE */}

                      <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800";
                          }}
                        />
                      </div>

                      {/* DETAILS */}

                      <div className="flex-1 min-w-0">

                        <div className="flex justify-between gap-3">

                          <div className="min-w-0">
                            <p className="text-xs font-bold text-red-600 uppercase">
                              {item.category}
                            </p>

                            <h2 className="text-lg md:text-xl font-black mt-1 truncate">
                              {item.name}
                            </h2>
                          </div>

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(itemId)
                            }
                            className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition shrink-0"
                            title="Remove item"
                          >
                            <X size={17} />
                          </button>

                        </div>

                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        {/* PRICE + QUANTITY */}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">

                          <div>
                            <span className="text-lg font-black">
                              ₹{itemPrice}
                            </span>

                            {item.oldPrice &&
                              Number(item.oldPrice) >
                                itemPrice && (
                                <span className="text-xs text-gray-400 line-through ml-2">
                                  ₹{Number(item.oldPrice)}
                                </span>
                              )}
                          </div>

                          {/* QUANTITY */}

                          <div className="flex items-center gap-3">

                            <span className="text-xs font-bold text-gray-400">
                              Quantity
                            </span>

                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    itemId,
                                    -1
                                  )
                                }
                                className="w-9 h-9 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition"
                              >
                                <Minus size={15} />
                              </button>

                              <span className="w-10 text-center font-black text-sm">
                                {quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    itemId,
                                    1
                                  )
                                }
                                className="w-9 h-9 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition"
                              >
                                <Plus size={15} />
                              </button>

                            </div>
                          </div>
                        </div>

                        {/* ITEM TOTAL */}

                        <div className="mt-3 text-right">
                          <span className="text-sm text-gray-400">
                            Item Total
                          </span>

                          <span className="font-black ml-2">
                            ₹{itemTotal}
                          </span>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* =================================================
                ORDER SUMMARY
            ================================================= */}

            <div className="lg:sticky lg:top-6 h-fit">

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                {/* TITLE */}

                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-black">
                    Order Summary
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Review your order before checkout.
                  </p>
                </div>

                {/* DISCOUNT */}

                {discount > 0 && (
                  <div className="mx-6 mt-5 p-4 bg-green-50 rounded-2xl flex gap-3">

                    <div className="text-green-600">
                      <Tag size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-black text-green-700">
                        20% discount applied
                      </p>

                      <p className="text-xs text-green-600 mt-1">
                        You saved ₹{discount}
                      </p>
                    </div>

                  </div>
                )}

                {/* PRICE DETAILS */}

                <div className="p-6 space-y-4">

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

                  {/* CHECKOUT */}

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full bg-red-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-lg shadow-red-200"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </button>

                  {/* DELIVERY */}

                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">

                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-600">
                      <Truck size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        Fast Delivery
                      </p>

                      <p className="text-xs text-gray-500">
                        Estimated 25–30 minutes
                      </p>
                    </div>

                  </div>

                  {/* SECURE */}

                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">

                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600">
                      <ShieldCheck size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        Secure Checkout
                      </p>

                      <p className="text-xs text-gray-500">
                        Your payment is protected
                      </p>
                    </div>

                  </div>

                </div>
              </div>

              {/* FREE DELIVERY MESSAGE */}

              {subtotal < 499 && (
                <div className="mt-4 bg-orange-50 border border-orange-100 rounded-2xl p-4">
                  <p className="text-sm font-bold text-orange-700">
                    Add ₹{499 - subtotal} more for FREE
                    delivery 🚚
                  </p>
                </div>
              )}

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}