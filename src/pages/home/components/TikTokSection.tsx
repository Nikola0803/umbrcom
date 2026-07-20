import { useEffect, useState } from "react";
import { fetchSettings } from "@/lib/wp-api";

// ── Reusable TikTok video template — used on BOTH homepages ──────────────
// ITEM 7 (July 2026): the 3 real TikTok videos can be set in wp-admin →
// UMBRCOM → Site Settings → TikTok (video ID + caption per row) and they
// will replace these placeholders automatically. To hard-code instead,
// paste the real IDs below — the ID is the number in the video URL:
// tiktok.com/@1umbrcom/video/VIDEO_ID_HERE
const DEFAULT_VIDEOS = [
  { id: "7448000000000000001", caption: "ברז מטבח Waterfall חדש" },
  { id: "7448000000000000002", caption: "ציפוי רוז גולד — מדהים" },
  { id: "7448000000000000003", caption: "התקנה פשוטה בדקות" },
];

// Placeholder IDs (7448000000000000xxx) are not real TikTok videos — every
// one of them triggers a 400 from TikTok plus a wall of embed-SDK console
// noise. Filter them out everywhere so only real videos ever render.
const isPlaceholderId = (id: string) => /^74480{12}\d{3}$/.test(id);
const realOnly = (v: { id: string; caption: string }[]) =>
  v.filter((x) => x.id && !isPlaceholderId(x.id));

declare global {
  interface Window { // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tiktokEmbedded?: any;
  }
}

export interface TikTokSectionProps {
  /** Brand title, e.g. "Waterfall" / "UMBRCOM" */
  brandName?: string;
  /** TikTok handle without @ */
  handle?: string;
  /** Accent color for the follow button hover / decorations */
  accent?: string;
  videos?: { id: string; caption: string }[];
}

export default function TikTokSection({
  brandName = "Waterfall",
  handle = "1umbrcom",
  accent = "#3ab4f2",
  videos = DEFAULT_VIDEOS,
}: TikTokSectionProps) {
  // When no explicit videos prop was passed, use the videos configured in
  // wp-admin Site Settings, if any.
  const [settingsVideos, setSettingsVideos] = useState<{ id: string; caption: string }[] | null>(null);
  useEffect(() => {
    if (videos !== DEFAULT_VIDEOS) return; // Page Builder already supplied them
    fetchSettings().then((s) => {
      const v = s?.tiktok?.waterfall?.videos;
      if (v && v.length > 0) setSettingsVideos(v);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const shownVideos = realOnly(
    videos === DEFAULT_VIDEOS && settingsVideos ? settingsVideos : videos
  );

  useEffect(() => {
    // Only pull in TikTok's embed SDK when we actually have real videos —
    // it's the source of the permissions-policy / webmssdk console spam.
    if (shownVideos.length === 0) return;
    if (!document.getElementById("tiktok-embed-script")) {
      const script = document.createElement("script");
      script.id = "tiktok-embed-script";
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [shownVideos.length]);

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

        {/* TikTok embed grid — only when real video IDs are configured
            (wp-admin → UMBRCOM → Site Settings → TikTok) */}
        {shownVideos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
          {shownVideos.map((v) => (
            <div key={v.id} className="w-full max-w-[320px]">
              <blockquote
                className="tiktok-embed"
                cite={`https://www.tiktok.com/@${handle}/video/${v.id}`}
                data-video-id={v.id}
                style={{ maxWidth: 320, minWidth: 280 }}
              >
                <section>
                  <p className="text-sm text-white/60 mt-3 text-right">{v.caption}</p>
                </section>
              </blockquote>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
