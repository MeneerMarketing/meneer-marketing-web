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
 * De vertaling staat daarom naast de Nederlandse tekst in de gegevens zelf: `quoteEn` en
 * `quoteEs` bij de uitgelichte set, `te` en `ts` in het archiefbestand. Het archief wordt
 * alleen op de server gelezen, dus die twee keer 2.472 vertalingen kosten de bezoeker
 * niets. Het Spaans van het archief is op 16 september 2026 in dertien rondes gemaakt met
 * `scratch/reviewbatch-es.py`; de bron ervan is `scratch/review-vertalingen-es.json`.
 *
 * Ontbreekt de vertaling, dan staat er Nederlands. Dat is dezelfde regel als bij het
 * woordenboek: een ontbrekende vertaling levert de brontekst op, geen lege plek.
 */
export type Reviewvertalingen = {
  readonly en?: string;
  readonly es?: string;
};

export function reviewtekst(
  nl: string,
  vertaald: Reviewvertalingen,
  taal: Taal,
): string {
  if (taal === "nl") return nl;
  return vertaald[taal] ?? nl;
}

/**
 * Het `lang`-attribuut voor een reviewtekst: "nl" zodra er op een anderstalige pagina
 * Nederlands staat omdat de vertaling ontbreekt, anders niets. Zo klopt de HTML voor een
 * schermlezer, en de controle op vreemde taal (`npm run vreemdetaal`) weet dat dit stuk
 * Nederlands hoort te zijn.
 */
export function reviewtaalcode(
  vertaald: Reviewvertalingen,
  taal: Taal,
): "nl" | undefined {
  return taal !== "nl" && !vertaald[taal] ? "nl" : undefined;
}
