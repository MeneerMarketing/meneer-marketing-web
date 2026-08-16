/**
 * De huidproblemen als lijst, en verder niets.
 *
 * WAT HIER STOND EN WAAROM DAT EEN FOUT WAS DIE NIEMAND KON ZIEN.
 *
 * Dit bestand bouwde negentien volledige `PillarContent`-objecten via een fabriek, elk
 * gevuld met "[COPY-NODIG]" op elk tekstveld. Bedoeld als skelet voor een generieke
 * huidprobleempagina.
 *
 * Die generieke pagina rendert voor niemand. Alle twintig huidproblemen hebben inmiddels
 * een eigen, met de hand gebouwde pagina, en `generateStaticParams` van de [slug]-route
 * leverde daardoor nul routes op. Het skelet was dus dode inhoud.
 *
 * Alleen niet helemaal dood, en daar zat het probleem: `sitemap.ts` filterde deze
 * negentien objecten op redactievlaggen om te bepalen of een pagina af is. Elk skelet
 * bevat "[COPY-NODIG]", dus geen enkele huidprobleempagina kwam ooit in de sitemap.
 * Terwijl dat juist de rijkste pagina's van de site zijn, met duizend woorden eigen
 * inhoud per stuk.
 *
 * De sitemap beoordeelde met andere woorden een object dat niets te maken had met wat er
 * op het scherm stond. Dat is precies het soort fout dat blijft zitten, want er is niets
 * aan te zien: geen kapotte pagina, geen foutmelding, alleen een sitemap die zwijgt over
 * je beste werk.
 *
 * Wat er nu staat is wat er nodig is: de routes met hun titel. Of ze af zijn hangt af van
 * de pagina zelf en staat als bewuste handeling in `sitemap.ts`, net als bij elke andere
 * statische route.
 */

export type Huidprobleem = {
  readonly slug: string;
  readonly titel: string;
};

export const PILLARS: readonly Huidprobleem[] = [
  { slug: "acne", titel: "Acne: eerst begrijpen, dan *behandelen*" },
  { slug: "pigmentvlekken", titel: "Pigmentvlekken: eerst begrijpen, dan *behandelen*" },
  { slug: "rosacea", titel: "Rosacea en couperose: eerst begrijpen, dan *behandelen*" },
  { slug: "huidveroudering", titel: "Huidveroudering: eerst begrijpen, dan *behandelen*" },
  { slug: "littekens", titel: "Littekens en striae: eerst begrijpen, dan *behandelen*" },
  { slug: "striae", titel: "Striae: eerst begrijpen, dan *behandelen*" },
  { slug: "porien", titel: "Grove poriën: eerst begrijpen, dan *behandelen*" },
  { slug: "droge-huid", titel: "Droge huid: eerst begrijpen, dan *behandelen*" },
  { slug: "gevoelige-huid", titel: "Gevoelige huid: eerst begrijpen, dan *behandelen*" },
  { slug: "melasma", titel: "Melasma: eerst begrijpen, dan *behandelen*" },
  { slug: "donkere-kringen", titel: "Donkere kringen: eerst begrijpen, dan *behandelen*" },
  { slug: "huiduitslag", titel: "Huiduitslag: eerst begrijpen, dan *behandelen*" },
  { slug: "eczeem", titel: "Eczeem: eerst begrijpen, dan *behandelen*" },
  { slug: "psoriasis", titel: "Psoriasis: eerst begrijpen, dan *behandelen*" },
  { slug: "keloiden", titel: "Keloiden: eerst begrijpen, dan *behandelen*" },
  { slug: "huidkanker-naevi", titel: "Moedervlekken controleren: eerst begrijpen, dan *behandelen*" },
  { slug: "cellulitis", titel: "Cellulitis: eerst begrijpen, dan *behandelen*" },
  { slug: "huidverkleuring", titel: "Huidverkleuring: eerst begrijpen, dan *behandelen*" },
  { slug: "symptoomzoeker", titel: "Iets anders aan je huid: eerst begrijpen, dan *behandelen*" },
];
