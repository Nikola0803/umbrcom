import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

/**
 * Brand SELECTION context (July 2026, per Nik):
 * the brand is no longer derived from the route — it's a user choice made
 * in the header switcher, persisted across visits.
 *
 *   - Default: UMBRCOM/Ambercom → the standard black-and-white scheme
 *     (white header, black CTAs incl. Add to Cart).
 *   - Switched to Waterfall → the header turns BLACK and every brand-
 *     colored button goes Waterfall blue (#3ab4f2).
 *
 * The /umbrcom route still hard-forces the UMBRCOM brand (legacy landing).
 */

export type BrandKey = "waterfall" | "umbrcom";

const STORAGE_KEY = "umbrc-brand";

function readStored(): BrandKey {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "waterfall" ? "waterfall" : "umbrcom";
  } catch {
    return "umbrcom";
  }
}

interface BrandCtx {
  brandKey: BrandKey;
  setBrandKey: (k: BrandKey) => void;
}

const Ctx = createContext<BrandCtx>({ brandKey: "umbrcom", setBrandKey: () => {} });

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brandKey, setKey] = useState<BrandKey>(readStored);
  const setBrandKey = useCallback((k: BrandKey) => {
    setKey(k);
    try {
      window.localStorage.setItem(STORAGE_KEY, k);
    } catch {
      /* private mode etc. — selection still works for the session */
    }
  }, []);
  return <Ctx.Provider value={{ brandKey, setBrandKey }}>{children}</Ctx.Provider>;
}

export function useBrandContext() {
  return useContext(Ctx);
}
