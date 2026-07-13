const REVIEWS = [
  {
    id: 1,
    name: "מיכל ב.",
    location: "תל אביב",
    stars: 5,
    text: "הזמנתי ברז Goma לזהב מוברש למטבח החדש שלי — מדהים. ממש כמו בתמונות, עשוי בצורה מהממת. קיבלתי תוך יומיים עם אריזה מקצועית. בהחלט אמליץ!",
    product: "ברז מטבח Goma זהב מוברש",
    avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20photo%20of%20smiling%20Israeli%20woman%20in%20her%2030s%2C%20soft%20neutral%20background%2C%20natural%20warm%20lighting%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=rev-avatar-1&orientation=squarish",
  },
  {
    id: 2,
    name: "אורן ל.",
    location: "חיפה",
    stars: 5,
    text: "שיפצנו את חדר האמבטיה וחיפשנו ברז שייראה יוקרתי בלי לשבור את הבנק. מצאנו בדיוק את זה. הרכבה פשוטה, איכות מרגישה גבוהה מאוד.",
    product: "ברז כיור רחצה Hilo זהב",
    avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20smiling%20Israeli%20man%20in%20his%2040s%2C%20neutral%20background%2C%20natural%20light%2C%20relaxed%20expression%2C%20high%20quality%20portrait&width=80&height=80&seq=rev-avatar-2&orientation=squarish",
  },
  {
    id: 3,
    name: "רותי ש.",
    location: "ירושלים",
    stars: 5,
    text: "השירות לקוחות הכי טוב שחוויתי — ענו לי תוך דקות. הברז הגיע מהיר ומקצועי ועדיין מחזיק מעמד מצוין אחרי 8 חודשים. תודה!",
    product: "ברז Loïs ניקל מוברש",
    avatar: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20smiling%20woman%20in%20her%2050s%20with%20glasses%2C%20warm%20neutral%20background%2C%20natural%20lighting%2C%20high%20quality%20portrait%20photo&width=80&height=80&seq=rev-avatar-3&orientation=squarish",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10px] font-medium tracking-[0.4em] text-[#1a1a1a] uppercase mb-3">
            לקוחות מספרים
          </p>
          <h2 className="font-serif text-3xl font-light text-[#1a1410]">
            מה אומרים עלינו
          </h2>
          {/* Stars row */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <i key={i} className="ri-star-fill text-[#888888] text-lg" />
            ))}
            <span className="mr-2 text-sm text-[#9a8a7a]">4.9 מתוך 5 — מעל 200 ביקורות</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div
              key={r.id}
              className="border border-[#ede9e1] rounded-2xl p-7 flex flex-col gap-5 hover:border-[#888888]/50 transition-colors duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <i key={i} className="ri-star-fill text-[#888888] text-sm" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-[#5a4e42] leading-relaxed text-right flex-1">
                &quot;{r.text}&quot;
              </p>

              {/* Product */}
              <p className="text-[10px] font-medium tracking-widest text-[#1a1a1a] uppercase text-right">
                {r.product}
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#f0ece5] flex-row-reverse">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0"
                />
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#1a1410]">{r.name}</p>
                  <p className="text-[11px] text-[#9a8a7a]">{r.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
