import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PizzaCard from "../components/PizzaCard";
import api from "../services/api";

const WISHLIST_PREFIX = "pizzaWishlist_";

const getWishlistKey = () => {
  try {
    const storedUser =
      localStorage.getItem("pizzahub_user");

    if (!storedUser) {
      return `${WISHLIST_PREFIX}guest`;
    }

    const user = JSON.parse(storedUser);

    const userId =
      user?._id ||
      user?.id ||
      user?.email ||
      "guest";

    return `${WISHLIST_PREFIX}${String(userId)}`;
  } catch (error) {
    console.error(
      "Wishlist key error:",
      error
    );

    return `${WISHLIST_PREFIX}guest`;
  }
};

const getWishlistIds = () => {
  try {
    const key = getWishlistKey();

    const saved =
      localStorage.getItem(key);

    return saved
      ? JSON.parse(saved)
      : [];
  } catch (error) {
    console.error(
      "Wishlist load error:",
      error
    );

    return [];
  }
};

export default function Wishlist({
  onAddToCart,
}) {
  const [pizzas, setPizzas] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const wishlistIds =
        getWishlistIds();

      if (
        !Array.isArray(wishlistIds) ||
        wishlistIds.length === 0
      ) {
        setPizzas([]);
        setLoading(false);
        return;
      }

      const { data } = await api.get("/pizzas");

      const allPizzas =
        Array.isArray(data)
          ? data
          : data?.pizzas || [];

      const likedPizzas =
        allPizzas.filter((pizza) => {
          const pizzaId = String(
            pizza._id ||
              pizza.id
          );

          return wishlistIds.some(
            (id) =>
              String(id) === pizzaId
          );
        });

      setPizzas(likedPizzas);
    } catch (err) {
      console.error(
        "Wishlist error:",
        err
      );

      setError(
        err.message ||
          "Unable to load wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();

    const handleWishlistUpdate =
      () => {
        loadWishlist();
      };

    const handleAuthChange =
      () => {
        loadWishlist();
      };

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdate
    );

    window.addEventListener(
      "authChanged",
      handleAuthChange
    );

    window.addEventListener(
      "storage",
      handleWishlistUpdate
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdate
      );

      window.removeEventListener(
        "authChanged",
        handleAuthChange
      );

      window.removeEventListener(
        "storage",
        handleWishlistUpdate
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      {/* HERO */}

      <section className="bg-white border-b border-gray-100">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition mb-4"
              >
                <ArrowLeft size={16} />
                Back to Menu
              </Link>

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">

                  <Heart
                    size={25}
                    className="fill-red-600"
                  />

                </div>

                <div>

                  <h1 className="text-3xl sm:text-4xl font-black text-gray-950">
                    My Wishlist
                  </h1>

                  <p className="text-gray-500 mt-1">
                    Your favorite pizzas are
                    saved here.
                  </p>

                </div>

              </div>

            </div>

            {pizzas.length > 0 && (
              <div className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl font-black text-sm">
                {pizzas.length} Pizza
                {pizzas.length !== 1
                  ? "s"
                  : ""} Saved
              </div>
            )}

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* LOADING */}

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse"
                >

                  <div className="h-60 bg-gray-200" />

                  <div className="p-5 space-y-3">

                    <div className="h-3 bg-gray-200 rounded w-20" />

                    <div className="h-6 bg-gray-200 rounded w-3/4" />

                    <div className="h-4 bg-gray-200 rounded w-full" />

                    <div className="h-12 bg-gray-200 rounded-xl mt-5" />

                  </div>

                </div>
              )
            )}

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="bg-white rounded-3xl border border-red-100 p-10 text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Heart size={28} />
            </div>

            <h2 className="text-xl font-black text-gray-900">
              Something went wrong
            </h2>

            <p className="text-gray-500 mt-2">
              {error}
            </p>

            <button
              type="button"
              onClick={loadWishlist}
              className="mt-5 bg-red-600 text-white px-6 py-3 rounded-xl font-black hover:bg-red-700 transition"
            >
              Try Again
            </button>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          pizzas.length === 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 sm:p-16 text-center">

              <div className="w-20 h-20 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-5">

                <Heart
                  size={36}
                  className="fill-red-100"
                />

              </div>

              <h2 className="text-2xl font-black text-gray-900">
                Your Wishlist is Empty
              </h2>

              <p className="text-gray-500 max-w-md mx-auto mt-2 leading-6">
                You haven't liked any pizzas
                yet. Explore our menu and tap
                the ❤️ button to save your
                favorites.
              </p>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 mt-7 bg-red-600 text-white px-6 py-3.5 rounded-xl font-black hover:bg-red-700 transition shadow-lg shadow-red-600/20"
              >
                <ShoppingBag size={18} />
                Explore Menu
              </Link>

            </div>
          )}

        {/* PIZZAS */}

        {!loading &&
          !error &&
          pizzas.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {pizzas.map((pizza) => (
                <PizzaCard
                  key={
                    pizza._id ||
                    pizza.id
                  }
                  pizza={pizza}
                  onAddToCart={
                    onAddToCart
                  }
                />
              ))}

            </div>
          )}

      </main>

      <Footer />

    </div>
  );
}