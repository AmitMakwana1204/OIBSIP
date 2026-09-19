import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Pizza,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { verifyEmailToken } from "../services/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Verification token is missing.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyEmailToken(token);

        setSuccess(true);
        setMessage(
          response.data.message ||
          "Email verified successfully!"
        );
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Verification link is invalid or expired.";
        setMessage(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#fff7ed] flex items-center justify-center p-4 md:p-8">

      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-[0_25px_80px_rgba(0,0,0,0.12)] p-8 sm:p-12">

        {/* LOGO */}
        <div className="flex justify-center mb-8">
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


        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-8">

            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
              <Loader2
                size={32}
                className="text-red-600 animate-spin"
              />
            </div>

            <h2 className="text-2xl font-black text-gray-900">
              Verifying your email...
            </h2>

            <p className="text-gray-500 mt-3">
              Please wait while we verify your account.
            </p>

          </div>
        )}


        {/* SUCCESS STATE */}
        {!loading && success && (
          <div className="text-center py-4">

            <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2
                size={42}
                className="text-green-500"
              />
            </div>

            <p className="text-green-600 text-sm font-black uppercase tracking-wider">
              Verified
            </p>

            <h2 className="text-3xl font-black text-gray-900 mt-2">
              Email Verified Successfully! 🎉
            </h2>

            <p className="text-gray-500 mt-4 leading-relaxed">
              {message}
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
              Your account is now active
            </p>

          </div>
        )}


        {/* ERROR STATE */}
        {!loading && !success && (
          <div className="text-center py-4">

            <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertCircle
                size={42}
                className="text-red-500"
              />
            </div>

            <p className="text-red-600 text-sm font-black uppercase tracking-wider">
              Verification Failed
            </p>

            <h2 className="text-3xl font-black text-gray-900 mt-2">
              Unable to Verify
            </h2>

            <p className="text-gray-500 mt-4 leading-relaxed">
              {message}
            </p>

            <div className="mt-7 bg-gray-50 border border-gray-100 rounded-2xl p-5 text-left">
              <p className="font-bold text-gray-800 text-sm">
                What can you do?
              </p>

              <ul className="text-sm text-gray-500 mt-3 space-y-2">
                <li>• Try registering again to get a new link.</li>
                <li>• Verification links expire after 15 minutes.</li>
                <li>• Contact support if the issue persists.</li>
              </ul>
            </div>

            <Link
              to="/register"
              className="mt-7 w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition"
            >
              Register Again
              <ArrowRight size={19} />
            </Link>

            <Link
              to="/login"
              className="mt-3 w-full py-3.5 border-2 border-gray-200 rounded-2xl flex items-center justify-center font-bold text-gray-800 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition"
            >
              Go to Login
            </Link>

          </div>
        )}

      </div>

    </div>
  );
}