import type { VerticalInterestId } from "@/data/verticals/types";
import type { VerticalInboundSource } from "@/lib/lge/inbound-store";

export interface SubmitVerticalInboundPayload {
  source: VerticalInboundSource;
  studioName: string;
  city: string;
  email: string;
  phone?: string;
  interest: VerticalInterestId;
  bookingNeed: string;
  message?: string;
  campaignRef?: string | null;
  launchPromoActive: boolean;
  launchAmountCents: number;
  companyWebsite?: string;
}

export interface SubmitVerticalInboundSuccess {
  ok: true;
  submissionId: string | null;
  launchAmountCents: number;
  paymentRequired: boolean;
  paymentStatus: "none" | "waived" | "pending" | "paid" | "failed";
}

export interface SubmitVerticalInboundError {
  ok: false;
  error: string;
}

export async function submitVerticalInbound(
  payload: SubmitVerticalInboundPayload,
): Promise<SubmitVerticalInboundSuccess | SubmitVerticalInboundError> {
  const res = await fetch("/api/verticals/inbound", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => null)) as
    | (SubmitVerticalInboundSuccess & { ok?: boolean })
    | { ok: false; error?: string }
    | null;

  if (!res.ok || !data || data.ok === false) {
    const message =
      data && "error" in data && typeof data.error === "string"
        ? data.error
        : "Versturen lukte niet. Probeer het opnieuw.";
    return { ok: false, error: message };
  }

  return {
    ok: true,
    submissionId:
      "submissionId" in data && typeof data.submissionId === "string"
        ? data.submissionId
        : null,
    launchAmountCents: Number(data.launchAmountCents ?? 0),
    paymentRequired: Boolean(data.paymentRequired),
    paymentStatus:
      data.paymentStatus === "waived" ||
      data.paymentStatus === "pending" ||
      data.paymentStatus === "paid" ||
      data.paymentStatus === "failed"
        ? data.paymentStatus
        : "none",
  };
}

export async function startLaunchPayment(
  submissionId: string,
): Promise<{ ok: true; checkoutUrl: string } | { ok: false; error: string }> {
  const res = await fetch("/api/mollie/create-launch-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ submissionId }),
  });

  const data = (await res.json().catch(() => null)) as {
    ok?: boolean;
    checkoutUrl?: string;
    error?: string;
  } | null;

  if (!res.ok || !data?.ok || !data.checkoutUrl) {
    return {
      ok: false,
      error:
        typeof data?.error === "string"
          ? data.error
          : "Betaling starten lukte niet.",
    };
  }

  return { ok: true, checkoutUrl: data.checkoutUrl };
}
