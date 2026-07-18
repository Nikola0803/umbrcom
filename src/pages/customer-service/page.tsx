import CmsPage from "../../components/feature/CmsPage";
import CustomerServiceForm from "./components/CustomerServiceForm";

/** Customer-service page — layout redesigned (July 2026): dark page header,
 *  centered intro, proper contact cards, then the inquiry form in a card. */
function StaticCustomerServiceHeader() {
  const tiles = [
    { icon: "ri-mail-line", title: "אימייל", label: "office@umbrcom.co.il", cta: "לשליחת מייל", href: "mailto:office@umbrcom.co.il" },
    { icon: "ri-phone-line", title: "טלפון", label: "03-620-8197", cta: "לשיחה עם נציג", href: "tel:036208197" },
    { icon: "ri-whatsapp-line", title: "וואטסאפ", label: "מענה מהיר בצ׳אט", cta: "למעבר לוואטסאפ", href: "https://wa.me/972036208197" },
  ];
  return (
    <div dir="rtl">
      {/* Page header */}
      <div className="w-full bg-[#0f0f0f] py-12">
        <div className="max-w-3xl mx-auto px-6 text-right">
          <p className="text-[10px] font-semibold tracking-[0.35em] text-white/40 uppercase mb-3">
            אנחנו כאן בשבילכם
          </p>
          <h1 className="text-3xl sm:text-4xl font-light text-white">שירות לקוחות</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12">
        {/* Intro */}
        <p className="text-sm text-[#5a5a5a] leading-relaxed mb-10 text-right">
          אצלנו ב-Umbrcom תמיכה אמיתית מתחילה לפני הרכישה וממשיכה אחרי קבלתה: צוות מקצועי זמין לכל שאלה טכנית,
          ביצוע הזמנות, תיאום משלוחים, ואף טיפול בתלונות. ניתן לפנות אלינו בטלפון, במייל או ב-WhatsApp,
          ואנו מבטיחים מענה מהיר, אדיב ואפקטיבי – כי אצלנו הלקוח תמיד במקום הראשון.
        </p>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {tiles.map((t) => (
            <a
              key={t.title}
              href={t.href}
              target={t.href.startsWith("http") ? "_blank" : undefined}
              rel="nofollow noopener noreferrer"
              className="group flex flex-col items-center text-center gap-3 rounded-2xl border border-[#ececec] bg-white p-6 hover:border-[#1a1a1a] hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)] transition-all cursor-pointer"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#111] group-hover:bg-[#2a2a2a] transition-colors">
                <i className={`${t.icon} text-white text-2xl`}></i>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1410]">{t.title}</p>
                <p className="text-xs text-[#888] mt-0.5" dir="ltr">{t.label}</p>
              </div>
              <span className="text-xs font-medium text-[#1a1a1a] underline underline-offset-4 decoration-[#ddd] group-hover:decoration-[#1a1a1a] transition-colors">
                {t.cta}
              </span>
            </a>
          ))}
        </div>

        {/* Form title */}
        <div className="text-right mb-6">
          <h2 className="text-xl font-semibold text-[#1a1410]">השאירו פנייה</h2>
          <p className="text-sm text-[#888] mt-1">נחזור אליכם בהקדם — בדרך כלל תוך יום עסקים אחד.</p>
        </div>
      </div>
    </div>
  );
}

export default function CustomerServicePage() {
  return <CmsPage slug="customer-service" fallback={<StaticCustomerServiceHeader />} after={<CustomerServiceForm />} />;
}
