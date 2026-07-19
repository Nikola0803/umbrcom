import { useLocation } from "react-router-dom";

export interface Brand {
  key: "waterfall" | "umbrcom";
  name: string;
  /** Primary CTA / accent color */
  color: string;
  /** Darker hover shade */
  colorHover: string;
  /** Very light tint for backgrounds */
  tint: string;
}

export const WATERFALL: Brand = {
  key: "waterfall",
  name: "Waterfall",
  color: "#3ab4f2",
  colorHover: "#2da0d8",
  tint: "rgba(58,180,242,0.08)",
};

/** The parent brand. NOTE: "Ambercom" was a naming mistake — אמברקום IS
 *  UMBRCOM (same company, same brand). Renamed July 2026; accent is black,
 *  never amber/yellow. WP plugin field keys (ambercom_*) are kept for
 *  backend compatibility only. */
export const UMBRCOM: Brand = {
  key: "umbrcom",
  name: "UMBRCOM",
  color: "#111111",
  colorHover: "#333333",
  tint: "rgba(0,0,0,0.05)",
};

/** @deprecated alias — use UMBRCOM. */
export const AMBERCOM = UMBRCOM;

/**
 * Returns the active brand based on the current route.
 * /umbrcom* (and the legacy /ambercom*) → UMBRCOM · everything else → Waterfall.
 */
export function useBrand(): Brand {
  const { pathname } = useLocation();
  return pathname.startsWith("/umbrcom") || pathname.startsWith("/ambercom") ? UMBRCOM : WATERFALL;
}
