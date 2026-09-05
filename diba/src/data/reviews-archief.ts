import archief from "@/data/salonized-archief.json";
import type { SalonizedReviewTopic } from "@/data/salonized-reviews";

/**
 * Het volledige Salonized-archief.
 *
 * OKAN, 5 SEPTEMBER 2026: alle reviews moeten erin, die zonder tekst onder een eigen kopje,
 * en de rest netjes gecategoriseerd.
 *
 * Er stonden er 122 op de pagina van de 3.893 die Salonized meldt. Dat is een selectie, en
 * een selectie op een reviewpagina is precies wat die pagina zelf afkeurt: dan kiezen wij
 * wat je ziet.
 *
 * WAT HIER STAAT. Alle 390 pagina's van dibaclinics.salonized.com/reviews zijn opgehaald.
 * 3.889 beoordelingen, waarvan er 2.472 tekst hebben. De overige 1.417 zijn alleen sterren:
 * die tellen mee voor het gemiddelde en horen dus op de pagina, maar niet als lege kaart.
 *
 * WAAROM DIT SERVERWERK IS. Zeshonderd kilobyte reviews naar de browser sturen om er dertig
 * te tonen is onzin. Dit bestand wordt alleen op de server gelezen; de filter en de
 * paginering lopen via de URL. Dat scheelt niet alleen laadtijd: elk onderwerp heeft
 * daardoor een eigen adres dat Google kan indexeren.
 *
 * De tags hangen aan een woord in de review zelf, net als bij de uitgelichte set in
 * `salonized-reviews.ts`. Zie de toelichting daar voor wat dat wel en niet oplevert.
 */

type RuweReview = {
  /** Naam zoals hij op Salonized staat: alleen een voornaam. */
  n: string;
  /** Relatieve datum, zoals de bron hem geeft. */
  d: string;
  /** Sterren. */
  s: number;
  /** Tekst. Ontbreekt bij een beoordeling die alleen sterren is. */
  t?: string;
  /** Onderwerpen, afgeleid uit de tekst. */
  o?: string[];
};

export type ArchiefReview = {
  readonly id: string;
  readonly naam: string;
  readonly datum: string;
  readonly sterren: number;
  readonly tekst: string;
  readonly onderwerpen: readonly SalonizedReviewTopic[];
};

const RUW = archief as RuweReview[];

export const ARCHIEF_MET_TEKST: readonly ArchiefReview[] = RUW.filter(
  (r): r is RuweReview & { t: string; o: string[] } => Boolean(r.t),
).map((r, i) => ({
  id: `a${i}`,
  naam: r.n,
  datum: r.d,
  sterren: r.s,
  tekst: r.t,
  onderwerpen: r.o as SalonizedReviewTopic[],
}));

/** Hoeveel beoordelingen alleen sterren zijn. */
export const ZONDER_TEKST = RUW.length - ARCHIEF_MET_TEKST.length;

/** Alles bij elkaar, inclusief de beoordelingen zonder tekst. */
export const ARCHIEF_TOTAAL = RUW.length;

/** Hoeveel er onder de vijf sterren staan. Ook dat is een cijfer dat je mag weten. */
export const ONDER_VIJF = RUW.filter((r) => r.s < 5).length;

export function archiefBijOnderwerp(
  onderwerp: SalonizedReviewTopic | "alle",
): readonly ArchiefReview[] {
  if (onderwerp === "alle") return ARCHIEF_MET_TEKST;
  return ARCHIEF_MET_TEKST.filter((r) => r.onderwerpen.includes(onderwerp));
}

export function archiefAantal(
  onderwerp: SalonizedReviewTopic | "alle",
): number {
  return archiefBijOnderwerp(onderwerp).length;
}

/** Hoeveel reviews er per pagina staan. */
export const PER_PAGINA = 48;
