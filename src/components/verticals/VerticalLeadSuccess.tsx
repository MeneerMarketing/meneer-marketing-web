"use client";

import { useState } from "react";

import { formatVerticalMoney } from "@/lib/verticals/format-price";
import { startLaunchPayment } from "@/lib/verticals/submit-inbound";
import type { VerticalInterestId } from "@/data/verticals/types";
import {
  VerticalLeadReceipt,
  type VerticalLeadSource,
} from "@/components/verticals/VerticalLeadReceipt";

interface VerticalLeadSuccessProps {
  submissionId: string | null;
  launchAmountCents: number;
  paymentRequired: boolean;
  paymentStatus: "none" | "waived" | "pending" | "paid" | "failed";
  vertical: VerticalLeadSource;
  interest: VerticalInterestId;
  businessName?: string;
  city?: string;
  /** Alleen iDEAL-blok, voor gebruik op /bedankt naast order summary. */
  compact?: boolean;
}

export function VerticalLeadSuccess({
  submissionId,
  launchAmountCents,
  paymentRequired,
  paymentStatus,
  vertical,
  interest,
  businessName,
  city,
  compact = false,
}: VerticalLeadSuccessProps) {
  const [payStatus, setPayStatus] = useState<"idle" | "loading" | "error">("idle");
  const [payError, setPayError] = useState<string | null>(null);

  async function onPayLaunch() {
    if (!submissionId) return;
    setPayStatus("loading");
    setPayError(null);
    const result = await startLaunchPayment(submissionId);
    if (!result.ok) {
      setPayStatus("error");
      setPayError(result.error);
      return;
    }
    window.location.href = result.checkoutUrl;
  }

  const launchLabel = formatVerticalMoney({
    amount: launchAmountCents / 100,
    unit: "eur",
    cadence: "one_time",
  });

  const payBlock =
    paymentRequired && submissionId && paymentStatus !== "waived" ? (
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          Direct starten
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Betaal de launch fee ({launchLabel}) via iDEAL om je traject vast te
          leggen.
        </p>
        {payError ? (
          <p className="mt-2 text-xs font-semibold text-rose-700" role="alert">
            {payError}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => void onPayLaunch()}
          disabled={payStatus === "loading"}
          className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {payStatus === "loading"
            ? "Doorsturen naar iDEAL…"
            : `Betaal launch fee · ${launchLabel}`}
        </button>
      </div>
    ) : null;

  if (compact) {
    return payBlock;
  }

  return (
    <div className="space-y-6">
      <VerticalLeadReceipt
        vertical={vertical}
        interest={interest}
        businessName={businessName}
        city={city}
      />

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-relaxed text-emerald-900">
        <div>
          <p className="font-extrabold text-emerald-950">Binnen. Nice.</p>
          <p className="mt-1.5">
            Ik lees je aanvraag en neem contact op. Rechtstreeks, meestal snel.
          </p>
        </div>

        {paymentStatus === "waived" ? (
          <p className="mt-4 rounded-xl border border-emerald-200/80 bg-white/70 px-4 py-3 text-xs font-semibold text-emerald-800">
            Launch fee staat tijdelijk op €0. Je hoeft nu niets te betalen.
          </p>
        ) : null}

        {payBlock ? <div className="mt-4">{payBlock}</div> : null}
      </div>
    </div>
  );
}
