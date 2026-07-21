import { Link } from "react-router-dom";
import { Product } from "../../../mocks/products";
import { useLiveProducts } from "@/hooks/useLiveProducts";
import ProductCard from "../../shop/components/ProductCard";

// Featured picks are pinned by SKU, not ID — product IDs changed in the
// July 2026 move to admin.umbrcom.co.il (old 683/701/730/748 → new 77/138/
// 184/206) and would change again on any future re-import. SKUs are stable.
const FEATURED_SKUS = ["5508-003", "5503-001", "5506-005", "5509-001"];

export interface FeaturedProductsProps {
  eyebrow?: string;
  heading?: string;
  viewAllLink?: string;
  products?: Product[];
}

export default function FeaturedProducts({
  eyebrow = "מובחרים",
  heading = "מוצרים מומלצים",
  viewAllLink = "/shop",
  products,
}: FeaturedProductsProps) {
  // Live featured picks: the four configured IDs when they exist in the
  // live catalog, otherwise newest/first four — mocks only if WP is down.
  const { products: catalog, loading } = useLiveProducts();
  const shown =
    products ??
    (() => {
      const bySku = FEATURED_SKUS
        .map((sku) => catalog.find((p) => p.sku === sku))
        .filter((p): p is Product => Boolean(p));
      return bySku.length > 0 ? bySku : catalog.slice(0, 4);
    })();
  return (
    <section className="w-full bg-white py-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-8 flex items-end justify-between mb-8">
        <div className="text-right">
          <p className="text-[10px] font-medium tracking-[0.35em] text-[#1a1a1a] uppercase mb-2">
            {eyebrow}
          </p>
          <h2 className="font-serif text-3xl font-light text-[#0d0d0d]">
            {heading}
          </h2>
        </div>
        <Link
          to={viewAllLink}
          className="hidden md:inline-flex items-center gap-2 text-xs font-medium text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:text-[#555] hover:border-[#555] transition-colors cursor-pointer whitespace-nowrap"
        >
          לכל המוצרים
          <i className="ri-arrow-left-line text-xs"></i>
        </Link>
      </div>

      {/* Grid — skeleton while the live catalog loads so we never render
          clickable mock cards whose old-install IDs 404 on the live API */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Item 3 fix: this grid was a hard-coded 4 columns with no mobile
            breakpoint, which squeezed each mobile card down to ~80px wide —
            small enough that the Sale badge (sized for a full card) visually
            covered the middle of the product photo. 2 columns on mobile. */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {!products && loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-[#f0f0f0] aspect-square mb-3" />
                  <div className="bg-[#f0f0f0] h-3 w-3/4 mb-2 mr-auto" />
                  <div className="bg-[#f0f0f0] h-3 w-1/3 mr-auto" />
                </div>
              ))
            : shown.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="text-right mt-8 md:hidden">
        <Link
          to={viewAllLink}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0d0d0d] border border-[#0d0d0d] px-8 py-3 cursor-pointer whitespace-nowrap"
        >
          לכל המוצרים
          <i className="ri-arrow-left-line text-sm"></i>
        </Link>
      </div>
    </section>
  );
}
