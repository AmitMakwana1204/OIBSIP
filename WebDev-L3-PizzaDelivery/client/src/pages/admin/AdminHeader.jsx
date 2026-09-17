import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Menu,
  Search,
  Settings,
  User,
  LogOut,
  ChevronDown,
  CheckCircle2,
  ShoppingBag,
  Package,
  X,
  Command,
} from "lucide-react";

export default function AdminHeader({ setMobileOpen }) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  /* =====================================================
     CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  ===================================================== */

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 h-20 bg-white/95 backdrop-blur-xl border-b border-gray-100">

      <div className="h-full flex items-center justify-between px-4 sm:px-5 lg:px-8">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="flex items-center gap-3">

          {/* Mobile Menu */}

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Desktop Search */}

          <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-100 focus-within:border-red-200 focus-within:ring-4 focus-within:ring-red-50 rounded-xl px-4 py-2.5 w-72 lg:w-96 transition">

            <Search
              size={18}
              className="text-gray-400 shrink-0"
            />

            <input
              type="text"
              placeholder="Search orders, customers..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
            />

            <div className="hidden lg:flex items-center gap-1 text-[10px] text-gray-400 border border-gray-200 bg-white rounded-md px-1.5 py-1">
              <Command size={10} />
              <span>K</span>
            </div>

          </div>

          {/* Mobile Search */}

          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition"
            aria-label="Search"
          >
            <Search size={19} />
          </button>

        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* Online Status */}

          <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50">

            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />

              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>

            <span className="text-xs font-bold text-green-700">
              System Online
            </span>

          </div>

          {/* =================================================
              NOTIFICATION
          ================================================= */}

          <div
            ref={notificationRef}
            className="relative"
          >

            <button
              onClick={() => {
                setNotificationOpen(
                  !notificationOpen
                );
                setProfileOpen(false);
              }}
              className="relative w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 flex items-center justify-center transition"
              aria-label="Notifications"
            >

              <Bell size={19} />

              {/* Notification dot */}

              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60 animate-ping" />

                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 border-2 border-white" />
              </span>

            </button>

            {/* Notification Dropdown */}

            {notificationOpen && (
              <div className="absolute right-0 top-14 w-[350px] max-w-[calc(100vw-32px)] bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/60 overflow-hidden">

                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">

                  <div>
                    <h3 className="font-black">
                      Notifications
                    </h3>

                    <p className="text-xs text-gray-400 mt-0.5">
                      You have 3 unread notifications
                    </p>
                  </div>

                  <button className="text-xs font-bold text-red-600 hover:text-red-700">
                    Mark all read
                  </button>

                </div>

                <div className="divide-y divide-gray-100">

                  <NotificationItem
                    icon={ShoppingBag}
                    title="New order received"
                    message="Order #PH1024 has been placed."
                    time="2 min ago"
                    type="red"
                  />

                  <NotificationItem
                    icon={Package}
                    title="Low stock alert"
                    message="Mozzarella is running low."
                    time="18 min ago"
                    type="orange"
                  />

                  <NotificationItem
                    icon={CheckCircle2}
                    title="Order delivered"
                    message="Order #PH1021 was delivered."
                    time="32 min ago"
                    type="green"
                  />

                </div>

                <button className="w-full py-3 text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-gray-50 transition">
                  View all notifications
                </button>

              </div>
            )}

          </div>

          {/* Divider */}

          <div className="hidden sm:block h-8 w-px bg-gray-200" />

          {/* =================================================
              PROFILE
          ================================================= */}

          <div
            ref={profileRef}
            className="relative"
          >

            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-gray-50 transition"
            >

              {/* Avatar */}

              <div className="relative">

                <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center font-black shadow-sm">
                  A
                </div>

                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />

              </div>

              {/* User info */}

              <div className="hidden sm:block text-left">

                <p className="text-sm font-bold leading-5">
                  Admin
                </p>

                <p className="text-[11px] text-gray-400">
                  Super Admin
                </p>

              </div>

              <ChevronDown
                size={15}
                className={`hidden sm:block text-gray-400 transition-transform ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>

            {/* Profile Dropdown */}

            {profileOpen && (
              <div className="absolute right-0 top-14 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/60 overflow-hidden">

                {/* Profile Header */}

                <div className="p-4 bg-gray-50">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">
                      A
                    </div>

                    <div>
                      <p className="font-black">
                        Admin
                      </p>

                      <p className="text-xs text-gray-400">
                        Super Administrator
                      </p>
                    </div>

                  </div>

                </div>

                {/* Menu */}

                <div className="p-2">

                  <ProfileMenuItem
                    icon={User}
                    label="My Profile"
                  />

                  <ProfileMenuItem
                    icon={Settings}
                    label="Settings"
                  />

                </div>

                <div className="border-t border-gray-100 p-2">

                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition">

                    <LogOut size={17} />

                    Logout

                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ===================================================
          MOBILE SEARCH OVERLAY
      =================================================== */}

      {searchOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white border-b border-gray-100 p-4 shadow-xl md:hidden">

          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">

            <Search
              size={18}
              className="text-gray-400"
            />

            <input
              autoFocus
              type="text"
              placeholder="Search orders, customers..."
              className="bg-transparent outline-none text-sm w-full"
            />

            <button
              onClick={() => setSearchOpen(false)}
              className="text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>

          </div>

        </div>
      )}

    </header>
  );
}

/* =========================================================
   NOTIFICATION ITEM
========================================================= */

function NotificationItem({
  icon: Icon,
  title,
  message,
  time,
  type,
}) {

  const styles = {
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="p-4 flex gap-3 hover:bg-gray-50 transition cursor-pointer">

      <div
        className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${styles[type]}`}
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0">

        <p className="text-sm font-bold">
          {title}
        </p>

        <p className="text-xs text-gray-500 mt-0.5">
          {message}
        </p>

        <p className="text-[11px] text-gray-400 mt-1">
          {time}
        </p>

      </div>

      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 ml-auto shrink-0" />

    </div>
  );
}

/* =========================================================
   PROFILE MENU ITEM
========================================================= */

function ProfileMenuItem({
  icon: Icon,
  label,
}) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">

      <Icon
        size={17}
        className="text-gray-400"
      />

      {label}

    </button>
  );
}