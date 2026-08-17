"use client";

import Link from "next/link";
import { useEffect } from "react";

import { VerticalLeadReceipt } from "@/components/verticals/VerticalLeadReceipt";
import { VerticalLeadSuccess } from "@/components/verticals/VerticalLeadSuccess";
import type { ThankYouPayload, VerticalThankYouSource } from "@/lib/verticals/thank-you-url";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";
import { whatsappHref } from "@/lib/contact";
import { trackGenerateLead, trackPurchase } from "@/lib/verticals/ga4";

interface VerticalThankYouViewProps {
  source: VerticalThankYouSource;
  payload: ThankYouPayload | null;
}

export function VerticalThankYouView({
  source,
  payload,
}: VerticalThankYouViewProps) {
  const config =
    source === "pilates-studios" ? PILATES_VERTICAL : HUIDKLINIEKEN_VERTICAL;
  const landingPath = config.path;
  const wa = whatsappHref(
    payload?.paidReturn
      ? "Hoi! Ik heb net de launch fee betaald. Wanneer kunnen we starten?"
      : `Hoi! Ik heb net een aanvraag ingediend voor ${payload?.studioName ?? "mijn studio"}.`,
  );

  useEffect(() => {
    if (!payload) return;
    if (payload.paidReturn) {
      trackPurchase({
        vertical: source,
        transactionId: payload.submissionId ?? undefined,
        valueCents: payload.launchAmountCents,
      });
      return;
    }
    trackGenerateLead({
      vertical: source,
      campaignRef: payload.campaignRef,
      packageId: payload.interest,
    });
  }, [payload, source]);

  if (!payload) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <p className="text-lg font-extrabold text-slate-900">
          Geen aanvraag gevonden
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Deze pagina opent na je formulier. Ga terug naar het aanbod en stuur
          je gegevens opnieuw.
        </p>
        <Link
          href={landingPath}
          className="mt-6 inline-flex rounded-full bg-[#FF5722] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#e64a19]"
        >
          Naar het aanbod
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
        {payload.paidReturn ? "Betaling ontvangen" : "Aanvraag ontvangen"}
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {payload.paidReturn ? "Welkom aan boord." : "Bedankt."}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600">
        {payload.paidReturn
          ? "Je launch fee staat. Ik neem binnen 24 uur contact op om je kick-off in te plannen."
          : "Je krijgt een bevestigingsmail. Ik lees je aanvraag zelf en reageer meestal binnen 24 uur."}
      </p>

      <div className="mt-8 space-y-5">
        <VerticalLeadReceipt
          vertical={source}
          interest={payload.interest}
          businessName={payload.studioName}
          city={payload.city}
        />

        {payload.paymentStatus === "waived" ? (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs font-semibold text-slate-700">
            Launch fee staat tijdelijk op €0. Je hoeft nu niets te betalen.
          </p>
        ) : null}

        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
          >
            App me op WhatsApp
          </a>
        ) : null}

        {payload.paymentRequired &&
        payload.paymentStatus !== "waived" &&
        payload.submissionId ? (
          <VerticalLeadSuccess
            submissionId={payload.submissionId}
            launchAmountCents={payload.launchAmountCents}
            paymentRequired={payload.paymentRequired}
            paymentStatus={payload.paymentStatus}
            vertical={source}
            interest={payload.interest}
            businessName={payload.studioName}
            city={payload.city}
            compact
          />
        ) : null}
      </div>

      <p className="mt-10 text-center text-sm text-slate-500">
        <Link
          href={landingPath}
          className="font-semibold text-slate-700 underline-offset-4 hover:text-[#FF5722] hover:underline"
        >
          Terug naar {config.verticalNamePlural.toLowerCase()}
        </Link>
      </p>
    </div>
  );
}
