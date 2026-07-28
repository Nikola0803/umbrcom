/**
 * Canonical product URL — real WooCommerce products get a readable
 * slug-based path (`/product/<slug>`) instead of an opaque numeric ID
 * (`/product/42`), which is both nicer for people and better for SEO.
 * Falls back to the numeric `id` for mock-catalog products (no real slug)
 * and as a defensive guard if a live product is ever missing one.
 */
export function productPath(product: { id: string; slug?: string }): string {
  return `/product/${product.slug || product.id}`;
}
