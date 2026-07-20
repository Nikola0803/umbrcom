import { useState } from "react";
import { Link } from "react-router-dom";
import { Product, allProducts } from "../../../mocks/products";
import { useCart } from "@/context/CartContext";
import { useBrand } from "@/hooks/useBrand";

interface ProductCardProps {
  product: Product;
}

const COLOR_DOT: Record<string, string> = {
  "זהב מוברש": "#c9a96e",
  "ניקל מוברש": "#b0b8c1",
  "רוז גולד": "#c9948a",
  "שחור": "#1a1a1a",
  "זהב": "#d4af37",
  "כרום": "#c0c0c0",
};

/**
 * Clean, premium product card (item 3) — minimal & classic:
 * borderless soft-gray image tile, small square finish swatches,
 * quiet typography, quick-add appears on hover in the brand color.
 */
export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();
  const brand = useBrand();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((v) => !v);
  };

  const originalPrice = Math.round(product.price * 1.2);

  // Available finishes for the same faucet family (same category) — shown
  // as small square swatches like the reference design.
  const finishes = Array.from(
    new Set(
      allProducts.filter((p) => p.category === product.category).map((p) => p.color)
    )
  ).slice(0, 4);

  return (
    <Link to={`/product/${product.id}`} className="group cursor-pointer flex flex-col">
      {/* ── Image tile — soft gray, no border ── */}
      {/* Image fills the whole tile edge-to-edge (Nik, July 2026) — no gray
          backdrop, no inner padding: object-cover instead of padded contain. */}
      <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-white">
        {/* Sale tag — quiet text badge, top right */}
        <span className="absolute top-4 right-4 z-10 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#1a1a1a] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
          מבצע
        </span>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label="מועדפים"
          className="absolute top-3.5 left-3.5 z-10 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 cursor-pointer"
        >
          <i className={`${wishlisted ? "ri-heart-fill text-red-400" : "ri-heart-line text-[#aaa]"} text-sm`} />
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Quick add — slides up on hover, brand colored (item 12) */}
        <div className="absolute inset-x-3 bottom-3 translate-y-[130%] group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={handleAdd}
            className="w-full py-3 text-xs font-semibold tracking-[0.15em] rounded-xl text-white shadow-lg transition-colors duration-200 cursor-pointer"
            style={{ backgroundColor: added ? "#2d7a3a" : brand.color }}
          >
            {added ? "✓ נוסף לסל" : "+ הוספה לסל"}
          </button>
        </div>
      </div>

      {/* ── Info — clean and quiet ── */}
      <div className="pt-4 pb-2 flex flex-col gap-2 text-right">
        {/* Finish swatches — small squares */}
        <div className="flex items-center justify-end gap-1.5">
          {finishes.map((f) => (
            <span
              key={f}
              title={f}
              className={`w-3.5 h-3.5 rounded-[3px] flex-shrink-0 ${
                f === product.color ? "ring-1 ring-offset-1 ring-[#1a1a1a]" : "border border-black/10"
              }`}
              style={{ backgroundColor: COLOR_DOT[f] ?? "#999" }}
            />
          ))}
        </div>

        {/* Name */}
        <h3 className="text-sm font-medium text-[#1a1a1a] leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-center justify-end gap-2">
          <span className="text-[12px] text-[#bbb] line-through">
            ₪{originalPrice.toLocaleString("he-IL")}
          </span>
          <span className="text-base font-semibold text-[#1a1a1a]">
            ₪{product.price.toLocaleString("he-IL")}
          </span>
        </div>
      </div>
    </Link>
  );
}
