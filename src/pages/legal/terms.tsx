import PageLayout from "../../components/feature/PageLayout";

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="w-full bg-[#0f0f0f] py-10 text-right">
        <h1 className="font-serif text-3xl font-light text-white">תקנון האתר</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-14 text-right space-y-8 text-[#5a4e42] leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">1. כללי</h2>
          <p>ברוכים הבאים לאתר אמברקום (UMBRCOM). השימוש באתר ובשירותיו מהווה הסכמה מלאה לתנאים המפורטים להלן. אנא קראו בעיון לפני ביצוע רכישה.</p>
          <p>האתר מופעל על ידי אמברקום בע״מ, רחוב שלמה אבן גבירול 69, תל אביב.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">2. זכאות לרכישה</h2>
          <p>הרכישה מיועדת לבגירים מגיל 18 ומעלה בעלי כרטיס אשראי תקף בישראל. אמברקום שומרת לעצמה את הזכות לסרב לכל הזמנה לפי שיקול דעתה.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">3. מחירים ותשלום</h2>
          <p>כל המחירים באתר כוללים מע״מ (אלא אם צוין אחרת). אמברקום שומרת לעצמה את הזכות לעדכן מחירים בכל עת, ללא הודעה מוקדמת. מחיר המוצר הקובע הוא המחיר שמופיע בעת ביצוע ההזמנה.</p>
          <p>התשלום מתבצע באמצעות כרטיסי אשראי (Visa, Mastercard, Amex, Isracard) בסליקה מאובטחת. אמברקום אינה שומרת פרטי כרטיס אשראי.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">4. משלוח ואספקה</h2>
          <p>המשלוח מתבצע לכל רחבי הארץ. זמן האספקה הסטנדרטי הוא 3–5 ימי עסקים מרגע אישור ההזמנה. אמברקום אינה אחראית לעיכובים הנגרמים על ידי גורמי שילוח חיצוניים.</p>
          <p>משלוח חינם להזמנות מעל ₪200. עלות משלוח סטנדרטי: ₪28. משלוח מהיר: ₪49.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">5. אחריות ושירות</h2>
          <p>כל המוצרים מגיעים עם אחריות יצרן. ברזי מטבח וכיור רחצה מהסדרות המסומנות נהנים מאחריות של 7 שנים. מוצרים נוספים — בהתאם למפורט בדף המוצר.</p>
          <p>האחריות מכסה פגמי ייצור, אינה חלה על נזק הנגרם משימוש לא תקין, התקנה שגויה או פגעי מים.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">6. קניין רוחני</h2>
          <p>כל התוכן באתר — תמונות, טקסטים, לוגו, עיצוב — הוא רכושה הבלעדי של אמברקום ומוגן בזכויות יוצרים. אין להעתיק, לפרסם מחדש או לעשות שימוש מסחרי בתוכן ללא אישור בכתב.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">7. שינויים בתקנון</h2>
          <p>אמברקום שומרת לעצמה את הזכות לשנות תנאים אלה בכל עת. המשך השימוש באתר לאחר פרסום השינויים מהווה הסכמה לתנאים המעודכנים.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">8. יצירת קשר</h2>
          <p>לשאלות ובירורים: <a href="mailto:office@umbrcom.co.il" className="text-[#1a1a1a] underline">office@umbrcom.co.il</a> | 03-620-8197</p>
          <p>רחוב שלמה אבן גבירול 69, תל אביב.</p>
        </section>
      </div>
    </PageLayout>
  );
}
