import { useState } from "react";

const CONTACT_FORM_URL = "https://readdy.ai/api/form/d70o48eth28qd804cuu0";

/** The functional contact form + map. Kept as a fixed React component —
 *  Page Builder edits content, not form behavior — while the banner and
 *  contact-method tiles around it are CMS-editable (see contact/page.tsx). */
export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "", consent: false });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent || charCount > 500) return;
    setLoading(true);
    try {
      const body = new URLSearchParams({ name: form.name, email: form.email, message: form.message });
      const res = await fetch(CONTACT_FORM_URL, {
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
    <div className="max-w-5xl mx-auto px-8 py-20" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left: Form */}
        <div className="text-right">
          <h2 className="font-serif text-2xl font-light text-[#0d0d0d] mb-2">השאירו הודעה</h2>
          <p className="text-sm text-[#888] mb-8">נציג יחזור אליכם בהקדם האפשרי.</p>

          {status === "success" ? (
            <div className="py-12 text-right">
              <div className="w-16 h-16 rounded-full border border-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-2xl text-[#1a1a1a]"></i>
              </div>
              <p className="font-serif text-xl text-[#0d0d0d]">תודה רבה!</p>
              <p className="text-sm text-[#888] mt-2">הודעתכם נשלחה. ניצור עמכם קשר בהקדם.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} data-readdy-form className="space-y-5">
              <div>
                <label className="block text-xs font-medium tracking-wider text-[#666] uppercase mb-2">
                  שם מלא <span className="text-[#1a1a1a]">*</span>
                </label>
                <input
                  type="text" name="name" required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="שמכם המלא"
                  className="w-full border-b border-[#ddd] bg-transparent pb-3 text-right text-sm text-[#0d0d0d] placeholder-[#ccc] outline-none focus:border-[#1a1a1a] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider text-[#666] uppercase mb-2">
                  כתובת אימייל <span className="text-[#1a1a1a]">*</span>
                </label>
                <input
                  type="email" name="email" required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="כתובת האימייל שלכם"
                  className="w-full border-b border-[#ddd] bg-transparent pb-3 text-right text-sm text-[#0d0d0d] placeholder-[#ccc] outline-none focus:border-[#1a1a1a] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider text-[#666] uppercase mb-2">הודעה</label>
                <textarea
                  name="message" rows={4} maxLength={500}
                  value={form.message}
                  onChange={(e) => { setForm({ ...form, message: e.target.value }); setCharCount(e.target.value.length); }}
                  placeholder="כתבו את הודעתכם כאן..."
                  className="w-full border-b border-[#ddd] bg-transparent pb-3 text-right text-sm text-[#0d0d0d] placeholder-[#ccc] outline-none focus:border-[#1a1a1a] transition-colors resize-none"
                />
                <p className="text-[10px] text-[#bbb] mt-1 text-right">{charCount}/500</p>
              </div>
              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox" id="consent" required checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  className="mt-1 cursor-pointer accent-[#1a1a1a]"
                />
                <label htmlFor="consent" className="text-xs text-[#888] cursor-pointer leading-relaxed">
                  קראתי ואני מסכים/ה למדיניות הפרטיות ותנאי השימוש, ומאשר/ת יצירת קשר עמי.
                </label>
              </div>
              {status === "error" && <p className="text-red-500 text-xs">שגיאה. אנא נסו שוב.</p>}
              <button
                type="submit" disabled={loading || !form.consent}
                className="w-full bg-[#0d0d0d] hover:bg-[#1a1a1a] text-white text-sm font-semibold tracking-widest py-4 transition-colors duration-300 cursor-pointer disabled:opacity-40 whitespace-nowrap mt-2"
              >
                {loading ? "שולח..." : "שליחה"}
              </button>
            </form>
          )}
        </div>

        {/* Right: Map */}
        <div className="space-y-10">
          <div className="overflow-hidden border border-[#ede9e1]">
            <iframe
              title="מיקום אמברקום"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54086.03505673286!2d34.8472!3d32.0853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4ca6193b7c1f%3A0xc1fb72a2c0963f90!2sTel%20Aviv-Yafo!5e0!3m2!1she!2sil!4v1699000000000!5m2!1she!2sil"
              width="100%"
              height="220"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
