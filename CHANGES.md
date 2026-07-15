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
