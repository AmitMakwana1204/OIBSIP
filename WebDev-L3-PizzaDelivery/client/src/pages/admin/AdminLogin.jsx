import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Pizza, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { adminLoginApi } from "../../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your admin email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await adminLoginApi({
        email: email.trim(),
        password,
      });

      if (res.data && res.data.token) {
        localStorage.setItem("pizzahub_admin_token", res.data.token);
        localStorage.setItem("pizzahub_admin_user", JSON.stringify(res.data.admin));
        navigate("/admin/dashboard");
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Admin login failed. Please check credentials.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="text-center text-white mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-red-950">
            <Pizza size={30} />
          </div>

          <h1 className="text-3xl font-black mt-5">
            Pizza<span className="text-red-500">Hub</span>
          </h1>

          <p className="text-gray-500 mt-2">
            Administrator Portal
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h2 className="font-black text-xl">
                Admin Login
              </h2>

              <p className="text-xs text-gray-500">
                Secure administrator access
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Admin Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pizzahub.com"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-red-200"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <LockKeyhole size={18} />
                  <span>Login to Admin Panel</span>
                </>
              )}
            </button>
          </form>

          <Link
            to="/"
            className="block text-center text-sm text-gray-500 hover:text-red-600 mt-6"
          >
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}