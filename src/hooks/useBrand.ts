import { useLocation } from "react-router-dom";
import { useBrandContext, type BrandKey } from "@/context/BrandContext";

export interface Brand {
  key: BrandKey;
  name: string;
  /** Primary CTA / accent color */
  color: string;
  /** Darker hover shade */
  colorHover: string;
  /** Very light tint for backgrounds */
  tint: string;
  /** Header chrome (July 2026): Waterfall = black header / white ink;
   *  UMBRCOM = white header / black ink. */
  headerBg: string;
  headerInk: string;
}

export const WATERFALL: Brand = {
  key: "waterfall",
  name: "Waterfall",
  color: "#3ab4f2",
  colorHover: "#2da0d8",
  tint: "rgba(58,180,242,0.08)",
  headerBg: "#111111",
  headerInk: "#ffffff",
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
  headerBg: "#ffffff",
  headerInk: "#111111",
};

/** @deprecated alias — use UMBRCOM. */
export const AMBERCOM = UMBRCOM;

/**
 * Active brand = the user's switcher selection (default UMBRCOM — the
 * black-and-white scheme). The /umbrcom (+ legacy /ambercom) landing
 * pages still force UMBRCOM regardless of the stored selection.
 */
export function useBrand(): Brand {
  const { pathname } = useLocation();
  const { brandKey } = useBrandContext();
  if (pathname.startsWith("/umbrcom") || pathname.startsWith("/ambercom")) return UMBRCOM;
  return brandKey === "waterfall" ? WATERFALL : UMBRCOM;
}
