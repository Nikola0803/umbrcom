import { useState } from "react";
import PageLayout from "../../components/feature/PageLayout";

const CS_FORM_URL = "https://readdy.ai/api/form/d70o48eth28qd804cuug";

export default function CustomerServicePage() {
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
    <PageLayout>
      <div className="max-w-3xl mx-auto px-6 py-14" dir="rtl">
        {/* Breadcrumb */}
        <p className="text-sm text-gray-400 mb-2">שירות לקוחות</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-right">שירות לקוחות</h1>

        {/* Intro */}
        <p className="text-sm text-gray-600 leading-relaxed mb-10 text-right max-w-2xl mx-auto">
          אצלנו ב-Umbrcom תמיכה אמיתית מתחילה לפני הרכישה וממשיכה אחרי קבלתה: צוות מקצועי זמין לכל שאלה טכנית, ביצוע הזמנות, תיאום משלוחים, ואף טיפול בתלונות. ניתן לפנות אלינו בטלפון, במייל או ב-WhatsApp, ואנו מבטיחים מענה מהיר, אדיב ואפקטיבי – כי אצלנו הלקוח תמיד במקום הראשון.
        </p>

        {/* Form */}
        {status === "success" ? (
          <div className="py-10 text-right text-green-600 font-medium">
            תודה! הודעתך נשלחה. נחזור אליך בהקדם.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            data-readdy-form
            className="space-y-4"
          >
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                שם + שם משפחה <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullname"
                required
                value={form.fullname}
                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                placeholder="שם + שם משפחה"
                className="w-full border border-gray-200 px-3 py-2 text-sm text-right outline-none focus:border-gray-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                טלפון <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="טלפון"
                className="w-full border border-gray-200 px-3 py-2 text-sm text-right outline-none focus:border-gray-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                אימייל <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="אימייל"
                className="w-full border border-gray-200 px-3 py-2 text-sm text-right outline-none focus:border-gray-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">הודעה:</label>
              <textarea
                name="message"
                rows={4}
                maxLength={500}
                value={form.message}
                onChange={(e) => {
                  setForm({ ...form, message: e.target.value });
                  setCharCount(e.target.value.length);
                }}
                placeholder="הודעה"
                className="w-full border border-gray-200 px-3 py-2 text-sm text-right outline-none focus:border-gray-400 bg-gray-50 resize-none"
              />
              <p className="text-xs text-gray-400 text-right">{charCount}/500</p>
            </div>
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="cs-consent"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                className="mt-0.5 cursor-pointer"
              />
              <label htmlFor="cs-consent" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                אני מסכים/ה למידיניות הפרטיות ולתנאים והגבלות, ומאשר יצירת קשר עימי.
              </label>
            </div>
            {status === "error" && (
              <p className="text-red-500 text-sm">אירעה שגיאה, אנא נסה שוב.</p>
            )}
            <button
              type="submit"
              disabled={loading || !form.consent}
              className="w-full bg-[#f5a623] hover:bg-[#e0951a] text-white font-semibold py-3 text-sm transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "שולח..." : "שליחה"}
            </button>
          </form>
        )}

        {/* Contact icons */}
        <div className="grid grid-cols-3 gap-6 mt-14 text-right">
          <a
            href="mailto:office@umbrcom.co.il"
            className="flex flex-col items-start gap-3 cursor-pointer group"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-900 group-hover:bg-gray-700 transition-colors">
              <i className="ri-mail-line text-white text-2xl"></i>
            </div>
            <span className="text-sm text-gray-700">לחץ כאן לשליחת מייל</span>
          </a>
          <a
            href="tel:036208197"
            className="flex flex-col items-start gap-3 cursor-pointer group"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-900 group-hover:bg-gray-700 transition-colors">
              <i className="ri-phone-line text-white text-2xl"></i>
            </div>
            <span className="text-sm text-gray-700">לחץ כאן לשיחה עם נציג</span>
          </a>
          <a
            href="https://wa.me/972036208197"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="flex flex-col items-start gap-3 cursor-pointer group"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-900 group-hover:bg-gray-700 transition-colors">
              <i className="ri-whatsapp-line text-white text-2xl"></i>
            </div>
            <span className="text-sm text-gray-700">לחץ כאן למעבר לוואטסאפ</span>
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
