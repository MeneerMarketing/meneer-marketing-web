/** Dagdeel voor hero-chat intro (lokale tijd bezoeker). */
export type HeroChatTimeSlot =
  | "night"
  | "morning"
  | "midday"
  | "afternoon"
  | "evening"
  | "late";

export function getHeroChatTimeSlot(hour: number): HeroChatTimeSlot {
  if (hour >= 0 && hour < 6) return "night";
  if (hour < 10) return "morning";
  if (hour < 13) return "midday";
  if (hour < 18) return "afternoon";
  if (hour < 22) return "evening";
  return "late";
}

/** Twee korte bubbles per dagdeel. Bubble 2 eindigt altijd op keuze/CTA. */
export const HERO_CHAT_INTRO_BY_TIME: Record<
  HeroChatTimeSlot,
  readonly [string, string]
> = {
  night: [
    "Hoi. Het is midden in de nacht en jij zit op een marketing-site. Ik zeg niks.",
    "Stiekem al plannen terwijl iedereen slaapt? Goed teken. Kies hieronder waar je mee bezig bent.",
  ],
  morning: [
    "Hoi. Vroege vogel. Koffie nog niet klaar, maar ik ben wel online.",
    "Twaalf jaar web en marketing. Jij groeit, ik ben blij. Tik hieronder wat je zoekt.",
  ],
  midday: [
    "Hoi. Tussen twee meetings door even hier. Productief.",
    "Applicatie-dev werd marketeer. Nu help ik bedrijven online groeien. Waar kom je voor?",
  ],
  afternoon: [
    "Hoi. Nog één tabblad open voor het weekend. Herkenbaar.",
    "Iemand die meet wat werkt. Kies hieronder wat past.",
  ],
  evening: [
    "Hoi. Na werktijd nog aan je bedrijf denken. Dat soort mensen help ik graag.",
    "Samen kiezen wat past: site, SEO, ads. Tik hieronder waar je mee bezig bent.",
  ],
  late: [
    "Hoi. Late avond, grote plannen? Herken ik.",
    "Morgen pak ik het op. Nu alvast kiezen? Tik hieronder wat het dichtstbij zit.",
  ],
};

export const HERO_CHAT_TIME_BADGE: Record<HeroChatTimeSlot, string> = {
  night: "Nachtmodus",
  morning: "Vroege vogel",
  midday: "Tussen meetings",
  afternoon: "Middagmodus",
  evening: "Na werktijd",
  late: "Late avond",
};

export function getHeroChatIntroLines(hour: number): readonly string[] {
  return HERO_CHAT_INTRO_BY_TIME[getHeroChatTimeSlot(hour)];
}

export function getHeroChatTimeBadge(hour: number): string {
  return HERO_CHAT_TIME_BADGE[getHeroChatTimeSlot(hour)];
}
