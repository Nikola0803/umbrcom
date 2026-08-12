#!/usr/bin/env node
/**
 * Build-time prerender step — fixes the "Googlebot/Google Ads reviewer sees
 * only <div id="root"></div>" problem identified in the Misrepresentation
 * policy review (Aug 2026): this is a client-rendered React SPA, so every
 * route's raw HTML (what any crawler that doesn't run JS actually sees)
 * was just a script tag and an empty div — no company info, no products,
 * no policies, nothing.
 *
 * Runs AFTER `vite build` (wired as npm's "postbuild" hook — see
 * package.json). It boots a tiny local static server over the just-built
 * out/ directory, drives a real headless Chrome through every public route
 * (same route/product list scripts/generate-sitemap-feed.mjs already uses
 * for sitemap.xml/feed.xml — imported from there, not duplicated), and
 * overwrites each route's HTML file in out/ with the FULLY RENDERED DOM:
 * real product names/prices, real policy text, real company info —
 * everything React would otherwise only paint in an actual browser after
 * the JS bundle runs.
 *
 * This does NOT change how the site behaves for real visitors. Every
 * prerendered file still includes the same
 * <script type="module" src="/assets/...">  tag, so the browser boots the
 * SPA exactly as before and takes over immediately — visitors get the
 * identical interactive site, just with real content already painted
 * instead of a blank shell while JS loads. Crawlers that don't execute JS
 * reliably (Googlebot's second-wave render queue, Google Ads' automated
 * reviewer, Meta's crawler, etc.) now see real HTML on the very first
 * response, on every route — not just whatever index.html happened to be.
 *
 * Falls back gracefully: if puppeteer/Chrome can't launch (e.g. missing
 * system deps on a fresh server) or a specific route fails, that route
 * simply keeps the plain SPA shell it already had — never blocks the
 * build/deploy over this.
 */
import http from "node:http";
import { readFile, stat, writeFile, mkdir } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchAllProducts, productPath, STATIC_ROUTES, CATEGORY_ROUTES } from "./generate-sitemap-feed.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../out");
const PORT = Number(process.env.PRERENDER_PORT || 4173);

// User-account-state-dependent pages — prerendering them would just bake
// in an empty/logged-out snapshot, which doesn't help SEO/ad-review and
// could look like a permanently-empty page. Skipped on purpose.
const SKIP_ROUTES = new Set(["/wishlist", "/compare"]);

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".map": "application/json",
};

function startServer(root, port) {
  return new Promise((resolvePromise, rejectPromise) => {
    const server = http.createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
        let filePath = join(root, urlPath);
        let fileStat = null;
        try {
          fileStat = await stat(filePath);
        } catch {
          /* doesn't exist as a literal file — fall through to SPA logic below */
        }
        if (!fileStat || fileStat.isDirectory()) {
          const asIndex = join(filePath, "index.html");
          try {
            await stat(asIndex);
            filePath = asIndex;
          } catch {
            filePath = join(root, "index.html"); // SPA fallback — same behavior as nginx's try_files
          }
        }
        const data = await readFile(filePath);
        res.setHeader("Content-Type", MIME[extname(filePath)] || "application/octet-stream");
        res.end(data);
      } catch (err) {
        res.statusCode = 500;
        res.end(String(err));
      }
    });
    server.on("error", rejectPromise);
    server.listen(port, "127.0.0.1", () => resolvePromise(server));
  });
}

async function main() {
  let puppeteer;
  try {
    ({ default: puppeteer } = await import("puppeteer"));
  } catch {
    console.warn(
      "[prerender] puppeteer not installed — skipping prerender (site still works, just not pre-rendered for crawlers). Run `npm install` to enable this step."
    );
    return;
  }

  console.log("[prerender] fetching product list from the live WooCommerce API...");
  const products = await fetchAllProducts();
  const productRoutes = products.map(productPath);

  const routes = [...new Set([...STATIC_ROUTES, ...CATEGORY_ROUTES, ...productRoutes])].filter(
    (r) => !SKIP_ROUTES.has(r)
  );

  console.log(`[prerender] starting local static server for out/ on 127.0.0.1:${PORT}`);
  const server = await startServer(OUT_DIR, PORT);
  const baseUrl = `http://127.0.0.1:${PORT}`;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch (err) {
    console.warn(`[prerender] Chrome failed to launch (${err.message}) — skipping prerender.`);
    server.close();
    return;
  }

  const page = await browser.newPage();

  let ok = 0;
  let failed = 0;
  for (const route of routes) {
    try {
      await page.goto(baseUrl + route, { waitUntil: "networkidle0", timeout: 30000 });
      // A small buffer past networkidle0 — cheap insurance against a data
      // fetch that resolves and paints in a microtask right at the wire.
      await new Promise((r) => setTimeout(r, 400));
      const html = await page.content();
      // Write "<route>.html" as a FLAT file, not "<route>/index.html". A
      // real directory named e.g. "umbrcom/" makes nginx auto-issue a 301
      // to add a trailing slash the moment a request hits "/umbrcom" (any
      // URI resolving to a real directory triggers this, independent of
      // try_files) — confirmed live on umbrcom.co.il, an extra redirect
      // hop crawlers don't need and that also risks a client-side
      // route-matching mismatch after the slash gets added. A flat file
      // avoids nginx ever seeing "/umbrcom" as a directory at all — see
      // nginx location block requirements noted in package.json's
      // "postbuild" comment / deploy notes for the matching try_files line.
      const outPath = route === "/" ? join(OUT_DIR, "index.html") : join(OUT_DIR, `${route.slice(1)}.html`);
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, html, "utf8");
      ok += 1;
    } catch (err) {
      failed += 1;
      console.warn(`[prerender] FAILED ${route}: ${err.message}`);
    }
  }

  await browser.close();
  server.close();
  console.log(`[prerender] done — ${ok}/${routes.length} routes prerendered${failed ? `, ${failed} failed (left as plain SPA shell)` : ""}.`);
}

main();
