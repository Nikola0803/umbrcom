import { Link } from "react-router-dom";

const productImages = [
  {
    src: "https://umbrcom.co.il/wp-content/uploads/2025/10/500824_181.webp",
    to: "/shop",
    label: "ברזי מטבח",
  },
  {
    src: "https://umbrcom.co.il/wp-content/uploads/2025/10/500824_180.webp",
    to: "/shop/kitchen",
    label: "אוסף Waterfall",
  },
  {
    src: "https://umbrcom.co.il/wp-content/uploads/2025/10/500824_182.webp",
    to: "/shop",
    label: "עיצוב פנים",
  },
  {
    src: "https://umbrcom.co.il/wp-content/uploads/2025/10/500824_178.webp",
    to: "/shop/bathroom",
    label: "ברזי כיור רחצה",
  },
  {
    src: "https://umbrcom.co.il/wp-content/uploads/2025/10/500824_183.webp",
    to: "/shop/cold-water",
    label: "ברזי מים קרים",
  },
  {
    src: "https://umbrcom.co.il/wp-content/uploads/2025/10/500824_179.webp",
    to: "/shop",
    label: "השראה לבית",
  },
];

export default function ProductGrid() {
  return (
    <section className="w-full bg-white py-16">
      {/* Section header */}
      <div className="max-w-5xl mx-auto px-8 text-center mb-10">
        <p className="text-xs font-medium tracking-[0.3em] text-[#1a1a1a] uppercase mb-3">
          גלריה
        </p>
        <h2 className="font-serif text-3xl font-medium text-[#0d0d0d] leading-snug">
          עיצוב שמדבר בעד עצמו
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-6">
        {productImages.map((img, idx) => (
          <Link
            key={idx}
            to={img.to}
            className="block overflow-hidden group cursor-pointer relative"
          >
            <div className="relative w-full" style={{ paddingTop: "100%" }}>
              <img
                src={img.src}
                alt={img.label}
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-108"
                style={{ transition: "transform 0.7s ease" }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#0d0d0d]/0 group-hover:bg-[#0d0d0d]/40 transition-all duration-500 flex items-end justify-center pb-5">
                <span className="text-white text-sm font-medium tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 delay-100">
                  {img.label}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View all */}
      <div className="text-center mt-10">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0d0d0d] border border-[#0d0d0d] px-8 py-3 hover:bg-[#0d0d0d] hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap"
        >
          לכל המוצרים
          <i className="ri-arrow-left-line text-sm"></i>
        </Link>
      </div>
    </section>
  );
}
