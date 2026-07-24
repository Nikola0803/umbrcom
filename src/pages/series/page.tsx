import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../../components/feature/PageLayout";
import { fetchNav } from "@/lib/wp-api";

interface SeriesTile {
  name: string;
  nameHe?: string;
  tagline?: string;
  description?: string;
  image: string;
  color: string;
  products: number;
  path: string;
  isFeatured?: boolean;
}

const DEFAULT_SERIES: SeriesTile[] = [
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
  const [series, setSeries] = useState<SeriesTile[]>(DEFAULT_SERIES);

  useEffect(() => {
    fetchNav().then((nav) => {
      if (!nav) return;

      // Preferred source: the dedicated `series` field — richer copy
      // (tagline/description), once someone wires it up in wp-admin.
      if (nav.series.length > 0) {
        const mapped: SeriesTile[] = nav.series.map((s) => ({
          name: s.name,
          nameHe: s.name_he,
          tagline: s.tagline,
          description: s.description,
          image: s.image,
          color: s.color,
          products: s.products,
          path: s.path,
          isFeatured: s.is_featured,
        }));
        mapped.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        setSeries(mapped);
        return;
      }

      // `series` is empty on the live site right now — but the real named
      // series (Ella, Hilo, Loïs, Sora, Dett, Goma, Lani, Nara, Nima, Toma…)
      // already exist as real WooCommerce categories named "סדרת <Name>",
      // each with a real image and product count. This is exactly why the
      // page was showing fake placeholder series (Atlas/Primo/Aqua…) that
      // don't match the real catalog the homepage category tile links to —
      // derive the list from those real categories instead, same fallback
      // pattern used elsewhere (seriesCodeOf, colorFromName) until the
      // dedicated `series` field is actually populated.
      const stripNbsp = (s: string) => s.replace(new RegExp(" ", "g"), " ").trim();
      const seriesCategories = nav.categories.filter((c) => {
        const label = stripNbsp(c.label);
        return label.startsWith("סדרת ") && label !== "סדרות";
      });
      if (seriesCategories.length === 0) return; // keep DEFAULT_SERIES (offline/dev fallback)

      const mapped: SeriesTile[] = seriesCategories.map((c) => ({
        name: stripNbsp(c.label).replace(/^סדרת\s+/, ""),
        image: c.image,
        color: "#3ab4f2",
        products: c.count,
        path: c.link,
      }));
      setSeries(mapped);
    });
  }, []);

  const [featured, ...rest] = series;

  // Item 36: dynamic masonry rhythm instead of a uniform 2-up grid — cycles
  // through large/medium/small tiles (in a 6-column grid) so the pattern
  // keeps changing as more series are pulled in from the site categories.
  // [1 large banner, 2 medium cards, 3 small cards] then repeats.
  const TILE_PATTERN: { span: string; h: number; nameSize: string }[] = [
    { span: "sm:col-span-6", h: 380, nameSize: "text-4xl sm:text-5xl" },
    { span: "sm:col-span-3", h: 300, nameSize: "text-3xl" },
    { span: "sm:col-span-3", h: 300, nameSize: "text-3xl" },
    { span: "sm:col-span-2", h: 230, nameSize: "text-2xl" },
    { span: "sm:col-span-2", h: 230, nameSize: "text-2xl" },
    { span: "sm:col-span-2", h: 230, nameSize: "text-2xl" },
  ];

  return (
    <PageLayout>
      {/* Page intro — white, quiet (item 11) */}
      <div className="w-full bg-white pt-14 pb-10 text-right">
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
                alt={featured.nameHe ? `${featured.nameHe} — ${featured.name}` : featured.name}
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
                  {(featured.nameHe || featured.tagline) && (
                    <p className="text-lg text-white/85 font-light mb-3">
                      {[featured.nameHe, featured.tagline].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {featured.description && (
                    <p className="hidden sm:block text-sm text-white/60 leading-relaxed mb-6">{featured.description}</p>
                  )}
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

          {/* Item 36 — dynamic masonry: large banner / 2 medium / 3 small,
              repeating, instead of a repetitive uniform grid. */}
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
            {rest.map((s, i) => {
              const tile = TILE_PATTERN[i % TILE_PATTERN.length];
              return (
                <Link
                  key={s.name}
                  to={s.path}
                  className={`group relative block overflow-hidden rounded-3xl cursor-pointer col-span-1 ${tile.span}`}
                  style={{ height: tile.h }}
                >
                  <img
                    src={s.image}
                    alt={s.nameHe ? `${s.nameHe} — ${s.name}` : s.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-7 text-right">
                    <h2 className={`font-serif ${tile.nameSize} font-light text-white leading-none mb-1.5`}>
                      {s.name}
                    </h2>
                    {(s.nameHe || s.tagline) && (
                      <p className="text-sm text-white/80 mb-4">
                        {[s.nameHe, s.tagline].filter(Boolean).join(" · ")}
                      </p>
                    )}
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
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
