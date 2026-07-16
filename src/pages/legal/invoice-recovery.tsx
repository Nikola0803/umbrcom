import CmsPage from "../../components/feature/CmsPage";
import InvoiceRecoveryForm from "./components/InvoiceRecoveryForm";

function StaticInvoiceRecoveryHeader() {
  return (
    <div className="max-w-lg mx-auto px-6 pt-20 pb-8 text-right" dir="rtl">
      <div className="flex justify-end mb-6">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-[#ede9e1]">
          <i className="ri-file-text-line text-2xl text-[#1a1a1a]"></i>
        </div>
      </div>
      <p className="text-[10px] font-medium tracking-[0.4em] text-[#3ab4f2] uppercase mb-3">
        שירות לקוחות
      </p>
      <h1 className="font-serif text-3xl font-light text-[#1a1410] mb-2">שחזור חשבונית</h1>
      <div className="w-10 h-px bg-[#1a1a1a]/20 mr-0 mb-6" />
      <p className="text-sm text-[#5a4e42] leading-relaxed">
        לא קיבלתם חשבונית עבור הזמנתכם? מלאו את הפרטים ונשלח אליכם עותק מחדש.
      </p>
    </div>
  );
}

export default function InvoiceRecoveryPage() {
  return <CmsPage slug="invoice-recovery" fallback={<StaticInvoiceRecoveryHeader />} after={<InvoiceRecoveryForm />} />;
}
