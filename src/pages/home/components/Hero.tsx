import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSettings } from "@/lib/wp-api";
import { youtubeBackgroundEmbedUrl, youtubeIdFrom, loadYouTubeIframeApi, YTPlayerInstance } from "@/lib/youtube";

// ── ITEM 19 (July 2026): real hero video supplied by Ben — a YouTube link,
//    not an .mp4 file, so it renders as a chrome-free autoplaying/looping
//    YouTube embed (see youtubeBackgroundEmbedUrl) instead of a plain
//    <video> tag. Still overridable from wp-admin → UMBRCOM → Site Settings
//    → "Waterfall hero video" (field `waterfall_hero_video`) — that field
//    accepts either a YouTube link or a direct .mp4 URL, detected below.
const VIDEO_SRC = "https://youtu.be/QY_FWg5Pwrw";

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
  const youtubeBg = youtubeBackgroundEmbedUrl(videoSrc);
  const youtubeId = youtubeIdFrom(videoSrc);

  // Belt-and-suspenders autoplay: the `autoplay=1&mute=1` URL params on the
  // iframe below work in most browsers, but silently fail to autoplay in
  // some (notably Safari/iOS). Once the YouTube IFrame API is ready we grab
  // the same iframe as a player and explicitly call mute()+playVideo(),
  // which is Google's documented fix for that gap.
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const iframeIdRef = useRef(`hero-yt-${Math.random().toString(36).slice(2, 9)}`);
  useEffect(() => {
    if (!youtubeId) return;
    let cancelled = false;
    loadYouTubeIframeApi().then(() => {
      if (cancelled || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(iframeIdRef.current, {
        videoId: youtubeId,
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.playVideo();
          },
          onStateChange: (e) => {
            // Belt-and-suspenders loop, in case the `loop`+`playlist` URL
            // params don't take effect for a player constructed this way.
            if (window.YT?.PlayerState && e.data === window.YT.PlayerState.ENDED) {
              e.target.seekTo(0, true);
              e.target.playVideo();
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [youtubeId]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100vh - 160px)", minHeight: "560px" }}
    >
      {/* ── Background video — YouTube embed when the source is a YouTube
          link, plain <video> for a direct .mp4 URL. The iframe is
          oversized + centered so it always covers the section like
          object-fit: cover would on a native <video>. ── */}
      {youtubeBg ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <iframe
            id={iframeIdRef.current}
            src={youtubeBg}
            title="Waterfall — hero video"
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: "177.78vh", height: "100vh", minWidth: "100%", minHeight: "56.25vw" }}
            frameBorder={0}
          />
        </div>
      ) : (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
        />
      )}

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
