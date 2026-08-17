"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { VerticalContactFields } from "@/components/verticals/form/VerticalContactFields";
import {
  VerticalIntentTabs,
  type VerticalFormIntent,
} from "@/components/verticals/form/VerticalIntentTabs";
import { VerticalLeadFormHeader } from "@/components/verticals/form/VerticalLeadFormHeader";
import {
  VerticalPackagePicker,
  type VerticalPackageOption,
} from "@/components/verticals/form/VerticalPackagePicker";
import {
  verticalInputClass,
  verticalSectionCompactClass,
} from "@/components/verticals/form/vertical-form-styles";
import { LgePayBlock } from "@/components/verticals/LgePayBlock";
import { SubscriptionCheckoutLegal } from "@/components/verticals/SubscriptionCheckoutLegal";
import type { VerticalCampaignPersonalization } from "@/data/verticals/types";
import type { VerticalInterestId } from "@/data/verticals/types";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { trackCampaignEvent } from "@/lib/lge/track-client";
import { isCheckoutPackageId } from "@/lib/mollie/checkout-eligible";
import { useMollieCheckoutEnabled } from "@/lib/mollie/use-mollie-checkout-enabled";
import { submitVerticalInbound } from "@/lib/verticals/submit-inbound";
import { buildThankYouUrl } from "@/lib/verticals/thank-you-url";
import { trackPilatesEvent } from "@/lib/verticals/analytics";
import {
  formatVerticalMoney,
  getActiveLaunchPromo,
  resolveLaunchAmountCents,
} from "@/lib/verticals/format-price";

const PACKAGE_OPTIONS: VerticalPackageOption[] = [
  {
    id: "studio-edition",
    label: "Studio Edition",
    short: formatVerticalMoney(PILATES_VERTICAL.pricing.packages[0]!.monthly),
    hint: "Site + lokaal gevonden worden",
    recommended: true,
    billing: "monthly",
  },
  {
    id: "local-growth",
    label: "Local Growth",
    short: formatVerticalMoney(PILATES_VERTICAL.pricing.packages[1]!.monthly),
    hint: "Meer proeflessen uit Google",
    billing: "monthly",
  },
  {
    id: "growth-partner",
    label: "Growth Partner",
    short: formatVerticalMoney(PILATES_VERTICAL.pricing.packages[2]!.monthly),
    hint: "Ads + creators, vol gas",
    billing: "monthly",
  },
  {
    id: "signature-custom",
    label: "Signature Custom",
    short: formatVerticalMoney(PILATES_VERTICAL.pricing.signatureCustom.fromPrice),
    hint: "Website afkopen in één keer. Daarna zelf beheer. Eén project, daarna ben jij aan zet.",
    billing: "one_time",
  },
  {
    id: "unsure",
    label: "Help mij kiezen",
    short: "Advies",
    hint: "Twijfel je? Ik denk mee.",
    billing: "advisory",
  },
];

const BOOKING_OPTIONS = [
  { id: "existing", label: "Heb al een boekingssysteem" },
  { id: "need-app", label: "Wil branded app / Trainin" },
  { id: "unsure", label: "Nog niet zeker" },
  { id: "none", label: "Nog geen digitaal boeken" },
] as const;

type BookingNeed = (typeof BOOKING_OPTIONS)[number]["id"];

interface PilatesLeadFormProps {
  personalization: VerticalCampaignPersonalization | null;
  campaignRef: string | null;
  selectedInterest?: VerticalInterestId;
  onInterestChange?: (interest: VerticalInterestId) => void;
  onSubmitted?: () => void;
}

export function PilatesLeadForm({
  personalization,
  campaignRef,
  selectedInterest,
  onInterestChange,
  onSubmitted,
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
    selectedInterest ?? "studio-edition",
  );
  const [intent, setIntent] = useState<VerticalFormIntent>("pay");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "redirecting" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const payEligible = checkoutEnabled && isCheckoutPackageId(interest);
  const contactReady = useMemo(
    () =>
      studioName.trim().length >= 2 &&
      city.trim().length >= 1 &&
      email.trim().includes("@"),
    [studioName, city, email],
  );

  useEffect(() => {
    if (personalization?.businessName) setStudioName(personalization.businessName);
    if (personalization?.city) setCity(personalization.city);
  }, [personalization]);

  useEffect(() => {
    if (selectedInterest) setInterest(selectedInterest);
  }, [selectedInterest]);

  useEffect(() => {
    if (!payEligible && intent === "pay") setIntent("talk");
  }, [payEligible, intent]);

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
      setStatus("redirecting");
      onSubmitted?.();
      trackPilatesEvent("pilates_contact_submit", {
        interest,
        has_ref: Boolean(campaignRef),
        booking_need: bookingNeed,
      });
      window.location.assign(
        buildThankYouUrl("pilates-studios", {
          submissionId: result.submissionId,
          studioName: studioName.trim(),
          city: city.trim(),
          interest,
          campaignRef,
          launchAmountCents: result.launchAmountCents,
          paymentRequired: result.paymentRequired,
          paymentStatus: result.paymentStatus,
        }),
      );
      return;
    }

    setStatus("error");
    setError(result.error);
  }

  if (status === "redirecting") {
    return (
      <div className="px-6 py-16 text-center sm:px-8">
        <p className="text-sm font-semibold text-slate-600">
          Even doorsturen naar je bevestiging…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="divide-y divide-slate-100" noValidate>
      {campaignRef ? (
        <input type="hidden" name="campaign_ref" value={campaignRef} readOnly />
      ) : null}

      <VerticalLeadFormHeader
        eyebrow="Intake"
        title="Binnen twee minuten geregeld."
        subtitle="Pakket, gegevens, start."
        promoNote={promo?.badge ?? null}
        packageChosen={Boolean(interest)}
        contactReady={contactReady}
        routeChosen={intent === "pay" ? payEligible : true}
      />

      <div className="lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="divide-y divide-slate-100">
          <VerticalPackagePicker
            legend="Welk pakket past bij jou?"
            options={PACKAGE_OPTIONS}
            value={interest}
            onChange={setInterestBoth}
            onFocusStart={markStart}
            compact
          />

          <VerticalContactFields
            heading="Jouw studio"
            nameLabel="Studio"
            namePlaceholder="Naam van je studio"
            name={studioName}
            onNameChange={setStudioName}
            city={city}
            onCityChange={setCity}
            email={email}
            onEmailChange={setEmail}
            phone={phone}
            onPhoneChange={setPhone}
            onFocusStart={markStart}
            compact
          />
        </div>

        <div className="divide-y divide-slate-100 lg:border-l lg:border-slate-100">
          <VerticalIntentTabs
            intent={intent}
            payEligible={payEligible}
            onIntentChange={setIntent}
            compact
          />

          {intent === "pay" && payEligible ? (
            <div className={verticalSectionCompactClass}>
              <LgePayBlock
                vertical="pilates-studios"
                packageId={interest}
                name={studioName}
                email={email}
                city={city}
                phone={phone}
                bookingNeed={bookingNeed}
                message={message}
                businessName={studioName}
                campaignRef={campaignRef}
                onPayStart={markStart}
                variant="checkout"
              />
              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                Liever vragen?{" "}
                <button
                  type="button"
                  onClick={() => setIntent("talk")}
                  className="font-bold text-[#FF5722] underline decoration-[#FF5722]/30 underline-offset-2"
                >
                  Eerst praten
                </button>
              </p>
            </div>
          ) : null}

          {intent === "talk" || !payEligible ? (
            <div className={`${verticalSectionCompactClass} space-y-3`}>
              {!payEligible ? (
                <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-600">
                  {interest === "signature-custom"
                    ? "Signature is een eenmalig afkooptraject. Ik stuur je een offerte op maat."
                    : "Voor dit pakket starten we via contact. Ik denk mee welk plan past."}
                </p>
              ) : null}

              <label className="block text-sm">
                <span className="text-[11px] font-semibold text-slate-700">
                  Boeken / app
                </span>
                <select
                  value={bookingNeed}
                  onChange={(e) => setBookingNeed(e.target.value as BookingNeed)}
                  onFocus={markStart}
                  className={verticalInputClass}
                >
                  {BOOKING_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="text-[11px] font-semibold text-slate-700">
                  Kort toelichten{" "}
                  <span className="font-normal text-slate-400">optioneel</span>
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={markStart}
                  rows={2}
                  placeholder="Waar loop je tegenaan?"
                  className={`${verticalInputClass} resize-none`}
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
                <p className="text-xs font-semibold text-rose-700" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#FF5722] px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(255,87,34,0.45)] transition hover:bg-[#e64a19] disabled:opacity-60"
              >
                {status === "loading"
                  ? "Versturen…"
                  : "Stuur door · ik neem contact op"}
              </button>
            </div>
          ) : null}

          <div className={verticalSectionCompactClass}>
            <SubscriptionCheckoutLegal variant="footnote" />
          </div>
        </div>
      </div>
    </form>
  );
}
