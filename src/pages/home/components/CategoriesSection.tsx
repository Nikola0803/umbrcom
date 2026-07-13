import { Link } from "react-router-dom";

const categories = [
  {
    key: "kitchen",
    title: "ברזי מטבח",
    subtitle: "נשלף ומקצועי",
    path: "/shop/kitchen",
    image:
      "https://readdy.ai/api/search-image?query=modern%20luxury%20kitchen%20faucet%20brushed%20gold%20pull-out%20spray%20head%20over%20white%20marble%20sink%20countertop%2C%20clean%20minimal%20background%2C%20soft%20natural%20studio%20lighting%2C%20professional%20product%20photography%2C%20warm%20tones%2C%20no%20people%2C%20elegant%20design%2C%20shallow%20depth%20of%20field%2C%20high%20resolution&width=800&height=700&seq=cat-kitchen-tile-v2&orientation=portrait",
  },
  {
    key: "bathroom",
    title: "ברזי כיור רחצה",
    subtitle: "עיצוב ואסתטיקה",
    path: "/shop/bathroom",
    image:
      "https://readdy.ai/api/search-image?query=elegant%20bathroom%20basin%20faucet%20brushed%20nickel%20chrome%20finish%20mounted%20on%20white%20ceramic%20sink%2C%20minimalist%20bathroom%20interior%20soft%20diffused%20light%2C%20clean%20modern%20design%2C%20professional%20interior%20photography%2C%20neutral%20tones%2C%20no%20people%2C%20high%20end%20residential%2C%20shallow%20focus&width=800&height=700&seq=cat-bathroom-tile-v2&orientation=portrait",
  },
  {
    key: "cold-water",
    title: "ברזי מים קרים",
    subtitle: "חסכוני ופונקציונלי",
    path: "/shop/cold-water",
    image:
      "https://readdy.ai/api/search-image?query=minimalist%20cold%20water%20tap%20faucet%20matte%20black%20finish%20wall%20mounted%2C%20clean%20white%20background%2C%20sharp%20product%20shot%2C%20modern%20industrial%20design%2C%20soft%20box%20studio%20lighting%2C%20close-up%20detail%20texture%2C%20high%20resolution%2C%20no%20people%2C%20contemporary%20style&width=800&height=700&seq=cat-coldwater-tile-v2&orientation=portrait",
  },
];

export default function CategoriesSection() {
  return (
    <section className="w-full bg-white py-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-8 text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#3ab4f2]" />
          <p className="text-[10px] font-semibold tracking-[0.35em] text-[#3ab4f2] uppercase">
            Waterfall — הקולקציה
          </p>
          <span className="w-2 h-2 rounded-full bg-[#3ab4f2]" />
        </div>
        <h2 className="font-serif text-3xl font-light text-[#0d0d0d]">
          קטגוריות מוצרים
        </h2>
      </div>

      {/* 3 cards */}
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
