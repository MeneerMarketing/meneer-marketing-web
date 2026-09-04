export function formatNullable(
  value: string | number | null | undefined,
  emptyLabel = "Niet gedetecteerd"
): string {
  if (value === null || value === undefined || value === "") {
    return emptyLabel;
  }
  return String(value);
}

export function formatPrice(
  price: number | null | undefined,
  currency: string | null | undefined
): string {
  if (price === null || price === undefined) {
    return "Geen prijs gevonden";
  }
  const cur = currency ?? "EUR";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: cur === "EUR" ? "EUR" : cur,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatReviews(count: number | null | undefined): string {
  if (count === null || count === undefined) {
    return "Onbekend";
  }
  return `${count}`;
}

export function formatRating(rating: number | null | undefined): string {
  if (rating === null || rating === undefined) {
    return "Onbekend";
  }
  return rating.toFixed(1);
}

export function formatScore(
  score: number | null | undefined,
  suffix = "/100"
): string {
  if (score === null || score === undefined) {
    return "Onbekend";
  }
  return `${score}${suffix}`;
}

export function formatConfidence(
  value: number | null | undefined
): string {
  if (value === null || value === undefined) {
    return "Onbekend";
  }
  return `${Math.round(value * 100)}%`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "Onbekend";
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDomain(domain: string | null | undefined): string {
  if (!domain) return "Onbekend";
  return domain.replace(/^www\./, "");
}

export function signalLabel(signal: string | null | undefined): string {
  switch (signal) {
    case "CONFIRMED_PAID":
      return "Confirmed paid";
    case "PAID_CANDIDATE":
      return "Paid candidate";
    case "NON_PAID":
      return "Non-paid";
    default:
      return "Onbekend";
  }
}
