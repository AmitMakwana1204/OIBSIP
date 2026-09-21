import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Home,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function OrderSuccess() {
  const location = useLocation();

  const order = location.state?.order || location.state || {};

  const orderId =
    order?.orderId ||
    order?._id ||
    "Processing";

  const total =
    Number(order?.total) ||
    Number(order?.totalAmount) ||
    0;

  return (
    <>
      <Navbar />

      <main className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2
                  size={48}
                  className="text-green-600"
                />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Order Placed Successfully! 🎉
            </h1>

            <p className="text-gray-600 text-base md:text-lg mb-8">
              Thank you for ordering from PizzaHub.
              Your delicious pizza is on its way!
            </p>

            {/* Order Info */}
            <div className="bg-gray-50 rounded-xl p-5 mb-8 text-left">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">
                  Order ID
                </span>

                <span className="font-semibold text-gray-900">
                  {orderId}
                </span>
              </div>

              {total > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">
                    Total Amount
                  </span>

                  <span className="font-bold text-orange-600">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">
                  Payment
                </span>

                <span className="font-semibold">
                  {order?.paymentMethod || "COD"}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
              <p className="text-green-700 font-medium">
                ✓ Your order has been received.
              </p>

              <p className="text-sm text-green-600 mt-1">
                You can track your order from the Orders page.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">

              <Link
                to="/orders"
                className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition"
              >
                <ShoppingBag size={20} />
                View My Orders
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold px-6 py-3 rounded-xl transition"
              >
                <Home size={20} />
                Continue Shopping
              </Link>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}