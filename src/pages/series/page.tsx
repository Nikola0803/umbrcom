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
  return (
    <PageLayout>
      {/* Hero banner */}
      <div className="w-full bg-[#0f0f0f] py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #3ab4f2 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-8">
          <p className="text-[10px] font-semibold tracking-[0.5em] text-[#3ab4f2] uppercase mb-4">
            Waterfall — אוסף הסדרות
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-white mb-4">
            הסדרות שלנו
          </h1>
          <p className="text-sm text-white/50 leading-relaxed">
            כל סדרה מגלמת פילוסופיית עיצוב ייחודית. גלו את הסדרה שמדברת אליכם.
          </p>
        </div>
      </div>

      {/* Series grid */}
      <div className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERIES.map((s) => (
              <Link
                key={s.name}
                to={s.path}
                className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-[#eaeaea] hover:border-[#c8c4be] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] bg-white"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-[#f7f5f2]" style={{ height: 320 }}>
                  <img
                    src={s.image}
                    alt={`${s.nameHe} — ${s.name}`}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Color tag */}
                  <div className="absolute top-4 right-4">
                    <span
                      className="text-[9px] font-bold tracking-[0.3em] uppercase text-white px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.name}
                    </span>
                  </div>
                  {/* Product count */}
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {s.products} מוצרים
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 text-right flex flex-col gap-2 flex-1">
                  <div className="flex items-baseline justify-between flex-row-reverse">
                    <h2 className="font-serif text-2xl font-light text-[#1a1410]">{s.nameHe}</h2>
                    <span className="text-xs text-[#aaa] tracking-widest uppercase">{s.name}</span>
                  </div>
                  <p className="text-xs font-semibold tracking-wide text-[#3ab4f2]">{s.tagline}</p>
                  <p className="text-sm text-[#6a5e52] leading-relaxed flex-1">{s.description}</p>
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f0ece6] mt-1">
                    <span className="text-xs font-medium text-[#1a1a1a] group-hover:gap-2 transition-all">
                      לצפייה בסדרה
                    </span>
                    <i className="ri-arrow-left-line text-xs text-[#1a1a1a]" />
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
