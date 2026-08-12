import { useState } from "react";
import { Link } from "react-router-dom";

// Compliance fix (Aug 2026): this form previously had `onSubmit={(e) =>
// e.preventDefault()}` — no fields were captured, nothing was sent
// anywhere. It visually promised "נחזור אליכם" (we'll get back to you)
// while silently discarding every submission. That's exactly the kind of
// thing Google's Shopping/Merchant policy calls out under "persuade
// customers to... provide information under false or unclear pretexts."
// Wired to actually go somewhere now, same pattern as CancellationForm.tsx:
// a real POST endpoint if one gets configured, mailto fallback until then
// so requests reach a real, monitored inbox either way.
const BUSINESS_FORM_URL = "";
const FALLBACK_EMAIL = "office@umbrcom.co.il";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-right text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors";

/** The functional B2B inquiry form. Kept as a fixed React component; the
 *  banner and benefit tiles around it are CMS-editable (business/page.tsx). */
export default function BusinessForm() {
  const [form, setForm] = useState({
    company: "",
    contactName: "",
    email: "",
    phone: "",
    scope: "",
    consent: false,
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) return;
    setLoading(true);
    try {
      if (BUSINESS_FORM_URL) {
        const body = new URLSearchParams({
          company: form.company,
          contact_name: form.contactName,
          email: form.email,
          phone: form.phone,
          scope: form.scope,
        });
        const res = await fetch(BUSINESS_FORM_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
        setStatus(res.ok ? "success" : "error");
      } else {
        const subject = encodeURIComponent(`פנייה עסקית — ${form.company || "ללא שם חברה"}`);
        const body = encodeURIComponent(
          `שם החברה: ${form.company}\nאיש קשר: ${form.contactName}\nאימייל: ${form.email}\nטלפון: ${form.phone}\nהיקף הצורך המשוער: ${form.scope}`
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
    <div className="max-w-3xl mx-auto px-8 pb-16" dir="rtl">
      <div className="bg-white border border-[#ede9e1] rounded-2xl p-8">
        <h2 className="font-serif text-xl font-light text-[#1a1410] mb-6">
          השאירו פרטים — נחזור אליכם
        </h2>

        {status === "success" ? (
          <div className="py-8 text-right">
            <div className="w-14 h-14 rounded-full bg-[#111] flex items-center justify-center mb-4">
              <i className="ri-check-line text-2xl text-white"></i>
            </div>
            <p className="text-lg font-semibold text-[#1a1410]">הפנייה נשלחה</p>
            <p className="text-sm text-[#888] mt-1.5">נחזור אליכם בהקדם.</p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">שם החברה</label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="חברת הבנייה שלי בע״מ"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">שם איש קשר</label>
                <input
                  type="text"
                  required
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  placeholder="ישראל ישראלי"
                  className={inputCls}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">אימייל</label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="business@company.co.il"
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
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">היקף הצורך המשוער</label>
              <textarea
                rows={3}
                value={form.scope}
                onChange={(e) => setForm({ ...form, scope: e.target.value })}
                placeholder="לדוגמה: 50 ברזי מטבח לפרויקט מגורים ברחובות..."
                className={`${inputCls} resize-none`}
              />
            </div>
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox" id="business-consent" required checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                className="mt-1 cursor-pointer accent-[#1a1a1a]"
              />
              <label htmlFor="business-consent" className="text-xs text-[#888] cursor-pointer leading-relaxed">
                קראתי ואני מסכים/ה ל<Link to="/privacy" target="_blank" className="underline text-[#1a1a1a] hover:text-[#555]">מדיניות הפרטיות</Link> ו<Link to="/terms" target="_blank" className="underline text-[#1a1a1a] hover:text-[#555]">תנאי השימוש</Link>, ומאשר/ת יצירת קשר עמי.
              </label>
            </div>
            {status === "error" && (
              <p className="text-red-500 text-xs">אירעה שגיאה בשליחה. אנא נסו שוב או פנו אלינו בטלפון.</p>
            )}
            <button
              type="submit"
              disabled={loading || !form.consent}
              className="bg-[#1a1a1a] hover:bg-[#333] text-white text-sm font-semibold tracking-widest px-10 py-4 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
            >
              {loading ? "שולח..." : "שלחו פנייה"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
