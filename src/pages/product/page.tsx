import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageLayout from "../../components/feature/PageLayout";
import { allProducts as mockProducts, Product } from "../../mocks/products";
import { useLiveProducts } from "@/hooks/useLiveProducts";
import ProductCard from "../shop/components/ProductCard";
import ModelViewer3D from "./components/ModelViewer3D";
import { useCart } from "@/context/CartContext";
import { fetchProductById, fetchProductBySku, isWpConfigured } from "@/lib/wp-api";
import { trackViewItem } from "@/lib/analytics";
import { trackMetaViewContent } from "@/lib/metaPixel";
import { seriesCodeOf } from "@/lib/series";
import { youtubeEmbedUrl } from "@/lib/youtube";

type LiveProduct = Product & {
  images?: string[];
  regularPrice?: number;
  salePrice?: number;
  discountPercent?: number;
  averageRating?: number;
  reviewCount?: number;
  brandLabel?: string;
  featureCards?: { icon: string; title: string; sub: string }[];
  shortDescription?: string;
  descriptionHtml?: string;
  descriptionParagraphs?: string[];
  features?: string[];
  specTable?: { label: string; value: string }[];
  shippingInfo?: { icon: string; title: string; text: string }[];
  youtubeUrl?: string;
  aiReview?: string;
  techSpecsHtml?: string;
  packageContents?: string[];
  packageContentsHtml?: string;
  warranty?: string;
  model3dUrl?: string;
  model3dUsdzUrl?: string;
  arEnabled?: boolean;
  badgeText?: string;
  isNew?: boolean;
};

const COLOR_DOT: Record<string, string> = {
  "זהב מוברש": "#c9a96e",
  "ניקל מוברש": "#b0b8c1",
  "רוז גולד": "#c9948a",
  "שחור": "#1a1a1a",
  "זהב": "#d4af37",
  "כרום": "#c0c0c0",
};


/** Product custom fields now come from WYSIWYG editors in wp-admin (may contain
 *  headings, lists, and pasted Excel/Word tables). Legacy values are plain text
 *  — detect and render each accordingly. */
const RICH_FIELD_CLASSES =
  "text-sm text-[#5a4e42] leading-relaxed text-right " +
  "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[#1a1410] [&_h2]:mt-4 [&_h2]:mb-2 " +
  "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[#1a1410] [&_h3]:mt-3 [&_h3]:mb-1.5 " +
  "[&_h4]:font-semibold [&_h4]:text-[#1a1410] [&_p]:mb-3 [&_strong]:text-[#1a1410] " +
  "[&_ul]:list-disc [&_ul]:pr-5 [&_ul]:space-y-1 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pr-5 [&_ol]:space-y-1 [&_ol]:mb-3 " +
  "[&_table]:w-full [&_table]:text-right [&_table]:my-3 [&_table]:border-separate [&_table]:[border-spacing:0] " +
  "[&_table]:rounded-2xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-[#ece7dd] " +
  "[&_th]:bg-[#1a1410] [&_th]:text-white [&_th]:text-xs [&_th]:font-semibold [&_th]:px-5 [&_th]:py-3 " +
  "[&_td]:px-5 [&_td]:py-3 [&_td]:border-b [&_td]:border-[#f2eee6] [&_tr:last-child_td]:border-b-0 " +
  "[&_tbody_tr:nth-child(even)_td]:bg-[#faf8f4] [&_td:first-child]:font-semibold [&_td:first-child]:text-[#1a1410] " +
  "[&_a]:underline [&_a]:text-[#1a1410]";

function looksLikeHtml(s: string) {
  return /<[a-z][\s\S]*>/i.test(s);
}

function RichField({ value }: { value: string }) {
  if (looksLikeHtml(value)) {
    return <div dir="rtl" className={RICH_FIELD_CLASSES} dangerouslySetInnerHTML={{ __html: value }} />;
  }
  return (
    <div dir="rtl" className="space-y-4 text-sm text-[#5a4e42] leading-relaxed text-right">
      {value.split(/\n\s*\n/).filter(Boolean).map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}

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
            className="relative bg-white border border-[#eee] rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-500"
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
  const { products: catalog, isLive } = useLiveProducts();
  const mockProduct = mockProducts.find((p) => p.id === id);
  const [product, setProduct] = useState<LiveProduct | undefined>(mockProduct);
  const [loading, setLoading] = useState(isWpConfigured());
  const { addItem } = useCart();

  useEffect(() => {
    setProduct(mockProduct);
    setActiveImage(0);
    if (!isWpConfigured() || !id) {
      setLoading(false);
      if (mockProduct) { trackViewItem(mockProduct); trackMetaViewContent(mockProduct); }
      return;
    }
    setLoading(true);
    fetchProductById(id).then(async (live) => {
      // Old-install ID? (pre-migration URLs / links rendered from mocks)
      // — the ID is dead but the SKU survived the migration: resolve it.
      if (!live && mockProduct?.sku) {
        live = await fetchProductBySku(mockProduct.sku);
      }
      if (live) setProduct(live);
      setLoading(false);
      const viewed = live ?? mockProduct;
      if (viewed) { trackViewItem(viewed); trackMetaViewContent(viewed); }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "video" | "ai" | "package" | "3d">("desc");
  const [activeImage, setActiveImage] = useState(0);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh]" />
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-start justify-center text-right px-10 py-20">
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

  // Never build related-product links from mock IDs — they 404 against
  // the live API. Mocks are only link-safe when WP itself is offline.
  const linkSafeCatalog = isWpConfigured() && !isLive ? [] : catalog;
  const related = linkSafeCatalog
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Item 5: finish/color swatches are scoped to this product's series only
  // (same SKU prefix) — see src/lib/series.ts for why that's the reliable
  // signal until a real series field is wired from wp-admin.
  const seriesCode = seriesCodeOf(product.sku);
  const seriesProducts = linkSafeCatalog.filter((p) => seriesCodeOf(p.sku) === seriesCode);
  const seriesColors = Array.from(new Set(seriesProducts.map((p) => p.color)));

  const handleAdd = () => {
    if (!product) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  // Real WooCommerce gallery when available; repeat the single mock image otherwise.
  const galleryImages =
    product.images && product.images.length > 0 ? product.images : [product.image, product.image, product.image];

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

      {/* ── Main Product Info ── */}
      <section className="w-full bg-white border-b border-[#ede9e1]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
          <div dir="rtl" className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-start">

            {/* ── Gallery column — page is fully RTL (item 19, July 2026) ── */}
            <div dir="rtl" className="space-y-4 lg:sticky lg:top-56">
              <div className="w-full aspect-square rounded-2xl bg-white border border-[#eee] overflow-hidden flex items-center justify-center">
                <img
                  src={galleryImages[activeImage] ?? product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-10"
                />
              </div>
              {/* Thumbnails — horizontal-scroll carousel, not a grid, per
                  Nik's follow-up. Clicking one swaps the main image. */}
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square w-20 flex-shrink-0 rounded-xl bg-white border overflow-hidden cursor-pointer transition-all ${
                      activeImage === i ? "border-[#1a1a1a] ring-1 ring-[#1a1a1a]" : "border-[#eee] hover:ring-1 hover:ring-[#1a1a1a]/30"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain p-3" />
                  </button>
                ))}
              </div>
            </div>

            {/* ── Info column: name, highlights + purchase panel ── */}
            <div dir="rtl" className="space-y-5">
              {/* Product name + badge */}
              <div className="text-right">
                <span className="inline-block text-[9px] font-semibold tracking-[0.4em] text-[#888] uppercase mb-3">
                  {product.category === "kitchen" ? "ברזי מטבח" : product.category === "bathroom" ? "ברזי כיור רחצה" : "ברזי מים קרים"} — {product.brandLabel || "Waterfall"}
                </span>
                {/* Item 8: stronger, on-brand title treatment — semibold +
                    tight tracking reads as premium/confident rather than
                    the previous thin font-light weight. */}
                <h1 className="font-serif text-3xl sm:text-[2.75rem] font-semibold tracking-tight text-[#1a1410] leading-[1.15]">
                  {product.name}
                </h1>
                {/* Stars */}
                <div className="flex items-center justify-start gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i
                      key={i}
                      className={`ri-star-fill text-sm ${
                        product.reviewCount ? (i < Math.round(product.averageRating ?? 0) ? "text-[#1a1a1a]" : "text-[#e5e5e5]") : "text-[#1a1a1a]"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-[#aaa] mr-2">
                    ({product.reviewCount ?? 14} ביקורות)
                  </span>
                </div>
              </div>

              {/* SKU — item 9: much more visual emphasis than the old
                  10px/#ccc near-invisible line; a dark chip that reads as a
                  real product identifier. Moved above the short description
                  (was below it), font is Assistant like the rest of the
                  site (was Courier New) — matches the Mashiach layout. */}
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 bg-[#1a1410] text-white text-xs font-bold tracking-wider px-3.5 py-1.5 rounded-lg">
                  <span className="opacity-60 font-normal">מק״ט</span>
                  {product.sku}
                </span>
              </div>

              {/* Feature cards — item 6: the old defaults (7-Year Warranty /
                  Free Shipping / Coating) were removed site-wide. Only
                  render this block when the CMS actually supplies cards. */}
              {product.featureCards && product.featureCards.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {product.featureCards.map((f) => (
                  <div key={f.title} className="flex flex-col items-end text-right bg-white rounded-xl p-4 border border-[#eaeaea]">
                    <i className={`${f.icon} text-[#1a1a1a] text-xl mb-2`}></i>
                    <p className="text-xs font-semibold text-[#1a1410]">{f.title}</p>
                    <p className="text-[10px] text-[#9a8a7a] mt-0.5">{f.sub}</p>
                  </div>
                ))}
              </div>
              )}

              {/* Short description */}
              <div className="text-right text-sm text-[#6a5e52] leading-relaxed border-r-2 border-[#1a1a1a] pr-4">
                {product.shortDescription && product.shortDescription.trim().length > 0
                  ? product.shortDescription
                  : `ברז פרמיום מסדרת ${product.brandLabel || "Waterfall"} — עשוי פליז איכותי עם ציפוי ${product.color} עמיד לאורך שנים. מנגנון קרמיקה מבטיח פעולה חלקה ואטימה מושלמת ללא טפטוף.`}
              </div>

              {/* Purchase panel — white (item 11) */}
              <div className="bg-white rounded-2xl border border-[#eaeaea] p-6 text-right space-y-5">
              {/* Price — "Save X%" badge removed; price right-aligned
                  (the old flex-row-reverse + justify-between combo was
                  pushing it left). */}
              <div className="text-right">
                <span className="text-3xl font-bold text-[#1a1410]">
                  ₪{product.price.toLocaleString("he-IL")}
                </span>
                {(product.regularPrice ?? Math.round(product.price * 1.2)) > product.price && (
                  <span className="text-sm text-[#bbb] line-through mr-2">
                    ₪{(product.regularPrice ?? Math.round(product.price * 1.2)).toLocaleString("he-IL")}
                  </span>
                )}
              </div>

              <div className="border-t border-[#ede9e1]" />

              {/* Color — item 5: only finishes that actually exist within
                  this product's series (not the whole category / catalog).
                  Swatches right-aligned (were rendering on the left). */}
              {seriesColors.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#1a1410] mb-3">
                    גימור: <span className="font-normal text-[#6a5e52]">{product.color}</span>
                  </p>
                  <div className="flex items-center justify-start gap-2 flex-wrap">
                    {seriesColors.map((c) => (
                      <button
                        key={c}
                        title={c}
                        className={`relative w-9 h-9 rounded-md transition-all duration-200 cursor-pointer flex-shrink-0 ${
                          product.color === c
                            ? "ring-2 ring-offset-2 ring-[#1a1a1a]"
                            : "hover:ring-1 hover:ring-offset-1 hover:ring-[#999]"
                        }`}
                        style={{ backgroundColor: COLOR_DOT[c] ?? "#999" }}
                        onClick={() => {
                          const same = seriesProducts.find((p) => p.color === c && p.id !== product.id);
                          if (same) navigate(`/product/${same.id}`);
                        }}
                      >
                        {product.color === c && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <i className="ri-check-line text-white text-xs drop-shadow-sm" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Qty */}
              <div>
                <p className="text-xs font-semibold text-[#1a1410] mb-2">כמות</p>
                <div className="inline-flex items-center rounded-xl border border-[#e0dbd4] bg-white overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#1a1410] hover:bg-[#f2f2f2] transition-colors cursor-pointer"
                  >
                    <i className="ri-subtract-line text-sm"></i>
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold text-[#1a1410] border-x border-[#e0dbd4]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#1a1410] hover:bg-[#f2f2f2] transition-colors cursor-pointer"
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
                      : "bg-[#3ab4f2] text-white hover:bg-[#2da0d8] hover:shadow-md"
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
              </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Secondary image gallery carousel — ABOVE the long description (items 5+6) ── */}
      <section className="w-full bg-white border-t border-[#eee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-right pt-10">
            <p className="text-[10px] font-semibold tracking-[0.35em] text-[#999] uppercase">גלריית תמונות</p>
          </div>
          <GalleryCarousel images={galleryImages} name={product.name} />
        </div>
      </section>

      {/* ── Tabs: Description / Specs / 3D — item 6 removed the standalone
          "7 Year Warranty" and "Free Shipping" tabs/sections. ── */}
      <section className="w-full bg-white border-y border-[#ede9e1] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          {/* Tab bar */}
          {/* PageLayout wraps everything in dir="rtl", so justify-START is the
              visual RIGHT — justify-end was pinning the tabs to the left. */}
          <div className="flex justify-start gap-0 mb-8 border-b border-[#ede9e1]">
            {(
              [
                { key: "desc", label: "תיאור המוצר" },
                { key: "specs", label: "נתונים טכניים" },
                ...(product.youtubeUrl ? [{ key: "video", label: "סרטון מוצר" }] : []),
                ...(product.aiReview ? [{ key: "ai", label: "סקירת AI" }] : []),
                ...(product.packageContents && product.packageContents.length > 0
                  ? [{ key: "package", label: "תכולת האריזה" }]
                  : []),
                { key: "3d", label: "תצוגה תלת-מימדית" },
              ] as { key: typeof activeTab; label: string }[]
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
                {t.key === "video" && <i className="ri-youtube-line text-xs"></i>}
                {t.key === "ai" && <i className="ri-sparkling-2-line text-xs"></i>}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div dir="rtl" className="text-right max-w-2xl ml-auto">
            {activeTab === "desc" && product.descriptionHtml && (!product.descriptionParagraphs || product.descriptionParagraphs.length === 0) ? (
              <div
                dir="rtl"
                className="product-description text-sm text-[#5a4e42] leading-relaxed text-right"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : activeTab === "desc" && (
              <div dir="rtl" className="space-y-4 text-sm text-[#5a4e42] leading-relaxed text-right">
                {(product.descriptionParagraphs && product.descriptionParagraphs.length > 0
                  ? product.descriptionParagraphs
                  : [
                      `${product.name} — ברז פרמיום מסדרת ${product.brandLabel || "Waterfall"}, מעוצב לשדרג כל מטבח ואמבטיה. הברז עשוי פליז איכותי עם ציפוי ${product.color} עמיד לאורך שנים, עמיד בפני שריטות וסימני מים.`,
                      "מנגנון הקרמיקה הפנימי מבטיח פעולה חלקה ואטימה מושלמת — ללא טפטוף, ללא בלאי מוקדם. הכינון הארגונומי מאפשר שליטה מדויקת בטמפרטורת המים.",
                      "מתאים לכל מערכות אינסטלציה סטנדרטיות בישראל. ההתקנה פשוטה ומגיעה עם כל הכלים הנדרשים.",
                    ]
                ).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                <ul className="list-none space-y-2 pt-2">
                  {(product.features && product.features.length > 0
                    ? product.features
                    : ["ציפוי פיזי PVD — לא מתקלף לעולם", "ידית ארגונומית חד-ידנית", "מכסה ראש ניתן להסרה לניקוי קל", "תואם מערכות מים קרים/חמים"]
                  ).map((f) => (
                    <li key={f} className="flex items-center gap-2 justify-end text-sm">
                      <span>{f}</span>
                      <i className="ri-checkbox-circle-fill text-[#1a1a1a] flex-shrink-0"></i>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "specs" &&
              (product.techSpecsHtml ? (
                <div
                  dir="rtl"
                  className="umbrcom-tech-specs text-sm text-[#5a4e52] leading-relaxed text-right
                    [&_table]:w-full [&_table]:text-right [&_table]:my-2 [&_table]:border-separate [&_table]:[border-spacing:0]
                    [&_table]:rounded-2xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-[#ece7dd] [&_table]:shadow-[0_1px_2px_rgba(0,0,0,0.03)]
                    [&_th]:bg-[#1a1410] [&_th]:text-white [&_th]:text-xs [&_th]:font-semibold [&_th]:tracking-wide [&_th]:px-5 [&_th]:py-3.5
                    [&_td]:px-5 [&_td]:py-3.5 [&_td]:border-b [&_td]:border-[#f2eee6] [&_tr:last-child_td]:border-b-0
                    [&_tbody_tr:nth-child(even)_td]:bg-[#faf8f4]
                    [&_td:first-child]:font-semibold [&_td:first-child]:text-[#1a1410] [&_td:first-child]:w-[36%] [&_td:first-child]:align-top
                    [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pr-5 [&_ul]:space-y-1 [&_h3]:font-semibold [&_h3]:text-[#1a1410] [&_h3]:mb-2"
                  dangerouslySetInnerHTML={{ __html: product.techSpecsHtml }}
                />
              ) : (
                <div dir="rtl" className="rounded-2xl overflow-hidden border border-[#ece7dd] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  {(product.specTable && product.specTable.length > 0 ? product.specTable : SPECS).map((s, i) => (
                    <div
                      key={s.label}
                      className={`grid grid-cols-[36%_1fr] items-center px-5 py-3.5 text-right ${
                        i % 2 === 1 ? "bg-[#faf8f4]" : "bg-white"
                      } ${i > 0 ? "border-t border-[#f2eee6]" : ""}`}
                    >
                      <span className="text-sm font-semibold text-[#1a1410]">{s.label}</span>
                      <span className="text-sm text-[#5a4e42]">{s.value}</span>
                    </div>
                  ))}
                </div>
              ))}

            {activeTab === "video" && product.youtubeUrl && (
              <div className="max-w-3xl mr-auto">
                {youtubeEmbedUrl(product.youtubeUrl) ? (
                  <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ paddingTop: "56.25%" }}>
                    <iframe
                      src={youtubeEmbedUrl(product.youtubeUrl)!}
                      title={`${product.name} — וידאו`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <a
                    href={product.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#1a1a1a] underline"
                  >
                    <i className="ri-youtube-fill text-lg text-[#f00]"></i>
                    לצפייה בסרטון המוצר ביוטיוב
                  </a>
                )}
              </div>
            )}

            {activeTab === "ai" && product.aiReview && (
              <div dir="rtl" className="space-y-4 text-sm text-[#5a4e42] leading-relaxed text-right">
                <div className="flex items-center gap-2 justify-end text-xs font-semibold text-[#1a1a1a]">
                  <span>סקירה שנוצרה בעזרת בינה מלאכותית</span>
                  <i className="ri-sparkling-2-fill text-[#3ab4f2]"></i>
                </div>
                <RichField value={product.aiReview} />
              </div>
            )}

            {activeTab === "package" &&
              (product.packageContentsHtml ? (
                <RichField value={product.packageContentsHtml} />
              ) : (
                product.packageContents && (
                  <ul className="list-none space-y-3">
                    {product.packageContents.map((item) => (
                      <li key={item} className="flex items-center gap-3 justify-end text-sm text-[#5a4e42]">
                        <span>{item}</span>
                        <i className="ri-inbox-unarchive-line text-[#1a1a1a] flex-shrink-0"></i>
                      </li>
                    ))}
                  </ul>
                )
              ))}

            {activeTab === "3d" && product && (
              <div className="max-w-3xl mr-auto">
                <ModelViewer3D
                  productName={product.name}
                  productSku={product.sku}
                  modelUrl={product.model3dUrl}
                  modelUsdzUrl={product.model3dUsdzUrl}
                />
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
