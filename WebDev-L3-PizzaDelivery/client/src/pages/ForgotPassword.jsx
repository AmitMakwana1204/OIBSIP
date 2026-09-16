import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Pizza,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
} from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend password reset API will be connected here
    console.log("Reset email:", email);

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fff7ed] flex items-center justify-center p-4 md:p-8">

      {/* MAIN CARD */}
      <div className="w-full max-w-6xl min-h-[650px] bg-white rounded-[32px] shadow-[0_25px_80px_rgba(0,0,0,0.12)] overflow-hidden grid lg:grid-cols-2">

        {/* =====================================================
            LEFT SIDE - BRAND
        ====================================================== */}
        <div className="relative hidden lg:flex bg-gradient-to-br from-red-600 via-red-600 to-orange-500 overflow-hidden">

          {/* Decorative shapes */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/10 rounded-full" />

          <div className="absolute -bottom-40 -right-32 w-[450px] h-[450px] bg-black/10 rounded-full" />

          <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">

            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-3 w-fit"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <Pizza
                  size={32}
                  className="text-red-600"
                />
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  Pizza<span className="text-orange-200">Hub</span>
                </h2>

                <p className="text-[10px] tracking-[0.25em] text-red-100 font-bold">
                  FRESH • FAST • DELICIOUS
                </p>
              </div>
            </Link>


            {/* CONTENT */}
            <div className="max-w-lg">

              <div className="w-20 h-20 bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center mb-7">

                <Mail
                  size={38}
                  className="text-white"
                />

              </div>

              <h1 className="text-5xl font-black leading-tight">
                Don't worry,
                <br />

                <span className="text-orange-200">
                  we've got you.
                </span>
              </h1>

              <p className="text-red-100 text-lg leading-relaxed mt-6 max-w-md">
                Forgot your password? No problem. Enter your
                email and we'll help you get back to your
                PizzaHub account.
              </p>


              {/* BENEFITS */}
              <div className="mt-9 space-y-4">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>

                  <span className="text-sm font-semibold">
                    Secure password recovery
                  </span>

                </div>


                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                    <Pizza size={18} />
                  </div>

                  <span className="text-sm font-semibold">
                    Get back to ordering your favorites
                  </span>

                </div>

              </div>

            </div>


            {/* FOOTER */}
            <p className="text-xs text-red-100">
              © 2026 PizzaHub • Made with ❤️ for pizza lovers
            </p>

          </div>
        </div>


        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <div className="lg:hidden flex justify-center mb-8">

              <Link
                to="/"
                className="flex items-center gap-3"
              >

                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Pizza
                    size={28}
                    className="text-white"
                  />
                </div>

                <span className="text-3xl font-black">
                  Pizza<span className="text-red-600">Hub</span>
                </span>

              </Link>

            </div>


            {!submitted ? (
              <>
                {/* HEADER */}
                <div className="text-center mb-8">

                  <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-5">

                    <Mail
                      size={29}
                      className="text-red-600"
                    />

                  </div>

                  <p className="text-red-600 text-sm font-black uppercase tracking-wider">
                    Account Recovery
                  </p>

                  <h1 className="text-4xl font-black text-gray-900 mt-2">
                    Forgot Password?
                  </h1>

                  <p className="text-gray-500 mt-3 leading-relaxed">
                    No worries. Enter the email address linked
                    to your PizzaHub account.
                  </p>

                </div>


                {/* FORM */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  <div>

                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Email Address
                    </label>

                    <div className="relative">

                      <Mail
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
                      />

                    </div>

                  </div>


                  {/* BUTTON */}
                  <button
                    type="submit"
                    className="group w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5 transition-all duration-300"
                  >

                    Send Reset Link

                    <ArrowRight
                      size={19}
                      className="group-hover:translate-x-1 transition-transform"
                    />

                  </button>

                </form>


                {/* BACK LOGIN */}
                <Link
                  to="/login"
                  className="mt-7 flex items-center justify-center gap-2 text-red-600 font-bold text-sm hover:text-red-700 transition"
                >
                  <ArrowLeft size={17} />
                  Back to Login
                </Link>


                {/* OFFER */}
                <div className="mt-8 bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <Tag size={19} />
                  </div>

                  <div>

                    <p className="font-black text-gray-900 text-sm">
                      Almost back to your pizza!
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Recover your account and check today's deals.
                    </p>

                  </div>

                </div>


                {/* SECURITY */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-7">

                  <ShieldCheck size={15} />

                  <span>
                    Your account information is secure
                  </span>

                </div>

              </>
            ) : (

              /* =================================================
                 SUCCESS STATE
              ================================================== */
              <div className="text-center">

                <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">

                  <CheckCircle2
                    size={42}
                    className="text-green-500"
                  />

                </div>

                <p className="text-green-600 text-sm font-black uppercase tracking-wider">
                  Email Sent
                </p>

                <h1 className="text-4xl font-black text-gray-900 mt-2">
                  Check your inbox
                </h1>

                <p className="text-gray-500 mt-4 leading-relaxed">
                  If an account exists for{" "}
                  <span className="font-bold text-gray-800">
                    {email}
                  </span>
                  , we've sent instructions to reset your password.
                </p>


                {/* INFO BOX */}
                <div className="mt-7 bg-gray-50 border border-gray-100 rounded-2xl p-5 text-left">

                  <p className="font-bold text-gray-800 text-sm">
                    Didn't receive the email?
                  </p>

                  <ul className="text-sm text-gray-500 mt-3 space-y-2">
                    <li>• Check your spam or junk folder.</li>
                    <li>• Make sure your email address is correct.</li>
                    <li>• Wait a few minutes and try again.</li>
                  </ul>

                </div>


                <Link
                  to="/login"
                  className="mt-7 w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition"
                >
                  Back to Login
                  <ArrowRight size={19} />
                </Link>


                <p className="text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
                  <ShieldCheck size={15} />
                  Secure PizzaHub account recovery
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}