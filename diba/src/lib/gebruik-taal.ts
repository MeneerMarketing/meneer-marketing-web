"use client";

import { usePathname } from "next/navigation";
import { useWoordenboek } from "@/components/i18n/Woordenboek";
import { taalVanPad, type Taal } from "@/lib/taal";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De taal en de vertaalfunctie, voor componenten die in de browser draaien.
 *
 * Een client component kan niet bij `taalcontext` (dat is server-geheugen), maar wel bij
 * het adres, en het adres bepaalt de taal. Zo komen beide kanten op dezelfde uitkomst uit.
 *
 * WAAROM DIT NIET MEER `lib/vertaal` IMPORTEERT. Die module importeert beide woordenboeken
 * statisch, en alles wat een client component importeert gaat mee naar de browser. Dat
 * was 1996 kB JavaScript op elke pagina, in elke taal — ook op de Nederlandse, die er geen
 * woord van gebruikt. Het woordenboek komt nu uit een React-context die per taalindeling
 * gevuld wordt; zie `components/i18n/Woordenboek.tsx`. De server houdt gewoon `t()` en
 * `tc()` uit `lib/vertaal`, want een serverbundel gaat nergens heen.
 */
export function useTaal(): Taal {
  return taalVanPad(usePathname() ?? "/");
}

/** `const t = useT();` en daarna `t("Alle tarieven op één plek")`. */
export function useT(): (nl: string) => string {
  const boek = useWoordenboek();
  return (nl: string) => boek[nl] ?? nl;
}

/** Dezelfde combinatie als `tc` op de server: vlaggen eraf, daarna vertalen. */
export function useTc(): (ruw: string, terugval?: string) => string {
  const boek = useWoordenboek();
  return (ruw: string, terugval = "") => {
    const schoon = publicCopy(ruw, terugval);
    return boek[schoon] ?? schoon;
  };
}
