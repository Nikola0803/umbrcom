import { useState } from "react";
import { sendUmbrcomForm } from "@/lib/wflSubmit";

// Compliance fix (Aug 2026): this form previously had `onSubmit={(e) =>
// e.preventDefault()}` with no fields wired to state — it promised to
// resend an invoice while sending nothing anywhere. Now submits into the
// shared WFL Micro CRM plugin (Umbrcom Submissions inbox) — replaces the
// mailto: fallback that stood in until a real endpoint existed.
const inputCls =
  "w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors";

/** The functional invoice-recovery form. Kept as a fixed React component;
 *  the header/intro is CMS-editable (legal/invoice-recovery.tsx). */
export default function InvoiceRecoveryForm() {
  const [form, setForm] = useState({ orderNumber: "", orderEmail: "", sendToEmail: "" });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { ok } = await sendUmbrcomForm("Umbrcom Invoice Recovery", {
      "מספר הזמנה": form.orderNumber,
      "אימייל שבו הוזמן": form.orderEmail,
      "לשלוח את החשבונית אל": form.sendToEmail,
    });
    setStatus(ok ? "success" : "error");
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto px-6 pb-16 text-right" dir="rtl">
      {status === "success" ? (
        <div className="py-8 text-right bg-white border border-[#ede9e1] rounded-2xl p-6">
          <div className="w-14 h-14 rounded-full bg-[#111] flex items-center justify-center mb-4">
            <i className="ri-check-line text-2xl text-white"></i>
          </div>
          <p className="text-lg font-semibold text-[#1a1410]">הבקשה נשלחה</p>
          <p className="text-sm text-[#888] mt-1.5">נשלח את החשבונית לאימייל שציינתם בהקדם.</p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">מספר הזמנה</label>
            <input
              type="text"
              required
              dir="ltr"
              value={form.orderNumber}
              onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
              placeholder="ORD-2025-001"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">אימייל שבו הוזמן</label>
            <input
              type="email"
              required
              dir="ltr"
              value={form.orderEmail}
              onChange={(e) => setForm({ ...form, orderEmail: e.target.value })}
              placeholder="example@email.com"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">לאיזה אימייל לשלוח?</label>
            <input
              type="email"
              required
              dir="ltr"
              value={form.sendToEmail}
              onChange={(e) => setForm({ ...form, sendToEmail: e.target.value })}
              placeholder="example@email.com"
              className={inputCls}
            />
          </div>
          {status === "error" && (
            <p className="text-red-500 text-xs">אירעה שגיאה בשליחה. אנא נסו שוב או פנו אלינו בטלפון.</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] hover:bg-[#333] text-white text-sm font-semibold tracking-widest py-4 rounded-xl transition-colors cursor-pointer mt-2 disabled:opacity-40"
          >
            {loading ? "שולח..." : "שלחו חשבונית"}
          </button>
        </form>
      )}

      <div className="mt-8 p-4 bg-white rounded-xl border border-[#ede9e1] text-xs text-[#9a8a7a] leading-relaxed text-right">
        לא מצאתם? צרו איתנו קשר ב-
        <a href="tel:+97236208197" className="text-[#1a1a1a] font-semibold mx-1">03-620-8197</a>
        ונסייע ישירות.
      </div>
    </div>
  );
}
