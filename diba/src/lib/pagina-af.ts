/**
 * Het poortje: een pagina komt pas in Google zodra hij echt af is.
 *
 * DIBA-RULES §2 verbiedt dunne doorslagpagina's en §15 laat programmatic pagina's
 * alleen live met unieke, echte content. Dat stond er wel, maar niets dwong het af:
 * de sitemap meldde alle ~66 routes aan, waarvan het overgrote deel nog uit
 * placeholders bestond. Voor een nieuw domein is dat de slechtst mogelijke start —
 * Google beoordeelt dunne content op schaal en dat drukt ook de goede pagina's omlaag.
 *
 * Deze module is de enige bron van waarheid voor die vraag. Gebruik hem op twee
 * plekken tegelijk, want los van elkaar zijn ze geen van beide genoeg:
 *   1. `sitemap.ts` — niet-afgeronde routes worden niet aangemeld.
 *   2. De metadata van de pagina zelf — `robots: noindex` zolang hij niet af is,
 *      want Google vindt pagina's ook zonder sitemap, via interne links.
 */

/** De redactievlaggen die betekenen: hier ontbreekt nog echte inhoud. */
const VLAGGEN =
  /\[(COPY-NODIG|PRIJS-NODIG|BEELD-NODIG|GEGEVEN-NODIG|MENSELIJKE-ZIN|MEDISCHE-CHECK-ROJDA|BESLUIT-OKAN)[^\]]*\]/;

/** Loopt een willekeurige datastructuur door en zoekt naar redactievlaggen. */
export function bevatPlaceholders(waarde: unknown, diepte = 0): boolean {
  if (diepte > 12) return false;
  if (typeof waarde === "string") return VLAGGEN.test(waarde);
  if (Array.isArray(waarde)) return waarde.some((v) => bevatPlaceholders(v, diepte + 1));
  if (waarde && typeof waarde === "object") {
    return Object.values(waarde).some((v) => bevatPlaceholders(v, diepte + 1));
  }
  return false;
}

/**
 * Is deze pagina klaar om geïndexeerd te worden?
 *
 * Bewust streng: één placeholder is genoeg om te wachten. Liever een pagina te laat
 * in Google dan een halve pagina die het hele domein meetrekt.
 *
 * **Let op de grens hiervan.** Dit controleert alleen het meegegeven object. Een
 * datastructuur die helemaal geen paginatekst bevat, komt er dus schoon doorheen —
 * `INSURERS` is daar het voorbeeld van: die records zijn `{slug, name}` en leverden
 * pagina's van 37 woorden op met lege secties. Voor zulke collecties is een expliciete
 * "nog niet gereed" nodig; zie `sitemap.ts`. Placeholder-vrij is niet hetzelfde als af.
 */
export function isPaginaAf(content: unknown): boolean {
  return !bevatPlaceholders(content);
}

/**
 * Metadata-fragment voor een pagina die nog niet af is.
 *
 * Spreid over `robots` zodat het samen met de rest van de metadata werkt:
 *   export const metadata = { title: "...", ...robotsVoor(isPaginaAf(content)) };
 */
export function robotsVoor(af: boolean) {
  return af ? {} : NOG_IN_AANBOUW;
}

/**
 * Metadata voor een pagina die nog niet af is. Spreid hem in het metadata-object:
 *
 *   export const metadata = { title: "Prijzen", ...NOG_IN_AANBOUW };
 *
 * `follow: true` is bewust: de pagina mag niet in de index, maar de links erop
 * mogen wel gevolgd worden zodat de rest van de site vindbaar blijft.
 *
 * Let op wat hier NIET staat: een `description`. Vijftien pagina's hadden
 * `description: "[COPY-NODIG]"` staan, en die tekst gaat zo de zoekresultaten in.
 * Zonder description stelt Google er zelf een samen uit de pagina — altijd beter
 * dan een redactievlag.
 */
export const NOG_IN_AANBOUW = {
  robots: { index: false, follow: true },
} as const;
