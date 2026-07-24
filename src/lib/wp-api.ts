/**
 * Headless WordPress + WooCommerce API client.
 *
 * Reads from:
 *  - WP REST API (`/wp/v2/...`)                 → Pages (Page Builder), Series, Posts
 *  - Custom endpoints (`/umbrcom/v1/...`)        → Site Settings, Nav (categories + series)
 *  - WooCommerce Store API (`/wc/store/v1/...`)  → Products (public, no API keys needed)
 *
 * Set VITE_WP_API_URL in `.env` to enable it, e.g.:
 *    VITE_WP_API_URL=https://umbrcom.co.il/wp-json
 *
 * If it's unset (or a request fails), every function below returns `null`
 * so calling code can fall back to the local mocks — this keeps local
 * frontend development working even before/without a WordPress backend.
 */

import type { Product, ProductCategory, ProductColor, ProductType } from "@/mocks/products";
import type { BlogPost } from "@/pages/blog/components/BlogCard";
import { colorFromName } from "@/lib/series";

const BASE = import.meta.env.VITE_WP_API_URL as string | undefined;

export function isWpConfigured(): boolean {
  return Boolean(BASE);
}

async function getJSON<T>(path: string): Promise<T | null> {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}${path}`, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      console.warn(`[wp-api] ${path} → HTTP ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[wp-api] ${path} failed`, err);
    return null;
  }
}

async function postJSON<T>(path: string, body: unknown): Promise<T | { error: string } | null> {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      console.warn(`[wp-api] POST ${path} → HTTP ${res.status}`, data);
      return { error: (data as { message?: string } | null)?.message ?? "שגיאה בביצוע הפעולה. נסו שוב." };
    }
    return data as T;
  } catch (err) {
    console.warn(`[wp-api] POST ${path} failed`, err);
    return { error: "שגיאת תקשורת. בדקו את החיבור ונסו שוב." };
  }
}

/* ────────────────────────────────────────────────────────────────────────
 * Site Settings  —  GET /umbrcom/v1/settings
 * ──────────────────────────────────────────────────────────────────────── */

export interface WpSettings {
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    social: { platform: string; url: string }[];
  };
  brand: {
    waterfall_logo: string;
    waterfall_color: string;
    ambercom_color: string;
    waterfall_hero_video: string;
    ambercom_hero_video: string;
  };
  header: {
    nav_links: { label: string; url: string; icon: string }[];
  };
  tiktok: {
    waterfall: { handle: string; videos: { id: string; caption: string }[] };
    ambercom: { handle: string; videos: { id: string; caption: string }[] };
  };
  footer: {
    about_text: string;
    columns: { title: string; links: { label: string; url: string }[] }[];
  };
}

export function fetchSettings() {
  return getJSON<WpSettings>("/umbrcom/v1/settings");
}

/* ────────────────────────────────────────────────────────────────────────
 * Nav  —  GET /umbrcom/v1/nav  (live categories + series)
 * ──────────────────────────────────────────────────────────────────────── */

export interface WpNavCategory {
  id: number;
  label: string;
  slug: string;
  link: string;
  image: string;
  count: number;
}

export interface WpSeries {
  id: number;
  name: string;
  name_he: string;
  tagline: string;
  description: string;
  image: string;
  color: string;
  path: string;
  is_featured: boolean;
  products: number;
}

export function fetchNav() {
  return getJSON<{ categories: WpNavCategory[]; series: WpSeries[] }>("/umbrcom/v1/nav");
}

/* ────────────────────────────────────────────────────────────────────────
 * Page Builder  —  GET /wp/v2/pages?slug=...
 * ──────────────────────────────────────────────────────────────────────── */

export interface PageSection {
  type: string;
  [key: string]: unknown;
}

interface WpPageRaw {
  id: number;
  slug: string;
  title: { rendered: string };
  umbrcom_sections?: PageSection[];
}

export async function fetchPageSections(slug: string): Promise<{ title: string; sections: PageSection[] } | null> {
  const pages = await getJSON<WpPageRaw[]>(`/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=id,slug,title,umbrcom_sections`);
  if (!pages || pages.length === 0) return null;
  const page = pages[0];
  return {
    title: page.title?.rendered ?? "",
    sections: page.umbrcom_sections ?? [],
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * Products  —  GET /wc/store/v1/products  (public Store API, no keys)
 * ──────────────────────────────────────────────────────────────────────── */

interface StoreApiImage {
  src: string;
}
interface StoreApiAttribute {
  name: string;
  taxonomy?: string;
  terms: { name: string; slug: string }[];
}
interface StoreApiCategory {
  id: number;
  slug: string;
  name: string;
}
interface StoreApiProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  permalink: string;
  prices: { price: string; currency_minor_unit: number; sale_price?: string; regular_price?: string };
  images: StoreApiImage[];
  categories: StoreApiCategory[];
  attributes: StoreApiAttribute[];
  variations?: { id: number; attributes: { attribute: string; value: string }[] }[];
  is_in_stock: boolean;
  on_sale: boolean;
  average_rating?: string;
  review_count?: number;
  /** Real WooCommerce content (imported from the old site) */
  description?: string;
  short_description?: string;
  /** Store API places extension data here — the plugin's block is
   *  `extensions.umbrcom`. A top-level `umbrcom` is kept for
   *  backwards-compatibility with older plugin builds. */
  extensions?: { umbrcom?: StoreApiProduct["umbrcom"] };
  umbrcom?: {
    brand_label: string;
    feature_cards: { icon: string; title: string; sub: string }[];
    short_description: string;
    description_paragraphs: { text: string }[];
    features: { text: string }[];
    spec_table: { label: string; value: string }[];
    shipping_info: { icon: string; title: string; text: string }[];
    youtube_url: string;
    ai_review: string;
    tech_specs_html: string;
    package_contents: string;
    warranty: string;
    model_3d_url: string;
    model_usdz_url: string;
    ar_enabled: boolean;
    badge_text_override: string;
    is_new: boolean;
    related_accessory_ids: number[];
  };
}

const CATEGORY_SLUG_MAP: Record<string, ProductCategory> = {
  kitchen: "kitchen",
  "kitchen-faucets": "kitchen",
  bathroom: "bathroom",
  "bathroom-faucets": "bathroom",
  "cold-water": "cold-water",
};

function minorUnitToNumber(price: string, minorUnit: number): number {
  const n = parseInt(price, 10);
  if (Number.isNaN(n)) return 0;
  return n / Math.pow(10, minorUnit);
}

/** Looks up a WooCommerce attribute by any of several likely slugs/names,
 *  since the exact attribute name depends on how it was set up in wp-admin
 *  (global "pa_color" vs. a local per-product "Color" attribute). */
function findAttributeTerm(attrs: StoreApiAttribute[], candidates: string[]): string | undefined {
  for (const attr of attrs) {
    const key = (attr.taxonomy || attr.name || "").toLowerCase();
    if (candidates.some((c) => key.includes(c))) {
      return attr.terms?.[0]?.name;
    }
  }
  return undefined;
}

/** Maps a WooCommerce Store API product onto this app's existing `Product`
 *  shape, so ProductCard / CartContext / the product page keep working
 *  unchanged whether data comes from mocks or from WordPress. */
export function mapStoreApiProduct(p: StoreApiProduct): Product & {
  slug: string;
  images: string[];
  regularPrice?: number;
  salePrice?: number;
  discountPercent?: number;
  averageRating: number;
  reviewCount: number;
  brandLabel: string;
  featureCards: { icon: string; title: string; sub: string }[];
  shortDescription: string;
  /** Raw WooCommerce long-description HTML (RTL Hebrew, imported content) */
  descriptionHtml?: string;
  descriptionParagraphs: string[];
  features: string[];
  specTable: { label: string; value: string }[];
  shippingInfo: { icon: string; title: string; text: string }[];
  youtubeUrl?: string;
  aiReview?: string;
  techSpecsHtml?: string;
  packageContents: string[];
  /** Raw HTML version — set when the field was written in the WYSIWYG editor */
  packageContentsHtml?: string;
  warranty?: string;
  model3dUrl?: string;
  model3dUsdzUrl?: string;
  arEnabled: boolean;
  badgeText?: string;
  isNew: boolean;
  relatedAccessoryIds: number[];
} {
  const categorySlug = p.categories?.[0]?.slug;
  const category: ProductCategory = CATEGORY_SLUG_MAP[categorySlug ?? ""] ?? "kitchen";

  // BUGFIX: the Store API returns the plugin's block under `extensions.umbrcom`,
  // not at the top level — without this, none of the custom fields
  // (YouTube video, AI review, tech specs, package contents, warranty…)
  // ever reached the product page.
  const u = p.extensions?.umbrcom ?? p.umbrcom;

  const stripTags = (html: string) =>
    html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();

  // The live catalog's `attributes` array is empty on every product today
  // (no color/גימור attribute has been configured in wp-admin yet), so
  // findAttributeTerm always misses — fall back to reading the finish out
  // of the product title before giving up and defaulting to "כרום"; see
  // colorFromName in lib/series.ts for why that's a reliable signal today.
  const color = (findAttributeTerm(p.attributes, ["color", "צבע", "גימור"]) ??
    colorFromName(p.name) ??
    "כרום") as ProductColor;
  const type = (findAttributeTerm(p.attributes, ["type", "סוג"]) ?? "נשלף") as ProductType;

  const minorUnit = p.prices.currency_minor_unit;
  const regularPrice = p.prices.regular_price ? minorUnitToNumber(p.prices.regular_price, minorUnit) : undefined;
  const salePrice = p.prices.sale_price ? minorUnitToNumber(p.prices.sale_price, minorUnit) : undefined;
  const discountPercent =
    regularPrice && salePrice && regularPrice > salePrice
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : undefined;

  return {
    id: String(p.id),
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    price: minorUnitToNumber(p.prices.price, minorUnit),
    regularPrice,
    salePrice,
    discountPercent,
    averageRating: p.average_rating ? parseFloat(p.average_rating) : 0,
    reviewCount: p.review_count ?? 0,
    image: p.images?.[0]?.src ?? "",
    images: (p.images ?? []).map((img) => img.src),
    category,
    color,
    type,
    brandLabel: u?.brand_label || "Waterfall",
    featureCards: u?.feature_cards ?? [],
    shortDescription: u?.short_description || (p.short_description ? stripTags(p.short_description) : ""),
    descriptionHtml: p.description || undefined,
    descriptionParagraphs: (u?.description_paragraphs ?? []).map((r) => r.text),
    features: (u?.features ?? []).map((r) => r.text),
    specTable: u?.spec_table ?? [],
    shippingInfo: u?.shipping_info ?? [],
    youtubeUrl: u?.youtube_url || undefined,
    aiReview: u?.ai_review || undefined,
    techSpecsHtml: u?.tech_specs_html || undefined,
    packageContentsHtml: /<[a-z][\s\S]*>/i.test(u?.package_contents ?? "") ? u?.package_contents : undefined,
    packageContents: (u?.package_contents ?? "")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean),
    warranty: u?.warranty || undefined,
    model3dUrl: u?.model_3d_url || undefined,
    model3dUsdzUrl: u?.model_usdz_url || undefined,
    arEnabled: u?.ar_enabled ?? false,
    badgeText: u?.badge_text_override || (p.on_sale ? "מבצע" : undefined),
    isNew: u?.is_new ?? false,
    relatedAccessoryIds: u?.related_accessory_ids ?? [],
  };
}

export async function fetchProducts(params: { category?: string; perPage?: number } = {}) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  qs.set("per_page", String(params.perPage ?? 40));

  const raw = await getJSON<StoreApiProduct[]>(`/wc/store/v1/products?${qs.toString()}`);
  if (!raw) return null;
  return raw.map(mapStoreApiProduct);
}

export async function fetchProductById(id: string | number) {
  const raw = await getJSON<StoreApiProduct>(`/wc/store/v1/products/${id}`);
  if (!raw) return null;
  return mapStoreApiProduct(raw);
}

/**
 * SKU lookup — rescue path for pre-migration product IDs (July 2026):
 * the old WP install's numeric IDs (683/701/730/748…) died in the move to
 * admin.umbrcom.co.il, but every SKU survived. Old bookmarked / indexed
 * /product/:id URLs resolve through here instead of 404ing.
 */
export async function fetchProductBySku(sku: string) {
  const raw = await getJSON<StoreApiProduct[]>(`/wc/store/v1/products?sku=${encodeURIComponent(sku)}`);
  if (!raw || raw.length === 0) return null;
  return mapStoreApiProduct(raw[0]);
}

export async function fetchProductBySlug(slug: string) {
  const raw = await getJSON<StoreApiProduct[]>(`/wc/store/v1/products?slug=${encodeURIComponent(slug)}`);
  if (!raw || raw.length === 0) return null;
  return mapStoreApiProduct(raw[0]);
}

/* ────────────────────────────────────────────────────────────────────────
 * Blog  —  GET /wp/v2/posts
 * ──────────────────────────────────────────────────────────────────────── */

interface WpPostRaw {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string }[];
    "wp:term"?: { name: string }[][];
    author?: { name: string }[];
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function mapWpPost(p: WpPostRaw): BlogPost {
  const category = p._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "מאמרים";
  const cover = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";
  const author = p._embedded?.author?.[0]?.name ?? "UMBRCOM";
  const words = stripHtml(p.excerpt.rendered).split(/\s+/).length;

  return {
    id: String(p.id),
    slug: p.slug,
    title: stripHtml(p.title.rendered),
    excerpt: stripHtml(p.excerpt.rendered),
    coverImage: cover,
    category,
    author,
    date: new Date(p.date).toLocaleDateString("he-IL"),
    readingTime: `${Math.max(1, Math.round(words / 40))} דק' קריאה`,
  };
}

export async function fetchPosts(perPage = 20) {
  const raw = await getJSON<WpPostRaw[]>(`/wp/v2/posts?per_page=${perPage}&_embed=wp:featuredmedia,wp:term,author`);
  if (!raw) return null;
  return raw.map(mapWpPost);
}

/* ────────────────────────────────────────────────────────────────────────
 * Pelecard checkout  —  /umbrcom/v1/checkout + /umbrcom/v1/pelecard/*
 * ──────────────────────────────────────────────────────────────────────── */

export interface CheckoutPayload {
  items: { id: number; quantity: number }[];
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    notes?: string;
    // Item 24 — optional business invoice fields.
    invoice_name?: string;
    company_reg_number?: string;
    // Item 25 — required once the order total passes ₪5,000. Sending it
    // through today so the field is ready the moment wp-admin/the plugin
    // is updated to store it on the order (see CHANGES.md).
    israeli_id?: string;
  };
  // Item 28 — "standard"/"express" tiers were removed; "delivery" replaces
  // "standard" (free above the threshold), "pickup" is new (item 28/29).
  shipping_method: "delivery" | "pickup";
}

export interface CheckoutSession {
  order_id: number;
  order_key: string;
  redirect_url: string;
  total: number;
}

export interface OrderResult {
  status: "paid" | "failed" | "pending" | "invalid";
  order_id: number;
  order_number: string;
  total: number;
  email: string;
  first_name: string;
  // Item 13 (July 2026): line items with product images for the redesigned
  // Order Confirmation page. Optional because the current
  // /umbrcom/v1/pelecard/confirm + /order-status responses don't include
  // them yet — see CHANGES.md for what the plugin needs to add. The page
  // renders a graceful fallback (no image grid) until this is populated.
  items?: { name: string; image: string; qty: number; price: number }[];
}

/** Creates the WooCommerce order server-side and returns the Pelecard
 *  hosted payment page URL to redirect the shopper to. */
export async function createPelecardCheckout(payload: CheckoutPayload) {
  return postJSON<CheckoutSession>("/umbrcom/v1/checkout", payload);
}

/** Called from /checkout/result with Pelecard's redirect params — the
 *  backend validates them with Pelecard before marking the order paid. */
export async function confirmPelecardPayment(payload: {
  order_id: string | number;
  order_key: string;
  status_code: string;
  transaction_id: string;
  confirmation_key: string;
  token?: string;
}) {
  return postJSON<OrderResult>("/umbrcom/v1/pelecard/confirm", payload);
}

export async function fetchOrderStatus(orderId: string | number, orderKey: string) {
  return getJSON<OrderResult>(
    `/umbrcom/v1/pelecard/status?order_id=${encodeURIComponent(String(orderId))}&order_key=${encodeURIComponent(orderKey)}`
  );
}
