import CmsPage from "../../components/feature/CmsPage";
import CustomerServiceForm from "./components/CustomerServiceForm";

function StaticCustomerServiceHeader() {
  const tiles = [
    { icon: "ri-mail-line", label: "לחץ כאן לשליחת מייל", href: "mailto:office@umbrcom.co.il" },
    { icon: "ri-phone-line", label: "לחץ כאן לשיחה עם נציג", href: "tel:036208197" },
    { icon: "ri-whatsapp-line", label: "לחץ כאן למעבר לוואטסאפ", href: "https://wa.me/972036208197" },
  ];
  return (
    <div className="max-w-3xl mx-auto px-6 pt-14" dir="rtl">
      <p className="text-sm text-gray-400 mb-2">שירות לקוחות</p>
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-right">שירות לקוחות</h1>
      <p className="text-sm text-gray-600 leading-relaxed mb-10 text-right max-w-2xl mr-0 ml-auto">
        אצלנו ב-Umbrcom תמיכה אמיתית מתחילה לפני הרכישה וממשיכה אחרי קבלתה: צוות מקצועי זמין לכל שאלה טכנית,
        ביצוע הזמנות, תיאום משלוחים, ואף טיפול בתלונות. ניתן לפנות אלינו בטלפון, במייל או ב-WhatsApp,
        ואנו מבטיחים מענה מהיר, אדיב ואפקטיבי – כי אצלנו הלקוח תמיד במקום הראשון.
      </p>
      <div className="grid grid-cols-3 gap-6 mb-14 text-right">
        {tiles.map((t) => (
          <a
            key={t.label}
            href={t.href}
            target={t.href.startsWith("http") ? "_blank" : undefined}
            rel="nofollow noopener noreferrer"
            className="flex flex-col items-start gap-3 cursor-pointer group"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-900 group-hover:bg-gray-700 transition-colors">
              <i className={`${t.icon} text-white text-2xl`}></i>
            </div>
            <span className="text-sm text-gray-700">{t.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function CustomerServicePage() {
  return <CmsPage slug="customer-service" fallback={<StaticCustomerServiceHeader />} after={<CustomerServiceForm />} />;
}
