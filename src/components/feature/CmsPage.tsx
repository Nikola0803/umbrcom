import { ReactNode, useEffect, useState } from "react";
import PageLayout from "./PageLayout";
import PageBuilder from "./PageBuilder";
import { fetchPageSections, isWpConfigured, PageSection } from "@/lib/wp-api";

interface CmsPageProps {
  /** The WordPress Page slug this route maps to (e.g. "about", "contact"). */
  slug: string;
  /** The current hand-built page content — rendered whenever WordPress
   *  isn't configured, or that page hasn't been built with Page Builder yet. */
  fallback: ReactNode;
  /** Rendered unconditionally after the CMS/fallback content — for pages
   *  that pair editable copy with a fixed functional form (Contact,
   *  Business, Customer Service, Warranty, Invoice Recovery). Forms stay
   *  real React components; only the surrounding copy is CMS-editable. */
  after?: ReactNode;
}

/**
 * Wraps any content page (About, Contact, Terms, …) so it's editable from
 * wp-admin's Page Builder the same way Home and Ambercom already are —
 * without repeating the fetch/loading boilerplate in every page file.
 *
 * To make a new page CMS-editable: create a WordPress Page with a matching
 * slug (the plugin auto-creates one for every known route on activation),
 * build it with Page Builder sections, done — this component picks it up
 * automatically. Nothing on the frontend needs to change.
 */
export default function CmsPage({ slug, fallback, after }: CmsPageProps) {
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
      {after}
    </PageLayout>
  );
}
