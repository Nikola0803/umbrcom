import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../pages/home/components/Navbar";
import Footer from "../../pages/home/components/Footer";
import CookieBanner from "./CookieBanner";

interface PageLayoutProps {
  children: ReactNode;
}

// ─── Floating contact buttons — moved to the LEFT side so the
//     accessibility button owns the bottom-right corner ───────────────────
function FloatingContactButtons() {
  return (
    <div className="fixed bottom-6 left-5 z-40 flex flex-col items-center gap-2.5">
      <a
        href="https://wa.me/97236208197"
        target="_blank"
        rel="nofollow noopener noreferrer"
        aria-label="WhatsApp"
        className="w-12 h-12 bg-[#25D366] hover:bg-[#1fba59] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      >
        <i className="ri-whatsapp-line text-2xl"></i>
      </a>
      <a
        href="tel:+97236208197"
        aria-label="Phone"
        className="w-12 h-12 bg-[#1a1a1a] hover:bg-[#333333] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      >
        <i className="ri-phone-line text-xl"></i>
      </a>
    </div>
  );
}

// ─── Accessibility widget — Israeli-standard style, bottom RIGHT ──────────
//     (items 4 + 14: same style as the Mashiach site, positioned right)
function AccessibilityButton() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [flags, setFlags] = useState({
    contrast: false,
    grayscale: false,
    invert: false,
    underline: false,
    readable: false,
    noMotion: false,
  });

  const applyFontSize = (pct: number) => {
    document.documentElement.style.fontSize = `${pct}%`;
    setFontSize(pct);
  };

  const toggle = (key: keyof typeof flags, cls: string) => {
    setFlags((f) => {
      const next = !f[key];
      document.body.classList.toggle(cls, next);
      return { ...f, [key]: next };
    });
  };

  const reset = () => {
    applyFontSize(100);
    ["high-contrast", "grayscale-mode", "invert-mode", "underline-links", "readable-font", "no-motion"].forEach(
      (c) => document.body.classList.remove(c)
    );
    setFlags({ contrast: false, grayscale: false, invert: false, underline: false, readable: false, noMotion: false });
  };

  const OPTIONS: { key: keyof typeof flags; cls: string; icon: string; label: string }[] = [
    { key: "contrast", cls: "high-contrast", icon: "ri-contrast-2-line", label: "ניגודיות גבוהה" },
    { key: "invert", cls: "invert-mode", icon: "ri-contrast-drop-2-line", label: "ניגודיות הפוכה" },
    { key: "grayscale", cls: "grayscale-mode", icon: "ri-drop-line", label: "גווני אפור" },
    { key: "underline", cls: "underline-links", icon: "ri-link", label: "הדגשת קישורים" },
    { key: "readable", cls: "readable-font", icon: "ri-font-size-2", label: "גופן קריא" },
    { key: "noMotion", cls: "no-motion", icon: "ri-pause-circle-line", label: "עצירת אנימציות" },
  ];

  return (
    <>
      {open && (
        <div
          dir="rtl"
          className="fixed bottom-24 right-5 z-50 w-[300px] bg-white rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.22)] overflow-hidden text-right"
          role="dialog"
          aria-label="תפריט נגישות"
        >
          {/* Header — blue, standard widget look */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1565c0]">
            <div className="flex items-center gap-2">
              <i className="ri-wheelchair-line text-white text-lg"></i>
              <h3 className="text-sm font-bold text-white">כלי נגישות</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white cursor-pointer"
              aria-label="סגור תפריט נגישות"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          <div className="p-4">
            {/* Font size */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-[#333] mb-2">גודל טקסט ({fontSize}%)</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => applyFontSize(Math.max(80, fontSize - 10))}
                  className="flex-1 h-9 rounded-lg border border-[#e2e2e2] flex items-center justify-center text-sm hover:bg-[#f4f8fd] hover:border-[#1565c0] cursor-pointer"
                  aria-label="הקטנת טקסט"
                >
                  <i className="ri-subtract-line"></i> א
                </button>
                <button
                  onClick={() => applyFontSize(Math.min(150, fontSize + 10))}
                  className="flex-1 h-9 rounded-lg border border-[#e2e2e2] flex items-center justify-center text-base font-bold hover:bg-[#f4f8fd] hover:border-[#1565c0] cursor-pointer"
                  aria-label="הגדלת טקסט"
                >
                  <i className="ri-add-line"></i> א
                </button>
              </div>
            </div>

            {/* Option grid — 2 columns of tiles, standard Israeli widget layout */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {OPTIONS.map((o) => (
                <button
                  key={o.key}
                  onClick={() => toggle(o.key, o.cls)}
                  aria-pressed={flags[o.key]}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border py-3 px-2 text-[11px] font-medium transition-colors cursor-pointer ${
                    flags[o.key]
                      ? "border-[#1565c0] bg-[#eaf2fc] text-[#1565c0]"
                      : "border-[#e6e6e6] text-[#555] hover:border-[#1565c0]/50 hover:bg-[#f7fafd]"
                  }`}
                >
                  <i className={`${o.icon} text-lg`}></i>
                  {o.label}
                </button>
              ))}
            </div>

            <button
              onClick={reset}
              className="w-full text-xs font-semibold text-[#1565c0] hover:text-white hover:bg-[#1565c0] transition-colors cursor-pointer border border-[#1565c0] rounded-lg py-2.5 mb-2"
            >
              <i className="ri-refresh-line ml-1"></i>
              איפוס הגדרות
            </button>

            <Link
              to="/accessibility-statement"
              onClick={() => setOpen(false)}
              className="block text-right text-[11px] text-[#888] hover:text-[#1565c0] underline"
            >
              הצהרת נגישות
            </Link>
          </div>
        </div>
      )}

      {/* Toggle — round blue button with the standard accessibility figure,
          fixed to the bottom-RIGHT corner */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="פתיחת תפריט נגישות"
        className="fixed bottom-6 right-5 z-50 w-[54px] h-[54px] bg-[#1565c0] hover:bg-[#0d47a1] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(21,101,192,0.45)] hover:shadow-[0_6px_24px_rgba(21,101,192,0.55)] transition-all duration-200 hover:scale-105 cursor-pointer"
      >
        <i className="ri-wheelchair-line text-[26px]"></i>
      </button>
    </>
  );
}

// ─── Layout ────────────────────────────────────────────────────────────────
export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div dir="rtl" className="min-h-screen bg-white">
      <Navbar />
      {/* Mobile header: 64px logo row + ~66px search row ≈ 130px.
          Desktop: 92px icon/logo row + ~68px search+links row ≈ 160px. */}
      <div className="pt-[130px] md:pt-[160px]">
        {children}
      </div>
      <Footer />
      <FloatingContactButtons />
      <AccessibilityButton />
      <CookieBanner />
    </div>
  );
}
