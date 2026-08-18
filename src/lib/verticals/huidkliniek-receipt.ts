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
    name: "Salonized-koppeling",
    detail: "Intake vanaf je site (licentie apart)",
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
    name: "Huidproblemen-landings",
    detail: "Acne, pigment, roodheid + apparatuur",
    was: null,
  },
  {
    name: "Symptoom-SEO",
    detail: "Probleem + behandeling + [jouw stad]",
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
    name: "Shopify shop",
    detail: "Setup + koppeling (Shopify-plan apart)",
    was: null,
  },
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
    name: "Shop → intake funnel",
    detail: "CRO op shop, landings en boeken",
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
