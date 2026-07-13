import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../../components/feature/PageLayout";
import { useCart } from "@/context/CartContext";

type Step = "details" | "shipping" | "payment" | "confirm";

const STEPS: { key: Step; label: string }[] = [
  { key: "details", label: "פרטים אישיים" },
  { key: "shipping", label: "משלוח" },
  { key: "payment", label: "תשלום" },
  { key: "confirm", label: "אישור הזמנה" },
];

const SHIPPING_OPTIONS = [
  { id: "standard", label: "משלוח סטנדרטי", sub: "3–5 ימי עסקים", price: 28 },
  { id: "express", label: "משלוח מהיר", sub: "1–2 ימי עסקים", price: 49 },
  { id: "free", label: "משלוח חינם", sub: "מעל ₪200 — 3–5 ימי עסקים", price: 0, minOrder: 200 },
];

interface DetailsForm {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; city: string; zip: string; notes: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("details");
  const [shipping, setShipping] = useState("standard");
  const [details, setDetails] = useState<DetailsForm>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", zip: "", notes: "",
  });
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [ordered, setOrdered] = useState(false);

  const shippingCost = (() => {
    const opt = SHIPPING_OPTIONS.find((o) => o.id === shipping);
    if (!opt) return 0;
    if (opt.id === "free") return totalPrice >= 200 ? 0 : 28;
    return opt.price;
  })();
  const total = totalPrice + shippingCost;

  const stepIdx = STEPS.findIndex((s) => s.key === step);

  const next = () => {
    const order: Step[] = ["details", "shipping", "payment", "confirm"];
    const i = order.indexOf(step);
    if (i < order.length - 1) setStep(order[i + 1]);
  };

  const placeOrder = () => {
    setOrdered(true);
    clearCart?.();
  };

  // Empty cart
  if (items.length === 0 && !ordered) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8 py-20">
          <i className="ri-shopping-bag-line text-5xl text-[#1a1a1a] mb-4"></i>
          <h2 className="font-serif text-2xl text-[#1a1410] mb-3">הסל ריק</h2>
          <p className="text-sm text-[#9a8a7a] mb-8">הוסף מוצרים לסל כדי להמשיך לתשלום.</p>
          <Link to="/shop" className="bg-[#1a1a1a] text-white text-xs font-semibold tracking-widest px-8 py-3.5 rounded-xl whitespace-nowrap cursor-pointer">
            לחנות שלנו
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Success screen
  if (ordered) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-8 py-20">
          <div className="w-20 h-20 rounded-full bg-[#f0faf2] flex items-center justify-center mb-6">
            <i className="ri-check-line text-4xl text-[#2d7a3a]"></i>
          </div>
          <h2 className="font-serif text-3xl font-light text-[#1a1410] mb-3">ההזמנה התקבלה!</h2>
          <p className="text-sm text-[#6a5e52] mb-2">תודה, {details.firstName || "לקוח יקר"}.</p>
          <p className="text-sm text-[#9a8a7a] mb-8 max-w-xs">
            אישור ישלח אל {details.email || "כתובת האימייל שלך"} בקרוב. מספר הזמנה: <strong>#UM{Math.floor(Math.random() * 90000 + 10000)}</strong>
          </p>
          <Link to="/" className="bg-[#1a1410] text-white text-xs font-semibold tracking-widest px-8 py-3.5 rounded-xl whitespace-nowrap cursor-pointer hover:bg-[#1a1a1a] transition-colors">
            חזרה לדף הבית
          </Link>
        </div>
      </PageLayout>
    );
  }

  const field = (label: string, key: keyof DetailsForm, type = "text", placeholder = "") => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#1a1410]">{label}</label>
      <input
        type={type}
        value={details[key]}
        onChange={(e) => setDetails((d) => ({ ...d, [key]: e.target.value }))}
        placeholder={placeholder}
        className="border border-[#ede9e1] rounded-xl px-4 py-3 text-sm text-right text-[#1a1410] placeholder-[#ccc] outline-none focus:border-[#1a1a1a] transition-colors bg-white"
      />
    </div>
  );

  return (
    <PageLayout>
      {/* Banner */}
      <div className="w-full bg-[#0f0f0f] py-10 text-center">
        <h1 className="font-serif text-3xl font-light text-white">קופה</h1>
      </div>

      {/* Step indicator */}
      <div className="w-full bg-[#faf8f5] border-b border-[#ede9e1] py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      i < stepIdx
                        ? "bg-[#2d7a3a] text-white"
                        : i === stepIdx
                        ? "bg-[#1a1a1a] text-white"
                        : "bg-[#ede9e1] text-[#aaa]"
                    }`}
                  >
                    {i < stepIdx ? <i className="ri-check-line"></i> : i + 1}
                  </div>
                  <span className={`text-[10px] mt-1 hidden sm:block ${i === stepIdx ? "text-[#1a1a1a] font-semibold" : "text-[#aaa]"}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-12 sm:w-20 h-px mx-2 ${i < stepIdx ? "bg-[#2d7a3a]" : "bg-[#ede9e1]"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: form ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step 1: Personal details */}
            {step === "details" && (
              <>
              {/* ── Login / Register option ── */}
              <div className="bg-[#fafcff] rounded-2xl border border-[#d4e8f8] p-5 sm:p-6 text-right" dir="rtl">
                <div className="flex items-center gap-3 mb-3 flex-row-reverse">
                  <i className="ri-user-3-line text-[#3ab4f2] text-xl"></i>
                  <p className="text-sm font-semibold text-[#1a1410]">
                    יש לכם חשבון? התחברו לבצוע מהיר יותר
                  </p>
                </div>
                <p className="text-xs text-[#9a8a7a] mb-4 leading-relaxed">
                  התחברות ממלאת את הפרטים אוטומטית, שומרת את ההזמנה בהיסטוריה שלכם ומאפשרת מעקב קל.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/auth"
                    className="flex items-center gap-2 text-xs font-semibold text-white bg-[#3ab4f2] hover:bg-[#2da0d8] px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    <i className="ri-login-box-line text-sm"></i>
                    התחברות לחשבון
                  </Link>
                  <Link
                    to="/auth"
                    className="flex items-center gap-2 text-xs font-semibold text-[#3ab4f2] border border-[#3ab4f2] hover:bg-[#3ab4f2] hover:text-white px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    הרשמה בחינם
                  </Link>
                  <span className="self-center text-xs text-[#bbb]">או המשיכו ללא חשבון ↓</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#ede9e1] p-6 sm:p-8 space-y-5">
                <h2 className="font-serif text-xl font-light text-[#1a1410] text-right">פרטים אישיים</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {field("שם פרטי", "firstName", "text", "ישראל")}
                  {field("שם משפחה", "lastName", "text", "ישראלי")}
                  {field("אימייל", "email", "email", "you@example.com")}
                  {field("טלפון", "phone", "tel", "05X-XXX-XXXX")}
                </div>
                <hr className="border-[#ede9e1]" />
                <h3 className="text-sm font-semibold text-[#1a1410] text-right">כתובת למשלוח</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {field("כתובת", "address", "text", "רחוב ומספר")}
                  {field("עיר", "city", "text", "תל אביב")}
                  {field("מיקוד", "zip", "text", "XXXXXXX")}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1a1410]">הערות להזמנה (אופציונלי)</label>
                  <textarea
                    value={details.notes}
                    onChange={(e) => setDetails((d) => ({ ...d, notes: e.target.value }))}
                    rows={3}
                    placeholder="הוראות מיוחדות לשליח..."
                    className="border border-[#ede9e1] rounded-xl px-4 py-3 text-sm text-right text-[#1a1410] placeholder-[#ccc] outline-none focus:border-[#1a1a1a] transition-colors resize-none bg-white"
                  />
                </div>
                <button
                  onClick={next}
                  disabled={!details.firstName || !details.email || !details.phone || !details.address || !details.city}
                  className="w-full py-4 bg-[#1a1410] text-white text-sm font-semibold tracking-widest rounded-xl hover:bg-[#1a1a1a] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  המשך לאפשרויות משלוח ←
                </button>
              </div>
              </>
            )}

            {/* Step 2: Shipping */}
            {step === "shipping" && (
              <div className="bg-white rounded-2xl border border-[#ede9e1] p-6 sm:p-8 space-y-4">
                <h2 className="font-serif text-xl font-light text-[#1a1410] text-right">אפשרויות משלוח</h2>
                <div className="space-y-3">
                  {SHIPPING_OPTIONS.map((opt) => {
                    const disabled = opt.id === "free" && totalPrice < 200;
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          shipping === opt.id && !disabled
                            ? "border-[#1a1a1a] bg-[#fdf8f2]"
                            : disabled
                            ? "border-[#f0ece5] bg-[#f9f9f9] opacity-50 cursor-not-allowed"
                            : "border-[#ede9e1] hover:border-[#1a1a1a]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={opt.id}
                            checked={shipping === opt.id}
                            onChange={() => !disabled && setShipping(opt.id)}
                            disabled={disabled}
                            className="accent-[#1a1a1a]"
                          />
                        </div>
                        <div className="flex-1 text-right">
                          <p className="text-sm font-semibold text-[#1a1410]">{opt.label}</p>
                          <p className="text-xs text-[#9a8a7a]">{opt.sub}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#1a1410] whitespace-nowrap">
                          {opt.price === 0 ? "חינם" : `₪${opt.price}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep("details")} className="flex-1 py-3.5 border border-[#ede9e1] rounded-xl text-sm text-[#6a5e52] hover:border-[#1a1a1a] transition-colors cursor-pointer whitespace-nowrap">
                    ← חזרה
                  </button>
                  <button onClick={next} className="flex-1 py-3.5 bg-[#1a1410] text-white text-sm font-semibold tracking-widest rounded-xl hover:bg-[#1a1a1a] transition-colors cursor-pointer whitespace-nowrap">
                    המשך לתשלום ←
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === "payment" && (
              <div className="bg-white rounded-2xl border border-[#ede9e1] p-6 sm:p-8 space-y-5">
                <h2 className="font-serif text-xl font-light text-[#1a1410] text-right">פרטי תשלום</h2>
                <div className="flex items-center gap-2 text-xs text-[#9a8a7a] justify-end">
                  <i className="ri-lock-line text-[#1a1a1a]"></i>
                  תשלום מאובטח ב-SSL — הפרטים מוצפנים
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1a1410]">מספר כרטיס אשראי</label>
                    <input
                      type="text"
                      value={cardNum}
                      onChange={(e) => setCardNum(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="border border-[#ede9e1] rounded-xl px-4 py-3 text-sm text-right placeholder-[#ccc] outline-none focus:border-[#1a1a1a] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1a1410]">שם בעל הכרטיס</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="כפי שמופיע על הכרטיס"
                      className="border border-[#ede9e1] rounded-xl px-4 py-3 text-sm text-right placeholder-[#ccc] outline-none focus:border-[#1a1a1a] transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#1a1410]">תוקף</label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                          setCardExp(v);
                        }}
                        placeholder="MM/YY"
                        className="border border-[#ede9e1] rounded-xl px-4 py-3 text-sm text-right placeholder-[#ccc] outline-none focus:border-[#1a1a1a] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#1a1410]">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="•••"
                        className="border border-[#ede9e1] rounded-xl px-4 py-3 text-sm text-right placeholder-[#ccc] outline-none focus:border-[#1a1a1a] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Accepted cards */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  {["Visa", "Mastercard", "Amex", "Isracard"].map((c) => (
                    <span key={c} className="text-[10px] font-medium text-[#999] border border-[#ede9e1] rounded px-2 py-0.5">{c}</span>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep("shipping")} className="flex-1 py-3.5 border border-[#ede9e1] rounded-xl text-sm text-[#6a5e52] hover:border-[#1a1a1a] transition-colors cursor-pointer whitespace-nowrap">
                    ← חזרה
                  </button>
                  <button
                    onClick={next}
                    disabled={cardNum.length < 19 || !cardName || cardExp.length < 5 || cardCvv.length < 3}
                    className="flex-1 py-3.5 bg-[#1a1410] text-white text-sm font-semibold tracking-widest rounded-xl hover:bg-[#1a1a1a] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    לסיכום ←
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === "confirm" && (
              <div className="bg-white rounded-2xl border border-[#ede9e1] p-6 sm:p-8 space-y-5">
                <h2 className="font-serif text-xl font-light text-[#1a1410] text-right">סיכום הזמנה</h2>

                {/* Details summary */}
                <div className="bg-[#faf8f5] rounded-xl p-4 text-right space-y-1 text-sm text-[#6a5e52]">
                  <p className="font-semibold text-[#1a1410]">{details.firstName} {details.lastName}</p>
                  <p>{details.address}, {details.city}</p>
                  <p>{details.email} | {details.phone}</p>
                  <p className="mt-2 text-xs text-[#1a1a1a]">
                    {SHIPPING_OPTIONS.find((o) => o.id === shipping)?.label}
                  </p>
                </div>

                {/* Items */}
                <div className="divide-y divide-[#ede9e1]">
                  {items.map(({ product, qty }) => (
                    <div key={product.id} className="flex items-center justify-between gap-3 py-3">
                      <span className="text-sm font-semibold text-[#1a1410]">₪{(product.price * qty).toLocaleString("he-IL")}</span>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-[#1a1410] leading-snug line-clamp-1">{product.name}</p>
                          <p className="text-xs text-[#aaa]">כמות: {qty}</p>
                        </div>
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-contain bg-[#faf8f5] rounded-lg p-1" />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-[#9a8a7a] text-right leading-relaxed">
                  בלחיצה על "אישור וסיום" אתה מאשר את{" "}
                  <Link to="/terms" className="text-[#1a1a1a] underline">תנאי השימוש</Link>{" "}
                  ו<Link to="/privacy" className="text-[#1a1a1a] underline">מדיניות הפרטיות</Link>.
                </p>

                <div className="flex gap-3">
                  <button onClick={() => setStep("payment")} className="flex-1 py-3.5 border border-[#ede9e1] rounded-xl text-sm text-[#6a5e52] hover:border-[#1a1a1a] transition-colors cursor-pointer whitespace-nowrap">
                    ← חזרה
                  </button>
                  <button
                    onClick={placeOrder}
                    className="flex-1 py-4 bg-[#2d7a3a] text-white text-sm font-semibold tracking-widest rounded-xl hover:bg-[#256832] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    ✓ אישור וסיום
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: order summary ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#ede9e1] p-5 sticky top-28">
              <h3 className="font-serif text-lg font-light text-[#1a1410] text-right mb-4">סיכום הזמנה</h3>

              <div className="space-y-3 mb-4">
                {items.map(({ product, qty }) => (
                  <div key={product.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium text-[#1a1410]">₪{(product.price * qty).toLocaleString("he-IL")}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#6a5e52] line-clamp-1 max-w-[120px] text-right">{product.name}</span>
                      <span className="text-[10px] text-white bg-[#1a1a1a] rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{qty}</span>
                      <img src={product.image} alt="" className="w-10 h-10 object-contain bg-[#faf8f5] rounded-lg p-1 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#ede9e1] pt-4 space-y-2">
                <div className="flex justify-between text-sm text-[#6a5e52]">
                  <span>₪{totalPrice.toLocaleString("he-IL")}</span>
                  <span>סכום מוצרים</span>
                </div>
                <div className="flex justify-between text-sm text-[#6a5e52]">
                  <span>{shippingCost === 0 ? "חינם" : `₪${shippingCost}`}</span>
                  <span>משלוח</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1a1410] pt-2 border-t border-[#ede9e1]">
                  <span>₪{total.toLocaleString("he-IL")}</span>
                  <span>סה״כ</span>
                </div>
              </div>

              {totalPrice >= 200 && (
                <p className="mt-3 text-xs text-[#2d7a3a] text-right flex items-center justify-end gap-1.5">
                  <i className="ri-truck-line"></i> זכאי למשלוח חינם!
                </p>
              )}
            </div>

            {/* Trust badges */}
            <div className="bg-[#faf8f5] rounded-2xl border border-[#ede9e1] p-4 space-y-2">
              {[
                { icon: "ri-lock-line", text: "תשלום מאובטח ב-SSL" },
                { icon: "ri-shield-check-line", text: "אחריות 7 שנים" },
                { icon: "ri-arrow-go-back-line", text: "החזרה ב-14 יום" },
              ].map((b) => (
                <div key={b.text} className="flex items-center justify-end gap-2 text-xs text-[#9a8a7a]">
                  <span>{b.text}</span>
                  <i className={`${b.icon} text-[#1a1a1a]`}></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
