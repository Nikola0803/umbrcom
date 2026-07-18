import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSettings } from "@/lib/wp-api";

// ── ITEM 5 (July 2026): the homepage hero video. The real brand video can
//    be set in wp-admin → UMBRCOM → Site Settings → "Waterfall hero video"
//    (field `waterfall_hero_video`) and it will be used automatically.
//    Until then, this placeholder plays. To hard-code it instead, replace
//    the URL below.
const VIDEO_SRC =
  "https://assets.mixkit.co/videos/preview/mixkit-hands-adjusting-a-modern-bathroom-faucet-40413-large.mp4";

const POSTER =
  "https://readdy.ai/api/search-image?query=ultra+luxury+modern+bathroom+interior+freestanding+marble+bathtub+elegant+brushed+gold+faucet+large+floor-to-ceiling+windows+soft+morning+light&width=1920&height=1080&seq=hero-video-poster-v1&orientation=landscape";

export interface HeroProps {
  eyebrow?: string;
  heading?: string;
  headingEmphasis?: string;
  subheading?: string;
  video?: string;
  poster?: string;
  button1Label?: string;
  button1Link?: string;
  button2Label?: string;
  button2Link?: string;
}

export default function Hero({
  eyebrow = "Waterfall Collection 2025",
  heading = "עיצוב שמרגישים.",
  headingEmphasis = "איכות שנשארת.",
  subheading = "ברזי מטבח ואמבטיה פרמיום מאוסף Waterfall.\nעיצוב אירופאי, חומרים מושלמים, מחירים שמפתיעים לטובה.",
  video = VIDEO_SRC,
  poster = POSTER,
  button1Label = "אודות אמברקום",
  button1Link = "/about",
  button2Label = "לחנות שלנו",
  button2Link = "/shop",
}: HeroProps) {
  const subLines = subheading.split("\n");

  // When no explicit video prop was passed (static homepage), use the video
  // configured in wp-admin Site Settings, if any.
  const [settingsVideo, setSettingsVideo] = useState<string | null>(null);
  useEffect(() => {
    if (video !== VIDEO_SRC) return; // Page Builder already supplied one
    fetchSettings().then((s) => {
      if (s?.brand?.waterfall_hero_video) setSettingsVideo(s.brand.waterfall_hero_video);
    });
  }, [video]);
  const videoSrc = video === VIDEO_SRC && settingsVideo ? settingsVideo : video;
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100vh - 160px)", minHeight: "560px" }}
    >
      {/* ── Background video ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
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
                {eyebrow}
              </span>
              <span className="block w-8 h-px bg-[#3ab4f2]" />
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl font-light text-white leading-[1.1] mb-5">
              {heading}
              <br />
              <em className="not-italic font-semibold text-white">
                {headingEmphasis}
              </em>
            </h1>

            <div className="flex justify-end mb-5">
              <span className="block w-14 h-[1.5px] bg-white/40" />
            </div>

            {/* Sub */}
            <p className="text-white/75 text-base font-light leading-relaxed mb-10">
              {subLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < subLines.length - 1 && <br />}
                </span>
              ))}
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-end gap-4 mb-12">
              <Link
                to={button1Link}
                className="border border-white/50 hover:border-white text-white text-xs font-medium tracking-[0.2em] px-7 py-3.5 rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                {button1Label}
              </Link>
              <Link
                to={button2Link}
                className="bg-[#3ab4f2] hover:bg-[#2da0d8] text-white text-xs font-semibold tracking-[0.2em] px-8 py-3.5 rounded-full transition-colors duration-300 whitespace-nowrap cursor-pointer shadow-lg"
              >
                {button2Label}
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
