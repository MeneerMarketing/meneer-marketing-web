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
  if (Array.isArray(waarde))
    return waarde.some((v) => bevatPlaceholders(v, diepte + 1));
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
 * Zolang de site niet live staat is `noindex` zinloos: er is geen bereikbaar domein, dus
 * er valt niets af te schermen.
 *
 * Besluit Yasin, 21-08-2026: de pagina's dragen hem niet meer. Tot die dag stond op
 * tweeëntwintig pagina's `...NOG_IN_AANBOUW` in de metadata, en dat was een botte
 * schakelaar: hij keek niet of een pagina af was, alleen of de site af was. Aanzetten
 * betekende dus dat ook een volledig nagekeken pagina uit de index verdween.
 *
 * WAT ER VOOR TERUGKOMT, EN WANNEER.
 *
 * De sitemap gebruikt `poortjeActief()` nog wel, samen met `isPaginaAf()`. Dat is de
 * betere vorm: die kijkt naar de inhoud van een pagina en niet naar de stand van het
 * project, waardoor een pagina vanzelf meedoet zodra zijn laatste vlag weg is.
 *
 * Gaat het domein live terwijl er nog vlaggen open staan, dan is dat de weg: zet
 * `POORTJE_ACTIEF` op `true` en geef de pagina's
 * `...robotsVoor(isPaginaAf(<de data van die pagina>))` mee. Per pagina, met zijn eigen
 * inhoud als maatstaf. Dat is een half uur werk en het voorkomt dat afgeronde pagina's
 * meegesleept worden.
 */
const POORTJE_ACTIEF = false;

/** Voor de sitemap, zodat die dezelfde schakelaar volgt als de metadata. */
export function poortjeActief() {
  return POORTJE_ACTIEF;
}
