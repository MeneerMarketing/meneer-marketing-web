"use client";

import { useEffect } from "react";

import { whatsappHref } from "@/lib/contact";
import { trackPurchase } from "@/lib/verticals/ga4";

interface LgeCheckoutThankYouProps {
  paymentId: string;
  vertical: "pilates-studios" | "huidklinieken";
}

export function LgeCheckoutThankYou({
  paymentId,
  vertical,
}: LgeCheckoutThankYouProps) {
  const wa = whatsappHref(
    "Hoi! Ik heb net de launch fee betaald. Wanneer kunnen we starten?",
  );

  useEffect(() => {
    trackPurchase({
      vertical,
      transactionId: paymentId,
      valueCents: 0,
    });
  }, [paymentId, vertical]);

  return (
    <div
      className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6"
      role="status"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-900">
            Betaling ontvangen
          </p>
          <p className="mt-0.5 text-sm text-slate-600">
            Welkom aan boord. Ik neem binnen 24 uur contact op.
          </p>
        </div>
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-105"
          >
            App me op WhatsApp
          </a>
        ) : null}
      </div>
    </div>
  );
}
