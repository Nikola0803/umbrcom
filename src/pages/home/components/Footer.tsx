import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSettings } from "@/lib/wp-api";

// Item 21 flipped back per Nik's explicit follow-up ("umbrcom logo in white
// needed here") — main brand column shows the UMBRCOM parent-brand
// wordmark, same asset as the Navbar's mobile-header logo.
const DEFAULT_UMBRCOM_LOGO_URL =
  "https://admin.umbrcom.co.il/wp-content/uploads/2026/07/%D7%9C%D7%95%D7%92%D7%95-%D7%9C%D7%92%D7%A8%D7%A1%D7%AA-%D7%A0%D7%99%D7%99%D7%93-5.png";

// The smaller bottom-bar logo is the Waterfall mark instead — Nik wants the
// two footer logos different (UMBRCOM up top, Waterfall in the bottom bar).
const DEFAULT_WATERFALL_LOGO_URL =
  "https://admin.umbrcom.co.il/wp-content/uploads/2026/07/%D7%9C%D7%95%D7%92%D7%95-%D7%9C%D7%90%D7%95%D7%A8%D7%9A-500-x-170-%D7%A4%D7%99%D7%A7%D7%A1%D7%9C-500-x-100-%D7%A4%D7%99%D7%A7%D7%A1%D7%9C-8.png";

// Item 22 — updated footer contact info. Fixed spelling per Nik's
// follow-up (סחרוב, not סהרוב). This is intentionally NOT overridden by
// wp-admin Site Settings (see below) — the live settings.contact.address
// had a stale/different address, which is why this kept drifting.
const DEFAULT_ADDRESS = "דוד סחרוב 18, ראשון לציון"; // משרדים (offices)
const DEFAULT_WAREHOUSE_ADDRESS = "השיקמה 1, אזור"; // מרלוג (warehouse) — label already says "מרלוג:", no need to repeat it in the value
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
  const [logoUrl] = useState(DEFAULT_UMBRCOM_LOGO_URL);
  const [waterfallLogoUrl, setWaterfallLogoUrl] = useState(DEFAULT_WATERFALL_LOGO_URL);
  const [phone, setPhone] = useState(DEFAULT_PHONE);
  // Fixed — not wp-admin-driven, see note below.
  const address = DEFAULT_ADDRESS;
  const warehouseAddress = DEFAULT_WAREHOUSE_ADDRESS;

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
      if (settings?.brand?.waterfall_logo) setWaterfallLogoUrl(settings.brand.waterfall_logo);
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
        {/* Col 1: Brand — every flex/margin-auto trick attempted here
            (justify-end, me-auto, ml-auto+items-end) kept looking
            different from cols 2-4 even when technically flush right, per
            Nik. Rebuilt to use the EXACT same mechanism as the other
            three columns below: a plain `text-right` block with normal
            (non-flex) inline/block children — no flex rows, no auto
            margins, nothing column-1-specific. */}
        <div dir="rtl" className="text-right space-y-6">
          <Link to="/" className="inline-block">
            <img src={logoUrl} alt="UMBRCOM" className="h-16 object-contain brightness-0 invert opacity-90" />
          </Link>
          <div className="space-y-1.5">
            {/* Warehouse (מרלוג) — above the offices line, per Nik. Icon is
                the first element so it lands at the visual right (RTL
                text-align just packs inline content to the right, same as
                the sibling columns' plain text links). */}
            <p className="text-sm text-[#999]">
              <i className="ri-building-4-line text-[#666] me-2"></i>
              <span className="text-[#777]">מרלוג:</span> {warehouseAddress}
            </p>
            {/* Offices (משרדים) */}
            <p className="text-sm text-[#999]">
              <i className="ri-map-pin-line text-[#666] me-2"></i>
              <span className="text-[#777]">משרדים:</span> {address}
            </p>
            {/* Unicode bidi quirk: with the digit run sitting directly next
                to the icon (no Hebrew character between them), the browser
                reorders them and the phone number jumps to the right of
                the icon instead of after it. A small `inline-flex` here
                sidesteps bidi text-reordering entirely (ordering becomes a
                DOM/flex concern, not a text-direction one) without
                reintroducing the column-wide flex/margin issue from
                before — this is just one atomic inline element within the
                otherwise plain text-right block. */}
            <a
              href={`tel:+972${phone.replace(/^0/, "")}`}
              className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-white transition-colors"
            >
              <i className="ri-phone-line text-[#666]"></i>
              {phone}
            </a>
          </div>
          {/* Social icons — the only row that legitimately needs flex (a
              horizontal row of buttons), so it keeps justify-end, but
              dropped the w-fit/ml-auto wrapper entirely. */}
          <div className="flex items-center gap-3 flex-wrap justify-end">
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
        <div className="flex flex-col items-start gap-1">
          <Link to="/" className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
            <img src={waterfallLogoUrl} alt="Waterfall" className="h-7 object-contain brightness-0 invert" />
          </Link>
          {/* Waterfall is a product brand sold BY אמברקום בע"מ, not a
              separate operating business — this line is intentionally
              always rendered here regardless of which brand theme
              (useBrand) is currently selected, so the legal operator of
              this domain is never ambiguous to a visitor or reviewer. */}
          <span className="text-[#555] text-[10px]">מותג של אמברקום בע&quot;מ</span>
        </div>
        <p className="text-[#555] text-xs">
          ט.ל.ח | כל התמונות והסרטונים באתר להמחשה בלבד.
        </p>
        {/* Legal identity strip — company name + registration number,
            always visible regardless of selected brand (useBrand). Google
            Ads' Misrepresentation review looks for this exact info to be
            unambiguous, so it's kept independent of any brand theming. */}
        <p className="text-[#555] text-xs">
          © כל הזכויות שמורות לאמברקום בע&quot;מ | ח.פ. 517044038
        </p>
      </div>
    </footer>
  );
}
