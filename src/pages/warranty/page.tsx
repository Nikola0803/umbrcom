import CmsPage from "../../components/feature/CmsPage";
import WarrantyForm from "./components/WarrantyForm";

function StaticWarrantyHeader() {
  return (
    <div className="max-w-xl mx-auto px-6 pt-20 pb-8 text-right" dir="rtl">
      <div className="flex justify-end mb-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-[#ede9e1]">
          <i className="ri-shield-check-line text-3xl text-[#1a1a1a]"></i>
        </div>
      </div>
      <p className="text-[10px] font-medium tracking-[0.4em] text-[#1a1a1a] uppercase mb-3">
        Waterfall — אחריות מקיפה
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1a1410] leading-tight mb-4">
        הפעלת אחריות
      </h1>
      <div className="w-12 h-px bg-[#1a1a1a]/30 mr-0 mb-6" />
      <p className="text-[#5a4e42] text-base leading-relaxed">
        ברוכים הבאים לדף הפעלת האחריות של מוצרי Waterfall.
        <br />
        אנא מלאו את הפרטים הבאים כדי לרשום את המוצר שלכם ולהפעיל את האחריות המקיפה שלו.
      </p>
    </div>
  );
}

export default function WarrantyActivationPage() {
  return <CmsPage slug="warranty" fallback={<StaticWarrantyHeader />} after={<WarrantyForm />} />;
}
