import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackMetaPageView } from "@/lib/metaPixel";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const firstRun = useRef(true);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // Meta Pixel has no automatic SPA page-view tracking (unlike GA4's
    // Enhanced Measurement) — fire it manually on every route change.
    // Skip the very first run: index.html's inline snippet already fires
    // the initial PageView before React even mounts.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    trackMetaPageView();
  }, [pathname]);
  return null;
}
