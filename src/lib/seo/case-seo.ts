export interface CaseSeoEntry {
  title: string;
  description: string;
  /** Publicatie voor Article schema (E-E-A-T). */
  publishedAt: string;
  dateModified?: string;
}

/** Scherpere meta dan body-tekst: punch + hook, Meneer-stem. */
export const CASE_SEO: Record<string, CaseSeoEntry> = {
  skincomplete: {
    title: "Case SkinComplete | B2B-portaal & SEO vóór ads | Meneer Marketing",
    description:
      "Salons bestelden om 2 uur 's nachts via mail. Custom Shopify, B2B-portaal en mailflows. Organisch vóór paid. Ads pas met bewijs.",
    publishedAt: "2024-09-01",
    dateModified: "2026-03-15",
  },
  bestrest: {
    title: "Case BestRest | Shopify from scratch in matrassenland | Meneer Marketing",
    description:
      "Miljoenenbudgetten in matrassen, BestRest moest opvallen. Custom shop, SEO per lijn, Google Ads en Meta op landings die converteren.",
    publishedAt: "2025-02-01",
    dateModified: "2026-04-01",
  },
  "hills-pilates": {
    title: "Case Hills Pilates | site, app & mail in één lijn | Meneer Marketing",
    description:
      "Lessen, mails en boekingen in losse tools. Website, boekingsapp en automatisering from scratch. Planning centraal, niet via WhatsApp.",
    publishedAt: "2025-06-01",
    dateModified: "2026-05-01",
  },
};

export function getCaseSeo(slug: string): CaseSeoEntry | null {
  return CASE_SEO[slug] ?? null;
}
