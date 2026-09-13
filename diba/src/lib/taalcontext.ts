import { cache } from "react";
import type { Taal } from "@/lib/taal";

/**
 * In welke taal wordt deze pagina opgebouwd?
 *
 * HET PROBLEEM DAT DIT OPLOST.
 *
 * De site moet dezelfde pagina's in twee talen kunnen tonen. Die pagina's zijn server
 * components, en een server component kan het adres van het verzoek niet opvragen: hij weet
 * alleen wat er via `params` binnenkomt. De taal als extra prop door honderdzeventig
 * pagina's en al hun onderdelen doorgeven is geen optie; dan raak je hem ergens kwijt en
 * staat er één blok in de verkeerde taal.
 *
 * HOE HET WERKT.
 *
 * `cache()` van React geeft per verzoek één exemplaar terug van wat de functie maakt. Dat
 * doosje is dus privé voor deze ene paginaopbouw: twee bezoekers tegelijk kunnen elkaars
 * taal niet zien. De Engelse route zet de taal voordat hij de gedeelde pagina rendert, en
 * alles wat daaronder hangt leest hem met `taalNu()`.
 *
 * VOOR CLIENT COMPONENTS.
 *
 * Die draaien in de browser en kunnen hier niet bij. Die lezen de taal uit het adres met
 * `useTaal()` (zie `lib/gebruik-taal.ts`), en dat komt op hetzelfde neer: het adres bepaalt
 * de taal, aan beide kanten.
 */
const doos = cache((): { taal: Taal } => ({ taal: "nl" }));

/** Zetten aan het begin van een route, vóór het renderen van de pagina zelf. */
export function zetTaal(taal: Taal): void {
  doos().taal = taal;
}

/** De taal van deze paginaopbouw. Zonder iets te zetten is dat Nederlands. */
export function taalNu(): Taal {
  return doos().taal;
}
