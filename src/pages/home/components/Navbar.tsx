import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useBrand } from "@/hooks/useBrand";

const LOGO_URL =
  "https://umbrcom.co.il/wp-content/uploads/2025/10/%D7%9C%D7%95%D7%92%D7%95-%D7%9C%D7%92%D7%A8%D7%A1%D7%AA-%D7%A0%D7%99%D7%99%D7%93-3.png";

// Both top navigation bars are BLACK (client request). Brand color is used
// only as a small accent (badges / active underline).
const NAV_BLACK = "#0d0d0d";

const CATEGORIES = [
  { label: "ברזי מטבח", path: "/shop/kitchen" },
  { label: "ברזי כיור רחצה", path: "/shop/bathroom" },
  { label: "ברזי מים קרים", path: "/shop/cold-water" },
  { label: "ערכות פינוק", path: "/shop/pampering-sets" },
  { label: "סדרות", path: "/series" },
  { label: "Ambercom", path: "/ambercom" },
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

interface NavbarProps {
  /** Transparent header floating above the hero video (home pages, item 7).
   *  Turns solid black once the user scrolls. */
  overlay?: boolean;
}

export default function Navbar({ overlay = false }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { totalCount, openCart } = useCart();
  const brand = useBrand();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const transparent = overlay && !scrolled;

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          transparent ? "" : "shadow-[0_2px_16px_rgba(0,0,0,0.25)]"
        }`}
      >
        {/* ══ SECTION 1: Logo bar — BLACK ══ */}
        <div
          className={`w-full transition-colors duration-300 ${
            transparent ? "bg-transparent border-b border-white/10" : "border-b border-white/5"
          }`}
          style={{ backgroundColor: transparent ? "transparent" : NAV_BLACK }}
          dir="rtl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[80px] flex items-center justify-between">
            {/* Right: Waterfall logo (enlarged) + UMBRCOM branding */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex-shrink-0 hover:opacity-85 transition-opacity">
                <img
                  src={LOGO_URL}
                  alt="Waterfall"
                  className="h-[72px] w-auto object-contain brightness-0 invert"
                />
              </Link>
              <div className="hidden sm:block h-9 w-px bg-white/15" />
              <div className="hidden sm:flex flex-col">
                <span className="text-[14px] font-bold tracking-[0.18em] text-white leading-tight">UMBRCOM</span>
                <span className="text-[8px] tracking-[0.22em] text-white/40 uppercase leading-tight">THE UMBRELLA COMPANY</span>
              </div>
            </div>

            {/* Left: phone */}
            <div className="hidden md:flex items-center gap-2 text-xs text-white/50">
              <i className="ri-phone-line text-sm"></i>
              <a href="tel:+97236208197" className="hover:text-white transition-colors font-medium tracking-wide">
                03-620-8197
              </a>
            </div>
          </div>
        </div>

        {/* ══ SECTION 2: Icon + search bar — BLACK ══ */}
        <div
          className={`w-full px-3 sm:px-8 py-2.5 transition-colors duration-300`}
          style={{ backgroundColor: transparent ? "transparent" : NAV_BLACK }}
          dir="rtl"
        >
          <div
            className={`max-w-7xl mx-auto rounded-2xl px-4 sm:px-6 h-[60px] flex items-center gap-3 sm:gap-4 transition-colors duration-300 ${
              transparent ? "bg-black/45 backdrop-blur-md border border-white/10" : "bg-[#1a1a1a]"
            }`}
          >
            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex-shrink-0 text-white hover:text-white/70 transition-opacity cursor-pointer"
              aria-label="סל קניות"
            >
              <i className="ri-shopping-cart-2-line text-[26px]"></i>
              {totalCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] text-[10px] font-bold rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: brand.color }}
                >
                  {totalCount}
                </span>
              )}
            </button>

            {/* Wishlist → /wishlist (item 15) */}
            <Link
              to="/wishlist"
              className="flex-shrink-0 text-white hover:text-white/70 transition-opacity cursor-pointer"
              aria-label="מועדפים"
            >
              <i className="ri-heart-line text-[26px]"></i>
            </Link>

            {/* Compare → /compare (item 15) */}
            <Link
              to="/compare"
              className="hidden sm:block flex-shrink-0 text-white hover:text-white/70 transition-opacity cursor-pointer"
              aria-label="השוואת מחירים"
            >
              <i className="ri-scales-3-line text-[26px]"></i>
            </Link>

            {/* Search */}
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

            {/* Account → /auth (item 15) */}
            <Link
              to="/auth"
              className="hidden md:block flex-shrink-0 text-white hover:text-white/70 transition-opacity cursor-pointer"
              aria-label="התחברות / הרשמה"
            >
              <i className="ri-user-3-line text-[26px]"></i>
            </Link>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex-shrink-0 text-white cursor-pointer"
              aria-label="תפריט"
            >
              <i className={`text-[26px] ${mobileOpen ? "ri-close-line" : "ri-menu-3-line"}`}></i>
            </button>
          </div>
        </div>

        {/* ══ SECTION 3: Category strip — BLACK ══ */}
        <div
          className={`hidden md:flex w-full items-center justify-center h-[44px] transition-colors duration-300 ${
            transparent ? "bg-black/45 backdrop-blur-md border-t border-white/5" : "border-t border-white/5"
          }`}
          style={{ backgroundColor: transparent ? undefined : NAV_BLACK }}
          dir="rtl"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className={`relative h-full flex items-center px-6 text-sm font-medium tracking-wide transition-colors whitespace-nowrap ${
                isActive(cat.path) && cat.path !== "/shop"
                  ? "text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat.label}
              {isActive(cat.path) && cat.path !== "/shop" && (
                <span
                  className="absolute bottom-0 right-4 left-4 h-[2px] rounded-full"
                  style={{ backgroundColor: cat.path === "/ambercom" ? "#e8a030" : brand.color }}
                />
              )}
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
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          dir="rtl"
          className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer header — black */}
          <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: NAV_BLACK }}>
            <button onClick={() => setMobileOpen(false)} className="text-white cursor-pointer">
              <i className="ri-close-line text-2xl"></i>
            </button>
            <img src={LOGO_URL} alt="Waterfall" className="h-11 object-contain brightness-0 invert" />
          </div>

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

            {/* Account / wishlist / compare quick links */}
            <div className="bg-[#f8f8f8] py-1">
              {[
                { label: "הרשמה / התחברות", path: "/auth", icon: "ri-user-3-line" },
                { label: "המועדפים שלי", path: "/wishlist", icon: "ri-heart-line" },
                { label: "השוואת מחירים", path: "/compare", icon: "ri-scales-3-line" },
              ].map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className="flex items-center justify-end gap-2 px-8 py-3 text-xs text-gray-600 hover:text-[#1a1a1a] border-b border-gray-100"
                >
                  {l.label}
                  <i className={`${l.icon} text-sm`} style={{ color: brand.color }}></i>
                </Link>
              ))}
            </div>
          </nav>

          <div className="px-5 py-4 border-t border-gray-100 space-y-2.5">
            <a href="tel:+97236208197" className="flex items-center gap-3 text-sm text-gray-500 hover:text-gray-800">
              <i className="ri-phone-line" style={{ color: brand.color }}></i>
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
