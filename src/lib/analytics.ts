/**
 * GA4 e-commerce tracking (gtag.js, measurement ID G-6N67TXSK2S — loaded in
 * index.html). Pure Google Analytics, no third-party ad pixels.
 *
 * Events wired across the site:
 *  - view_item        → product page load
 *  - add_to_cart      → CartContext.addItem
 *  - remove_from_cart → CartContext.removeItem
 *  - begin_checkout   → checkout "place order" click (before the Pelecard redirect)
 *  - purchase         → /checkout/result once the backend confirms the payment
 *
 * The cart lives in React state, which does not survive the round-trip to
 * Pelecard's hosted payment page — so begin_checkout also snapshots the cart
 * items into sessionStorage, and the purchase event reads them back.
 */

import type { CartItem } from "@/context/CartContext";
import type { Product } from "@/mocks/products";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CURRENCY = "ILS";
const SNAPSHOT_KEY = "umbrcom_checkout_items";
const PURCHASE_SENT_KEY = "umbrcom_purchase_sent";

export interface GaItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}

function gaEvent(name: string, params: Record<string, unknown>) {
  try {
    window.gtag?.("event", name, params);
  } catch {
    /* analytics must never break the shop */
  }
}

function toGaItem(product: Product, qty: number): GaItem {
  return {
    item_id: product.sku || String(product.id),
    item_name: product.name,
    price: product.price,
    quantity: qty,
  };
}

export function trackViewItem(product: Product) {
  gaEvent("view_item", {
    currency: CURRENCY,
    value: product.price,
    items: [toGaItem(product, 1)],
  });
}

export function trackAddToCart(product: Product, qty: number) {
  gaEvent("add_to_cart", {
    currency: CURRENCY,
    value: product.price * qty,
    items: [toGaItem(product, qty)],
  });
}

export function trackRemoveFromCart(product: Product, qty: number) {
  gaEvent("remove_from_cart", {
    currency: CURRENCY,
    value: product.price * qty,
    items: [toGaItem(product, qty)],
  });
}

/** Fired on "place order"; also snapshots the cart for the purchase event. */
export function trackBeginCheckout(items: CartItem[], total: number) {
  const gaItems = items.map(({ product, qty }) => toGaItem(product, qty));
  gaEvent("begin_checkout", { currency: CURRENCY, value: total, items: gaItems });
  try {
    sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify(gaItems));
  } catch {
    /* private mode etc. — purchase will simply fire without items */
  }
}

/** Fired on the result page once the backend confirms payment.
 *  Deduped per order so refreshes don't double-count revenue. */
export function trackPurchase(order: { order_number: string; total: number }) {
  try {
    if (sessionStorage.getItem(PURCHASE_SENT_KEY) === order.order_number) return;
  } catch {
    /* ignore */
  }

  let items: GaItem[] = [];
  try {
    items = JSON.parse(sessionStorage.getItem(SNAPSHOT_KEY) ?? "[]");
  } catch {
    items = [];
  }

  gaEvent("purchase", {
    transaction_id: order.order_number,
    currency: CURRENCY,
    value: order.total,
    items,
  });

  try {
    sessionStorage.setItem(PURCHASE_SENT_KEY, order.order_number);
    sessionStorage.removeItem(SNAPSHOT_KEY);
  } catch {
    /* ignore */
  }
}
