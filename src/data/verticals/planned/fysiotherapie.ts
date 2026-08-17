import type { VerticalRoadmapEntry } from "@/data/verticals/registry";
import { getVerticalBySlug } from "@/data/verticals/registry";

const entry = getVerticalBySlug("fysiotherapie")!;

export const FYSIOTHERAPIE_PLANNED = {
  ...entry,
  themeAccent: "#FF5722",
  packageNaming: {
    studioEdition: "Praktijk Edition",
    localGrowth: "Local Growth",
    growthPartner: "Growth Partner",
  },
  heroAngle:
    "Mensen zoeken op klacht en plaats, niet op jouw praktijknaam. Daar win je of verlies je het consult.",
  bookingHooks: [
    "Online intake + afspraak via bestaand PMS",
    "Specialisatiepagina's per klacht (rug, knie, sport)",
    "Verwijzer-vriendelijke structuur",
  ],
  localSeoExamples: [
    "fysiotherapeut [stad]",
    "fysio [wijk]",
    "rugpijn fysiotherapie [stad]",
    "sportfysiotherapie [regio]",
  ],
} as const satisfies VerticalRoadmapEntry & Record<string, unknown>;
