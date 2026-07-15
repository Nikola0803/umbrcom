import { Link } from "react-router-dom";
import PageLayout from "../../components/feature/PageLayout";

const SERIES = [
  {
    name: "Atlas",
    nameHe: "אטלס",
    tagline: "עוצמה בכל טיפה",
    description: "סדרת Atlas מציגה עיצוב אורבני מודרני עם ידית ארגונומית ואפשרות ניקל מוברש ושחור מט.",
    image: "https://readdy.ai/api/search-image?query=modern+luxury+kitchen+faucet+brushed+nickel+matte+black+over+white+marble+sink+professional+product+photography+clean+minimal+background&width=800&height=900&seq=series-atlas-v1&orientation=portrait",
    color: "#3ab4f2",
    products: 12,
    path: "/shop/kitchen",
  },
  {
    name: "Primo",
    nameHe: "פרימו",
    tagline: "פשטות יוקרתית",
    description: "Primo — בסיס קלאסי ונצחי. גימורי כרום וזהב מוברש שמשתלבים בכל עיצוב פנים.",
    image: "https://readdy.ai/api/search-image?query=elegant+bathroom+basin+faucet+brushed+gold+chrome+mounted+on+white+ceramic+sink+minimalist+bathroom+soft+diffused+light+premium+product+shot&width=800&height=900&seq=series-primo-v1&orientation=portrait",
    color: "#c9a96e",
    products: 8,
    path: "/shop/bathroom",
  },
  {
    name: "Aqua",
    nameHe: "אקווה",
    tagline: "חיסכון ויופי",
    description: "סדרת Aqua מתמחה בברזי מים קרים עם טכנולוגיית חיסכון מתקדמת וסגנון מינימליסטי.",
    image: "https://readdy.ai/api/search-image?query=minimalist+cold+water+tap+faucet+matte+black+chrome+wall+mounted+clean+white+background+studio+lighting+product+photography&width=800&height=900&seq=series-aqua-v1&orientation=portrait",
    color: "#1a1a1a",
    products: 6,
    path: "/shop/cold-water",
  },
  {
    name: "Luxe",
    nameHe: "לוקס",
    tagline: "פינוק ממדרגה ראשונה",
    description: "ערכות פינוק מהדורה מוגבלת — סט ברז ואביזרים תואמים לחדר האמבטיה המושלם.",
    image: "https://readdy.ai/api/search-image?query=luxury+bathroom+faucet+set+rose+gold+accessories+towel+rail+soap+dispenser+premium+spa+bathroom+interior+soft+natural+light&width=800&height=900&seq=series-luxe-v1&orientation=portrait",
    color: "#c9948a",
    products: 4,
    path: "/shop/pampering-sets",
  },
  {
    name: "Delta",
    nameHe: "דלתא",
    tagline: "ביצועים מקצועיים",
    description: "Delta — ברזי שפופרת נשלפת לשטיפה ותמרון מרבי. פתרון מקצועי לכל מטבח.",
    image: "https://readdy.ai/api/search-image?query=professional+pull-out+kitchen+faucet+brushed+stainless+steel+spray+head+modern+kitchen+white+countertop+clean+background+product+photography&width=800&height=900&seq=series-delta-v1&orientation=portrait",
    color: "#888",
    products: 9,
    path: "/shop/kitchen",
  },
  {
    name: "Wave",
    nameHe: "גל",
    tagline: "זרם שמרגע",
    description: "Wave — עיצוב זורם ועדין, שפופרת מסתובבת ב-360° עם ציפוי רוז גולד נוצץ.",
    image: "https://readdy.ai/api/search-image?query=rose+gold+kitchen+faucet+360+degree+swivel+spout+modern+white+countertop+marble+kitchen+interior+soft+warm+light+professional+product+shot&width=800&height=900&seq=series-wave-v1&orientation=portrait",
    color: "#d4a8a0",
    products: 7,
    path: "/shop/bathroom",
  },
];

export default function SeriesPage() {
  const [featured, ...rest] = SERIES;

  return (
    <PageLayout>
      {/* Page intro — white, quiet (item 11) */}
      <div className="w-full bg-white pt-14 pb-10 text-center">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-[10px] font-semibold tracking-[0.5em] text-[#3ab4f2] uppercase mb-4">
            Waterfall — אוסף הסדרות
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#0d0d0d] mb-4">
            הסדרות שלנו
          </h1>
          <p className="text-sm text-[#888] leading-relaxed">
            כל סדרה מגלמת פילוסופיית עיצוב ייחודית. גלו את הסדרה שמדברת אליכם.
          </p>
        </div>
      </div>

      {/* ── Series banners (item 16): big image, series name overlaid ── */}
      <div className="w-full bg-white pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col gap-6">

          {/* Featured — full-width hero banner */}
          {featured && (
            <Link
              key={featured.name}
              to={featured.path}
              className="group relative block overflow-hidden rounded-3xl cursor-pointer"
              style={{ height: 440 }}
            >
              <img
                src={featured.image}
                alt={`${featured.nameHe} — ${featured.name}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/25 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="pr-10 sm:pr-16 text-right max-w-md">
                  <p className="text-[10px] font-semibold tracking-[0.45em] uppercase text-white/70 mb-3">
                    Series
                  </p>
                  <h2 className="font-serif text-5xl sm:text-6xl font-light text-white leading-none mb-2">
                    {featured.name}
                  </h2>
                  <p className="text-lg text-white/85 font-light mb-3">{featured.nameHe} · {featured.tagline}</p>
                  <p className="hidden sm:block text-sm text-white/60 leading-relaxed mb-6">{featured.description}</p>
                  <span
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-white px-7 py-3 rounded-full transition-transform duration-300 group-hover:-translate-x-1"
                    style={{ backgroundColor: featured.color }}
                  >
                    לצפייה בסדרה
                    <i className="ri-arrow-left-line text-sm"></i>
                  </span>
                </div>
              </div>
              <span className="absolute bottom-5 left-6 text-[10px] font-medium text-white/70 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                {featured.products} מוצרים
              </span>
            </Link>
          )}

          {/* Remaining series — 2-up banner tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rest.map((s) => (
              <Link
                key={s.name}
                to={s.path}
                className="group relative block overflow-hidden rounded-3xl cursor-pointer"
                style={{ height: 320 }}
              >
                <img
                  src={s.image}
                  alt={`${s.nameHe} — ${s.name}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-7 text-right">
                  <h2 className="font-serif text-4xl font-light text-white leading-none mb-1.5">
                    {s.name}
                  </h2>
                  <p className="text-sm text-white/80 mb-4">{s.nameHe} · {s.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-white/60 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                      {s.products} מוצרים
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs font-medium tracking-widest text-white border-b border-white/40 group-hover:border-white pb-0.5 transition-all">
                      לצפייה בסדרה
                      <i className="ri-arrow-left-line text-xs"></i>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
