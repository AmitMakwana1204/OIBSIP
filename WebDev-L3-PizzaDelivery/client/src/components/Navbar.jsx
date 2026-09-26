import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ShoppingCart,
  User,
  UserCircle,
  Package,
  LogOut,
  LogIn,
  UserPlus,
  Search,
  Pizza,
  Menu,
  X,
  Heart,
} from "lucide-react";

const WISHLIST_PREFIX = "pizzaWishlist_";

const getWishlistKey = () => {
  try {
    const storedUser =
      localStorage.getItem("pizzahub_user");

    if (!storedUser) {
      return `${WISHLIST_PREFIX}guest`;
    }

    const user = JSON.parse(storedUser);

    const userId =
      user?._id ||
      user?.id ||
      user?.email ||
      "guest";

    return `${WISHLIST_PREFIX}${String(userId)}`;
  } catch (error) {
    console.error(
      "Wishlist key error:",
      error
    );

    return `${WISHLIST_PREFIX}guest`;
  }
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  // =========================================================
  // PROFILE
  // =========================================================

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [user, setUser] =
    useState(null);

  const profileRef = useRef(null);

  // =========================================================
  // CART COUNT
  // =========================================================

  const [cartCount, setCartCount] =
    useState(0);

  const updateCartCount = () => {
    try {
      const savedCart =
        localStorage.getItem("pizzaCart");

      const cart = savedCart
        ? JSON.parse(savedCart)
        : [];

      const count = cart.reduce(
        (total, item) =>
          total +
          (Number(item.quantity) || 0),
        0
      );

      setCartCount(count);
    } catch (error) {
      console.error(
        "Cart count error:",
        error
      );

      setCartCount(0);
    }
  };

  // =========================================================
  // WISHLIST COUNT
  // =========================================================

  const [wishlistCount, setWishlistCount] =
    useState(0);

  const updateWishlistCount = () => {
    try {
      const key = getWishlistKey();

      const savedWishlist =
        localStorage.getItem(key);

      const wishlist = savedWishlist
        ? JSON.parse(savedWishlist)
        : [];

      setWishlistCount(
        Array.isArray(wishlist)
          ? wishlist.length
          : 0
      );
    } catch (error) {
      console.error(
        "Wishlist count error:",
        error
      );

      setWishlistCount(0);
    }
  };

  // =========================================================
  // LOAD CART
  // =========================================================

  useEffect(() => {
    updateCartCount();

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    window.addEventListener(
      "storage",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );

      window.removeEventListener(
        "storage",
        updateCartCount
      );
    };
  }, []);

  // =========================================================
  // LOAD WISHLIST
  // =========================================================

  useEffect(() => {
    updateWishlistCount();

    window.addEventListener(
      "wishlistUpdated",
      updateWishlistCount
    );

    window.addEventListener(
      "storage",
      updateWishlistCount
    );

    window.addEventListener(
      "authChanged",
      updateWishlistCount
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        updateWishlistCount
      );

      window.removeEventListener(
        "storage",
        updateWishlistCount
      );

      window.removeEventListener(
        "authChanged",
        updateWishlistCount
      );
    };
  }, [location.pathname]);

  // =========================================================
  // LOAD USER
  // =========================================================

  const loadUser = () => {
    try {
      const token =
        localStorage.getItem(
          "pizzahub_token"
        );

      const storedUser =
        localStorage.getItem(
          "pizzahub_user"
        );

      if (!token) {
        setUser(null);
        return;
      }

      if (storedUser) {
        setUser(
          JSON.parse(storedUser)
        );
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Load user error:",
        error
      );

      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    window.addEventListener(
      "authChanged",
      loadUser
    );

    window.addEventListener(
      "storage",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "authChanged",
        loadUser
      );

      window.removeEventListener(
        "storage",
        loadUser
      );
    };
  }, [location.pathname]);

  // =========================================================
  // LOGGED IN
  // =========================================================

  const isLoggedIn =
    !!localStorage.getItem(
      "pizzahub_token"
    );

  // =========================================================
  // CLOSE PROFILE
  // =========================================================

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
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
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = () => {
    navigate("/dashboard#search");

    setTimeout(() => {
      document
        .getElementById("pizza-search")
        ?.focus();
    }, 100);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "pizzahub_token"
    );

    localStorage.removeItem(
      "pizzahub_user"
    );

    setUser(null);
    setProfileOpen(false);
    setMobileOpen(false);

    window.dispatchEvent(
      new Event("authChanged")
    );

    navigate("/login");
  };

  // =========================================================
  // ACTIVE NAV
  // =========================================================

  const isActive = (path) =>
    location.pathname === path;

  // =========================================================
  // NAV ITEMS
  // =========================================================

  const navItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Menu",
      path: "/dashboard",
    },
    {
      name: "Build Pizza",
      path: "/pizza-builder",
    },
    {
      name: "My Orders",
      path: "/orders",
    },
  ];

  // =========================================================
  // USER NAME
  // =========================================================

  const getUserName = () => {
    if (!user) return "User";

    return (
      user.name ||
      user.fullName ||
      user.username ||
      "User"
    );
  };

  const getUserEmail = () =>
    user?.email || "";

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* =================================================
              MAIN NAVBAR
          ================================================== */}

          <div className="h-[76px] flex items-center justify-between">

            {/* LOGO */}

            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              onClick={() =>
                setMobileOpen(false)
              }
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
                  Pizza
                  <span className="text-red-600">
                    Hub
                  </span>
                </h1>

                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-1">
                  Fresh & Delicious
                </p>

              </div>

            </Link>

            {/* DESKTOP NAVIGATION */}

            <nav className="hidden lg:flex items-center gap-1">

              {navItems.map((item) => {
                const active =
                  isActive(item.path);

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

            {/* ACTIONS */}

            <div className="flex items-center gap-2">

              {/* SEARCH */}

              <button
                type="button"
                onClick={handleSearch}
                className="hidden sm:flex w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* LIKE */}

              <Link
                to="/wishlist"
                onClick={() =>
                  setMobileOpen(false)
                }
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition ${
                  isActive("/wishlist")
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-50 border border-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
                aria-label="Wishlist"
              >

                <Heart
                  size={19}
                  className={
                    isActive("/wishlist")
                      ? "fill-red-600"
                      : ""
                  }
                />

                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                    {wishlistCount > 99
                      ? "99+"
                      : wishlistCount}
                  </span>
                )}

              </Link>

              {/* CART */}

              <Link
                to="/cart"
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition ${
                  isActive("/cart")
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-50 border border-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
                aria-label="Shopping cart"
              >

                <ShoppingCart size={19} />

                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
                  </span>
                )}

              </Link>

              {/* PROFILE */}

              <div
                className="relative hidden sm:block"
                ref={profileRef}
              >

                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(
                      (prev) => !prev
                    )
                  }
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                    profileOpen
                      ? "bg-red-100 text-red-600"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                  aria-label="Account"
                  aria-expanded={
                    profileOpen
                  }
                >
                  <User size={19} />
                </button>

                {/* PROFILE DROPDOWN */}

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]">

                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">

                          <div className="flex items-center gap-3">

                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-white flex items-center justify-center shadow-md">
                              <User size={21} />
                            </div>

                            <div className="min-w-0 flex-1">

                              <p className="font-bold text-gray-900 truncate">
                                {getUserName()}
                              </p>

                              <p className="text-xs text-gray-500 truncate">
                                {getUserEmail()}
                              </p>

                            </div>

                          </div>

                        </div>

                        {/* PROFILE */}

                        <Link
                          to="/profile"
                          onClick={() =>
                            setProfileOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gray-50 transition"
                        >

                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                            <UserCircle
                              size={18}
                            />
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              My Profile
                            </p>

                            <p className="text-[11px] text-gray-400">
                              Manage your account
                            </p>
                          </div>

                        </Link>

                        {/* WISHLIST */}

                        <Link
                          to="/wishlist"
                          onClick={() =>
                            setProfileOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gray-50 transition"
                        >

                          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                            <Heart
                              size={18}
                              className="fill-red-600"
                            />
                          </div>

                          <div className="flex-1">
                            <p className="text-sm font-bold">
                              My Wishlist
                            </p>

                            <p className="text-[11px] text-gray-400">
                              {wishlistCount} saved pizza
                              {wishlistCount !== 1
                                ? "s"
                                : ""}
                            </p>
                          </div>

                        </Link>

                        {/* ORDERS */}

                        <Link
                          to="/orders"
                          onClick={() =>
                            setProfileOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gray-50 transition"
                        >

                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Package size={18} />
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              My Orders
                            </p>

                            <p className="text-[11px] text-gray-400">
                              Track your orders
                            </p>
                          </div>

                        </Link>

                        <div className="border-t border-gray-100" />

                        {/* LOGOUT */}

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-red-600 hover:bg-red-50 transition"
                        >

                          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                            <LogOut
                              size={18}
                            />
                          </div>

                          <div className="text-left">

                            <p className="text-sm font-bold">
                              Logout
                            </p>

                            <p className="text-[11px] text-red-400">
                              Sign out from your
                              account
                            </p>

                          </div>

                        </button>

                      </>
                    ) : (
                      <>
                        <div className="px-4 py-5 text-center bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">

                          <div className="w-12 h-12 mx-auto rounded-full bg-red-600 text-white flex items-center justify-center mb-2">
                            <User size={21} />
                          </div>

                          <p className="font-bold text-gray-900">
                            Welcome to PizzaHub
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            Login to access your
                            account
                          </p>

                        </div>

                        <Link
                          to="/login"
                          onClick={() =>
                            setProfileOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gray-50 transition"
                        >

                          <LogIn
                            size={18}
                            className="text-red-600"
                          />

                          <div>
                            <p className="text-sm font-bold">
                              Login
                            </p>

                            <p className="text-[11px] text-gray-400">
                              Sign in to your account
                            </p>
                          </div>

                        </Link>

                        <Link
                          to="/register"
                          onClick={() =>
                            setProfileOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gray-50 transition"
                        >

                          <UserPlus size={18} />

                          <div>
                            <p className="text-sm font-bold">
                              Create Account
                            </p>

                            <p className="text-[11px] text-gray-400">
                              New to PizzaHub?
                            </p>
                          </div>

                        </Link>

                      </>
                    )}

                  </div>
                )}

              </div>

              {/* MOBILE MENU */}

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(
                    (prev) => !prev
                  )
                }
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

          {/* MOBILE */}

          {mobileOpen && (
            <div className="lg:hidden border-t border-gray-100 py-4">

              <nav className="space-y-1">

                {navItems.map((item) => {
                  const active =
                    isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition ${
                        active
                          ? "bg-red-50 text-red-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >

                      <span>
                        {item.name}
                      </span>

                      {active && (
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                      )}

                    </Link>
                  );
                })}

              </nav>

              {/* MOBILE WISHLIST */}

              <Link
                to="/wishlist"
                onClick={() =>
                  setMobileOpen(false)
                }
                className={`mt-3 flex items-center justify-between w-full py-3.5 px-4 rounded-xl font-black text-sm ${
                  isActive("/wishlist")
                    ? "bg-red-600 text-white"
                    : "bg-red-50 text-red-600"
                }`}
              >

                <span className="flex items-center gap-2">

                  <Heart
                    size={18}
                    className={
                      isActive("/wishlist")
                        ? "fill-white"
                        : "fill-red-600"
                    }
                  />

                  My Wishlist

                </span>

                {wishlistCount > 0 && (
                  <span
                    className={`min-w-6 h-6 px-1 rounded-full flex items-center justify-center text-xs ${
                      isActive("/wishlist")
                        ? "bg-white text-red-600"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {wishlistCount > 99
                      ? "99+"
                      : wishlistCount}
                  </span>
                )}

              </Link>

              {/* MOBILE PROFILE */}

              <div className="mt-3 border-t border-gray-100 pt-3">

                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-3 rounded-xl bg-red-50 mb-2">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                          <User size={18} />
                        </div>

                        <div className="min-w-0">

                          <p className="font-bold text-gray-900 truncate">
                            {getUserName()}
                          </p>

                          <p className="text-xs text-gray-500 truncate">
                            {getUserEmail()}
                          </p>

                        </div>

                      </div>

                    </div>

                    <Link
                      to="/profile"
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50"
                    >
                      <UserCircle size={18} />

                      <span className="font-bold text-sm">
                        My Profile
                      </span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50"
                    >
                      <Package size={18} />

                      <span className="font-bold text-sm">
                        My Orders
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />

                      <span className="font-bold text-sm">
                        Logout
                      </span>
                    </button>

                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50"
                    >
                      <LogIn size={18} />

                      <span className="font-bold text-sm">
                        Login
                      </span>
                    </Link>

                    <Link
                      to="/register"
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50"
                    >
                      <UserPlus size={18} />

                      <span className="font-bold text-sm">
                        Create Account
                      </span>
                    </Link>
                  </>
                )}

              </div>

              {/* MOBILE CART */}

              <Link
                to="/cart"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="mt-3 flex items-center justify-between w-full py-3.5 px-4 rounded-xl bg-red-50 text-red-600 font-black text-sm"
              >

                <span className="flex items-center gap-2">
                  <ShoppingCart size={17} />
                  Shopping Cart
                </span>

                {cartCount > 0 && (
                  <span className="bg-red-600 text-white min-w-6 h-6 px-1 rounded-full flex items-center justify-center text-xs">
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
                  </span>
                )}

              </Link>

              {/* MOBILE SEARCH */}

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

              {/* MOBILE BUILD */}

              <Link
                to="/pizza-builder"
                onClick={() =>
                  setMobileOpen(false)
                }
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