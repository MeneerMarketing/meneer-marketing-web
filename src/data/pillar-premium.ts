import type { PillarSlug } from "@/lib/navigation";

export interface PillarPremiumContent {
  stickers: string[];
  funFact: string;
  funFactSource: string;
  funFactStat: string;
  hubTitle: string;
  hubSubtitle: string;
  proofMetrics: { label: string; value: string }[];
}

const PREMIUM: Partial<Record<PillarSlug, PillarPremiumContent>> = {
  strategie: {
    stickers: [
      "Groeiplan",
      "Prioriteit",
      "CRO",
      "Leadgen",
      "Tracking",
      "Geen PDF",
      "Meetbaar",
    ],
    funFact:
      "73% van de marketingbudgetten gaat naar kanalen die al bewezen werken bij de concurrent. Niet bij jou. Daarom kijken we eerst naar jouw cijfers.",
    funFactSource: "Daarom starten we met data, niet met ads",
    funFactStat: "73%",
    hubTitle: "Elk kanaal heeft zijn plek in het plan.",
    hubSubtitle:
      "Beweeg over het groeikompas en zie welke dienst waar in je strategie zit. Of pak de lijst en spring direct naar het juiste traject.",
    proofMetrics: [
      { label: "Kanalen tegelijk", value: "Max. 3" },
      { label: "Plan vs PDF", value: "Uitvoering" },
      { label: "Bijsturen", value: "Maandelijks" },
    ],
  },
  bouwen: {
    stickers: [
      "From scratch",
      "Geen templates",
      "Shopify",
      "Next.js",
      "CWV groen",
      "Custom build",
      "OS 2.0",
    ],
    funFact:
      "Core Web Vitals in het groen is geen trofee op de muur. Het is gratis SEO-ruimte én hogere conversie op je ads.",
    funFactSource: "Daarom meten we per release",
    funFactStat: "CWV",
    hubTitle: "Elk onderdeel van je site is een vak apart.",
    hubSubtitle:
      "Beweeg over de bouwtekening en zie welke dienst waar aan het werk is. Of pak de lijst en spring direct naar het juiste traject.",
    proofMetrics: [
      { label: "Laadtijd na build", value: "0,8 sec" },
      { label: "Templates gebruikt", value: "Nul" },
      { label: "Core Web Vitals", value: "Groen" },
    ],
  },
};

export function getPillarPremium(slug: string): PillarPremiumContent | null {
  if (slug in PREMIUM) {
    return PREMIUM[slug as PillarSlug] ?? null;
  }
  return null;
}
