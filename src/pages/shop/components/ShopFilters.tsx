import { colorFilters, ProductColor, ProductType } from "../../../mocks/products";
import { SortOption, SORT_OPTIONS } from "@/lib/sort";

interface ShopFiltersProps {
  selectedColors: ProductColor[];
  selectedType: ProductType | '';
  onColorToggle: (color: ProductColor) => void;
  onTypeChange: (type: ProductType | '') => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function ShopFilters({
  selectedColors,
  selectedType,
  onColorToggle,
  onTypeChange,
  sort,
  onSortChange,
}: ShopFiltersProps) {
  return (
    <div className="flex flex-col items-end gap-5 py-6 border-b border-[#ede9e1] mb-2">
      <div className="flex items-center justify-between w-full">
        {/* Color filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {colorFilters.map((cf) => {
            const active = selectedColors.includes(cf.value);
            return (
              // Real checkbox semantics (role/aria-checked) plus a visible
              // checkmark badge when selected — these are multi-select
              // filter toggles, not just decorative swatches, so it needs
              // to actually look/behave like a checkbox rather than only
              // a subtle ring difference.
              <button
                key={cf.value}
                onClick={() => onColorToggle(cf.value)}
                title={cf.label}
                role="checkbox"
                aria-checked={active}
                aria-label={cf.label}
                className={`relative w-12 h-12 rounded-full overflow-hidden transition-all duration-200 cursor-pointer ${
                  active
                    ? "ring-2 ring-[#1a1a1a] ring-offset-2 scale-110"
                    : "ring-1 ring-[#ddd] hover:ring-[#1a1a1a] hover:scale-105"
                }`}
                style={{ background: cf.swatch }}
              >
                {active && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="w-5 h-5 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                      <i className="ri-check-line text-white text-xs"></i>
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Type filter + sort — item 16 adds standard WooCommerce sorting */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none border border-[#ddd] bg-white px-5 py-2.5 pl-8 text-sm text-right cursor-pointer outline-none focus:border-[#1a1a1a] transition-colors text-[#444]"
              dir="rtl"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#aaa] text-sm"></i>
          </div>
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value as ProductType | "")}
              className="appearance-none border border-[#ddd] bg-white px-5 py-2.5 pl-8 text-sm text-right cursor-pointer outline-none focus:border-[#1a1a1a] transition-colors text-[#444]"
              dir="rtl"
            >
              <option value="">כל הסוגים</option>
              <option value="ניצב">ברז ניצב</option>
              <option value="נשלף">ברז נשלף</option>
            </select>
            <i className="ri-arrow-down-s-line absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#aaa] text-sm"></i>
          </div>
          <span className="text-xs text-[#aaa] tracking-wider hidden sm:inline">סינון:</span>
        </div>
      </div>
    </div>
  );
}
