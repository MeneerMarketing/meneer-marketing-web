"use client";

import { ArrowRight, Lock } from "lucide-react";
import { useState } from "react";

import {
  IdealBadge,
  MollieTrustLine,
} from "@/components/verticals/PaymentMethodBadges";
import { SubscriptionCheckoutLegal } from "@/components/verticals/SubscriptionCheckoutLegal";
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
  city: string;
  businessName: string;
  campaignRef: string | null;
  phone?: string;
  bookingNeed?: string;
  message?: string;
  onPayStart?: () => void;
  variant?: "default" | "express" | "checkout";
}

export function LgePayBlock({
  vertical,
  packageId,
  name,
  email,
  city,
  businessName,
  campaignRef,
  phone,
  bookingNeed,
  message,
  onPayStart,
  variant = "default",
}: LgePayBlockProps) {
  const checkoutEnabled = useMollieCheckoutEnabled();
  const [payStatus, setPayStatus] = useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [payError, setPayError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  if (!checkoutEnabled || !isCheckoutPackageId(packageId)) {
    return null;
  }

  const checkoutPackageId = packageId;
  const quote = buildLgeCheckoutQuote(vertical, checkoutPackageId);
  const monthlyExclLabel = `€${quote.monthlyExcl.value.replace(".", ",")}`;
  const monthlyExclEur = Number.parseFloat(quote.monthlyExcl.value);
  const monthlyInclEur = Number.parseFloat(quote.monthlyAmount.value);

  const isCheckout = variant === "checkout";
  const isExpress = variant === "express";

  async function handlePay(): Promise<void> {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setPayStatus("error");
      setPayError("Vul je studio naam in.");
      return;
    }

    if (trimmedEmail.length === 0) {
      setPayStatus("error");
      setPayError("Vul je e-mailadres in.");
      return;
    }

    if (city.trim().length < 1) {
      setPayStatus("error");
      setPayError("Vul je plaats in.");
      return;
    }

    if (!termsAccepted) {
      setPayStatus("error");
      setPayError("Vink het vakje aan om akkoord te gaan met het abonnement.");
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
        city: city.trim(),
        businessName: businessName.trim() || undefined,
        phone: phone?.trim() || undefined,
        bookingNeed: bookingNeed?.trim() || "unsure",
        message: message?.trim() || undefined,
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

  if (isCheckout) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#FF5722]/25 bg-gradient-to-br from-orange-50 via-white to-white">
        <div className="border-b border-orange-100/80 bg-white/80 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold tracking-tight text-slate-900">
                Betalen en meteen starten
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Eerste maand {monthlyExclLabel} ex. btw. Daarna maandelijks
                hetzelfde bedrag ex. btw. Opzegbaar per maand.
              </p>
            </div>
            <MollieTrustLine />
          </div>
        </div>

        <div className="px-5 py-5">
          <ul className="space-y-2 text-[12px] font-semibold text-slate-600">
            <li className="flex items-center gap-2">
              <IdealBadge />
              <span>iDEAL voor je eerste maand</span>
            </li>
            <li className="flex items-center gap-2">
              <Lock className="size-3.5 text-slate-400" aria-hidden />
              <span>Daarna automatische incasso via Mollie</span>
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="size-3.5 text-[#FF5722]" aria-hidden />
              <span>Direct daarna mail ik je met de kick-off</span>
            </li>
          </ul>

          <SubscriptionCheckoutLegal
            variant="consent"
            monthlyExclEur={monthlyExclEur}
            monthlyInclEur={monthlyInclEur}
            accepted={termsAccepted}
            onAcceptedChange={setTermsAccepted}
          />

          {payError ? (
            <p className="mt-4 text-xs font-semibold text-rose-700" role="alert">
              {payError}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => void handlePay()}
            disabled={payStatus === "loading" || !termsAccepted}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5722] px-5 py-4 text-base font-bold text-white shadow-[0_16px_36px_-12px_rgba(255,87,34,0.55)] transition hover:bg-[#e64a19] disabled:opacity-60"
          >
            <IdealBadge className="h-6" />
            {payStatus === "loading"
              ? "Door naar Mollie…"
              : `Betaal ${monthlyExclLabel} ex. btw`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isExpress
          ? "rounded-xl border border-[#FF5722]/20 bg-white p-1 shadow-sm"
          : "rounded-2xl border border-[#FF5722]/25 bg-gradient-to-br from-[#FF5722]/5 to-white p-4"
      }
    >
      <div className={isExpress ? "rounded-lg bg-[#FF5722]/[0.06] p-3.5" : undefined}>
        <div className="flex items-start gap-3">
          <IdealBadge className="h-9 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold tracking-tight text-slate-900">
              {isExpress ? "Betaal via iDEAL" : "Direct starten via iDEAL"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Eerste betaling {monthlyExclLabel} ex. btw via iDEAL. Daarna{" "}
              {monthlyExclLabel} per maand ex. btw via incasso. Maandelijks
              opzegbaar.
            </p>
          </div>
        </div>

        <SubscriptionCheckoutLegal
          variant="consent"
          monthlyExclEur={monthlyExclEur}
          monthlyInclEur={monthlyInclEur}
          accepted={termsAccepted}
          onAcceptedChange={setTermsAccepted}
        />

        {payError ? (
          <p className="mt-3 text-xs font-semibold text-rose-700" role="alert">
            {payError}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => void handlePay()}
          disabled={payStatus === "loading" || !termsAccepted}
          className={
            isExpress
              ? "mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#FF5722] px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-8px_rgba(255,87,34,0.55)] transition hover:bg-[#e64a19] disabled:opacity-60"
              : "mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#FF5722]/30 bg-white px-4 py-3 text-sm font-bold text-[#FF5722] shadow-sm transition hover:border-[#FF5722]/50 hover:bg-[#FF5722]/5 disabled:opacity-60"
          }
        >
          {payStatus === "loading"
            ? "Door naar Mollie…"
            : `Betaal ${monthlyExclLabel} ex. btw en start`}
        </button>
      </div>
    </div>
  );
}
