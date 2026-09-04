export function submissionStatusLabel(status: string): string {
  switch (status) {
    case "new":
      return "Nieuw";
    case "contacted":
      return "Contact gehad";
    case "qualified":
      return "Gekwalificeerd";
    case "won":
      return "Gewonnen";
    case "lost":
      return "Verloren";
    default:
      return status;
  }
}

export function paymentStatusLabel(status: string): string {
  switch (status) {
    case "paid":
      return "Betaald";
    case "waived":
      return "€0 promo";
    case "pending":
      return "In afwachting";
    case "failed":
      return "Mislukt";
    default:
      return "Open";
  }
}

export function paymentStatusTone(
  status: string,
): "success" | "warn" | "neutral" | "brand" {
  switch (status) {
    case "paid":
      return "success";
    case "waived":
      return "brand";
    case "pending":
    case "failed":
      return "warn";
    default:
      return "neutral";
  }
}

export function submissionStatusTone(
  status: string,
): "success" | "warn" | "neutral" | "brand" | "sky" {
  switch (status) {
    case "won":
      return "success";
    case "qualified":
      return "brand";
    case "contacted":
      return "sky";
    case "lost":
      return "warn";
    default:
      return "neutral";
  }
}

export type InboundSubmissionStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "won"
  | "lost";
