import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "../../components/feature/PageLayout";
import ProductCard from "./components/ProductCard";
import ShopFilters from "./components/ShopFilters";
import { allProducts, ProductColor, ProductType, ProductCategory } from "../../mocks/products";

const PAGE_SIZE = 16;

const CATEGORY_META: Record<string, { title: string; subtitle: string; key: ProductCategory; hero?: string }> = {
  kitchen: {
    title: 'ברזי מטבח',
    subtitle: 'ברזי מטבח איכותיים המעניקים נוחות מקסימלית לעבודה היומיומית. עיצוב מוקפד ומחירים אטרקטיביים.',
    key: 'kitchen',
    hero: 'https://readdy.ai/api/search-image?query=modern+luxury+kitchen+faucet+gold+brushed+over+white+marble+sink+minimal+background+soft+studio+lighting+professional+product+photography&width=1400&height=400&seq=hero-kitchen-v1&orientation=landscape',
  },
  bathroom: {
    title: 'ברזי כיור רחצה',
    subtitle: 'ברזי כיור רחצה מעוצבים בקפידה לכל חדר האמבטיה. שילוב מושלם של פונקציונליות ואסתטיקה.',
    key: 'bathroom',
    hero: 'https://readdy.ai/api/search-image?query=elegant+bathroom+basin+faucet+brushed+nickel+mounted+on+white+ceramic+sink+minimalist+bathroom+interior+soft+diffused+light&width=1400&height=400&seq=hero-bathroom-v1&orientation=landscape',
  },
  'cold-water': {
    title: 'ברזי מים קרים',
    subtitle: 'ברזי מים קרים איכותיים לקיר הבית או לדלפק. חסכוניים באנרגיה ומתאימים לכל עיצוב.',
    key: 'cold-water',
    hero: 'https://readdy.ai/api/search-image?query=minimalist+cold+water+tap+faucet+matte+black+wall+mounted+clean+white+background+studio+lighting+professional&width=1400&height=400&seq=hero-coldwater-v1&orientation=landscape',
  },
};

export default function ShopPage() {
  const { category } = useParams<{ category?: string }>();
  const [selectedColors, setSelectedColors] = useState<ProductColor[]>([]);
  const [selectedType, setSelectedType] = useState<ProductType | ''>('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const meta = category ? CATEGORY_META[category] : null;

  const filtered = useMemo(() => {
    let list = meta
      ? allProducts.filter((p) => p.category === meta.key)
      : allProducts;

    if (selectedColors.length > 0) {
      list = list.filter((p) => selectedColors.includes(p.color));
    }
    if (selectedType) {
      list = list.filter((p) => p.type === selectedType);
    }
    return list;
  }, [meta, selectedColors, selectedType]);

  const handleColorToggle = (color: ProductColor) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const title = meta ? meta.title : 'חנות';
  const subtitle = meta ? meta.subtitle : 'כאן אפשר לעיין במוצרים שבחנות.';

  return (
    <PageLayout>
      {/* Page banner */}
      <div className="relative w-full bg-[#0f0f0f] overflow-hidden" style={{ minHeight: meta?.hero ? "260px" : "180px" }}>
        {/* Hero image */}
        {meta?.hero && (
          <>
            <img
              src={meta.hero}
              alt={meta.title}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent" />
          </>
        )}
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4 text-center">
          <p className="text-[10px] font-medium tracking-[0.4em] text-[#666] uppercase mb-3">
            {meta ? "קטגוריה — Waterfall" : "כל המוצרים"}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-white">{title}</h1>
          <div className="mt-4 flex justify-center">
            <span className="block w-12 h-px bg-white/20"></span>
          </div>
          {meta && (
            <p className="text-sm text-[#888] max-w-xl mx-auto mt-5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        <ShopFilters
          selectedColors={selectedColors}
          selectedType={selectedType}
          onColorToggle={handleColorToggle}
          onTypeChange={(t) => {
            setSelectedType(t);
            setVisibleCount(PAGE_SIZE);
          }}
        />
      </div>

      {/* Product grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-20 pt-4">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <i className="ri-search-line text-4xl text-[#ddd] mb-3 block"></i>
            <p className="text-[#aaa] text-sm">לא נמצאו מוצרים התואמים לסינון.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-[#aaa] mb-6 text-right">{filtered.length} מוצרים</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.slice(0, visibleCount).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                  className="text-white text-sm font-semibold tracking-widest px-12 py-4 rounded-full transition-colors duration-300 whitespace-nowrap cursor-pointer"
                  style={{ backgroundColor: "#3ab4f2" }}
                >
                  טען עוד
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
