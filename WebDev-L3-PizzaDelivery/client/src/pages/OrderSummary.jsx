import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  ShoppingBag,
} from "lucide-react";

export default function OrderSummary() {
  const location = useLocation();

  const pizza = location.state?.pizza || {
    base: { name: "Classic Crust", price: 0 },
    sauce: { name: "Classic Tomato", price: 0 },
    cheese: { name: "Mozzarella", price: 0 },
    vegetables: [],
  };

  const total =
    location.state?.total ||
    199 +
      pizza.base.price +
      pizza.sauce.price +
      pizza.cheese.price +
      pizza.vegetables.reduce(
        (sum, item) => sum + item.price,
        0
      );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 py-10">

        <div className="max-w-5xl mx-auto px-6">

          <Link
            to="/pizza-builder"
            className="inline-flex items-center gap-2 text-gray-600 font-semibold mb-7"
          >
            <ArrowLeft size={18} />
            Back to Builder
          </Link>

          <h1 className="text-4xl font-black">
            Order Summary
          </h1>

          <p className="text-gray-500 mt-2">
            Review your pizza before payment.
          </p>

          <div className="grid lg:grid-cols-[1fr_350px] gap-7 mt-8">

            {/* Order */}
            <div className="bg-white rounded-3xl p-7 border border-gray-100">

              <div className="flex items-center gap-3 pb-6 border-b">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                  <ShoppingBag />
                </div>

                <div>
                  <h2 className="font-black text-xl">
                    Custom Pizza
                  </h2>

                  <p className="text-sm text-gray-500">
                    1 × Large Custom Pizza
                  </p>
                </div>
              </div>

              <div className="space-y-5 mt-7">

                <Item
                  title="Pizza Base"
                  value={pizza.base.name}
                  price={pizza.base.price}
                />

                <Item
                  title="Sauce"
                  value={pizza.sauce.name}
                  price={pizza.sauce.price}
                />

                <Item
                  title="Cheese"
                  value={pizza.cheese.name}
                  price={pizza.cheese.price}
                />

                <Item
                  title="Vegetables"
                  value={
                    pizza.vegetables.length
                      ? pizza.vegetables
                          .map((item) => item.name)
                          .join(", ")
                      : "No vegetables"
                  }
                  price={pizza.vegetables.reduce(
                    (sum, item) => sum + item.price,
                    0
                  )}
                />

              </div>

            </div>

            {/* Payment */}
            <div className="space-y-5">

              <div className="bg-white rounded-3xl p-6 border border-gray-100">

                <h2 className="font-black text-xl">
                  Delivery Address
                </h2>

                <div className="flex gap-3 mt-5">
                  <MapPin
                    className="text-red-600 shrink-0"
                    size={20}
                  />

                  <div>
                    <p className="font-bold">
                      Home
                    </p>

                    <p className="text-sm text-gray-500 mt-1 leading-6">
                      Your saved delivery address will
                      appear here.
                    </p>
                  </div>
                </div>

              </div>

              <div className="bg-gray-950 text-white rounded-3xl p-6">

                <h2 className="font-black text-xl">
                  Payment Summary
                </h2>

                <div className="space-y-3 mt-6 text-sm">

                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Pizza
                    </span>
                    <span>₹199</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Customization
                    </span>
                    <span>₹{total - 199}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Delivery
                    </span>
                    <span className="text-green-400">
                      FREE
                    </span>
                  </div>

                </div>

                <div className="border-t border-gray-800 mt-5 pt-5 flex justify-between">

                  <span className="text-gray-400">
                    Total
                  </span>

                  <span className="text-2xl font-black">
                    ₹{total}
                  </span>

                </div>

                <button className="w-full mt-6 py-4 bg-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700">
                  <CreditCard size={19} />
                  Pay ₹{total}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                  <CheckCircle2 size={14} />
                  Secure payment
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>
    </>
  );
}

function Item({ title, value, price }) {
  return (
    <div className="flex justify-between gap-5">
      <div>
        <p className="font-bold">{title}</p>
        <p className="text-sm text-gray-500 mt-1">
          {value}
        </p>
      </div>

      <span className="font-bold whitespace-nowrap">
        {price > 0 ? `+ ₹${price}` : "Included"}
      </span>
    </div>
  );
}