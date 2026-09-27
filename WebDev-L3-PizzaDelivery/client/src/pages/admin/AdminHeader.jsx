import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  Search,
  LogOut,
  ChevronDown,
  X,
  Command,
} from "lucide-react";

import api from "../../services/api";

export default function AdminHeader({ setMobileOpen }) {
  const navigate = useNavigate();

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // =====================================================
  // ADMIN USER
  // =====================================================

  const [adminUser, setAdminUser] = useState({
    name: "Admin",
    email: "admin@pizzahub.com",
    role: "admin",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(
        "pizzahub_admin_user"
      );

      if (stored) {
        setAdminUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error(
        "Admin user error:",
        error
      );
    }
  }, []);

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get(
        "/admin/notifications"
      );

      console.log(
        "🔔 Notifications API response:",
        data
      );

      setNotifications(
        Array.isArray(data?.notifications)
          ? data.notifications
          : []
      );
    } catch (error) {
      console.error(
        "❌ Failed to fetch notifications:",
        error.response?.data ||
          error.message
      );
    }
  };

  // =====================================================
  // FETCH NOTIFICATIONS ON LOAD
  // AND EVERY 15 SECONDS
  // =====================================================

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================================
  // UNREAD COUNT
  // =====================================================

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // =====================================================
  // MARK SINGLE NOTIFICATION AS READ
  // =====================================================

  const markNotificationRead = async (id) => {
    try {
      await api.patch(
        `/admin/notifications/${id}/read`
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "❌ Failed to mark notification as read:",
        error.response?.data ||
          error.message
      );
    }
  };

  // =====================================================
  // MARK ALL NOTIFICATIONS AS READ
  // =====================================================

  const markAllNotificationsRead = async () => {
    try {
      await api.patch(
        "/admin/notifications/read-all"
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error(
        "❌ Failed to mark all notifications as read:",
        error.response?.data ||
          error.message
      );
    }
  };

  // =====================================================
  // TIME FORMAT
  // =====================================================

  const formatNotificationTime = (date) => {
    if (!date) return "";

    const notificationDate =
      new Date(date);

    const now = new Date();

    const diff = Math.floor(
      (now.getTime() -
        notificationDate.getTime()) /
        1000
    );

    if (diff < 60) {
      return "Just now";
    }

    if (diff < 3600) {
      return `${Math.floor(
        diff / 60
      )} min ago`;
    }

    if (diff < 86400) {
      return `${Math.floor(
        diff / 3600
      )} hr ago`;
    }

    if (diff < 604800) {
      return `${Math.floor(
        diff / 86400
      )} days ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "pizzahub_admin_token"
    );

    localStorage.removeItem(
      "pizzahub_admin_user"
    );

    navigate("/admin/login");
  };

  // =====================================================
  // NOTIFICATION CLICK
  // =====================================================

  const handleNotificationClick = async (
    notification
  ) => {
    if (!notification?.read) {
      await markNotificationRead(
        notification._id
      );
    }

    if (notification?.orderId) {
      setNotificationOpen(false);

      navigate(
        `/admin/orders/${notification.orderId}`
      );
    }
  };

  // =====================================================
  // OPEN NOTIFICATION
  // =====================================================

  const handleNotificationToggle = () => {
    setNotificationOpen(
      (prev) => !prev
    );

    setProfileOpen(false);

    // Refresh immediately when opening
    if (!notificationOpen) {
      fetchNotifications();
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <header className="sticky top-0 z-40 h-20 bg-white/95 backdrop-blur-xl border-b border-gray-100">
      <div className="h-full flex items-center justify-between px-4 sm:px-5 lg:px-8">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="flex items-center gap-3">

          {/* Mobile Menu */}

          <button
            onClick={() =>
              setMobileOpen(true)
            }
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
            onClick={() =>
              setSearchOpen(true)
            }
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
              onClick={
                handleNotificationToggle
              }
              className="relative w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 flex items-center justify-center transition"
              aria-label="Notifications"
            >

              <Bell size={19} />

              {/* UNREAD BADGE */}

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}

            </button>

            {/* =================================================
                NOTIFICATION DROPDOWN
            ================================================= */}

            {notificationOpen && (
              <div className="absolute right-0 mt-3 w-[360px] sm:w-96 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 overflow-hidden">

                {/* Header */}

                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">

                  <div>

                    <h3 className="font-bold text-gray-900">
                      Notifications
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Recent admin alerts
                    </p>

                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={
                        markAllNotificationsRead
                      }
                      className="text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      Mark all read
                    </button>
                  )}

                </div>

                {/* Notification List */}

                <div className="max-h-[420px] overflow-y-auto">

                  {notifications.length === 0 ? (
                    <div className="py-12 text-center">

                      <Bell
                        size={34}
                        className="mx-auto text-gray-300"
                      />

                      <p className="mt-3 text-sm font-medium text-gray-500">
                        No notifications
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        You're all caught up
                      </p>

                    </div>
                  ) : (
                    notifications.map(
                      (notification) => (
                        <div
                          key={notification._id}
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                          className={`px-5 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                            !notification.read
                              ? "bg-red-50/40"
                              : ""
                          }`}
                        >

                          <div className="flex gap-3">

                            {/* ICON */}

                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                !notification.read
                                  ? "bg-red-100 text-red-600"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              <Bell size={18} />
                            </div>

                            {/* CONTENT */}

                            <div className="flex-1 min-w-0">

                              <div className="flex items-start justify-between gap-2">

                                <h4 className="text-sm font-bold text-gray-900">
                                  {notification.title}
                                </h4>

                                {!notification.read && (
                                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                )}

                              </div>

                              <p className="text-xs text-gray-600 mt-1 leading-5">
                                {notification.message}
                              </p>

                              <p className="text-[11px] text-gray-400 mt-2">
                                {formatNotificationTime(
                                  notification.createdAt
                                )}
                              </p>

                            </div>

                          </div>

                        </div>
                      )
                    )
                  )}

                </div>

                {/* Footer */}

                {notifications.length > 0 && (
                  <div className="px-5 py-3 border-t bg-gray-50">

                    <button
                      onClick={() => {
                        setNotificationOpen(false);
                        navigate(
                          "/admin/notifications"
                        );
                      }}
                      className="w-full text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      View all notifications
                    </button>

                  </div>
                )}

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
                setProfileOpen(
                  !profileOpen
                );

                setNotificationOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-gray-50 transition"
            >

              {/* Avatar */}

              <div className="relative">

                <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center font-black shadow-sm uppercase">
                  {adminUser.name
                    ? adminUser.name[0]
                    : "A"}
                </div>

                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />

              </div>

              {/* User Info */}

              <div className="hidden sm:block text-left">

                <p className="text-sm font-bold leading-5">
                  {adminUser.name ||
                    "Admin"}
                </p>

                <p className="text-[11px] text-gray-400 capitalize">
                  {adminUser.role ||
                    "Super Admin"}
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

                <div className="p-4 bg-gray-50">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center font-black uppercase">
                      {adminUser.name
                        ? adminUser.name[0]
                        : "A"}
                    </div>

                    <div className="min-w-0">

                      <p className="font-black truncate">
                        {adminUser.name ||
                          "Admin"}
                      </p>

                      <p className="text-xs text-gray-400 truncate">
                        {adminUser.email ||
                          "admin@pizzahub.com"}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="border-t border-gray-100 p-2">

                  <button
                    onClick={
                      handleLogout
                    }
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                  >
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
              onClick={() =>
                setSearchOpen(false)
              }
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