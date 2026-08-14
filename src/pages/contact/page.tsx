import PageLayout from "../../components/feature/PageLayout";
import ContactForm from "./components/ContactForm";

/** Contact header + tiles — real content provided directly by Nik.
 *  Bypasses CmsPage: WordPress already has its own auto-created "contact"
 *  page with populated umbrcom_sections (page_header + an info_tiles
 *  block with only phone/whatsapp/email — no address, company, or hours),
 *  which always takes priority over the fallback content passed to
 *  CmsPage, so the fuller tile set below would never actually render no
 *  matter how many times the frontend gets rebuilt. Same fix as
 *  terms/privacy/accessibility-statement/about: bypass CmsPage entirely
 *  and wrap directly in PageLayout instead. */
function ContactHeader() {
  const tiles = [
    {
      icon: "ri-briefcase-4-line",
      label: "העסק",
      value: 'אמברקום בע"מ · ח.פ. 517044038',
      href: "/terms",
      dir: "rtl" as const,
    },
    {
      icon: "ri-map-pin-line",
      label: "כתובת המשרדים",
      value: "דוד סחרוב 18, ראשון לציון",
      href: "https://waze.com/ul?q=" + encodeURIComponent("דוד סחרוב 18, ראשון לציון"),
      dir: "rtl" as const,
    },
    {
      icon: "ri-building-4-line",
      label: 'מרכז לוגיסטי (מרלו"ג)',
      value: "השיקמה 1, אזור",
      href: "https://waze.com/ul?q=" + encodeURIComponent("השיקמה 1, אזור"),
      dir: "rtl" as const,
    },
    { icon: "ri-phone-line", label: "טלפון", value: "03-620-8197", href: "tel:036208197", dir: "ltr" as const },
    { icon: "ri-whatsapp-line", label: "וואטסאפ", value: "03-620-8197", href: "https://wa.me/972036208197", dir: "ltr" as const },
    { icon: "ri-mail-line", label: 'דוא"ל', value: "service@umbrcom.co.il", href: "mailto:service@umbrcom.co.il", dir: "ltr" as const },
  ];
  return (
    <>
      <div className="w-full bg-[#0f0f0f] py-16" dir="rtl">
        <div className="max-w-5xl mx-auto px-8 text-right">
          <p className="text-xs font-medium tracking-[0.35em] text-white/40 uppercase mb-4">
            נשמח לשמוע מכם
          </p>
          <h1 className="text-5xl font-light text-white">צור קשר</h1>
          <div className="mt-5 flex justify-start">
            <span className="block w-16 h-px bg-white/30"></span>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-8 pt-14 text-right space-y-6" dir="rtl">
        {tiles.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel="nofollow noopener noreferrer"
            className="flex items-center justify-start gap-4 group cursor-pointer"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[#ede9e1] text-[#888] group-hover:border-[#1a1a1a] group-hover:text-[#1a1a1a] transition-all flex-shrink-0">
              <i className={`${item.icon} text-base`}></i>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#bbb] tracking-wider uppercase mb-0.5">{item.label}</p>
              <p
                className="text-sm font-medium text-[#0d0d0d] group-hover:text-[#1a1a1a] transition-colors"
                dir={item.dir}
              >
                {item.value}
              </p>
            </div>
          </a>
        ))}

        {/* Opening hours — not a link like the tiles above, so its own row. */}
        <div className="flex items-center justify-start gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[#ede9e1] text-[#888] flex-shrink-0">
            <i className="ri-time-line text-base"></i>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#bbb] tracking-wider uppercase mb-0.5">שעות פעילות</p>
            <p className="text-sm font-medium text-[#0d0d0d] leading-relaxed">
              א-ה : 10:00-16:00
              <br />
              יום ו : 08:00-13:30
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ContactPage() {
  return (
    <PageLayout>
      <ContactHeader />
      <ContactForm />
    </PageLayout>
  );
}
