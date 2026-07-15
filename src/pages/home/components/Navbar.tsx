import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useBrand, AMBERCOM } from "@/hooks/useBrand";

const LOGO_URL =
  "https://umbrcom.co.il/wp-content/uploads/2025/10/%D7%9C%D7%95%D7%92%D7%95-%D7%9C%D7%92%D7%A8%D7%A1%D7%AA-%D7%A0%D7%99%D7%99%D7%93-3.png";

// Both top navigation bars are BLACK (client request).
const NAV_BLACK = "#0d0d0d";

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

// Reference layout (client WhatsApp screenshot): icon cluster fixed left,
// dual logo fixed right, search fixed left on row 2, nav links + a white
// "all categories" pill fixed right. Each cluster below is pinned with
// dir="ltr" so the visual order matches the screenshot exactly regardless
// of the page's own RTL flow; Hebrew text inside still shapes correctly.
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const location = useLocation();
  const { totalCount, openCart } = useCart();
  const brand = useBrand();
  const brandMenuRef = useRef<HTMLDivElement>(null);
  const catMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMobileOpen(false); setBrandMenuOpen(false); setCatMenuOpen(false); }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (brandMenuRef.current && !brandMenuRef.current.contains(e.target as Node)) setBrandMenuOpen(false);
      if (catMenuRef.current && !catMenuRef.current.contains(e.target as Node)) setCatMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 shadow-[0_2px_16px_rgba(0,0,0,0.25)]">

        {/* ══ ROW 1 — icons (left) · dual logo (right) — desktop only ══ */}
        <div dir="ltr" className="hidden md:block w-full border-b border-white/5" style={{ backgroundColor: NAV_BLACK }}>
          <div dir="ltr" className="max-w-7xl mx-auto px-5 sm:px-8 h-[92px] flex items-center justify-between">

            {/* LEFT — utility icon cluster */}
            <div dir="ltr" className="flex items-center gap-7 sm:gap-9">
              <button
                onClick={openCart}
                className="relative flex flex-col items-center gap-1 cursor-pointer group"
                aria-label="סל קניות"
              >
                <i className="ri-shopping-cart-2-line text-[24px] transition-opacity group-hover:opacity-75" style={{ color: brand.color }}></i>
                <span className="text-[10px] font-medium text-white/85 whitespace-nowrap">סל קניות</span>
                {totalCount > 0 && (
                  <span
                    className="absolute -top-1 left-3 w-[16px] h-[16px] text-[9px] font-bold rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: brand.color }}
                  >
                    {totalCount}
                  </span>
                )}
              </button>

              <Link to="/auth" className="flex flex-col items-center gap-1 cursor-pointer group" aria-label="התחברות">
                <i className="ri-user-3-line text-[24px] transition-opacity group-hover:opacity-75" style={{ color: brand.color }}></i>
                <span className="text-[10px] font-medium text-white/85 whitespace-nowrap">התחבר</span>
              </Link>

              <Link to="/wishlist" className="flex flex-col items-center gap-1 cursor-pointer group" aria-label="מועדפים">
                <i className="ri-heart-line text-[24px] transition-opacity group-hover:opacity-75" style={{ color: brand.color }}></i>
                <span className="text-[10px] font-medium text-white/85 whitespace-nowrap">ווישליסט</span>
              </Link>

              <Link to="/compare" className="flex flex-col items-center gap-1 cursor-pointer group" aria-label="השוואה">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors group-hover:opacity-80"
                  style={{ backgroundColor: `${brand.color}22` }}
                >
                  <i className="ri-shopping-bag-3-line text-[19px]" style={{ color: brand.color }}></i>
                </span>
                <span className="text-[10px] font-medium text-white/85 whitespace-nowrap">השוואה</span>
              </Link>
            </div>

            {/* RIGHT — dual logo: brand wordmark (switcher) + UMBRCOM */}
            <div dir="ltr" className="flex items-center gap-5 sm:gap-6">
              {/* Brand wordmark + dropdown chevron */}
              <div ref={brandMenuRef} className="relative">
                <button
                  onClick={() => setBrandMenuOpen((v) => !v)}
                  className="flex flex-col items-center gap-0.5 cursor-pointer"
                  aria-label="החלפת מותג"
                >
                  {brand.key === "ambercom" ? (
                    <span className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight" style={{ color: AMBERCOM.color }}>
                      Ambercom
                    </span>
                  ) : (
                    <img src={LOGO_URL} alt="Waterfall" className="h-9 sm:h-10 w-auto object-contain" />
                  )}
                  <i
                    className={`ri-arrow-down-s-fill text-lg leading-none transition-transform duration-200 ${brandMenuOpen ? "rotate-180" : ""}`}
                    style={{ color: brand.color }}
                  ></i>
                </button>

                {brandMenuOpen && (
                  <div
                    dir="rtl"
                    className="absolute top-full mt-3 right-1/2 translate-x-1/2 sm:right-0 sm:translate-x-0 w-44 bg-white rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.2)] overflow-hidden text-right"
                  >
                    <Link
                      to="/"
                      onClick={() => setBrandMenuOpen(false)}
                      className={`block px-4 py-3 text-sm cursor-pointer hover:bg-[#f5f5f5] ${brand.key === "waterfall" ? "font-semibold text-[#1a1a1a]" : "text-[#555]"}`}
                    >
                      Waterfall
                    </Link>
                    <Link
                      to="/ambercom"
                      onClick={() => setBrandMenuOpen(false)}
                      className={`block px-4 py-3 text-sm cursor-pointer border-t border-[#eee] hover:bg-[#f5f5f5] ${brand.key === "ambercom" ? "font-semibold text-[#1a1a1a]" : "text-[#555]"}`}
                    >
                      Ambercom
                    </Link>
                  </div>
                )}
              </div>

              <div className="hidden sm:block h-9 w-px bg-white/15" />

              {/* UMBRCOM parent brand */}
              <Link to="/" className="flex flex-col items-end hover:opacity-85 transition-opacity cursor-pointer">
                <span className="text-[15px] font-bold tracking-[0.18em] text-white leading-tight">UMBRCOM</span>
                <span className="text-[8px] tracking-[0.22em] text-white/40 uppercase leading-tight">THE UMBRELLA COMPANY</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ══ ROW 2 — search (left) · nav links + all-categories pill (right) ══ */}
        <div dir="ltr" className="hidden md:block w-full px-5 sm:px-8 py-3" style={{ backgroundColor: NAV_BLACK }}>
          <div dir="ltr" className="max-w-7xl mx-auto flex items-center justify-between gap-6">

            {/* LEFT — search */}
            <div className="flex-1 max-w-[520px]">
              <div dir="rtl" className="flex items-center bg-[#1c1c1c] rounded-full h-11 px-4 gap-2">
                <i className="ri-search-line text-white/40 text-base flex-shrink-0"></i>
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="חיפוש מוצר, מותג או קטגוריה..."
                  className="flex-1 text-sm text-right outline-none bg-transparent placeholder-white/35 text-white"
                  dir="rtl"
                />
                <button
                  className="w-8 h-8 -ml-1 flex-shrink-0 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  style={{ backgroundColor: brand.color }}
                  aria-label="חיפוש"
                >
                  <i className="ri-search-line text-white text-sm"></i>
                </button>
              </div>
            </div>

            {/* RIGHT — nav links + all categories */}
            <div dir="ltr" className="flex items-center gap-5">
              <Link to="/shop" className="flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer whitespace-nowrap">
                מבצעים
                <i className="ri-price-tag-3-line text-sm"></i>
              </Link>
              <span className="h-4 w-px bg-white/15" />
              <Link to="/auth" className="flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer whitespace-nowrap">
                מועדון לקוחות
                <i className="ri-headphone-line text-sm"></i>
              </Link>
              <span className="h-4 w-px bg-white/15" />
              <Link to="/customer-service" className="flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer whitespace-nowrap">
                שירות לקוחות
                <i className="ri-star-line text-sm"></i>
              </Link>

              {/* All categories — white pill with dropdown */}
              <div ref={catMenuRef} className="relative">
                <button
                  onClick={() => setCatMenuOpen((v) => !v)}
                  className="flex items-center gap-2 bg-white hover:bg-[#f0f0f0] text-[#1a1a1a] text-sm font-semibold px-5 py-2.5 rounded-full cursor-pointer transition-colors whitespace-nowrap"
                >
                  כל הקטגוריות
                  <i className="ri-grid-fill text-sm"></i>
                </button>

                {catMenuOpen && (
                  <div
                    dir="rtl"
                    className="absolute top-full mt-3 left-0 w-56 bg-white rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.2)] overflow-hidden text-right py-1"
                  >
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.path}
                        to={cat.path}
                        onClick={() => setCatMenuOpen(false)}
                        className={`block px-4 py-2.5 text-sm cursor-pointer hover:bg-[#f5f5f5] ${
                          isActive(cat.path) ? "font-semibold text-[#1a1a1a]" : "text-[#444]"
                        }`}
                      >
                        {cat.label}
                      </Link>
                    ))}
                    <div className="border-t border-[#eee] mt-1 pt-1">
                      <Link
                        to="/ambercom"
                        onClick={() => setCatMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm cursor-pointer hover:bg-[#f5f5f5] text-[#c9a050] font-medium"
                      >
                        Ambercom
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══ Mobile header — logo · cart · hamburger ══ */}
        <div dir="rtl" className="md:hidden w-full px-4 h-16 flex items-center justify-between" style={{ backgroundColor: NAV_BLACK }}>
          <Link to="/" className="flex-shrink-0">
            {brand.key === "ambercom" ? (
              <span className="text-lg font-serif font-semibold" style={{ color: AMBERCOM.color }}>Ambercom</span>
            ) : (
              <img src={LOGO_URL} alt="Waterfall" className="h-8 w-auto object-contain" />
            )}
          </Link>

          <div className="flex items-center gap-5">
            <button onClick={openCart} className="relative text-white cursor-pointer" aria-label="סל קניות">
              <i className="ri-shopping-cart-2-line text-2xl"></i>
              {totalCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-[16px] h-[16px] text-[9px] font-bold rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: brand.color }}
                >
                  {totalCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="text-white cursor-pointer"
              aria-label="תפריט"
            >
              <i className={`text-2xl ${mobileOpen ? "ri-close-line" : "ri-menu-3-line"}`}></i>
            </button>
          </div>
        </div>

        {/* ══ Compact mobile search row ══ */}
        <div dir="rtl" className="md:hidden w-full px-4 pb-3" style={{ backgroundColor: NAV_BLACK }}>
          <div className="flex items-center bg-[#1c1c1c] rounded-full h-10 px-4 gap-2">
            <i className="ri-search-line text-white/40 text-base flex-shrink-0"></i>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="חיפוש מוצר..."
              className="flex-1 text-sm text-right outline-none bg-transparent placeholder-white/35 text-white"
              dir="rtl"
            />
          </div>
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
          <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: NAV_BLACK }}>
            <button onClick={() => setMobileOpen(false)} className="text-white cursor-pointer">
              <i className="ri-close-line text-2xl"></i>
            </button>
            <img src={LOGO_URL} alt="Waterfall" className="h-9 object-contain" />
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

            <div className="bg-[#f8f8f8] py-1">
              {[
                { label: "הרשמה / התחברות", path: "/auth", icon: "ri-user-3-line" },
                { label: "המועדפים שלי", path: "/wishlist", icon: "ri-heart-line" },
                { label: "השוואת מחירים", path: "/compare", icon: "ri-shopping-bag-3-line" },
                { label: "שירות לקוחות", path: "/customer-service", icon: "ri-headphone-line" },
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
