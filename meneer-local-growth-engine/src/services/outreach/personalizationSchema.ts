import { z } from "zod";

/** Claude returns only these slots. App renders the approved template. */
export const personalizationSchema = z.object({
  opening_observation: z.string().nullable(),
  primary_keyword: z.string().min(2),
  secondary_keyword: z.string().nullable(),
  relevant_service: z.string().nullable(),
  wording_variant: z.enum(["A", "B", "C"]).nullable().optional(),
  subject_variant: z.enum(["made", "idea", "concept", "website"]).optional().default("made"),
});

export type OutreachPersonalizationSlots = z.infer<typeof personalizationSchema>;

export const FORBIDDEN_PHRASES = [
  "jullie studio past goed bij wat ik doe",
  "past perfect bij wat ik doe",
  "groeikansen",
  "online potentieel",
  "meer leads genereren",
  "conversie optimaliseren",
  "unlock",
  "schalen",
  "ik heb jullie website geanalyseerd",
  "ik heb uw website geanalyseerd",
  "mag ik 15 minuten",
  "speelt in op wat mensen zoeken",
  "ik wilde even contact opnemen",
  "ik hoop dat deze mail je goed bereikt",
  "ik zag een kans om",
  "jullie laten kansen liggen",
  "bovenaan google",
  "gegarandeerd",
  "op #1",
  "nummer 1",
  "limited spot",
  "laatste plek",
  "alleen vandaag",
  "ik ben yasmin",
  "ik ben yasin",
  "mijn naam is",
  "ik ben dhr",
  "beste eigenaar",
  "beste team",
  "geachte heer",
];

export const FORBIDDEN_PERSONAL_NAMES = ["yasmin", "yasin"];
