import { Link } from "react-router-dom";
import CmsPage from "../../components/feature/CmsPage";
import TikTokSection from "../home/components/TikTokSection";

const UMBRCOM_COLOR = "#111111"; // UMBRCOM brand — black, never amber/yellow

// ── ITEM 17: replace with the real UMBRCOM brand video (.mp4 URL) ─────────
const VIDEO_SRC =
  "https://assets.mixkit.co/videos/preview/mixkit-hands-adjusting-a-modern-bathroom-faucet-40413-large.mp4";
const POSTER =
  "https://readdy.ai/api/search-image?query=luxury+bathroom+interior+warm+amber+golden+tones+premium+brass+faucet+marble+dark+moody+elegant+photography+soft+warm+light&width=1920&height=1080&seq=ambercom-hero-poster-v1&orientation=landscape";

const UMBRCOM_PRODUCTS = [
  {
    name: "EMBER Pro Kitchen",
    desc: "ברז מטבח פרמיום מבית UMBRCOM — גימור amber gold ייחודי.",
    image: "https://readdy.ai/api/search-image?query=luxury+kitchen+faucet+warm+amber+gold+brushed+finish+modern+design+white+marble+countertop+professional+product+photography&width=600&height=600&seq=ambercom-p1&orientation=squarish",
    price: 2_490,
  },
  {
    name: "EMBER Basin Slim",
    desc: "ברז כיור רחצה דק וקלאסי, גימור ברונזה חמה.",
    image: "https://readdy.ai/api/search-image?query=elegant+slim+bathroom+basin+faucet+warm+bronze+antique+gold+finish+white+ceramic+sink+minimalist+design+soft+light&width=600&height=600&seq=ambercom-p2&orientation=squarish",
    price: 1_890,
  },
  {
    name: "EMBER Cold Pure",
    desc: "ברז מים קרים — גימור ניקל חמה, עיצוב מודרני.",
    image: "https://readdy.ai/api/search-image?query=cold+water+tap+faucet+warm+nickel+brushed+champagne+finish+wall+mounted+clean+white+background+product+photography&width=600&height=600&seq=ambercom-p3&orientation=squarish",
    price: 890,
  },
];

function StaticUmbrcom() {
  return (
    <>
      {/* ── Video hero — transparent header floats above (items 1+7+17) ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "calc(100vh - 160px)", minHeight: "560px" }}
      >
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          poster={POSTER}
        />
        {/* Warm amber grade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: "radial-gradient(circle at 70% 30%, #ffffff 0%, transparent 60%)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="relative h-full flex items-center" style={{ zIndex: 2 }}>
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-12">
            <div className="max-w-xl text-right">
              <div className="flex items-center justify-end gap-3 mb-6">
                <span className="text-[10px] font-semibold tracking-[0.45em] uppercase" style={{ color: UMBRCOM_COLOR }}>
                  The UMBRCOM Collection
                </span>
                <span className="block w-8 h-px" style={{ backgroundColor: UMBRCOM_COLOR }} />
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl font-light text-white leading-[1.1] mb-5">
                UMBRCOM
                <br />
                <em className="not-italic font-semibold text-white">חמימות שנוגעת בכל פרט.</em>
              </h1>

              <div className="flex justify-end mb-5">
                <span className="block w-14 h-[1.5px] bg-white/40" />
              </div>

              <p className="text-white/75 text-base font-light leading-relaxed mb-10">
                קולקציית הבית של UMBRCOM — יוקרה, עיצוב נצחי וגימורים ייחודיים.
                <br />
                בלעדי ל-UMBRCOM בישראל.
              </p>

              <div className="flex items-center justify-end gap-4">
                <Link
                  to="/about"
                  className="border border-white/50 hover:border-white text-white text-xs font-medium tracking-[0.2em] px-7 py-3.5 rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer"
                >
                  סיפור המותג
                </Link>
                <Link
                  to="/shop"
                  className="text-white text-xs font-semibold tracking-[0.2em] px-8 py-3.5 rounded-full transition-colors duration-300 whitespace-nowrap cursor-pointer shadow-lg hover:opacity-90"
                  style={{ backgroundColor: UMBRCOM_COLOR }}
                >
                  לחנות UMBRCOM
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ zIndex: 2 }}>
          <div className="w-5 h-8 rounded-full border border-white/40 flex items-start justify-center pt-1.5">
            <div className="w-0.5 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="w-full bg-white py-20">
        <div className="max-w-4xl mx-auto px-8 text-right" dir="rtl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.45em] uppercase mb-3" style={{ color: UMBRCOM_COLOR }}>
                סיפור המותג
              </p>
              <h2 className="font-serif text-3xl font-light text-[#1a1410] mb-6 leading-tight">
                הבדל שמרגישים
                <br />
                בכל מגע
              </h2>
              <p className="text-sm text-[#5a4e42] leading-relaxed mb-4">
                UMBRCOM נולדה מתוך הרצון ליצור ברזים שהם יצירות אמנות — לא רק כלים.
                כל מוצר מעוצב עם תשומת לב לפרט: מחומרי הגלם ועד ציפוי ה-Amber Gold הייחודי.
              </p>
              <p className="text-sm text-[#5a4e42] leading-relaxed">
                אוסף UMBRCOM הוא בלעדי ל-UMBRCOM בישראל — עם אחריות מלאה ושירות אישי.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-square bg-white">
              <img
                src="https://readdy.ai/api/search-image?query=luxury+bathroom+interior+warm+amber+golden+tones+premium+faucet+marble+elegant+photography+soft+warm+light&width=800&height=800&seq=ambercom-story&orientation=squarish"
                alt="UMBRCOM story"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Collection ── */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-right mb-10" dir="rtl">
            <p className="text-[10px] font-semibold tracking-[0.45em] uppercase mb-3" style={{ color: UMBRCOM_COLOR }}>
              מוצרים נבחרים
            </p>
            <h2 className="font-serif text-3xl font-light text-[#1a1410]">
              הקולקציה
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" dir="rtl">
            {UMBRCOM_PRODUCTS.map((p) => (
              <Link key={p.name} to="/shop" className="group cursor-pointer flex flex-col">
                {/* Clean card — matches the new site-wide card style (item 3) */}
                <div className="relative overflow-hidden rounded-2xl bg-[#f6f6f6]" style={{ aspectRatio: "1" }}>
                  <span className="absolute top-4 right-4 z-10 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#1a1410] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    UMBRCOM
                  </span>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="pt-4 text-right">
                  <h3 className="text-sm font-medium text-[#1a1410] mb-1">{p.name}</h3>
                  <p className="text-xs text-[#9a8a7a] mb-2 leading-snug line-clamp-2">{p.desc}</p>
                  <span className="text-base font-semibold text-[#1a1410]">
                    ₪{p.price.toLocaleString("he-IL")}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-right mt-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-white px-8 py-3.5 rounded-full transition-colors cursor-pointer hover:opacity-90"
              style={{ backgroundColor: UMBRCOM_COLOR }}
            >
              לכל מוצרי UMBRCOM
              <i className="ri-arrow-left-line text-sm"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TikTok template — shared with the Waterfall homepage (item 20).
          Real videos supplied by Ben, from @umbrcomisrarl. ── */}
      <TikTokSection
        brandName="UMBRCOM"
        handle="umbrcomisrarl"
        accent={UMBRCOM_COLOR}
        videos={[
          { id: "7663435911702629640", caption: "צפו בסרטון שלנו ב-TikTok" },
          { id: "7663435758354582802", caption: "צפו בסרטון שלנו ב-TikTok" },
          { id: "7663434776338058503", caption: "צפו בסרטון שלנו ב-TikTok" },
        ]}
      />
    </>
  );
}

export default function UmbrcomPage() {
  // slug "ambercom" = the existing WP backend page (renaming it in wp-admin would break the Page Builder link)
  return <CmsPage slug="ambercom" fallback={<StaticUmbrcom />} />;
}
