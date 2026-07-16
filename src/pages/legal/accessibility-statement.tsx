import CmsPage from "../../components/feature/CmsPage";

function StaticAccessibilityStatement() {
  return (
    <>
      <section className="w-full bg-white min-h-[70vh] py-16 px-6" dir="rtl">
        <div className="max-w-3xl mx-auto text-right">
          <p className="text-[10px] font-medium tracking-[0.4em] text-[#3ab4f2] uppercase mb-3">
            נגישות
          </p>
          <h1 className="font-serif text-3xl font-light text-[#1a1410] mb-2">
            הצהרת נגישות
          </h1>
          <div className="w-10 h-px bg-[#1a1a1a]/20 mr-0 mb-8" />

          <div className="prose prose-sm max-w-none text-[#5a4e42] leading-relaxed space-y-6">
            <div>
              <h2 className="font-semibold text-[#1a1410] text-base mb-2">מחויבות לנגישות</h2>
              <p>
                אמברקום בע"מ (UMBRCOM) מחויבת לספק שירות שווה ואיכותי לכל לקוחותיה, לרבות אנשים עם מוגבלויות.
                אנו פועלים לעמידה בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות),
                התשע"ג-2013, ובהנחיות WCAG 2.1 ברמה AA.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-[#1a1410] text-base mb-2">מאפייני הנגישות באתר</h2>
              <ul className="list-none space-y-2">
                {[
                  "ניווט מלא מהמקלדת — ללא שימוש בעכבר",
                  "תמיכה בתוכנות קוראי מסך (NVDA, JAWS, VoiceOver)",
                  "הגדלת טקסט עד 200% ללא אובדן תוכן",
                  "ניגודיות צבעים עומדת בתקן 4.5:1 לפחות",
                  "תיאורי alt לכל התמונות המשמעותיות",
                  "כל הטפסים מסומנים עם ‍label מתאים",
                  "מבנה כותרות (H1-H6) היררכי ועקבי",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 justify-end text-sm">
                    <span>{item}</span>
                    <i className="ri-checkbox-circle-fill text-[#3ab4f2] flex-shrink-0 text-base"></i>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-[#1a1410] text-base mb-2">כלי הנגישות באתר</h2>
              <p>
                באתר זמין כפתור נגישות (אייקון גלגל השיניים בצד הימני של המסך) המאפשר:
                שינוי גודל הגופן, הפעלת ניגודיות גבוהה, והדגשת קישורים.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-[#1a1410] text-base mb-2">מידע ליצירת קשר בנושא נגישות</h2>
              <p>
                גילינו תקלה? יש לכם הצעה לשיפור? נשמח לשמוע.
              </p>
              <div className="mt-3 p-4 bg-white rounded-xl border border-[#ede9e1] text-sm">
                <p className="font-semibold text-[#1a1410] mb-1">רכז נגישות: אמברקום בע״מ</p>
                <p>טל: <a href="tel:+97236208197" className="text-[#3ab4f2]">03-620-8197</a></p>
                <p>דוא"ל: <a href="mailto:info@umbrcom.co.il" className="text-[#3ab4f2]">info@umbrcom.co.il</a></p>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-[#1a1410] text-base mb-2">עדכון אחרון</h2>
              <p className="text-sm">הצהרה זו עודכנה לאחרונה ביוני 2025.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function AccessibilityStatementPage() {
  return <CmsPage slug="accessibility-statement" fallback={<StaticAccessibilityStatement />} />;
}
