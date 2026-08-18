#!/usr/bin/env node
/**
 * Generates public/sitemap.xml and public/feed.xml before every build
 * (wired as npm's "prebuild" hook — see package.json).
 *
 * - sitemap.xml: every static route + every live category + every live
 *   product, pulled from the same WooCommerce Store API the frontend uses.
 * - feed.xml: Google Merchant Center / Meta Catalog compatible RSS 2.0
 *   product feed (the same <g:...> namespace works for both Google
 *   Shopping and Meta/Instagram Shop — no need for two separate feeds).
 *
 * Both fall back to a minimal sitemap (static routes only) if the WP API
 * is unreachable at build time, so a backend outage never breaks the build.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, "../public");

// The live public-facing frontend domain (not admin.umbrcom.co.il, which is
// the WordPress backend). Override with SITE_URL if this ever changes.
const SITE_URL = process.env.SITE_URL || "https://umbrcom.co.il";
const WP_API_URL = process.env.VITE_WP_API_URL || "https://admin.umbrcom.co.il/wp-json";

// Flat per-item shipping price fed to Google/Meta. The store's actual rule
// (free above 249 ILS) is order-total logic that a per-product feed can't
// express — that threshold must be configured as a "free shipping over
// amount" rule in Merchant Center's own Shipping & returns settings, which
// then overrides this flat rate at checkout once the cart qualifies.
const SHIPPING_FLAT_RATE = 29.5;

// Mirrors src/router/config.tsx — kept in sync manually since this script
// runs outside Vite/TS and can't import the route table directly.
const STATIC_ROUTES = [
  "/", "/shop", "/about", "/contact", "/customer-service", "/blog",
  "/terms", "/privacy", "/returns", "/warranty-activation", "/auth",
  "/business", "/accessibility-statement", "/series", "/wishlist",
  "/compare", "/umbrcom",
];

const CATEGORY_ROUTES = [
  "/shop/kitchen", "/shop/bathroom", "/shop/cold-water", "/shop/shower-sets",
];

// Sitemap/feed <loc>/<link> values must be valid URIs per RFC 3986 (ASCII
// only, non-ASCII percent-encoded) — Google's sitemap spec calls this out
// explicitly. Product slugs here are Hebrew, and every single one of them
// was being written into sitemap.xml/feed.xml as RAW unescaped UTF-8
// characters (e.g. a literal "מבית-waterfall" inside <loc>...</loc>)
// instead of percent-encoded. That's not a valid URI, which is a very
// plausible reason Google fails to crawl/index a chunk of product pages
// via the sitemap even though the XML itself parses fine. encodeURI()
// percent-encodes non-ASCII characters while leaving "/" and other
// URI-structural characters alone, unlike encodeURIComponent().
function toAbsoluteUrl(path) {
  return SITE_URL + encodeURI(path);
}

function xmlEscape(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchAllProducts() {
  const products = [];
  let page = 1;
  // The Store API caps at 100/page; loop until a short page tells us we're done.
  for (;;) {
    let res;
    try {
      res = await fetch(`${WP_API_URL}/wc/store/v1/products?per_page=100&page=${page}`);
    } catch {
      return products; // network unreachable at build time — degrade gracefully
    }
    if (!res.ok) return products;
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    products.push(...batch);
    if (batch.length < 100) break;
    page += 1;
    if (page > 20) break; // safety cap (2000 products)
  }
  return products;
}

// Product URLs are slug-based now (/product/<slug>), matching the frontend
// (src/lib/productUrl.ts) — falls back to the numeric id if a product is
// ever missing a slug. WooCommerce returns Hebrew slugs percent-encoded
// even inside JSON, so decode for a readable URL, same as the frontend.
function productPath(p) {
  let slug = p.slug;
  try {
    slug = decodeURIComponent(p.slug);
  } catch {
    /* malformed encoding — fall back to the raw slug rather than crash */
  }
  return `/product/${slug || p.id}`;
}

function buildSitemap(products) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...STATIC_ROUTES,
    ...CATEGORY_ROUTES,
    ...products.map(productPath),
  ];
  const entries = urls
    .map(
      (path) => `  <url>
    <loc>${xmlEscape(toAbsoluteUrl(path))}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${path === "/" ? "daily" : path.startsWith("/product/") ? "weekly" : "monthly"}</changefreq>
    <priority>${path === "/" ? "1.0" : path.startsWith("/product/") ? "0.7" : "0.5"}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function minorUnitToNumber(price, minorUnit) {
  const n = parseInt(price, 10);
  return Number.isNaN(n) ? 0 : n / Math.pow(10, minorUnit ?? 2);
}

// Real Google product taxonomy paths (google.com/basepages/producttype/taxonomy.xml).
// The feed used to hardcode every single item to KITCHEN_FAUCETS regardless of
// what it actually was — 35 of 65 live products are bathroom/shower/cold-water
// items, not kitchen faucets, which is exactly the kind of mismatched-category
// data Merchant Center disapproves items for ("Products aren't accurately
// represented" / mismatched google_product_category vs. title-image).
const KITCHEN_FAUCETS = "Home & Garden > Kitchen & Dining > Kitchen Fixtures > Kitchen Sink Accessories > Kitchen & Bar Sink Faucets";
const BATHROOM_SINK_FAUCETS = "Home & Garden > Bathroom Accessories > Bathroom Sink Accessories > Bathroom Sink Faucets";
const SHOWER_SETS = "Home & Garden > Bathroom Accessories > Shower Heads & Handheld Showers";
const GENERIC_BATHROOM_FALLBACK = "Home & Garden > Bathroom Accessories";

// Maps each WooCommerce product category (by Hebrew name substring, matched
// against the live category names — see the categories dump in scripts/
// generate-sitemap-feed test run) to the Google category that actually
// describes it. "סדרת X" collection tags carry no functional signal so
// they're skipped; only the functional category words below are checked.
function googleCategoryFor(product) {
  const names = (product.categories || []).map((c) => c.name).join(" ");
  if (names.includes("פינוק")) return SHOWER_SETS; // "ערכות פינוק" — pamper/rain-shower sets
  if (names.includes("מטבח")) return KITCHEN_FAUCETS; // "ברזי מטבח" — kitchen faucets
  if (names.includes("מים") && names.includes("קרים")) return BATHROOM_SINK_FAUCETS; // "ברזי מים קרים" — cold-water taps
  if (names.includes("כיור") || names.includes("רחצה")) return BATHROOM_SINK_FAUCETS; // "ברזי כיור רחצה" — bathroom sink faucets
  return GENERIC_BATHROOM_FALLBACK; // unrecognized category — broad beats wrong
}

function buildFeed(products) {
  const items = products
    .map((p) => {
      const minorUnit = p.prices?.currency_minor_unit ?? 2;
      const price = minorUnitToNumber(p.prices?.price, minorUnit);
      const regularPrice = p.prices?.regular_price ? minorUnitToNumber(p.prices.regular_price, minorUnit) : price;
      const salePrice = p.prices?.sale_price ? minorUnitToNumber(p.prices.sale_price, minorUnit) : null;
      const image = p.images?.[0]?.src ?? "";
      const link = toAbsoluteUrl(productPath(p));
      const availability = (p.is_in_stock ?? true) ? "in stock" : "out of stock";
      const description = (p.short_description || p.description || p.name || "")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim()
        .slice(0, 5000);

      return `    <item>
      <g:id>${xmlEscape(p.sku || p.id)}</g:id>
      <title>${xmlEscape(p.name)}</title>
      <description>${xmlEscape(description)}</description>
      <link>${xmlEscape(link)}</link>
      <g:image_link>${xmlEscape(image)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${regularPrice.toFixed(2)} ILS</g:price>
      ${salePrice && salePrice < regularPrice ? `<g:sale_price>${salePrice.toFixed(2)} ILS</g:sale_price>` : ""}
      <g:brand>Waterfall</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>${xmlEscape(googleCategoryFor(p))}</g:google_product_category>
      <g:shipping>
        <g:country>IL</g:country>
        <g:service>Standard</g:service>
        <g:price>${SHIPPING_FLAT_RATE.toFixed(2)} ILS</g:price>
      </g:shipping>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>UMBRCOM — Waterfall Product Feed</title>
    <link>${xmlEscape(SITE_URL)}</link>
    <description>Waterfall faucets &amp; fixtures — product catalog feed (Google Merchant Center / Meta Catalog compatible)</description>
${items}
  </channel>
</rss>
`;
}

async function main() {
  const products = await fetchAllProducts();
  mkdirSync(PUBLIC_DIR, { recursive: true });
  writeFileSync(resolve(PUBLIC_DIR, "sitemap.xml"), buildSitemap(products), "utf8");
  writeFileSync(resolve(PUBLIC_DIR, "feed.xml"), buildFeed(products), "utf8");
  // robots.txt pointing at the sitemap — created once, not overwritten if
  // you've customized it, except we always want the Sitemap: line present.
  writeFileSync(
    resolve(PUBLIC_DIR, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    "utf8"
  );
  console.log(
    `[generate-sitemap-feed] ${products.length} products → sitemap.xml, feed.xml, robots.txt written to public/`
  );
}

// Only auto-run when this file is executed directly (`node
// scripts/generate-sitemap-feed.mjs`, or the "prebuild" npm hook) — NOT
// when scripts/prerender.mjs imports fetchAllProducts/productPath/etc.
// below, which would otherwise re-run this whole script a second time as
// an unwanted side effect of the import. Compared via pathToFileURL (not a
// raw string concat) because on Windows process.argv[1] is a backslash
// path ("C:\...") while import.meta.url is a "file:///C:/..." URL with
// forward slashes and percent-encoding — a naive `file://${argv[1]}`
// never matches there, so main() silently never ran on Windows.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

// Reused by scripts/prerender.mjs so both scripts crawl the exact same set
// of routes/products — one source of truth instead of two lists drifting
// apart over time.
export { fetchAllProducts, productPath, STATIC_ROUTES, CATEGORY_ROUTES };
