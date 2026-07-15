import { Link } from "react-router-dom";
import PageLayout from "../../components/feature/PageLayout";
import { blogPosts } from "../../mocks/blogPosts";
import BlogCard from "./components/BlogCard";

/**
 * Articles page (item 13) — magazine layout matching the new homepage
 * articles style: full-width featured story with overlapping text card,
 * then a clean grid.
 */
export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <PageLayout>
      {/* Banner */}
      <div className="w-full bg-white border-b border-[#eee] py-14">
        <div className="max-w-6xl mx-auto px-8 text-right">
          <p className="text-[10px] font-medium tracking-[0.4em] text-[#3ab4f2] uppercase mb-3">
            המגזין שלנו
          </p>
          <h1 className="font-serif text-4xl font-light text-[#1a1410]">
            כתבות, עיצוב ומדריכים
          </h1>
          <p className="mt-4 text-sm text-[#8a7a6a] max-w-lg mx-auto leading-relaxed">
            טיפים מקצועיים לבחירת ברזים, השראת עיצוב פנים ומדריכי תחזוקה — הכל מהצוות שלנו.
          </p>
        </div>
      </div>

      <section className="w-full bg-white py-16" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          {/* ── Featured story — image with overlapping text card ── */}
          {featured && (
            <Link to={`/blog/${featured.slug}`} className="group block cursor-pointer mb-14">
              <div className="relative">
                <div className="overflow-hidden rounded-2xl h-[320px] sm:h-[440px]">
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="relative mx-4 sm:mx-16 -mt-20 bg-white rounded-xl shadow-[0_14px_40px_rgba(0,0,0,0.10)] p-6 sm:p-8 text-right">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] text-[#999]">{featured.date} · {featured.readingTime}</span>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full text-white bg-[#3ab4f2]">
                      {featured.category}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#0d0d0d] leading-snug mb-3 group-hover:opacity-80 transition-opacity">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-[#666] leading-relaxed line-clamp-2 mb-4 max-w-2xl mr-0 ml-auto">
                    {featured.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3ab4f2]">
                    לכתבה המלאה
                    <i className="ri-arrow-left-line text-xs" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* ── Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
