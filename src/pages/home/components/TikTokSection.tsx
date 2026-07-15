import { useEffect } from "react";

// ── Reusable TikTok video template (item 20) — used on BOTH homepages ─────
// Replace the IDs below with real TikTok video IDs:
// find the ID in the URL — tiktok.com/@user/video/VIDEO_ID_HERE
const DEFAULT_VIDEOS = [
  { id: "7448000000000000001", caption: "ברז מטבח Waterfall חדש" },
  { id: "7448000000000000002", caption: "ציפוי רוז גולד — מדהים" },
  { id: "7448000000000000003", caption: "התקנה פשוטה בדקות" },
];

declare global {
  interface Window { // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tiktokEmbedded?: any;
  }
}

export interface TikTokSectionProps {
  /** Brand title, e.g. "Waterfall" / "Ambercom" */
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
  useEffect(() => {
    if (!document.getElementById("tiktok-embed-script")) {
      const script = document.createElement("script");
      script.id = "tiktok-embed-script";
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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

        {/* TikTok embed grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
          {videos.map((v) => (
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

        <p className="text-right text-xs text-white/20 mt-8">
          * להחלפת הסרטונים — עדכנו את מזהי הווידאו ב-TikTokSection.tsx
        </p>
      </div>
    </section>
  );
}
