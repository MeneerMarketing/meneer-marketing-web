import type { Taal } from "@/lib/taal";

/**
 * De twee woorden die een prijs kan zijn als hij geen getal is.
 *
 * WAAROM DIT NIET UIT HET WOORDENBOEK KOMT. `prijsTekst` in `data/behandelingen.ts` en
 * `formatLaserPrice` in `lib/laser-pricing.ts` vertaalden "Op aanvraag" met `vertaal()`
 * uit `lib/vertaal`, en die module importeert beide woordenboeken. Beide bestanden worden
 * door client components geïmporteerd — de prijslijst, de variantkiezer, de
 * laserconfigurator — dus die 1996 kB Engels en Spaans reisde mee naar de browser voor
 * twee woorden. Dit was het tweede van de twee lekken; het eerste zat in `lib/citaat.ts`.
 *
 * Dit bestand heeft geen imports behalve een type. Het is een blad: wie het importeert
 * krijgt precies deze zes strings en niets erachter.
 *
 * De waarden zijn dezelfde als in `i18n/en.ts` en `i18n/es.ts`. Wijzig je er hier een, dan
 * daar ook; `npm run vreemdetaal` meldt het als een Nederlands woord op een vertaalde
 * pagina verschijnt, dus uit elkaar lopen valt op.
 */
const PRIJSWOORDEN = {
  "Op aanvraag": { nl: "Op aanvraag", en: "On request", es: "A consultar" },
  "Nog niet bekend": {
    nl: "Nog niet bekend",
    en: "Not known yet",
    es: "Aún no se sabe",
  },
} as const;

export type Prijswoord = keyof typeof PRIJSWOORDEN;

export function prijswoord(woord: Prijswoord, taal: Taal): string {
  return PRIJSWOORDEN[woord][taal];
}
