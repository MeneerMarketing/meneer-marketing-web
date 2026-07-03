import type { PillarSlug } from "@/lib/navigation";

export interface PillarAssemblerSection {
  id: string;
  label: string;
}

export interface PillarPremiumContent {
  /** Sticker-strip onder de hero */
  stickers: string[];
  funFact: string;
  funFactSource: string;
  funFactStat: string;
  /** Secties voor de interactieve page builder */
  assemblerTitle: string;
  assemblerSubtitle: string;
  assemblerSections: PillarAssemblerSection[];
  /** Metrics in het proof-blok */
  proofMetrics: { label: string; value: string }[];
}

const PREMIUM: Partial<Record<PillarSlug, PillarPremiumContent>> = {
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
    assemblerTitle: "Sleep secties. Zie je site groeien.",
    assemblerSubtitle:
      "Zo voelt bouwen from scratch: jij bepaalt wat er op de pagina komt. Sleep, klik of laat hem zichzelf opbouwen.",
    assemblerSections: [
      { id: "hero", label: "Hero" },
      { id: "tekst", label: "Tekst" },
      { id: "grid", label: "Productgrid" },
      { id: "reviews", label: "Reviews" },
      { id: "cta", label: "CTA" },
    ],
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
