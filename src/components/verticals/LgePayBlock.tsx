"use client";

import { CreditCard } from "lucide-react";
import { useState } from "react";

import type { VerticalInterestId } from "@/data/verticals/types";
import { isCheckoutPackageId } from "@/lib/mollie/checkout-eligible";
import {
  buildLgeCheckoutQuote,
  type LgeCheckoutVerticalSlug,
} from "@/lib/mollie/lge-checkout";
import { startLgeCheckout } from "@/lib/mollie/start-checkout";
import { useMollieCheckoutEnabled } from "@/lib/mollie/use-mollie-checkout-enabled";

interface LgePayBlockProps {
  vertical: LgeCheckoutVerticalSlug;
  packageId: VerticalInterestId;
  name: string;
  email: string;
  businessName: string;
  campaignRef: string | null;
  onPayStart?: () => void;
}

export function LgePayBlock({
  vertical,
  packageId,
  name,
  email,
  businessName,
  campaignRef,
  onPayStart,
}: LgePayBlockProps) {
  const checkoutEnabled = useMollieCheckoutEnabled();
  const [payStatus, setPayStatus] = useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [payError, setPayError] = useState<string | null>(null);

  if (!checkoutEnabled || !isCheckoutPackageId(packageId)) {
    return null;
  }

  const checkoutPackageId = packageId;
  const quote = buildLgeCheckoutQuote(vertical, checkoutPackageId);
  const monthlyExclLabel = `€${quote.monthlyExcl.value.replace(".", ",")}`;

  async function handlePay(): Promise<void> {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setPayStatus("error");
      setPayError("Vul je naam of bedrijfsnaam in.");
      return;
    }

    if (trimmedEmail.length === 0) {
      setPayStatus("error");
      setPayError("Vul je e-mailadres in.");
      return;
    }

    setPayStatus("loading");
    setPayError(null);
    onPayStart?.();

    try {
      const { checkoutUrl } = await startLgeCheckout({
        vertical,
        packageId: checkoutPackageId,
        name: trimmedName,
        email: trimmedEmail,
        businessName: businessName.trim() || undefined,
        campaignRef,
      });
      window.location.href = checkoutUrl;
    } catch (err) {
      setPayStatus("error");
      setPayError(
        err instanceof Error ? err.message : "Betaling starten mislukt.",
      );
    }
  }

  return (
    <div className="rounded-2xl border border-[#FF5722]/25 bg-gradient-to-br from-[#FF5722]/5 to-white p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/10 text-[#FF5722]">
          <CreditCard className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold tracking-tight text-slate-900">
            Direct starten via iDEAL
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Eerste betaling {monthlyExclLabel} ex. btw via iDEAL. Daarna{" "}
            {monthlyExclLabel} per maand ex. btw via incasso. Maandelijks
            opzegbaar. Inclusief domeinnaam en hosting (t.w.v. €25 per maand).
          </p>
        </div>
      </div>

      {payError ? (
        <p className="mt-3 text-xs font-semibold text-rose-700" role="alert">
          {payError}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void handlePay()}
        disabled={payStatus === "loading"}
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#FF5722]/30 bg-white px-4 py-3 text-sm font-bold text-[#FF5722] shadow-sm transition hover:border-[#FF5722]/50 hover:bg-[#FF5722]/5 disabled:opacity-60"
      >
        {payStatus === "loading"
          ? "Door naar Mollie…"
          : `Betaal ${monthlyExclLabel} ex. btw en start`}
      </button>
    </div>
  );
}
