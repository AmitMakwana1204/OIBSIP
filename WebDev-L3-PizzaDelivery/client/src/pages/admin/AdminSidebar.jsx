import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Pizza,
  X,
  Users,
  Settings,
  ChevronRight,
  CircleHelp,
  Activity,
} from "lucide-react";

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
}) {
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] = useState(false);

  const mainLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: Package,
      badge: "5",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
      badge: "12",
    },
  ];

  // const accountLinks = [];

  const handleLogout = () => {
    setLoggingOut(true);

    // Later:
    // localStorage.removeItem("adminToken");

    setTimeout(() => {
      navigate("/admin/login");
    }, 400);
  };

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed lg:sticky
          z-50
          top-0
          left-0
          h-screen
          w-72
          bg-gray-950
          text-white
          flex
          flex-col
          border-r
          border-gray-900
          shadow-2xl
          transform
          transition-transform
          duration-300
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="h-20 px-5 flex items-center justify-between border-b border-gray-800/80">

          <div className="flex items-center gap-3">

            <div className="relative">

              <div className="w-11 h-11 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-950/40">
                <Pizza size={23} />
              </div>

              <span className="absolute -right-1 -bottom-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-gray-950" />

            </div>

            <div>

              <h1 className="font-black text-xl tracking-tight">
                Pizza<span className="text-red-500">Hub</span>
              </h1>

              <p className="text-[9px] uppercase tracking-[0.22em] text-gray-500 font-bold">
                Admin Console
              </p>

            </div>

          </div>

          {/* Mobile Close */}

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-9 h-9 rounded-xl bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center transition"
          >
            <X size={19} />
          </button>

        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin">

          {/* Main */}

          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-black px-4 py-3">
            Management
          </p>

          <div className="space-y-1.5">

            {mainLinks.map((link) => (
              <SidebarLink
                key={link.path}
                link={link}
                setMobileOpen={setMobileOpen}
              />
            ))}

          </div>

          {/* Account */}
{/* 
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-black px-4 pt-7 pb-3">
            Account
          </p>

          <div className="space-y-1.5">

            {accountLinks.map((link) => (
              <SidebarLink
                key={link.path}
                link={link}
                setMobileOpen={setMobileOpen}
              />
            ))}

          </div> */}

          {/* =================================================
              HELP CARD
          ================================================= */}

          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800">

            <div className="w-9 h-9 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center mb-3">
              <CircleHelp size={18} />
            </div>

            <p className="text-sm font-bold">
              Need help?
            </p>

            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Contact PizzaHub support for assistance.
            </p>

            <button className="mt-3 text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1">
              Contact Support
              <ChevronRight size={13} />
            </button>

          </div>

        </nav>

        {/* =================================================
            SYSTEM STATUS
        ================================================= */}

        <div className="px-4 pb-3">

          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-800">

            <div className="flex items-center gap-2">

              <span className="relative flex h-2.5 w-2.5">

                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping" />

                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />

              </span>

              <span className="text-xs font-semibold text-gray-400">
                System Online
              </span>

            </div>

            <Activity
              size={14}
              className="text-green-500"
            />

          </div>

        </div>

        {/* =================================================
            ADMIN PROFILE
        ================================================= */}

        <div className="p-4 border-t border-gray-800">

          <div className="flex items-center gap-3 p-2 mb-2 rounded-xl hover:bg-gray-900 transition">

            <div className="relative">

              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-black">
                A
              </div>

              <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-950" />

            </div>

            <div className="min-w-0 flex-1">

              <p className="font-bold text-sm truncate">
                Admin
              </p>

              <p className="text-[11px] text-gray-500 truncate">
                Super Administrator
              </p>

            </div>

            <ChevronRight
              size={15}
              className="text-gray-600"
            />

          </div>

          {/* Logout */}

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-950/40 hover:text-red-400 transition group"
          >

            <LogOut
              size={18}
              className="group-hover:translate-x-0.5 transition"
            />

            <span className="text-sm font-semibold">
              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </span>

          </button>

        </div>

      </aside>
    </>
  );
}

/* =========================================================
   SIDEBAR LINK
========================================================= */

function SidebarLink({
  link,
  setMobileOpen,
}) {
  const Icon = link.icon;

  return (
    <NavLink
      to={link.path}
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) => `
        group
        relative
        flex
        items-center
        gap-3
        px-4
        py-3.5
        rounded-xl
        font-semibold
        text-sm
        transition-all
        duration-200
        ${
          isActive
            ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
            : "text-gray-400 hover:bg-gray-900 hover:text-white"
        }
      `}
    >

      {({ isActive }) => (
        <>
          {/* Active Indicator */}

          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-white" />
          )}

          {/* Icon */}

          <div
            className={`
              w-9
              h-9
              rounded-lg
              flex
              items-center
              justify-center
              transition
              ${
                isActive
                  ? "bg-white/10"
                  : "bg-gray-900 group-hover:bg-gray-800"
              }
            `}
          >
            <Icon size={18} />
          </div>

          {/* Name */}

          <span className="flex-1">
            {link.name}
          </span>

          {/* Badge */}

          {link.badge && (
            <span
              className={`
                min-w-6
                h-6
                px-1.5
                rounded-full
                flex
                items-center
                justify-center
                text-[10px]
                font-black
                ${
                  isActive
                    ? "bg-white text-red-600"
                    : "bg-red-600/10 text-red-500"
                }
              `}
            >
              {link.badge}
            </span>
          )}

          {/* Arrow */}

          <ChevronRight
            size={14}
            className={`
              transition-all
              ${
                isActive
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
              }
            `}
          />

        </>
      )}
    </NavLink>
  );
}