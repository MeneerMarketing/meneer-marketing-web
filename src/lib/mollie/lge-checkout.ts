import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import type {
  VerticalLandingConfig,
  VerticalMoney,
  VerticalPackageId,
} from "@/data/verticals/types";
import {
  getActiveLaunchPromo,
  resolveSetupMoney,
} from "@/lib/verticals/format-price";
import { applyNlVat, moneyToEuros, eurosToMoney } from "@/lib/verticals/vat";

import { addMollieAmounts, toMollieAmount } from "./amount";

export const LGE_CHECKOUT_VERTICALS = {
  "pilates-studios": PILATES_VERTICAL,
  huidklinieken: HUIDKLINIEKEN_VERTICAL,
} as const satisfies Record<string, VerticalLandingConfig>;

export type LgeCheckoutVerticalSlug = keyof typeof LGE_CHECKOUT_VERTICALS;

export interface LgeCheckoutQuote {
  vertical: LgeCheckoutVerticalSlug;
  packageId: VerticalPackageId;
  packageName: string;
  description: string;
  /** Eerste incasso via Mollie, incl. 21% btw. */
  amount: ReturnType<typeof toMollieAmount>;
  /** Maandelijkse incasso via Mollie, incl. 21% btw. */
  monthlyAmount: ReturnType<typeof toMollieAmount>;
  /** Maandbedrag ex. btw (marketingprijs op de site). */
  monthlyExcl: ReturnType<typeof toMollieAmount>;
  /** BTW-deel op het maandbedrag. */
  monthlyVat: ReturnType<typeof toMollieAmount>;
  setupAmount: ReturnType<typeof toMollieAmount>;
  setupWaived: boolean;
  minTermMonths: number;
  vatRate: number;
}

function toMollieAmountInclVat(money: VerticalMoney): ReturnType<typeof toMollieAmount> {
  const { incl } = applyNlVat(moneyToEuros(money));
  return toMollieAmount(eurosToMoney(incl, money.cadence));
}

export function getVerticalConfig(
  slug: LgeCheckoutVerticalSlug,
): VerticalLandingConfig {
  return LGE_CHECKOUT_VERTICALS[slug];
}

export function buildLgeCheckoutQuote(
  verticalSlug: LgeCheckoutVerticalSlug,
  packageId: VerticalPackageId,
): LgeCheckoutQuote {
  const vertical = getVerticalConfig(verticalSlug);
  const pkg = vertical.pricing.packages.find((item) => item.id === packageId);
  if (!pkg) {
    throw new Error(`Onbekend pakket: ${packageId}`);
  }

  const promo = getActiveLaunchPromo(vertical.pricing);
  const setup = resolveSetupMoney(pkg.setup, promo);
  const setupWaived =
    promo !== undefined &&
    (promo.current.unit === "eur_cents"
      ? promo.current.amount === 0
      : promo.current.amount === 0);

  const firstChargeExcl = setupWaived
    ? pkg.monthly
    : addMollieAmounts(pkg.monthly, setup);
  const monthlyExclBreakdown = applyNlVat(moneyToEuros(pkg.monthly));
  const firstChargeIncl = applyNlVat(moneyToEuros(firstChargeExcl));

  return {
    vertical: verticalSlug,
    packageId,
    packageName: pkg.name,
    description: `${pkg.name} · ${vertical.verticalName} · Meneer Marketing`,
    amount: {
      currency: "EUR",
      value: firstChargeIncl.incl.toFixed(2),
    },
    monthlyAmount: toMollieAmountInclVat(pkg.monthly),
    monthlyExcl: toMollieAmount(pkg.monthly),
    monthlyVat: toMollieAmount(
      eurosToMoney(monthlyExclBreakdown.vat, pkg.monthly.cadence),
    ),
    setupAmount: toMollieAmount(setup),
    setupWaived,
    minTermMonths: vertical.pricing.minTermMonths,
    vatRate: 0.21,
  };
}
