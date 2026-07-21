import { useState } from "react";
import { Link } from "react-router-dom";

/** Cancellation-request form (ביטול עסקה) — item 16.
 *  TODO: create a form endpoint (readdy.ai, like the other forms) and paste
 *  its URL below. Until then the form falls back to opening a pre-filled
 *  email to office@umbrcom.co.il so requests still reach the inbox. */
const CANCELLATION_FORM_URL = "";
const FALLBACK_EMAIL = "office@umbrcom.co.il";

const REASONS = [
  "התחרטתי / כבר לא צריך את המוצר",
  "מצאתי מחיר טוב יותר",
  "המוצר לא מתאים / לא תואם לציפיות",
  "טעות בהזמנה (דגם / צבע / כמות)",
  "זמן אספקה ארוך מדי",
  "המוצר הגיע פגום",
  "אחר",
];

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-[#ececec] text-sm text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors";

export default function CancellationForm() {
  const [form, setForm] = useState({
    fullname: "",
    orderNumber: "",
    reason: "",
    reasonDetails: "",
    phone: "",
    email: "",
    consent: false,
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) return;
    setLoading(true);
    try {
      if (CANCELLATION_FORM_URL) {
        const body = new URLSearchParams({
          fullname: form.fullname,
          order_number: form.orderNumber,
          reason: form.reason + (form.reasonDetails ? ` — ${form.reasonDetails}` : ""),
          phone: form.phone,
          email: form.email,
        });
        const res = await fetch(CANCELLATION_FORM_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
        setStatus(res.ok ? "success" : "error");
      } else {
        // No endpoint configured yet — open a pre-filled email instead.
        const subject = encodeURIComponent(`בקשת ביטול עסקה — הזמנה ${form.orderNumber}`);
        const body = encodeURIComponent(
          `שם מלא: ${form.fullname}\nמספר הזמנה: ${form.orderNumber}\nסיבת הביטול: ${form.reason}${
            form.reasonDetails ? `\nפירוט: ${form.reasonDetails}` : ""
          }\nטלפון: ${form.phone}\nאימייל: ${form.email}`
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
    <section dir="rtl" className="max-w-3xl mx-auto px-4 sm:px-8 pb-16 text-right">
      <div className="bg-white border border-[#ececec] rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-[#1a1410] mb-1">טופס בקשת ביטול עסקה</h2>
        <p className="text-sm text-[#888] mb-7">
          מלאו את הפרטים ונטפל בבקשתכם תוך יום עסקים אחד.
        </p>

        {status === "success" ? (
          <div className="py-8 text-right">
            <div className="w-14 h-14 rounded-full bg-[#111] flex items-center justify-center mb-4">
              <i className="ri-check-line text-2xl text-white"></i>
            </div>
            <p className="text-lg font-semibold text-[#1a1410]">הבקשה נקלטה</p>
            <p className="text-sm text-[#888] mt-1.5">
              ניצור עמכם קשר בהקדם לאישור הביטול ולתיאום ההמשך.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">
                  שם מלא <span className="text-[#c0392b]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.fullname}
                  onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                  placeholder="ישראל ישראלי"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">
                  מספר הזמנה <span className="text-[#c0392b]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.orderNumber}
                  onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                  placeholder="לדוגמה: 10432"
                  dir="ltr"
                  className={`${inputCls} text-left`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">
                סיבת הביטול <span className="text-[#c0392b]">*</span>
              </label>
              <select
                required
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className={`${inputCls} cursor-pointer ${form.reason ? "" : "text-[#bbb]"}`}
              >
                <option value="" disabled>
                  בחרו סיבה...
                </option>
                {REASONS.map((r) => (
                  <option key={r} value={r} className="text-[#1a1410]">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {form.reason === "אחר" && (
              <div>
                <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">פירוט</label>
                <textarea
                  rows={3}
                  value={form.reasonDetails}
                  onChange={(e) => setForm({ ...form, reasonDetails: e.target.value })}
                  placeholder="ספרו לנו בקצרה..."
                  className={`${inputCls} resize-none`}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">
                  טלפון <span className="text-[#c0392b]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="050-000-0000"
                  dir="ltr"
                  className={`${inputCls} text-left`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">
                  כתובת אימייל <span className="text-[#c0392b]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@email.com"
                  dir="ltr"
                  className={`${inputCls} text-left`}
                />
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="cancel-consent"
                required
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                className="mt-1 cursor-pointer accent-[#1a1a1a]"
              />
              <label htmlFor="cancel-consent" className="text-xs text-[#888] cursor-pointer leading-relaxed">
                קראתי ואני מסכים/ה ל<Link to="/privacy" target="_blank" className="underline text-[#1a1a1a] hover:text-[#555]">מדיניות הפרטיות</Link> ו<Link to="/terms" target="_blank" className="underline text-[#1a1a1a] hover:text-[#555]">תנאי השימוש</Link>, ומאשר/ת יצירת קשר עמי.
              </label>
            </div>

            {status === "error" && (
              <p className="text-red-500 text-xs">אירעה שגיאה בשליחה. אנא נסו שוב או פנו אלינו בטלפון.</p>
            )}

            <button
              type="submit"
              disabled={loading || !form.consent}
              className="w-full bg-[#111] hover:bg-[#2a2a2a] text-white text-sm font-semibold tracking-widest py-4 rounded-xl transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
            >
              {loading ? "שולח..." : "שליחת בקשת ביטול"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
