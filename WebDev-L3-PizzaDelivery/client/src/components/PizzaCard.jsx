import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Plus,
  Star,
} from "lucide-react";

export default function PizzaCard({
  pizza,
  onAddToCart,
}) {
  const [favorite, setFavorite] = useState(false);

  const handleAddToCart = () => {
    if (!pizza) return;

    const normalizedPizza = {
      ...pizza,
      id: String(pizza._id || pizza.id),
      price: Number(pizza.price) || 0,
      oldPrice:
        pizza.oldPrice !== null &&
        pizza.oldPrice !== undefined
          ? Number(pizza.oldPrice)
          : null,
    };

    onAddToCart(normalizedPizza);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">

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

        {pizza?.tag && (
          <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black shadow-md">
            {pizza.tag}
          </span>
        )}

        <button
          type="button"
          onClick={() =>
            setFavorite((prev) => !prev)
          }
          className="absolute top-4 right-4 w-10 h-10 bg-white/95 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition"
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

        <p className="text-gray-500 text-sm mt-2 leading-6 line-clamp-2">
          {pizza?.description ||
            "Delicious freshly prepared pizza."}
        </p>

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

        <div className="grid grid-cols-[1fr_auto] gap-2 mt-5">

          <Link
            to="/pizza-builder"
            state={{ pizza }}
            className="bg-gray-900 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-600 transition"
          >
            Customize
            <ArrowRight size={16} />
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition"
            title="Add to Cart"
          >
            <Plus size={20} />
          </button>

        </div>

      </div>
    </div>
  );
}