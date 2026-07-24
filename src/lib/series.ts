/**
 * Item 5 (July 2026): "display finish/color swatches based only on the
 * available products within the same faucet series."
 *
 * There's no dedicated "series" taxonomy wired from WordPress yet (that's a
 * wp-admin/plugin job — see CHANGES.md). Until then, the SKU itself already
 * encodes the series: everything before the last "-XXX" segment is the
 * series code, and only the finish/color changes across a series
 * (e.g. 5509-001 / 5509-002 / 5509-003 = same faucet, different finishes).
 *
 * This is a real, reliable grouping today — swap the implementation for a
 * `product.seriesId` lookup once the plugin exposes one, no call-site
 * changes needed.
 */
export function seriesCodeOf(sku: string | undefined | null): string {
  if (!sku) return "";
  const i = sku.lastIndexOf("-");
  return i > 0 ? sku.slice(0, i) : sku;
}

/**
 * Finish/color swatches were showing the same silver-ish "כרום" (chrome)
 * dot on every single product, because `attributes` comes back as `[]` for
 * every product in the live WooCommerce catalog right now — no color/גימור
 * attribute has ever been configured in wp-admin, so `findAttributeTerm`
 * in wp-api.ts always falls through to its "כרום" default regardless of
 * the product's real finish.
 *
 * The real finish is not lost, though — it's spelled out in the product
 * title itself (e.g. "ערכת פינוק כרום מסדרת Angel" vs "...שחור..." for the
 * same 7704 series). This scans the title for those same finish words as a
 * fallback. Once someone configures a real color/גימור attribute in
 * wp-admin, findAttributeTerm (wp-api.ts) takes over automatically and this
 * fallback simply stops being used — no call-site changes needed then.
 */
const NAME_COLOR_KEYWORDS: [string, string][] = [
  ["זהב מוברש", "זהב מוברש"],
  ["ניקל מוברש", "ניקל מוברש"],
  ["רוז גולד", "רוז גולד"],
  ["שחור מט", "שחור"],
  ["שחור", "שחור"],
  ["זהב", "זהב"],
  ["כרום", "כרום"],
];

export function colorFromName(name: string | undefined | null): string | undefined {
  if (!name) return undefined;
  for (const [keyword, color] of NAME_COLOR_KEYWORDS) {
    if (name.includes(keyword)) return color;
  }
  return undefined;
}
