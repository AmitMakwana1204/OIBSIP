import { Link } from "react-router-dom";
import { LockKeyhole, Pizza, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">

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

          <form className="space-y-5">

            <div>
              <label className="block text-sm font-bold mb-2">
                Admin Email
              </label>

              <input
                type="email"
                placeholder="admin@pizzahub.com"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2">
              <LockKeyhole size={18} />
              Login to Admin Panel
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