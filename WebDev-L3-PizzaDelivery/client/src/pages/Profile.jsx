import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Package,
  Edit3,
  LogOut,
  ArrowLeft,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../components/Navbar";

export default function Profile() {
  const navigate = useNavigate();

  // =========================================================
  // USER STATE
  // =========================================================

  const [user, setUser] = useState(null);

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [saved, setSaved] = useState(false);

  // =========================================================
  // LOAD USER
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem("pizzahub_token");
    const storedUser = localStorage.getItem("pizzahub_user");

    // User not logged in
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);

        setFormData({
          name:
            parsedUser?.name ||
            parsedUser?.fullName ||
            parsedUser?.username ||
            "",
          phone: parsedUser?.phone || "",
        });
      }
    } catch (error) {
      console.error("Profile user load error:", error);
    }
  }, [navigate]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      name: formData.name,
      phone: formData.phone,
    };

    localStorage.setItem(
      "pizzahub_user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

    setEditing(false);
    setSaved(true);

    // Update Navbar immediately
    window.dispatchEvent(new Event("authChanged"));

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancelEdit = () => {
    setFormData({
      name:
        user?.name ||
        user?.fullName ||
        user?.username ||
        "",
      phone: user?.phone || "",
    });

    setEditing(false);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("pizzahub_token");
    localStorage.removeItem("pizzahub_user");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (!user) {
    return (
      <>
        <Navbar />

        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto" />

            <p className="mt-4 text-sm text-gray-500 font-medium">
              Loading profile...
            </p>
          </div>
        </div>
      </>
    );
  }

  // =========================================================
  // USER DETAILS
  // =========================================================

  const userName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "User";

  const userEmail = user?.email || "No email available";

  const userPhone = user?.phone || "Not added";

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* =================================================
            BACK BUTTON
        ================================================== */}

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition mb-6"
        >
          <ArrowLeft size={17} />

          Back to Menu
        </Link>

        {/* =================================================
            PROFILE HEADER
        ================================================== */}

        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-red-500/10">

          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5">

            {/* Avatar */}

            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">

              <User
                size={42}
                strokeWidth={1.8}
              />

            </div>

            {/* User */}

            <div className="text-center sm:text-left flex-1">

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                <h1 className="text-2xl sm:text-3xl font-black">
                  {userName}
                </h1>

                <span className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-xs font-bold w-fit mx-auto sm:mx-0">
                  <ShieldCheck size={13} />
                  Verified
                </span>

              </div>

              <p className="mt-1 text-white/80 text-sm">
                {userEmail}
              </p>

              <p className="mt-1 text-white/70 text-xs">
                Welcome back to PizzaHub 🍕
              </p>

            </div>

            {/* Edit */}

            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-red-600 font-bold text-sm hover:bg-red-50 transition shadow-lg"
              >
                <Edit3 size={16} />

                Edit Profile
              </button>
            )}

          </div>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================== */}

        {saved && (
          <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700">

            <CheckCircle2 size={19} />

            <p className="text-sm font-bold">
              Profile updated successfully.
            </p>

          </div>
        )}

        {/* =================================================
            CONTENT GRID
        ================================================== */}

        <div className="grid lg:grid-cols-3 gap-6 mt-6">

          {/* =================================================
              PERSONAL INFORMATION
          ================================================== */}

          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Header */}

            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-black text-gray-900">
                  Personal Information
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Manage your account information
                </p>

              </div>

              {!editing && (
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <User size={18} />
                </div>
              )}

            </div>

            {/* Body */}

            <div className="p-6">

              {editing ? (
                <div className="space-y-5">

                  {/* NAME */}

                  <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name
                    </label>

                    <div className="relative">

                      <User
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition"
                      />

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address
                    </label>

                    <div className="relative">

                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="email"
                        value={userEmail}
                        disabled
                        className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                      />

                    </div>

                    <p className="text-[11px] text-gray-400 mt-1.5">
                      Email address cannot be changed here.
                    </p>

                  </div>

                  {/* PHONE */}

                  <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number
                    </label>

                    <div className="relative">

                      <Phone
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition"
                      />

                    </div>

                  </div>

                  {/* BUTTONS */}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">

                    <button
                      type="button"
                      onClick={handleSave}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition"
                    >
                      <Save size={17} />

                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition"
                    >
                      <X size={17} />

                      Cancel
                    </button>

                  </div>

                </div>
              ) : (
                <div className="space-y-4">

                  {/* NAME */}

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">

                    <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <User size={19} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Full Name
                      </p>

                      <p className="font-bold text-gray-900 mt-1 truncate">
                        {userName}
                      </p>

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">

                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Mail size={19} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Email Address
                      </p>

                      <p className="font-bold text-gray-900 mt-1 truncate">
                        {userEmail}
                      </p>

                    </div>

                  </div>

                  {/* PHONE */}

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">

                    <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                      <Phone size={19} />
                    </div>

                    <div>

                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Phone Number
                      </p>

                      <p className="font-bold text-gray-900 mt-1">
                        {userPhone}
                      </p>

                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================== */}

          <div className="space-y-6">

            {/* MY ORDERS */}

            <Link
              to="/orders"
              className="block bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-0.5 transition"
            >

              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Package size={21} />
              </div>

              <h3 className="font-black text-gray-900">
                My Orders
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                View and track all your pizza orders.
              </p>

              <div className="mt-4 text-sm font-bold text-red-600">
                View Orders →
              </div>

            </Link>

            {/* ACCOUNT STATUS */}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

              <div className="flex items-center gap-3 mb-4">

                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>

                <div>

                  <h3 className="font-black text-gray-900">
                    Account Status
                  </h3>

                  <p className="text-xs text-gray-400">
                    Your account information
                  </p>

                </div>

              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">

                <span className="text-sm text-gray-500">
                  Email
                </span>

                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  Verified
                </span>

              </div>

              <div className="flex items-center justify-between py-3">

                <span className="text-sm text-gray-500">
                  Account
                </span>

                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  Active
                </span>

              </div>

            </div>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white border border-red-100 text-red-600 font-bold text-sm hover:bg-red-50 transition"
            >

              <LogOut size={18} />

              Logout

            </button>

          </div>

        </div>

      </main>

    </div>
  );
}