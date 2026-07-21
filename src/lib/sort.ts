// Item 16 — standard WooCommerce-style sort options for archive/category
// pages. Split into its own module (rather than living inside ShopFilters.tsx)
// so that component file only exports the component, keeping React Fast
// Refresh happy.
export type SortOption = "default" | "price-asc" | "price-desc" | "newest" | "popularity";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "מיון: מומלץ" },
  { value: "price-asc", label: "מחיר: מהנמוך לגבוה" },
  { value: "price-desc", label: "מחיר: מהגבוה לנמוך" },
  { value: "newest", label: "החדשים ביותר" },
  { value: "popularity", label: "הפופולריים ביותר" },
];
