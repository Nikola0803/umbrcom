import { useState } from "react";
import { Link } from "react-router-dom";

/** The functional B2B inquiry form. Kept as a fixed React component; the
 *  banner and benefit tiles around it are CMS-editable (business/page.tsx). */
export default function BusinessForm() {
  const [consent, setConsent] = useState(false);
  return (
    <div className="max-w-3xl mx-auto px-8 pb-16" dir="rtl">
      <div className="bg-white border border-[#ede9e1] rounded-2xl p-8">
        <h2 className="font-serif text-xl font-light text-[#1a1410] mb-6">
          השאירו פרטים — נחזור אליכם
        </h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">שם החברה</label>
              <input type="text" placeholder="חברת הבנייה שלי בע״מ" className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-right text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">שם איש קשר</label>
              <input type="text" placeholder="ישראל ישראלי" className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-right text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">אימייל</label>
              <input type="email" placeholder="business@company.co.il" dir="ltr" className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">טלפון</label>
              <input type="tel" placeholder="050-000-0000" dir="ltr" className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">היקף הצורך המשוער</label>
            <textarea rows={3} placeholder="לדוגמה: 50 ברזי מטבח לפרויקט מגורים ברחובות..." className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-right text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none" />
          </div>
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox" id="business-consent" required checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 cursor-pointer accent-[#1a1a1a]"
            />
            <label htmlFor="business-consent" className="text-xs text-[#888] cursor-pointer leading-relaxed">
              קראתי ואני מסכים/ה ל<Link to="/privacy" target="_blank" className="underline text-[#1a1a1a] hover:text-[#555]">מדיניות הפרטיות</Link> ו<Link to="/terms" target="_blank" className="underline text-[#1a1a1a] hover:text-[#555]">תנאי השימוש</Link>, ומאשר/ת יצירת קשר עמי.
            </label>
          </div>
          <button type="submit" disabled={!consent} className="bg-[#1a1a1a] hover:bg-[#333] text-white text-sm font-semibold tracking-widest px-10 py-4 rounded-xl transition-colors cursor-pointer disabled:opacity-40">
            שלחו פנייה
          </button>
        </form>
      </div>
    </div>
  );
}
