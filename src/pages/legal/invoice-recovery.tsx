import PageLayout from "../../components/feature/PageLayout";

export default function InvoiceRecoveryPage() {
  return (
    <PageLayout>
      <section className="min-h-[70vh] w-full bg-white flex items-center justify-center py-20 px-6">
        <div className="max-w-lg w-full text-right" dir="rtl">
          <div className="flex justify-end mb-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-[#ede9e1]">
              <i className="ri-file-text-line text-2xl text-[#1a1a1a]"></i>
            </div>
          </div>
          <p className="text-[10px] font-medium tracking-[0.4em] text-[#3ab4f2] uppercase mb-3">
            שירות לקוחות
          </p>
          <h1 className="font-serif text-3xl font-light text-[#1a1410] mb-2">
            שחזור חשבונית
          </h1>
          <div className="w-10 h-px bg-[#1a1a1a]/20 mr-0 mb-6" />
          <p className="text-sm text-[#5a4e42] leading-relaxed mb-8">
            לא קיבלתם חשבונית עבור הזמנתכם? מלאו את הפרטים ונשלח אליכם עותק מחדש.
          </p>

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
      </section>
    </PageLayout>
  );
}
