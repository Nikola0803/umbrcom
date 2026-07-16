import CmsPage from "../../components/feature/CmsPage";
import ContactForm from "./components/ContactForm";

/** Fallback banner + contact tiles — shown until the "contact" WordPress
 *  page (auto-created on plugin activation) is customized, or if
 *  WordPress isn't configured at all. */
function StaticContactHeader() {
  const tiles = [
    { icon: "ri-phone-line", label: "טלפון", value: "03-620-8197", href: "tel:036208197" },
    { icon: "ri-whatsapp-line", label: "וואטסאפ", value: "03-620-8197", href: "https://wa.me/972036208197" },
    { icon: "ri-mail-line", label: "אימייל", value: "office@umbrcom.co.il", href: "mailto:office@umbrcom.co.il" },
  ];
  return (
    <>
      <div className="w-full bg-[#0f0f0f] py-20 text-right">
        <p className="text-xs font-medium tracking-[0.35em] text-[#1a1a1a] uppercase mb-4">
          נשמח לשמוע מכם
        </p>
        <h1 className="font-serif text-5xl font-light text-white">צור קשר</h1>
        <div className="mt-5 flex justify-center">
          <span className="block w-16 h-px bg-[#1a1a1a]/60"></span>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-8 pt-14 text-right space-y-6" dir="rtl">
        {tiles.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel="nofollow noopener noreferrer"
            className="flex items-center justify-end gap-4 group cursor-pointer"
          >
            <div className="text-right">
              <p className="text-xs text-[#bbb] tracking-wider uppercase mb-0.5">{item.label}</p>
              <p className="text-sm font-medium text-[#0d0d0d] group-hover:text-[#1a1a1a] transition-colors">{item.value}</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[#ede9e1] text-[#888] group-hover:border-[#1a1a1a] group-hover:text-[#1a1a1a] transition-all flex-shrink-0">
              <i className={`${item.icon} text-base`}></i>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}

export default function ContactPage() {
  return <CmsPage slug="contact" fallback={<StaticContactHeader />} after={<ContactForm />} />;
}
