import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const LOGO_URL =
  "https://umbrcom.co.il/wp-content/uploads/2025/10/%D7%9C%D7%95%D7%92%D7%95-%D7%9C%D7%92%D7%A8%D7%A1%D7%AA-%D7%A0%D7%99%D7%99%D7%93-3.png";

// Waterfall brand blue — update here when switching brands
const BRAND_COLOR = "#3ab4f2";

const CATEGORIES = [
  { label: "ברזי מטבח", path: "/shop/kitchen" },
  { label: "ברזי כיור רחצה", path: "/shop/bathroom" },
  { label: "ברזי מים קרים", path: "/shop/cold-water" },
  { label: "ערכות פינוק", path: "/shop/pampering-sets" },
  { label: "סדרות", path: "/series" },
];

const MOBILE_NAV = [
  { label: "בית", path: "/" },
  { label: "חנות", path: "/shop" },
  { label: "סדרות", path: "/series" },
  { label: "Ambercom", path: "/ambercom" },
  { label: "בלוג", path: "/blog" },
  { label: "אודות", path: "/about" },
  { label: "צור קשר", path: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const location = useLocation();
  const { totalCount, openCart } = useCart();

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]">

        {/* ══ SECTION 1: Logo bar ══ */}
        <div className="w-full bg-white border-b border-gray-100" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[64px] flex items-center justify-between">
            {/* Right: Waterfall logo + UMBRCOM branding */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex-shrink-0 hover:opacity-85 transition-opacity">
                <img src={LOGO_URL} alt="Waterfall" className="h-16 w-auto object-contain" />
              </Link>
              <div className="hidden sm:block h-8 w-px bg-gray-200" />
              <div className="hidden sm:flex flex-col">
                <span className="text-[13px] font-bold tracking-[0.18em] text-[#1a1a1a] leading-tight">UMBRCOM</span>
                <span className="text-[8px] tracking-[0.22em] text-gray-400 uppercase leading-tight">THE UMBRELLA COMPANY</span>
              </div>
            </div>

            {/* Left: phone number text only */}
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <i className="ri-phone-line text-sm"></i>
              <a href="tel:+97236208197" className="hover:text-gray-600 transition-colors font-medium tracking-wide">
                03-620-8197
              </a>
            </div>
          </div>
        </div>

        {/* ══ SECTION 2: Blue pill navbar ══ */}
        <div className="w-full bg-white px-3 sm:px-8 py-2.5" dir="rtl">
          <div
            className="max-w-7xl mx-auto rounded-2xl px-4 sm:px-6 h-[60px] flex items-center gap-3 sm:gap-4"
            style={{ backgroundColor: BRAND_COLOR }}
          >
            {/* Right icons (RTL): cart + wishlist */}
            <button
              onClick={openCart}
              className="relative flex-shrink-0 text-white hover:text-white/80 transition-opacity cursor-pointer"
              aria-label="סל קניות"
            >
              <i className="ri-shopping-cart-2-line text-[26px]"></i>
              {totalCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "white", color: BRAND_COLOR }}
                >
                  {totalCount}
                </span>
              )}
            </button>

            <button className="flex-shrink-0 text-white hover:text-white/80 transition-opacity cursor-pointer" aria-label="מועדפים">
              <i className="ri-heart-line text-[26px]"></i>
            </button>

            {/* Center: Search bar */}
            <div className="flex-1 mx-1 sm:mx-3">
              <div className="flex items-center bg-white rounded-full h-10 px-4 gap-2 shadow-inner">
                <i className="ri-search-line text-gray-400 text-base flex-shrink-0"></i>
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="חיפוש מוצר..."
                  className="flex-1 text-sm text-right outline-none bg-transparent placeholder-gray-400 text-gray-700"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Left icons (RTL): bag + user/hamburger */}
            <button
              onClick={openCart}
              className="flex-shrink-0 text-white hover:text-white/80 transition-opacity cursor-pointer"
              aria-label="הזמנות"
            >
              <i className="ri-shopping-bag-line text-[26px]"></i>
            </button>

            {/* User icon — desktop only */}
            <button className="hidden md:block flex-shrink-0 text-white hover:text-white/80 transition-opacity cursor-pointer" aria-label="חשבון">
              <i className="ri-user-3-line text-[26px]"></i>
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex-shrink-0 text-white cursor-pointer"
              aria-label="תפריט"
            >
              <i className={`text-[26px] ${mobileOpen ? "ri-close-line" : "ri-menu-3-line"}`}></i>
            </button>
          </div>
        </div>

        {/* ══ SECTION 3: Category strip ══ */}
        <div
          className="hidden md:flex w-full items-center justify-center h-[44px]"
          style={{ backgroundColor: BRAND_COLOR }}
          dir="rtl"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className={`h-full flex items-center px-6 text-sm font-medium tracking-wide transition-colors whitespace-nowrap ${
                isActive(cat.path) && cat.path !== "/shop"
                  ? "bg-white/20 text-white"
                  : "text-white/90 hover:bg-white/15 hover:text-white"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

      </header>

      {/* ══ Mobile drawer ══ */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
        />

        {/* Panel — slides from right */}
        <div
          dir="rtl"
          className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ backgroundColor: BRAND_COLOR }}
          >
            <button onClick={() => setMobileOpen(false)} className="text-white cursor-pointer">
              <i className="ri-close-line text-2xl"></i>
            </button>
            <img src={LOGO_URL} alt="Waterfall" className="h-9 object-contain" />
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto py-2">
            {MOBILE_NAV.map((nl) => (
              <Link
                key={nl.path}
                to={nl.path}
                className={`flex items-center justify-between px-5 py-3.5 text-sm border-b border-gray-100 transition-colors ${
                  isActive(nl.path) ? "font-semibold text-[#1a1a1a]" : "text-[#444] hover:text-[#1a1a1a]"
                }`}
              >
                {nl.label}
                <i className="ri-arrow-left-s-line text-gray-300"></i>
              </Link>
            ))}

            {/* Category links under shop */}
            <div style={{ backgroundColor: `${BRAND_COLOR}12` }} className="py-1">
              {CATEGORIES.filter(c => c.path !== "/shop").map((cat) => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  className="flex items-center justify-end gap-2 px-8 py-3 text-xs text-gray-600 hover:text-[#1a1a1a] border-b border-gray-100"
                >
                  {cat.label}
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: BRAND_COLOR }} />
                </Link>
              ))}
            </div>
          </nav>

          {/* Contact footer */}
          <div className="px-5 py-4 border-t border-gray-100 space-y-2.5">
            <a href="tel:+97236208197" className="flex items-center gap-3 text-sm text-gray-500 hover:text-gray-800">
              <i className="ri-phone-line" style={{ color: BRAND_COLOR }}></i>
              03-620-8197
            </a>
            <a href="https://wa.me/97236208197" className="flex items-center gap-3 text-sm text-gray-500 hover:text-[#25D366]">
              <i className="ri-whatsapp-line text-[#25D366]"></i>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
