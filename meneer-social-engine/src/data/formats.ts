import type { ContentFormatId, MediaType } from "@/services/types";

export interface FormatDefinition {
  id: ContentFormatId;
  name: string;
  description: string;
  mediaType: MediaType;
  /** Tier 1 staat wekelijks vast, tier 2 is maandelijks, tier 3 is opportunistisch. */
  tier: 1 | 2 | 3;
  weightPercent: number;
  dayOfWeek?: "tuesday" | "thursday" | "saturday";
  /** Wat dit format moet doen voor het merk. Gaat mee in de Claude-prompt. */
  job: string;
}

export const CONTENT_FORMATS: FormatDefinition[] = [
  {
    id: "DE_REKENING",
    name: "De Rekening",
    description: "Fout op een echte pagina, uitgedrukt in euro's per maand",
    mediaType: "carousel",
    tier: 1,
    weightPercent: 22,
    dayOfWeek: "tuesday",
    job: "Bewijzen dat een ontwerpfout een geldprobleem is. Deelbaar omdat het pijn doet.",
  },
  {
    id: "MENEER_FIXT",
    name: "Meneer Fixt",
    description: "Eén element herbouwd, before/after",
    mediaType: "reel",
    tier: 1,
    weightPercent: 20,
    dayOfWeek: "thursday",
    job: "Laten zien dat hij het daadwerkelijk kan bouwen. Eén ding tegelijk.",
  },
  {
    id: "MENEER_ZEGT",
    name: "Meneer Zegt",
    description: "Contraire mening over marketing",
    mediaType: "carousel",
    tier: 1,
    weightPercent: 18,
    dayOfWeek: "saturday",
    job: "Smaak en stellingname opbouwen. Goedkoop te maken, hoog bereik.",
  },
  {
    id: "MENEER_METER",
    name: "Meneer Meter",
    description: "Sitescore met reveal aan het eind",
    mediaType: "carousel",
    tier: 2,
    weightPercent: 12,
    job: "Van een audit een aflevering maken. Score pas op de laatste slide.",
  },
  {
    id: "MENEER_ONTLEEDT",
    name: "Meneer Ontleedt",
    description: "Teardown van een groot merk, positief van toon",
    mediaType: "carousel",
    tier: 2,
    weightPercent: 8,
    job: "Op niveau van de grote jongens gaan staan zonder iemand te beschadigen.",
  },
  {
    id: "DE_OFFERTE",
    name: "De Offerte",
    description: "Geanonimiseerde bureau-offerte ontleed",
    mediaType: "carousel",
    tier: 3,
    weightPercent: 6,
    job: "Maximale deelbaarheid. Nooit een bureau bij naam noemen.",
  },
  {
    id: "ZESTIG_MINUTEN",
    name: "Zestig Minuten",
    description: "Timed build van leeg scherm naar live",
    mediaType: "reel",
    tier: 3,
    weightPercent: 5,
    job: "De vraag of hij het echt kan definitief afsluiten.",
  },
  {
    id: "BUREAU_BINGO",
    name: "Bureau Bingo",
    description: "Buzzwordhumor met zelfspot",
    mediaType: "carousel",
    tier: 3,
    weightPercent: 4,
    job: "Humorklep. Maximaal één keer per maand.",
  },
  {
    id: "CASE_BUILD",
    name: "Case",
    description: "Opgeleverd werk met resultaat",
    mediaType: "carousel",
    tier: 3,
    weightPercent: 3,
    job: "Overweging aanjagen bij mensen die al warm zijn.",
  },
  {
    id: "BUILD_LOG",
    name: "Build in Public",
    description: "Werk in uitvoering",
    mediaType: "story",
    tier: 3,
    weightPercent: 1,
    job: "Laten zien dat er echt gewerkt wordt. Hoort in Stories.",
  },
  {
    id: "COMMERCIAL",
    name: "Direct aanbod",
    description: "Expliciete CTA",
    mediaType: "carousel",
    tier: 3,
    weightPercent: 1,
    job: "Werkt alleen doordat al het andere ervoor staat. Spaarzaam inzetten.",
  },
];

/** Doelaantallen per maand. Drie vaste posts per week plus een wisselaar. */
export const MONTHLY_TARGETS: Record<ContentFormatId, number> = {
  DE_REKENING: 4,
  MENEER_FIXT: 4,
  MENEER_ZEGT: 4,
  MENEER_METER: 1,
  MENEER_ONTLEEDT: 1,
  DE_OFFERTE: 1,
  ZESTIG_MINUTEN: 1,
  BUREAU_BINGO: 1,
  CASE_BUILD: 1,
  BUILD_LOG: 0,
  COMMERCIAL: 0,
};

export const WEEKLY_RHYTHM = [
  { day: "Dinsdag", formatId: "DE_REKENING" as ContentFormatId, note: "Carousel met bedrag" },
  { day: "Donderdag", formatId: "MENEER_FIXT" as ContentFormatId, note: "Reel, één element" },
  { day: "Zaterdag", formatId: "MENEER_ZEGT" as ContentFormatId, note: "Contraire mening" },
] as const;

/** Wisselaars die om de week ingepland worden naast het vaste ritme. */
export const ROTATING_FORMATS: ContentFormatId[] = [
  "MENEER_METER",
  "MENEER_ONTLEEDT",
  "DE_OFFERTE",
  "ZESTIG_MINUTEN",
];

export function getFormatById(id: ContentFormatId): FormatDefinition {
  const format = CONTENT_FORMATS.find((f) => f.id === id);
  if (!format) throw new Error(`Unknown format: ${id}`);
  return format;
}
