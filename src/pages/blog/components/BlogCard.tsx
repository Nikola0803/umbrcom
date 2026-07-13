import { Link } from "react-router-dom";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  readingTime: string;
  date: string;
  author: string;
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col cursor-pointer overflow-hidden rounded-2xl border border-[#ede9e1] hover:border-[#1a1a1a]/30 transition-all duration-300 bg-white"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#faf8f5] w-full h-52">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <span className="text-[10px] font-semibold tracking-widest uppercase bg-white/90 text-[#1a1a1a] px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>
        {featured && (
          <div className="absolute bottom-4 left-4">
            <span className="text-[10px] font-semibold tracking-widest uppercase bg-[#1a1a1a] text-white px-3 py-1 rounded-full">
              מומלץ
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 flex-1 text-right p-5">
        <div className="flex items-center justify-end gap-3 text-[11px] text-[#9a8a7a]">
          <span>{post.readingTime}</span>
          <span className="w-1 h-1 rounded-full bg-[#888]/40" />
          <span>{post.date}</span>
        </div>

        <h3 className="font-serif font-medium text-[#1a1410] leading-snug group-hover:text-[#1a1a1a] transition-colors text-base">
          {post.title}
        </h3>

        <p className="text-sm text-[#6a5e52] leading-relaxed flex-1 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[#f0ece5] mt-auto">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1a1a1a] group-hover:gap-2 transition-all">
            <i className="ri-arrow-left-line text-xs" />
            קרא עוד
          </span>
          <span className="text-[11px] text-[#9a8a7a]">{post.author}</span>
        </div>
      </div>
    </Link>
  );
}
