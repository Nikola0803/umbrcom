import { Link } from "react-router-dom";
import { useBrand } from "@/hooks/useBrand";

export interface CTABannerProps {
  heading: string;
  subheading?: string;
  buttonLabel?: string;
  buttonLink?: string;
  backgroundImage?: string;
  theme?: "light" | "dark";
}

/** Full-width call-to-action strip — a Page Builder layout ("CTA Banner")
 *  editable from wp-admin, for promos, seasonal campaigns, etc. */
export default function CTABanner({
  heading,
  subheading,
  buttonLabel,
  buttonLink = "/shop",
  backgroundImage,
  theme = "light",
}: CTABannerProps) {
  const brand = useBrand();
  const isLight = theme === "light"; // "light" = light text, i.e. dark background

  return (
    <section
      className="relative w-full py-20 overflow-hidden"
      style={{ backgroundColor: isLight ? "#0d0d0d" : "#f6f6f6" }}
    >
      {backgroundImage && (
        <>
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? "linear-gradient(to top, rgba(13,13,13,0.9), rgba(13,13,13,0.5))"
                : "linear-gradient(to top, rgba(246,246,246,0.9), rgba(246,246,246,0.5))",
            }}
          />
        </>
      )}
      <div className="relative max-w-3xl mx-auto px-8 text-center" dir="rtl">
        <h2
          className="font-serif text-3xl sm:text-4xl font-light mb-3"
          style={{ color: isLight ? "#fff" : "#0d0d0d" }}
        >
          {heading}
        </h2>
        {subheading && (
          <p className="text-sm sm:text-base mb-8" style={{ color: isLight ? "rgba(255,255,255,0.7)" : "#666" }}>
            {subheading}
          </p>
        )}
        {buttonLabel && (
          <Link
            to={buttonLink}
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.15em] text-white px-8 py-3.5 rounded-full transition-colors cursor-pointer hover:opacity-90"
            style={{ backgroundColor: brand.color }}
          >
            {buttonLabel}
            <i className="ri-arrow-left-line text-sm"></i>
          </Link>
        )}
      </div>
    </section>
  );
}
