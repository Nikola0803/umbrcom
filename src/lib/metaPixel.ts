/**
 * Meta Pixel (Dataset ID 1047516431063735, "umbrcom web") — base code lives
 * in index.html. This module wires up the standard e-commerce events,
 * mirroring the GA4 events in analytics.ts so both fire from the same call
 * sites. All calls are wrapped so a blocked/missing fbq can never break the
 * shop, same convention as GA4.
 */

import type { CartItem } from "@/context/CartContext";
import type { Product } from "@/mocks/products";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const CURRENCY = "ILS";

function fbEvent(name: string, params?: Record<string, unknown>) {
  try {
    window.fbq?.("track", name, params);
  } catch {
    /* analytics must never break the shop */
  }
}

/** Fired on every route change (SPA) — unlike GA4's Enhanced Measurement,
 *  the Meta Pixel has no automatic history-based PageView, so this has to
 *  be called manually. See ScrollToTop.tsx. */
export function trackMetaPageView() {
  try {
    window.fbq?.("track", "PageView");
  } catch {
    /* ignore */
  }
}

export function trackMetaViewContent(product: Product) {
  fbEvent("ViewContent", {
    content_ids: [product.sku || String(product.id)],
    content_type: "product",
    content_name: product.name,
    currency: CURRENCY,
    value: product.price,
  });
}

export function trackMetaAddToCart(product: Product, qty: number) {
  fbEvent("AddToCart", {
    content_ids: [product.sku || String(product.id)],
    content_type: "product",
    content_name: product.name,
    currency: CURRENCY,
    value: product.price * qty,
  });
}

export function trackMetaInitiateCheckout(items: CartItem[], total: number) {
  fbEvent("InitiateCheckout", {
    content_ids: items.map(({ product }) => product.sku || String(product.id)),
    content_type: "product",
    num_items: items.reduce((n, i) => n + i.qty, 0),
    currency: CURRENCY,
    value: total,
  });
}

/** Deduped per order, same as the GA4 purchase event, so a refresh of the
 *  thank-you page can't double-count a conversion. */
const PURCHASE_SENT_KEY = "umbrcom_meta_purchase_sent";
export function trackMetaPurchase(order: { order_number: string; total: number }) {
  try {
    if (sessionStorage.getItem(PURCHASE_SENT_KEY) === order.order_number) return;
  } catch {
    /* ignore */
  }
  fbEvent("Purchase", {
    currency: CURRENCY,
    value: order.total,
  });
  try {
    sessionStorage.setItem(PURCHASE_SENT_KEY, order.order_number);
  } catch {
    /* ignore */
  }
}
