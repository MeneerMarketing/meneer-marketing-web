import type { VerticalRoadmapEntry } from "@/data/verticals/registry";
import { getVerticalBySlug } from "@/data/verticals/registry";

const entry = getVerticalBySlug("tandartsen")!;

/**
 * Draft config voor /tandartsen. Promoveer naar volledige VerticalLandingConfig
 * zodra discovery + eerste previews klaar zijn.
 */
export const TANDARTSEN_PLANNED = {
  ...entry,
  themeAccent: "#FF5722",
  packageNaming: {
    studioEdition: "Praktijk Edition",
    localGrowth: "Local Growth",
    growthPartner: "Growth Partner",
  },
  heroAngle:
    "Patiënten zoeken een tandarts op vertrouwen en afstand. Jouw site moet dat in drie seconden overbrengen.",
  bookingHooks: [
    "Integratie met praktijkagenda (Exquise, Dental Office, etc.)",
    "Nieuwe patiënten-flow zonder telefoonstress",
    "Spoed en openingstijden zichtbaar in schema",
  ],
  localSeoExamples: [
    "tandarts [stad]",
    "tandartspraktijk [wijk]",
    "angsttandarts [stad]",
    "implantoloog [regio]",
  ],
} as const satisfies VerticalRoadmapEntry & Record<string, unknown>;
