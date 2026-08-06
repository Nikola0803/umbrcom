import PageLayout from "../../components/feature/PageLayout";
import LegalContent from "./components/LegalContent";
// Real privacy policy, provided directly by Nik. Always rendered as-is —
// this page used to go through CmsPage, which checks WordPress for a
// "privacy" page FIRST and only falls back to this content if WP has
// nothing. WordPress already had a short, generic auto-created page at
// that slug, so this real content never actually showed no matter how
// many times the frontend was rebuilt. Bypassing CmsPage entirely here
// so this is the only thing that ever renders — no dependency on
// wp-admin content for this page anymore.
import privacyHtml from "./content/privacy.html?raw";

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div className="w-full bg-[#0f0f0f] py-10" dir="rtl">
        <h1 className="text-3xl font-light text-white text-right px-6 max-w-3xl mx-auto">מדיניות פרטיות</h1>
      </div>
      <LegalContent html={privacyHtml} />
    </PageLayout>
  );
}
