import { Link } from "react-router-dom";
import PageLayout from "../../components/feature/PageLayout";
import { allProducts } from "../../mocks/products";

const SAMPLE_IDS = ["701", "730", "748"];
const compareProducts = allProducts.filter((p) => SAMPLE_IDS.includes(p.id));

const SPECS = [
  { key: "material", label: "חומר", value: "פליז איכותי" },
  { key: "pressure", label: "לחץ מינימלי", value: "1.0 בר" },
  { key: "flow", label: "ספיקה", value: "8 ל׳/דקה" },
  { key: "warranty", label: "אחריות", value: "7 שנים" },
  { key: "height", label: "גובה", value: "37 ס״מ" },
  { key: "pvd", label: "ציפוי PVD", value: "✓" },
];

export default function ComparePage() {
  return (
    <PageLayout>
      <section className="w-full bg-white min-h-[70vh] py-12 px-4 sm:px-8" dir="rtl">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-right">
            <p className="text-[10px] font-medium tracking-[0.4em] text-[#aaa] uppercase mb-2">כלי השוואה</p>
            <h1 className="font-serif text-3xl font-light text-[#1a1410]">השוואת מחירים</h1>
          </div>

          {compareProducts.length < 2 ? (
            <div className="text-right py-20 px-8 border border-dashed border-[#ede9e1] rounded-2xl">
              <i className="ri-scales-3-line text-5xl text-[#ddd] mb-4 block"></i>
              <p className="text-sm text-[#9a8a7a] mb-6">הוסיפו לפחות 2 מוצרים להשוואה</p>
              <Link to="/shop" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white text-xs font-semibold tracking-widest px-8 py-3.5 rounded-full cursor-pointer hover:bg-[#333] transition-colors">
                לחנות
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                {/* Product images & names */}
                <thead>
                  <tr>
                    <th className="text-right text-xs text-[#aaa] font-medium pb-6 w-32">מאפיין</th>
                    {compareProducts.map((p) => (
                      <th key={p.id} className="text-right pb-6 px-4">
                        <Link to={`/product/${p.id}`} className="group block">
                          <div className="w-24 h-24 bg-[#f6f6f6] rounded-xl overflow-hidden mb-3 group-hover:shadow-md transition-shadow">
                            <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2" />
                          </div>
                          <p className="text-xs font-medium text-[#1a1410] leading-snug group-hover:underline">{p.name}</p>
                          <p className="text-sm font-bold text-[#1a1410] mt-1">₪{p.price.toLocaleString("he-IL")}</p>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Specs */}
                <tbody>
                  {SPECS.map((spec, idx) => (
                    <tr key={spec.key} className={idx % 2 === 0 ? "bg-white" : "bg-white"}>
                      <td className="text-xs text-[#9a8a7a] font-medium py-3 pr-3 rounded-r-lg">{spec.label}</td>
                      {compareProducts.map((p) => (
                        <td key={p.id} className="text-right text-sm text-[#1a1410] py-3 px-4">
                          {spec.key === "pvd" ? <i className="ri-checkbox-circle-fill text-[#3ab4f2]"></i> : spec.value}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Color row */}
                  <tr className="bg-white">
                    <td className="text-xs text-[#9a8a7a] font-medium py-3 pr-3">גימור</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="text-right text-xs text-[#1a1410] py-3 px-4">{p.color}</td>
                    ))}
                  </tr>

                  {/* CTA row */}
                  <tr>
                    <td />
                    {compareProducts.map((p) => (
                      <td key={p.id} className="text-right py-5 px-4">
                        <Link
                          to={`/product/${p.id}`}
                          className="inline-block bg-[#1a1a1a] hover:bg-[#333] text-white text-xs font-semibold tracking-widest px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                        >
                          לעמוד המוצר
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
