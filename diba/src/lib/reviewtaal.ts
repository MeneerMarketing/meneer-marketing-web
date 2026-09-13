import type { Taal } from "@/lib/taal";

/**
 * De tekst van een review, in de taal van de pagina.
 *
 * WAAROM DIT NIET DOOR HET WOORDENBOEK GAAT.
 *
 * Alle andere tekst op de site loopt langs `t()` en `tc()`, met de Nederlandse zin als
 * sleutel. Voor reviews kan dat niet: het zijn er 2.501 en samen zijn ze 351.000 tekens.
 * Het woordenboek staat in de browserbundel — het is nu al 399 kB van de 717 kB aan
 * JavaScript op een pagina — en daar de reviews bij optellen zou die bundel verdubbelen,
 * voor tekst die op de meeste pagina's niet eens getoond wordt.
 *
 * De vertaling staat daarom naast de Nederlandse tekst in de gegevens zelf: `quoteEn` bij
 * de uitgelichte set, `te` in het archiefbestand. Het archief wordt alleen op de server
 * gelezen, dus die 2.464 vertalingen kosten de bezoeker niets.
 *
 * Ontbreekt de vertaling, dan staat er Nederlands. Dat is dezelfde regel als bij het
 * woordenboek: een ontbrekende vertaling levert de brontekst op, geen lege plek.
 */
export function reviewtekst(
  nl: string,
  en: string | undefined,
  taal: Taal,
): string {
  return taal === "en" && en ? en : nl;
}
