import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Pizza,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { registerUser } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agree, setAgree] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!agree) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setSuccessMessage(
        response.data.message ||
          "Account created successfully! Redirecting to login..."
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setAgree(false);

      // Smooth redirect to login page
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to complete registration. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7ed] flex items-center justify-center p-4 md:p-8">

      {/* MAIN CARD */}
      <div className="w-full max-w-6xl min-h-[720px] bg-white rounded-[32px] shadow-[0_25px_80px_rgba(0,0,0,0.12)] overflow-hidden grid lg:grid-cols-2">

        {/* =====================================================
            LEFT SIDE - PIZZAHUB BRAND
        ====================================================== */}
        <div className="relative hidden lg:flex bg-gradient-to-br from-red-600 via-red-600 to-orange-500 overflow-hidden">

          {/* Decorative circles */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/10 rounded-full" />

          <div className="absolute -bottom-40 -right-32 w-[450px] h-[450px] bg-black/10 rounded-full" />

          <div className="absolute top-1/3 -right-16 w-40 h-40 bg-orange-300/20 rounded-full" />

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


            {/* CENTER */}
            <div className="max-w-lg">

              {/* OFFER */}
              <div className="inline-flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-full shadow-lg mb-7">

                <Tag size={17} />

                <span className="text-sm font-black">
                  GET 20% OFF YOUR FIRST ORDER
                </span>

              </div>


              <h1 className="text-5xl xl:text-6xl font-black leading-[1.05]">
                Join the
                <br />

                <span className="text-orange-200">
                  PizzaHub family. 🍕
                </span>
              </h1>


              <p className="text-red-100 text-lg leading-relaxed mt-6 max-w-md">
                Create your account and discover delicious pizzas,
                exclusive deals, faster checkout and easy order tracking.
              </p>


              {/* FEATURES */}
              <div className="mt-9 space-y-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Truck size={19} />
                  </div>

                  <div>
                    <p className="font-bold">
                      Fast & Fresh Delivery
                    </p>

                    <p className="text-xs text-red-100">
                      Hot pizza delivered to your door
                    </p>
                  </div>

                </div>


                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Tag size={19} />
                  </div>

                  <div>
                    <p className="font-bold">
                      Exclusive Deals
                    </p>

                    <p className="text-xs text-red-100">
                      Special offers for PizzaHub members
                    </p>
                  </div>

                </div>


                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>
                    <p className="font-bold">
                      Easy Ordering
                    </p>

                    <p className="text-xs text-red-100">
                      Order your favorites in seconds
                    </p>
                  </div>

                </div>

              </div>

            </div>


            {/* FOOTER */}
            <div className="flex items-center justify-between text-xs text-red-100">

              <span>
                © 2026 PizzaHub
              </span>

              <span>
                Made with ❤️ for pizza lovers
              </span>

            </div>

          </div>
        </div>


        {/* =====================================================
            RIGHT SIDE - REGISTER
        ====================================================== */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <div className="lg:hidden flex justify-center mb-7">

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


            {/* HEADER */}
            <div className="mb-7">

              <div className="inline-flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1.5 rounded-full mb-4">

                <User size={15} />

                <span className="text-xs font-black uppercase tracking-wide">
                  Create your account
                </span>

              </div>


              <h1 className="text-4xl font-black text-gray-900 leading-tight">
                Welcome to
                <br />
                PizzaHub! 🍕
              </h1>


              <p className="text-gray-500 mt-3">
                Create an account and get ready for your next
                delicious pizza.
              </p>

            </div>


            {/* SUCCESS MESSAGE */}
            {successMessage && (
              <div className="mb-5 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-3">
                <CheckCircle2
                  size={19}
                  className="text-green-500 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm text-green-700 font-medium">
                    {successMessage}
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-xs text-green-800 font-bold underline mt-1 hover:text-green-950"
                  >
                    Go to Login now →
                  </Link>
                </div>
              </div>
            )}


            {/* ERROR MESSAGE */}
            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                <AlertCircle
                  size={19}
                  className="text-red-500 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm text-red-600 font-medium">
                    {error}
                  </p>
                  {error.toLowerCase().includes("already registered") && (
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1 text-xs text-red-700 font-bold underline mt-1 hover:text-red-900"
                    >
                      Click here to Login →
                    </Link>
                  )}
                </div>
              </div>
            )}


            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* FULL NAME */}
              <div>

                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
                  />

                </div>

              </div>


              {/* EMAIL */}
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
                  />

                </div>

              </div>


              {/* PASSWORD */}
              <div>

                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                    minLength={6}
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>


              {/* CONFIRM PASSWORD */}
              <div>

                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>


              {/* TERMS */}
              <div className="flex items-start gap-3 pt-1">

                <input
                  type="checkbox"
                  id="terms"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="w-4 h-4 mt-1 accent-red-600 cursor-pointer"
                />

                <label
                  htmlFor="terms"
                  className="text-xs text-gray-500 leading-5 cursor-pointer"
                >
                  I agree to PizzaHub's{" "}
                  <span className="text-red-600 font-bold">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-red-600 font-bold">
                    Privacy Policy
                  </span>
                  .
                </label>

              </div>


              {/* CREATE ACCOUNT */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5 transition-all duration-300"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create My Pizza Account

                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}

              </button>

            </form>


            {/* LOGIN */}
            <div className="relative flex items-center gap-4 my-6">

              <div className="h-px bg-gray-200 flex-1" />

              <span className="text-xs text-gray-400 font-bold">
                ALREADY A MEMBER?
              </span>

              <div className="h-px bg-gray-200 flex-1" />

            </div>


            <Link
              to="/login"
              className="w-full py-3.5 border-2 border-gray-200 rounded-2xl flex items-center justify-center font-bold text-gray-800 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition"
            >
              Login to PizzaHub
            </Link>


            {/* SECURITY */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">

              <ShieldCheck size={15} />

              <span>
                Your account information is securely protected
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}