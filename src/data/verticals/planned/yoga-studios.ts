import type { VerticalRoadmapEntry } from "@/data/verticals/registry";
import { getVerticalBySlug } from "@/data/verticals/registry";

const entry = getVerticalBySlug("yoga-studios")!;

export const YOGA_STUDIOS_PLANNED = {
  ...entry,
  themeAccent: "#FF5722",
  packageNaming: {
    studioEdition: "Studio Edition",
    localGrowth: "Local Growth",
    growthPartner: "Growth Partner",
  },
  heroAngle:
    "Yoga is community en ritme. Je site moet lessen, stijl en eerste les laagdrempelig maken.",
  bookingHooks: [
    "Rooster en proefles prominent",
    "Koppeling met Momoyoga / andere agenda",
    "Retentie via mail en social proof",
  ],
  localSeoExamples: [
    "yoga [stad]",
    "yoga studio [wijk]",
    "hot yoga [stad]",
    "beginners yoga [stad]",
  ],
} as const satisfies VerticalRoadmapEntry & Record<string, unknown>;
