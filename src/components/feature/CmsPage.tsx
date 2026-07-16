import { ReactNode, useEffect, useState } from "react";
import PageLayout from "./PageLayout";
import PageBuilder from "./PageBuilder";
import { fetchPageSections, isWpConfigured, PageSection } from "@/lib/wp-api";

interface CmsPageProps {
  /** The WordPress Page slug this route maps to (e.g. "about", "terms"). */
  slug: string;
  /** The current hand-built page content — rendered whenever WordPress
   *  isn't configured, or that page hasn't been built with Page Builder yet. */
  fallback: ReactNode;
}

/**
 * Wraps any content page (About, Terms, Privacy, Returns, Accessibility
 * Statement, …) so it's editable from wp-admin's Page Builder the same way
 * Home and Ambercom already are — without repeating the fetch/loading
 * boilerplate in every single page file.
 *
 * To make a new page CMS-editable: create a WordPress Page with a matching
 * slug, build it with Page Builder sections, done — this component picks
 * it up automatically. Nothing on the frontend needs to change.
 */
export default function CmsPage({ slug, fallback }: CmsPageProps) {
  const [sections, setSections] = useState<PageSection[] | null>(null);
  const [loaded, setLoaded] = useState(!isWpConfigured());

  useEffect(() => {
    if (!isWpConfigured()) return;
    setLoaded(false);
    fetchPageSections(slug).then((page) => {
      setSections(page?.sections?.length ? page.sections : null);
      setLoaded(true);
    });
  }, [slug]);

  return (
    <PageLayout>
      {!loaded ? null : sections ? <PageBuilder sections={sections} /> : fallback}
    </PageLayout>
  );
}
