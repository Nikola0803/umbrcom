import CmsPage from "../../components/feature/CmsPage";

function StaticPrivacy() {
  return (
    <>
      <div className="w-full bg-[#0f0f0f] py-10 text-right">
        <h1 className="font-serif text-3xl font-light text-white">מדיניות פרטיות</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-14 text-right space-y-8 text-[#5a4e42] leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">1. מבוא</h2>
          <p>אמברקום בע״מ מחויבת לשמירה על פרטיות המשתמשים. מדיניות זו מסבירה אילו מידע אנו אוספים, כיצד אנו משתמשים בו וכיצד אנו מגנים עליו.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">2. מידע שאנו אוספים</h2>
          <p>במהלך הרכישה: שם, כתובת, אימייל, מספר טלפון, כתובת למשלוח. מידע זה נדרש לביצוע ההזמנה ומשלוחה.</p>
          <p>מידע טכני: כתובת IP, סוג דפדפן, עמודים שנצפו. נאסף אוטומטית לצרכי שיפור האתר.</p>
          <p>אנו אינם שומרים פרטי כרטיס אשראי — הסליקה מתבצעת על ידי גורם חיצוני מאובטח.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">3. שימוש במידע</h2>
          <p>המידע משמש לעיבוד הזמנות, אספקת מוצרים, שירות לקוחות, ושליחת עדכונים רלוונטיים (בהסכמתך). אנו לא מוכרים או משכירים מידע אישי לצדדים שלישיים.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">4. קובצי Cookie</h2>
          <p>האתר משתמש בקובצי Cookie לשיפור חוויית הגלישה, שמירת העדפות ואנליטיקה. תוכל לנהל הגדרות Cookie בדפדפן שלך בכל עת.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">5. אבטחת מידע</h2>
          <p>אנו משתמשים בפרוטוקול SSL להצפנת כל תעבורת הנתונים. שרתינו מאובטחים בסטנדרטים מחמירים. עם זאת, אין אבטחה מוחלטת ברשת האינטרנט.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">6. זכויותיך</h2>
          <p>יש לך הזכות לעיין במידע שנשמר אודותיך, לבקש תיקונו, מחיקתו, או הגבלת עיבודו. לפנייה: <a href="mailto:office@umbrcom.co.il" className="text-[#1a1a1a] underline">office@umbrcom.co.il</a></p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">7. יצירת קשר</h2>
          <p>ממונה פרטיות: <a href="mailto:office@umbrcom.co.il" className="text-[#1a1a1a] underline">office@umbrcom.co.il</a> | 03-620-8197</p>
        </section>
      </div>
    </>
  );
}

export default function PrivacyPage() {
  return <CmsPage slug="privacy" fallback={<StaticPrivacy />} />;
}
