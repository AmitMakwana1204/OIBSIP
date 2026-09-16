import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Pizza,
  X,
} from "lucide-react";

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const links = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: Package,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-screen w-72 bg-gray-950 text-white flex flex-col transform transition-transform duration-300 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center">
              <Pizza size={23} />
            </div>

            <div>
              <h1 className="font-black text-xl">
                Pizza<span className="text-red-500">Hub</span>
              </h1>

              <p className="text-[10px] uppercase tracking-widest text-gray-500">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-gray-400"
          >
            <X />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">

          <p className="text-[11px] uppercase tracking-widest text-gray-600 font-bold px-4 py-3">
            Management
          </p>

          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Admin */}
        <div className="p-4 border-t border-gray-800">

          <div className="flex items-center gap-3 p-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black">
              A
            </div>

            <div>
              <p className="font-bold text-sm">
                Admin
              </p>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>
          </div>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-red-400 transition">
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </aside>
    </>
  );
}