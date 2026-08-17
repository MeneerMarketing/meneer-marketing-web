"use client";

import { useState } from "react";

import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import type { VerticalInterestId } from "@/data/verticals/types";
import {
  formatVerticalMoney,
  getActiveLaunchPromo,
  resolveLaunchAmountCents,
} from "@/lib/verticals/format-price";
import { trackBeginCheckout } from "@/lib/verticals/ga4";
import {
  startLaunchPayment,
  submitVerticalInbound,
} from "@/lib/verticals/submit-inbound";

type LgeVertical = "pilates-studios" | "huidklinieken";

interface LgePayBlockProps {
  vertical: LgeVertical;
  packageId: VerticalInterestId;
  name: string;
  email: string;
  city: string;
  businessName: string;
  campaignRef: string | null;
  bookingNeed?: string;
  onPayStart?: () => void;
  onSuccess?: () => void;
}

export function LgePayBlock({
  vertical,
  packageId,
  name,
  email,
  city,
  businessName,
  campaignRef,
  bookingNeed = "unsure",
  onPayStart,
  onSuccess,
}: LgePayBlockProps) {
  const pricing =
    vertical === "pilates-studios"
      ? PILATES_VERTICAL.pricing
      : HUIDKLINIEKEN_VERTICAL.pricing;
  const promo = getActiveLaunchPromo(pricing);
  const launchCents = resolveLaunchAmountCents(pricing);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (promo?.active || launchCents < 1) {
    return (
      <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
        Launch fee staat tijdelijk op €0. Stuur je aanvraag hieronder, betalen
        hoeft nu niet.
      </p>
    );
  }

  const launchLabel = formatVerticalMoney({
    amount: launchCents / 100,
    unit: "eur",
    cadence: "one_time",
  });

  async function onPay(): Promise<void> {
    if (!name.trim() || !email.trim() || !city.trim()) {
      setError("Vul studio/kliniek, plaats en e-mail in om te betalen.");
      return;
    }

    setStatus("loading");
    setError(null);
    onPayStart?.();

    trackBeginCheckout({
      vertical,
      campaignRef,
      valueCents: launchCents,
    });

    const inbound = await submitVerticalInbound({
      source: vertical,
      studioName: businessName.trim() || name.trim(),
      city: city.trim(),
      email: email.trim(),
      interest: packageId,
      bookingNeed,
      campaignRef,
      launchPromoActive: false,
      launchAmountCents: launchCents,
    });

    if (!inbound.ok) {
      setStatus("error");
      setError(inbound.error);
      return;
    }

    if (!inbound.paymentRequired || !inbound.submissionId) {
      onSuccess?.();
      setStatus("idle");
      return;
    }

    const pay = await startLaunchPayment(inbound.submissionId);
    if (!pay.ok) {
      setStatus("error");
      setError(pay.error);
      return;
    }

    window.location.href = pay.checkoutUrl;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        Gelijk starten
      </p>
      <p className="mt-2 text-sm text-slate-600">
        Liever direct door? Betaal de launch fee ({launchLabel}) via iDEAL +
        incasso. Daarna zet ik je traject in gang.
      </p>
      {error ? (
        <p className="mt-2 text-xs font-semibold text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => void onPay()}
        disabled={status === "loading"}
        className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        {status === "loading"
          ? "Doorsturen naar iDEAL…"
          : `Start met iDEAL · ${launchLabel}`}
      </button>
    </div>
  );
}
