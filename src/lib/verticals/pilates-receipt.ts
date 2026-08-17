import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import type { VerticalPackageId } from "@/data/verticals/types";

export interface PilatesReceiptLine {
  name: string;
  detail: string;
  was: string | null;
}

export const PILATES_RECEIPT_BASE: readonly PilatesReceiptLine[] = [
  {
    name: "High-end website",
    detail: "Jouw branding, lessen, team",
    was: null,
  },
  {
    name: "Lokale SEO",
    detail: "Pilates + jouw stad, schema, Maps",
    was: null,
  },
  {
    name: "Hosting",
    detail: "Snel, beveiligd, onderhouden",
    was: "€25/m",
  },
  {
    name: "Domeinnaam .nl",
    detail: "Jouw adres op het web",
    was: null,
  },
  {
    name: "Klein onderhoud",
    detail: "Rooster, teksten, foto's",
    was: null,
  },
  {
    name: "Remote support",
    detail: "6 dagen per week, direct contact",
    was: null,
  },
];

const PILATES_RECEIPT_LOCAL: readonly PilatesReceiptLine[] = [
  {
    name: "Meerdere landingspagina's",
    detail: "Reformer, privé, intro, …",
    was: null,
  },
  {
    name: "Bredere lokale SEO",
    detail: "Meer zoektermen dan alleen pilates [stad]",
    was: null,
  },
  {
    name: "Google Business Profile",
    detail: "Optimalisatie + Maps-bijsturing",
    was: null,
  },
  {
    name: "SEO-dashboard",
    detail: "Rank tracking en rapportage",
    was: null,
  },
  {
    name: "Maandelijkse bijsturing",
    detail: "Concurrentie, ranks, Search Console",
    was: null,
  },
];

const PILATES_RECEIPT_GROWTH: readonly PilatesReceiptLine[] = [
  {
    name: "Google Ads-beheer",
    detail: "Campagnes (advertentiebudget apart)",
    was: null,
  },
  {
    name: "Meta Ads",
    detail: "Bereik en retargeting",
    was: null,
  },
  {
    name: "Influencer-matches",
    detail: "Creators die bij jouw studio passen",
    was: null,
  },
  {
    name: "Campagne-landings",
    detail: "Pagina's die direct laten boeken",
    was: null,
  },
  {
    name: "Groeianalyse",
    detail: "Funnel, CRO en maandelijkse sturing",
    was: null,
  },
];

export function getPilatesReceiptLines(
  packageId: VerticalPackageId,
): PilatesReceiptLine[] {
  const lines: PilatesReceiptLine[] = [...PILATES_RECEIPT_BASE];

  if (packageId === "local-growth" || packageId === "growth-partner") {
    lines.push(...PILATES_RECEIPT_LOCAL);
  }
  if (packageId === "growth-partner") {
    lines.push(...PILATES_RECEIPT_GROWTH);
  }

  return lines;
}

export function getPilatesPackageMonthlyAmount(
  packageId: VerticalPackageId,
): number {
  const pkg = PILATES_VERTICAL.pricing.packages.find((p) => p.id === packageId);
  if (!pkg) return 89;
  return pkg.monthly.unit === "eur_cents"
    ? pkg.monthly.amount / 100
    : pkg.monthly.amount;
}

export function getPilatesPackageById(packageId: VerticalPackageId) {
  return PILATES_VERTICAL.pricing.packages.find((p) => p.id === packageId)!;
}
