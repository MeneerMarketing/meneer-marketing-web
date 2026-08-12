import type {
  VerticalLaunchPromo,
  VerticalMoney,
  VerticalPricingConfig,
} from "@/data/verticals/types";

export function formatVerticalMoney(money: VerticalMoney): string {
  const value =
    money.unit === "eur_cents" ? money.amount / 100 : money.amount;
  const formatted = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);

  if (money.prefix) {
    return `${money.prefix} ${formatted}`;
  }
  return formatted;
}

export function resolveSetupMoney(
  setup: VerticalMoney,
  promo?: VerticalLaunchPromo,
): VerticalMoney {
  if (promo?.active) return promo.current;
  return setup;
}

export function formatMonthlyWithSetup(
  monthly: VerticalMoney,
  setup: VerticalMoney,
  promo?: VerticalLaunchPromo,
): {
  monthly: string;
  setup: string;
  setupWas: string | null;
  setupIsFree: boolean;
  promoBadge: string | null;
  promoNote: string | null;
} {
  const effective = resolveSetupMoney(setup, promo);
  const isFree =
    Boolean(promo?.active) &&
    (promo!.current.unit === "eur_cents"
      ? promo!.current.amount === 0
      : promo!.current.amount === 0);

  return {
    monthly: `${formatVerticalMoney(monthly)} per maand`,
    setup: isFree
      ? "€0 launch"
      : `${formatVerticalMoney(effective)} eenmalige launch`,
    setupWas:
      promo?.active && promo.was
        ? `${formatVerticalMoney(promo.was)} launch`
        : null,
    setupIsFree: isFree,
    promoBadge: promo?.active ? promo.badge : null,
    promoNote: promo?.active ? promo.note : null,
  };
}

export function getActiveLaunchPromo(
  pricing: VerticalPricingConfig,
): VerticalLaunchPromo | undefined {
  return pricing.launchPromo?.active ? pricing.launchPromo : undefined;
}
