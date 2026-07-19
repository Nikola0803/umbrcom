# UMBRCOM — Change Log (per umbrcom.docx)

Both top navigation bars are now **BLACK** on all pages (logo bar + icon/search bar + category strip). Brand color remains only as a small accent (cart badge, active-link underline).

## Item-by-item

1. **Home page designs (Waterfall + Ambercom)** — Waterfall home upgraded (full-screen video hero, floating header, new sections). `/ambercom` rebuilt as a full brand homepage: amber video hero, story, collection, TikTok section.
2. **Category images** — swapped with new placeholders in `CategoriesSection.tsx`. ⚠️ Replace the 3 `image` URLs with the client's prepared photos (marked with a comment).
3. **Product card redesign** — clean/premium style: borderless soft-gray tile, square finish swatches, quiet typography, hover quick-add in brand color. Used on homepage, shop, related products.
4. **Accessibility button** — rebuilt as the standard Israeli widget (blue round wheelchair button), fixed **bottom-right**. Panel: text size, high contrast, inverted contrast, grayscale, underline links, readable font, stop animations, reset, accessibility-statement link. Supporting CSS in `index.css`.
5. **Product page redesign** — clean white layout; secondary gallery above the long description; 3D view button below add-to-cart (was already there, kept); square color-cube selection (kept, panel whitened).
6. **Gallery carousel** — moved to sit directly **above the long description**; center image raised/floating, side images lower (existing carousel component, repositioned).
7. **Transparent floating header** — on both homepages the header floats transparent above the hero video and turns solid black on scroll. ⚠️ I don't have the WhatsApp reference image — if the layout should differ, send it.
8. **Bigger logo** — logo enlarged to 72px in a taller 80px bar (was 64px bar / 64px logo). Inverted to white for the black bar.
9. **"Pages you haven't done"** — all already exist in this codebase and are routed: `/auth` (register/login), `/terms`, `/my-account`, `/business`, `/invoice-recovery`, `/accessibility-statement`. They may simply not have been deployed yet.
10. **Duplicate section** — removed the standalone "follow us" social strip from the homepage (social icons live in the footer; nothing renders twice anymore).
11. **White background** — all warm-gray section/panel backgrounds replaced with white across the site (product tiles keep a neutral #f6f6f6).
12. **Brand-colored buttons** — new `useBrand()` hook: Waterfall pages use light blue `#3ab4f2` for primary CTAs (product card quick-add, PDP add-to-cart, checkout continue), Ambercom pages use amber `#e8a030`.
13. **Articles page** — rebuilt in magazine style: full-width featured story with overlapping text card + clean grid.
14. **"To right"** — accessibility button is now pinned bottom-right; floating WhatsApp/phone buttons moved to bottom-left so they don't collide.
15. **Register/Login, Compare, Wishlist** — pages exist; navbar icons now actually link: user → `/auth`, heart → `/wishlist`, new scales icon → `/compare` (also in the mobile drawer).
16. **Series page** — redesigned as large banner tiles: full-width featured series banner + 2-up banners, faucet image with the series name overlaid (Hydra-style, without the Hydra).
17. **Video banner** — both homepages open with a full-screen faucet video. ⚠️ Placeholder .mp4 URLs are marked `VIDEO_SRC` in `Hero.tsx` and `ambercom/page.tsx` — drop in the real brand videos.
18. **Homepage articles style** — new `ArticlesSection`: featured story with overlapping card + numbered editorial side list (different from Mashiach/current Embercom).
19. **Product page layout** — main image + thumbnails physically on the **left**, name/description/purchase panel on the **right** (forced with a `dir="ltr"` wrapper inside the RTL page).
20. **TikTok template** — `TikTokSection` is now a reusable component (brand name, handle, accent, videos as props) rendered on **both** homepages. ⚠️ Replace the placeholder video IDs with real ones from @1umbrcom.
21. **Checkout account options** — the order page now has: inline **login to an existing account** (email+password form) and a **"create an account with my order details"** checkbox + password field (continue is blocked until the password is ≥8 chars). Both are front-end ready; wire to the real auth endpoint where marked `TODO`.

## Needs from you (assets I don't have)
- 3 prepared category photos (item 2)
- WhatsApp header reference (item 7) — current implementation is my interpretation
- Real brand videos for both heroes (item 17)
- Real TikTok video IDs (item 20)

## Update — all text right-aligned (no center, no left)
Went through every page and component and removed centered/left-aligned text site-wide:
- All headings, paragraphs, labels, banners, empty states (404, empty cart, empty wishlist, no comparison, checkout success), table cells (compare page), and info tiles now read right-to-left, flush right.
- Fixed a couple of pre-existing bugs where Hebrew headings were accidentally set to `text-left` (Featured Products header, "forgot password" link).
- **Left untouched on purpose:** email/phone number **input fields** (auth, business, warranty, invoice-recovery) — these keep `dir="ltr"` + left-aligned text because that's how you actually type an email or phone number; flipping those would break typing UX, not fix a design issue. Also left as-is: small icon-only UI controls where centering is structural, not "text" — the checkout step-progress circles, floating WhatsApp/phone buttons, the accessibility-widget toggle tiles, and scroll-indicator dots. Flag if you want those changed too.

Also fixed along the way: broken import in `src/mocks/blogPosts.ts` (`./BlogCard` → correct path).

`npm run build` passes; fresh production build included in `out/`.

## Update — header rebuilt to match your WhatsApp screenshot (item 7)
Replaced the header with a pixel-matched version of the reference:
- **Row 1**: icon cluster on the left (cart, login, wishlist, compare — each icon + small white label, blue on Waterfall / amber on Ambercom), dual logo on the right (Waterfall wordmark with a dropdown chevron that opens a brand-switch menu → Waterfall / Ambercom, plus the UMBRCOM parent-brand mark).
- **Row 2** (desktop only): search pill on the left, nav links (מבצעים, מועדון לקוחות, שירות לקוחות → linked to `/customer-service`) plus a white **"כל הקטגוריות"** pill on the right that opens a dropdown with all product categories + Ambercom.
- **Mobile**: a compact logo + cart + hamburger row, then a search row underneath; the hamburger opens the existing slide-out drawer.
- Removed the earlier "transparent header floating over video" idea — this header is a solid opaque black bar everywhere per your screenshot, so the hero sections were resized to sit right below it instead of underneath it.

⚠️ Two links are my best guess since there's no dedicated page for them yet: מבצעים → `/shop`, מועדון לקוחות → `/auth`. Tell me if you want real Deals / Loyalty Club pages instead.

## Update — Headless WordPress + WooCommerce integration

Two deliverables:

### 1. WordPress plugin: `umbrcom-content-engine.zip`
A real, installable plugin (not just docs) that turns wp-admin into the CMS
for this site. Full details in the plugin's own `readme.txt` / `SETUP.md`,
short version:

- **Page Builder** — every Page gets a "Page Sections" flexible-content field
  (Hero Video, Trust Strip, Categories Grid, Featured Products, Testimonials,
  TikTok, Articles Teaser, Rich Text, CTA Banner). Add/remove/reorder from
  wp-admin, the frontend renders it automatically.
- **Series** CPT for Hydra/Dett/Sora-style banners.
- **Storefront Details** panel on every WooCommerce product — spec table,
  3D model (.glb/.usdz), AR toggle, badge text, related accessories.
  Colors/finishes use WooCommerce's native Attributes + Variations (the
  correct WooCommerce-native way), not a custom field.
- **Category Display Settings** — a tile image + label override on every
  product category, so swapping category photos (item 2 from the original
  brief) is a wp-admin job, not a code change.
- **Site Settings** — one options screen: contact info, socials, brand
  colors, both hero videos, header nav links, TikTok handles/videos, footer.
- REST wiring: `/umbrcom/v1/settings`, `/umbrcom/v1/nav`, Page Builder over
  `/wp/v2/pages`, and the public WooCommerce **Store API**
  (`/wc/store/v1/products`) extended with an `umbrcom` data block carrying
  all the custom fields — no API keys needed for the storefront to read
  products.

**Requires ACF PRO** (paid) + WooCommerce — the free ACF doesn't have
Repeater/Flexible Content/Options Page, which this is built on.

### 2. Frontend: `src/lib/wp-api.ts` + wiring
A typed API client (`fetchSettings`, `fetchNav`, `fetchPageSections`,
`fetchProducts`/`fetchProductById`, `fetchPosts`) that talks to the plugin
above. Set `VITE_WP_API_URL` in `.env` (see `.env.example`) to turn it on —
unset, the site runs exactly as before on local mock data, so nothing
breaks without a WordPress backend.

**Already wired end-to-end** (real data in, graceful fallback to mocks out):
- **Home** and **Ambercom** pages — both now render via a new `PageBuilder`
  component that maps each Page Builder section to its React component.
  If the WP page has no sections yet (or WP isn't configured), the original
  hand-built layout renders instead.
- **Product page** — fetches the real product (price, images, spec table,
  3D model, badge) by ID from the Store API; falls back to the mock catalog
  if not found.
- **Series page** — pulls live Series + product counts from `/umbrcom/v1/nav`.
- **Navbar** — categories, logo, phone/WhatsApp now come from
  `/umbrcom/v1/nav` + `/umbrcom/v1/settings`.
- **Footer** — social icons pull from Site Settings.

**Intentionally left on static/local data for now** (flag if you want these
converted too — the pattern above makes each one a small, well-understood job):
- Shop listing page filters/sort (still reads the local product mock array
  directly rather than the Store API — the product *page* is wired, the
  *listing* isn't yet).
- Blog listing page (the homepage Articles teaser is wired via
  `fetchPosts()`; the standalone `/blog` page still reads the mock array).
- Footer's link columns (קטלוג/מידע/שירות לקוחות) — these map 1:1 to actual
  React routes, so they stayed hard-coded rather than becoming freely
  editable text that could point at pages that don't exist.
- Cart/checkout still operate on the local `CartContext`, not WooCommerce's
  Cart/Checkout Store API endpoints (real order placement) — that's the
  natural next step once you're ready to take live orders through this.

## Correction — plugin rebuilt with ZERO third-party dependencies

The version above was wrong to require ACF PRO. It's been fully rebuilt:
**the plugin now requires only WooCommerce.** Page Builder, product
fields, Series, Site Settings, and category images are all custom-built
in this plugin on core WordPress APIs only — meta boxes, `wp.media`, the
built-in `wp-color-picker`, and `register_rest_field`/the WooCommerce
Store API for exposing everything. No ACF, no other field or page-builder
plugin, no license to buy, ever.

What changed under the hood (functionally identical from wp-admin's point
of view — same sections, same fields, same Site Settings screen):

- **Page Builder** is a from-scratch flexible-content system: sections are
  added/removed/reordered with ↑ / ↓ / × buttons, backed by one plain
  nested array in postmeta (bracket-named form inputs parse straight into
  PHP arrays — no JSON, no dependency).
- A small custom **field kit** (`class-field-renderer.php` +
  `assets/admin.js/css`, ~250 lines of vanilla JS total) provides every
  field type used across the plugin: text/textarea/color/image/file/
  checkbox/select/checkbox-list, a generic repeater (native `<template>`
  cloning), and a relationship field (AJAX search + pill picker).
- On the frontend, `PageSection` now carries a plain `type` key instead of
  `acf_fc_layout`, and sections come back as a top-level `umbrcom_sections`
  field instead of nested under `acf` — `wp-api.ts` and `PageBuilder.tsx`
  are updated to match. Everything else works exactly the same way.

Re-download both files — the plugin zip and the frontend zip were both
rebuilt.

## Update — content pages wired to Page Builder too (About, Terms, Privacy, Returns, Accessibility Statement)

Previously only Home and Ambercom read from wp-admin — every other page
(About, Contact, Terms, Privacy, Returns, Business, Customer Service,
Warranty, Invoice Recovery, Accessibility Statement) was still 100%
hardcoded React, meaning editing a single word on any of them required a
developer. That's now fixed for the pages that are pure content:

**Now wp-admin-editable** (same pattern as Home/Ambercom — build a
WordPress Page with that slug using Page Builder sections, or leave it
alone and the current hand-built version keeps showing):
- About (`/about`)
- Terms (`/terms`)
- Privacy (`/privacy`)
- Returns (`/returns`)
- Accessibility Statement (`/accessibility-statement`)

Also added a shared `CmsPage` component
(`src/components/feature/CmsPage.tsx`) so wiring any *new* content page to
Page Builder going forward is a two-line change, not copy-pasted
boilerplate — Home and Ambercom were refactored to use it too.

**Still hardcoded, on purpose, for now**: Contact, Business, Customer
Service, Warranty, Invoice Recovery. These aren't pure content — each one
is a functional form (contact form, business inquiry form, warranty
lookup, etc.) with the copy woven directly into the same component as the
form logic. Page Builder can't edit a form's behavior, only content, so
fully converting these means separating "the words around the form" from
"the form itself" — doable, but a distinct, slightly bigger job per page
than the copy-paste-safe conversions above. Flag if you want these done
next; same pattern, just more surgery per file.

## Update — full page management, auto-generated pages, complete product field coverage

Direct response to: "manage any page, pages auto-generated from React and
connected straight away, all fields pre-defined, all product-page fields
must exist in wp-admin."

### Pages — now genuinely all of them
Every remaining content page is wired the same way Home/About/Terms
already were: **Contact, Business, Customer Service, Warranty, Invoice
Recovery**. Each one's functional form was extracted into its own static
component (`ContactForm.tsx`, `BusinessForm.tsx`, etc. — forms stay real
React, Page Builder edits content, not form logic); the header, intro
copy, and contact/benefit tiles around each form are now CMS-editable.

Two new reusable Page Builder layouts power this:
- **Page Header / Banner** — the eyebrow+title banner at the top of a
  content page.
- **Info Tiles** — an icon+title+text grid, in two styles (bordered cards
  for benefit lists, icon circles for contact methods).

### Pages are now auto-generated — not something you build from scratch
The plugin now creates a real WordPress Page, **pre-filled with today's
actual copy** (transcribed word-for-word from the live React content), for
all 12 pages the moment it's activated: Home, Ambercom, About, Contact,
Terms, Privacy, Returns, Accessibility Statement, Business, Customer
Service, Warranty, Invoice Recovery. Open Pages → All Pages right after
activating and it's all there — nothing blank, nothing to build from zero.
A "Sync Pages Now" button on Site Settings re-runs this safely any time
(only creates what's missing; never overwrites an edited page). I verified
this by actually executing the generator code (not just reading it) —
confirmed all 12 pages created with correct Hebrew content, and confirmed
running it twice creates nothing the second time.

### Product page — every visible field now exists in wp-admin
Expanded the Storefront Details panel to cover literally everything shown
on the product page, not just specs/3D/badges:
- Highlight cards (the 3 icon cards above the buy box)
- Short description (the highlighted line next to the SKU)
- Description tab paragraphs + feature bullet list
- Shipping/returns/warranty blocks (shipping tab)
- Brand label (the "— Waterfall" suffix next to the category)

Also fixed two things that were fake/hardcoded and are now real WooCommerce
data: the "17% off" discount badge now computes from the product's actual
regular/sale price instead of a fixed ×1.2 multiplier, and the "(14
ביקורות)" review count now reads WooCommerce's native review count and
average rating instead of a hardcoded number. Colors/finishes, price,
stock, gallery, and reviews are deliberately *not* custom fields — those
are WooCommerce's own native mechanisms (Attributes/Variations, Product
data, Product gallery, Reviews), which is the architecturally correct way
to do it, not a gap.

### Verification
Every PHP file (17 total) passes `php -l` syntax linting — installed a
real PHP interpreter this round instead of relying on brace-counting. The
Site Settings page and the page-sync generator were both actually
*executed* against a stubbed WordPress environment (not just read) to
confirm they produce correct output, not just valid syntax.

## Update — July 2026 round (20-item list)

**Header (1–3)**
1. Header background is now **white** on all pages (`NAV_BG` in `Navbar.tsx`), light borders + soft shadow.
2. The logo renders as the **black version** — a `brightness-0` CSS filter forces the blue wordmark to pure black, so it works with the existing PNG and any future logo upload from wp-admin. The UMBRCOM parent wordmark text is black too.
3. **All header icons are black** (cart, login, wishlist, compare, chevron, drawer icons, mobile icons) — on Waterfall *and* Ambercom pages. Search pill is now light gray with dark text; the "כל הקטגוריות" pill flipped to black-on-white. Only the cart count badge keeps the brand color as a small accent — say the word and I'll make it black too.

**Font (4)**
4. Entire site now uses **Assistant** — the same font as the Mashiach storefront. Headings (`h1–h3`, `.font-serif`) and the `.prose-umbrcom` styles all point at Assistant; Heebo / Frank Ruhl Libre / Playfair imports removed.

**Homepage (5–7) — plumbing ready, waiting on the actual assets**
5. Hero video: the homepage hero now reads `waterfall_hero_video` from wp-admin → Site Settings and uses it automatically. ⚠️ The field is currently empty on the live WP — send me the video (or upload it in Site Settings) and it's live. Placeholder plays meanwhile.
6. Category images: the three homepage tiles now pull the tile image from wp-admin → Product Categories → Category Display Settings (matched by kitchen / כיור רחצה / מים קרים keywords, ignoring the WooCommerce placeholder). ⚠️ All live categories still have placeholder images — I don't know which images you marked; upload them to the categories (or send them to me) and they appear.
7. TikTok: the homepage TikTok section reads the video rows from wp-admin → Site Settings → TikTok. ⚠️ Currently empty, and TikTok blocks scraping @1umbrcom, so I couldn't pull the IDs myself — send the 3 video links (or paste the IDs in Site Settings).

**Footer (8–9)**
8. Bottom-bar Waterfall logo (wfl.co.il link) replaced with the **UMBRCOM logo**, linking home.
9. Removed the brand entry from the קטלוג column. Note: the column had no literal "UmbraCom" item — the closest was the **Ambercom** link, which I removed; flag me if you meant something else.

**Pages (10–15)**
10–12. Terms / Privacy / Accessibility now render the **real content copied from the old website (wfl.co.il)**, cleaned of Word/Elementor markup, stored in `src/pages/legal/content/*.html` (edit those files to change the text). ⚠️ Two flagged adaptations for the client's lawyer to bless: the privacy policy referenced WFL.CO.IL and the accessibility statement referenced "אתר WATERFALL" — both swapped to UMBRCOM. The terms already referenced umbrcom.co.il, copied as-is.
13. Invoice Recovery page deleted — page, form, route, and footer link.
14. Customer Service page redesigned: dark page header, intro, three proper contact cards (icon circle, contact detail, CTA), form inside a card, clashing orange button replaced with site black, responsive 1→3 column grid.
15. Contact page fixed for RTL: header sits in a proper container with the divider flush right; each contact tile is icon-on-the-right, text after it, all right-aligned; the form/map grid is RTL (and stacks on mobile); phone/email values render `dir="ltr"` inside the RTL row so they read correctly.

**Returns & forms (16–17)**
16. New **cancellation-request form** on ביטולים והחזרות: full name, order number, cancellation reason (dropdown + free-text for "אחר"), phone, email, consent checkbox. ⚠️ No form endpoint exists yet — `CANCELLATION_FORM_URL` in `CancellationForm.tsx` is empty, so it currently falls back to opening a pre-filled email to office@umbrcom.co.il. Create a readdy form (like the others) and paste the URL to make it a real submit.
17. Required consent checkbox — "קראתי ואני מסכים/ה למדיניות הפרטיות ותנאי השימוש, ומאשר/ת יצירת קשר עמי." — is now on **every** form: Business (added, submit disabled until checked), Warranty (added), Customer Service (text upgraded to the full wording + required), Contact (already had it — now also browser-required), Newsletter (added), and the new cancellation form.

**Products (18–20)**
18. Import verified: all **65 products** on the old site exist on the new backend with identical names, prices, descriptions, short descriptions, and image counts (scripted comparison, 0 diffs). Nothing to import — already done. What *was* broken: the frontend never displayed the imported content — fixed below.
19. Product page is fully RTL: removed the forced-LTR grid wrapper (gallery now sits on the right, as RTL dictates — flag me if you still want it on the left), and the description / tech-specs / AI-review / warranty tab contents are explicitly `dir="rtl"` right-aligned, including imported HTML.
20. **Bugfix that makes the custom fields actually show**: the Store API returns the plugin's data under `extensions.umbrcom`, but the frontend read a top-level `umbrcom` that never exists — so YouTube video / AI review / tech specs / package contents / warranty tabs never appeared even when filled. Now read correctly (with fallback for older plugin builds). Also: the product page now renders the real imported WooCommerce long description (styled, RTL) and short description when the plugin fields are empty — previously imported content was silently ignored in favor of generic filler text.

`npm run type-check` + `npm run build` pass; fresh production build in `out/`.

### Still need from you
- the homepage hero video file/URL (item 5)
- the marked category images (item 6)
- the 3 TikTok video links (item 7)
- a form endpoint URL for the cancellation form (item 16)
- lawyer sign-off on the WFL→UMBRCOM references in privacy/accessibility (items 11–12)


## Update — July 2026 round (20-item list)

**Header**
1. **White header** — both header rows, mobile header, search rows, and the drawer top strip are now white with a soft shadow and hairline borders.
2. **Black UMBRCOM logo** — the blue wordmark renders pure black via a `brightness-0` filter (works even after you swap the logo URL in wp-admin). The "UMBRCOM / THE UMBRELLA COMPANY" mark is black text now too.
3. **Black header icons** — cart, login, wishlist, compare, search, chevrons, drawer icons all black. The only remaining color accent is the tiny cart-count badge.
4. **Font = Assistant site-wide** — same Google font as the Mashiach storefront; replaces Heebo + Frank Ruhl Libre everywhere including headings and the prose styles.

**Homepage**
5. **Hero video** — the hero now reads the video from wp-admin → UMBRCOM → Site Settings → "Waterfall hero video" automatically; a placeholder plays until you set it. ⚠️ I don't have the real video file — upload it to the media library and paste its URL in Site Settings (or send me the URL and I'll hard-code it).
6. **Category images** — same flow: upload the marked photos per category under Products → Categories → Category Display Settings and they appear automatically. ⚠️ I can't tell which of the recently-uploaded images are "the marked ones" — happy to hard-code if you point me at the 3 URLs.
7. **TikTok videos** — the section reads video IDs from Site Settings → TikTok. ⚠️ TikTok blocks scraping so I couldn't pull them from @1umbrcom myself — send the 3 video links (or set them in wp-admin).

**Footer**
8. Bottom-bar **Waterfall logo → UMBRCOM logo** (links to the homepage instead of wfl.co.il).
9. Removed the brand entry ("Ambercom") from the קטלוג column. If you meant a different footer item, tell me which.

**Pages**
10-12. **Terms / Privacy / Accessibility copied from the old website (wfl.co.il)** — full legal text, cleaned of Word/Elementor markup, rendered RTL via a shared `LegalContent` component (`src/pages/legal/content/*.html`). Note: the privacy policy and accessibility statement referenced WFL.CO.IL / WATERFALL by name; I swapped those references to UMBRCOM.CO.IL / UMBRCOM — flag for legal review.
13. **Invoice Recovery page deleted** — page, form, route, and footer link.
14. **Customer Service page redesigned** — dark page header, proper contact cards (email / phone / WhatsApp with CTAs), the form in a white card with a black button (the orange one is gone).
15. **Contact page fully RTL** — icons sit to the right of their labels, everything flush right; phone/email values render LTR inside so numbers read correctly.

**Returns & forms**
16. **Cancellation request form** on ביטולים והחזרות: full name, order number, cancellation reason (dropdown + optional details), phone, email + the consent checkbox. ⚠️ No endpoint existed for it — set `CANCELLATION_FORM_URL` in `CancellationForm.tsx` (readdy or any POST endpoint); until then it falls back to opening a pre-filled email to office@umbrcom.co.il so nothing gets lost.
17. **Consent checkbox on every form** — Business, Contact, Customer Service, Warranty, Newsletter, Cancellation: required checkbox with the exact text "קראתי ואני מסכים/ה למדיניות הפרטיות ותנאי השימוש, ומאשר/ת יצירת קשר עמי", submit disabled until checked.

**Products**
18. **Import verified complete** — all 65 products (names, SKUs, prices, images, long + short descriptions) match wfl.co.il on the new backend, checked programmatically product-by-product. The frontend now actually *renders* the imported WooCommerce description/short-description HTML (it previously only showed the plugin's custom paragraphs, which are empty on imported products).
19. **Product page fully RTL** — removed the `dir="ltr"` layout override; all tab content, tech-specs HTML, and the imported description render `dir="rtl"` text-right (new `.product-description` styles handle Word-pasted markup).
20. **Custom product fields now display** — fixed the bug where the plugin's data block arrives at `extensions.umbrcom` but the frontend read a top-level `umbrcom` that never exists. YouTube video, AI review, technical specs, package contents, warranty, 3D model, badges, and related accessories all appear as tabs whenever the field has data in wp-admin.

`npm run type-check` + `npm run build` pass; fresh production build in `out/`.

### Still needed from you
- Hero video URL (item 5) · the 3 marked category images (item 6) · 3 TikTok video links (item 7)
- An endpoint for the cancellation form (item 16) — or say the word and I'll spin one up in the plugin
- Legal check on the domain-name swaps inside the copied privacy/accessibility pages (items 11-12)


## Update — Google Analytics (GA4, no Adscale)

- `index.html`: standard gtag.js snippet with measurement ID **G-6N67TXSK2S** (from Ben).
- New `src/lib/analytics.ts` — GA4 e-commerce events, pure gtag:
  - `view_item` on every product page view
  - `add_to_cart` / `remove_from_cart` from CartContext
  - `begin_checkout` on "place order" (with the grand total incl. shipping), which also snapshots the cart items into sessionStorage
  - `purchase` on /checkout/result once the backend confirms the Pelecard payment — `transaction_id` = order number, value = order total, items restored from the snapshot (React cart state doesn't survive the Pelecard redirect). Deduped per order number so a refresh of the thank-you page can't double-count revenue.
- All calls are wrapped so a blocked/missing gtag can never break the shop.
- GA4 property setup: keep Enhanced Measurement on (history-based page views for the SPA); e-commerce reports populate from the events above automatically.
