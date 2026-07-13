import PageLayout from "../../components/feature/PageLayout";
import { blogPosts } from "../../mocks/blogPosts";
import BlogCard from "./components/BlogCard";

export default function BlogPage() {
  return (
    <PageLayout>
      {/* Banner */}
      <div className="w-full bg-[#faf8f5] border-b border-[#ede9e1] py-14">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-[10px] font-medium tracking-[0.4em] text-[#1a1a1a] uppercase mb-3">
            המגזין שלנו
          </p>
          <h1 className="font-serif text-4xl font-light text-[#1a1410]">
            בלוג עיצוב ומדריכים
          </h1>
          <p className="mt-4 text-sm text-[#8a7a6a] max-w-lg mx-auto leading-relaxed">
            טיפים מקצועיים לבחירת ברזים, השראת עיצוב פנים ומדריכי תחזוקה — הכל מהצוות שלנו.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <section className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          {/* Featured first post */}
          <div className="mb-8">
            <BlogCard post={blogPosts[0]} featured />
          </div>

          {/* Rest */}
          <div className="grid grid-cols-3 gap-5">
            {blogPosts.slice(1).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
