import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useBrand } from "@/hooks/useBrand";
import { useBrandContext } from "@/context/BrandContext";
import { fetchSettings } from "@/lib/wp-api";

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

// Item 35 (July 2026): main navigation simplified to exactly these five —
// nothing else, per Nik. Both the desktop "all categories" pill and the
// mobile drawer's primary nav now read from this single list.
const DEFAULT_CATEGORIES = [
  { label: "ברזי מטבח", path: "/shop/kitchen" },
  { label: "ברזי אמבטיה", path: "/shop/bathroom" },
  { label: "ברזי מים קרים", path: "/shop/cold-water" },
  { label: "ערכות מקלחת", path: "/shop/shower-sets" },
  { label: "סדרת ברזי Waterfall", path: "/series" },
];

const DEFAULT_PHONE = "03-620-8197";
const DEFAULT_WHATSAPP = "97236208197";

const MOBILE_NAV = DEFAULT_CATEGORIES;

// Row 2 nav links — matches the client's reference screenshot exactly:
// מבצעים · מועדון לקוחות · שירות לקוחות (plain links), then a separate
// white "כל הקטגוריות" pill button furthest right. No category text link
// row (kitchen/bathroom/etc.) — the reference doesn't show one.
const EXTRA_NAV_LINKS = [
  { label: "מבצעים", path: "/shop" },
  { label: "מועדון לקוחות", path: "/my-account" },
  { label: "סדרות", path: "/series" },
];

// Reference layout (client WhatsApp screenshot): icon cluster fixed left,
// dual logo fixed right, search fixed left on row 2, nav links + a white
// "all categories" pill fixed right. Each cluster below is pinned with
// dir="ltr" so the visual order matches the screenshot exactly regardless
// of the page's own RTL flow; Hebrew text inside still shapes correctly.
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [desktopCategoriesOpen, setDesktopCategoriesOpen] = useState(false);
  const desktopCategoriesRef = useRef<HTMLDivElement>(null);
  const [searchVal, setSearchVal] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { totalCount, openCart } = useCart();
  const brand = useBrand();
  const { setBrandKey: setBrand } = useBrandContext();

  // ── Brand-driven header theme ──
  const dark = brand.key === "waterfall";
  const NAV_BG = brand.headerBg;
  const NAV_INK = brand.headerInk;
  const SUB_INK = dark ? "rgba(58,180,242,0.8)" : "#333333";
  const SURFACE = dark ? "rgba(255,255,255,0.13)" : "#f2f2f2";
  const HAIRLINE = dark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.08)";
  // Both logo files are dark-on-transparent — invert to white on the black header.
  const logoStyle = dark ? { filter: "brightness(0) invert(1)" } : undefined;
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO_URL);
  const [phone, setPhone] = useState(DEFAULT_PHONE);
  const [whatsapp, setWhatsapp] = useState(DEFAULT_WHATSAPP);

  useEffect(() => {
    fetchSettings().then((settings) => {
      if (!settings) return;
      if (settings.brand?.waterfall_logo) setLogoUrl(settings.brand.waterfall_logo);
      if (settings.contact?.phone) setPhone(settings.contact.phone);
      if (settings.contact?.whatsapp) setWhatsapp(settings.contact.whatsapp);
    });
  }, []);

  useEffect(() => { setMobileOpen(false); setDesktopCategoriesOpen(false); }, [location.pathname]);

  // Close the desktop categories dropdown on any click outside it.
  useEffect(() => {
    if (!desktopCategoriesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (desktopCategoriesRef.current && !desktopCategoriesRef.current.contains(e.target as Node)) {
        setDesktopCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [desktopCategoriesOpen]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  // Search was never actually wired to anything — the input only updated
  // local state, the button had no onClick, and nothing navigated anywhere
  // on Enter, so typing a search and hitting enter/search did nothing.
  // Sends the shopper to /shop?search=<query>, which now reads that param
  // and filters the catalog by it (see shop/page.tsx).
  const submitSearch = () => {
    const q = searchVal.trim();
    if (!q) return;
    navigate(`/shop?search=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  };

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

            {/* RIGHT — dual logo: both brands, both always clickable (item 34).
                Umbrcom is the default brand (black accents); clicking the
                Waterfall mark switches the whole site to Waterfall (light
                blue accents) immediately — no menu, no confirmation. */}
            <div dir="ltr" className="flex items-center gap-5 sm:gap-6">
              <button
                onClick={() => setBrand("waterfall")}
                className="flex items-center hover:opacity-85 transition-opacity cursor-pointer"
                aria-label="עבור למותג Waterfall"
                title="Waterfall"
              >
                {/* Confirmed from a live screenshot: the Waterfall logo file
                    itself is natively BLUE, not black artwork (the two
                    previous attempts both assumed it was black and tried to
                    recolor it TO blue — solving the wrong problem). So this
                    needs the opposite treatment: force it black while
                    UMBRCOM is active (brightness(0) turns any-color art to
                    black while preserving its alpha/transparency), and
                    leave it completely unfiltered — native blue — once
                    Waterfall is the active brand. */}
                <img
                  src={logoUrl}
                  alt="Waterfall"
                  className="h-9 sm:h-10 w-auto object-contain"
                  style={dark ? undefined : { filter: "brightness(0)" }}
                />
              </button>

              <div className="hidden sm:block h-9 w-px" style={{ backgroundColor: HAIRLINE }} />

              {/* UMBRCOM parent brand — clickable, switches to the default
                  Umbrcom brand and goes home. */}
              <Link
                to="/"
                onClick={() => setBrand("umbrcom")}
                className="flex items-center hover:opacity-85 transition-opacity cursor-pointer"
                aria-label="עבור למותג UMBRCOM"
                title="UMBRCOM"
              >
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
                  onKeyDown={(e) => { if (e.key === "Enter") submitSearch(); }}
                  placeholder="חיפוש מוצר, מותג או קטגוריה..."
                  className={`flex-1 text-sm text-right outline-none bg-transparent ${dark ? "placeholder-white/50 text-white" : "placeholder-[#999] text-[#111]"}`}
                  dir="rtl"
                />
                <button
                  onClick={submitSearch}
                  className="w-8 h-8 -ml-1 flex-shrink-0 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  style={{ backgroundColor: NAV_INK }}
                  aria-label="חיפוש"
                >
                  <i className={`ri-search-line text-sm ${dark ? "text-[#111]" : "text-white"}`}></i>
                </button>
              </div>
            </div>

            {/* RIGHT — מבצעים · מועדון לקוחות · שירות לקוחות, then the white
                "כל הקטגוריות" pill button furthest right — matches the
                client's reference screenshot 1:1. */}
            <div dir="ltr" className="flex items-center gap-6">
              {/* All three links share one style now — "סדרות" no longer
                  has its own px-8/border-b/absolute-icon treatment, just
                  the same inline icon+text pattern as its neighbors. */}
              {EXTRA_NAV_LINKS.map((l, i) => (
                <Link
                  key={`${l.path}-${i}`}
                  to={l.path}
                  className="text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                  style={{ color: isActive(l.path) ? NAV_INK : SUB_INK, fontWeight: isActive(l.path) ? 700 : 500 }}
                >
                  {/* Text before icon: the row is pinned dir="ltr" (see
                      note above), so DOM order = physical left-to-right —
                      putting the label first and the icon last renders
                      the icon on the right side of the text. */}
                  {l.label}
                  {l.label === "מבצעים" && <i className="ri-price-tag-3-line text-[15px]"></i>}
                  {l.label === "מועדון לקוחות" && <i className="ri-vip-crown-line text-[15px]"></i>}
                  {l.label === "סדרות" && <i className="ri-collage-line text-[15px]"></i>}
                </Link>
              ))}
              <span className="h-4 w-px" style={{ backgroundColor: HAIRLINE }} />

              {/* "כל הקטגוריות" (items 35-36): less-rounded pill that flips
                  color with the header so it's never invisible — black bg
                  / white text on the white (UMBRCOM) header, white bg /
                  black text on the black (Waterfall) header — plus a real
                  toggle that opens the same 5 categories the mobile drawer
                  shows, instead of a plain link to /shop. */}
              <div className="relative" ref={desktopCategoriesRef}>
                <button
                  onClick={() => setDesktopCategoriesOpen((v) => !v)}
                  className={`flex items-center gap-2 text-sm font-semibold rounded-lg px-5 h-10 whitespace-nowrap hover:opacity-90 transition-opacity cursor-pointer ${
                    dark ? "bg-white text-black" : "bg-black text-white"
                  }`}
                >
                  כל הקטגוריות
                  <i className={`ri-grid-fill text-[15px] transition-transform ${desktopCategoriesOpen ? "rotate-90" : ""}`}></i>
                </button>
                {desktopCategoriesOpen && (
                  <div
                    dir="rtl"
                    className="absolute top-full left-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-black/5 py-2 z-50"
                  >
                    {DEFAULT_CATEGORIES.map((c) => (
                      <Link
                        key={c.path}
                        to={c.path}
                        onClick={() => setDesktopCategoriesOpen(false)}
                        className="block px-5 py-2.5 text-sm text-[#333] text-right hover:bg-[#f5f5f5] hover:text-[#1a1a1a] transition-colors"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══ Mobile header (item 1) — logo CENTER · wishlist+cart LEFT ·
            menu RIGHT. `relative` + `overflow-hidden` + min-w-0 on the side
            clusters keep this from ever causing horizontal scroll or a
            clipped top edge on narrow devices (item 2). ══ */}
        <div dir="rtl" className="md:hidden relative w-full max-w-full overflow-hidden px-3 h-16 flex items-center justify-between" style={{ backgroundColor: NAV_BG }}>
          {/* RIGHT (rtl start) — menu icon only */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex-shrink-0 min-w-0 w-10 h-10 flex items-center justify-center cursor-pointer"
            style={{ color: NAV_INK }}
            aria-label="תפריט"
          >
            <i className={`text-2xl ${mobileOpen ? "ri-close-line" : "ri-menu-3-line"}`}></i>
          </button>

          {/* CENTER — logo, absolutely centered regardless of side widths */}
          <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-shrink-0">
            <img src={UMBRCOM_LOGO_URL} alt="UMBRCOM" className="h-8 w-auto object-contain" style={logoStyle} />
          </Link>

          {/* LEFT (rtl end) — wishlist + cart */}
          <div className="flex-shrink-0 min-w-0 flex items-center gap-4">
            <Link to="/wishlist" className="cursor-pointer" style={{ color: NAV_INK }} aria-label="מועדפים">
              <i className="ri-heart-line text-2xl"></i>
            </Link>
            <button onClick={openCart} className="relative cursor-pointer" style={{ color: NAV_INK }} aria-label="סל קניות">
              <i className="ri-shopping-cart-2-line text-2xl"></i>
              {totalCount > 0 && (
                <span
                  className="absolute -top-1.5 -left-1.5 w-[16px] h-[16px] text-[9px] font-bold rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: brand.color }}
                >
                  {totalCount}
                </span>
              )}
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
              onKeyDown={(e) => { if (e.key === "Enter") submitSearch(); }}
              placeholder="חיפוש מוצר..."
              className={`flex-1 text-sm text-right outline-none bg-transparent ${dark ? "placeholder-white/50 text-white" : "placeholder-[#999] text-[#111]"}`}
              dir="rtl"
            />
            <button
              onClick={submitSearch}
              className="w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: NAV_INK }}
              aria-label="חיפוש"
            >
              <i className={`ri-search-line text-xs ${dark ? "text-[#111]" : "text-white"}`}></i>
            </button>
          </div>
        </div>
      </header>

      {/* ══ Mobile drawer ══ */}
      {/* z-[60] (not z-40): the site's own fixed mobile header (top bar +
          search row, ~124px tall) is z-50 — with the drawer below that, the
          header rendered on top of the drawer's top region, covering its
          own header row and the first nav item ("כל הקטגוריות") underneath
          it. This is the actual cause of that item looking "hidden". */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-300 md:hidden ${
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

          {/* min-h-0 is required for a flex child to actually become
              scrollable instead of overflowing past the drawer's bottom —
              a classic flexbox gotcha (flex items default to min-height:
              auto, which ignores overflow-y-auto otherwise). */}
          <nav className="flex-1 min-h-0 overflow-y-auto py-2">
            <div className="bg-[#f8f8f8]">
              {/* "כל הקטגוריות" is now an accordion toggle — the 5 category
                  links (kitchen/bathroom/cold-water/shower-sets/series)
                  nest underneath it instead of sitting as separate
                  top-level rows above this section, per Nik's markup. */}
              <button
                onClick={() => setCategoriesOpen((v) => !v)}
                className="relative flex items-center w-full px-8 py-3 text-xs text-gray-700 font-semibold hover:text-[#1a1a1a] border-b border-gray-100 cursor-pointer"
              >
                <i className="ri-grid-fill text-sm absolute right-8 top-1/2 -translate-y-1/2" style={{ color: NAV_INK }}></i>
                <span className="w-full text-right pr-6">כל הקטגוריות</span>
                <i
                  className={`ri-arrow-down-s-line text-base absolute left-4 top-1/2 -translate-y-1/2 transition-transform duration-200 ${
                    categoriesOpen ? "rotate-180" : ""
                  }`}
                ></i>
              </button>
              {categoriesOpen && (
                <div className="bg-white">
                  {MOBILE_NAV.map((nl) => (
                    <Link
                      key={nl.path}
                      to={nl.path}
                      className={`relative flex items-center pr-12 pl-5 py-3 text-xs border-b border-gray-100 transition-colors ${
                        isActive(nl.path) ? "font-semibold text-[#1a1a1a]" : "text-[#666] hover:text-[#1a1a1a]"
                      }`}
                    >
                      <span className="w-full text-right">{nl.label}</span>
                    </Link>
                  ))}
                </div>
              )}

              {[
                { label: "סדרות", path: "/series", icon: "ri-collage-line" },
                { label: "מבצעים", path: "/shop", icon: "ri-price-tag-3-line" },
                { label: "הרשמה / התחברות", path: "/auth", icon: "ri-user-3-line" },
                { label: "המועדפים שלי", path: "/wishlist", icon: "ri-heart-line" },
                { label: "השוואת מוצרים", path: "/compare", icon: "ri-shopping-bag-3-line" },
                { label: "שירות לקוחות", path: "/customer-service", icon: "ri-headphone-line" },
              ].map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className="relative flex items-center px-8 py-3 text-xs text-gray-600 hover:text-[#1a1a1a] border-b border-gray-100"
                >
                  <i className={`${l.icon} text-sm absolute right-8 top-1/2 -translate-y-1/2`} style={{ color: NAV_INK }}></i>
                  <span className="w-full text-right pr-6">{l.label}</span>
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
