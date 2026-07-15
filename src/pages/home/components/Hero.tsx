import { Link } from "react-router-dom";

// ── Replace VIDEO_SRC with your own Waterfall brand video URL ──────────────
// Supported: direct .mp4 URL — e.g. "https://your-cdn.com/waterfall-brand.mp4"
const VIDEO_SRC =
  "https://assets.mixkit.co/videos/preview/mixkit-hands-adjusting-a-modern-bathroom-faucet-40413-large.mp4";

const POSTER =
  "https://readdy.ai/api/search-image?query=ultra+luxury+modern+bathroom+interior+freestanding+marble+bathtub+elegant+brushed+gold+faucet+large+floor-to-ceiling+windows+soft+morning+light&width=1920&height=1080&seq=hero-video-poster-v1&orientation=landscape";

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", minHeight: "640px" }}
    >
      {/* ── Background video ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        poster={POSTER}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center" style={{ zIndex: 2 }}>
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-12">
          <div className="max-w-xl text-right">
            {/* Badge */}
            <div className="flex items-center justify-end gap-3 mb-6">
              <span className="text-[10px] font-semibold tracking-[0.45em] text-[#3ab4f2] uppercase">
                Waterfall Collection 2025
              </span>
              <span className="block w-8 h-px bg-[#3ab4f2]" />
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl font-light text-white leading-[1.1] mb-5">
              עיצוב שמרגישים.
              <br />
              <em className="not-italic font-semibold text-white">
                איכות שנשארת.
              </em>
            </h1>

            <div className="flex justify-end mb-5">
              <span className="block w-14 h-[1.5px] bg-white/40" />
            </div>

            {/* Sub */}
            <p className="text-white/75 text-base font-light leading-relaxed mb-10">
              ברזי מטבח ואמבטיה פרמיום מאוסף Waterfall.
              <br />
              עיצוב אירופאי, חומרים מושלמים, מחירים שמפתיעים לטובה.
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-end gap-4 mb-12">
              <Link
                to="/about"
                className="border border-white/50 hover:border-white text-white text-xs font-medium tracking-[0.2em] px-7 py-3.5 rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                אודות אמברקום
              </Link>
              <Link
                to="/shop"
                className="bg-[#3ab4f2] hover:bg-[#2da0d8] text-white text-xs font-semibold tracking-[0.2em] px-8 py-3.5 rounded-full transition-colors duration-300 whitespace-nowrap cursor-pointer shadow-lg"
              >
                לחנות שלנו
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 2 }}
      >
        <div className="w-5 h-8 rounded-full border border-white/40 flex items-start justify-center pt-1.5">
          <div className="w-0.5 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
