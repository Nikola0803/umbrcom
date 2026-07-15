import PageLayout from "../../components/feature/PageLayout";

export default function BusinessPage() {
  return (
    <PageLayout>
      <section className="w-full bg-white min-h-[70vh] py-16 px-6" dir="rtl">
        <div className="max-w-3xl mx-auto text-right">
          {/* Header */}
          <div className="mb-12">
            <p className="text-[10px] font-semibold tracking-[0.45em] text-[#3ab4f2] uppercase mb-3">
              Waterfall — B2B
            </p>
            <h1 className="font-serif text-4xl font-light text-[#1a1410] mb-4">
              מחלקת עסקים
            </h1>
            <div className="w-12 h-px bg-[#1a1a1a]/20 mr-0 mb-6" />
            <p className="text-base text-[#5a4e42] leading-relaxed max-w-xl">
              שותפים עסקיים, קבלנים, מעצבי פנים ויזמי נדל"ן — אנחנו מציעים מחירים מיוחדים,
              ליווי אישי ומלאי ייעודי לפרויקטים גדולים.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
            {[
              { icon: "ri-percent-line", title: "מחירי סיטונאות", desc: "הנחות מיוחדות על הזמנות גדולות מ-10 יחידות" },
              { icon: "ri-customer-service-2-line", title: "נציג אישי", desc: "נציג מכירות ייעודי לכל לקוח עסקי" },
              { icon: "ri-truck-line", title: "לוגיסטיקה מותאמת", desc: "אספקה לאתר הבנייה, זמנים גמישים" },
            ].map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-5 border border-[#ede9e1] text-right">
                <i className={`${b.icon} text-2xl text-[#1a1a1a] mb-3 block`}></i>
                <p className="text-sm font-semibold text-[#1a1410] mb-1">{b.title}</p>
                <p className="text-xs text-[#9a8a7a] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="bg-white border border-[#ede9e1] rounded-2xl p-8">
            <h2 className="font-serif text-xl font-light text-[#1a1410] mb-6">
              השאירו פרטים — נחזור אליכם
            </h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">שם החברה</label>
                  <input type="text" placeholder="חברת הבנייה שלי בע״מ" className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-right text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">שם איש קשר</label>
                  <input type="text" placeholder="ישראל ישראלי" className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-right text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">אימייל</label>
                  <input type="email" placeholder="business@company.co.il" dir="ltr" className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">טלפון</label>
                  <input type="tel" placeholder="050-000-0000" dir="ltr" className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">היקף הצורך המשוער</label>
                <textarea rows={3} placeholder="לדוגמה: 50 ברזי מטבח לפרויקט מגורים ברחובות..." className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-right text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none" />
              </div>
              <button type="submit" className="bg-[#1a1a1a] hover:bg-[#333] text-white text-sm font-semibold tracking-widest px-10 py-4 rounded-xl transition-colors cursor-pointer">
                שלחו פנייה
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
