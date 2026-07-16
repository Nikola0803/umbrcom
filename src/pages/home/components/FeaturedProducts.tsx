import { Link } from "react-router-dom";
import { Product, allProducts } from "../../../mocks/products";
import ProductCard from "../../shop/components/ProductCard";

const FEATURED_IDS = ["701", "730", "748", "683"];
const DEFAULT_FEATURED = allProducts.filter((p) => FEATURED_IDS.includes(p.id));

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
  products = DEFAULT_FEATURED,
}: FeaturedProductsProps) {
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

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-4 gap-5">
          {products.map((p) => (
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
