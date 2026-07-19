import { useEffect, useState } from "react";
import type { PageSection, WpSettings } from "@/lib/wp-api";
import { fetchProductById, fetchSettings, fetchPosts, fetchNav } from "@/lib/wp-api";
import { allProducts, Product } from "@/mocks/products";
import { blogPosts } from "@/mocks/blogPosts";

import Hero from "@/pages/home/components/Hero";
import TrustStrip from "@/pages/home/components/TrustStrip";
import CategoriesSection, { CategoryTile } from "@/pages/home/components/CategoriesSection";
import FeaturedProducts from "@/pages/home/components/FeaturedProducts";
import TestimonialsSection from "@/pages/home/components/TestimonialsSection";
import TikTokSection from "@/pages/home/components/TikTokSection";
import ArticlesSection from "@/pages/home/components/ArticlesSection";
import RichTextBlock from "@/pages/home/components/RichTextBlock";
import CTABanner from "@/pages/home/components/CTABanner";
import PageHeader from "@/pages/home/components/PageHeader";
import InfoTiles, { InfoTile } from "@/pages/home/components/InfoTiles";

interface PageBuilderProps {
  sections: PageSection[];
}

/**
 * Renders the "Page Sections" flexible content field from any WordPress
 * Page (see the plugin's class-acf-fields.php) as the matching React
 * component. This is what makes "any page, any content" real: adding,
 * removing, or reordering sections in wp-admin changes what renders here
 * with zero frontend deploys.
 *
 * Unknown/future layout names are skipped safely (with a console warning)
 * rather than crashing the page.
 */
export default function PageBuilder({ sections }: PageBuilderProps) {
  const [settings, setSettings] = useState<WpSettings | null>(null);

  useEffect(() => {
    // Only needed for the tiktok_section layout, but it's cheap and cached
    // by the browser — fetched once regardless of how many sections use it.
    if (sections.some((s) => s.type === "tiktok_section")) {
      fetchSettings().then(setSettings);
    }
  }, [sections]);

  return (
    <>
      {sections.map((section, i) => {
        switch (section.type) {
          case "hero_video":
            return (
              <Hero
                key={i}
                eyebrow={section.eyebrow as string}
                heading={section.heading as string}
                headingEmphasis={section.heading_emphasis as string}
                subheading={section.subheading as string}
                video={(section.video as string) || undefined}
                poster={(section.poster_image as string) || undefined}
                button1Label={section.button_1_label as string}
                button1Link={section.button_1_link as string}
                button2Label={section.button_2_label as string}
                button2Link={section.button_2_link as string}
              />
            );

          case "trust_strip": {
            const perks = section.perks as { icon: string; title: string; subtitle: string }[] | undefined;
            return (
              <TrustStrip
                key={i}
                perks={perks?.map((p) => ({ icon: p.icon, title: p.title, sub: p.subtitle }))}
              />
            );
          }

          case "categories_grid":
            return (
              <CategoriesGridResolved
                key={i}
                eyebrow={section.eyebrow as string}
                heading={section.heading as string}
                categoryIds={(section.categories as number[]) ?? []}
              />
            );

          case "featured_products":
            return (
              <FeaturedProductsResolved
                key={i}
                eyebrow={section.eyebrow as string}
                heading={section.heading as string}
                viewAllLink={section.view_all_link as string}
                productIds={(section.products as number[]) ?? []}
              />
            );

          case "testimonials": {
            const items = section.items as
              | { name: string; role: string; quote: string; rating: number; avatar: string }[]
              | undefined;
            return (
              <TestimonialsSection
                key={i}
                heading={section.heading as string}
                reviews={items?.map((t, idx) => ({
                  id: idx,
                  name: t.name,
                  location: t.role,
                  stars: t.rating,
                  text: t.quote,
                  product: "",
                  avatar: t.avatar,
                }))}
              />
            );
          }

          case "tiktok_section": {
            const brandKey = (section.brand as string) === "ambercom" ? "ambercom" : "waterfall";
            const brandSettings = settings?.tiktok?.[brandKey];
            const accent =
              brandKey === "ambercom" ? settings?.brand?.ambercom_color : settings?.brand?.waterfall_color;
            return (
              <TikTokSection
                key={i}
                brandName={brandKey === "ambercom" ? "UMBRCOM" : "Waterfall"}
                handle={brandSettings?.handle}
                accent={accent}
                videos={brandSettings?.videos}
              />
            );
          }

          case "articles_section": {
            const ids = (section.posts as number[]) ?? [];
            return (
              <ArticlesSectionResolved
                key={i}
                eyebrow={section.eyebrow as string}
                heading={section.heading as string}
                postIds={ids}
              />
            );
          }

          case "page_header":
            return (
              <PageHeader
                key={i}
                icon={(section.icon as string) || undefined}
                eyebrow={(section.eyebrow as string) || undefined}
                heading={(section.heading as string) ?? ""}
                subheading={(section.subheading as string) || undefined}
              />
            );

          case "info_tiles": {
            const tiles = (section.tiles as InfoTile[] | undefined) ?? [];
            return (
              <InfoTiles
                key={i}
                heading={(section.heading as string) || undefined}
                tiles={tiles}
                style={(section.style as "cards" | "circles") ?? "cards"}
              />
            );
          }

          case "rich_text":
            return <RichTextBlock key={i} content={(section.content as string) ?? ""} />;

          case "cta_banner":
            return (
              <CTABanner
                key={i}
                heading={section.heading as string}
                subheading={section.subheading as string}
                buttonLabel={section.button_label as string}
                buttonLink={section.button_link as string}
                backgroundImage={section.background_image as string}
                theme={(section.theme as "light" | "dark") ?? "light"}
              />
            );

          default:
            console.warn(`[PageBuilder] Unknown layout "${section.type}" — skipped.`);
            return null;
        }
      })}
    </>
  );
}

/** Resolves the categories_grid section to live WooCommerce categories
 *  (with their admin-managed tile image/label) via /umbrcom/v1/nav. Falls
 *  back to CategoriesSection's own placeholder tiles otherwise. */
function CategoriesGridResolved({
  eyebrow,
  heading,
  categoryIds,
}: {
  eyebrow?: string;
  heading?: string;
  categoryIds: number[];
}) {
  const [tiles, setTiles] = useState<CategoryTile[] | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetchNav().then((nav) => {
      if (cancelled || !nav) return;
      let cats = nav.categories;
      if (categoryIds.length > 0) {
        const wanted = new Set(categoryIds);
        cats = categoryIds
          .map((id) => nav.categories.find((c) => c.id === id))
          .filter((c): c is NonNullable<typeof c> => Boolean(c) && wanted.has(c!.id));
      }
      if (cats.length > 0) {
        setTiles(
          cats.map((c) => ({
            key: c.slug,
            title: c.label,
            path: c.link,
            image: c.image,
          }))
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [categoryIds]);

  return <CategoriesSection eyebrow={eyebrow} heading={heading} categories={tiles} />;
}

/** Resolves an ACF relationship field (product IDs) to full Product objects.
 *  Falls back to the local mock catalog if the WordPress product IDs don't
 *  resolve (e.g. during frontend-only development). */
function FeaturedProductsResolved({
  eyebrow,
  heading,
  viewAllLink,
  productIds,
}: {
  eyebrow?: string;
  heading?: string;
  viewAllLink?: string;
  productIds: number[];
}) {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts(null); // FeaturedProducts falls back to its own defaults
      return;
    }
    let cancelled = false;
    Promise.all(productIds.map((id) => fetchProductById(id))).then((results) => {
      if (cancelled) return;
      const resolved = results.filter((p): p is NonNullable<typeof p> => p !== null);
      setProducts(resolved.length > 0 ? resolved : null);
    });
    return () => {
      cancelled = true;
    };
  }, [productIds]);

  return (
    <FeaturedProducts
      eyebrow={eyebrow}
      heading={heading}
      viewAllLink={viewAllLink}
      products={products ?? undefined}
    />
  );
}

/** Same pattern as above, for the Articles section's relationship field. */
function ArticlesSectionResolved({
  eyebrow,
  heading,
  postIds,
}: {
  eyebrow?: string;
  heading?: string;
  postIds: number[];
}) {
  const [posts, setPosts] = useState<typeof blogPosts | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPosts().then((all) => {
      if (cancelled || !all) return;
      if (postIds.length === 0) {
        setPosts(all.slice(0, 4));
      } else {
        const byId = new Map(all.map((p) => [p.id, p]));
        const resolved = postIds.map((id) => byId.get(String(id))).filter((p): p is NonNullable<typeof p> => Boolean(p));
        setPosts(resolved.length > 0 ? resolved : all.slice(0, 4));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [postIds]);

  return <ArticlesSection eyebrow={eyebrow} heading={heading} posts={posts ?? undefined} />;
}
