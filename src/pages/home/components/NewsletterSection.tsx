import { useState } from "react";

const FORM_URL = "https://readdy.ai/api/form/d70o0or2m2156g4s70hg";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const body = new URLSearchParams({ email });
      const res = await fetch(FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#0f0f0f] py-20 relative overflow-hidden">
      {/* Subtle gold decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1a1a1a]/50 to-transparent" />

      <div className="max-w-2xl mx-auto px-8 text-right">
        {/* Label */}
        <p className="text-xs font-medium tracking-[0.35em] text-[#1a1a1a] uppercase mb-5">
          ניוזלייטר
        </p>

        {/* Heading */}
        <h2 className="font-serif text-4xl font-light text-white leading-tight mb-4">
          הצטרפו למשפחה שלנו
        </h2>
        <p className="text-[#999] text-sm leading-relaxed mb-10">
          קבלו עדכונים, מבצעים בלעדיים והשראת עיצוב ישירות לתיבת הדואר שלכם.
        </p>

        {status === "success" ? (
          <div className="flex flex-col items-start gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-[#1a1a1a]">
              <i className="ri-check-line text-xl text-[#1a1a1a]"></i>
            </div>
            <p className="text-white text-sm font-medium">נרשמתם בהצלחה! תודה.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            data-readdy-form
            className="flex items-stretch max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="כתובת האימייל שלכם"
              className="flex-1 bg-white/5 border border-white/15 border-l-0 rounded-r-full text-right px-5 py-3.5 text-sm text-white placeholder-[#666] outline-none focus:border-[#1a1a1a]/60 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !consent}
              className="flex-shrink-0 bg-[#1a1a1a] hover:bg-[#333333] text-white text-sm font-semibold px-7 py-3.5 rounded-l-full transition-colors duration-200 whitespace-nowrap cursor-pointer disabled:opacity-60"
            >
              {loading ? "..." : "הרשמה"}
            </button>
          </form>
        )}

        {status !== "success" && (
          <div className="flex items-start justify-center gap-2.5 mt-4 max-w-md mx-auto text-right">
            <input
              type="checkbox" id="newsletter-consent" required checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 cursor-pointer accent-white"
            />
            <label htmlFor="newsletter-consent" className="text-xs text-[#888] cursor-pointer leading-relaxed">
              קראתי ואני מסכים/ה למדיניות הפרטיות ותנאי השימוש, ומאשר/ת יצירת קשר עמי.
            </label>
          </div>
        )}

        {status === "error" && (
          <p className="text-red-400 text-xs mt-3">שגיאה. אנא נסו שוב.</p>
        )}

        <p className="text-[#555] text-xs mt-5">
          <i className="ri-lock-line ml-1"></i>
          אנחנו לא שולחים ספאם, לעולם.
        </p>
      </div>

      {/* Subtle gold decorative line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1a1a1a]/30 to-transparent" />
    </section>
  );
}
