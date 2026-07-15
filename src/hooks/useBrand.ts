import { useLocation } from "react-router-dom";

export interface Brand {
  key: "waterfall" | "ambercom";
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

export const AMBERCOM: Brand = {
  key: "ambercom",
  name: "Ambercom",
  color: "#e8a030",
  colorHover: "#d18f24",
  tint: "rgba(232,160,48,0.08)",
};

/**
 * Returns the active brand based on the current route.
 * /ambercom* → Ambercom (amber) · everything else → Waterfall (light blue).
 * Item 12: buttons must follow the brand color of the page you're on.
 */
export function useBrand(): Brand {
  const { pathname } = useLocation();
  return pathname.startsWith("/ambercom") ? AMBERCOM : WATERFALL;
}
