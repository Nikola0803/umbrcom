import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageLayout from "../../components/feature/PageLayout";
import { allProducts, colorFilters } from "../../mocks/products";
import ProductCard from "../shop/components/ProductCard";
import ModelViewer3D from "./components/ModelViewer3D";
import { useCart } from "@/context/CartContext";

const COLOR_DOT: Record<string, string> = {
  "זהב מוברש": "#c9a96e",
  "ניקל מוברש": "#b0b8c1",
  "רוז גולד": "#c9948a",
  "שחור": "#1a1a1a",
  "זהב": "#d4af37",
  "כרום": "#c0c0c0",
};

const SPECS = [
  { label: "חומר", value: "פליז עם ציפוי פרמיום" },
  { label: "לחץ מים מינימלי", value: "1.0 בר" },
  { label: "ספיקה", value: "8 ל׳/דקה (ניתן לכיוון)" },
  { label: "חיבור", value: '½" אינץ׳ סטנדרט' },
  { label: "גובה", value: "37 ס״מ" },
  { label: "אחריות", value: "7 שנים" },
];

// ─── Gallery Carousel ─────────────────────────────────────────────────────
function GalleryCarousel({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(1); // center image is active by default

  const getStyle = (i: number) => {
    const diff = i - active;
    if (diff === 0)
      return {
        zIndex: 10,
        transform: "translateY(-20px) scale(1.08)",
        opacity: 1,
        boxShadow: "0 24px 48px rgba(0,0,0,0.14)",
      };
    if (Math.abs(diff) === 1)
      return {
        zIndex: 5,
        transform: "translateY(0px) scale(0.94)",
        opacity: 0.75,
        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
      };
    return {
      zIndex: 1,
      transform: "translateY(0px) scale(0.88)",
      opacity: 0.45,
      boxShadow: "none",
    };
  };

  return (
    <div className="w-full">
      {/* Carousel row */}
      <div className="flex items-end justify-center gap-4 px-4 py-10" style={{ minHeight: 340 }}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="relative bg-[#f9f7f4] rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-500"
            style={{
              width: i === active ? 260 : 180,
              height: i === active ? 260 : 190,
              ...getStyle(i),
            }}
          >
            <img src={img} alt={`${name} תמונה ${i + 1}`} className="w-full h-full object-contain p-4" />
          </button>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 pb-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === active ? "w-6 h-2 bg-[#1a1a1a]" : "w-2 h-2 bg-[#d9cfc5]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = allProducts.find((p) => p.id === id);
  const { addItem } = useCart();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "shipping" | "3d">("desc");

  if (!product) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8 py-20">
          <i className="ri-error-warning-line text-5xl text-[#888888] mb-4"></i>
          <h2 className="font-serif text-2xl text-[#1a1410] mb-3">מוצר לא נמצא</h2>
          <p className="text-sm text-[#9a8a7a] mb-8">המוצר שחיפשת אינו קיים או הוסר.</p>
          <Link
            to="/shop"
            className="bg-[#1a1a1a] text-white text-xs font-semibold tracking-widest px-8 py-3.5 rounded-xl whitespace-nowrap cursor-pointer"
          >
            חזרה לחנות
          </Link>
        </div>
      </PageLayout>
    );
  }

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    if (!product) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  // Build 3-image gallery (repeat for demo)
  const galleryImages = [product.image, product.image, product.image];

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="w-full border-b border-[#ede9e1] bg-white">
        <div className="max-w-6xl mx-auto px-8 py-3 flex items-center gap-2 text-xs text-[#9a8a7a]">
          <Link to="/" className="hover:text-[#1a1a1a] transition-colors cursor-pointer">בית</Link>
          <i className="ri-arrow-left-s-line"></i>
          <Link to="/shop" className="hover:text-[#1a1a1a] transition-colors cursor-pointer">חנות</Link>
          <i className="ri-arrow-left-s-line"></i>
          <span className="text-[#1a1410] font-medium line-clamp-1">{product.name}</span>
        </div>
      </div>

      {/* ── Gallery Carousel ── */}
      <section className="w-full bg-white border-b border-[#ede9e1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <GalleryCarousel images={galleryImages} name={product.name} />
        </div>
      </section>

      {/* ── Main Product Info ── */}
      <section className="w-full bg-white border-b border-[#ede9e1]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-start">

            {/* LEFT — highlights + features */}
            <div className="space-y-5">
              {/* Product name + badge */}
              <div className="text-right">
                <span className="inline-block text-[9px] font-semibold tracking-[0.4em] text-[#888] uppercase mb-3">
                  {product.category === "kitchen" ? "ברזי מטבח" : product.category === "bathroom" ? "ברזי כיור רחצה" : "ברזי מים קרים"} — Waterfall
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1a1410] leading-tight">
                  {product.name}
                </h1>
                {/* Stars */}
                <div className="flex items-center justify-end gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i key={i} className="ri-star-fill text-[#1a1a1a] text-sm" />
                  ))}
                  <span className="text-xs text-[#aaa] mr-2">(14 ביקורות)</span>
                </div>
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { icon: "ri-shield-check-line", title: "אחריות 7 שנים", sub: "מלאה על כל חלקי הברז" },
                  { icon: "ri-truck-line", title: "משלוח חינם", sub: "הזמנות מעל ₪200" },
                  { icon: "ri-medal-line", title: "ציפוי PVD", sub: "עמיד לאורך שנים" },
                ].map((f) => (
                  <div key={f.title} className="flex flex-col items-end text-right bg-[#faf8f5] rounded-xl p-4 border border-[#ede9e1]">
                    <i className={`${f.icon} text-[#1a1a1a] text-xl mb-2`}></i>
                    <p className="text-xs font-semibold text-[#1a1410]">{f.title}</p>
                    <p className="text-[10px] text-[#9a8a7a] mt-0.5">{f.sub}</p>
                  </div>
                ))}
              </div>

              {/* Short description */}
              <div className="text-right text-sm text-[#6a5e52] leading-relaxed border-r-2 border-[#1a1a1a] pr-4">
                ברז פרמיום מסדרת Waterfall — עשוי פליז איכותי עם ציפוי {product.color} עמיד לאורך שנים.
                מנגנון קרמיקה מבטיח פעולה חלקה ואטימה מושלמת ללא טפטוף.
              </div>

              {/* SKU */}
              <p className="text-[10px] text-[#ccc] text-right">מק״ט: {product.sku}</p>
            </div>

            {/* RIGHT — purchase panel */}
            <div className="bg-[#faf8f5] rounded-2xl border border-[#ede9e1] p-6 text-right space-y-5 lg:sticky lg:top-28">
              {/* Price */}
              <div className="flex items-start justify-between flex-row-reverse">
                <div>
                  <span className="text-3xl font-bold text-[#1a1410]">
                    ₪{product.price.toLocaleString("he-IL")}
                  </span>
                  <span className="text-sm text-[#bbb] line-through mr-2">
                    ₪{Math.round(product.price * 1.2).toLocaleString("he-IL")}
                  </span>
                </div>
                <span className="text-xs font-bold text-white bg-[#1a1a1a] px-2.5 py-1 rounded-full">
                  חיסכון 17%
                </span>
              </div>

              <div className="border-t border-[#ede9e1]" />

              {/* Color */}
              <div>
                <p className="text-xs font-semibold text-[#1a1410] mb-3">
                  גימור: <span className="font-normal text-[#6a5e52]">{product.color}</span>
                </p>
                <div className="flex items-center justify-end gap-2 flex-wrap">
                  {colorFilters.map((c) => (
                    <button
                      key={c.value}
                      title={c.label}
                      className={`relative w-9 h-9 rounded-md transition-all duration-200 cursor-pointer flex-shrink-0 ${
                        product.color === c.value
                          ? "ring-2 ring-offset-2 ring-[#1a1a1a]"
                          : "hover:ring-1 hover:ring-offset-1 hover:ring-[#999]"
                      }`}
                      style={{ backgroundColor: COLOR_DOT[c.value] ?? "#999" }}
                      onClick={() => {
                        const same = allProducts.find(
                          (p) => p.category === product.category && p.color === c.value && p.id !== product.id
                        );
                        if (same) navigate(`/product/${same.id}`);
                      }}
                    >
                      {product.color === c.value && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <i className="ri-check-line text-white text-xs drop-shadow-sm" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty */}
              <div>
                <p className="text-xs font-semibold text-[#1a1410] mb-2">כמות</p>
                <div className="inline-flex items-center rounded-xl border border-[#e0dbd4] bg-white overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#1a1410] hover:bg-[#f5f2ed] transition-colors cursor-pointer"
                  >
                    <i className="ri-subtract-line text-sm"></i>
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold text-[#1a1410] border-x border-[#e0dbd4]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#1a1410] hover:bg-[#f5f2ed] transition-colors cursor-pointer"
                  >
                    <i className="ri-add-line text-sm"></i>
                  </button>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={handleAdd}
                  className={`w-full py-4 text-sm font-semibold tracking-widest rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer shadow-sm ${
                    added
                      ? "bg-[#2d7a3a] text-white"
                      : "bg-[#1a1410] text-white hover:bg-[#000] hover:shadow-md"
                  }`}
                >
                  {added ? "✓ נוסף לסל בהצלחה" : "הוספה לסל"}
                </button>

                {/* 3D View button */}
                <button
                  onClick={() => setActiveTab("3d")}
                  className="w-full py-3 text-sm font-medium rounded-xl border border-[#e0dbd4] text-[#6a5e52] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="ri-box-3-line text-base"></i>
                  תצוגה תלת-מימדית
                </button>

                <a
                  href={`https://wa.me/97236208197?text=${encodeURIComponent(`שלום, אני מעוניין ב-${product.name} (מק״ט: ${product.sku})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 text-sm font-medium rounded-xl border border-[#e0dbd4] text-[#6a5e52] hover:border-[#25D366] hover:text-[#25D366] transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="ri-whatsapp-line text-base"></i>
                  הזמן דרך WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Tabs: Description / Specs / Shipping / 3D ── */}
      <section className="w-full bg-white border-y border-[#ede9e1] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          {/* Tab bar */}
          <div className="flex justify-end gap-0 mb-8 border-b border-[#ede9e1]">
            {(
              [
                { key: "desc", label: "תיאור המוצר" },
                { key: "specs", label: "מפרט טכני" },
                { key: "shipping", label: "משלוח והחזרות" },
                { key: "3d", label: "תצוגה תלת-מימדית" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-6 py-3 text-sm font-medium rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 -mb-px flex items-center gap-2 ${
                  activeTab === t.key
                    ? "border-[#1a1a1a] text-[#1a1a1a]"
                    : "border-transparent text-[#6a5e52] hover:text-[#1a1410]"
                }`}
              >
                {t.key === "3d" && <i className="ri-box-3-line text-xs"></i>}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="text-right max-w-2xl mr-auto">
            {activeTab === "desc" && (
              <div className="space-y-4 text-sm text-[#5a4e42] leading-relaxed">
                <p>
                  {product.name} — ברז פרמיום מסדרת Waterfall, מעוצב לשדרג כל מטבח ואמבטיה.
                  הברז עשוי פליז איכותי עם ציפוי {product.color} עמיד לאורך שנים, עמיד בפני שריטות וסימני מים.
                </p>
                <p>
                  מנגנון הקרמיקה הפנימי מבטיח פעולה חלקה ואטימה מושלמת — ללא טפטוף, ללא בלאי מוקדם.
                  הכינון הארגונומי מאפשר שליטה מדויקת בטמפרטורת המים.
                </p>
                <p>
                  מתאים לכל מערכות אינסטלציה סטנדרטיות בישראל. ההתקנה פשוטה ומגיעה עם כל הכלים הנדרשים.
                </p>
                <ul className="list-none space-y-2 pt-2">
                  {["ציפוי פיזי PVD — לא מתקלף לעולם", "ידית ארגונומית חד-ידנית", "מכסה ראש ניתן להסרה לניקוי קל", "תואם מערכות מים קרים/חמים"].map((f) => (
                    <li key={f} className="flex items-center gap-2 justify-end text-sm">
                      <span>{f}</span>
                      <i className="ri-checkbox-circle-fill text-[#1a1a1a] flex-shrink-0"></i>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="divide-y divide-[#ede9e1]">
                {SPECS.map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-3.5">
                    <span className="text-sm text-[#1a1410] font-medium">{s.value}</span>
                    <span className="text-xs text-[#9a8a7a] uppercase tracking-wide">{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-5 text-sm text-[#5a4e42] leading-relaxed">
                <div className="flex gap-4 items-start flex-row-reverse">
                  <i className="ri-truck-line text-xl text-[#1a1a1a] flex-shrink-0 mt-0.5"></i>
                  <div>
                    <p className="font-semibold text-[#1a1410] mb-1">משלוח חינם מעל ₪200</p>
                    <p>משלוח סטנדרטי: 3-5 ימי עסקים. משלוח מהיר (יומיים): +₪29. שליח עד הבית ברחבי הארץ.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start flex-row-reverse">
                  <i className="ri-arrow-go-back-line text-xl text-[#1a1a1a] flex-shrink-0 mt-0.5"></i>
                  <div>
                    <p className="font-semibold text-[#1a1410] mb-1">החזרה קלה תוך 14 יום</p>
                    <p>לא מרוצים? ניצור איתכם קשר ונדאג לאיסוף והחזר כספי מלא — ללא שאלות.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start flex-row-reverse">
                  <i className="ri-shield-check-line text-xl text-[#1a1a1a] flex-shrink-0 mt-0.5"></i>
                  <div>
                    <p className="font-semibold text-[#1a1410] mb-1">אחריות יצרן 7 שנים</p>
                    <p>כל מוצרי Waterfall מגיעים עם אחריות מלאה של 7 שנים על חלקי הברז ומנגנון הקרמיקה.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "3d" && product && (
              <div className="max-w-3xl mr-auto">
                <ModelViewer3D productName={product.name} productSku={product.sku} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <section className="w-full bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="text-right mb-8">
              <p className="text-[10px] font-medium tracking-[0.35em] text-[#1a1a1a] uppercase mb-2">
                מאותה קטגוריה
              </p>
              <h2 className="font-serif text-2xl font-light text-[#1a1410]">
                מוצרים קשורים
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
}
