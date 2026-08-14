import PageLayout from "../../components/feature/PageLayout";

// Real About content, provided directly by Nik. Bypasses CmsPage —
// WordPress already has its own auto-created "about" page with populated
// umbrcom_sections (page_header + 3 rich_text blocks, an earlier/shorter
// version of this same copy), which always takes priority over the
// fallback content passed to CmsPage — so this real content would never
// actually render no matter how many times the frontend gets rebuilt.
// Same fix as terms/privacy/accessibility-statement: bypass CmsPage
// entirely and wrap directly in PageLayout instead (that's where the
// header/footer chrome used to come from).
export default function AboutPage() {
  return (
    <PageLayout>
      {/* Page banner */}
      <div className="w-full bg-[#0f0f0f] py-20 text-right relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-8">
          <p className="text-xs font-medium tracking-[0.35em] text-[#1a1a1a] uppercase mb-4">
            הסיפור שלנו
          </p>
          <h1 className="font-serif text-5xl font-light text-white leading-tight">
            אודות UMBRCOM
          </h1>
          <div className="mt-5 flex justify-start">
            <span className="block w-16 h-px bg-[#1a1a1a]/60"></span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-8 py-20 text-right" dir="rtl">
        {/* Intro block */}
        <div className="mb-16 animate-fade-up">
          <p className="font-serif text-2xl font-light text-[#0d0d0d] leading-relaxed mb-6">
            <strong className="font-semibold">UMBRCOM</strong> – איכות, עיצוב וחדשנות תחת מטרייה אחת.
          </p>
          <p className="text-[#555] text-base leading-loose">
            השם <strong>UMBRCOM – אמברקום</strong> נוצר בהשראת המילה <strong>Umbrella</strong> (מטרייה), מתוך הרעיון לרכז מוצרים איכותיים ומעוצבים תחת קורת גג אחת ולהעניק ללקוחות חוויית קנייה נוחה, מקצועית ומשתלמת.
          </p>
          <p className="text-[#555] text-base leading-loose mt-4">
            כיום, UMBRCOM מתמחה בייבוא ושיווק מוצרי Waterfall בישראל – מותג ברזים המשלב עיצוב מודרני, מגוון גימורים ופתרונות המותאמים למטבח ולחדר הרחצה.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#ede9e1] mb-16" />

        {/* Products block */}
        <div className="mb-16 animate-fade-up delay-200">
          <p className="text-xs font-medium tracking-[0.3em] text-[#1a1a1a] uppercase mb-4">
            המוצרים שלנו
          </p>
          <h2 className="font-serif text-3xl font-light text-[#0d0d0d] mb-6 leading-snug">
            כל מה שאתם צריכים, בצורה יפה אחת
          </h2>
          <p className="text-[#555] text-base leading-loose mb-4">
            באתר UMBRCOM תוכלו למצוא מגוון מוצרי Waterfall, בהם:
          </p>
          <ul className="text-[#555] text-base leading-loose space-y-1.5 list-disc pr-5 mb-4">
            <li>ברזי מטבח</li>
            <li>ברזי אמבטיה</li>
            <li>ברזים לכיור רחצה</li>
            <li>ברזי מים קרים</li>
            <li>ערכות ומוטות פינוק למקלחת</li>
          </ul>
          <p className="text-[#555] text-base leading-loose">
            המוצרים מגיעים במגוון רחב של דגמים, סגנונות וגימורים, המאפשרים להתאים את הברז לעיצוב המטבח או חדר הרחצה ולצרכים השונים של כל לקוח.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#ede9e1] mb-16" />

        {/* Waterfall block */}
        <div className="mb-16 animate-fade-up delay-300">
          <p className="text-xs font-medium tracking-[0.3em] text-[#1a1a1a] uppercase mb-4">
            Waterfall
          </p>
          <h2 className="font-serif text-3xl font-light text-[#0d0d0d] mb-6 leading-snug">
            עיצוב שפוגש את המים
          </h2>
          <p className="text-[#555] text-base leading-loose">
            ב־UMBRCOM אנחנו מאמינים שברז הוא כבר מזמן לא רק מוצר פונקציונלי. הוא חלק בלתי נפרד מהעיצוב ומהאופי של המטבח וחדר הרחצה.
          </p>
          <p className="text-[#555] text-base leading-loose mt-4">
            לכן בחרנו להביא לישראל את Waterfall ולהציע קולקציה רחבה של ברזים ופתרונות רחצה המשלבים בין עיצוב, פונקציונליות ואיכות.
          </p>
          <p className="text-[#555] text-base leading-loose mt-4">
            הקולקציות שלנו כוללות מגוון גימורים, בהם שחור, כרום, ניקל מוברש, זהב, זהב מוברש ורוז גולד, לצד סדרות בעיצובים שונים המתאימות לסגנונות עיצוב מודרניים וקלאסיים.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#ede9e1] mb-16" />

        {/* Vision block */}
        <div className="animate-fade-up delay-300">
          <p className="text-xs font-medium tracking-[0.3em] text-[#1a1a1a] uppercase mb-4">
            החזון שלנו
          </p>
          <p className="text-[#555] text-base leading-loose">
            החזון של UMBRCOM הוא להציע לקהל הישראלי פתרונות איכותיים ומעוצבים למטבח ולחדר הרחצה במחירים תחרותיים, לצד שירות מקצועי וחוויית רכישה פשוטה ונוחה.
          </p>
          <p className="text-[#555] text-base leading-loose mt-4">
            אנחנו ממשיכים לפתח ולהרחיב את מגוון מוצרי Waterfall, במטרה לאפשר ללקוחות פרטיים, בעלי מקצוע, מעצבים ואדריכלים למצוא במקום אחד פתרונות המתאימים לפרויקטים, לשיפוצים ולבתים חדשים.
          </p>
          <p className="font-serif text-xl font-light text-[#0d0d0d] leading-relaxed mt-8">
            UMBRCOM – כל מה שצריך, תחת מטרייה אחת.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#ede9e1] mt-16 mb-10" />

        {/* Contact strip — email + opening hours, per Nik. */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-8 text-sm text-[#555]">
          <a href="mailto:service@umbrcom.co.il" className="flex items-center gap-2 hover:text-[#1a1a1a] transition-colors">
            <i className="ri-mail-line text-[#1a1a1a]"></i>
            <span dir="ltr">service@umbrcom.co.il</span>
          </a>
          <div className="flex items-start gap-2">
            <i className="ri-time-line text-[#1a1a1a] mt-0.5"></i>
            <span className="leading-relaxed">
              שעות פעילות:
              <br />
              א-ה : 10:00-16:00
              <br />
              יום ו : 08:00-13:30
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
