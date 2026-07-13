import { Link } from "react-router-dom";
import { blogPosts } from "../../../mocks/blogPosts";
import BlogCard from "../../blog/components/BlogCard";

const PREVIEW = blogPosts.slice(0, 3);

export default function BlogPreviewSection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div className="text-left">
            <p className="text-[10px] font-medium tracking-[0.35em] text-[#1a1a1a] uppercase mb-2">
              הבלוג שלנו
            </p>
            <h2 className="font-serif text-3xl font-light text-[#1a1410]">
              טיפים, עיצוב ומדריכים
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden md:inline-flex items-center gap-2 text-xs font-medium text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:text-[#333333] hover:border-[#333333] transition-colors cursor-pointer whitespace-nowrap"
          >
            לכל הפוסטים
            <i className="ri-arrow-left-line text-xs"></i>
          </Link>
        </div>

        {/* Masonry-style grid: featured tall left, two shorter right */}
        <div className="grid grid-cols-3 gap-5 items-start">
          {PREVIEW.map((post, idx) => (
            <BlogCard key={post.id} post={post} featured={idx === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
