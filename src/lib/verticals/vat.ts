import type { VerticalMoney } from "@/data/verticals/types";

/** Nederlands hoog tarief voor digitale diensten / abonnementen. */
export const NL_VAT_RATE = 0.21;

export interface VatBreakdown {
  excl: number;
  vat: number;
  incl: number;
}

export function moneyToEuros(money: VerticalMoney): number {
  return money.unit === "eur_cents" ? money.amount / 100 : money.amount;
}

export function eurosToMoney(
  euros: number,
  cadence: VerticalMoney["cadence"] = "monthly",
): VerticalMoney {
  return {
    amount: Math.round(euros * 100) / 100,
    unit: "eur",
    cadence,
  };
}

export function applyNlVat(exclEur: number): VatBreakdown {
  const excl = Math.round(exclEur * 100) / 100;
  const vat = Math.round(excl * NL_VAT_RATE * 100) / 100;
  const incl = Math.round((excl + vat) * 100) / 100;
  return { excl, vat, incl };
}

export function applyNlVatToMoney(money: VerticalMoney): VatBreakdown {
  return applyNlVat(moneyToEuros(money));
}

export function formatEuroAmount(euros: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: euros % 1 === 0 ? 0 : 2,
  }).format(euros);
}

export const PRICE_EXCL_BTW_LABEL = "ex. btw";

export function formatExclBtwPrice(euros: number): string {
  return `${formatEuroAmount(euros)} ${PRICE_EXCL_BTW_LABEL}`;
}

export function formatInclBtwPrice(eurosExcl: number): string {
  const { incl } = applyNlVat(eurosExcl);
  return `${formatEuroAmount(incl)} incl. btw`;
}
