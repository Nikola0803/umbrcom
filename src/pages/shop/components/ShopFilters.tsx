import { colorFilters, ProductColor, ProductType } from "../../../mocks/products";

interface ShopFiltersProps {
  selectedColors: ProductColor[];
  selectedType: ProductType | '';
  onColorToggle: (color: ProductColor) => void;
  onTypeChange: (type: ProductType | '') => void;
}

export default function ShopFilters({
  selectedColors,
  selectedType,
  onColorToggle,
  onTypeChange,
}: ShopFiltersProps) {
  return (
    <div className="flex flex-col items-end gap-5 py-6 border-b border-[#ede9e1] mb-2">
      <div className="flex items-center justify-between w-full">
        {/* Color filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {colorFilters.map((cf) => {
            const active = selectedColors.includes(cf.value);
            return (
              <button
                key={cf.value}
                onClick={() => onColorToggle(cf.value)}
                title={cf.label}
                className={`relative w-12 h-12 rounded-full overflow-hidden transition-all duration-200 cursor-pointer ${
                  active
                    ? "ring-2 ring-[#1a1a1a] ring-offset-2 scale-110"
                    : "ring-1 ring-[#ddd] hover:ring-[#1a1a1a] hover:scale-105"
                }`}
              >
                <img
                  src={cf.image}
                  alt={cf.label}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>

        {/* Type filter + label */}
        <div className="flex items-center gap-3">
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
          <span className="text-xs text-[#aaa] tracking-wider">סינון:</span>
        </div>
      </div>
    </div>
  );
}
