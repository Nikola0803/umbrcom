import { useState } from "react";
import { Link } from "react-router-dom";

const CS_FORM_URL = "https://readdy.ai/api/form/d70o48eth28qd804cuug";

/** The functional customer-service form. Kept as a fixed React component;
 *  the header, intro copy, and contact-method tiles are CMS-editable
 *  (customer-service/page.tsx). */
export default function CustomerServiceForm() {
  const [form, setForm] = useState({ fullname: "", phone: "", email: "", message: "", consent: false });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) return;
    if (charCount > 500) return;
    setLoading(true);
    try {
      const body = new URLSearchParams({
        fullname: form.fullname,
        phone: form.phone,
        email: form.email,
        message: form.message,
      });
      const res = await fetch(CS_FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 pb-16" dir="rtl">
      {status === "success" ? (
        <div className="py-10 text-right text-green-600 font-medium">
          תודה! הודעתך נשלחה. נחזור אליך בהקדם.
        </div>
      ) : (
        <form onSubmit={handleSubmit} data-readdy-form className="space-y-4 bg-white border border-[#ececec] rounded-2xl p-6 sm:p-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">שם מלא</label>
            <input
              type="text" required value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-right outline-none focus:border-gray-900 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">טלפון</label>
            <input
              type="tel" required value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              dir="ltr"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-left outline-none focus:border-gray-900 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">אימייל</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              dir="ltr"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-left outline-none focus:border-gray-900 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">הודעה</label>
            <textarea
              rows={4} maxLength={500} value={form.message}
              onChange={(e) => { setForm({ ...form, message: e.target.value }); setCharCount(e.target.value.length); }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-right outline-none focus:border-gray-900 transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{charCount}/500</p>
          </div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox" required checked={form.consent}
              onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              className="mt-1 cursor-pointer"
            />
            <label className="text-xs text-gray-500 leading-relaxed">
              קראתי ואני מסכים/ה ל<Link to="/privacy" target="_blank" className="underline text-gray-700 hover:text-black">מדיניות הפרטיות</Link> ו<Link to="/terms" target="_blank" className="underline text-gray-700 hover:text-black">תנאי השימוש</Link>, ומאשר/ת יצירת קשר עמי.
            </label>
          </div>
          {status === "error" && (
            <p className="text-red-500 text-sm">אירעה שגיאה, אנא נסה שוב.</p>
          )}
          <button
            type="submit"
            disabled={loading || !form.consent}
            className="w-full bg-[#111] hover:bg-[#2a2a2a] text-white font-semibold py-3.5 text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "שולח..." : "שליחה"}
          </button>
        </form>
      )}
    </div>
  );
}
