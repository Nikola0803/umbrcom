import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "umbrc_cookie_consent";

type ConsentState = "accepted" | "declined" | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentState | null;
    if (!stored) {
      // Small delay so it doesn't flash immediately on load
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
    setConsent(stored);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setConsent("declined");
    setVisible(false);
  };

  if (!visible || consent !== null) return null;

  return (
    <div
      dir="rtl"
      className={`fixed bottom-0 left-0 right-0 z-[60] transition-transform duration-500 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Backdrop blur line at top */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1a1a1a]/30 to-transparent" />

      <div className="bg-white/95 backdrop-blur-md border-t border-[#ede9e1] shadow-2xl px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Text */}
          <div className="flex items-start gap-3 flex-1">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#ede9e1] flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-cookie-line text-[#1a1a1a] text-lg"></i>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#1a1410] mb-0.5">
                אנחנו משתמשים בעוגיות (Cookies)
              </p>
              <p className="text-xs text-[#6a5e52] leading-relaxed max-w-2xl">
                האתר משתמש בעוגיות חיוניות לצורך פעולתו התקינה, ובעוגיות אנליטיקה לשיפור חוויית המשתמש.
                בהתאם לחוק הגנת הפרטיות הישראלי ותקנות הספאם, אנחנו מבקשים את הסכמתכם לשימוש בעוגיות
                שאינן חיוניות.{" "}
                <Link to="/privacy" className="text-[#1a1a1a] hover:underline">
                  מדיניות פרטיות
                </Link>
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-medium text-[#6a5e52] border border-[#ede9e1] rounded-xl hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors cursor-pointer whitespace-nowrap"
            >
              עוגיות חיוניות בלבד
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-semibold text-white bg-[#1a1a1a] hover:bg-[#333333] rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-sm"
            >
              אישור הכל
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
