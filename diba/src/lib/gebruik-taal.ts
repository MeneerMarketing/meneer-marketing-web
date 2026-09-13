"use client";

import { usePathname } from "next/navigation";
import { taalVanPad, type Taal } from "@/lib/taal";
import { publicCopy } from "@/lib/copy-flags";
import { vertaal } from "@/lib/vertaal";

/**
 * De taal en de vertaalfunctie, voor componenten die in de browser draaien.
 *
 * Een client component kan niet bij `taalcontext` (dat is server-geheugen), maar wel bij
 * het adres, en het adres bepaalt de taal. Zo komen beide kanten op dezelfde uitkomst uit.
 */
export function useTaal(): Taal {
  return taalVanPad(usePathname() ?? "/");
}

/** `const t = useT();` en daarna `t("Alle tarieven op één plek")`. */
export function useT(): (nl: string) => string {
  const taal = useTaal();
  return (nl: string) => vertaal(nl, taal);
}

/** Dezelfde combinatie als `tc` op de server: vlaggen eraf, daarna vertalen. */
export function useTc(): (ruw: string, terugval?: string) => string {
  const taal = useTaal();
  return (ruw: string, terugval = "") =>
    vertaal(publicCopy(ruw, terugval), taal);
}
