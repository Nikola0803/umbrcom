import { Link } from "react-router-dom";

// ── ITEM 2: category images — swap the `image` URLs below with the client's
//    prepared photos for Kitchen / Bathroom Sink / Cold Water. New placeholder
//    art is in place meanwhile (v3).
export interface CategoryTile {
  key: string;
  title: string;
  subtitle?: string;
  path: string;
  image: string;
}

const DEFAULT_CATEGORIES: CategoryTile[] = [
  {
    key: "kitchen",
    title: "ברזי מטבח",
    subtitle: "נשלף ומקצועי",
    path: "/shop/kitchen",
    image:
      "https://readdy.ai/api/search-image?query=premium%20matte%20black%20pull-down%20kitchen%20faucet%20luxury%20kitchen%20island%20white%20oak%20cabinets%20natural%20daylight%20editorial%20interior%20photography%20no%20people%20high%20end&width=800&height=700&seq=cat-kitchen-tile-v3&orientation=portrait",
  },
  {
    key: "bathroom",
    title: "ברזי כיור רחצה",
    subtitle: "עיצוב ואסתטיקה",
    path: "/shop/bathroom",
    image:
      "https://readdy.ai/api/search-image?query=luxury%20brushed%20gold%20bathroom%20basin%20faucet%20stone%20vessel%20sink%20spa%20bathroom%20warm%20ambient%20light%20editorial%20interior%20photography%20no%20people%20premium&width=800&height=700&seq=cat-bathroom-tile-v3&orientation=portrait",
  },
  {
    key: "cold-water",
    title: "ברזי מים קרים",
    subtitle: "חסכוני ופונקציונלי",
    path: "/shop/cold-water",
    image:
      "https://readdy.ai/api/search-image?query=minimal%20chrome%20cold%20water%20tap%20modern%20bar%20sink%20concrete%20countertop%20soft%20window%20light%20clean%20contemporary%20interior%20photography%20no%20people&width=800&height=700&seq=cat-coldwater-tile-v3&orientation=portrait",
  },
];

export interface CategoriesSectionProps {
  eyebrow?: string;
  heading?: string;
  categories?: CategoryTile[];
}

export default function CategoriesSection({
  eyebrow = "Waterfall — הקולקציה",
  heading = "קטגוריות מוצרים",
  categories = DEFAULT_CATEGORIES,
}: CategoriesSectionProps) {
  return (
    <section className="w-full bg-white py-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-8 text-right mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#3ab4f2]" />
          <p className="text-[10px] font-semibold tracking-[0.35em] text-[#3ab4f2] uppercase">
            {eyebrow}
          </p>
          <span className="w-2 h-2 rounded-full bg-[#3ab4f2]" />
        </div>
        <h2 className="font-serif text-3xl font-light text-[#0d0d0d]">
          {heading}
        </h2>
      </div>

      {/* cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.key}
            to={cat.path}
            className="group relative overflow-hidden rounded-2xl cursor-pointer block"
            style={{ height: "420px" }}
          >
            {/* Image */}
            <img
              src={cat.image}
              alt={cat.title}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/85" />

            {/* Content at bottom */}
            <div className="absolute bottom-0 right-0 left-0 p-7 text-right">
              <p className="text-[10px] font-medium tracking-[0.3em] text-[#888888] uppercase mb-1.5">
                {cat.subtitle}
              </p>
              <h3 className="font-serif text-2xl font-medium text-white mb-4">
                {cat.title}
              </h3>
              <span className="inline-flex items-center gap-2 text-xs font-medium tracking-widest text-white/70 group-hover:text-white border-b border-white/30 group-hover:border-white pb-0.5 transition-all duration-300">
                לצפייה בקטגוריה
                <i className="ri-arrow-left-line text-xs"></i>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
