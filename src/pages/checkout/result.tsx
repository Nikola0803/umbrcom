import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageLayout from "../../components/feature/PageLayout";
import { confirmPelecardPayment, fetchOrderStatus, OrderResult } from "@/lib/wp-api";

/**
 * /checkout/result — Pelecard sends the shopper back here after the hosted
 * payment page, appending its transaction params to the URL we gave it at
 * init (order_id + order_key are ours; PelecardTransactionId /
 * PelecardStatusCode / ConfirmationKey / Token are Pelecard's).
 *
 * Nothing in the URL is trusted on its own: the params are posted to the
 * backend, which asks Pelecard to validate them (ValidateByUniqueKey)
 * before the order is marked paid.
 */
export default function CheckoutResultPage() {
  const [params] = useSearchParams();
  const [result, setResult] = useState<OrderResult | null>(null);
  const [state, setState] = useState<"loading" | "done" | "error">("loading");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // guard StrictMode double-invoke
    ran.current = true;

    const orderId = params.get("order_id") ?? "";
    const orderKey = params.get("order_key") ?? "";
    const transactionId = params.get("PelecardTransactionId") ?? "";
    const statusCode = params.get("PelecardStatusCode") ?? "";
    const confirmationKey = params.get("ConfirmationKey") ?? "";
    const token = params.get("Token") ?? "";

    if (!orderId || !orderKey) {
      setState("error");
      return;
    }

    (async () => {
      // With Pelecard params → confirm; without (e.g. page refresh, or the
      // server-side notify already handled it) → just read order status.
      const res =
        transactionId || statusCode
          ? await confirmPelecardPayment({
              order_id: orderId,
              order_key: orderKey,
              status_code: statusCode,
              transaction_id: transactionId,
              confirmation_key: confirmationKey,
              token: token || undefined,
            })
          : await fetchOrderStatus(orderId, orderKey);

      if (!res || "error" in res) {
        setState("error");
        return;
      }
      setResult(res);
      setState("done");
    })();
  }, [params]);

  const paid = result?.status === "paid";

  return (
    <PageLayout>
      <div className="min-h-[60vh] flex flex-col items-start justify-center text-right px-10 py-20">
        {state === "loading" && (
          <>
            <i className="ri-loader-4-line text-4xl text-[#1a1a1a] animate-spin mb-6"></i>
            <h2 className="font-serif text-2xl font-light text-[#1a1410] mb-2">מאמתים את התשלום...</h2>
            <p className="text-sm text-[#9a8a7a]">רגע אחד, אנחנו מוודאים את פרטי העסקה מול חברת הסליקה.</p>
          </>
        )}

        {state === "done" && paid && result && (
          <>
            <div className="w-20 h-20 rounded-full bg-[#f0faf2] flex items-center justify-center mb-6">
              <i className="ri-check-line text-4xl text-[#2d7a3a]"></i>
            </div>
            <h2 className="font-serif text-3xl font-light text-[#1a1410] mb-3">התשלום התקבל!</h2>
            <p className="text-sm text-[#6a5e52] mb-2">תודה, {result.first_name || "לקוח יקר"}.</p>
            <p className="text-sm text-[#9a8a7a] mb-8 max-w-sm leading-relaxed">
              אישור הזמנה נשלח אל {result.email}. מספר הזמנה: <strong>#{result.order_number}</strong>
              {" · "}סה״כ שולם: <strong>₪{result.total.toLocaleString("he-IL")}</strong>
            </p>
            <Link
              to="/"
              className="bg-[#1a1410] text-white text-xs font-semibold tracking-widest px-8 py-3.5 rounded-xl whitespace-nowrap cursor-pointer hover:bg-[#1a1a1a] transition-colors"
            >
              חזרה לדף הבית
            </Link>
          </>
        )}

        {state === "done" && !paid && (
          <>
            <div className="w-20 h-20 rounded-full bg-[#fdf0ef] flex items-center justify-center mb-6">
              <i className="ri-close-line text-4xl text-[#b3261e]"></i>
            </div>
            <h2 className="font-serif text-3xl font-light text-[#1a1410] mb-3">התשלום לא הושלם</h2>
            <p className="text-sm text-[#9a8a7a] mb-8 max-w-sm leading-relaxed">
              {result?.status === "pending"
                ? "העסקה טרם אושרה. אם חויבתם — ניצור אתכם קשר. אפשר גם לנסות שוב."
                : "העסקה נדחתה או בוטלה. לא בוצע חיוב — אפשר לנסות שוב או לפנות אלינו."}
            </p>
            <div className="flex gap-3">
              <Link
                to="/checkout"
                className="bg-[#1a1410] text-white text-xs font-semibold tracking-widest px-8 py-3.5 rounded-xl whitespace-nowrap cursor-pointer hover:bg-[#1a1a1a] transition-colors"
              >
                ניסיון נוסף
              </Link>
              <Link
                to="/contact"
                className="border border-[#ede9e1] text-[#6a5e52] text-xs font-semibold tracking-widest px-8 py-3.5 rounded-xl whitespace-nowrap cursor-pointer hover:border-[#1a1a1a] transition-colors"
              >
                יצירת קשר
              </Link>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <i className="ri-error-warning-line text-4xl text-[#b3261e] mb-6"></i>
            <h2 className="font-serif text-2xl font-light text-[#1a1410] mb-3">לא הצלחנו לאמת את התשלום</h2>
            <p className="text-sm text-[#9a8a7a] mb-8 max-w-sm leading-relaxed">
              ייתכן שהתשלום עבר בהצלחה — בדקו את האימייל שלכם לאישור הזמנה, או פנו אלינו ונבדוק מיד.
            </p>
            <Link
              to="/contact"
              className="bg-[#1a1410] text-white text-xs font-semibold tracking-widest px-8 py-3.5 rounded-xl whitespace-nowrap cursor-pointer hover:bg-[#1a1a1a] transition-colors"
            >
              יצירת קשר
            </Link>
          </>
        )}
      </div>
    </PageLayout>
  );
}
