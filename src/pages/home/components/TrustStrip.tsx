const PERKS = [
  { icon: "ri-shield-check-line", title: "אחריות מקיפה", sub: "אחריות מלאה ושירות מקצועי המעניקים שקט נפשי לאורך שנים" },
  { icon: "ri-medal-line", title: "חומרים איכותיים", sub: "ייצור מחומרים איכותיים עמידים לשמירה על מראה וביצועים לאורך זמן" },
  { icon: "ri-water-flash-line", title: "טכנולוגיית חיסכון במים", sub: "מערכות מתקדמות המסייעות לצמצם את צריכת המים ללא פגיעה בנוחות השימוש" },
  { icon: "ri-palette-line", title: "מגוון גימורים יוקרתיים", sub: "ניקל מוברש, שחור מט, זהב מוברש, רוז גולד וגימורים נוספים" },
  { icon: "ri-customer-service-2-line", title: "שירות ותמיכה בישראל", sub: "זמינות מלאה, מענה מקצועי ואספקת חלקי חילוף ושירות מקומי ללקוחות" },
];

export default function TrustStrip() {
  return (
    <section className="w-full bg-white border-y border-[#ede9e1]">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {PERKS.map((p) => (
            <div key={p.title} className="flex flex-col items-center text-center gap-2 px-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className={`${p.icon} text-[22px] text-[#1a1a1a]`}></i>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1a1410] leading-snug">{p.title}</p>
                <p className="text-[11px] text-[#9a8a7a] mt-0.5">{p.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
