/** The functional invoice-recovery form. Kept as a fixed React component;
 *  the header/intro is CMS-editable (legal/invoice-recovery.tsx). */
export default function InvoiceRecoveryForm() {
  return (
    <div className="max-w-lg mx-auto px-6 pb-16 text-right" dir="rtl">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">מספר הזמנה</label>
          <input type="text" placeholder="ORD-2025-001" dir="ltr" className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">אימייל שבו הוזמן</label>
          <input type="email" placeholder="example@email.com" dir="ltr" className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">לאיזה אימייל לשלוח?</label>
          <input type="email" placeholder="example@email.com" dir="ltr" className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors" />
        </div>
        <button type="submit" className="w-full bg-[#1a1a1a] hover:bg-[#333] text-white text-sm font-semibold tracking-widest py-4 rounded-xl transition-colors cursor-pointer mt-2">
          שלחו חשבונית
        </button>
      </form>

      <div className="mt-8 p-4 bg-white rounded-xl border border-[#ede9e1] text-xs text-[#9a8a7a] leading-relaxed text-right">
        לא מצאתם? צרו איתנו קשר ב-
        <a href="tel:+97236208197" className="text-[#1a1a1a] font-semibold mx-1">03-620-8197</a>
        ונסייע ישירות.
      </div>
    </div>
  );
}
