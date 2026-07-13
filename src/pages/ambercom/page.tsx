import { Link } from "react-router-dom";
import PageLayout from "../../components/feature/PageLayout";

const AMBERCOM_COLOR = "#e8a030"; // Ambercom brand amber/gold

const AMBERCOM_PRODUCTS = [
  {
    name: "EMBER Pro Kitchen",
    desc: "ברז מטבח פרמיום מסדרת Ambercom — גימור amber gold ייחודי.",
    image: "https://readdy.ai/api/search-image?query=luxury+kitchen+faucet+warm+amber+gold+brushed+finish+modern+design+white+marble+countertop+professional+product+photography&width=600&height=600&seq=ambercom-p1&orientation=squarish",
    price: 2_490,
  },
  {
    name: "EMBER Basin Slim",
    desc: "ברז כיור רחצה דק וקלאסי, גימור ברונזה חמה.",
    image: "https://readdy.ai/api/search-image?query=elegant+slim+bathroom+basin+faucet+warm+bronze+antique+gold+finish+white+ceramic+sink+minimalist+design+soft+light&width=600&height=600&seq=ambercom-p2&orientation=squarish",
    price: 1_890,
  },
  {
    name: "EMBER Cold Pure",
    desc: "ברז מים קרים — גימור ניקל חמה, עיצוב מודרני.",
    image: "https://readdy.ai/api/search-image?query=cold+water+tap+faucet+warm+nickel+brushed+champagne+finish+wall+mounted+clean+white+background+product+photography&width=600&height=600&seq=ambercom-p3&orientation=squarish",
    price: 890,
  },
];

export default function AmbercomPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <div
        className="relative w-full overflow-hidden py-28 flex items-center justify-center text-center"
        style={{ background: "linear-gradient(135deg, #1a1210 0%, #2a1e14 50%, #1a1210 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 60% 40%, #e8a030 0%, transparent 65%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-[#e8a030]/50" />
            <span className="text-[10px] font-semibold tracking-[0.5em] uppercase" style={{ color: AMBERCOM_COLOR }}>
              The Amber Collection
            </span>
            <span className="w-8 h-px bg-[#e8a030]/50" />
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl font-light text-white leading-tight mb-4">
            Ambercom
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-lg mx-auto mb-8">
            הקולקציה האמברית — חמימות, יוקרה ועיצוב נצחי.
            מוצרי Ambercom מבית UMBRCOM, מעוצבים לאלה שמסרבים להתפשר.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-[#1a1210] px-8 py-4 rounded-full transition-all duration-300 cursor-pointer shadow-lg"
            style={{ backgroundColor: AMBERCOM_COLOR }}
          >
            לחנות Ambercom
          </Link>
        </div>
      </div>

      {/* Story */}
      <section className="w-full bg-white py-20">
        <div className="max-w-4xl mx-auto px-8 text-right" dir="rtl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.45em] uppercase mb-3" style={{ color: AMBERCOM_COLOR }}>
                סיפור המותג
              </p>
              <h2 className="font-serif text-3xl font-light text-[#1a1410] mb-6 leading-tight">
                הבדל שמרגישים
                <br />
                בכל מגע
              </h2>
              <p className="text-sm text-[#5a4e42] leading-relaxed mb-4">
                Ambercom נולדה מתוך הרצון ליצור ברזים שהם יצירות אמנות — לא רק כלים.
                כל מוצר מעוצב עם תשומת לב לפרט: מחומרי הגלם ועד ציפוי ה-Amber Gold הייחודי.
              </p>
              <p className="text-sm text-[#5a4e42] leading-relaxed">
                אוסף Ambercom הוא בלעדי ל-UMBRCOM בישראל — עם אחריות מלאה ושירות אישי.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-square bg-[#f7f0e8]">
              <img
                src="https://readdy.ai/api/search-image?query=luxury+bathroom+interior+warm+amber+golden+tones+premium+faucet+marble+elegant+photography+soft+warm+light&width=800&height=800&seq=ambercom-story&orientation=squarish"
                alt="Ambercom story"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-right mb-10" dir="rtl">
            <p className="text-[10px] font-semibold tracking-[0.45em] uppercase mb-3" style={{ color: AMBERCOM_COLOR }}>
              מוצרים נבחרים
            </p>
            <h2 className="font-serif text-3xl font-light text-[#1a1410]">
              הקולקציה
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" dir="rtl">
            {AMBERCOM_PRODUCTS.map((p) => (
              <Link
                key={p.name}
                to="/shop"
                className="group cursor-pointer flex flex-col bg-white border border-[#eaeaea] hover:border-[#c8a060] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(232,160,48,0.15)]"
              >
                <div className="relative overflow-hidden bg-[#f7f0e8]" style={{ aspectRatio: "1" }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 text-right">
                  <p className="text-[9px] font-bold tracking-[0.35em] uppercase mb-1" style={{ color: AMBERCOM_COLOR }}>
                    Ambercom
                  </p>
                  <h3 className="text-sm font-medium text-[#1a1410] mb-1">{p.name}</h3>
                  <p className="text-xs text-[#9a8a7a] mb-3 leading-snug line-clamp-2">{p.desc}</p>
                  <span className="text-base font-bold text-[#1a1410]">
                    ₪{p.price.toLocaleString("he-IL")}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-white px-8 py-3.5 rounded-full transition-colors cursor-pointer"
              style={{ backgroundColor: AMBERCOM_COLOR }}
            >
              לכל מוצרי Ambercom
              <i className="ri-arrow-left-line text-sm"></i>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
