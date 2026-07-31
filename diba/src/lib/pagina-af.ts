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
 * ── DE SCHAKELAAR ──
 *
 * Zolang de site niet live staat is `noindex` zinloos: er is geen domein waar Google
 * langskomt, dus er valt niets te beschermen. Besluit Yasin, 31-07-2026: eruit.
 *
 * Hij staat hier als één constante en niet verspreid over vijfendertig bestanden, want
 * op de dag dat het domein live gaat is dit wél weer nodig. Dan bestaan er pagina's met
 * `[MEDISCHE-CHECK-ROJDA]` erin en prijzen van nul euro, en die horen niet in de index.
 *
 * **Vóór livegang: zet dit op `true`.** Dan dragen alle onafgeronde pagina's weer
 * `noindex, follow` en meldt de sitemap ze niet aan. Verder hoeft er niets te wijzigen.
 */
const POORTJE_ACTIEF = false;

/** Voor de sitemap, zodat die dezelfde schakelaar volgt als de metadata. */
export function poortjeActief() {
  return POORTJE_ACTIEF;
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
 * Met het poortje uit is dit een leeg object en zetten de pagina's dus niets. Staat het
 * aan, dan is `follow: true` bewust: de pagina mag niet in de index, maar de links erop
 * mogen wel gevolgd worden zodat de rest van de site vindbaar blijft.
 *
 * Let op wat hier NIET staat: een `description`. Vijftien pagina's hadden
 * `description: "[COPY-NODIG]"` staan, en die tekst gaat zo de zoekresultaten in.
 * Zonder description stelt Google er zelf een samen uit de pagina — altijd beter
 * dan een redactievlag.
 */
export const NOG_IN_AANBOUW = POORTJE_ACTIEF
  ? ({ robots: { index: false, follow: true } } as const)
  : ({} as const);
