import CmsPage from "../../components/feature/CmsPage";
import LegalContent from "./components/LegalContent";
// Real privacy policy copied from the old website (item 11).
import privacyHtml from "./content/privacy.html?raw";

function StaticPrivacy() {
  return (
    <>
      <div className="w-full bg-[#0f0f0f] py-10" dir="rtl">
        <h1 className="text-3xl font-light text-white text-right px-6 max-w-3xl mx-auto">מדיניות פרטיות</h1>
      </div>
      <LegalContent html={privacyHtml} />
    </>
  );
}

export default function PrivacyPage() {
  return <CmsPage slug="privacy" fallback={<StaticPrivacy />} />;
}
