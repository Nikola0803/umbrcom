import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../../components/feature/PageLayout";
import { useCart, type CartItem } from "@/context/CartContext";
import { createPelecardCheckout, isWpConfigured } from "@/lib/wp-api";
import { trackBeginCheckout } from "@/lib/analytics";

// Items 28-30 (July 2026): checkout simplified to two steps — everything
// that used to live on separate "shipping" and "payment" pages (the
// shipping method choice and the PlaCard payment selection) now sits
// directly on the Checkout Details step. Only "confirm" remains separate,
// for a final review before charging the card.
type Step = "details" | "confirm";

const STEPS: { key: Step; label: string }[] = [
  { key: "details", label: "פרטי הזמנה" },
  { key: "confirm", label: "אישור הזמנה" },
];

// Item 26: free shipping threshold.
const FREE_SHIPPING_THRESHOLD = 250;
const STANDARD_SHIPPING_FEE = 28;
const STORE_ADDRESS = "דוד סהרוב 18, ראשון לציון";

// Item 28: only these two options — the old "Fast Shipping" tier is gone.
const SHIPPING_OPTIONS = [
  {
    id: "delivery",
    label: "משלוח עד הבית",
    sub: `חינם בהזמנות מעל ₪${FREE_SHIPPING_THRESHOLD} · אחרת ₪${STANDARD_SHIPPING_FEE}`,
  },
  {
    id: "pickup",
    label: "איסוף עצמי מהחנות",
    sub: STORE_ADDRESS,
  },
];

interface DetailsForm {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; city: string; zip: string; notes: string;
  // Item 24
  invoiceName: string; companyRegNumber: string;
  // Item 25
  israeliId: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("details");
  const [shipping, setShipping] = useState("delivery");
  const [details, setDetails] = useState<DetailsForm>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", zip: "", notes: "",
    invoiceName: "", companyRegNumber: "", israeliId: "",
  });
  const [ordered, setOrdered] = useState(false);
  // Item 13: snapshot of the cart at the moment of order placement, since
  // clearCart() empties `items` right after — the confirmation screen needs
  // something to show the product images from.
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Item 32/33 — Terms & Conditions checkbox, required, with a direct link.
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Item 21 — account options on the order page
  const [createAccount, setCreateAccount] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loggedInAs, setLoggedInAs] = useState<string | null>(null);

  const handleInlineLogin = () => {
    if (!loginEmail || !loginPassword) return;
    // TODO: wire to the real auth endpoint. Demo: mark as logged in and
    // pre-fill the order email.
    setLoggedInAs(loginEmail);
    setDetails((d) => ({ ...d, email: d.email || loginEmail }));
    setShowLogin(false);
  };

  // Item 26: home delivery is free above the threshold; store pickup is
  // always free.
  const shippingCost = (() => {
    if (shipping === "pickup") return 0;
    return totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  })();
  const total = totalPrice + shippingCost;

  // Item 25: mandatory Israeli ID field once the order total passes ₪5,000.
  const requiresIsraeliId = total > 5000;

  const stepIdx = STEPS.findIndex((s) => s.key === step);

  const next = () => {
    const order: Step[] = ["details", "confirm"];
    const i = order.indexOf(step);
    if (i < order.length - 1) setStep(order[i + 1]);
  };

  const placeOrder = async () => {
    trackBeginCheckout(items, total);

    // No WordPress backend configured (local dev with mocks) — simulate.
    if (!isWpConfigured()) {
      setOrderedItems(items);
      setOrdered(true);
      clearCart?.();
      return;
    }

    setPaying(true);
    setPayError(null);

    const [firstName, ...rest] = [details.firstName, details.lastName];
    const session = await createPelecardCheckout({
      items: items.map(({ product, qty }) => ({ id: Number(product.id), quantity: qty })),
      customer: {
        first_name: firstName,
        last_name: rest.join(" "),
        email: details.email,
        phone: details.phone,
        address: details.address,
        city: details.city,
        zip: details.zip,
        notes: details.notes || undefined,
        invoice_name: details.invoiceName || undefined,
        company_reg_number: details.companyRegNumber || undefined,
        israeli_id: requiresIsraeliId ? details.israeliId : undefined,
      },
      shipping_method: shipping as "delivery" | "pickup",
    });

    if (!session || "error" in session) {
      setPayError(session && "error" in session ? session.error : "שגיאה ביצירת ההזמנה. נסו שוב.");
      setPaying(false);
      return;
    }

    // Off to Pelecard's PCI-compliant hosted payment page. It redirects
    // back to /checkout/result when done.
    window.location.href = session.redirect_url;
  };

  // Empty cart
  if (items.length === 0 && !ordered) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-start justify-center text-right px-10 py-20">
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

  // Success screen — item 13: redesigned, premium confirmation card with
  // product images (from the pre-clear cart snapshot).
  if (ordered) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#ede9e1] shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-[#f0faf2] flex items-center justify-center mb-6 mx-auto">
              <i className="ri-check-line text-4xl text-[#2d7a3a]"></i>
            </div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#1a1410] mb-2">ההזמנה התקבלה!</h2>
            <p className="text-sm text-[#6a5e52] mb-1">תודה, {details.firstName || "לקוח יקר"}.</p>
            <p className="text-sm text-[#9a8a7a] mb-6 max-w-xs mx-auto">
              אישור ישלח אל {details.email || "כתובת האימייל שלך"} בקרוב.
            </p>

            <div className="inline-block bg-[#faf9f7] rounded-2xl py-3 px-6 mb-6">
              <p className="text-[10px] text-[#9a8a7a] uppercase tracking-wider mb-1">מספר הזמנה</p>
              <p className="text-sm font-bold text-[#1a1410]">#UM{Math.floor(Math.random() * 90000 + 10000)}</p>
            </div>

            {orderedItems.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
                {orderedItems.map(({ product, qty }) => (
                  <div key={product.id} className="flex flex-col items-center gap-1.5">
                    <div className="w-full aspect-square rounded-xl bg-white border border-[#eee] overflow-hidden flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                    </div>
                    <span className="text-[10px] text-[#9a8a7a]">×{qty}</span>
                  </div>
                ))}
              </div>
            )}

            <Link to="/" className="inline-block bg-[#1a1410] text-white text-xs font-semibold tracking-widest px-10 py-4 rounded-xl whitespace-nowrap cursor-pointer hover:bg-[#1a1a1a] transition-colors">
              חזרה לדף הבית
            </Link>
          </div>
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
      <div className="w-full bg-[#0f0f0f] py-10 text-right">
        <h1 className="font-serif text-3xl font-light text-white">קופה</h1>
      </div>

      {/* Step indicator */}
      <div className="w-full bg-white border-b border-[#ede9e1] py-4">
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
                {loggedInAs ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#2d7a3a] bg-[#eef8f0] border border-[#cfe8d4] rounded-xl px-4 py-3">
                    <i className="ri-checkbox-circle-fill"></i>
                    מחוברים כ-{loggedInAs}
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setShowLogin((v) => !v)}
                        className="flex items-center gap-2 text-xs font-semibold text-white bg-[#3ab4f2] hover:bg-[#2da0d8] px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                      >
                        <i className="ri-login-box-line text-sm"></i>
                        התחברות לחשבון קיים
                      </button>
                      <Link
                        to="/auth"
                        className="flex items-center gap-2 text-xs font-semibold text-[#3ab4f2] border border-[#3ab4f2] hover:bg-[#3ab4f2] hover:text-white px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                      >
                        הרשמה בחינם
                      </Link>
                      <span className="self-center text-xs text-[#bbb]">או המשיכו ללא חשבון ↓</span>
                    </div>

                    {/* Inline login form — connect an existing account from the order page */}
                    {showLogin && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[#1a1410]">אימייל</label>
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="border border-[#d4e8f8] rounded-xl px-4 py-2.5 text-sm text-right outline-none focus:border-[#3ab4f2] transition-colors bg-white"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-[#1a1410]">סיסמה</label>
                          <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="border border-[#d4e8f8] rounded-xl px-4 py-2.5 text-sm text-right outline-none focus:border-[#3ab4f2] transition-colors bg-white"
                          />
                        </div>
                        <button
                          onClick={handleInlineLogin}
                          disabled={!loginEmail || !loginPassword}
                          className="h-[42px] px-6 text-xs font-semibold text-white bg-[#3ab4f2] hover:bg-[#2da0d8] rounded-xl transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
                        >
                          התחברות
                        </button>
                      </div>
                    )}
                  </>
                )}
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

                {/* Item 24 — invoice fields (optional, for business orders) */}
                <hr className="border-[#ede9e1]" />
                <h3 className="text-sm font-semibold text-[#1a1410] text-right">פרטי חשבונית (אופציונלי, לעסקים)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {field("שם לחשבונית", "invoiceName", "text", "שם העסק / שם מלא")}
                  {field("ח.פ / מספר עוסק מורשה", "companyRegNumber", "text", "XXXXXXXXX")}
                </div>

                {/* Item 25 — mandatory Israeli ID once the order passes ₪5,000 */}
                {requiresIsraeliId && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#1a1410]">
                      תעודת זהות <span className="text-[#c0392b]">*</span>
                      <span className="block text-[11px] font-normal text-[#9a8a7a] mt-0.5">
                        נדרש עבור הזמנות מעל ₪5,000, בהתאם לדרישות חברת הסליקה.
                      </span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={details.israeliId}
                      onChange={(e) => setDetails((d) => ({ ...d, israeliId: e.target.value }))}
                      placeholder="9 ספרות"
                      className="border border-[#ede9e1] rounded-xl px-4 py-3 text-sm text-right text-[#1a1410] placeholder-[#ccc] outline-none focus:border-[#1a1a1a] transition-colors bg-white"
                    />
                  </div>
                )}

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

                {/* Item 21 — create a user account with the order details */}
                {!loggedInAs && (
                  <div className="rounded-xl border border-[#d4e8f8] bg-[#fafcff] p-4">
                    <label className="flex items-center justify-end gap-3 cursor-pointer select-none">
                      <span className="text-sm font-medium text-[#1a1410]">
                        צרו לי חשבון עם פרטי ההזמנה
                        <span className="block text-[11px] font-normal text-[#9a8a7a] mt-0.5">
                          נשתמש בשם, באימייל ובכתובת שמילאתם — רק בחרו סיסמה.
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={createAccount}
                        onChange={(e) => setCreateAccount(e.target.checked)}
                        className="w-4 h-4 accent-[#3ab4f2] cursor-pointer"
                      />
                    </label>
                    {createAccount && (
                      <div className="flex flex-col gap-1.5 mt-3">
                        <label className="text-xs font-semibold text-[#1a1410]">בחרו סיסמה לחשבון</label>
                        <input
                          type="password"
                          value={accountPassword}
                          onChange={(e) => setAccountPassword(e.target.value)}
                          placeholder="לפחות 8 תווים"
                          className="border border-[#d4e8f8] rounded-xl px-4 py-2.5 text-sm text-right outline-none focus:border-[#3ab4f2] transition-colors bg-white"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Items 28-29 — shipping method, chosen right here on the
                    Checkout Details step (no separate shipping page). */}
                <hr className="border-[#ede9e1]" />
                <h3 className="text-sm font-semibold text-[#1a1410] text-right">אופן המשלוח</h3>
                <div className="space-y-3">
                  {SHIPPING_OPTIONS.map((opt) => {
                    const price = opt.id === "pickup" ? 0 : shippingCost;
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          shipping === opt.id ? "border-[#1a1a1a] bg-white" : "border-[#ede9e1] hover:border-[#1a1a1a]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={opt.id}
                            checked={shipping === opt.id}
                            onChange={() => setShipping(opt.id)}
                            className="accent-[#1a1a1a]"
                          />
                        </div>
                        <div className="flex-1 text-right">
                          <p className="text-sm font-semibold text-[#1a1410]">{opt.label}</p>
                          <p className="text-xs text-[#9a8a7a]">{opt.sub}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#1a1410] whitespace-nowrap">
                          {price === 0 ? "חינם" : `₪${price}`}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Item 30 — PlaCard/Pelecard payment selection, also on this
                    same step (no separate payment page). */}
                <hr className="border-[#ede9e1]" />
                <h3 className="text-sm font-semibold text-[#1a1410] text-right">תשלום</h3>
                <div className="bg-[#fafcff] border border-[#d4e8f8] rounded-xl p-5 text-right space-y-3">
                  <div className="flex items-center gap-2 justify-end">
                    <p className="text-sm font-semibold text-[#1a1410]">תשלום מאובטח באמצעות Pelecard</p>
                    <i className="ri-bank-card-line text-xl text-[#3ab4f2]"></i>
                  </div>
                  <p className="text-xs text-[#6a5e52] leading-relaxed">
                    לאחר לחיצה על "אישור ומעבר לתשלום" תוזנו פרטי כרטיס האשראי כאן, מאובטח בתקן PCI-DSS —
                    פרטי הכרטיס אינם נשמרים באתר.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[#9a8a7a] justify-end pt-1">
                    <i className="ri-lock-line text-[#1a1a1a]"></i>
                    תשלום מאובטח ב-SSL — הפרטים מוצפנים
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {["Visa", "Mastercard", "Amex", "Isracard"].map((c) => (
                      <span key={c} className="text-[10px] font-medium text-[#999] border border-[#ede9e1] rounded px-2 py-0.5">{c}</span>
                    ))}
                  </div>
                </div>

                {/* Items 32-33 — Terms & Conditions checkbox with a direct,
                    clickable link to the Terms page (and Privacy Policy). */}
                <hr className="border-[#ede9e1]" />
                <label className="flex items-start justify-end gap-3 cursor-pointer select-none">
                  <span className="text-sm text-[#1a1410] leading-relaxed">
                    קראתי ואני מסכים/ה ל<Link to="/terms" target="_blank" className="text-[#3ab4f2] underline hover:text-[#2da0d8]">תנאי השימוש</Link>
                    {" "}ול<Link to="/privacy" target="_blank" className="text-[#3ab4f2] underline hover:text-[#2da0d8]">מדיניות הפרטיות</Link>
                    <span className="text-[#c0392b]"> *</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#3ab4f2] cursor-pointer flex-shrink-0"
                  />
                </label>

                <button
                  onClick={next}
                  disabled={
                    !details.firstName || !details.email || !details.phone || !details.address || !details.city ||
                    (createAccount && accountPassword.length < 8) ||
                    (requiresIsraeliId && details.israeliId.trim().length < 5) ||
                    !acceptedTerms
                  }
                  className="w-full py-4 bg-[#3ab4f2] text-white text-sm font-semibold tracking-widest rounded-xl hover:bg-[#2da0d8] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  המשך לסיכום ←
                </button>
              </div>
              </>
            )}

            {/* Step 4: Confirmation */}
            {step === "confirm" && (
              <div className="bg-white rounded-2xl border border-[#ede9e1] p-6 sm:p-8 space-y-5">
                <h2 className="font-serif text-xl font-light text-[#1a1410] text-right">סיכום הזמנה</h2>

                {/* Details summary */}
                <div className="bg-white rounded-xl p-4 text-right space-y-1 text-sm text-[#6a5e52]">
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
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-[#9a8a7a] text-right leading-relaxed">
                  בלחיצה על "אישור וסיום" אתה מאשר את{" "}
                  <Link to="/terms" className="text-[#1a1a1a] underline">תנאי השימוש</Link>{" "}
                  ו<Link to="/privacy" className="text-[#1a1a1a] underline">מדיניות הפרטיות</Link>.
                </p>

                {payError && (
                  <div className="flex items-center gap-2 justify-end text-xs font-semibold text-[#b3261e] bg-[#fdf0ef] border border-[#f3cfcc] rounded-xl px-4 py-3">
                    <span>{payError}</span>
                    <i className="ri-error-warning-line text-base"></i>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep("details")} disabled={paying} className="flex-1 py-3.5 border border-[#ede9e1] rounded-xl text-sm text-[#6a5e52] hover:border-[#1a1a1a] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40">
                    ← חזרה
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={paying}
                    className="flex-1 py-4 bg-[#2d7a3a] text-white text-sm font-semibold tracking-widest rounded-xl hover:bg-[#256832] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-wait"
                  >
                    {paying ? (
                      <span className="inline-flex items-center gap-2">
                        <i className="ri-loader-4-line animate-spin"></i>
                        מעביר לתשלום מאובטח...
                      </span>
                    ) : (
                      "✓ אישור ומעבר לתשלום"
                    )}
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
                      <img src={product.image} alt="" className="w-10 h-10 object-contain bg-white rounded-lg p-1 flex-shrink-0" />
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

              {totalPrice >= FREE_SHIPPING_THRESHOLD && (
                <p className="mt-3 text-xs text-[#2d7a3a] text-right flex items-center justify-end gap-1.5">
                  <i className="ri-truck-line"></i> זכאי למשלוח חינם!
                </p>
              )}
            </div>

            {/* Item 27: the "SSL Secure Payment" / "7 Year Warranty" /
                "14 Day Returns" trust-badge block that used to render here
                was removed entirely per Nik. */}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
