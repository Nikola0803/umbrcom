import { useState } from "react";
import { Link } from "react-router-dom";

// Compliance fix (Aug 2026): this form previously had `onSubmit={(e) =>
// e.preventDefault()}` with zero fields wired to state — it promised "לאחר
// הרישום תקבלו אישור במייל" (you'll get a confirmation email after
// registering) while capturing and sending nothing at all. Same fix
// pattern as CancellationForm.tsx / BusinessForm.tsx: real POST endpoint
// if one gets configured, mailto fallback until then.
const WARRANTY_FORM_URL = "";
const FALLBACK_EMAIL = "office@umbrcom.co.il";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors";

/** The functional warranty-activation form. Kept as a fixed React
 *  component; the header/intro is CMS-editable (warranty/page.tsx). */
export default function WarrantyForm() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    sku: "",
    purchaseDate: "",
    consent: false,
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) return;
    setLoading(true);
    try {
      if (WARRANTY_FORM_URL) {
        const body = new URLSearchParams({
          fullname: form.fullname,
          email: form.email,
          phone: form.phone,
          sku: form.sku,
          purchase_date: form.purchaseDate,
        });
        const res = await fetch(WARRANTY_FORM_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
        setStatus(res.ok ? "success" : "error");
      } else {
        const subject = encodeURIComponent(`הפעלת אחריות — מק"ט ${form.sku || "לא צוין"}`);
        const body = encodeURIComponent(
          `שם מלא: ${form.fullname}\nאימייל: ${form.email}\nטלפון: ${form.phone}\nמק"ט / SKU: ${form.sku}\nתאריך רכישה: ${form.purchaseDate}`
        );
        window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
        setStatus("success");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 pb-16 text-right" dir="rtl">
      {status === "success" ? (
        <div className="py-8 text-right bg-white border border-[#ede9e1] rounded-2xl p-6">
          <div className="w-14 h-14 rounded-full bg-[#111] flex items-center justify-center mb-4">
            <i className="ri-check-line text-2xl text-white"></i>
          </div>
          <p className="text-lg font-semibold text-[#1a1410]">האחריות נרשמה</p>
          <p className="text-sm text-[#888] mt-1.5">אישור עם פרטי האחריות שלכם יישלח לאימייל שהזנתם.</p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">שם מלא</label>
            <input
              type="text"
              required
              value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
              placeholder="ישראל ישראלי"
              className={`${inputCls} text-right`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">כתובת אימייל</label>
            <input
              type="email"
              required
              dir="ltr"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@email.com"
              className={`${inputCls} text-left`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">טלפון</label>
            <input
              type="tel"
              required
              dir="ltr"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="050-000-0000"
              className={`${inputCls} text-left`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">מספר מק&quot;ט / SKU</label>
            <input
              type="text"
              required
              dir="ltr"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="5508-003"
              className={`${inputCls} text-left`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">תאריך רכישה</label>
            <input
              type="date"
              required
              value={form.purchaseDate}
              onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
              className={`${inputCls} text-right`}
            />
          </div>
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox" id="warranty-consent" required checked={form.consent}
              onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              className="mt-1 cursor-pointer accent-[#1a1a1a]"
            />
            <label htmlFor="warranty-consent" className="text-xs text-[#888] cursor-pointer leading-relaxed">
              קראתי ואני מסכים/ה ל<Link to="/privacy" target="_blank" className="underline text-[#1a1a1a] hover:text-[#555]">מדיניות הפרטיות</Link> ו<Link to="/terms" target="_blank" className="underline text-[#1a1a1a] hover:text-[#555]">תנאי השימוש</Link>, ומאשר/ת יצירת קשר עמי.
            </label>
          </div>
          {status === "error" && (
            <p className="text-red-500 text-xs">אירעה שגיאה בשליחה. אנא נסו שוב או פנו אלינו בטלפון.</p>
          )}
          <button
            type="submit"
            disabled={loading || !form.consent}
            className="w-full mt-2 bg-[#1a1a1a] hover:bg-[#333333] text-white text-sm font-semibold tracking-widest py-4 rounded-xl transition-colors duration-300 cursor-pointer whitespace-nowrap disabled:opacity-40"
          >
            {loading ? "שולח..." : "הפעלת אחריות"}
          </button>
        </form>
      )}

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
