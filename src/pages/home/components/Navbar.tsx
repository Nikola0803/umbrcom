import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useBrand } from "@/hooks/useBrand";
import { useBrandContext } from "@/context/BrandContext";
import { fetchNav, fetchSettings } from "@/lib/wp-api";

// Brand assets (July 2026, per Nik):
//  - Waterfall wordmark — settings-overridable (brand.waterfall_logo),
//    shown in the brand switcher on Waterfall pages.
//  - UMBRCOM logo (לוגו-לגרסת-נייד-5) — the parent-brand mark in the
//    desktop nav AND the mobile header logo. Replaces the old
//    "UMBRCOM / THE UMBRELLA COMPANY" text block.
const DEFAULT_LOGO_URL =
  "https://admin.umbrcom.co.il/wp-content/uploads/2026/07/%D7%9C%D7%95%D7%92%D7%95-%D7%9C%D7%90%D7%95%D7%A8%D7%9A-500-x-170-%D7%A4%D7%99%D7%A7%D7%A1%D7%9C-500-x-100-%D7%A4%D7%99%D7%A7%D7%A1%D7%9C-8.png";
const UMBRCOM_LOGO_URL =
  "https://admin.umbrcom.co.il/wp-content/uploads/2026/07/%D7%9C%D7%95%D7%92%D7%95-%D7%9C%D7%92%D7%A8%D7%A1%D7%AA-%D7%A0%D7%99%D7%99%D7%93-5.png";

// Header chrome is brand-driven (July 2026): UMBRCOM (default) = white
// header / black ink; Waterfall = BLACK header / white ink. See useBrand.

const DEFAULT_CATEGORIES = [
  { label: "ברזי מטבח", path: "/shop/kitchen" },
  { label: "ברזי כיור רחצה", path: "/shop/bathroom" },
  { label: "ברזי מים קרים", path: "/shop/cold-water" },
  { label: "ערכות פינוק", path: "/shop/pampering-sets" },
  { label: "סדרות", path: "/series" },
];

const DEFAULT_PHONE = "03-620-8197";
const DEFAULT_WHATSAPP = "97236208197";

const MOBILE_NAV = [
  { label: "בית", path: "/" },
  { label: "חנות", path: "/shop" },
  { label: "סדרות", path: "/series" },
  { label: "UMBRCOM", path: "/umbrcom" },
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
  const { setBrandKey: setBrand } = useBrandContext();
  const brandMenuRef = useRef<HTMLDivElement>(null);
  const catMenuRef = useRef<HTMLDivElement>(null);

  // Live data from WordPress — falls back to the defaults above until it
  // loads (or forever, if VITE_WP_API_URL isn't configured).
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  // ── Brand-driven header theme ──
  const dark = brand.key === "waterfall";
  const NAV_BG = brand.headerBg;
  const NAV_INK = brand.headerInk;
  const SUB_INK = dark ? "rgba(255,255,255,0.72)" : "#333333";
  const SURFACE = dark ? "rgba(255,255,255,0.13)" : "#f2f2f2";
  const HAIRLINE = dark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.08)";
  // Both logo files are dark-on-transparent — invert to white on the black header.
  const logoStyle = dark ? { filter: "brightness(0) invert(1)" } : undefined;
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO_URL);
  const [phone, setPhone] = useState(DEFAULT_PHONE);
  const [whatsapp, setWhatsapp] = useState(DEFAULT_WHATSAPP);

  useEffect(() => {
    fetchNav().then((nav) => {
      if (nav && nav.categories.length > 0) {
        setCategories(nav.categories.map((c) => ({ label: c.label, path: c.link })));
      }
    });
    fetchSettings().then((settings) => {
      if (!settings) return;
      if (settings.brand?.waterfall_logo) setLogoUrl(settings.brand.waterfall_logo);
      if (settings.contact?.phone) setPhone(settings.contact.phone);
      if (settings.contact?.whatsapp) setWhatsapp(settings.contact.whatsapp);
    });
  }, []);

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
      <header className="fixed top-0 left-0 right-0 z-50 shadow-[0_2px_14px_rgba(0,0,0,0.07)] border-b border-black/5">

        {/* ══ ROW 1 — icons (left) · dual logo (right) — desktop only ══ */}
        <div dir="ltr" className="hidden md:block w-full" style={{ backgroundColor: NAV_BG }}>
          <div dir="ltr" className="max-w-7xl mx-auto px-5 sm:px-8 h-[92px] flex items-center justify-between">

            {/* LEFT — utility icon cluster */}
            <div dir="ltr" className="flex items-center gap-7 sm:gap-9">
              <button
                onClick={openCart}
                className="relative flex flex-col items-center gap-1 cursor-pointer group"
                aria-label="סל קניות"
              >
                <i className="ri-shopping-cart-2-line text-[24px] transition-opacity group-hover:opacity-70" style={{ color: NAV_INK }}></i>
                <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: SUB_INK }}>סל קניות</span>
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
                <i className="ri-user-3-line text-[24px] transition-opacity group-hover:opacity-70" style={{ color: NAV_INK }}></i>
                <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: SUB_INK }}>התחבר</span>
              </Link>

              <Link to="/wishlist" className="flex flex-col items-center gap-1 cursor-pointer group" aria-label="מועדפים">
                <i className="ri-heart-line text-[24px] transition-opacity group-hover:opacity-70" style={{ color: NAV_INK }}></i>
                <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: SUB_INK }}>ווישליסט</span>
              </Link>

              <Link to="/compare" className="flex flex-col items-center gap-1 cursor-pointer group" aria-label="השוואה">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors group-hover:opacity-80"
                  style={{ backgroundColor: SURFACE }}
                >
                  <i className="ri-shopping-bag-3-line text-[19px]" style={{ color: NAV_INK }}></i>
                </span>
                <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: SUB_INK }}>השוואה</span>
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
                  {/* Waterfall logo is ALWAYS the left mark (Nik, July 2026) —
                      the switcher no longer swaps it out on UMBRCOM pages. */}
                  <img src={logoUrl} alt="Waterfall" className="h-9 sm:h-10 w-auto object-contain brightness-0" style={logoStyle} />
                  <i
                    className={`ri-arrow-down-s-fill text-lg leading-none transition-transform duration-200 ${brandMenuOpen ? "rotate-180" : ""}`}
                    style={{ color: NAV_INK }}
                  ></i>
                </button>

                {brandMenuOpen && (
                  <div
                    dir="rtl"
                    className="absolute top-full mt-3 right-1/2 translate-x-1/2 sm:right-0 sm:translate-x-0 w-44 bg-white rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.2)] overflow-hidden text-right"
                  >
                    <Link
                      to="/"
                      onClick={() => { setBrand("waterfall"); setBrandMenuOpen(false); }}
                      className={`block px-4 py-3 text-sm cursor-pointer hover:bg-[#f5f5f5] ${brand.key === "waterfall" ? "font-semibold text-[#1a1a1a]" : "text-[#555]"}`}
                    >
                      Waterfall
                    </Link>
                    <Link
                      to="/umbrcom"
                      onClick={() => { setBrand("umbrcom"); setBrandMenuOpen(false); }}
                      className={`block px-4 py-3 text-sm cursor-pointer border-t border-[#eee] hover:bg-[#f5f5f5] ${brand.key === "umbrcom" ? "font-semibold text-[#1a1a1a]" : "text-[#555]"}`}
                    >
                      UMBRCOM
                    </Link>
                  </div>
                )}
              </div>

              <div className="hidden sm:block h-9 w-px" style={{ backgroundColor: HAIRLINE }} />

              {/* UMBRCOM parent brand — clickable, links home (Nik
                  reversed the earlier not-clickable decision, July 2026). */}
              <Link to="/" className="flex items-center hover:opacity-85 transition-opacity cursor-pointer">
                <img src={UMBRCOM_LOGO_URL} alt="UMBRCOM" className="h-10 sm:h-11 w-auto object-contain" style={logoStyle} />
              </Link>
            </div>
          </div>
        </div>

        {/* ══ ROW 2 — search (left) · nav links + all-categories pill (right) ══ */}
        <div dir="ltr" className="hidden md:block w-full px-5 sm:px-8 py-3" style={{ backgroundColor: NAV_BG }}>
          <div dir="ltr" className="max-w-7xl mx-auto flex items-center justify-between gap-6">

            {/* LEFT — search */}
            <div className="flex-1 max-w-[520px]">
              <div dir="rtl" className="flex items-center rounded-full h-11 px-4 gap-2" style={{ backgroundColor: SURFACE }}>
                <i className={`ri-search-line text-base flex-shrink-0 ${dark ? "text-white/50" : "text-black/35"}`}></i>
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="חיפוש מוצר, מותג או קטגוריה..."
                  className={`flex-1 text-sm text-right outline-none bg-transparent ${dark ? "placeholder-white/50 text-white" : "placeholder-[#999] text-[#111]"}`}
                  dir="rtl"
                />
                <button
                  className="w-8 h-8 -ml-1 flex-shrink-0 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  style={{ backgroundColor: NAV_INK }}
                  aria-label="חיפוש"
                >
                  <i className={`ri-search-line text-sm ${dark ? "text-[#111]" : "text-white"}`}></i>
                </button>
              </div>
            </div>

            {/* RIGHT — nav links + all categories */}
            <div dir="ltr" className="flex items-center gap-5">
              <Link to="/shop" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer whitespace-nowrap" style={{ color: SUB_INK }}>
                מבצעים
                <i className="ri-price-tag-3-line text-sm"></i>
              </Link>
              <span className="h-4 w-px" style={{ backgroundColor: HAIRLINE }} />
              <Link to="/auth" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer whitespace-nowrap" style={{ color: SUB_INK }}>
                מועדון לקוחות
                <i className="ri-headphone-line text-sm"></i>
              </Link>
              <span className="h-4 w-px" style={{ backgroundColor: HAIRLINE }} />
              <Link to="/customer-service" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer whitespace-nowrap" style={{ color: SUB_INK }}>
                שירות לקוחות
                <i className="ri-star-line text-sm"></i>
              </Link>

              {/* All categories — white pill with dropdown */}
              <div ref={catMenuRef} className="relative">
                <button
                  onClick={() => setCatMenuOpen((v) => !v)}
                  className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full cursor-pointer transition-colors whitespace-nowrap ${dark ? "bg-white hover:bg-white/85 text-[#111]" : "bg-[#111] hover:bg-[#2a2a2a] text-white"}`}
                >
                  כל הקטגוריות
                  <i className="ri-grid-fill text-sm"></i>
                </button>

                {catMenuOpen && (
                  <div
                    dir="rtl"
                    className="absolute top-full mt-3 left-0 w-56 bg-white rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.2)] overflow-hidden text-right py-1"
                  >
                    {categories.map((cat) => (
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
                        to="/umbrcom"
                        onClick={() => setCatMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm cursor-pointer hover:bg-[#f5f5f5] text-[#111] font-medium"
                      >
                        UMBRCOM
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══ Mobile header — logo · cart · hamburger ══ */}
        <div dir="rtl" className="md:hidden w-full px-4 h-16 flex items-center justify-between" style={{ backgroundColor: NAV_BG }}>
          <Link to="/" className="flex-shrink-0">
            <img src={UMBRCOM_LOGO_URL} alt="UMBRCOM" className="h-8 w-auto object-contain" style={logoStyle} />
          </Link>

          <div className="flex items-center gap-5">
            <button onClick={openCart} className="relative cursor-pointer" style={{ color: NAV_INK }} aria-label="סל קניות">
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
              className="cursor-pointer"
              style={{ color: NAV_INK }}
              aria-label="תפריט"
            >
              <i className={`text-2xl ${mobileOpen ? "ri-close-line" : "ri-menu-3-line"}`}></i>
            </button>
          </div>
        </div>

        {/* ══ Compact mobile search row ══ */}
        <div dir="rtl" className="md:hidden w-full px-4 pb-3" style={{ backgroundColor: NAV_BG }}>
          <div className="flex items-center rounded-full h-10 px-4 gap-2" style={{ backgroundColor: SURFACE }}>
            <i className={`ri-search-line text-base flex-shrink-0 ${dark ? "text-white/50" : "text-black/35"}`}></i>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="חיפוש מוצר..."
              className={`flex-1 text-sm text-right outline-none bg-transparent ${dark ? "placeholder-white/50 text-white" : "placeholder-[#999] text-[#111]"}`}
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
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/5" style={{ backgroundColor: NAV_BG }}>
            <button onClick={() => setMobileOpen(false)} className="cursor-pointer" style={{ color: NAV_INK }}>
              <i className="ri-close-line text-2xl"></i>
            </button>
            <img src={UMBRCOM_LOGO_URL} alt="UMBRCOM" className="h-9 object-contain" style={logoStyle} />
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
                  <i className={`${l.icon} text-sm`} style={{ color: NAV_INK }}></i>
                </Link>
              ))}
            </div>
          </nav>

          <div className="px-5 py-4 border-t border-gray-100 space-y-2.5">
            <a href={`tel:+${whatsapp}`} className="flex items-center gap-3 text-sm text-gray-500 hover:text-gray-800">
              <i className="ri-phone-line" style={{ color: NAV_INK }}></i>
              {phone}
            </a>
            <a href={`https://wa.me/${whatsapp}`} className="flex items-center gap-3 text-sm text-gray-500 hover:text-[#25D366]">
              <i className="ri-whatsapp-line text-[#25D366]"></i>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
