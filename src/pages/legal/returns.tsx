import CmsPage from "../../components/feature/CmsPage";
import CancellationForm from "./components/CancellationForm";

function StaticReturns() {
  return (
    <>
      <div className="w-full bg-[#0f0f0f] py-10 text-right">
        <h1 className="font-serif text-3xl font-light text-white">ביטולים והחזרות</h1>
      </div>

      <div dir="rtl" className="max-w-3xl mx-auto px-4 sm:px-8 py-14 text-right space-y-8 text-[#5a4e42] leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">מדיניות ביטול עסקה</h2>
          <p>בהתאם לחוק הגנת הצרכן, ניתן לבטל עסקה תוך <strong>14 ימים</strong> מיום קבלת המוצר.</p>
          <p>ביטול שלא עקב פגם: יחויב דמי ביטול בשיעור 5% ממחיר העסקה, לא יותר מ-100 ₪. ביטול עקב פגם: ללא חיוב.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">תנאי ההחזרה</h2>
          <ul className="list-none space-y-2">
            {[
              "המוצר חייב להיות באריזתו המקורית ולא נעשה בו שימוש",
              "יש לצרף חשבונית קנייה",
              "מוצרים שהותקנו אינם ניתנים להחזרה (אלא בגלל פגם)",
              "מוצרים מוזמנים במיוחד אינם ניתנים לביטול",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 justify-end">
                <span>{t}</span>
                <i className="ri-checkbox-circle-fill text-[#1a1a1a] flex-shrink-0 mt-0.5"></i>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">תהליך ההחזרה</h2>
          <ol className="list-none space-y-3">
            {[
              { n: "1", t: "פנה אלינו", s: "שלח אימייל ל-office@umbrcom.co.il או התקשר ל-03-620-8197 עם פרטי ההזמנה." },
              { n: "2", t: "אישור ובדיקה", s: "נבדוק את פרטי ההזמנה ונאשר את הבקשה תוך יום עסקים אחד." },
              { n: "3", t: "אריזה ומשלוח", s: "יש לארוז את המוצר היטב ולשלוח לכתובת שנמסור לך. עלויות המשלוח חזרה חלות על הלקוח (אלא אם פגם)." },
              { n: "4", t: "זיכוי", s: "לאחר קבלת המוצר ובדיקתו, הזיכוי יתבצע לאמצעי התשלום המקורי תוך 3–5 ימי עסקים." },
            ].map((s) => (
              <li key={s.n} className="flex gap-4 items-start flex-row-reverse">
                <div className="w-7 h-7 rounded-full bg-[#1a1a1a] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {s.n}
                </div>
                <div>
                  <p className="font-semibold text-[#1a1410]">{s.t}</p>
                  <p className="mt-0.5">{s.s}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-[#1a1410]">מוצרים פגומים</h2>
          <p>קיבלת מוצר פגום? נשמח לטפל בכך מיידית — נחליף את המוצר ללא עלות, כולל איסוף. אנא צלם את הפגם ושלח לנו בהקדם.</p>
        </section>

        <div className="bg-white border border-[#ede9e1] rounded-2xl p-5">
          <p className="font-semibold text-[#1a1410] mb-1">צריך עזרה?</p>
          <p>📧 <a href="mailto:office@umbrcom.co.il" className="text-[#1a1a1a] underline">office@umbrcom.co.il</a></p>
          <p>📞 <a href="tel:+97236208197" className="text-[#1a1a1a]">03-620-8197</a></p>
          <p className="text-xs text-[#9a8a7a] mt-2">ימים א׳–ה׳, 09:00–17:00</p>
        </div>
      </div>
    </>
  );
}

export default function ReturnsPage() {
  return <CmsPage slug="returns" fallback={<StaticReturns />} after={<CancellationForm />} />;
}
