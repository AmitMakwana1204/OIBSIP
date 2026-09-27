import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  CreditCard,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import api from "../services/api";

const RAZORPAY_SCRIPT =
  "https://checkout.razorpay.com/v1/checkout.js";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () =>
        resolve(true)
      );
      existingScript.addEventListener("error", () =>
        resolve(false)
      );
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [paymentError, setPaymentError] = useState("");
  const [paymentStarted, setPaymentStarted] =
    useState(false);

  const paymentOpened = useRef(false);

  const paymentData = location.state || {};

  const orderId =
    paymentData.orderId ||
    paymentData.order?._id ||
    paymentData.order?.id;

  const amount = Number(
    paymentData.amount ||
      paymentData.total ||
      paymentData.order?.total ||
      0
  );

  const customer = paymentData.customer || {};

  useEffect(() => {
    if (paymentOpened.current) return;

    if (!orderId || !amount || amount <= 0) {
      setPaymentError(
        "Payment information is missing or invalid."
      );
      setLoading(false);
      return;
    }

    paymentOpened.current = true;

    startPayment();
  }, []);

  const startPayment = async () => {
    try {
      setLoading(true);
      setPaymentError("");

      // ==========================================
      // LOAD RAZORPAY SCRIPT
      // ==========================================

      const scriptLoaded =
        await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Razorpay SDK could not be loaded."
        );
      }

      // ==========================================
      // CREATE RAZORPAY ORDER
      // ==========================================

      const response = await api.post(
        "/payment/create-order",
        {
          amount,
          currency: "INR",
          receipt: `pizza_${Date.now()}`,
          orderId,
        }
      );

      const data = response.data;

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Unable to create payment order."
        );
      }

      const razorpayOrder =
        data.razorpayOrder;

      const keyId = data.keyId;

      if (!razorpayOrder?.id || !keyId) {
        throw new Error(
          "Invalid Razorpay order response."
        );
      }

      // ==========================================
      // RAZORPAY CHECKOUT OPTIONS
      // ==========================================

      const options = {
        key: keyId,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency || "INR",

        name: "PizzaHub",

        description:
          `PizzaHub Order #${String(orderId)
            .slice(-6)
            .toUpperCase()}`,

        order_id:
          razorpayOrder.id,

        prefill: {
          name:
            customer.name || "",

          contact:
            customer.phone || "",
        },

        notes: {
          orderId: String(orderId),
        },

        theme: {
          color: "#f97316",
        },

        modal: {
          ondismiss: () => {
            setPaymentStarted(false);
            setLoading(false);
            setPaymentError(
              "Payment was cancelled."
            );
          },
        },

        handler: async (paymentResponse) => {
          await verifyPayment(
            paymentResponse
          );
        },
      };

      // ==========================================
      // OPEN RAZORPAY
      // ==========================================

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setPaymentStarted(false);
          setLoading(false);

          setPaymentError(
            response?.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      setPaymentStarted(true);
      setLoading(false);

      razorpay.open();
    } catch (error) {
      console.error(
        "Start payment error:",
        error
      );

      setLoading(false);
      setPaymentStarted(false);

      setPaymentError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment."
      );
    }
  };

  // ==========================================
  // VERIFY PAYMENT
  // ==========================================

  const verifyPayment = async (
    razorpayResponse
  ) => {
    try {
      setLoading(true);
      setPaymentError("");

      const response = await api.post(
        "/payment/verify",
        {
          razorpay_order_id:
            razorpayResponse.razorpay_order_id,

          razorpay_payment_id:
            razorpayResponse.razorpay_payment_id,

          razorpay_signature:
            razorpayResponse.razorpay_signature,

          orderId,
        }
      );

      const data = response.data;

      if (
        !data?.success ||
        !data?.verified
      ) {
        throw new Error(
          data?.message ||
            "Payment verification failed."
        );
      }

      // ==========================================
      // PAYMENT SUCCESS
      // ==========================================

      try {
        localStorage.removeItem(
          "pizzaCart"
        );

        window.dispatchEvent(
          new Event("cartUpdated")
        );
      } catch (error) {
        console.error(
          "Cart clear error:",
          error
        );
      }

      navigate(
        `/order-success/${orderId}`,
        {
          replace: true,
          state: {
            paymentSuccess: true,
            orderId,
            paymentId:
              razorpayResponse.razorpay_payment_id,
          },
        }
      );
    } catch (error) {
      console.error(
        "Payment verification error:",
        error
      );

      setLoading(false);

      setPaymentError(
        error.response?.data?.message ||
          error.message ||
          "Payment verification failed."
      );
    }
  };

  // ==========================================
  // INVALID PAYMENT DATA
  // ==========================================

  if (!orderId || !amount || amount <= 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <XCircle
            className="mx-auto text-red-500 mb-4"
            size={64}
          />

          <h1 className="text-2xl font-bold text-gray-900">
            Payment Error
          </h1>

          <p className="text-gray-600 mt-3">
            Payment information is missing.
          </p>

          <button
            onClick={() =>
              navigate("/checkout")
            }
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl"
          >
            Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAYMENT PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden">
        {/* HEADER */}

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-7">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <CreditCard size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Secure Payment
              </h1>

              <p className="text-white/80 text-sm mt-1">
                Complete your PizzaHub order
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div className="p-6">
          {/* ORDER INFO */}

          <div className="bg-gray-50 rounded-2xl p-5 mb-5">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Order
              </span>

              <span className="font-semibold text-gray-900">
                #
                {String(orderId)
                  .slice(-6)
                  .toUpperCase()}
              </span>
            </div>

            <div className="border-t border-gray-200 my-4" />

            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Amount
              </span>

              <span className="text-2xl font-bold text-orange-600">
                ₹{amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* STATUS */}

          {loading ? (
            <div className="text-center py-8">
              <Loader2
                className="mx-auto animate-spin text-orange-500"
                size={48}
              />

              <h2 className="font-semibold text-gray-900 mt-4">
                Processing Payment...
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Please wait while we connect to Razorpay.
              </p>
            </div>
          ) : paymentError ? (
            <div className="text-center py-5">
              <XCircle
                className="mx-auto text-red-500"
                size={48}
              />

              <h2 className="font-semibold text-gray-900 mt-4">
                Payment Failed
              </h2>

              <p className="text-red-500 text-sm mt-2">
                {paymentError}
              </p>

              <button
                onClick={() => {
                  paymentOpened.current = false;
                  setPaymentError("");
                  startPayment();
                }}
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl"
              >
                Try Again
              </button>

              <button
                onClick={() =>
                  navigate("/checkout")
                }
                className="mt-3 w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl"
              >
                Back to Checkout
              </button>
            </div>
          ) : paymentStarted ? (
            <div className="text-center py-8">
              <CreditCard
                className="mx-auto text-orange-500"
                size={48}
              />

              <h2 className="font-semibold text-gray-900 mt-4">
                Razorpay Checkout Opened
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Complete your payment in the Razorpay window.
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle
                className="mx-auto text-green-500"
                size={48}
              />

              <h2 className="font-semibold text-gray-900 mt-4">
                Payment Ready
              </h2>
            </div>
          )}

          {/* SECURITY */}

          <div className="mt-6 pt-5 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <ShieldCheck
                size={18}
                className="text-green-500"
              />

              <span>
                Secure payment powered by Razorpay
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;