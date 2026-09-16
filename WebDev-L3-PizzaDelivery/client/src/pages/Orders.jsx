import Navbar from "../components/Navbar";
import OrderStatus from "../components/OrderStatus";
import {
  PackageCheck,
  Clock3,
  MapPin,
  Phone,
  ReceiptText,
  ChefHat,
  Truck,
  CheckCircle2,
  Star,
  ArrowRight,
  RefreshCcw,
  ShoppingBag,
} from "lucide-react";

export default function Orders() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-gray-50 pb-14">
        {/* Top Banner */}
        <div className="bg-gray-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
            <Truck size={15} className="text-orange-400" />
            <span>Your pizza is on its way to deliciousness!</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
                <ShoppingBag size={15} />
                My Orders
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 mt-4 tracking-tight">
                Track Your{" "}
                <span className="text-red-600">Order</span>
              </h1>

              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Follow your pizza from our kitchen to your doorstep.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
              <CheckCircle2 size={18} className="text-green-500" />
              Order confirmed
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-[minmax(0,1fr)_370px] gap-7 mt-8">

            {/* Current Order */}
            <section className="bg-white rounded-[28px] border border-gray-100 shadow-[0_15px_50px_rgba(0,0,0,0.06)] overflow-hidden">

              {/* Order Header */}
              <div className="p-5 sm:p-7 bg-gradient-to-r from-white to-orange-50/60 border-b border-gray-100">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                      <PackageCheck size={29} />
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                        Current Order
                      </p>

                      <h2 className="font-black text-xl sm:text-2xl text-gray-950 mt-1">
                        Order #PH1024
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Custom Veg Pizza • ₹349
                      </p>
                    </div>

                  </div>

                  <span className="w-fit px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-xs font-black tracking-wide">
                    IN KITCHEN
                  </span>

                </div>

              </div>

              {/* Delivery Progress */}
              <div className="p-5 sm:p-7">

                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-black text-lg">
                      Order Status
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Your pizza is being prepared fresh.
                    </p>
                  </div>

                  <ChefHat
                    size={24}
                    className="text-red-600"
                  />
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 sm:p-7">
                  <OrderStatus current={2} />
                </div>

                {/* ETA */}
                <div className="grid sm:grid-cols-2 gap-4 mt-5">

                  <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5 flex gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white text-orange-600 flex items-center justify-center shrink-0">
                      <Clock3 size={21} />
                    </div>

                    <div>
                      <p className="font-black text-gray-900">
                        Estimated Delivery
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        20–25 minutes
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-green-50 border border-green-100 p-5 flex gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white text-green-600 flex items-center justify-center shrink-0">
                      <Truck size={21} />
                    </div>

                    <div>
                      <p className="font-black text-gray-900">
                        Delivery Partner
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Will be assigned shortly
                      </p>
                    </div>
                  </div>

                </div>

                {/* Address */}
                <div className="mt-5 rounded-2xl border border-gray-100 p-5">

                  <div className="flex items-start gap-3">

                    <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>

                    <div>
                      <p className="font-black">
                        Delivery Address
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Your saved delivery address
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            </section>

            {/* Order Summary */}
            <aside className="lg:sticky lg:top-24 h-fit">

              <div className="bg-gray-950 rounded-[28px] text-white overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-white/10">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-black tracking-widest text-orange-400">
                        ORDER SUMMARY
                      </p>

                      <h2 className="text-xl font-black mt-1">
                        Your Pizza
                      </h2>
                    </div>

                    <ReceiptText
                      size={23}
                      className="text-gray-400"
                    />

                  </div>

                </div>

                {/* Pizza */}
                <div className="p-5 sm:p-6">

                  <div className="flex items-center gap-4">

                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center text-4xl shadow-lg">
                      🍕
                    </div>

                    <div className="flex-1">
                      <h3 className="font-black text-lg">
                        Custom Veg Pizza
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Thin Crust • Peri Peri
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Mozzarella • 3 Toppings
                      </p>
                    </div>

                  </div>

                  {/* Details */}
                  <div className="mt-6 space-y-3">

                    <SummaryRow
                      label="Pizza Base"
                      value="Thin Crust"
                    />

                    <SummaryRow
                      label="Sauce"
                      value="Peri Peri"
                    />

                    <SummaryRow
                      label="Cheese"
                      value="Mozzarella"
                    />

                    <SummaryRow
                      label="Toppings"
                      value="Onion, Capsicum, Corn"
                    />

                    <SummaryRow
                      label="Quantity"
                      value="× 1"
                    />

                  </div>

                  {/* Total */}
                  <div className="border-t border-white/10 mt-6 pt-5 flex justify-between items-end">

                    <div>
                      <p className="text-xs text-gray-500">
                        TOTAL PAID
                      </p>

                      <p className="text-3xl font-black mt-1">
                        ₹349
                      </p>
                    </div>

                    <span className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs font-bold">
                      PAID
                    </span>

                  </div>

                </div>

                {/* Support */}
                <div className="px-5 sm:px-6 pb-6">

                  <button
                    type="button"
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 transition font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <Phone size={17} />
                    Need Help?
                  </button>

                </div>

              </div>

              {/* Rating Card */}
              <div className="mt-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-2xl p-5">

                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                    <Star
                      size={19}
                      className="fill-white"
                    />
                  </div>

                  <div>
                    <p className="font-black">
                      Loving your PizzaHub experience?
                    </p>

                    <p className="text-xs text-white/80 mt-1">
                      After delivery, don't forget to rate your order.
                    </p>
                  </div>

                </div>

              </div>

            </aside>
          </div>

          {/* Previous Orders */}
          <section className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-5 sm:p-7 mt-7">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-red-600">
                  Order History
                </p>

                <h2 className="text-2xl font-black text-gray-950 mt-1">
                  Previous Orders
                </h2>
              </div>

              <button
                type="button"
                className="w-fit flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition"
              >
                View All
                <ArrowRight size={16} />
              </button>

            </div>

            {/* Previous Order */}
            <div className="mt-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition p-5">

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl">
                    🍕
                  </div>

                  <div>
                    <p className="font-black text-gray-950">
                      Order #PH1018
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Margherita • ₹199
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      12 Sep 2026
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-600 text-xs font-black">
                    DELIVERED
                  </span>

                  <button
                    type="button"
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition"
                  >
                    <RefreshCcw size={15} />
                    Reorder
                  </button>

                </div>

              </div>

            </div>

            {/* Empty / More Orders Hint */}
            <div className="mt-4 rounded-2xl bg-gray-50 p-5 text-center">

              <p className="text-sm text-gray-500">
                Craving another one?
              </p>

              <button
                type="button"
                onClick={() => (window.location.href = "/pizza-builder")}
                className="mt-2 text-red-600 font-black text-sm hover:text-red-700 transition"
              >
                Build Another Pizza →
              </button>

            </div>

          </section>

        </div>
      </main>
    </>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-semibold text-right text-gray-200">
        {value}
      </span>
    </div>
  );
}