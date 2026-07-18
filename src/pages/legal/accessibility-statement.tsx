import CmsPage from "../../components/feature/CmsPage";
import LegalContent from "./components/LegalContent";
// Real accessibility statement copied from the old website (item 12).
import accessibilityHtml from "./content/accessibility.html?raw";

function StaticAccessibilityStatement() {
  return (
    <section className="w-full bg-white min-h-[70vh]" dir="rtl">
      <div className="max-w-3xl mx-auto text-right px-6 pt-16">
        <p className="text-[10px] font-medium tracking-[0.4em] text-[#3ab4f2] uppercase mb-3">נגישות</p>
        <h1 className="text-3xl font-light text-[#1a1410] mb-2">הצהרת נגישות</h1>
        <div className="w-10 h-px bg-[#1a1a1a]/20 mr-0" />
      </div>
      <LegalContent html={accessibilityHtml} />
    </section>
  );
}

export default function AccessibilityStatementPage() {
  return <CmsPage slug="accessibility-statement" fallback={<StaticAccessibilityStatement />} />;
}
