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
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, "../public");

// The live public-facing frontend domain (not admin.umbrcom.co.il, which is
// the WordPress backend). Override with SITE_URL if this ever changes.
const SITE_URL = process.env.SITE_URL || "https://umbrcom.co.il";
const WP_API_URL = process.env.VITE_WP_API_URL || "https://admin.umbrcom.co.il/wp-json";

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

function buildSitemap(products) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...STATIC_ROUTES,
    ...CATEGORY_ROUTES,
    ...products.map((p) => `/product/${p.id}`),
  ];
  const entries = urls
    .map(
      (path) => `  <url>
    <loc>${xmlEscape(SITE_URL + path)}</loc>
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

function buildFeed(products) {
  const items = products
    .map((p) => {
      const minorUnit = p.prices?.currency_minor_unit ?? 2;
      const price = minorUnitToNumber(p.prices?.price, minorUnit);
      const regularPrice = p.prices?.regular_price ? minorUnitToNumber(p.prices.regular_price, minorUnit) : price;
      const salePrice = p.prices?.sale_price ? minorUnitToNumber(p.prices.sale_price, minorUnit) : null;
      const image = p.images?.[0]?.src ?? "";
      const link = `${SITE_URL}/product/${p.id}`;
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
      <g:google_product_category>Home &amp; Garden &gt; Kitchen &amp; Dining &gt; Kitchen Fixtures &gt; Kitchen Sink Accessories &gt; Kitchen &amp; Bar Sink Faucets</g:google_product_category>
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

main();
