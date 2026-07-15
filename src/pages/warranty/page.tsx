import PageLayout from "../../components/feature/PageLayout";
import { Link } from "react-router-dom";

export default function WarrantyActivationPage() {
  return (
    <PageLayout>
      <section className="min-h-[70vh] w-full bg-white flex items-center justify-center py-20 px-6">
        <div className="max-w-xl w-full text-right">
          {/* Icon */}
          <div className="flex justify-end mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-[#ede9e1]">
              <i className="ri-shield-check-line text-3xl text-[#1a1a1a]"></i>
            </div>
          </div>

          {/* Badge */}
          <p className="text-[10px] font-medium tracking-[0.4em] text-[#1a1a1a] uppercase mb-3">
            Waterfall — אחריות מקיפה
          </p>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1a1410] leading-tight mb-4">
            הפעלת אחריות
          </h1>

          <div className="w-12 h-px bg-[#1a1a1a]/30 mr-0 mb-6" />

          {/* Description */}
          <p className="text-[#5a4e42] text-base leading-relaxed mb-8">
            ברוכים הבאים לדף הפעלת האחריות של מוצרי Waterfall.
            <br />
            אנא מלאו את הפרטים הבאים כדי לרשום את המוצר שלכם ולהפעיל את האחריות המקיפה שלו.
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">שם מלא</label>
              <input
                type="text"
                placeholder="ישראל ישראלי"
                className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-right text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">כתובת אימייל</label>
              <input
                type="email"
                placeholder="example@email.com"
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">טלפון</label>
              <input
                type="tel"
                placeholder="050-000-0000"
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">מספר מק&quot;ט / SKU</label>
              <input
                type="text"
                placeholder="5508-003"
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-left text-[#1a1410] bg-white placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">תאריך רכישה</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-right text-[#1a1410] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 bg-[#1a1a1a] hover:bg-[#333333] text-white text-sm font-semibold tracking-widest py-4 rounded-xl transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              הפעלת אחריות
            </button>
          </form>

          {/* Info callout */}
          <div className="mt-8 p-5 bg-white border border-[#ede9e1] rounded-2xl text-right">
            <div className="flex items-start gap-3 flex-row-reverse">
              <i className="ri-information-line text-[#1a1a1a] text-lg flex-shrink-0 mt-0.5"></i>
              <p className="text-xs text-[#6a5e52] leading-relaxed">
                מוצרי Waterfall מגיעים עם אחריות מלאה של 7 שנים על חלקי הברז ומנגנון הקרמיקה.
                לאחר הרישום תקבלו אישור במייל עם פרטי האחריות שלכם.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/contact" className="text-xs text-[#1a1a1a] hover:underline">
              לשאלות נוספות — צרו קשר
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
