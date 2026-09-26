import { useEffect, useState } from "react";
import {
  Heart,
  Star,
} from "lucide-react";

const WISHLIST_PREFIX = "pizzaWishlist_";

const getWishlistKey = () => {
  try {
    const storedUser = localStorage.getItem("pizzahub_user");

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
    console.error("Wishlist key error:", error);
    return `${WISHLIST_PREFIX}guest`;
  }
};

const getWishlist = () => {
  try {
    const key = getWishlistKey();
    const saved = localStorage.getItem(key);

    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Wishlist load error:", error);
    return [];
  }
};

const saveWishlist = (wishlist) => {
  try {
    const key = getWishlistKey();

    localStorage.setItem(
      key,
      JSON.stringify(wishlist)
    );

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  } catch (error) {
    console.error("Wishlist save error:", error);
  }
};

export default function PizzaCard({
  pizza,
  onAddToCart,
}) {
  const [favorite, setFavorite] = useState(false);

  /*
  =========================================================
  LOAD FAVORITE STATUS
  =========================================================
  */

  useEffect(() => {
    if (!pizza) return;

    const pizzaId = String(
      pizza._id || pizza.id
    );

    const wishlist = getWishlist();

    setFavorite(
      wishlist.some(
        (item) => String(item) === pizzaId
      )
    );
  }, [pizza]);

  /*
  =========================================================
  FAVORITE / WISHLIST
  =========================================================
  */

  const handleFavorite = () => {
    if (!pizza) return;

    const pizzaId = String(
      pizza._id || pizza.id
    );

    if (!pizzaId || pizzaId === "undefined") {
      return;
    }

    const wishlist = getWishlist();

    const alreadyLiked = wishlist.some(
      (item) => String(item) === pizzaId
    );

    let updatedWishlist;

    if (alreadyLiked) {
      updatedWishlist = wishlist.filter(
        (item) => String(item) !== pizzaId
      );

      setFavorite(false);
    } else {
      updatedWishlist = [
        ...wishlist,
        pizzaId,
      ];

      setFavorite(true);
    }

    saveWishlist(updatedWishlist);
  };

  /*
  =========================================================
  ADD TO CART
  =========================================================
  */

  const handleAddToCart = () => {
    if (!pizza || !onAddToCart) return;

    const normalizedPizza = {
      ...pizza,

      id: String(
        pizza._id || pizza.id
      ),

      price:
        Number(pizza.price) || 0,

      oldPrice:
        pizza.oldPrice !== null &&
        pizza.oldPrice !== undefined
          ? Number(pizza.oldPrice)
          : null,
    };

    onAddToCart(normalizedPizza);
  };

  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">

      {/* IMAGE */}

      <div className="relative h-60 overflow-hidden">

        <img
          src={pizza?.image}
          alt={pizza?.name || "Pizza"}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800";
          }}
        />

        {/* TAG */}

        {pizza?.tag && (
          <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black shadow-md">
            {pizza.tag}
          </span>
        )}

        {/* LIKE */}

        <button
          type="button"
          onClick={handleFavorite}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
            favorite
              ? "bg-red-600"
              : "bg-white/95"
          }`}
          aria-label={
            favorite
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <Heart
            size={19}
            className={
              favorite
                ? "fill-white text-white"
                : "text-gray-500"
            }
          />
        </button>

      </div>

      {/* CONTENT */}

      <div className="p-5">

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <span className="text-xs font-bold text-red-600">
              {pizza?.category || "Pizza"}
            </span>

            <h3 className="text-xl font-black mt-1 truncate">
              {pizza?.name || "Pizza"}
            </h3>

          </div>

          {/* PRICE */}

          <div className="text-right shrink-0">

            <p className="text-xl font-black">
              ₹{Number(pizza?.price) || 0}
            </p>

            {pizza?.oldPrice &&
              Number(pizza.oldPrice) >
                Number(pizza.price) && (
                <p className="text-xs text-gray-400 line-through">
                  ₹{Number(pizza.oldPrice)}
                </p>
              )}

          </div>

        </div>

        {/* DESCRIPTION */}

        <p className="text-gray-500 text-sm mt-2 leading-6 line-clamp-2">
          {pizza?.description ||
            "Delicious freshly prepared pizza."}
        </p>

        {/* RATING */}

        <div className="flex items-center gap-2 mt-4">

          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg">

            <Star
              size={13}
              fill="currentColor"
            />

            <span className="text-xs font-black">
              {pizza?.rating ?? 0}
            </span>

          </div>

          <span className="text-xs text-gray-400">
            {pizza?.reviews ?? 0} reviews
          </span>

        </div>

        {/* CART */}

        <div className="mt-5">

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-red-600 text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-md shadow-red-100"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}