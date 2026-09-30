import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  CheckCircle,
  CreditCard,
  Loader2,
  ShieldCheck,
  XCircle,
  FileText,
  CalendarDays,
  Hash,
  MessageSquare,
  IndianRupee,
  ArrowLeft,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  submitManualPayment,
  getPaymentConfig,
} from "../services/api";

const CART_KEY = "pizzaCart";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const paymentData = location.state || {};

  // ==========================================
  // ORDER INFORMATION
  // ==========================================

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

  // ==========================================
  // STATE
  // ==========================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [config, setConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);

  const [form, setForm] = useState({
    transactionId: "",
    paymentDate: new Date()
      .toISOString()
      .split("T")[0],
    note: "",
  });

  // ==========================================
  // LOAD PAYMENT CONFIG
  // ==========================================

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await getPaymentConfig();
        if (res.data?.success) {
          setConfig(res.data.config);
        }
      } catch (err) {
        console.error(
          "Payment config load error:",
          err
        );
      } finally {
        setConfigLoading(false);
      }
    };

    loadConfig();
  }, []);

  // ==========================================
  // VALIDATE PAYMENT DATA
  // ==========================================

  useEffect(() => {
    if (!orderId) {
      setError("Order information is missing.");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Invalid order amount.");
      return;
    }

    setError("");
  }, [orderId, amount]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT MANUAL PAYMENT
  // ==========================================

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (loading || submitted) return;

    // Validation
    const trimmedTxnId =
      form.transactionId.trim();

    if (!trimmedTxnId) {
      setError(
        "Please enter your Transaction / Reference ID."
      );
      return;
    }

    if (
      trimmedTxnId.length < 3 ||
      trimmedTxnId.length > 100
    ) {
      setError(
        "Transaction ID must be between 3 and 100 characters."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await submitManualPayment({
        orderId,
        transactionId: trimmedTxnId,
        paymentDate: form.paymentDate || null,
        note: form.note.trim() || null,
      });

      if (res.data?.success) {
        setSubmitted(true);

        // Clear cart
        try {
          localStorage.removeItem(CART_KEY);
          window.dispatchEvent(
            new Event("cartUpdated")
          );
        } catch (cartError) {
          console.error(
            "Cart clear error:",
            cartError
          );
        }

        // Navigate after short delay
        setTimeout(() => {
          navigate("/order-success", {
            replace: true,
            state: {
              paymentSuccess: true,
              paymentMethod: "MANUAL",
              paymentStatus: "PENDING",
              orderId,
              amount,
              order: res.data?.order,
            },
          });
        }, 1500);
      } else {
        setError(
          res.data?.message ||
            "Payment submission failed."
        );
      }
    } catch (err) {
      console.error(
        "Submit manual payment error:",
        err
      );

      const msg =
        err?.response?.data?.message ||
        "Unable to submit payment. Please try again.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INVALID PAYMENT DATA
  // ==========================================

  if (!orderId || !amount || amount <= 0) {
    return (
      <>
        <Navbar />

        <main className="min-h-[75vh] bg-[#fafafa] flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
            <XCircle
              className="mx-auto text-red-500 mb-4"
              size={64}
            />

            <h1 className="text-2xl font-black text-gray-900">
              Payment Error
            </h1>

            <p className="text-gray-600 mt-3">
              Payment information is missing
              or invalid.
            </p>

            <button
              onClick={() =>
                navigate("/checkout")
              }
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl transition"
            >
              Back to Checkout
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // ==========================================
  // PAYMENT PAGE
  // ==========================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fafafa]">
        {/* HEADER */}

        <section className="bg-white border-b">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <div className="mt-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                Step 2 of 2
              </p>

              <h1 className="text-3xl md:text-4xl font-black mt-2">
                Manual Payment
              </h1>

              <p className="text-gray-500 mt-2">
                Submit your payment details for
                admin verification.
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT */}

        <section className="max-w-3xl mx-auto px-6 py-10">
          <div className="grid md:grid-cols-[1fr_300px] gap-6">
            {/* LEFT - FORM */}

            <div className="space-y-6">
              {/* ORDER INFO CARD */}

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <FileText size={21} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black">
                      Order Details
                    </h2>
                    <p className="text-sm text-gray-500">
                      Complete payment for your
                      order.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Order
                    </span>
                    <span className="text-sm font-bold">
                      #
                      {String(orderId)
                        .slice(-6)
                        .toUpperCase()}
                    </span>
                  </div>

                  <div className="border-t border-gray-200" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Amount to Pay
                    </span>
                    <span className="text-2xl font-black text-red-600">
                      ₹
                      {amount.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* PAYMENT INSTRUCTIONS */}

              {config && (
                <div className="bg-white rounded-3xl border border-orange-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4">
                    <div className="flex items-center gap-3">
                      <CreditCard size={22} />
                      <h3 className="font-bold text-lg">
                        {config.title ||
                          "Payment Instructions"}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    {config.accountName && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Account Name
                        </span>
                        <span className="font-bold">
                          {config.accountName}
                        </span>
                      </div>
                    )}

                    {config.paymentMethod && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Payment Method
                        </span>
                        <span className="font-bold">
                          {config.paymentMethod}
                        </span>
                      </div>
                    )}

                    {config.upiId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          UPI ID
                        </span>
                        <span className="font-bold text-orange-600">
                          {config.upiId}
                        </span>
                      </div>
                    )}

                    {config.instructions && (
                      <div className="mt-3 bg-orange-50 rounded-xl p-4">
                        <p className="text-sm text-orange-800 leading-relaxed">
                          {config.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PAYMENT FORM */}

              <form
                onSubmit={handleSubmitPayment}
              >
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                        <Hash size={21} />
                      </div>

                      <div>
                        <h2 className="text-lg font-black">
                          Payment Details
                        </h2>
                        <p className="text-sm text-gray-500">
                          Enter your payment
                          information below.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* AMOUNT (read-only) */}

                    <div>
                      <label className="text-sm font-bold text-gray-700">
                        Payment Amount
                      </label>

                      <div className="relative mt-2">
                        <IndianRupee
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="text"
                          value={`₹${amount.toLocaleString(
                            "en-IN"
                          )}`}
                          readOnly
                          className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 bg-gray-50 text-gray-700 font-bold cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* TRANSACTION ID */}

                    <div>
                      <label className="text-sm font-bold text-gray-700">
                        Transaction / Reference
                        ID{" "}
                        <span className="text-red-500">
                          *
                        </span>
                      </label>

                      <div className="relative mt-2">
                        <Hash
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="text"
                          name="transactionId"
                          value={
                            form.transactionId
                          }
                          onChange={handleChange}
                          placeholder="e.g. TXN123456789"
                          maxLength={100}
                          disabled={
                            loading || submitted
                          }
                          className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* PAYMENT DATE */}

                    <div>
                      <label className="text-sm font-bold text-gray-700">
                        Payment Date
                      </label>

                      <div className="relative mt-2">
                        <CalendarDays
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="date"
                          name="paymentDate"
                          value={
                            form.paymentDate
                          }
                          onChange={handleChange}
                          disabled={
                            loading || submitted
                          }
                          className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* NOTE */}

                    <div>
                      <label className="text-sm font-bold text-gray-700">
                        Payment Note{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </label>

                      <div className="relative mt-2">
                        <MessageSquare
                          size={18}
                          className="absolute left-4 top-4 text-gray-400"
                        />

                        <textarea
                          name="note"
                          value={form.note}
                          onChange={handleChange}
                          rows={3}
                          maxLength={500}
                          placeholder="Any additional note for admin..."
                          disabled={
                            loading || submitted
                          }
                          className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 outline-none resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* ERROR */}

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm font-medium">
                        {error}
                      </div>
                    )}

                    {/* SUCCESS */}

                    {submitted && (
                      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-medium flex items-center gap-2">
                        <CheckCircle
                          size={18}
                        />
                        Payment submitted
                        successfully! Redirecting...
                      </div>
                    )}

                    {/* SUBMIT */}

                    <button
                      type="submit"
                      disabled={
                        loading || submitted
                      }
                      className="w-full bg-red-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-lg shadow-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />
                          Submitting Payment...
                        </>
                      ) : submitted ? (
                        <>
                          <CheckCircle
                            size={19}
                          />
                          Payment Submitted
                        </>
                      ) : (
                        <>
                          <ShieldCheck
                            size={19}
                          />
                          Submit Payment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* RIGHT - STATUS CARD */}

            <div className="md:sticky md:top-6 h-fit space-y-4">
              {/* PENDING STATUS */}

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Loader2
                      size={20}
                      className="text-orange-600"
                    />
                  </div>

                  <div>
                    <p className="font-bold text-sm">
                      Payment Pending
                    </p>
                    <p className="text-xs text-gray-500">
                      Admin verification
                      required
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-3">
                  <p className="text-xs text-orange-700 leading-relaxed">
                    After submitting your
                    payment details, the admin
                    will verify and update the
                    payment status. You can check
                    status from your orders page.
                  </p>
                </div>
              </div>

              {/* SECURITY */}

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    size={20}
                    className="text-green-600 shrink-0"
                  />
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Your payment information is
                    securely processed and
                    verified by admin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Payment;