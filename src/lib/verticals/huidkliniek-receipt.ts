import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";
import type { VerticalPackageId } from "@/data/verticals/types";

export interface HuidkliniekReceiptLine {
  name: string;
  detail: string;
  was: string | null;
}

export const HUIDKLINIEK_RECEIPT_BASE: readonly HuidkliniekReceiptLine[] = [
  {
    name: "High-end website",
    detail: "Jouw branding, behandelingen, team",
    was: null,
  },
  {
    name: "Lokale SEO",
    detail: "Huidkliniek + jouw stad, schema, Maps",
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
    detail: "Tarieven, teksten, foto's",
    was: null,
  },
  {
    name: "Remote support",
    detail: "6 dagen per week, direct contact",
    was: null,
  },
];

const HUIDKLINIEK_RECEIPT_LOCAL: readonly HuidkliniekReceiptLine[] = [
  {
    name: "Meerdere landingspagina's",
    detail: "Laser, Huidverbetering, Intake, …",
    was: null,
  },
  {
    name: "Bredere lokale SEO",
    detail: "Meer zoektermen dan alleen huidkliniek [stad]",
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

const HUIDKLINIEK_RECEIPT_GROWTH: readonly HuidkliniekReceiptLine[] = [
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
    detail: "Creators die bij jouw kliniek passen",
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

export function getHuidkliniekReceiptLines(
  packageId: VerticalPackageId,
): HuidkliniekReceiptLine[] {
  const lines: HuidkliniekReceiptLine[] = [...HUIDKLINIEK_RECEIPT_BASE];

  if (packageId === "local-growth" || packageId === "growth-partner") {
    lines.push(...HUIDKLINIEK_RECEIPT_LOCAL);
  }
  if (packageId === "growth-partner") {
    lines.push(...HUIDKLINIEK_RECEIPT_GROWTH);
  }

  return lines;
}

export function getHuidkliniekPackageMonthlyAmount(
  packageId: VerticalPackageId,
): number {
  const pkg = HUIDKLINIEKEN_VERTICAL.pricing.packages.find(
    (p) => p.id === packageId,
  );
  if (!pkg) return 89;
  return pkg.monthly.unit === "eur_cents"
    ? pkg.monthly.amount / 100
    : pkg.monthly.amount;
}

export function getHuidkliniekPackageById(packageId: VerticalPackageId) {
  return HUIDKLINIEKEN_VERTICAL.pricing.packages.find(
    (p) => p.id === packageId,
  )!;
}
