import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../../components/feature/PageLayout";

const MOCK_ORDERS = [
  { id: "ORD-2025-001", date: "12/03/2025", status: "נשלח", total: 1_890, items: 2 },
  { id: "ORD-2025-002", date: "28/02/2025", status: "הושלם", total: 3_450, items: 1 },
  { id: "ORD-2024-045", date: "05/11/2024", status: "הושלם", total: 920, items: 1 },
];

const STATUS_STYLE: Record<string, string> = {
  "נשלח": "bg-blue-50 text-blue-700 border-blue-200",
  "הושלם": "bg-green-50 text-green-700 border-green-200",
  "בטיפול": "bg-yellow-50 text-yellow-700 border-yellow-200",
};

type Tab = "orders" | "profile" | "wishlist";

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>("orders");

  return (
    <PageLayout>
      <section className="w-full bg-white min-h-[70vh] py-12 px-6" dir="rtl">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-medium tracking-[0.4em] text-[#aaa] uppercase mb-1">החשבון שלך</p>
              <h1 className="font-serif text-3xl font-light text-[#1a1410]">שלום, ישראל 👋</h1>
            </div>
            <Link
              to="/auth"
              className="text-xs text-[#999] hover:text-[#1a1a1a] border border-[#ede9e1] hover:border-[#1a1a1a] px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              התנתקות
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-[#ede9e1] mb-8">
            {([
              { key: "orders", label: "הזמנות", icon: "ri-shopping-bag-line" },
              { key: "profile", label: "פרופיל", icon: "ri-user-3-line" },
              { key: "wishlist", label: "מועדפים", icon: "ri-heart-line" },
            ] as { key: Tab; label: string; icon: string }[]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                  tab === t.key
                    ? "border-[#1a1a1a] text-[#1a1a1a]"
                    : "border-transparent text-[#999] hover:text-[#1a1a1a]"
                }`}
              >
                <i className={`${t.icon} text-base`}></i>
                {t.label}
              </button>
            ))}
          </div>

          {/* Orders tab */}
          {tab === "orders" && (
            <div className="space-y-4">
              {MOCK_ORDERS.map((o) => (
                <div key={o.id} className="border border-[#ede9e1] rounded-2xl p-5 bg-white hover:border-[#c8c4be] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-[#1a1410]">{o.id}</span>
                    <span className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${STATUS_STYLE[o.status] ?? ""}`}>
                      {o.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#9a8a7a]">
                    <span className="font-bold text-[#1a1410] text-base">₪{o.total.toLocaleString("he-IL")}</span>
                    <span>{o.date} · {o.items} פריטים</span>
                  </div>
                </div>
              ))}
              {MOCK_ORDERS.length === 0 && (
                <div className="text-right py-16 text-[#bbb]">
                  <i className="ri-shopping-bag-line text-4xl mb-3 block"></i>
                  <p className="text-sm">עדיין לא ביצעתם הזמנות</p>
                  <Link to="/shop" className="mt-4 inline-block text-xs font-semibold text-[#1a1a1a] border border-[#1a1a1a] px-6 py-2.5 rounded-full hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer">
                    לחנות שלנו
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Profile tab */}
          {tab === "profile" && (
            <form className="space-y-4 max-w-md" onSubmit={(e) => e.preventDefault()}>
              {[
                { label: "שם מלא", defaultVal: "ישראל ישראלי", type: "text" },
                { label: "אימייל", defaultVal: "israel@example.com", type: "email", ltr: true },
                { label: "טלפון", defaultVal: "050-000-0000", type: "tel", ltr: true },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-[#1a1410] mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    defaultValue={f.defaultVal}
                    dir={f.ltr ? "ltr" : undefined}
                    className="w-full px-4 py-3 rounded-xl border border-[#ede9e1] text-sm text-right text-[#1a1410] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="bg-[#1a1a1a] text-white text-sm font-semibold px-8 py-3 rounded-xl hover:bg-[#333] transition-colors cursor-pointer"
              >
                שמירת שינויים
              </button>
            </form>
          )}

          {/* Wishlist tab */}
          {tab === "wishlist" && (
            <div className="text-right py-16 text-[#bbb]">
              <i className="ri-heart-line text-4xl mb-3 block"></i>
              <p className="text-sm">רשימת המועדפים שלכם ריקה</p>
              <Link to="/shop" className="mt-4 inline-block text-xs font-semibold text-[#1a1a1a] border border-[#1a1a1a] px-6 py-2.5 rounded-full hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer">
                גלו מוצרים
              </Link>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
