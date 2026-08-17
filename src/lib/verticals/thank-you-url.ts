import type { VerticalInterestId } from "@/data/verticals/types";

export type VerticalThankYouSource = "pilates-studios" | "huidklinieken";

export interface ThankYouPayload {
  submissionId: string | null;
  studioName: string;
  city: string;
  interest: VerticalInterestId;
  campaignRef: string | null;
  launchAmountCents: number;
  paymentRequired: boolean;
  paymentStatus: "none" | "waived" | "pending" | "paid" | "failed";
  paidReturn?: boolean;
}

const INTEREST_VALUES = new Set<VerticalInterestId>([
  "studio-edition",
  "local-growth",
  "growth-partner",
  "signature-custom",
  "unsure",
]);

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseInterest(value: string | undefined): VerticalInterestId {
  if (value && INTEREST_VALUES.has(value as VerticalInterestId)) {
    return value as VerticalInterestId;
  }
  return "unsure";
}

function parsePaymentStatus(
  value: string | undefined,
): ThankYouPayload["paymentStatus"] {
  if (
    value === "waived" ||
    value === "pending" ||
    value === "paid" ||
    value === "failed"
  ) {
    return value;
  }
  return "none";
}

export function verticalThankYouPath(source: VerticalThankYouSource): string {
  return source === "pilates-studios"
    ? "/pilates-studios/bedankt"
    : "/huidklinieken/bedankt";
}

export function buildThankYouUrl(
  source: VerticalThankYouSource,
  payload: ThankYouPayload,
): string {
  const params = new URLSearchParams();
  if (payload.submissionId) {
    params.set("submission", payload.submissionId);
  }
  if (payload.studioName.trim()) {
    params.set("studio", payload.studioName.trim());
  }
  if (payload.city.trim()) {
    params.set("stad", payload.city.trim());
  }
  params.set("pakket", payload.interest);
  if (payload.campaignRef) {
    params.set("ref", payload.campaignRef);
  }
  params.set("launch", String(payload.launchAmountCents));
  params.set(
    "pay",
    payload.paymentRequired && payload.paymentStatus !== "waived" ? "1" : "0",
  );
  params.set("status", payload.paymentStatus);
  if (payload.paidReturn) {
    params.set("betaald", "1");
  }
  return `${verticalThankYouPath(source)}?${params.toString()}`;
}

export function parseThankYouSearchParams(
  params: Record<string, string | string[] | undefined>,
): ThankYouPayload | null {
  const studio = firstParam(params.studio)?.trim();
  const submission = firstParam(params.submission)?.trim() ?? null;
  const paidReturn = firstParam(params.betaald) === "1";

  if (!studio && !submission && !paidReturn) {
    return null;
  }

  return {
    submissionId: submission,
    studioName: studio ?? "Jouw aanvraag",
    city: firstParam(params.stad)?.trim() ?? "",
    interest: parseInterest(firstParam(params.pakket)),
    campaignRef: firstParam(params.ref)?.trim() ?? null,
    launchAmountCents: Number(firstParam(params.launch) ?? "0") || 0,
    paymentRequired: firstParam(params.pay) === "1",
    paymentStatus: parsePaymentStatus(firstParam(params.status)),
    paidReturn,
  };
}
