import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
  Flame,
  ShoppingBag,
  BadgePercent,
  Heart,
  Search,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PizzaCard from "../components/PizzaCard";
import api from "../services/api";

const CART_KEY = "pizzaCart";

const categories = [
  "All",
  "Classic",
  "Veg",
  "Loaded",
  "Spicy",
  "Cheesy",
  "Mexican",
];

export default function Home() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // =========================================================
  // CART
  // =========================================================

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

  // =========================================================
  // FETCH PIZZAS FROM MONGODB
  // =========================================================

  const fetchPizzas = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/pizzas");

      setPizzas(
        Array.isArray(data?.pizzas)
          ? data.pizzas
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error("Home pizza fetch error:", error);

      setError(
        "Unable to load menu. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  // =========================================================
  // SAVE CART
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  }, [cart]);

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = (pizza) => {
    try {
      if (!pizza) {
        return;
      }

      const pizzaId = String(
        pizza._id || pizza.id || ""
      );

      if (!pizzaId) {
        console.error("Pizza ID missing:", pizza);
        return;
      }

      setCart((currentCart) => {
        const existingIndex =
          currentCart.findIndex(
            (item) =>
              String(
                item.id || item._id || ""
              ) === pizzaId
          );

        // Existing pizza
        if (existingIndex !== -1) {
          return currentCart.map(
            (item, index) => {
              if (index !== existingIndex) {
                return item;
              }

              return {
                ...item,
                id: pizzaId,
                _id: pizzaId,
                quantity:
                  Number(item.quantity || 1) + 1,
              };
            }
          );
        }

        // New pizza
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
    } catch (error) {
      console.error(
        "Home add to cart error:",
        error
      );
    }
  };

  // =========================================================
  // FILTER MENU
  // =========================================================

  const filteredPizzas = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return pizzas.filter((pizza) => {
      const name =
        pizza.name?.toLowerCase() || "";

      const description =
        pizza.description?.toLowerCase() || "";

      const category =
        pizza.category?.toLowerCase() || "";

      const selectedCategory =
        activeCategory.toLowerCase();

      const matchesCategory =
        activeCategory === "All" ||
        category === selectedCategory;

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        description.includes(searchText) ||
        category.includes(searchText);

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

  // =========================================================
  // CART INFO
  // =========================================================

  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        (Number(item.quantity) || 0),
      0
    );
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        (Number(item.price) || 0) *
          (Number(item.quantity) || 0),
      0
    );
  }, [cart]);

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="bg-white text-gray-900">

      <Navbar />

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#fff7ed]">

        <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-60" />

        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-70" />

        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center relative z-10">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-black mb-6">
              <Flame size={17} />
              Fresh • Hot • Delicious
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.02] tracking-tight">

              Craving
              <br />

              <span className="text-red-600">
                Something Delicious?
              </span>

            </h1>

            <p className="text-gray-600 text-lg mt-6 max-w-xl leading-8">
              Build your dream pizza with your
              favorite crust, sauce, cheese and
              toppings. Freshly prepared and
              delivered hot to your doorstep. 🍕
            </p>

            {/* OFFER */}

            <div className="mt-6 inline-flex items-center gap-3 bg-white border border-orange-200 rounded-2xl px-4 py-3 shadow-sm">

              <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center">
                <BadgePercent size={21} />
              </div>

              <div>
                <p className="font-black text-gray-900 text-sm">
                  Get 20% OFF
                </p>

                <p className="text-xs text-gray-500">
                  On your first order
                </p>
              </div>

            </div>

            {/* BUTTONS */}

            <div className="flex flex-wrap gap-4 mt-8">

              <Link
                to="/pizza-builder"
                className="group px-7 py-4 bg-red-600 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-red-700 hover:-translate-y-0.5 transition shadow-xl shadow-red-200"
              >
                Build Your Pizza

                <ArrowRight
                  size={19}
                  className="group-hover:translate-x-1 transition"
                />
              </Link>

              <a
                href="#menu"
                className="px-7 py-4 bg-white border border-gray-200 text-gray-800 rounded-2xl font-bold hover:bg-gray-50 transition"
              >
                Explore Menu
              </a>

            </div>

            {/* STATS */}

            <div className="flex flex-wrap gap-7 mt-10">

              <div>
                <p className="text-2xl font-black">
                  4.9
                  <span className="text-red-600">
                    ★
                  </span>
                </p>

                <p className="text-xs text-gray-500">
                  Customer Rating
                </p>
              </div>

              <div>
                <p className="text-2xl font-black">
                  20K+
                </p>

                <p className="text-xs text-gray-500">
                  Happy Customers
                </p>
              </div>

              <div>
                <p className="text-2xl font-black">
                  30 Min
                </p>

                <p className="text-xs text-gray-500">
                  Fast Delivery
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT IMAGE */}

          <div className="relative">

            <div className="absolute inset-0 bg-red-500/15 blur-3xl rounded-full" />

            <div className="relative">

              <img
                src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=1000"
                alt="Fresh Pizza"
                className="w-full rounded-[2.5rem] shadow-2xl rotate-2 hover:rotate-0 hover:scale-[1.02] transition duration-500"
              />

              <div className="absolute bottom-6 left-5 sm:left-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">

                <div className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                  <Truck size={21} />
                </div>

                <div>
                  <p className="font-black text-sm">
                    Fast Delivery
                  </p>

                  <p className="text-xs text-gray-500">
                    Hot & fresh at your door
                  </p>
                </div>

              </div>

              <div className="absolute top-6 right-5 sm:right-8 bg-white rounded-2xl shadow-xl px-4 py-3">

                <div className="flex items-center gap-1 text-yellow-500">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        size={15}
                        fill="currentColor"
                      />
                    )
                  )}

                </div>

                <p className="text-xs font-bold mt-1">
                  4.9/5 Rating
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CART SUMMARY
      ====================================================== */}

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

      {/* =====================================================
          MENU SECTION
      ====================================================== */}

      <section
        id="menu"
        className="max-w-7xl mx-auto px-6 py-16"
      >

        {/* HEADER */}

        <div className="text-center mb-10">

          <p className="text-red-600 font-black text-sm uppercase tracking-[0.2em]">
            Our Menu
          </p>

          <h2 className="text-3xl md:text-4xl font-black mt-2">
            Fresh Pizzas, Made For You 🍕
          </h2>

          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Explore our delicious pizza collection
            directly from our live menu.
          </p>

        </div>

        {/* SEARCH */}

        <div className="max-w-2xl mx-auto">

          <div className="relative">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search pizza..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
            />

          </div>

        </div>

        {/* CATEGORIES */}

        <div className="flex gap-2 overflow-x-auto py-7 justify-center scrollbar-hide">

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

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading && (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (

                <div
                  key={item}
                  className="h-[430px] bg-gray-200 rounded-3xl animate-pulse"
                />

              )
            )}

          </div>

        )}

        {/* =====================================================
            ERROR
        ====================================================== */}

        {!loading && error && (

          <div className="bg-white border border-red-100 rounded-3xl py-16 text-center">

            <div className="text-5xl">
              ⚠️
            </div>

            <h3 className="text-xl font-black mt-4 text-red-600">
              Unable to load menu
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchPizzas}
              className="mt-5 bg-red-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-red-700 transition"
            >
              Try Again
            </button>

          </div>

        )}

        {/* =====================================================
            PIZZA DATA FROM DATABASE
        ====================================================== */}

        {!loading &&
          !error &&
          filteredPizzas.length > 0 && (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

              {filteredPizzas.map((pizza) => (

                <PizzaCard
                  key={
                    pizza._id ||
                    pizza.id
                  }
                  pizza={pizza}
                  onAddToCart={
                    handleAddToCart
                  }
                />

              ))}

            </div>

          )}

        {/* =====================================================
            NO DATA
        ====================================================== */}

        {!loading &&
          !error &&
          filteredPizzas.length === 0 && (

            <div className="bg-gray-50 border border-gray-100 rounded-3xl py-16 text-center">

              <div className="text-5xl">
                🍕
              </div>

              <h3 className="text-xl font-black mt-4">
                No pizza found
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Try another pizza name or category.
              </p>

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

            </div>

          )}

        {/* VIEW FULL MENU */}

        {!loading &&
          pizzas.length > 0 && (

            <div className="text-center mt-10">

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition shadow-lg shadow-red-200"
              >
                View Full Menu
                <ArrowRight size={18} />
              </Link>

            </div>

          )}

      </section>

      {/* =====================================================
          WHY PIZZAHUB
      ====================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center mb-11">

          <p className="text-red-600 font-black text-sm uppercase tracking-[0.2em]">
            Why PizzaHub?
          </p>

          <h2 className="text-3xl md:text-4xl font-black mt-2">
            Made for Pizza Lovers
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <Feature
            icon={<Flame />}
            title="Freshly Prepared"
            text="Every pizza is freshly prepared with quality ingredients and delicious flavors."
          />

          <Feature
            icon={<Truck />}
            title="Lightning Fast Delivery"
            text="We make sure your pizza reaches you hot, fresh and ready to enjoy."
          />

          <Feature
            icon={<ShieldCheck />}
            title="Safe & Secure"
            text="Enjoy a smooth and secure ordering and payment experience."
          />

        </div>

      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="max-w-7xl mx-auto bg-gradient-to-r from-red-600 to-orange-500 rounded-[2rem] p-8 md:p-14 text-white relative overflow-hidden">

        <div className="text-center mb-12">

          <p className="text-orange-200 font-black text-sm uppercase tracking-[0.2em]">
            Simple & Easy
          </p>

          <h2 className="text-3xl md:text-4xl font-black mt-2">
            Order Your Pizza in 3 Steps
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          <Step
            number="01"
            icon={<ShoppingBag />}
            title="Choose Your Pizza"
            text="Pick from our delicious menu or start building your own pizza."
          />

          <Step
            number="02"
            icon={<Flame />}
            title="Customize It"
            text="Choose your crust, sauce, cheese and favorite toppings."
          />

          <Step
            number="03"
            icon={<Truck />}
            title="Enjoy Delivery"
            text="Sit back and enjoy hot, fresh pizza delivered to your doorstep."
          />

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="px-6 py-16">

        <div className="max-w-7xl mx-auto bg-gradient-to-r from-red-600 to-orange-500 rounded-[2rem] p-8 md:p-14 text-white">

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            <div>

              <p className="text-orange-100 font-bold">
                READY TO EAT?
              </p>

              <h2 className="text-3xl md:text-5xl font-black mt-2">
                Your next favorite pizza
                <br />
                is waiting. 🍕
              </h2>

              <p className="text-red-100 mt-4 max-w-lg">
                Choose your favorite pizza or build
                one exactly the way you like it.
              </p>

            </div>

            <Link
              to="/pizza-builder"
              className="shrink-0 px-7 py-4 bg-white text-red-600 rounded-2xl font-black flex items-center gap-2 hover:bg-orange-50 transition shadow-xl"
            >
              Order Now
              <ArrowRight size={19} />
            </Link>

          </div>

        </div>

      </section>

      <Footer />

    </div>
  );
}


/* =========================================================
   FEATURE COMPONENT
========================================================= */

function Feature({
  icon,
  title,
  text,
}) {
  return (
    <div className="p-7 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition">

      <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
        {icon}
      </div>

      <h3 className="font-black text-xl mt-5">
        {title}
      </h3>

      <p className="text-gray-500 mt-2 leading-7">
        {text}
      </p>

    </div>
  );
}


/* =========================================================
   STEP COMPONENT
========================================================= */

function Step({
  number,
  icon,
  title,
  text,
}) {
  return (
    <div className="relative text-center">

      <div className="mx-auto w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
        {icon}
      </div>

      <p className="text-orange-200 text-xs font-black mt-4">
        STEP {number}
      </p>

      <h3 className="text-xl font-black mt-2">
        {title}
      </h3>

      <p className="text-red-100 text-sm leading-6 mt-2 max-w-xs mx-auto">
        {text}
      </p>

    </div>
  );
}