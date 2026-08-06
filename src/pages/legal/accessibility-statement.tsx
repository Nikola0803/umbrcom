import PageLayout from "../../components/feature/PageLayout";
import LegalContent from "./components/LegalContent";
// Real accessibility statement, provided directly by Nik. Bypasses
// CmsPage — WordPress already had its own short auto-created page at the
// "accessibility-statement" slug (with a different, outdated contact
// email), which always took priority over this content. This is now the
// only source for this page. Wrapped directly in PageLayout since that
// (header + footer chrome) used to come from CmsPage — removing CmsPage
// also silently removed the header/footer.
import accessibilityHtml from "./content/accessibility.html?raw";

export default function AccessibilityStatementPage() {
  return (
    <PageLayout>
      <section className="w-full bg-white min-h-[70vh]" dir="rtl">
        <div className="max-w-3xl mx-auto text-right px-6 pt-16">
          <p className="text-[10px] font-medium tracking-[0.4em] text-[#3ab4f2] uppercase mb-3">נגישות</p>
          <h1 className="text-3xl font-light text-[#1a1410] mb-2">הצהרת נגישות</h1>
          <div className="w-10 h-px bg-[#1a1a1a]/20 mr-0" />
        </div>
        <LegalContent html={accessibilityHtml} />
      </section>
    </PageLayout>
  );
}
