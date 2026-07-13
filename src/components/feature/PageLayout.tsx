import { ReactNode, useState } from "react";
import Navbar from "../../pages/home/components/Navbar";
import Footer from "../../pages/home/components/Footer";
import CookieBanner from "./CookieBanner";

interface PageLayoutProps {
  children: ReactNode;
}

// ─── Floating contact buttons (WhatsApp + Phone) ───────────────────────────
function FloatingContactButtons() {
  return (
    <div className="fixed bottom-[80px] right-5 z-40 flex flex-col items-center gap-2.5">
      {/* WhatsApp */}
      <a
        href="https://wa.me/97236208197"
        target="_blank"
        rel="nofollow noopener noreferrer"
        aria-label="WhatsApp"
        className="w-12 h-12 bg-[#25D366] hover:bg-[#1fba59] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      >
        <i className="ri-whatsapp-line text-2xl"></i>
      </a>
      {/* Phone */}
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

// ─── Accessibility widget ──────────────────────────────────────────────────
function AccessibilityButton() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);

  const applyFontSize = (pct: number) => {
    document.documentElement.style.fontSize = `${pct}%`;
    setFontSize(pct);
  };

  const toggleContrast = () => {
    setHighContrast((v) => {
      document.body.classList.toggle("high-contrast", !v);
      return !v;
    });
  };

  const toggleUnderline = () => {
    setUnderlineLinks((v) => {
      document.body.classList.toggle("underline-links", !v);
      return !v;
    });
  };

  const reset = () => {
    applyFontSize(100);
    document.body.classList.remove("high-contrast", "underline-links");
    setHighContrast(false);
    setUnderlineLinks(false);
  };

  return (
    <>
      {/* Panel */}
      {open && (
        <div
          dir="rtl"
          className="fixed bottom-24 right-5 z-50 w-68 w-[270px] bg-white border border-[#e0e8f5] rounded-2xl shadow-[0_8px_40px_rgba(21,101,192,0.15)] p-5 text-right"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setOpen(false)}
              className="text-[#999] hover:text-[#333] cursor-pointer text-sm"
              aria-label="סגור"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#1a1410]">הגדרות נגישות</h3>
              <i className="ri-user-settings-line text-[#1565c0] text-base"></i>
            </div>
          </div>

          {/* Font size */}
          <div className="mb-4">
            <p className="text-xs text-[#6a5e52] mb-2">גודל טקסט</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => applyFontSize(Math.max(80, fontSize - 10))}
                className="w-8 h-8 rounded-lg border border-[#ede9e1] flex items-center justify-center text-sm hover:bg-[#faf8f5] cursor-pointer"
              >
                A-
              </button>
              <span className="flex-1 text-center text-xs text-[#6a5e52]">{fontSize}%</span>
              <button
                onClick={() => applyFontSize(Math.min(140, fontSize + 10))}
                className="w-8 h-8 rounded-lg border border-[#ede9e1] flex items-center justify-center text-sm font-bold hover:bg-[#faf8f5] cursor-pointer"
              >
                A+
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 mb-4">
            <button
              onClick={toggleContrast}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                highContrast ? "border-[#1a1a1a] bg-[#fdf8f2] text-[#1a1a1a]" : "border-[#ede9e1] text-[#6a5e52] hover:bg-[#faf8f5]"
              }`}
            >
              <i className={`ri-checkbox-circle-${highContrast ? "fill" : "line"} ml-2`}></i>
              ניגודיות גבוהה
            </button>
            <button
              onClick={toggleUnderline}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                underlineLinks ? "border-[#1a1a1a] bg-[#fdf8f2] text-[#1a1a1a]" : "border-[#ede9e1] text-[#6a5e52] hover:bg-[#faf8f5]"
              }`}
            >
              <i className={`ri-checkbox-circle-${underlineLinks ? "fill" : "line"} ml-2`}></i>
              הדגשת קישורים
            </button>
          </div>

          <button
            onClick={reset}
            className="w-full text-xs text-[#9a8a7a] hover:text-[#1a1a1a] transition-colors cursor-pointer border border-[#ede9e1] rounded-lg py-2 hover:border-[#1a1a1a]"
          >
            איפוס הגדרות
          </button>
        </div>
      )}

      {/* Toggle button — Israeli standard accessibility style */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="תפריט נגישות"
        className="fixed bottom-6 right-5 z-50 flex flex-col items-center gap-1 cursor-pointer group"
      >
        <div className="w-13 h-13 w-[52px] h-[52px] bg-[#1565c0] group-hover:bg-[#0d47a1] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(21,101,192,0.45)] group-hover:shadow-[0_6px_24px_rgba(21,101,192,0.55)] transition-all duration-200 group-hover:scale-105">
          <i className="ri-user-settings-line text-2xl"></i>
        </div>
        <span className="text-[9px] font-bold text-white bg-[#1565c0] px-2 py-0.5 rounded-full tracking-wide leading-tight shadow-sm">
          נגישות
        </span>
      </button>
    </>
  );
}

// ─── Layout ────────────────────────────────────────────────────────────────
export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div dir="rtl" className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-[129px] md:pt-[173px]">
        {children}
      </div>
      <Footer />
      <FloatingContactButtons />
      <AccessibilityButton />
      <CookieBanner />
    </div>
  );
}
