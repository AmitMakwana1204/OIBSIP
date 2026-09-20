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
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PizzaCard from "../components/PizzaCard";

// =========================================================
// API
// =========================================================

const API_URL = "http://localhost:5000/api/pizzas";
const CART_KEY = "pizzaCart";

// =========================================================
// CATEGORIES
// =========================================================

const categories = [
  "All",
  "Classic",
  "Veg",
  "Loaded",
  "Spicy",
  "Cheesy",
  "Mexican",
];

// =========================================================
// DASHBOARD
// =========================================================

export default function Dashboard() {
  // =======================================================
  // SEARCH & CATEGORY
  // =======================================================

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // =======================================================
  // PIZZA STATE
  // =======================================================

  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =======================================================
  // CART STATE
  // =======================================================

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      if (!Array.isArray(parsedCart)) {
        return [];
      }

      return parsedCart.map((item) => ({
        ...item,

        // Always maintain one common ID
        id: String(item.id || item._id || ""),

        quantity:
          Number(item.quantity) > 0
            ? Number(item.quantity)
            : 1,

        price: Number(item.price) || 0,
      }));
    } catch (error) {
      console.error("Cart loading error:", error);
      return [];
    }
  });

  // =======================================================
  // FETCH PIZZAS FROM MONGODB
  // =======================================================

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch pizzas"
          );
        }

        setPizzas(
          Array.isArray(data.pizzas)
            ? data.pizzas
            : []
        );
      } catch (error) {
        console.error("Pizza fetch error:", error);

        setError(
          "Unable to load pizzas. Please make sure the backend server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  // =======================================================
  // SAVE CART
  // =======================================================

  useEffect(() => {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );

    // Notify Navbar / other components
    window.dispatchEvent(
      new Event("cartUpdated")
    );
  }, [cart]);

  // =======================================================
  // ADD TO CART
  // =======================================================

  const handleAddToCart = (pizza) => {
    try {
      if (!pizza) {
        console.error("Pizza data missing");
        return;
      }

      const pizzaId = String(
        pizza._id || pizza.id || ""
      );

      if (!pizzaId) {
        console.error(
          "Pizza ID missing:",
          pizza
        );
        return;
      }

      setCart((currentCart) => {
        const existingPizzaIndex =
          currentCart.findIndex(
            (item) =>
              String(
                item.id || item._id || ""
              ) === pizzaId
          );

        // =================================================
        // EXISTING PIZZA
        // =================================================

        if (existingPizzaIndex !== -1) {
          return currentCart.map(
            (item, index) => {
              if (
                index !== existingPizzaIndex
              ) {
                return item;
              }

              return {
                ...item,

                id: pizzaId,
                _id: pizzaId,

                quantity:
                  Number(item.quantity || 1) + 1,

                price:
                  Number(item.price) || 0,
              };
            }
          );
        }

        // =================================================
        // NEW PIZZA
        // =================================================

        const newCartItem = {
          id: pizzaId,
          _id: pizzaId,

          name: pizza.name || "Pizza",

          category:
            pizza.category || "Pizza",

          description:
            pizza.description || "",

          image:
            pizza.image || "",

          price:
            Number(pizza.price) || 0,

          oldPrice:
            pizza.oldPrice !== null &&
            pizza.oldPrice !== undefined
              ? Number(pizza.oldPrice)
              : null,

          rating:
            Number(pizza.rating) || 0,

          reviews:
            Number(pizza.reviews) || 0,

          quantity: 1,
        };

        return [
          ...currentCart,
          newCartItem,
        ];
      });

      // Small user feedback
      console.log(
        `${pizza.name} added to cart`
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );
    }
  };

  // =======================================================
  // FILTER PIZZAS
  // =======================================================

  const filteredPizzas = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return pizzas.filter((pizza) => {
      const pizzaName =
        pizza.name?.toLowerCase() || "";

      const pizzaDescription =
        pizza.description?.toLowerCase() || "";

      const pizzaCategory =
        pizza.category || "";

      const matchesCategory =
        activeCategory === "All" ||
        pizzaCategory === activeCategory;

      const matchesSearch =
        !searchText ||
        pizzaName.includes(searchText) ||
        pizzaDescription.includes(searchText) ||
        pizzaCategory
          .toLowerCase()
          .includes(searchText);

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    pizzas,
    search,
    activeCategory,
  ]);

  // =======================================================
  // CART COUNT
  // =======================================================

  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        (Number(item.quantity) || 0),
      0
    );
  }, [cart]);

  // =======================================================
  // CART TOTAL
  // =======================================================

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        (Number(item.price) || 0) *
          (Number(item.quantity) || 0),
      0
    );
  }, [cart]);

  // =======================================================
  // UI
  // =======================================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fafafa]">

        {/* =================================================
            WELCOME HEADER
        ================================================== */}

        <section className="bg-white border-b">

          <div className="max-w-7xl mx-auto px-6 py-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div>

                <div className="flex items-center gap-2 text-red-600 text-sm font-black">

                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />

                  GOOD AFTERNOON 👋

                </div>

                <h1 className="text-3xl md:text-4xl font-black mt-2">
                  What are you craving today?
                </h1>

                <p className="text-gray-500 mt-2">
                  Fresh pizza, delicious toppings
                  and fast delivery.
                </p>

              </div>

              <Link
                to="/pizza-builder"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition shadow-lg shadow-red-200"
              >
                <Flame size={19} />

                Build Your Pizza
              </Link>

            </div>

            {/* LOCATION */}

            <div className="flex items-center gap-2 mt-7 text-sm text-gray-500">

              <MapPin
                size={17}
                className="text-red-600"
              />

              <span>
                Delivering to
              </span>

              <button
                type="button"
                className="font-bold text-gray-800 hover:text-red-600"
              >
                Your Location
              </button>

              <span>•</span>

              <span className="text-green-600 font-semibold">
                Delivery available
              </span>

            </div>

          </div>

        </section>

        {/* =================================================
            CART SUMMARY
        ================================================== */}

        {cartCount > 0 && (

          <section className="max-w-7xl mx-auto px-6 pt-7">

            <div className="bg-gray-900 text-white rounded-3xl p-5">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center">

                    <ShoppingBag size={22} />

                  </div>

                  <div>

                    <p className="font-black text-lg">

                      {cartCount}{" "}
                      {cartCount === 1
                        ? "item"
                        : "items"}{" "}
                      in your cart

                    </p>

                    <p className="text-gray-400 text-sm">
                      Cart total: ₹{cartTotal}
                    </p>

                  </div>

                </div>

                <Link
                  to="/cart"
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-black text-center transition"
                >
                  View Cart
                </Link>

              </div>

            </div>

          </section>

        )}

        {/* =================================================
            OFFER BANNER
        ================================================== */}

        <section className="max-w-7xl mx-auto px-6 pt-7">

          <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-6 md:p-8 text-white">

            <div className="absolute -right-20 -top-24 w-72 h-72 bg-white/10 rounded-full" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">

              <div className="flex items-start gap-4">

                <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center shrink-0">

                  <Tag size={25} />

                </div>

                <div>

                  <p className="text-orange-100 text-xs font-black uppercase tracking-widest">
                    Today's Special
                  </p>

                  <h2 className="text-2xl md:text-3xl font-black mt-1">
                    Get 20% OFF your first order 🎉
                  </h2>

                  <p className="text-red-100 text-sm mt-1">
                    Fresh pizza + great deal =
                    perfect combination.
                  </p>

                </div>

              </div>

              <Link
                to="/pizza-builder"
                className="shrink-0 bg-white text-red-600 px-6 py-3 rounded-xl font-black hover:bg-orange-50 transition"
              >
                Order Now
              </Link>

            </div>

          </div>

        </section>

        {/* =================================================
            ACTIVE ORDER
        ================================================== */}

        <section className="max-w-7xl mx-auto px-6 pt-7">

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

              <div>

                <div className="flex items-center gap-2 text-red-600 text-xs font-black">

                  <Clock3 size={16} />

                  ACTIVE ORDER • #PH1024

                </div>

                <h2 className="text-xl md:text-2xl font-black mt-2">
                  Your pizza is being prepared 🍕
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Estimated delivery: 25–30 minutes
                </p>

              </div>

              <div className="flex items-center gap-3">

                <div className="hidden sm:flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2.5 rounded-xl text-sm font-bold">

                  <Truck size={17} />

                  On the way soon

                </div>

                <Link
                  to="/orders"
                  className="bg-gray-900 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition"
                >
                  Track Order

                  <ArrowRight size={17} />
                </Link>

              </div>

            </div>

            {/* PROGRESS */}

            <div className="mt-6">

              <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">

                <span className="text-red-600">
                  Confirmed
                </span>

                <span className="text-red-600">
                  Preparing
                </span>

                <span>
                  Out for Delivery
                </span>

                <span>
                  Delivered
                </span>

              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                <div className="h-full w-[48%] bg-red-600 rounded-full" />

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            MENU
        ================================================== */}

        <section className="max-w-7xl mx-auto px-6 py-10">

          {/* TITLE */}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

            <div>

              <p className="text-xs font-black text-red-600 uppercase tracking-[0.2em]">
                Explore Our Menu
              </p>

              <h2 className="text-3xl md:text-4xl font-black mt-2">
                Find Your Perfect Pizza 🍕
              </h2>

            </div>

            <div className="text-sm text-gray-500">
              {filteredPizzas.length} pizzas available
            </div>

          </div>

          {/* SEARCH */}

          <div className="mt-7 flex flex-col md:flex-row gap-3">

            <div className="relative flex-1">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="pizza-search"
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search for pizza, toppings..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
              />

            </div>

            <button
              type="button"
              className="md:w-auto px-5 py-4 bg-white border border-gray-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-red-500 hover:text-red-600 transition"
            >
              <SlidersHorizontal size={18} />

              Filters
            </button>

          </div>

          {/* CATEGORIES */}

          <div className="flex gap-2 overflow-x-auto py-5 scrollbar-hide">

            {categories.map((category) => (

              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition ${
                  activeCategory === category
                    ? "bg-red-600 text-white shadow-md shadow-red-200"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
                }`}
              >
                {category}
              </button>

            ))}

          </div>

          {/* =================================================
              PIZZAS
          ================================================== */}

          {loading ? (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <div
                    key={item}
                    className="h-96 bg-gray-200 rounded-3xl animate-pulse"
                  />
                )
              )}

            </div>

          ) : error ? (

            <div className="bg-white border border-red-100 rounded-3xl py-16 text-center">

              <div className="text-5xl">
                ⚠️
              </div>

              <h3 className="text-xl font-black mt-4 text-red-600">
                Unable to load pizzas
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-5 bg-red-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-red-700 transition"
              >
                Try Again
              </button>

            </div>

          ) : filteredPizzas.length > 0 ? (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredPizzas.map((pizza) => (

                <PizzaCard
                  key={pizza._id || pizza.id}
                  pizza={pizza}
                  onAddToCart={handleAddToCart}
                />

              ))}

            </div>

          ) : (

            <div className="bg-white border border-gray-100 rounded-3xl py-16 text-center">

              <div className="text-5xl">
                🍕
              </div>

              <h3 className="text-xl font-black mt-4">
                No pizza found
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Try another pizza name or category.
              </p>

              {(search ||
                activeCategory !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All");
                  }}
                  className="mt-5 bg-gray-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-red-600 transition"
                >
                  Clear Filters
                </button>
              )}

            </div>

          )}

        </section>

        {/* =================================================
            BUILD YOUR OWN CTA
        ================================================== */}

        <section className="max-w-7xl mx-auto px-6 pb-16">

          <div className="bg-[#fff7ed] border border-orange-100 rounded-3xl p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-7">

            <div className="flex items-center gap-5">

              <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center text-3xl">
                🍕
              </div>

              <div>

                <p className="text-red-600 text-xs font-black uppercase tracking-widest">
                  Make It Yours
                </p>

                <h2 className="text-2xl md:text-3xl font-black mt-1">
                  Build your own pizza
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Choose your crust, sauce, cheese and
                  toppings.
                </p>

              </div>

            </div>

            <Link
              to="/pizza-builder"
              className="shrink-0 px-6 py-3.5 bg-red-600 text-white rounded-xl font-black flex items-center gap-2 hover:bg-red-700 transition"
            >
              Start Building

              <ArrowRight size={18} />
            </Link>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}