import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  Pizza,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = () => {
    navigate("/dashboard#search");

    // Dashboard search box focus
    setTimeout(() => {
      document.getElementById("pizza-search")?.focus();
    }, 100);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/dashboard" },
    { name: "Build Pizza", path: "/pizza-builder" },
    { name: "My Orders", path: "/orders" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-[76px] flex items-center justify-between">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              onClick={() => setMobileOpen(false)}
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
                  <Pizza
                    className="text-white"
                    size={24}
                    strokeWidth={2.5}
                  />
                </div>

                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              </div>

              <div>
                <h1 className="text-xl font-black tracking-tight text-gray-950 leading-none">
                  Pizza<span className="text-red-600">Hub</span>
                </h1>

                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-1">
                  Fresh & Delicious
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      active
                        ? "text-red-600 bg-red-50"
                        : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}

                    {active && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-600" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">

              {/* Search */}
              {/* <button
                type="button"
                onClick={handleSearch}
                className="hidden sm:flex w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition"
                aria-label="Search"
              >
                <Search size={18} />
              </button> */}

              {/* Cart */}
              <Link
                to="/orders"
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition ${
                  isActive("/orders")
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-50 border border-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
                aria-label="Shopping cart"
              >
                <ShoppingCart size={19} />

                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  2
                </span>
              </Link>

              {/* Profile */}
              <Link
                to="/login"
                className="hidden sm:flex w-10 h-10 rounded-xl bg-red-50 text-red-600 items-center justify-center hover:bg-red-100 transition"
                aria-label="Account"
              >
                <User size={19} />
              </Link>

              {/* Mobile Menu */}
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="lg:hidden w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X size={21} />
                ) : (
                  <Menu size={21} />
                )}
              </button>

            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-gray-100 py-4">

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition ${
                        active
                          ? "bg-red-50 text-red-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{item.name}</span>

                      {active && (
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Search */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  handleSearch();
                }}
                className="mt-3 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gray-100 text-gray-800 font-black text-sm hover:bg-red-50 hover:text-red-600 transition"
              >
                <Search size={17} />
                Search Pizza
              </button>

              {/* Mobile CTA */}
              <Link
                to="/pizza-builder"
                onClick={() => setMobileOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-red-600 text-white font-black text-sm hover:bg-red-700 transition shadow-lg shadow-red-600/20"
              >
                <Pizza size={17} />
                Build Your Pizza
              </Link>

            </div>
          )}
        </div>
      </header>
    </>
  );
}