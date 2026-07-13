import { Link } from "react-router-dom";
import PageLayout from "../../components/feature/PageLayout";

export default function WishlistPage() {
  // In production: connect to a wishlist context/store
  return (
    <PageLayout>
      <section className="w-full bg-white min-h-[70vh] py-16 px-6" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-right">
            <p className="text-[10px] font-medium tracking-[0.4em] text-[#aaa] uppercase mb-2">שמורים</p>
            <h1 className="font-serif text-3xl font-light text-[#1a1410]">המועדפים שלי</h1>
          </div>

          {/* Empty state */}
          <div className="text-center py-24 border border-dashed border-[#ede9e1] rounded-2xl">
            <i className="ri-heart-line text-5xl text-[#ddd] mb-4 block"></i>
            <h2 className="font-serif text-xl font-light text-[#1a1410] mb-2">
              הרשימה שלכם ריקה
            </h2>
            <p className="text-sm text-[#9a8a7a] mb-8 max-w-xs mx-auto">
              לחצו על לב ❤️ על כל מוצר שתרצו לשמור לאחר כך
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#333] text-white text-xs font-semibold tracking-widest px-8 py-3.5 rounded-full transition-colors cursor-pointer"
            >
              <i className="ri-store-2-line text-sm"></i>
              גלו מוצרים
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
