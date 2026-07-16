import CmsPage from "../../components/feature/CmsPage";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import CategoriesSection from "./components/CategoriesSection";
import FeaturedProducts from "./components/FeaturedProducts";
import TestimonialsSection from "./components/TestimonialsSection";
import ArticlesSection from "./components/ArticlesSection";
import TikTokSection from "./components/TikTokSection";

/** The static, hand-built homepage — used whenever WordPress isn't
 *  configured, or the "home" page hasn't been built with Page Builder yet. */
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
  return <CmsPage slug="home" fallback={<StaticHome />} />;
}
