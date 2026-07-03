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
  vindbaarheid: {
    stickers: [
      "SEO",
      "AI-zoek",
      "ChatGPT",
      "Maps",
      "Content",
      "Reviews",
      "Organisch",
    ],
    funFact:
      "40% van jongvolwassenen gebruikt AI als eerste stap vóór Google. Als je daar niet in het antwoord staat, ben je voor hen onzichtbaar.",
    funFactSource: "Daarom optimaliseren we voor Google én AI",
    funFactStat: "40%",
    hubTitle: "Elk zoekvlak is een kans om gevonden te worden.",
    hubSubtitle:
      "Beweeg over het zoeklandschap en zie welke dienst welk vlak dekt. Of pak de lijst en spring direct naar het juiste traject.",
    proofMetrics: [
      { label: "Organisch verkeer", value: "Groeiend" },
      { label: "AI-vermelding", value: "Meetbaar" },
      { label: "Posities", value: "Vasthouden" },
    ],
  },
  campagnes: {
    stickers: [
      "Google Ads",
      "Meta Ads",
      "UGC",
      "Creators",
      "ROAS",
      "Shopping",
      "Bol",
      "Schaal",
    ],
    funFact:
      "Gemiddeld gaat 26% van advertentiebudget naar zoektermen die al organisch scoren. Wie SEO en ads combineert, betaalt dubbel voor dezelfde klik.",
    funFactSource: "Daarom kijken we eerst naar je fundament",
    funFactStat: "26%",
    hubTitle: "Elk campagnevlak heeft zijn eigen rol in de funnel.",
    hubSubtitle:
      "Beweeg over de funnel en zie welke dienst waar in je campagnes zit. Of pak de lijst en spring direct naar het juiste traject.",
    proofMetrics: [
      { label: "ROAS-sturing", value: "Maandelijks" },
      { label: "Creatives", value: "UGC-first" },
      { label: "Budget", value: "Meetbaar" },
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
  behoud: {
    stickers: [
      "E-mail",
      "Flows",
      "Retentie",
      "Klaviyo",
      "Automatisering",
      "Herhaal",
      "LTV",
    ],
    funFact:
      "Een nieuwe klant werven kost gemiddeld vijf keer meer dan een bestaande behouden. Toch gaat het meeste budget nog steeds naar acquisitie.",
    funFactSource: "Daarom meten we in herhaalaankopen en LTV",
    funFactStat: "5×",
    hubTitle: "Elke module in je stack versterkt de klantrelatie.",
    hubSubtitle:
      "Beweeg over het ecosysteem en zie welke dienst waar in je behoud zit. Of pak de lijst en spring direct naar het juiste traject.",
    proofMetrics: [
      { label: "Omzet per flow", value: "Meetbaar" },
      { label: "Handwerk", value: "Eruit" },
      { label: "Herhaal", value: "Groeiend" },
    ],
  },
};

export function getPillarPremium(slug: string): PillarPremiumContent | null {
  if (slug in PREMIUM) {
    return PREMIUM[slug as PillarSlug] ?? null;
  }
  return null;
}
