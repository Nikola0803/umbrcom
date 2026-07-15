import { Link } from "react-router-dom";
import { blogPosts } from "../../../mocks/blogPosts";
import { useBrand } from "@/hooks/useBrand";

/**
 * Homepage articles — editorial / magazine style (item 18):
 * one large featured story with the text card overlapping the image,
 * plus a column of compact horizontal stories on the side.
 */
export default function ArticlesSection() {
  const brand = useBrand();
  const [featured, ...rest] = blogPosts.slice(0, 4);
  if (!featured) return null;

  return (
    <section className="w-full bg-white py-20" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px]" style={{ backgroundColor: brand.color }} />
              <p className="text-[10px] font-semibold tracking-[0.35em] uppercase" style={{ color: brand.color }}>
                המגזין
              </p>
            </div>
            <h2 className="font-serif text-3xl font-light text-[#0d0d0d]">
              כתבות, השראה ומדריכים
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden md:inline-flex items-center gap-2 text-xs font-medium text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:opacity-70 transition-opacity cursor-pointer whitespace-nowrap"
          >
            לכל הכתבות
            <i className="ri-arrow-left-line text-xs"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          {/* ── Featured story — image with overlapping text card ── */}
          <Link to={`/blog/${featured.slug}`} className="group block cursor-pointer">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl h-[340px] sm:h-[400px]">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Overlapping card */}
              <div className="relative mx-4 sm:mx-8 -mt-16 bg-white rounded-xl shadow-[0_14px_40px_rgba(0,0,0,0.10)] p-6 sm:p-7 text-right">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-[#999]">{featured.date} · {featured.readingTime}</span>
                  <span
                    className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: brand.color }}
                  >
                    {featured.category}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#0d0d0d] leading-snug mb-2 group-hover:opacity-80 transition-opacity">
                  {featured.title}
                </h3>
                <p className="text-sm text-[#666] leading-relaxed line-clamp-2 mb-4">
                  {featured.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: brand.color }}>
                  לקריאת הכתבה
                  <i className="ri-arrow-left-line text-xs" />
                </span>
              </div>
            </div>
          </Link>

          {/* ── Side column — compact horizontal stories ── */}
          <div className="flex flex-col divide-y divide-[#eee]">
            {rest.map((post, idx) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group flex gap-4 py-5 first:pt-0 cursor-pointer"
              >
                {/* Index number, editorial touch */}
                <span className="font-serif text-3xl font-light leading-none pt-1 w-8 flex-shrink-0 text-right" style={{ color: `${brand.color}55` }}>
                  {String(idx + 2).padStart(2, "0")}
                </span>
                <div className="flex-1 text-right">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5" style={{ color: brand.color }}>
                    {post.category}
                  </p>
                  <h4 className="text-sm font-medium text-[#1a1a1a] leading-snug line-clamp-2 group-hover:opacity-70 transition-opacity mb-1.5">
                    {post.title}
                  </h4>
                  <span className="text-[11px] text-[#aaa]">{post.date} · {post.readingTime}</span>
                </div>
                <div className="w-[86px] h-[74px] rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </Link>
            ))}

            {/* Mobile CTA */}
            <Link
              to="/blog"
              className="md:hidden inline-flex items-center justify-center gap-2 text-sm font-medium text-[#0d0d0d] border border-[#0d0d0d] rounded-full px-8 py-3 mt-6 cursor-pointer"
            >
              לכל הכתבות
              <i className="ri-arrow-left-line text-sm"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
