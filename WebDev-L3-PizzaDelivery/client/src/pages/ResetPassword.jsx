import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Pizza,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { resetPasswordRequest } from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
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

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPasswordRequest(token, {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
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

                <Lock
                  size={38}
                  className="text-white"
                />

              </div>

              <h1 className="text-5xl font-black leading-tight">
                Create a new
                <br />

                <span className="text-orange-200">
                  password.
                </span>
              </h1>

              <p className="text-red-100 text-lg leading-relaxed mt-6 max-w-md">
                Choose a strong password to keep your PizzaHub
                account safe and secure.
              </p>


              {/* TIPS */}
              <div className="mt-9 space-y-4">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>

                  <span className="text-sm font-semibold">
                    Use at least 6 characters
                  </span>

                </div>


                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                    <Lock size={18} />
                  </div>

                  <span className="text-sm font-semibold">
                    Mix letters, numbers & symbols
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


            {!success ? (
              <>
                {/* HEADER */}
                <div className="text-center mb-8">

                  <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-5">

                    <Lock
                      size={29}
                      className="text-red-600"
                    />

                  </div>

                  <p className="text-red-600 text-sm font-black uppercase tracking-wider">
                    Password Reset
                  </p>

                  <h1 className="text-4xl font-black text-gray-900 mt-2">
                    Create New Password
                  </h1>

                  <p className="text-gray-500 mt-3 leading-relaxed">
                    Enter your new password below to reset your
                    PizzaHub account password.
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


                {/* FORM */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* NEW PASSWORD */}
                  <div>

                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      New Password
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
                        placeholder="Enter new password"
                        required
                        minLength={6}
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


                  {/* CONFIRM PASSWORD */}
                  <div>

                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Confirm New Password
                    </label>

                    <div className="relative">

                      <Lock
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                        className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>

                    </div>

                  </div>


                  {/* SUBMIT */}
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
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        Reset Password

                        <ArrowRight
                          size={19}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}

                  </button>

                </form>


                {/* SECURITY */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-7">

                  <ShieldCheck size={15} />

                  <span>
                    Secure PizzaHub password reset
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
                  Success
                </p>

                <h1 className="text-4xl font-black text-gray-900 mt-2">
                  Password Reset Successfully
                </h1>

                <p className="text-gray-500 mt-4 leading-relaxed">
                  Your password has been updated. You can now
                  log in with your new password.
                </p>


                <Link
                  to="/login"
                  className="mt-7 w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition"
                >
                  Go to Login
                  <ArrowRight size={19} />
                </Link>


                <p className="text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
                  <ShieldCheck size={15} />
                  Your account is now secure
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
