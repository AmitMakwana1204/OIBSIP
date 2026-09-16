import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  Flame,
  Search,
  Star,
  Heart,
  MapPin,
  ShoppingBag,
  Tag,
  Truck,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const pizzas = [
  {
    id: 1,
    name: "Margherita",
    category: "Classic",
    price: 199,
    oldPrice: 249,
    rating: 4.8,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
    tag: "BEST SELLER",
    description: "Classic tomato, mozzarella & fresh basil",
  },
  {
    id: 2,
    name: "Farmhouse",
    category: "Veg",
    price: 299,
    oldPrice: 349,
    rating: 4.9,
    reviews: 186,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    tag: "POPULAR",
    description: "Loaded with fresh vegetables & cheese",
  },
  {
    id: 3,
    name: "Veggie Supreme",
    category: "Loaded",
    price: 329,
    oldPrice: 399,
    rating: 4.7,
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=800",
    tag: "LOADED",
    description: "A delicious mix of veggies & premium cheese",
  },
  {
    id: 4,
    name: "Pepperoni",
    category: "Spicy",
    price: 349,
    oldPrice: 399,
    rating: 4.9,
    reviews: 215,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800",
    tag: "HOT",
    description: "Spicy pepperoni with extra mozzarella",
  },
  {
    id: 5,
    name: "Cheese Burst",
    category: "Cheesy",
    price: 379,
    oldPrice: 449,
    rating: 4.8,
    reviews: 167,
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800",
    tag: "CHEESY",
    description: "Rich cheese burst with a crispy crust",
  },
  {
    id: 6,
    name: "Mexican Green Wave",
    category: "Mexican",
    price: 299,
    oldPrice: 349,
    rating: 4.6,
    reviews: 83,
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800",
    tag: "SPICY",
    description: "Mexican flavors with fresh veggies & jalapeños",
  },
];

const categories = [
  "All",
  "Classic",
  "Veg",
  "Loaded",
  "Spicy",
  "Cheesy",
  "Mexican",
];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPizzas = useMemo(() => {
    return pizzas.filter((pizza) => {
      const matchesCategory =
        activeCategory === "All" ||
        pizza.category === activeCategory;

      const matchesSearch =
        pizza.name.toLowerCase().includes(search.toLowerCase()) ||
        pizza.description.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fafafa]">

        {/* =====================================================
            WELCOME HEADER
        ====================================================== */}
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
                  Fresh pizza, delicious toppings and fast delivery.
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

              <button className="font-bold text-gray-800 hover:text-red-600">
                Your Location
              </button>

              <span>•</span>

              <span className="text-green-600 font-semibold">
                Delivery available
              </span>

            </div>

          </div>

        </section>


        {/* =====================================================
            OFFER BANNER
        ====================================================== */}
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
                    Fresh pizza + great deal = perfect combination.
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


        {/* =====================================================
            ACTIVE ORDER
        ====================================================== */}
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


        {/* =====================================================
            MENU
        ====================================================== */}
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
                onChange={(e) => setSearch(e.target.value)}
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
                onClick={() => setActiveCategory(category)}
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


          {/* PIZZAS */}
          {filteredPizzas.length > 0 ? (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredPizzas.map((pizza) => (
                <PizzaCard
                  key={pizza.id}
                  pizza={pizza}
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

            </div>

          )}

        </section>


        {/* =====================================================
            BUILD YOUR OWN CTA
        ====================================================== */}
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
                  Choose your crust, sauce, cheese and toppings.
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


/* =========================================================
   PIZZA CARD
========================================================= */

function PizzaCard({ pizza }) {
  const [favorite, setFavorite] = useState(false);

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">

      {/* IMAGE */}
      <div className="relative h-60 overflow-hidden">

        <img
          src={pizza.image}
          alt={pizza.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />


        {/* TAG */}
        <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black shadow-md">
          {pizza.tag}
        </span>


        {/* FAVORITE */}
        <button
          type="button"
          onClick={() => setFavorite(!favorite)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur rounded-full flex items-center justify-center shadow-md"
        >

          <Heart
            size={19}
            className={
              favorite
                ? "fill-red-600 text-red-600"
                : "text-gray-500"
            }
          />

        </button>

      </div>


      {/* CONTENT */}
      <div className="p-5">

        <div className="flex items-start justify-between gap-3">

          <div>

            <span className="text-xs font-bold text-red-600">
              {pizza.category}
            </span>

            <h3 className="text-xl font-black mt-1">
              {pizza.name}
            </h3>

          </div>


          <div className="text-right shrink-0">

            <p className="text-xl font-black">
              ₹{pizza.price}
            </p>

            <p className="text-xs text-gray-400 line-through">
              ₹{pizza.oldPrice}
            </p>

          </div>

        </div>


        <p className="text-gray-500 text-sm mt-2 leading-6">
          {pizza.description}
        </p>


        {/* RATING */}
        <div className="flex items-center gap-2 mt-4">

          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg">

            <Star
              size={13}
              fill="currentColor"
            />

            <span className="text-xs font-black">
              {pizza.rating}
            </span>

          </div>

          <span className="text-xs text-gray-400">
            {pizza.reviews} reviews
          </span>

        </div>


        {/* ACTIONS */}
        <div className="grid grid-cols-[1fr_auto] gap-2 mt-5">

          <Link
            to="/pizza-builder"
            className="bg-gray-900 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-600 transition"
          >
            Customize
            <ArrowRight size={16} />
          </Link>


          <button
            type="button"
            className="w-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition"
            title="Quick Add"
          >
            <Plus size={20} />
          </button>

        </div>

      </div>

    </div>
  );
}