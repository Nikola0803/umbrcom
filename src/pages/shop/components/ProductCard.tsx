import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../../../mocks/products";
import { useCart } from "@/context/CartContext";

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

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();

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

  return (
    <Link
      to={`/product/${product.id}`}
      className="group cursor-pointer flex flex-col bg-white border border-[#eaeaea] hover:border-[#c8c4be] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
    >
      {/* Image area */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#f7f5f2]">
        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label="מועדפים"
          className="absolute top-3 left-3 z-10 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 cursor-pointer"
        >
          <i className={`${wishlisted ? "ri-heart-fill text-red-400" : "ri-heart-line text-[#aaa]"} text-sm`} />
        </button>

        {/* Discount badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[9px] font-bold tracking-wider bg-[#1a1a1a] text-white px-2 py-0.5 rounded-full">
            -17%
          </span>
        </div>

        {/* Product image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-7 transition-transform duration-500 group-hover:scale-[1.05]"
        />

        {/* Add to cart — slides up on hover */}
        <div
          className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
        >
          <button
            onClick={handleAdd}
            className={`w-full py-3 text-xs font-semibold tracking-[0.15em] transition-colors duration-200 cursor-pointer ${
              added
                ? "bg-[#2d7a3a] text-white"
                : "bg-[#1a1a1a] text-white hover:bg-[#333]"
            }`}
          >
            {added ? "✓ נוסף לסל" : "+ הוספה לסל"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-3.5 pb-4 flex flex-col gap-1 text-right">
        {/* Brand */}
        <p className="text-[9px] font-semibold tracking-[0.35em] text-[#aaa] uppercase">
          Waterfall
        </p>

        {/* Name */}
        <h3 className="text-sm font-medium text-[#1a1410] leading-snug line-clamp-2 group-hover:text-black transition-colors">
          {product.name}
        </h3>

        {/* Color swatch + price row */}
        <div className="flex items-center justify-between mt-1.5">
          {/* Color square */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded-sm border border-black/10 flex-shrink-0"
              style={{ backgroundColor: COLOR_DOT[product.color] ?? "#999" }}
              title={product.color}
            />
            <span className="text-[9px] text-[#b0a89a] font-medium">{product.color}</span>
          </div>

          {/* Price */}
          <div className="flex flex-col items-end">
            <span className="text-base font-bold text-[#1a1410] leading-none">
              ₪{product.price.toLocaleString("he-IL")}
            </span>
            <span className="text-[10px] text-[#ccc] line-through leading-none mt-0.5">
              ₪{originalPrice.toLocaleString("he-IL")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
