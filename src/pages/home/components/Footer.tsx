import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSettings } from "@/lib/wp-api";

// Item 21 (July 2026): footer now shows the WATERFALL logo (was mislabeled
// "UMBRCOM" here before, even though the file was already the Waterfall
// wordmark) — settings-overridable exactly like the Navbar's Waterfall mark.
const DEFAULT_WATERFALL_LOGO_URL =
  "https://admin.umbrcom.co.il/wp-content/uploads/2026/07/%D7%9C%D7%95%D7%92%D7%95-%D7%9C%D7%90%D7%95%D7%A8%D7%9A-500-x-170-%D7%A4%D7%99%D7%A7%D7%A1%D7%9C-500-x-100-%D7%A4%D7%99%D7%A7%D7%A1%D7%9C-8.png";

// Item 22 — updated footer contact info. Fixed spelling per Nik's
// follow-up (סחרוב, not סהרוב). This is intentionally NOT overridden by
// wp-admin Site Settings (see below) — the live settings.contact.address
// had a stale/different address, which is why this kept drifting.
const DEFAULT_ADDRESS = "דוד סחרוב 18, ראשון לציון";
const DEFAULT_PHONE = "03-620-8197";

const SOCIAL_ICON: Record<string, string> = {
  facebook: "ri-facebook-circle-line",
  instagram: "ri-instagram-line",
  tiktok: "ri-tiktok-line",
  youtube: "ri-youtube-line",
  telegram: "ri-telegram-line",
  whatsapp: "ri-whatsapp-line",
};

const DEFAULT_SOCIAL_LINKS = [
  { icon: "ri-tiktok-line", href: "https://www.tiktok.com/@umbrcomisrarl", label: "TikTok" },
  { icon: "ri-youtube-line", href: "https://www.youtube.com/@umbrcom", label: "YouTube" },
  { icon: "ri-instagram-line", href: "https://www.instagram.com/umbrcomisrael/", label: "Instagram" },
  { icon: "ri-facebook-circle-line", href: "https://www.facebook.com/profile.php?id=61577915652778", label: "Facebook" },
  { icon: "ri-whatsapp-line", href: "#", label: "WhatsApp" },
  { icon: "ri-telegram-line", href: "#", label: "Telegram" },
];

const cols = [
  {
    title: "קטלוג",
    links: [
      { label: "ברזי מטבח", to: "/shop/kitchen", internal: true },
      { label: "ברזי כיור רחצה", to: "/shop/bathroom", internal: true },
      { label: "ברזי מים קרים", to: "/shop/cold-water", internal: true },
      { label: "ערכות פינוק", to: "/shop/pampering-sets", internal: true },
      { label: "סדרות Waterfall", to: "/series", internal: true },
    ],
  },
  {
    title: "מידע",
    links: [
      { label: "אודות", to: "/about", internal: true },
      { label: "צור קשר", to: "/contact", internal: true },
      { label: "הירשם / התחבר", to: "/auth", internal: true },
      { label: "שירות לקוחות", to: "/customer-service", internal: true },
      { label: "תקנון", to: "/terms", internal: true },
    ],
  },
  {
    title: "שירות לקוחות",
    links: [
      { label: "החשבון שלי", to: "/my-account", internal: true },
      { label: "מחלקה עסקית", to: "/business", internal: true },
      { label: "הצהרת נגישות", to: "/accessibility-statement", internal: true },
      { label: "מדיניות פרטיות", to: "/privacy", internal: true },
      { label: "ביטולים והחזרות", to: "/returns", internal: true },
    ],
  },
];

type FLink = { label: string; to: string; internal: boolean };
function FLink({ link }: { link: FLink }) {
  const cls = "text-sm text-[#888] hover:text-white transition-colors cursor-pointer";
  if (link.internal) return <Link to={link.to} className={cls}>{link.label}</Link>;
  return (
    <a
      href={link.to}
      target={link.to.startsWith("http") ? "_blank" : undefined}
      rel="nofollow noopener noreferrer"
      className={cls}
    >
      {link.label}
    </a>
  );
}

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);
  const [logoUrl, setLogoUrl] = useState(DEFAULT_WATERFALL_LOGO_URL);
  const [phone, setPhone] = useState(DEFAULT_PHONE);
  // Fixed — not wp-admin-driven, see note below.
  const address = DEFAULT_ADDRESS;

  useEffect(() => {
    fetchSettings().then((settings) => {
      if (settings?.contact?.social && settings.contact.social.length > 0) {
        setSocialLinks(
          settings.contact.social.map((s) => ({
            icon: SOCIAL_ICON[s.platform] ?? "ri-links-line",
            href: s.url,
            label: s.platform,
          }))
        );
      }
      if (settings?.brand?.waterfall_logo) setLogoUrl(settings.brand.waterfall_logo);
      if (settings?.contact?.phone) setPhone(settings.contact.phone);
      // Address intentionally does NOT read from wp-admin Site Settings —
      // that value was stale/wrong and kept overriding the correct one.
      // Fixed to DEFAULT_ADDRESS above; update wp-admin separately if you
      // want it editable there again.
    });
  }, []);

  return (
    <footer className="bg-[#0f0f0f]/95 backdrop-blur-sm rounded-t-3xl border-t border-white/5 overflow-hidden">
      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-12 pb-10 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
        {/* Col 1: Brand */}
        <div className="flex flex-col items-start gap-6">
          <Link to="/">
            <img src={logoUrl} alt="Waterfall" className="h-10 object-contain brightness-0 invert opacity-90" />
          </Link>
          {/* Item 22: contact info — icons moved to the left of the text
              per Nik's follow-up (were on the right). */}
          <div className="text-right sm:text-right space-y-1.5">
            <p className="text-sm text-[#999] flex items-center gap-2 justify-end">
              <i className="ri-map-pin-line text-[#666]"></i>
              {address}
            </p>
            <a href={`tel:+972${phone.replace(/^0/, "")}`} className="text-sm text-[#999] hover:text-white transition-colors flex items-center gap-2 justify-end">
              <i className="ri-phone-line text-[#666]"></i>
              {phone}
            </a>
          </div>
          {/* Social icons */}
          <div className="flex items-center gap-3 flex-wrap">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-[#777] hover:text-white hover:border-white/30 transition-all cursor-pointer text-sm"
              >
                <i className={s.icon}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Cols 2-4: Links */}
        {cols.map((col) => (
          <div key={col.title} className="text-right">
            <h4 className="text-white text-sm font-semibold tracking-wider mb-5">
              {col.title}
            </h4>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <FLink link={l} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-10">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between flex-wrap gap-4">
        <Link to="/" className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
          <img src={logoUrl} alt="Waterfall" className="h-7 object-contain brightness-0 invert" />
        </Link>
        <p className="text-[#555] text-xs">
          ט.ל.ח | כל התמונות והסרטונים באתר להמחשה בלבד.
        </p>
        <p className="text-[#555] text-xs">
          © כל הזכויות שמורות לאמברקום בע&quot;מ
        </p>
      </div>
    </footer>
  );
}
