import { useEffect, useState } from "react";
import { fetchSettings } from "@/lib/wp-api";

// ── Reusable TikTok video template — used on BOTH homepages ──────────────
// Items 19-20 (July 2026): real videos supplied by Nik, downloaded directly
// from @umbrcomisrarl (via ssstik.io) and hosted on the WP media library as
// plain .mp4 files — NOT real TikTok video IDs/URLs. There's no API key for
// TikTok, so this renders them as native <video> elements instead of trying
// to use TikTok's oEmbed/blockquote embed (which requires the video to
// still be live on tiktok.com under its original ID — these are downloaded
// copies with no such ID, which is exactly why the old blockquote-embed
// approach silently rendered nothing).
const DEFAULT_VIDEOS = [
  {
    src: "https://admin.umbrcom.co.il/wp-content/uploads/2026/07/ssstik.io_@umbrcomisrarl_1785443508435.mp4",
    caption: "צפו בסרטון שלנו ב-TikTok",
  },
  {
    src: "https://admin.umbrcom.co.il/wp-content/uploads/2026/07/ssstik.io_@umbrcomisrarl_1785443538815.mp4",
    caption: "צפו בסרטון שלנו ב-TikTok",
  },
  {
    src: "https://admin.umbrcom.co.il/wp-content/uploads/2026/07/ssstik.io_@umbrcomisrarl_1785443520718.mp4",
    caption: "צפו בסרטון שלנו ב-TikTok",
  },
];

export interface TikTokSectionProps {
  /** Brand title, e.g. "Waterfall" / "UMBRCOM" */
  brandName?: string;
  /** TikTok handle without @ */
  handle?: string;
  /** Accent color for the follow button hover / decorations */
  accent?: string;
  videos?: { src: string; caption: string }[];
}

export default function TikTokSection({
  brandName = "Waterfall",
  handle = "umbrcomisrarl",
  accent = "#3ab4f2",
  videos = DEFAULT_VIDEOS,
}: TikTokSectionProps) {
  // When no explicit videos prop was passed, use the videos configured in
  // wp-admin Site Settings, if any (same direct-file-link shape as above).
  const [settingsVideos, setSettingsVideos] = useState<{ src: string; caption: string }[] | null>(null);
  useEffect(() => {
    if (videos !== DEFAULT_VIDEOS) return; // Page Builder already supplied them
    fetchSettings().then((s) => {
      const v = s?.tiktok?.waterfall?.videos as { src?: string; id?: string; caption: string }[] | undefined;
      if (v && v.length > 0) {
        // Tolerate either shape (src = direct file link, id = legacy field
        // that may have had a direct link pasted into it too).
        const normalized = v
          .map((x) => ({ src: x.src || x.id || "", caption: x.caption }))
          .filter((x) => x.src);
        if (normalized.length > 0) setSettingsVideos(normalized);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const shownVideos = videos === DEFAULT_VIDEOS && settingsVideos ? settingsVideos : videos;

  return (
    <section className="w-full bg-[#0a0a0a] py-20 overflow-hidden" dir="rtl">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header */}
        <div className="text-right mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-px" style={{ backgroundColor: `${accent}44` }} />
            <i className="ri-tiktok-line text-white text-xl"></i>
            <span className="w-8 h-px" style={{ backgroundColor: `${accent}44` }} />
          </div>
          <h2 className="font-serif text-3xl font-light text-white mb-3">
            {brandName} על TikTok
          </h2>
          <p className="text-sm text-white/50 max-w-lg mx-auto">
            צפו בסרטוני המוצרים, ההתקנה והיצירות שלנו — וגם עקבו אחרינו!
          </p>
          <a
            href={`https://www.tiktok.com/@${handle}`}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 text-xs font-semibold tracking-[0.2em] text-white border border-white/30 px-6 py-2.5 rounded-full transition-colors duration-200 cursor-pointer"
            style={{ borderColor: undefined }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
          >
            <i className="ri-tiktok-line text-sm"></i>
            @{handle} — עקבו אחרינו
          </a>
        </div>

        {/* Video grid — native <video> tags pointing at the direct .mp4
            files (no TikTok API/embed available). */}
        {shownVideos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
          {shownVideos.map((v) => (
            <div key={v.src} className="w-full max-w-[320px]">
              <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: "9 / 16" }}>
                <video
                  src={v.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-white/60 mt-3 text-right">{v.caption}</p>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
