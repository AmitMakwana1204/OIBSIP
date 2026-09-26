import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Pizza,
  MapPin,
  Phone,
  Mail,
  Clock3,
  ArrowRight,
  ShieldCheck,
  Truck,
  ChevronUp,
  Headphones,
  CreditCard,
  Camera,
  Globe,
} from "lucide-react";

export default function Footer() {
  const [showTopButton, setShowTopButton] = useState(false);

  // =========================================================
  // SHOW / HIDE BACK TO TOP BUTTON
  // =========================================================

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================================================
  // QUICK LINKS
  // =========================================================

  const quickLinks = [
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
  // SUPPORT LINKS
  // =========================================================

  const supportLinks = [
    {
      name: "Help Center",
      path: "/dashboard",
    },
    {
      name: "Contact Us",
      path: "/dashboard",
    },
  ];

  // =========================================================
  // BACK TO TOP
  // =========================================================

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-gray-950 text-white mt-20">

        {/* =====================================================
            TOP CTA
        ===================================================== */}

        <div className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

            <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">

              {/* CTA CONTENT */}

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center shrink-0">
                  <Pizza size={28} />
                </div>

                <div>
                  <p className="text-orange-100 text-xs font-black uppercase tracking-widest">
                    Hungry?
                  </p>

                  <h2 className="text-2xl md:text-3xl font-black mt-1">
                    Your perfect pizza is just one click away.
                  </h2>

                  <p className="text-red-100 text-sm mt-1">
                    Freshly baked. Loaded with toppings. Delivered hot.
                  </p>
                </div>

              </div>

              {/* CTA BUTTON */}

              <Link
                to="/pizza-builder"
                className="shrink-0 bg-white text-red-600 px-6 py-3.5 rounded-xl font-black flex items-center gap-2 hover:bg-orange-50 transition shadow-lg"
              >
                Order Now
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>
        </div>

        {/* =====================================================
            MAIN FOOTER
        ===================================================== */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* =================================================
                BRAND
            ================================================= */}

            <div>

              {/* LOGO */}

              <Link
                to="/"
                className="inline-flex items-center gap-3 group"
              >

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-900/20 group-hover:scale-105 transition">
                  <Pizza size={25} />
                </div>

                <div>

                  <h2 className="text-2xl font-black leading-none">
                    Pizza<span className="text-red-500">Hub</span>
                  </h2>

                  <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold mt-1">
                    Fresh & Delicious
                  </p>

                </div>

              </Link>

              {/* DESCRIPTION */}

              <p className="text-gray-400 mt-5 text-sm leading-7 max-w-sm">
                Freshly baked pizzas made with premium ingredients,
                delicious toppings and delivered straight to your doorstep.
              </p>

              {/* SOCIAL / CONTACT ICONS */}

              <div className="flex items-center gap-3 mt-6">

                {/* Instagram */}

                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition"
                >
                  <Camera size={18} />
                </a>

                {/* Facebook */}

                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition"
                >
                  <Globe size={18} />
                </a>

                {/* Email */}

                <a
                  href="mailto:hello@pizzahub.com"
                  aria-label="Email"
                  className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition"
                >
                  <Mail size={18} />
                </a>

              </div>

            </div>

            {/* =================================================
                QUICK LINKS
            ================================================= */}

            <div>

              <h3 className="font-black text-lg mb-5">
                Quick Links
              </h3>

              <div className="space-y-3">

                {quickLinks.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 hover:translate-x-1 transition-all"
                  >
                    <ArrowRight size={13} />
                    {item.name}
                  </Link>
                ))}

              </div>

            </div>

            {/* =================================================
                SUPPORT
            ================================================= */}

            <div>

              <h3 className="font-black text-lg mb-5">
                Support
              </h3>

              <div className="space-y-3">

                {supportLinks.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 hover:translate-x-1 transition-all"
                  >
                    <ArrowRight size={13} />
                    {item.name}
                  </Link>
                ))}

              </div>

              {/* SUPPORT CARD */}

              <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl p-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                    <Headphones size={19} />
                  </div>

                  <div>

                    <p className="font-bold text-sm">
                      Need Help?
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      We're here for you
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                CONTACT
            ================================================= */}

            <div>

              <h3 className="font-black text-lg mb-5">
                Contact Us
              </h3>

              <div className="space-y-4">

                {/* LOCATION */}

                <div className="flex items-start gap-3">

                  <MapPin
                    size={18}
                    className="text-red-500 mt-0.5 shrink-0"
                  />

                  <div>

                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Location
                    </p>

                    <p className="text-sm text-gray-300 mt-1">
                      Vadodara, Gujarat
                    </p>

                  </div>

                </div>

                {/* PHONE */}

                <a
                  href="tel:+919876543210"
                  className="flex items-start gap-3 group"
                >

                  <Phone
                    size={18}
                    className="text-red-500 mt-0.5 shrink-0"
                  />

                  <div>

                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Call Us
                    </p>

                    <p className="text-sm text-gray-300 mt-1 group-hover:text-red-400 transition">
                      +91 98765 43210
                    </p>

                  </div>

                </a>

                {/* EMAIL */}

                <a
                  href="mailto:hello@pizzahub.com"
                  className="flex items-start gap-3 group"
                >

                  <Mail
                    size={18}
                    className="text-red-500 mt-0.5 shrink-0"
                  />

                  <div>

                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Email
                    </p>

                    <p className="text-sm text-gray-300 mt-1 group-hover:text-red-400 transition">
                      hello@pizzahub.com
                    </p>

                  </div>

                </a>

                {/* OPENING HOURS */}

                <div className="flex items-start gap-3">

                  <Clock3
                    size={18}
                    className="text-red-500 mt-0.5 shrink-0"
                  />

                  <div>

                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Opening Hours
                    </p>

                    <p className="text-sm text-gray-300 mt-1">
                      11:00 AM – 11:00 PM
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =====================================================
              TRUST FEATURES
          ===================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">

            {/* FAST DELIVERY */}

            <div className="flex items-center gap-3 bg-gray-900/70 border border-gray-800 rounded-2xl p-4">

              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                <Truck size={19} />
              </div>

              <div>

                <p className="font-bold text-sm">
                  Fast Delivery
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  Hot & fresh at your doorstep
                </p>

              </div>

            </div>

            {/* SECURE PAYMENT */}

            <div className="flex items-center gap-3 bg-gray-900/70 border border-gray-800 rounded-2xl p-4">

              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <CreditCard size={19} />
              </div>

              <div>

                <p className="font-bold text-sm">
                  Secure Payment
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  Safe & secure checkout
                </p>

              </div>

            </div>

            {/* QUALITY */}

            <div className="flex items-center gap-3 bg-gray-900/70 border border-gray-800 rounded-2xl p-4">

              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <ShieldCheck size={19} />
              </div>

              <div>

                <p className="font-bold text-sm">
                  Quality Guaranteed
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  Premium ingredients
                </p>

              </div>

            </div>

          </div>

          {/* =====================================================
              BOTTOM
          ===================================================== */}

          <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-sm text-gray-500 text-center md:text-left">
              © 2026 PizzaHub. All rights reserved.
            </p>

            <p className="text-xs text-gray-600">
              Made with ❤️ for pizza lovers
            </p>

          </div>

        </div>

      </footer>

      {/* =====================================================
          BACK TO TOP BUTTON
      ===================================================== */}

      {showTopButton && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-300/30 hover:bg-red-700 hover:-translate-y-1 transition-all"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </>
  );
}