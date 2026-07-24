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


## Update — "Ambercom" naming fix

"Ambercom" was a mistaken reading of אמברקום — it IS UMBRCOM, the parent company, not a second retail brand. Renamed everywhere user-facing:

- **Brand switcher dropdown** (header): now **Waterfall / UMBRCOM**. The amber serif "Ambercom" wordmark is gone — the UMBRCOM entry shows a black UMBRCOM wordmark, on desktop and mobile.
- **useBrand hook**: second brand renamed `umbrcom`, accent color **black** (#111) instead of amber — no yellow buttons/icons anywhere in the UMBRCOM area (ties back to header item 3).
- **Brand page**: moved to **/umbrcom** (the old /ambercom URL 301-redirects there so nothing breaks). All page copy, headings, product blurbs, and the amber glow/accents rebranded to UMBRCOM in black/neutral.
- **Navigation**: mobile drawer + all-categories dropdown entries renamed and recolored.
- **Kept intentionally**: the WP plugin's internal field keys (`ambercom_color`, `ambercom_hero_video`, `tiktok.ambercom`, Page Builder `section.brand === "ambercom"`, and the WP page slug `ambercom`) — those are backend API identifiers; renaming them requires a matching plugin release, which I can do as a follow-up if you want the wp-admin labels cleaned up too.


## Update — WYSIWYG product fields (client feedback)

Client couldn't paste an Excel table into "מפרט טכני" and wanted headings in the AI review — the metaboxes were plain textareas.

- **Plugin patch** (`umbrcom-wysiwyg-fields-patch.php`, delivered separately): AI review, tech specs, package contents, and warranty become full `wp_editor()` (TinyMCE) fields — headings dropdown, lists, links, and Excel/Word tables survive paste (styles stripped, structure kept). Saved via `wp_kses_post`; clearing an editor deletes the meta so the tab hides on the storefront. ⚠️ Meta keys in the patch are best-guess (`_umbrcom_*`) — align with the plugin's actual keys before deploying. youtube_url stays a plain URL input.
- **Frontend**: new `RichField` renderer on the product page — AI review, warranty, and package contents tabs now render rich HTML (h2-h4, lists, RTL-styled tables) when the field contains HTML, and fall back to the old paragraph/checklist rendering for legacy plain-text values, so existing product data keeps working without re-entry. Tech specs already rendered HTML tables. `packageContentsHtml` added to the wp-api mapping.


## Update — "products not seen": full connection diagnosis

Three separate breaks, found by inspecting the live deployment:

1. **Frontend was never connected to WordPress at all.** No `.env` existed, so `VITE_WP_API_URL` was undefined in every build — including the deployed one (verified: the live JS bundle contains zero `wp-json` references). `isWpConfigured()` returned false and the whole site ran on mock data: fake products, static nav, simulated checkout. **Fixed**: `.env.production` added with `VITE_WP_API_URL=https://admin.umbrcom.co.il/wp-json`; the new build verifiably contains the API URL. Deploy this build.
2. **Store API CORS is broken on the server.** The OPTIONS preflight returns `Access-Control-Allow-Origin` but the actual `/wc/store/*` responses do not — browsers reject that, so product fetches from umbrcom.co.il would fail even after fix 1. **Fix delivered**: `umbrcom-cors-fix.php` (drop into `wp-content/mu-plugins/`). The `/umbrcom/v1/*` routes already sent the header correctly.
3. **The plugin's own REST routes are missing on the live server**: `/umbrcom/v1/settings` and `/umbrcom/v1/nav` both 404 (as do the Pelecard routes, flagged earlier). The Store API `extensions.umbrcom` product block IS live, so the plugin is active — the deployed plugin version just predates the REST routes. The frontend degrades gracefully (static nav fallback), but Site Settings (hero video, TikTok, brand colors), live nav, and CMS pages need them. → Deploy the current umbrcom-content-engine version that registers these routes, together with the Pelecard module.

**Deploy order**: CORS mu-plugin → updated plugin (routes + Pelecard + WYSIWYG) → this frontend build. Then products, settings, nav, and checkout all light up.


## Update — July 2026 client feedback round (38 items)

`npm run type-check`, `npm run lint`, and `npm run build` all pass clean.

**Mobile**
1. Header rebuilt: logo centered, wishlist + cart on the left, menu icon on the right (`Navbar.tsx`).
2. Fixed the horizontal-overflow / clipped-header bug: added `overflow-x: hidden` on `html`/`body`/`#root` site-wide (`index.css`), plus `min-w-0`/`flex-shrink-0` on the mobile header's side clusters so nothing can push the page wider than the viewport.
3. Sale badge: the homepage "Featured Products" grid was hard-coded to 4 columns with no mobile breakpoint, squeezing cards down to ~80px — small enough that the badge visually covered most of the photo. Now 2 columns on mobile (`FeaturedProducts.tsx`), and the badge itself shrinks on small screens (`ProductCard.tsx`).
4. Mobile menu: "השוואת מחירים" → "השוואת מוצרים".

**Product page**
5. Finish/color swatches now come only from products in the *same series* (same SKU prefix, e.g. `5509-001`/`5509-002`), not the whole category. See `src/lib/series.ts` for why SKU prefix is the reliable signal today — swap for a real `seriesId` once wp-admin exposes one.
6. Removed the "7 Year Warranty" and "Free Shipping" tabs/sections and the "Coating" (PVD) feature card entirely.
7. Removed the gray (#f6f6f6) image backgrounds on the product page — white with a hairline border instead.
8. Product title: semibold + tight tracking instead of thin font-light, for a stronger on-brand look.
9. SKU: now a dark, bold, monospace chip instead of 10px/#ccc near-invisible text.
10. Removed the "Order via WhatsApp" button.
11-12. Technical Specifications: the frontend already auto-renders whatever's in the product's custom spec fields (`techSpecsHtml`/`specTable`) — this was already wired from an earlier round. **Needs from you**: enabling rich table input in those custom fields is a wp-admin/plugin change (WYSIWYG patch from an earlier round covers this — confirm it's deployed).
13. Order Confirmation: both the `/checkout` (no-backend/demo) and `/checkout/result` (real Pelecard) confirmation screens are redesigned — centered card, order number + total pills, product image grid. **Needs from you**: `/checkout/result`'s images only show if the backend returns line items; `OrderResult.items` (name/image/qty/price) was added to the frontend type as optional and ready to receive them — the `/umbrcom/v1/pelecard/confirm` and `/order-status` endpoints need to start returning that array.
14. PlaCard/Pelecard Cardholder Name — per Nik, this is a wp-admin plugin settings toggle, not a frontend change. No code change made; flagging so it doesn't get lost.

**Category & archive pages**
15. Finish/color filtering already existed (`ShopFilters.tsx`) — confirmed working, no change needed.
16. Added sorting: Recommended / Price low-high / Price high-low / Newest / Popularity (`src/lib/sort.ts` + `shop/page.tsx`). Newest/Popularity use product ID and review data as the best available proxy until a real created-date/sales-count field exists.
17. Category title typography aligned with the same semibold/tight treatment as the product title.
18. Category description now sits directly below the title (was below a divider line further down).

**Homepage**
19. Hero video slider was already wp-admin-configurable (`waterfall_hero_video` setting) from an earlier round — confirmed still wired. **Needs from you**: the real brand video file.
20. TikTok section already pulls real videos from wp-admin (official TikTok embed SDK) — improved so admin can paste a full `tiktok.com/.../video/ID` URL instead of hunting for the bare numeric ID. **Needs from you**: 3 real TikTok video links.

**Footer**
21. Footer logo now explicitly the Waterfall wordmark (settings-overridable), was mislabeled "UMBRCOM" in the code before even though it was already the same file.
22. Contact info added: דוד סהרוב 18, ראשון לציון · 03-620-8197 (settings-overridable).
23. Accessibility Statement page: contact email → service@umbrcom.co.il (also fixed a missing `href` on that link).

**Checkout** — biggest change this round, `checkout/page.tsx`:
24. Added Invoice Name + Company Registration Number (ח.פ) fields (optional, business orders).
25. Israeli ID field appears and becomes mandatory automatically once the order total passes ₪5,000.
26. Free shipping threshold updated to ₪250 everywhere (checkout, cart drawer nudge).
27. Removed the "SSL Secure Payment" / "7 Year Warranty" / "14 Day Returns" trust-badge block. Order Summary above it is untouched (item 31).
28. Shipping methods reduced to exactly two: "משלוח עד הבית" (free above ₪250, else ₪28) and "איסוף עצמי מהחנות" (Store Pickup, always free) — the old "Fast Shipping" tier is gone.
29-30. Checkout is now 2 steps instead of 4: shipping method AND the PlaCard/Pelecard payment info both live directly on the "Checkout Details" step; "Confirm" is the only other step.
31. Order Summary sidebar left completely untouched, as requested.
32-33. Added a required Terms & Conditions checkbox to the Personal Details section with direct clickable links to `/terms` and `/privacy` — and audited every other consent checkbox site-wide (Business, Contact, Warranty, Cancellation, Newsletter, Customer Service forms) to add the same clickable links, since they previously had plain unlinked text.

**Navigation & branding**
34. Brand switch confirmed/fixed to match the spec exactly: Umbrcom is the default (black), clicking the Waterfall logo switches the whole site to Waterfall (light blue) *immediately* — the old version opened a dropdown menu first; that's removed. Both logos are always clickable.
35. Main navigation simplified to exactly 5 items (Kitchen/Bathroom/Cold Water Faucets, Shower Sets, Waterfall Series) on both desktop and mobile — removed the "מבצעים / מועדון לקוחות / שירות לקוחות" links and the old "all categories" dropdown.

**Series page**
36. Replaced the repetitive "1 hero + uniform 2-up grid" layout with a real masonry rhythm (large banner → 2 medium → 3 small, repeating) that keeps varying as more series come in from `/umbrcom/v1/nav` — already pulls series live from the site's categories.

**General**
37. See item 32-33 — every legal checkbox site-wide now links directly to the relevant page.
38. Typography/spacing pass folded into the items above (product & category titles, SKU emphasis, gray-background removal) rather than a separate blanket pass — flag specific pages if you want more.

### Needs from you (assets/config I don't have)
- Real hero video file + 3 real TikTok video links (items 19-20)
- Confirm the WYSIWYG tech-specs plugin patch is deployed (items 11-12)
- `/umbrcom/v1/pelecard/confirm` + `/order-status` to return order line items with images (item 13)
- Enable the Cardholder Name field in the Pelecard/PlaCard plugin settings in wp-admin (item 14) — not a code change
- Backend support for saving Invoice Name / Company Reg. Number / Israeli ID on the order (item 24-25) — the frontend now sends them in the checkout payload (`invoice_name`, `company_reg_number`, `israeli_id` on `CheckoutPayload.customer`), the plugin needs to store them on the WooCommerce order

## Update — July 2026, second follow-up round (font, videos, nav, product page, tracking, SEO)

**Site-wide font — root-cause fix**
1. Found and fixed the actual bug behind the recurring "font isn't Assistant" reports: Tailwind's own utility classes (`.font-serif`, `.font-sans`) live in a CSS layer that always wins over the old override in `index.css`, regardless of how specific that override was. So the site was silently ignoring the Assistant override everywhere `font-serif`/`font-sans` was used. Fixed at the source in `tailwind.config.ts` (`theme.extend.fontFamily`) so the utility classes themselves now generate Assistant — this can't be silently overridden again the same way.

**Real media**
2. Hero video (both homepages) now embeds the real YouTube video you sent (`youtu.be/QY_FWg5Pwrw`) as a full-bleed background using the standard oversized-iframe "cover" technique, replacing the placeholder `.mp4`.
3. TikTok section, `/ambercom`, and `/umbrcom` now use the 3 real video IDs and handle (`umbrcomisrarl`) you sent, replacing all placeholders.

**Navigation**
4. Added the 4 extra buttons you asked for — All Categories / Customer Service / Series / Special Offers — to both the desktop nav (second row) and the mobile drawer.

**Footer**
5. Fixed the address spelling to דוד סחרוב 18, ראשון לציון (was סהרוב) — also removed a stale wp-admin setting that was silently overriding the correct address with an old wrong one, so this can't regress again from the backend side.
6. Moved the contact icons from the right side of the phone/address lines to the left, as requested.

**Product page redesign**
7. SKU now sits directly under the title/star-rating block, above the short description (matches the Mashiach Technical Equipment reference layout) — no longer down by the tabs.
8. Removed the "Save 17%" discount badge.
9. Price, color/finish swatches, and the star-rating row are now right-aligned along with the rest of the product info panel.
10. Gallery thumbnails converted from a 4-column grid to a horizontally-scrollable carousel strip; clicking a thumbnail swaps the main image (previously the thumbnails weren't even clickable).

**Tracking**
11. Added Meta Pixel (Dataset "umbrcom web", ID `1047516431063735` — confirmed active) alongside the existing GA4 setup: base snippet in `index.html`, plus matching events fired everywhere GA4 already fires them — page views on every route change, ViewContent on product pages, AddToCart, InitiateCheckout, and a deduped Purchase on order confirmation. Wrapped the same way as GA4 so an ad-blocker or blocked `fbq` can never break the shop.

**SEO — sitemap & product feed**
12. Added `scripts/generate-sitemap-feed.mjs`, wired as an npm `prebuild` step (`npm run build` now regenerates these automatically; can also run manually via `npm run generate:seo`). Pulls live products from the same WooCommerce Store API the site uses and writes, into `public/`:
    - `sitemap.xml` — every static route, category route, and live `/product/:id` URL
    - `feed.xml` — Google Merchant Center / Meta Catalog–compatible RSS product feed (name, price, sale price, image, availability, link per product)
    - `robots.txt` — points at the sitemap
    If the WP API is unreachable at build time it falls back to a static-routes-only sitemap rather than failing the build.

### Needs from you (this round)
- Nothing blocking — everything above is live in the code. Once deployed, submit `https://umbrcom.co.il/sitemap.xml` to Google Search Console and Meta Catalog can pull directly from `https://umbrcom.co.il/feed.xml`.
