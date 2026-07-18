/** Renders the legal-page HTML copied from the old website (wfl.co.il).
 *  Content lives in ../content/*.html (imported with Vite's `?raw`), was
 *  cleaned of Word/Elementor markup, and renders fully RTL. */
export default function LegalContent({ html }: { html: string }) {
  return (
    <div
      dir="rtl"
      className="legal-content max-w-3xl mx-auto px-4 sm:px-8 py-14 text-right text-sm leading-relaxed text-[#4a4038]
        [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#1a1410] [&_h2]:mt-8 [&_h2]:mb-3
        [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[#1a1410] [&_h3]:mt-5 [&_h3]:mb-2
        [&_p]:mb-3 [&_strong]:text-[#1a1410]
        [&_ul]:list-disc [&_ul]:pr-5 [&_ul]:mb-4 [&_ul]:space-y-1
        [&_ol]:list-decimal [&_ol]:pr-5 [&_ol]:mb-4 [&_ol]:space-y-1
        [&_a]:underline [&_a]:text-[#1a1a1a]
        [&_table]:w-full [&_table]:border-collapse [&_table]:text-right [&_table]:my-4
        [&_td]:border [&_td]:border-[#ede9e1] [&_td]:px-3 [&_td]:py-2
        [&_th]:border [&_th]:border-[#ede9e1] [&_th]:px-3 [&_th]:py-2 [&_th]:bg-[#faf8f4]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
