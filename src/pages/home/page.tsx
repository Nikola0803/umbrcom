import PageLayout from "../../components/feature/PageLayout";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import SocialSection from "./components/SocialSection";
import CategoriesSection from "./components/CategoriesSection";
import FeaturedProducts from "./components/FeaturedProducts";
import TestimonialsSection from "./components/TestimonialsSection";
import BlogPreviewSection from "./components/BlogPreviewSection";
import TikTokSection from "./components/TikTokSection";

export default function Home() {
  return (
    <PageLayout>
      <Hero />
      <TrustStrip />
      <CategoriesSection />
      <FeaturedProducts />
      <TestimonialsSection />
      <TikTokSection />
      <SocialSection />
      <BlogPreviewSection />
    </PageLayout>
  );
}
