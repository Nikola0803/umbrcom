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
