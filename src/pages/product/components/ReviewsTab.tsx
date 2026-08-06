import { useEffect, useState } from "react";
import { fetchProductReviews, submitProductReview, ProductReview, isWpConfigured } from "@/lib/wp-api";

function Stars({ value, size = "text-sm" }: { value: number; size?: string }) {
  const rounded = Math.round(value);
  return (
    <span className={`inline-flex items-center gap-0.5 ${size}`} dir="ltr">
      {[1, 2, 3, 4, 5].map((n) => (
        <i
          key={n}
          className={n <= rounded ? "ri-star-fill text-[#e0a83c]" : "ri-star-line text-[#ddd]"}
        ></i>
      ))}
    </span>
  );
}

/** Item: "no place for customers to add or read reviews" — was completely
 *  missing from the tabs. Backed by a new /umbrcom/v1/reviews REST route
 *  (WooCommerce's native comment-based product reviews under the hood),
 *  which requires the updated plugin to be installed on the VPS — same
 *  deploy step as the iCredit gateway. Degrades gracefully (shows a
 *  friendly "not connected yet" message) if WP isn't configured or the
 *  route isn't live yet, instead of silently failing. */
export default function ReviewsTab({ productId, productName }: { productId: number | string; productName: string }) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "ok" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isWpConfigured()) {
      setUnavailable(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetchProductReviews(productId).then((res) => {
      if (cancelled) return;
      if (!res) {
        setUnavailable(true);
      } else {
        setReviews(res.reviews);
        setAverage(res.average);
        setCount(res.count);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) return;
    setSubmitting(true);
    setSubmitState("idle");
    const res = await submitProductReview({ product_id: productId, name: name.trim(), email: email.trim(), rating, content: content.trim() });
    setSubmitting(false);
    if (!res || "error" in res) {
      setSubmitState("error");
      setSubmitError(res && "error" in res ? res.error : "שגיאה בשליחת הביקורת. נסו שוב.");
      return;
    }
    setSubmitState("ok");
    setName("");
    setEmail("");
    setContent("");
    setRating(5);
  };

  return (
    <div dir="rtl" className="space-y-8 text-right">
      {/* Summary */}
      {!loading && !unavailable && count > 0 && (
        <div className="flex items-center gap-3 justify-end">
          <span className="text-sm text-[#6a5e52]">({count} ביקורות)</span>
          <Stars value={average} size="text-base" />
          <span className="text-lg font-semibold text-[#1a1410]">{average.toFixed(1)}</span>
        </div>
      )}

      {loading && <p className="text-sm text-[#9a8a7a]">טוען ביקורות...</p>}

      {unavailable && (
        <p className="text-sm text-[#9a8a7a]">
          מערכת הביקורות עדיין לא מחוברת. נא לבדוק שוב בקרוב.
        </p>
      )}

      {!loading && !unavailable && reviews.length === 0 && (
        <p className="text-sm text-[#9a8a7a]">אין עדיין ביקורות למוצר זה — היו הראשונים לכתוב אחת!</p>
      )}

      {!loading && !unavailable && reviews.length > 0 && (
        <ul className="space-y-5">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-[#ede9e1] pb-5 last:border-0">
              <div className="flex items-center gap-3 justify-end mb-1.5">
                <span className="text-xs text-[#9a8a7a]">
                  {new Date(r.date).toLocaleDateString("he-IL")}
                </span>
                <span className="text-sm font-semibold text-[#1a1410]">{r.author}</span>
                <Stars value={r.rating} />
              </div>
              <p className="text-sm text-[#5a4e42] leading-relaxed">{r.content}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Submission form — only shown once we know whether the backend is
          actually reachable, so we're not letting people fill out a form
          that can't go anywhere. */}
      {!unavailable && (
        <form onSubmit={submit} className="border-t border-[#ede9e1] pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#1a1410]">כתבו ביקורת על {productName}</h3>

          <div className="flex items-center gap-1 justify-end" dir="ltr">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(n)}
                aria-label={`${n} כוכבים`}
                className="cursor-pointer text-xl leading-none"
              >
                <i className={n <= (hoverRating || rating) ? "ri-star-fill text-[#e0a83c]" : "ri-star-line text-[#ddd]"}></i>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="שם מלא"
              className="w-full border-b border-[#ddd] bg-transparent pb-2.5 text-sm text-right outline-none focus:border-[#1a1a1a] transition-colors"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="כתובת אימייל"
              className="w-full border-b border-[#ddd] bg-transparent pb-2.5 text-sm text-right outline-none focus:border-[#1a1a1a] transition-colors"
            />
          </div>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="מה דעתכם על המוצר?"
            rows={4}
            className="w-full border border-[#ddd] rounded-lg bg-transparent p-3 text-sm text-right outline-none focus:border-[#1a1a1a] transition-colors resize-none"
          />

          {submitState === "ok" && (
            <p className="text-sm text-[#2d7a3a]">תודה! הביקורת נשלחה ותוצג לאחר אישור.</p>
          )}
          {submitState === "error" && <p className="text-sm text-[#b3261e]">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#1a1410] text-white text-xs font-semibold tracking-widest px-8 py-3.5 rounded-xl whitespace-nowrap cursor-pointer hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
          >
            {submitting ? "שולח..." : "שליחת ביקורת"}
          </button>
        </form>
      )}
    </div>
  );
}
