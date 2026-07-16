import CmsPage from "../../components/feature/CmsPage";

function StaticAbout() {
  return (
    <>
      {/* Page banner */}
      <div className="w-full bg-[#0f0f0f] py-20 text-right relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/5 to-transparent pointer-events-none" />
        <p className="text-xs font-medium tracking-[0.35em] text-[#1a1a1a] uppercase mb-4">
          הסיפור שלנו
        </p>
        <h1 className="font-serif text-5xl font-light text-white leading-tight">
          אודות אמברקום
        </h1>
        <div className="mt-5 flex justify-center">
          <span className="block w-16 h-px bg-[#1a1a1a]/60"></span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-8 py-20 text-right">
        {/* Intro block */}
        <div className="mb-16 animate-fade-up">
          <p className="font-serif text-2xl font-light text-[#0d0d0d] leading-relaxed mb-6">
            <strong className="font-semibold">UMBRCOM</strong> – המותג שמאגד את הכל תחת מטרייה אחת.
          </p>
          <p className="text-[#555] text-base leading-loose">
            השם <strong>"אמברקום"</strong> נוצר כהשראה מהמילה <strong>"Umbrella"</strong> (מטרייה), על מנת לשדר את הרעיון של חנות שמציעה מגוון רחב של מוצרים – כולם תחת קורת גג אחת. בחנות שלנו תמצאו לא רק איכות, אלא גם מחירים אטרקטיביים במיוחד ושירות שמותאם אישית לצרכים שלכם.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#ede9e1] mb-16" />

        {/* Vision block */}
        <div className="mb-16 animate-fade-up delay-200">
          <p className="text-xs font-medium tracking-[0.3em] text-[#1a1a1a] uppercase mb-4">
            החזון שלנו
          </p>
          <h2 className="font-serif text-3xl font-light text-[#0d0d0d] mb-6 leading-snug">
            חוויית קנייה שמתחילה ונגמרת בשביעות רצון מלאה
          </h2>
          <p className="text-[#555] text-base leading-loose">
            החזון של <strong>אמברקום</strong> הוא להעניק לכם את חוויית הקנייה האולטימטיבית – כל מה שאתם צריכים, במקום אחד, במחיר משתלם, עם שירות מקצועי ויחס אישי. המטרה שלנו היא ליצור חוויית קנייה נוחה, פשוטה ומספקת, שבה תוכלו למצוא את כל מה שאתם צריכים מבלי להתפשר על איכות.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#ede9e1] mb-16" />

        {/* Products block */}
        <div className="animate-fade-up delay-300">
          <p className="text-xs font-medium tracking-[0.3em] text-[#1a1a1a] uppercase mb-4">
            מגוון המוצרים
          </p>
          <h2 className="font-serif text-3xl font-light text-[#0d0d0d] mb-6 leading-snug">
            כל מה שאתם צריכים, בצורה יפה אחת
          </h2>
          <p className="text-[#555] text-base leading-loose">
            החנות שלנו מציעה מגוון רחב של מוצרים מקטגוריות שונות: טכנולוגיה, עיצוב לבית, פריטים ייחודיים ואקססוריז, כל אחד מהם נבחר בקפידה כדי להבטיח איכות ומחיר משתלם.
          </p>
          <p className="text-[#555] text-base leading-loose mt-4">
            בין אם אתם מחפשים פתרונות טכנולוגיים מתקדמים, פריטי נוי לבית או גאדג'טים חדשניים – <strong>אמברקום</strong> מציעה לכם את כל זה תחת קורת גג אחת.
          </p>
        </div>
      </div>
    </>
  );
}

export default function AboutPage() {
  return <CmsPage slug="about" fallback={<StaticAbout />} />;
}
