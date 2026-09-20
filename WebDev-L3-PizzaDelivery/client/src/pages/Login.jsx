import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Pizza,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
  Clock3,
  Tag,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
    setLoading(true);

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      // Save auth state via context
      login(user, token);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7ed] flex items-center justify-center p-4 md:p-4">

      {/* MAIN CARD */}
      <div className="w-full max-w-6xl min-h-[700px] bg-white rounded-[32px] shadow-[0_25px_80px_rgba(0,0,0,0.12)] overflow-hidden grid lg:grid-cols-2">

        {/* =====================================================
            LEFT SIDE - PIZZA BRAND / OFFER
        ====================================================== */}
        <div className="relative hidden lg:flex bg-gradient-to-br from-red-600 via-red-600 to-orange-500 overflow-hidden">

          {/* Decorative circles */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/10 rounded-full" />

          <div className="absolute -bottom-40 -right-32 w-[450px] h-[450px] bg-black/10 rounded-full" />

          <div className="absolute top-1/2 -left-20 w-52 h-52 bg-orange-300/20 rounded-full" />

          {/* Content */}
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
                <h2 className="text-3xl font-black tracking-tight">
                  Pizza<span className="text-orange-200">Hub</span>
                </h2>

                <p className="text-[10px] tracking-[0.25em] text-red-100 font-bold">
                  FRESH • FAST • DELICIOUS
                </p>
              </div>
            </Link>

            {/* CENTER CONTENT */}
            <div className="max-w-lg">

              {/* OFFER BADGE */}
              <div className="inline-flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-full shadow-lg mb-7">

                <Tag size={17} />

                <span className="text-sm font-black">
                  20% OFF ON YOUR FIRST ORDER
                </span>

              </div>

              <h1 className="text-5xl xl:text-6xl font-black leading-[1.05]">
                Good pizza.
                <br />

                <span className="text-orange-200">
                  Great moments.
                </span>
              </h1>

              <p className="text-red-100 text-lg leading-relaxed mt-6 max-w-md">
                Your favorite cheesy, crispy and delicious pizza
                is waiting for you. Login and order something
                you'll love. 🍕
              </p>

              {/* PIZZA VISUAL */}
              <div className="relative mt-9 flex items-center">

                <div className="w-40 h-40 bg-white rounded-full shadow-2xl flex items-center justify-center text-8xl rotate-[-8deg]">
                  🍕
                </div>

                <div className="ml-[-10px] w-48 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl">

                  <div className="flex items-center gap-1 mb-1">
                    <Star
                      size={16}
                      fill="currentColor"
                      className="text-yellow-300"
                    />

                    <Star
                      size={16}
                      fill="currentColor"
                      className="text-yellow-300"
                    />

                    <Star
                      size={16}
                      fill="currentColor"
                      className="text-yellow-300"
                    />

                    <Star
                      size={16}
                      fill="currentColor"
                      className="text-yellow-300"
                    />

                    <Star
                      size={16}
                      fill="currentColor"
                      className="text-yellow-300"
                    />
                  </div>

                  <p className="font-black text-lg">
                    Loved by pizza lovers
                  </p>

                  <p className="text-xs text-red-100 mt-1">
                    Freshly made. Every order.
                  </p>

                </div>

              </div>

              {/* FEATURES */}
              <div className="flex flex-wrap gap-3 mt-9">

                <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                  <Truck size={18} />
                  <span className="text-sm font-semibold">
                    Fast Delivery
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                  <Clock3 size={18} />
                  <span className="text-sm font-semibold">
                    Fresh Every Time
                  </span>
                </div>

              </div>

            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between text-xs text-red-100">

              <span>
                © 2026 PizzaHub
              </span>

              <span className="flex items-center gap-1">
                Made with ❤️ for pizza lovers
              </span>

            </div>

          </div>
        </div>


        {/* =====================================================
            RIGHT SIDE - LOGIN FORM
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


            {/* HEADER */}
            <div className="mb-8">

              <div className="inline-flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1.5 rounded-full mb-4">

                <Pizza size={15} />

                <span className="text-xs font-black uppercase tracking-wide">
                  Pizza lovers, welcome back
                </span>

              </div>

              <h2 className="text-4xl font-black text-gray-900 leading-tight">
                Let's get you
                <br />
                back to your pizza. 🍕
              </h2>

              <p className="text-gray-500 mt-3 leading-relaxed">
                Login to order your favorites, track your delivery
                and unlock exclusive PizzaHub offers.
              </p>

            </div>


            {/* ERROR MESSAGE */}
            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                <AlertCircle
                  size={19}
                  className="text-red-500 shrink-0 mt-0.5"
                />
                <p className="text-sm text-red-600 font-medium">
                  {error}
                </p>
              </div>
            )}


            {/* LOGIN FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

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
                    placeholder="Enter your email"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
                  />

                </div>

              </div>


              {/* PASSWORD */}
              <div>

                <div className="flex justify-between items-center mb-2">

                  <label className="text-sm font-bold text-gray-800">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-red-600 font-bold hover:text-red-700"
                  >
                    Forgot Password?
                  </Link>

                </div>

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
                    placeholder="Enter your password"
                    required
                    className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                  >

                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}

                  </button>

                </div>

              </div>


              {/* REMEMBER */}
              <div className="flex items-center gap-2">

                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 accent-red-600 cursor-pointer"
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Keep me signed in
                </label>

              </div>


              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5 transition-all duration-300"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login & Start Ordering

                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}

              </button>

            </form>


            {/* REGISTER */}
            <div className="relative flex items-center gap-4 my-8">

              <div className="h-px bg-gray-200 flex-1" />

              <span className="text-xs text-gray-400 font-bold">
                NEW TO PIZZAHUB?
              </span>

              <div className="h-px bg-gray-200 flex-1" />

            </div>


            <Link
              to="/register"
              className="w-full py-3.5 border-2 border-gray-200 rounded-2xl flex items-center justify-center font-bold text-gray-800 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition"
            >
              Create Your Pizza Account
            </Link>


            {/* TRUST */}
            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-gray-400">

              <ShieldCheck size={16} />

              <span>
                Secure login • Safe payments • Fresh delivery
              </span>

            </div>


            {/* OFFER */}
            <div className="mt-6 bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                <Tag size={19} />
              </div>

              <div>

                <p className="font-black text-gray-900 text-sm">
                  Hungry already?
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  Login now and check today's exclusive deals.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}