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
  umbrcom?: {
    brand_label: string;
    feature_cards: { icon: string; title: string; sub: string }[];
    short_description: string;
    description_paragraphs: { text: string }[];
    features: { text: string }[];
    spec_table: { label: string; value: string }[];
    shipping_info: { icon: string; title: string; text: string }[];
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
  descriptionParagraphs: string[];
  features: string[];
  specTable: { label: string; value: string }[];
  shippingInfo: { icon: string; title: string; text: string }[];
  model3dUrl?: string;
  model3dUsdzUrl?: string;
  arEnabled: boolean;
  badgeText?: string;
  isNew: boolean;
  relatedAccessoryIds: number[];
} {
  const categorySlug = p.categories?.[0]?.slug;
  const category: ProductCategory = CATEGORY_SLUG_MAP[categorySlug ?? ""] ?? "kitchen";

  const color = (findAttributeTerm(p.attributes, ["color", "צבע", "גימור"]) ?? "כרום") as ProductColor;
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
    brandLabel: p.umbrcom?.brand_label || "Waterfall",
    featureCards: p.umbrcom?.feature_cards ?? [],
    shortDescription: p.umbrcom?.short_description ?? "",
    descriptionParagraphs: (p.umbrcom?.description_paragraphs ?? []).map((r) => r.text),
    features: (p.umbrcom?.features ?? []).map((r) => r.text),
    specTable: p.umbrcom?.spec_table ?? [],
    shippingInfo: p.umbrcom?.shipping_info ?? [],
    model3dUrl: p.umbrcom?.model_3d_url || undefined,
    model3dUsdzUrl: p.umbrcom?.model_usdz_url || undefined,
    arEnabled: p.umbrcom?.ar_enabled ?? false,
    badgeText: p.umbrcom?.badge_text_override || (p.on_sale ? "מבצע" : undefined),
    isNew: p.umbrcom?.is_new ?? false,
    relatedAccessoryIds: p.umbrcom?.related_accessory_ids ?? [],
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
