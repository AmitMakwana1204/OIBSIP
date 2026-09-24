import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Package,
  Edit3,
  LogOut,
  Save,
  X,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Home,
  Lock,
  Eye,
  EyeOff,
  Camera,
  ChevronRight,
  ShoppingBag,
  CircleUserRound,
  KeyRound,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getCurrentUser,
  updateUserProfile,
  changeUserPassword,
} from "../services/api";

import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const {
    user,
    updateUser,
    logout,
  } = useAuth();

  // =========================================================
  // STATE
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getCurrentUser();

        const userData =
          response?.data?.user;

        if (!userData) {
          throw new Error(
            "User data not found."
          );
        }

        setFormData({
          name: userData.name || "",
          phone: userData.phone || "",
          address: userData.address || "",
          city: userData.city || "",
          state: userData.state || "",
          pincode: userData.pincode || "",
        });

        updateUser(userData);
      } catch (err) {
        console.error(
          "Profile loading error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  // =========================================================
  // PASSWORD INPUT
  // =========================================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  // =========================================================
  // VALIDATE PROFILE
  // =========================================================

  const validateProfile = () => {
    if (!formData.name.trim()) {
      return "Please enter your name.";
    }

    if (
      !/^[0-9]{10}$/.test(
        formData.phone.trim()
      )
    ) {
      return "Please enter a valid 10 digit phone number.";
    }

    if (!formData.address.trim()) {
      return "Please enter your delivery address.";
    }

    if (!formData.city.trim()) {
      return "Please enter your city.";
    }

    if (!formData.state.trim()) {
      return "Please enter your state.";
    }

    if (
      !/^[0-9]{6}$/.test(
        formData.pincode.trim()
      )
    ) {
      return "Please enter a valid 6 digit pincode.";
    }

    return "";
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = async () => {
    const validationError =
      validateProfile();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response =
        await updateUserProfile({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        });

      const updatedUser =
        response?.data?.user;

      if (!updatedUser) {
        throw new Error(
          "Updated user data not received."
        );
      }

      updateUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
        city: updatedUser.city || "",
        state: updatedUser.state || "",
        pincode: updatedUser.pincode || "",
      });

      setEditing(false);

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Profile update error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      pincode: user?.pincode || "",
    });

    setEditing(false);
    setError("");
    setMessage("");
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Current password
    if (!passwordData.currentPassword) {
      setError(
        "Please enter your current password."
      );
      return;
    }

    // New password
    if (!passwordData.newPassword) {
      setError(
        "Please enter a new password."
      );
      return;
    }

    // Backend accepts minimum 6 characters.
    // UI keeps minimum 8 characters for stronger password.
    if (
      passwordData.newPassword.length < 8
    ) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    // Confirm password
    if (!passwordData.confirmPassword) {
      setError(
        "Please confirm your new password."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      const response =
        await changeUserPassword({
          currentPassword:
            passwordData.currentPassword,

          newPassword:
            passwordData.newPassword,

          confirmPassword:
            passwordData.confirmPassword,
        });

      setMessage(
        response?.data?.message ||
          "Password changed successfully."
      );

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Hide password
      setShowPassword(false);
    } catch (err) {
      console.error(
        "Change password error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // ADDRESS
  // =========================================================

  const fullAddress = [
    formData.address,
    formData.city,
    formData.state,
    formData.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#fafafa] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
              <Loader2
                size={34}
                className="text-red-600 animate-spin"
              />
            </div>

            <p className="mt-4 text-sm font-bold text-gray-500">
              Loading your profile...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fafafa]">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>
                <div className="flex items-center gap-2 text-red-600 text-xs font-black uppercase tracking-widest">
                  <span className="w-2 h-2 bg-red-600 rounded-full" />
                  Account
                </div>

                <h1 className="text-3xl md:text-4xl font-black mt-2 text-gray-900">
                  My Profile
                </h1>

                <p className="text-gray-500 mt-2">
                  Manage your account and delivery
                  information.
                </p>
              </div>

              {activeTab === "profile" &&
                (!editing ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(true);
                      setMessage("");
                      setError("");
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition shadow-lg shadow-red-200"
                  >
                    <Edit3 size={18} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl font-bold hover:border-red-300 transition disabled:opacity-50"
                    >
                      <X size={18} />
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* ===================================================
              MESSAGES
          =================================================== */}

          {message && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2
                size={20}
                className="shrink-0 mt-0.5"
              />

              <p className="font-bold text-sm">
                {message}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 flex items-start gap-3">
              <X
                size={20}
                className="shrink-0 mt-0.5"
              />

              <p className="font-bold text-sm">
                {error}
              </p>
            </div>
          )}

          {/* ===================================================
              PROFILE HERO
          =================================================== */}

          <div className="bg-white border border-gray-200 rounded-[28px] shadow-sm overflow-hidden">

            {/* COVER */}

            <div className="relative h-40 md:h-48 overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-orange-500">

              <div className="absolute -top-28 left-[38%] w-72 h-72 rounded-full bg-white/10" />

              <div className="absolute -bottom-32 right-16 w-64 h-64 rounded-full bg-white/10" />

              <div className="absolute -top-24 right-24 w-56 h-56 rounded-full bg-white/5" />

              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5" />
            </div>

            {/* PROFILE INFORMATION */}

            <div className="relative px-5 sm:px-7 md:px-9">

              <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-7">

                {/* AVATAR */}

                <div className="relative -mt-14 md:-mt-16 shrink-0">

                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-[28px] bg-white p-2 shadow-xl">

                    <div className="w-full h-full rounded-[22px] bg-red-50 flex items-center justify-center text-red-600">

                      <CircleUserRound
                        size={58}
                        strokeWidth={1.8}
                      />

                    </div>
                  </div>

                  <button
                    type="button"
                    title="Change profile photo"
                    className="absolute -right-2 -bottom-2 w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-lg border-4 border-white hover:bg-red-600 transition"
                  >
                    <Camera size={17} />
                  </button>

                </div>

                {/* USER DETAILS */}

                <div className="flex-1 min-w-0 pb-6 md:pb-7 pt-1 md:pt-0">

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div className="min-w-0">

                      <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                        {user?.name || "User"}
                      </h2>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">

                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Mail
                            size={16}
                            className="text-gray-400 shrink-0"
                          />

                          <span className="break-all">
                            {user?.email ||
                              "No email available"}
                          </span>
                        </div>

                        {user?.phone && (
                          <>
                            <span className="hidden sm:block text-gray-300">
                              •
                            </span>

                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Phone
                                size={15}
                                className="text-gray-400 shrink-0"
                              />

                              <span>
                                {user.phone}
                              </span>
                            </div>
                          </>
                        )}

                      </div>
                    </div>

                    {/* VERIFIED STATUS */}

                    <div className="shrink-0">

                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black border ${
                          user?.isVerified
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-yellow-50 text-yellow-700 border-yellow-100"
                        }`}
                      >

                        <ShieldCheck
                          size={18}
                        />

                        <span>
                          {user?.isVerified
                            ? "Verified Account"
                            : "Email Not Verified"}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ===================================================
              TABS
          =================================================== */}

          <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-2 shadow-sm flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() => {
                setActiveTab("profile");
                setError("");
                setMessage("");
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === "profile"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <User size={17} />
              Profile
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("security");
                setError("");
                setMessage("");
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === "security"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Lock size={17} />
              Security
            </button>

          </div>

          {/* ===================================================
              PROFILE TAB
          =================================================== */}

          {activeTab === "profile" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-7">

                {/* PERSONAL INFORMATION */}

                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 md:p-7 shadow-sm">

                  <div className="flex items-center gap-3 mb-7">

                    <div className="w-11 h-11 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                      <User size={21} />
                    </div>

                    <div>
                      <p className="text-xs text-red-600 font-black uppercase tracking-widest">
                        Account Details
                      </p>

                      <h2 className="text-xl font-black mt-1">
                        Personal Information
                      </h2>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* NAME */}

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Full Name
                      </label>

                      <div className="relative">

                        <User
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!editing}
                          autoComplete="name"
                          className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:bg-gray-50 disabled:text-gray-600 transition"
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
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 text-gray-500"
                        />

                      </div>
                    </div>

                    {/* PHONE */}

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Phone Number
                      </label>

                      <div className="relative">

                        <Phone
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!editing}
                          maxLength={10}
                          inputMode="numeric"
                          autoComplete="tel"
                          placeholder="10 digit number"
                          className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:bg-gray-50 disabled:text-gray-600 transition"
                        />

                      </div>
                    </div>

                    {/* ACCOUNT STATUS */}

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Account Status
                      </label>

                      <div className="flex items-center gap-3 px-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50">

                        <ShieldCheck
                          size={20}
                          className="text-green-600"
                        />

                        <span className="text-sm font-bold text-gray-700">
                          {user?.isVerified
                            ? "Email Verified"
                            : "Email Not Verified"}
                        </span>

                      </div>
                    </div>

                  </div>
                </div>

                {/* QUICK ACTIONS */}

                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-7 shadow-sm">

                  <p className="text-xs text-red-600 font-black uppercase tracking-widest">
                    Quick Access
                  </p>

                  <h2 className="text-xl font-black mt-2 mb-5">
                    Your PizzaHub
                  </h2>

                  <div className="space-y-3">

                    <Link
                      to="/orders"
                      className="flex items-center justify-between gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-red-50 hover:border-red-100 transition group"
                    >

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                          <Package size={20} />
                        </div>

                        <div>
                          <p className="font-black">
                            My Orders
                          </p>

                          <p className="text-xs text-gray-500">
                            Track your pizza orders
                          </p>
                        </div>

                      </div>

                      <ChevronRight
                        size={18}
                        className="text-gray-400 group-hover:text-red-600"
                      />

                    </Link>

                    <Link
                      to="/pizza-builder"
                      className="flex items-center justify-between gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-red-50 hover:border-red-100 transition group"
                    >

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                          🍕
                        </div>

                        <div>
                          <p className="font-black">
                            Build Your Pizza
                          </p>

                          <p className="text-xs text-gray-500">
                            Create your perfect pizza
                          </p>
                        </div>

                      </div>

                      <ChevronRight
                        size={18}
                        className="text-gray-400 group-hover:text-red-600"
                      />

                    </Link>

                    <Link
                      to="/"
                      className="flex items-center justify-between gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-red-50 hover:border-red-100 transition group"
                    >

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                          <ShoppingBag size={20} />
                        </div>

                        <div>
                          <p className="font-black">
                            Continue Shopping
                          </p>

                          <p className="text-xs text-gray-500">
                            Explore delicious pizzas
                          </p>
                        </div>

                      </div>

                      <ChevronRight
                        size={18}
                        className="text-gray-400 group-hover:text-red-600"
                      />

                    </Link>

                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl hover:bg-red-100 transition text-left"
                    >

                      <div className="w-11 h-11 bg-white text-red-600 rounded-xl flex items-center justify-center">
                        <LogOut size={20} />
                      </div>

                      <div>
                        <p className="font-black text-red-600">
                          Logout
                        </p>

                        <p className="text-xs text-gray-500">
                          Sign out of PizzaHub
                        </p>
                      </div>

                    </button>

                  </div>
                </div>

              </div>

              {/* DELIVERY ADDRESS */}

              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-7 shadow-sm mt-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                      <MapPin size={21} />
                    </div>

                    <div>
                      <p className="text-xs text-orange-600 font-black uppercase tracking-widest">
                        Delivery
                      </p>

                      <h2 className="text-xl font-black mt-1">
                        Delivery Address
                      </h2>
                    </div>

                  </div>

                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl text-xs font-black">
                    <Home size={16} />
                    Delivery Available
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* ADDRESS */}

                  <div className="md:col-span-2">

                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Address
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!editing}
                      rows={3}
                      autoComplete="street-address"
                      placeholder="House / Flat / Street / Area"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 outline-none resize-none focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:bg-gray-50 disabled:text-gray-600 transition"
                    />

                  </div>

                  {/* CITY */}

                  <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!editing}
                      autoComplete="address-level2"
                      placeholder="Enter city"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:bg-gray-50 disabled:text-gray-600 transition"
                    />

                  </div>

                  {/* STATE */}

                  <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={!editing}
                      autoComplete="address-level1"
                      placeholder="Enter state"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:bg-gray-50 disabled:text-gray-600 transition"
                    />

                  </div>

                  {/* PINCODE */}

                  <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      disabled={!editing}
                      maxLength={6}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="6 digit pincode"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:bg-gray-50 disabled:text-gray-600 transition"
                    />

                  </div>

                </div>

                {/* ADDRESS PREVIEW */}

                {fullAddress && !editing && (
                  <div className="mt-6 p-5 bg-[#fff7ed] border border-orange-100 rounded-2xl">

                    <div className="flex gap-3">

                      <MapPin
                        size={20}
                        className="text-red-600 mt-1 shrink-0"
                      />

                      <div>

                        <p className="text-xs text-red-600 font-black uppercase tracking-widest">
                          Saved Address
                        </p>

                        <p className="text-gray-700 font-semibold mt-1 leading-relaxed">
                          {fullAddress}
                        </p>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            </>
          )}

          {/* ===================================================
              SECURITY TAB
          =================================================== */}

          {activeTab === "security" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-7">

              {/* CHANGE PASSWORD */}

              <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 md:p-7 shadow-sm">

                <div className="flex items-center gap-3 mb-7">

                  <div className="w-11 h-11 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                    <KeyRound size={21} />
                  </div>

                  <div>

                    <p className="text-xs text-red-600 font-black uppercase tracking-widest">
                      Security
                    </p>

                    <h2 className="text-xl font-black mt-1">
                      Change Password
                    </h2>

                  </div>

                </div>

                <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-5"
                >

                  {/* CURRENT PASSWORD */}

                  <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Current Password
                    </label>

                    <div className="relative">

                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="currentPassword"
                        value={
                          passwordData.currentPassword
                        }
                        onChange={
                          handlePasswordChange
                        }
                        autoComplete="current-password"
                        placeholder="Enter current password"
                        className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-2xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 transition"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>
                  </div>

                  {/* NEW PASSWORD */}

                  <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      New Password
                    </label>

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="newPassword"
                      value={
                        passwordData.newPassword
                      }
                      onChange={
                        handlePasswordChange
                      }
                      autoComplete="new-password"
                      placeholder="Minimum 8 characters"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 transition"
                    />

                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Confirm New Password
                    </label>

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={
                        passwordData.confirmPassword
                      }
                      onChange={
                        handlePasswordChange
                      }
                      autoComplete="new-password"
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 transition"
                    />

                  </div>

                  {/* UPDATE PASSWORD */}

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 text-white rounded-xl font-black hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        Update Password
                      </>
                    )}
                  </button>

                </form>

              </div>

              {/* SECURITY INFO */}

              <div className="bg-gray-900 rounded-3xl p-6 md:p-7 text-white h-fit">

                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-5">
                  <ShieldCheck size={24} />
                </div>

                <h2 className="text-xl font-black">
                  Account Security
                </h2>

                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Keep your account secure by using a
                  strong password and protecting your
                  login credentials.
                </p>

                <div className="mt-6 space-y-3">

                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2
                      size={18}
                      className="text-green-400"
                    />
                    <span>
                      Email authentication
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2
                      size={18}
                      className="text-green-400"
                    />
                    <span>
                      Protected profile
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2
                      size={18}
                      className="text-green-400"
                    />
                    <span>
                      Secure account access
                    </span>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ===================================================
              BOTTOM CTA
          =================================================== */}

          <div className="mt-7 bg-gray-900 rounded-3xl p-6 md:p-8 text-white">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>

                <p className="text-red-500 text-xs font-black uppercase tracking-widest">
                  Hungry?
                </p>

                <h2 className="text-2xl md:text-3xl font-black mt-1">
                  Ready for your next pizza? 🍕
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Choose your favourite pizza and
                  order it in a few clicks.
                </p>

              </div>

              <Link
                to="/"
                className="shrink-0 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3.5 rounded-xl font-black transition"
              >
                Order Now
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}