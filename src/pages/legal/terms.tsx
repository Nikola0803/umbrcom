import CmsPage from "../../components/feature/CmsPage";
import LegalContent from "./components/LegalContent";
// Real terms & conditions copied from the old website (item 10).
import termsHtml from "./content/terms.html?raw";

function StaticTerms() {
  return (
    <>
      <div className="w-full bg-[#0f0f0f] py-10" dir="rtl">
        <h1 className="text-3xl font-light text-white text-right px-6 max-w-3xl mx-auto">תקנון האתר</h1>
      </div>
      <LegalContent html={termsHtml} />
    </>
  );
}

export default function TermsPage() {
  return <CmsPage slug="terms" fallback={<StaticTerms />} />;
}
