export interface RichTextBlockProps {
  content: string;
}

/**
 * Freeform WYSIWYG content block — the escape hatch in the Page Builder for
 * anything that doesn't fit the other pre-built layouts (About-style copy,
 * legal notes inline on a landing page, etc). Content comes from ACF's
 * WYSIWYG field, written by a trusted wp-admin editor, so rendering the
 * HTML directly (as any headless-WordPress site does) is expected here.
 */
export default function RichTextBlock({ content }: RichTextBlockProps) {
  return (
    <section className="w-full bg-white py-14" dir="rtl">
      <div
        className="max-w-3xl mx-auto px-8 text-right prose-umbrcom"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}
