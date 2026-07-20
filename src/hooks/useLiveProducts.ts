import { useEffect, useState } from "react";
import { allProducts, type Product } from "@/mocks/products";
import { fetchProducts, isWpConfigured } from "@/lib/wp-api";

/**
 * Live catalog hook — WHY IT EXISTS (July 2026): the shop grid, home
 * featured section and compare page all rendered `allProducts` from
 * src/mocks/products.ts and never touched the API. That was invisible
 * while WordPress lived on umbrcom.co.il — but after the move to
 * admin.umbrcom.co.il, every mock image URL
 * (umbrcom.co.il/wp-content/uploads/…) started resolving to the SPA's
 * index.html, so the whole catalog looked broken.
 *
 * This hook fetches the real 65 products from the Woo Store API (correct
 * image URLs included) and only falls back to mocks when WP is not
 * configured or the request fails. Fetched once, cached at module level,
 * shared by every consumer.
 */

let cache: Product[] | null = null;
let inflight: Promise<Product[] | null> | null = null;

async function load(): Promise<Product[] | null> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetchProducts({ perPage: 100 }).then((live) => {
      if (live && live.length > 0) cache = live as Product[];
      inflight = null;
      return cache;
    });
  }
  return inflight;
}

export function useLiveProducts(): { products: Product[]; loading: boolean; isLive: boolean } {
  const [live, setLive] = useState<Product[] | null>(cache);

  useEffect(() => {
    if (cache || !isWpConfigured()) return;
    let mounted = true;
    load().then((p) => {
      if (mounted && p) setLive(p);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return {
    products: live ?? allProducts,
    loading: !live && isWpConfigured(),
    isLive: Boolean(live),
  };
}
