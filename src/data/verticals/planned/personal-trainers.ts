import type { VerticalRoadmapEntry } from "@/data/verticals/registry";
import { getVerticalBySlug } from "@/data/verticals/registry";

const entry = getVerticalBySlug("personal-trainers")!;

export const PERSONAL_TRAINERS_PLANNED = {
  ...entry,
  themeAccent: "#FF5722",
  packageNaming: {
    studioEdition: "Trainer Edition",
    localGrowth: "Local Growth",
    growthPartner: "Growth Partner",
  },
  heroAngle:
    "Klanten kopen jou, niet een template. Portfolio, resultaat en beschikbaarheid moeten direct kloppen.",
  bookingHooks: [
    "Intake-call of proefsessie in één klik",
    "Pakketten en locaties (studio / outdoor / online)",
    "UGC en before-after zonder cringe",
  ],
  localSeoExamples: [
    "personal trainer [stad]",
    "pt [wijk]",
    "afvallen personal trainer [stad]",
    "krachttraining coach [regio]",
  ],
} as const satisfies VerticalRoadmapEntry & Record<string, unknown>;
