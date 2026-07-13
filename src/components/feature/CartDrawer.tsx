import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalCount, totalPrice } = useCart();
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <div
        dir="rtl"
        className={`fixed top-0 left-0 h-full w-full sm:w-[420px] z-[70] bg-white flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#ede9e1]">
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#faf8f5] transition-colors cursor-pointer text-[#6a5e52]"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-light text-[#1a1410]">סל הקניות</h2>
            {totalCount > 0 && (
              <span className="w-5 h-5 bg-[#1a1a1a] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {totalCount}
              </span>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#faf8f5]">
                <i className="ri-shopping-bag-line text-2xl text-[#1a1a1a]"></i>
              </div>
              <p className="text-sm text-[#9a8a7a]">הסל שלך ריק</p>
              <button
                onClick={closeCart}
                className="text-xs font-semibold tracking-widest text-[#1a1a1a] border border-[#1a1a1a] rounded-full px-6 py-2.5 hover:bg-[#1a1a1a] hover:text-white transition-all cursor-pointer whitespace-nowrap"
              >
                המשך לקנות
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, qty }) => (
                <li
                  key={product.id}
                  className="flex gap-4 items-start bg-[#faf8f5] rounded-2xl p-4"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${product.id}`}
                    onClick={closeCart}
                    className="w-20 h-20 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-[#ede9e1] flex items-center justify-center cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${product.id}`}
                      onClick={closeCart}
                      className="text-sm font-medium text-[#1a1410] leading-snug line-clamp-2 hover:text-[#1a1a1a] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </Link>
                    <p className="text-[11px] text-[#9a8a7a] mt-0.5">{product.color}</p>

                    {/* Qty + price row */}
                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center gap-0 border border-[#ede9e1] rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQty(product.id, qty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#6a5e52] hover:bg-[#faf8f5] transition-colors cursor-pointer text-sm"
                        >
                          <i className="ri-subtract-line"></i>
                        </button>
                        <span className="w-8 h-7 flex items-center justify-center text-xs font-medium text-[#1a1410] border-x border-[#ede9e1]">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQty(product.id, qty + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#6a5e52] hover:bg-[#faf8f5] transition-colors cursor-pointer text-sm"
                        >
                          <i className="ri-add-line"></i>
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-sm font-semibold text-[#1a1410]">
                        ₪{(product.price * qty).toLocaleString("he-IL")}
                      </p>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="w-6 h-6 flex items-center justify-center text-[#bbb] hover:text-[#e05252] transition-colors cursor-pointer flex-shrink-0 mt-0.5"
                  >
                    <i className="ri-delete-bin-line text-sm"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only when items exist */}
        {items.length > 0 && (
          <div className="border-t border-[#ede9e1] px-6 py-5 space-y-4 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-[#1a1410]">
                ₪{totalPrice.toLocaleString("he-IL")}
              </span>
              <span className="text-sm text-[#6a5e52]">סה״כ לפני משלוח</span>
            </div>

            {/* Free shipping nudge */}
            {totalPrice < 200 && (
              <div className="bg-[#faf8f5] rounded-xl px-4 py-2.5 text-right">
                <p className="text-xs text-[#9a8a7a]">
                  הוסף עוד{" "}
                  <span className="font-semibold text-[#1a1a1a]">
                    ₪{(200 - totalPrice).toLocaleString("he-IL")}
                  </span>{" "}
                  לקבלת משלוח חינם
                </p>
                <div className="mt-1.5 h-1.5 bg-[#ede9e1] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1a1a1a] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totalPrice / 200) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {totalPrice >= 200 && (
              <div className="bg-[#f0faf2] rounded-xl px-4 py-2.5 text-right">
                <p className="text-xs text-[#2d7a3a] font-medium flex items-center justify-end gap-1.5">
                  <i className="ri-truck-line"></i>
                  כל הכבוד! מגיע לך משלוח חינם
                </p>
              </div>
            )}

            {/* Checkout button */}
            <button
              onClick={() => { closeCart(); navigate("/checkout"); }}
              className="w-full py-4 bg-[#1a1410] text-white text-sm font-semibold tracking-widest rounded-xl hover:bg-[#1a1a1a] transition-colors cursor-pointer whitespace-nowrap"
            >
              מעבר לתשלום ←
            </button>
            <button
              onClick={closeCart}
              className="w-full py-3 text-sm text-[#6a5e52] hover:text-[#1a1410] transition-colors cursor-pointer whitespace-nowrap"
            >
              המשך לקנות
            </button>
          </div>
        )}
      </div>
    </>
  );
}
