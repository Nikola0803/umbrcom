import { Link } from "react-router-dom";

export interface InfoTile {
  icon: string;
  title: string;
  text?: string;
  linkLabel?: string;
  linkUrl?: string;
}

export interface InfoTilesProps {
  heading?: string;
  tiles: InfoTile[];
  /** "cards" = bordered card grid (Business benefits, Trust-strip style);
   *  "circles" = icon-in-circle + label, clickable (Customer Service contact methods). */
  style?: "cards" | "circles";
}

/** A flexible icon+title+text grid — a Page Builder layout ("Info Tiles")
 *  used for benefit grids (Business), contact method tiles (Customer
 *  Service), or any similar "here are N things" section. */
export default function InfoTiles({ heading, tiles, style = "cards" }: InfoTilesProps) {
  return (
    <section className="w-full bg-white py-14" dir="rtl">
      <div className="max-w-3xl mx-auto px-8 text-right">
        {heading && <h2 className="font-serif text-2xl font-light text-[#1a1410] mb-8">{heading}</h2>}

        {style === "circles" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {tiles.map((t, i) => {
              const content = (
                <>
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-900 group-hover:bg-gray-700 transition-colors">
                    <i className={`${t.icon} text-white text-2xl`}></i>
                  </div>
                  <span className="text-sm text-gray-700">{t.title}</span>
                </>
              );
              return t.linkUrl ? (
                <a
                  key={i}
                  href={t.linkUrl}
                  target={t.linkUrl.startsWith("http") ? "_blank" : undefined}
                  rel="nofollow noopener noreferrer"
                  className="flex flex-col items-start gap-3 cursor-pointer group"
                >
                  {content}
                </a>
              ) : (
                <div key={i} className="flex flex-col items-start gap-3">
                  {content}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {tiles.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-[#ede9e1] text-right">
                <i className={`${t.icon} text-2xl text-[#1a1a1a] mb-3 block`}></i>
                <p className="text-sm font-semibold text-[#1a1410] mb-1">{t.title}</p>
                {t.text && <p className="text-xs text-[#9a8a7a] leading-relaxed">{t.text}</p>}
                {t.linkUrl && t.linkLabel && (
                  <Link to={t.linkUrl} className="inline-block mt-2 text-xs text-[#3ab4f2] font-medium">
                    {t.linkLabel}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
