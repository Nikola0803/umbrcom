import CmsPage from "../../components/feature/CmsPage";
import BusinessForm from "./components/BusinessForm";

function StaticBusinessHeader() {
  const benefits = [
    { icon: "ri-percent-line", title: "מחירי סיטונאות", desc: "הנחות מיוחדות על הזמנות גדולות מ-10 יחידות" },
    { icon: "ri-customer-service-2-line", title: "נציג אישי", desc: "נציג מכירות ייעודי לכל לקוח עסקי" },
    { icon: "ri-truck-line", title: "לוגיסטיקה מותאמת", desc: "אספקה לאתר הבנייה, זמנים גמישים" },
  ];
  return (
    <section className="w-full bg-white pt-16 pb-8 px-6" dir="rtl">
      <div className="max-w-3xl mx-auto text-right">
        <div className="mb-12">
          <p className="text-[10px] font-semibold tracking-[0.45em] text-[#3ab4f2] uppercase mb-3">
            Waterfall — B2B
          </p>
          <h1 className="font-serif text-4xl font-light text-[#1a1410] mb-4">מחלקת עסקים</h1>
          <div className="w-12 h-px bg-[#1a1a1a]/20 mr-0 mb-6" />
          <p className="text-base text-[#5a4e42] leading-relaxed max-w-xl">
            שותפים עסקיים, קבלנים, מעצבי פנים ויזמי נדל"ן — אנחנו מציעים מחירים מיוחדים,
            ליווי אישי ומלאי ייעודי לפרויקטים גדולים.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-4">
          {benefits.map((b) => (
            <div key={b.title} className="bg-white rounded-2xl p-5 border border-[#ede9e1] text-right">
              <i className={`${b.icon} text-2xl text-[#1a1a1a] mb-3 block`}></i>
              <p className="text-sm font-semibold text-[#1a1410] mb-1">{b.title}</p>
              <p className="text-xs text-[#9a8a7a] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BusinessPage() {
  return <CmsPage slug="business" fallback={<StaticBusinessHeader />} after={<BusinessForm />} />;
}
