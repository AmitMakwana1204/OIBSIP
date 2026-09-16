import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  Truck,
  Star,
  Flame,
  ShoppingBag,
  ChefHat,
  BadgePercent,
  Heart,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const pizzas = [
  {
    name: "Margherita",
    description: "Classic tomato sauce, mozzarella & fresh basil",
    price: 199,
    oldPrice: 249,
    tag: "BEST SELLER",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
  },
  {
    name: "Farmhouse",
    description: "Loaded with fresh vegetables & extra cheese",
    price: 299,
    oldPrice: 349,
    tag: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
  },
  {
    name: "Pepperoni",
    description: "Spicy pepperoni, mozzarella & signature sauce",
    price: 349,
    oldPrice: 399,
    tag: "HOT",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800",
  },
];

const categories = [
  {
    name: "Classic Pizza",
    emoji: "🍕",
    text: "Timeless favorites",
  },
  {
    name: "Veggie Pizza",
    emoji: "🥦",
    text: "Fresh & flavorful",
  },
  {
    name: "Cheesy Pizza",
    emoji: "🧀",
    text: "Extra cheesy goodness",
  },
  {
    name: "Spicy Pizza",
    emoji: "🌶️",
    text: "For spice lovers",
  },
];

const reviews = [
  {
    name: "Rahul Patel",
    review:
      "Amazing taste and super fast delivery. The pizza arrived hot and fresh!",
  },
  {
    name: "Priya Shah",
    review:
      "Loved the customization options. PizzaHub is now my go-to pizza place.",
  },
  {
    name: "Dev Mehta",
    review:
      "Great quality, generous toppings and really good prices. Highly recommended!",
  },
];

export default function Home() {
  return (
    <div className="bg-white text-gray-900">

      <Navbar />

      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#fff7ed]">

        {/* Background decorations */}
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
              Build your dream pizza with your favorite crust,
              sauce, cheese and toppings. Freshly prepared and
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


              <Link
                to="/dashboard"
                className="px-7 py-4 bg-white border border-gray-200 text-gray-800 rounded-2xl font-bold hover:bg-gray-50 transition"
              >
                Explore Menu
              </Link>

            </div>


            {/* TRUST STATS */}
            <div className="flex flex-wrap gap-7 mt-10">

              <div>
                <p className="text-2xl font-black">
                  4.9<span className="text-red-600">★</span>
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


          {/* RIGHT - HERO IMAGE */}
          <div className="relative">

            <div className="absolute inset-0 bg-red-500/15 blur-3xl rounded-full" />

            <div className="relative">

              <img
                src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=1000"
                alt="Fresh Pizza"
                className="w-full rounded-[2.5rem] shadow-2xl rotate-2 hover:rotate-0 hover:scale-[1.02] transition duration-500"
              />


              {/* FLOATING CARD */}
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


              {/* RATING CARD */}
              <div className="absolute top-6 right-5 sm:right-8 bg-white rounded-2xl shadow-xl px-4 py-3">

                <div className="flex items-center gap-1 text-yellow-500">

                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />
                  <Star size={15} fill="currentColor" />

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
          CATEGORIES
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center mb-10">

          <p className="text-red-600 font-black text-sm uppercase tracking-[0.2em]">
            What are you craving?
          </p>

          <h2 className="text-3xl md:text-4xl font-black mt-2">
            Explore Our Pizzas
          </h2>

        </div>


        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

          {categories.map((category) => (

            <Link
              to="/dashboard"
              key={category.name}
              className="group bg-[#fff7ed] border border-orange-100 rounded-3xl p-6 text-center hover:bg-red-600 hover:text-white transition duration-300"
            >

              <div className="text-5xl group-hover:scale-110 transition duration-300">
                {category.emoji}
              </div>

              <h3 className="font-black mt-4">
                {category.name}
              </h3>

              <p className="text-xs text-gray-500 group-hover:text-red-100 mt-1">
                {category.text}
              </p>

            </Link>

          ))}

        </div>

      </section>


      {/* =====================================================
          POPULAR PIZZAS
      ====================================================== */}
      <section className="bg-[#fffaf5] py-16">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex items-end justify-between mb-9">

            <div>

              <p className="text-red-600 font-black text-sm uppercase tracking-[0.2em]">
                Customer Favorites
              </p>

              <h2 className="text-3xl md:text-4xl font-black mt-2">
                Popular Pizzas 🍕
              </h2>

            </div>


            <Link
              to="/dashboard"
              className="hidden sm:flex items-center gap-2 text-red-600 font-bold"
            >
              View All
              <ArrowRight size={17} />
            </Link>

          </div>


          <div className="grid md:grid-cols-3 gap-7">

            {pizzas.map((pizza) => (

              <div
                key={pizza.name}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
              >

                {/* IMAGE */}
                <div className="h-64 relative overflow-hidden">

                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />


                  <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black">
                    {pizza.tag}
                  </span>


                  <button
                    type="button"
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:text-red-600 transition"
                  >
                    <Heart size={18} />
                  </button>

                </div>


                {/* CONTENT */}
                <div className="p-6">

                  <div className="flex items-center gap-1 text-yellow-500">

                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />

                    <span className="text-xs text-gray-400 ml-1">
                      4.9
                    </span>

                  </div>


                  <h3 className="text-xl font-black mt-2">
                    {pizza.name}
                  </h3>


                  <p className="text-gray-500 text-sm mt-2 leading-6">
                    {pizza.description}
                  </p>


                  <div className="flex items-center justify-between mt-5">

                    <div>

                      <span className="text-xl font-black">
                        ₹{pizza.price}
                      </span>

                      <span className="text-sm text-gray-400 line-through ml-2">
                        ₹{pizza.oldPrice}
                      </span>

                    </div>


                    <Link
                      to="/pizza-builder"
                      className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-black hover:bg-red-700 transition"
                    >
                      Order Now
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

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
            icon={<ChefHat />}
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
      <section className="bg-red-600 py-16  text-white">

        <div className="max-w-7xl mx-auto px-6">

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
              icon={<ChefHat />}
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

        </div>

      </section>


      {/* =====================================================
          REVIEWS
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center mb-10">

          <p className="text-red-600 font-black text-sm uppercase tracking-[0.2em]">
            Happy Customers
          </p>

          <h2 className="text-3xl md:text-4xl font-black mt-2">
            What Our Customers Say
          </h2>

        </div>


        <div className="grid md:grid-cols-3 gap-6">

          {reviews.map((review) => (

            <div
              key={review.name}
              className="bg-gray-50 border border-gray-100 rounded-3xl p-6"
            >

              <div className="flex items-center gap-1 text-yellow-500">

                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill="currentColor"
                  />
                ))}

              </div>


              <p className="text-gray-600 leading-7 mt-5">
                “{review.review}”
              </p>


              <div className="flex items-center gap-3 mt-6">

                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-black">
                  {review.name.charAt(0)}
                </div>

                <div>

                  <p className="font-black text-sm">
                    {review.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    Verified Customer
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section className="px-6 pb-16">

        <div className="max-w-7xl mx-auto bg-gradient-to-r from-red-600 to-orange-500 rounded-[2rem] p-8 md:p-14 text-white relative overflow-hidden">

          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

            <div>

              <p className="text-orange-100 font-bold">
                READY TO EAT?
              </p>

              <h2 className="text-3xl md:text-5xl font-black mt-2">
                Your next favorite pizza
                <br className="hidden md:block" />
                is waiting. 🍕
              </h2>

              <p className="text-red-100 mt-4 max-w-lg">
                Choose your favorite pizza or build one exactly
                the way you like it.
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

function Feature({ icon, title, text }) {
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

function Step({ number, icon, title, text }) {
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