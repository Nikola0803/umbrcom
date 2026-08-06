import LegalContent from "./components/LegalContent";
// Real terms & conditions, provided directly by Nik. Bypasses CmsPage —
// WordPress already had its own short auto-created page at the "terms"
// slug, which always took priority over this content, so it never
// actually appeared on the live site regardless of frontend rebuilds.
// This is now the only source for this page.
import termsHtml from "./content/terms.html?raw";

export default function TermsPage() {
  return (
    <>
      <div className="w-full bg-[#0f0f0f] py-10" dir="rtl">
        <h1 className="text-3xl font-light text-white text-right px-6 max-w-3xl mx-auto">תקנון האתר</h1>
      </div>
      <LegalContent html={termsHtml} />
    </>
  );
}
