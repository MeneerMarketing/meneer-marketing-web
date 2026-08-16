import type { VerticalMoney } from "@/data/verticals/types";

/** Mollie verwacht bedragen als string met twee decimalen, bv. "89.00". */
export function toMollieAmountValue(money: VerticalMoney): string {
  const euros = money.unit === "eur_cents" ? money.amount / 100 : money.amount;
  return euros.toFixed(2);
}

export function toMollieAmount(money: VerticalMoney): {
  currency: "EUR";
  value: string;
} {
  return {
    currency: "EUR",
    value: toMollieAmountValue(money),
  };
}

export function addMollieAmounts(
  a: VerticalMoney,
  b: VerticalMoney,
): VerticalMoney {
  const sum =
    (a.unit === "eur_cents" ? a.amount / 100 : a.amount) +
    (b.unit === "eur_cents" ? b.amount / 100 : b.amount);
  return {
    amount: Math.round(sum * 100) / 100,
    unit: "eur",
    cadence: "one_time",
  };
}
