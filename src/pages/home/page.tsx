import { useEffect, useState } from "react";
import PageLayout from "../../components/feature/PageLayout";
import PageBuilder from "../../components/feature/PageBuilder";
import { fetchPageSections, isWpConfigured, PageSection } from "@/lib/wp-api";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import CategoriesSection from "./components/CategoriesSection";
import FeaturedProducts from "./components/FeaturedProducts";
import TestimonialsSection from "./components/TestimonialsSection";
import ArticlesSection from "./components/ArticlesSection";
import TikTokSection from "./components/TikTokSection";

/** The static, hand-built homepage — used whenever WordPress isn't
 *  configured (VITE_WP_API_URL unset) or the "home" page hasn't been built
 *  with the Page Builder yet, so local frontend dev never breaks. */
function StaticHome() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoriesSection />
      <FeaturedProducts />
      <TestimonialsSection />
      <TikTokSection />
      <ArticlesSection />
    </>
  );
}

export default function Home() {
  const [sections, setSections] = useState<PageSection[] | null>(null);
  const [loaded, setLoaded] = useState(!isWpConfigured());

  useEffect(() => {
    if (!isWpConfigured()) return;
    fetchPageSections("home").then((page) => {
      setSections(page?.sections?.length ? page.sections : null);
      setLoaded(true);
    });
  }, []);

  return (
    <PageLayout>
      {!loaded ? null : sections ? <PageBuilder sections={sections} /> : <StaticHome />}
    </PageLayout>
  );
}
