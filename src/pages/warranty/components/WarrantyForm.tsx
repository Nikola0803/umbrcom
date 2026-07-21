import { useState } from "react";
import { Link } from "react-router-dom";

/** The functional warranty-activation form. Kept as a fixed React
 *  component; the header/intro is CMS-editable (warranty/page.tsx). */
export default function WarrantyForm() {
  const [consent, setConsent] = useState(false);
  return (
    <div className="max-w-xl mx-auto px-6 pb-16 text-right" dir="rtl">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">שם מלא</label>
          <input
            type="text"
            placeholder="ישראל ישראלי"
            className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-right text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">כתובת אימייל</label>
          <input
            type="email"
            placeholder="example@email.com"
            dir="ltr"
            className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">טלפון</label>
          <input
            type="tel"
            placeholder="050-000-0000"
            dir="ltr"
            className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">מספר מק&quot;ט / SKU</label>
          <input
            type="text"
            placeholder="5508-003"
            dir="ltr"
            className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">תאריך רכישה</label>
          <input
            type="date"
            className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-right text-[#1a1410] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
          />
        </div>
        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox" id="warranty-consent" required checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 cursor-pointer accent-[#1a1a1a]"
          />
          <label htmlFor="warranty-consent" className="text-xs text-[#888] cursor-pointer leading-relaxed">
            קראתי ואני מסכים/ה ל<Link to="/privacy" target="_blank" className="underline text-[#1a1a1a] hover:text-[#555]">מדיניות הפרטיות</Link> ו<Link to="/terms" target="_blank" className="underline text-[#1a1a1a] hover:text-[#555]">תנאי השימוש</Link>, ומאשר/ת יצירת קשר עמי.
          </label>
        </div>
        <button
          type="submit"
          disabled={!consent}
          className="w-full mt-2 bg-[#1a1a1a] hover:bg-[#333333] text-white text-sm font-semibold tracking-widest py-4 rounded-xl transition-colors duration-300 cursor-pointer whitespace-nowrap disabled:opacity-40"
        >
          הפעלת אחריות
        </button>
      </form>

      <div className="mt-8 p-5 bg-white border border-[#ede9e1] rounded-2xl text-right">
        <div className="flex items-start gap-3 flex-row-reverse">
          <i className="ri-information-line text-[#1a1a1a] text-lg flex-shrink-0 mt-0.5"></i>
          <p className="text-xs text-[#6a5e52] leading-relaxed">
            מוצרי Waterfall מגיעים עם אחריות מלאה של 7 שנים על חלקי הברז ומנגנון הקרמיקה.
            לאחר הרישום תקבלו אישור במייל עם פרטי האחריות שלכם.
          </p>
        </div>
      </div>

      <div className="mt-6 text-right">
        <Link to="/contact" className="text-xs text-[#1a1a1a] hover:underline">
          לשאלות נוספות — צרו קשר
        </Link>
      </div>
    </div>
  );
}
