"use client";

import { MessageCircle, Rocket } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { LgePayBlock } from "@/components/verticals/LgePayBlock";
import type { VerticalCampaignPersonalization } from "@/data/verticals/types";
import type { VerticalInterestId } from "@/data/verticals/types";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { trackCampaignEvent } from "@/lib/lge/track-client";
import { isCheckoutPackageId } from "@/lib/mollie/checkout-eligible";
import { useMollieCheckoutEnabled } from "@/lib/mollie/use-mollie-checkout-enabled";
import { VerticalLeadSuccess } from "@/components/verticals/VerticalLeadSuccess";
import { submitVerticalInbound } from "@/lib/verticals/submit-inbound";
import { trackPilatesEvent } from "@/lib/verticals/analytics";
import {
  formatVerticalMoney,
  getActiveLaunchPromo,
  resolveLaunchAmountCents,
} from "@/lib/verticals/format-price";

const INTEREST_OPTIONS: {
  id: VerticalInterestId;
  label: string;
  short: string;
}[] = [
  {
    id: "studio-edition",
    label: "Studio Edition",
    short: formatVerticalMoney(PILATES_VERTICAL.pricing.packages[0]!.monthly),
  },
  {
    id: "local-growth",
    label: "Local Growth",
    short: formatVerticalMoney(PILATES_VERTICAL.pricing.packages[1]!.monthly),
  },
  {
    id: "growth-partner",
    label: "Growth Partner",
    short: formatVerticalMoney(PILATES_VERTICAL.pricing.packages[2]!.monthly),
  },
  {
    id: "signature-custom",
    label: "Signature",
    short: formatVerticalMoney(
      PILATES_VERTICAL.pricing.signatureCustom.fromPrice,
    ),
  },
  {
    id: "unsure",
    label: "Help mij kiezen",
    short: "Advies",
  },
];

const BOOKING_OPTIONS = [
  { id: "existing", label: "Heb al een boekingssysteem" },
  { id: "need-app", label: "Wil branded app / Trainin" },
  { id: "unsure", label: "Nog niet zeker" },
  { id: "none", label: "Nog geen digitaal boeken" },
] as const;

type BookingNeed = (typeof BOOKING_OPTIONS)[number]["id"];

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20";

interface PilatesLeadFormProps {
  personalization: VerticalCampaignPersonalization | null;
  campaignRef: string | null;
  selectedInterest?: VerticalInterestId;
  onInterestChange?: (interest: VerticalInterestId) => void;
}

export function PilatesLeadForm({
  personalization,
  campaignRef,
  selectedInterest,
  onInterestChange,
}: PilatesLeadFormProps) {
  const started = useRef(false);
  const promo = getActiveLaunchPromo(PILATES_VERTICAL.pricing);
  const checkoutEnabled = useMollieCheckoutEnabled();

  const [studioName, setStudioName] = useState(
    personalization?.businessName ?? "",
  );
  const [city, setCity] = useState(personalization?.city ?? "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingNeed, setBookingNeed] = useState<BookingNeed>("unsure");
  const [message, setMessage] = useState("");
  const [interest, setInterest] = useState<VerticalInterestId>(
    selectedInterest ?? "unsure",
  );
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [successMeta, setSuccessMeta] = useState<{
    submissionId: string | null;
    launchAmountCents: number;
    paymentRequired: boolean;
    paymentStatus: "none" | "waived" | "pending" | "paid" | "failed";
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const payEligible = checkoutEnabled && isCheckoutPackageId(interest);

  useEffect(() => {
    if (personalization?.businessName) {
      setStudioName(personalization.businessName);
    }
    if (personalization?.city) {
      setCity(personalization.city);
    }
  }, [personalization]);

  useEffect(() => {
    if (selectedInterest) {
      setInterest(selectedInterest);
    }
  }, [selectedInterest]);

  function setInterestBoth(next: VerticalInterestId) {
    setInterest(next);
    onInterestChange?.(next);
  }

  function markStart() {
    if (started.current) return;
    started.current = true;
    trackPilatesEvent("pilates_contact_start");
    if (campaignRef) {
      void trackCampaignEvent(campaignRef, "CONTACT_STARTED", {
        path: "/pilates-studios",
        section: "aanvraag",
      });
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const result = await submitVerticalInbound({
      source: "pilates-studios",
      studioName: studioName.trim(),
      city: city.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      interest,
      bookingNeed,
      message: message.trim() || undefined,
      campaignRef,
      launchPromoActive: Boolean(promo?.active),
      launchAmountCents: resolveLaunchAmountCents(PILATES_VERTICAL.pricing),
      companyWebsite: honeypot,
    });

    if (result.ok) {
      setStatus("ok");
      setSuccessMeta({
        submissionId: result.submissionId,
        launchAmountCents: result.launchAmountCents,
        paymentRequired: result.paymentRequired,
        paymentStatus: result.paymentStatus,
      });
      trackPilatesEvent("pilates_contact_submit", {
        interest,
        has_ref: Boolean(campaignRef),
        booking_need: bookingNeed,
      });
      return;
    }

    setStatus("error");
    setError(result.error);
  }

  if (status === "ok" && successMeta) {
    return (
      <VerticalLeadSuccess
        submissionId={successMeta.submissionId}
        launchAmountCents={successMeta.launchAmountCents}
        paymentRequired={successMeta.paymentRequired}
        paymentStatus={successMeta.paymentStatus}
      />
    );
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-relaxed text-emerald-900">
        <p className="font-extrabold text-emerald-950">Binnen. Nice.</p>
        <p className="mt-1.5">
          Ik lees je aanvraag en neem contact op. Rechtstreeks, meestal snel.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {campaignRef ? (
        <input type="hidden" name="campaign_ref" value={campaignRef} readOnly />
      ) : null}

      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Welk pakket?
        </legend>
        {promo ? (
          <p className="mt-1 text-[11px] font-semibold leading-snug text-[#FF5722]">
            {promo.note}
          </p>
        ) : null}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {INTEREST_OPTIONS.map((opt) => {
            const selected = interest === opt.id;
            return (
              <label
                key={opt.id}
                className={
                  selected
                    ? "cursor-pointer rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-md"
                    : "cursor-pointer rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                }
              >
                <input
                  type="radio"
                  name="interest"
                  value={opt.id}
                  checked={selected}
                  onChange={() => setInterestBoth(opt.id)}
                  onFocus={markStart}
                  className="sr-only"
                />
                {opt.label}
                <span className="ml-1.5 font-semibold text-slate-400">
                  {opt.short.replace(/^Vanaf\s+/i, "")}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Wie ben jij?
        </p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-xs font-semibold text-slate-700">Studio</span>
            <input
              required
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              onFocus={markStart}
              placeholder="Naam van je studio"
              className={inputClass}
              autoComplete="organization"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs font-semibold text-slate-700">Plaats</span>
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={markStart}
              placeholder="Stad of regio"
              className={inputClass}
              autoComplete="address-level2"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs font-semibold text-slate-700">E-mail</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={markStart}
              placeholder="jij@studio.nl"
              className={inputClass}
              autoComplete="email"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs font-semibold text-slate-700">
              Telefoon{" "}
              <span className="font-normal text-slate-400">optioneel</span>
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={markStart}
              placeholder="06…"
              className={inputClass}
              autoComplete="tel"
            />
          </label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <section
          className="flex flex-col rounded-2xl border-2 border-[#FF5722]/35 bg-gradient-to-b from-orange-50/80 to-white p-4 sm:p-5"
          aria-labelledby="pilates-express-lane"
        >
          <div className="flex items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5722] text-white shadow-[0_8px_20px_-8px_rgba(255,87,34,0.6)]">
              <Rocket className="size-4" aria-hidden />
            </span>
            <div>
              <h4
                id="pilates-express-lane"
                className="text-base font-extrabold tracking-tight text-slate-900"
              >
                Snel live
              </h4>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                Klaar om te starten? Betaal via iDEAL. Ik mail je meteen met de
                volgende stappen. Hoe eerder we live gaan, hoe eerder Google je
                studio leert kennen.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-1 flex-col">
            {payEligible ? (
              <LgePayBlock
                vertical="pilates-studios"
                packageId={interest}
                name={studioName}
                email={email}
                businessName={studioName}
                campaignRef={campaignRef}
                onPayStart={markStart}
                variant="express"
              />
            ) : (
              <div className="flex flex-1 flex-col justify-center rounded-xl border border-dashed border-[#FF5722]/30 bg-white/80 px-4 py-5 text-center">
                <p className="text-sm font-bold text-slate-900">
                  Signature of hulp bij kiezen?
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                  Daarvoor eerst even sparren. Gebruik het blok &quot;Eerst
                  praten&quot;. Ik denk mee welk pakket past.
                </p>
              </div>
            )}
          </div>
        </section>

        <section
          className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5"
          aria-labelledby="pilates-talk-lane"
        >
          <div className="flex items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#FF5722]">
              <MessageCircle className="size-4" aria-hidden />
            </span>
            <div>
              <h4
                id="pilates-talk-lane"
                className="text-base font-extrabold tracking-tight text-slate-900"
              >
                Eerst praten
              </h4>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                Vragen over pakket, stad, boekingssysteem of timing? Stuur je
                studio door. Ik lees alles zelf en reageer rechtstreeks.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-1 flex-col gap-3">
            <label className="block text-sm">
              <span className="text-xs font-semibold text-slate-700">
                Boeken / app
              </span>
              <select
                value={bookingNeed}
                onChange={(e) => setBookingNeed(e.target.value as BookingNeed)}
                onFocus={markStart}
                className={inputClass}
              >
                {BOOKING_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block flex-1 text-sm">
              <span className="text-xs font-semibold text-slate-700">
                Kort toelichten{" "}
                <span className="font-normal text-slate-400">optioneel</span>
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={markStart}
                rows={3}
                placeholder="Waar loop je tegenaan? Nieuwe studio, zwakke site, twijfel over pakket…"
                className={`${inputClass} min-h-[5.5rem] resize-none`}
              />
            </label>

            <div className="hidden" aria-hidden>
              <label>
                Bedrijfswebsite
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </div>

            {error ? (
              <p className="text-sm text-rose-700" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-auto inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-900 shadow-sm transition hover:border-[#FF5722] hover:text-[#FF5722] disabled:opacity-60"
            >
              {status === "loading"
                ? "Versturen…"
                : "Stuur door · ik neem contact op"}
            </button>
          </div>
        </section>
      </div>
    </form>
  );
}
