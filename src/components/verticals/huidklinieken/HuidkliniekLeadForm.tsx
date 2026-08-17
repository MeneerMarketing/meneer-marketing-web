"use client";

import { ShieldCheck } from "lucide-react";
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
  verticalSectionClass,
} from "@/components/verticals/form/vertical-form-styles";
import { LgePayBlock } from "@/components/verticals/LgePayBlock";
import { SubscriptionCheckoutLegal } from "@/components/verticals/SubscriptionCheckoutLegal";
import type { VerticalCampaignPersonalization } from "@/data/verticals/types";
import type { VerticalInterestId } from "@/data/verticals/types";
import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";
import { trackCampaignEvent } from "@/lib/lge/track-client";
import { isCheckoutPackageId } from "@/lib/mollie/checkout-eligible";
import { useMollieCheckoutEnabled } from "@/lib/mollie/use-mollie-checkout-enabled";
import { submitVerticalInbound } from "@/lib/verticals/submit-inbound";
import { buildThankYouUrl } from "@/lib/verticals/thank-you-url";
import { trackHuidkliniekEvent } from "@/lib/verticals/analytics";
import {
  formatVerticalMoney,
  getActiveLaunchPromo,
  resolveLaunchAmountCents,
} from "@/lib/verticals/format-price";

const PACKAGE_OPTIONS: VerticalPackageOption[] = [
  {
    id: "studio-edition",
    label: "Clinic Edition",
    short: formatVerticalMoney(HUIDKLINIEKEN_VERTICAL.pricing.packages[0]!.monthly),
    hint: "Site + lokaal gevonden worden",
    recommended: true,
  },
  {
    id: "local-growth",
    label: "Local Growth",
    short: formatVerticalMoney(HUIDKLINIEKEN_VERTICAL.pricing.packages[1]!.monthly),
    hint: "Meer patiënten uit Google",
  },
  {
    id: "growth-partner",
    label: "Growth Partner",
    short: formatVerticalMoney(HUIDKLINIEKEN_VERTICAL.pricing.packages[2]!.monthly),
    hint: "Ads + content, vol gas",
  },
  {
    id: "signature-custom",
    label: "Signature",
    short: formatVerticalMoney(
      HUIDKLINIEKEN_VERTICAL.pricing.signatureCustom.fromPrice,
    ),
    hint: "Volledig op maat, eenmalig project",
  },
  {
    id: "unsure",
    label: "Help mij kiezen",
    short: "Advies",
    hint: "Ik denk mee welk pakket past",
  },
];

const BOOKING_OPTIONS = [
  { id: "existing", label: "Heb al een agendasysteem" },
  { id: "need-app", label: "Wil branded kliniek-app" },
  { id: "unsure", label: "Nog niet zeker" },
  { id: "none", label: "Nog geen digitaal boeken" },
] as const;

type BookingNeed = (typeof BOOKING_OPTIONS)[number]["id"];

interface HuidkliniekLeadFormProps {
  personalization: VerticalCampaignPersonalization | null;
  campaignRef: string | null;
  selectedInterest?: VerticalInterestId;
  onInterestChange?: (interest: VerticalInterestId) => void;
  onSubmitted?: () => void;
}

export function HuidkliniekLeadForm({
  personalization,
  campaignRef,
  selectedInterest,
  onInterestChange,
  onSubmitted,
}: HuidkliniekLeadFormProps) {
  const started = useRef(false);
  const promo = getActiveLaunchPromo(HUIDKLINIEKEN_VERTICAL.pricing);
  const checkoutEnabled = useMollieCheckoutEnabled();

  const [clinicName, setClinicName] = useState(
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
  const [status, setStatus] = useState<
    "idle" | "loading" | "redirecting" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const payEligible = checkoutEnabled && isCheckoutPackageId(interest);
  const contactReady = useMemo(
    () =>
      clinicName.trim().length >= 2 &&
      city.trim().length >= 1 &&
      email.trim().includes("@"),
    [clinicName, city, email],
  );

  useEffect(() => {
    if (personalization?.businessName) setClinicName(personalization.businessName);
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
    trackHuidkliniekEvent("huidkliniek_contact_start");
    if (campaignRef) {
      void trackCampaignEvent(campaignRef, "CONTACT_STARTED", {
        path: "/huidklinieken",
        section: "aanvraag",
      });
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const result = await submitVerticalInbound({
      source: "huidklinieken",
      studioName: clinicName.trim(),
      city: city.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      interest,
      bookingNeed,
      message: message.trim() || undefined,
      campaignRef,
      launchPromoActive: Boolean(promo?.active),
      launchAmountCents: resolveLaunchAmountCents(HUIDKLINIEKEN_VERTICAL.pricing),
      companyWebsite: honeypot,
    });

    if (result.ok) {
      setStatus("redirecting");
      onSubmitted?.();
      trackHuidkliniekEvent("huidkliniek_contact_submit", {
        interest,
        has_ref: Boolean(campaignRef),
        booking_need: bookingNeed,
      });
      window.location.assign(
        buildThankYouUrl("huidklinieken", {
          submissionId: result.submissionId,
          studioName: clinicName.trim(),
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
        subtitle="Kies je pakket, vul je kliniek in, start wanneer jij wilt."
        promoNote={promo?.badge ?? null}
        packageChosen={Boolean(interest)}
        contactReady={contactReady}
        routeChosen={intent === "pay" ? payEligible : true}
      />

      <VerticalPackagePicker
        legend="Welk pakket past bij jou?"
        options={PACKAGE_OPTIONS}
        value={interest}
        onChange={setInterestBoth}
        onFocusStart={markStart}
      />

      <VerticalContactFields
        heading="Jouw kliniek"
        nameLabel="Kliniek naam"
        namePlaceholder="Naam van je kliniek"
        name={clinicName}
        onNameChange={setClinicName}
        city={city}
        onCityChange={setCity}
        email={email}
        onEmailChange={setEmail}
        phone={phone}
        onPhoneChange={setPhone}
        onFocusStart={markStart}
      />

      <VerticalIntentTabs
        intent={intent}
        payEligible={payEligible}
        onIntentChange={setIntent}
      />

      {intent === "pay" && payEligible ? (
        <div className={verticalSectionClass}>
          <LgePayBlock
            vertical="huidklinieken"
            packageId={interest}
            name={clinicName}
            email={email}
            city={city}
            phone={phone}
            bookingNeed={bookingNeed}
            message={message}
            businessName={clinicName}
            campaignRef={campaignRef}
            onPayStart={markStart}
            variant="checkout"
          />
        </div>
      ) : null}

      {intent === "talk" || !payEligible ? (
        <div className={`${verticalSectionClass} space-y-4`}>
          {!payEligible ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
              Voor Signature of hulp bij kiezen starten we via contact. Ik denk
              mee welk pakket past.
            </p>
          ) : null}

          <label className="block text-sm">
            <span className="text-xs font-semibold text-slate-700">
              Afspraken / app
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
            <span className="text-xs font-semibold text-slate-700">
              Kort toelichten{" "}
              <span className="font-normal text-slate-400">optioneel</span>
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={markStart}
              rows={3}
              placeholder="Nieuwe kliniek, zwakke site, lokale SEO…"
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
            <p className="text-sm font-semibold text-rose-700" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5722] px-5 py-4 text-base font-bold text-white shadow-[0_16px_36px_-12px_rgba(255,87,34,0.5)] transition hover:bg-[#e64a19] disabled:opacity-60"
          >
            {status === "loading"
              ? "Versturen…"
              : "Stuur door · ik neem contact op"}
          </button>
        </div>
      ) : null}

      {intent === "pay" && payEligible ? (
        <div className={verticalSectionClass}>
          <div className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-emerald-600"
              aria-hidden
            />
            <p className="text-xs leading-relaxed text-slate-600">
              Liever eerst vragen? Klik op{" "}
              <button
                type="button"
                onClick={() => setIntent("talk")}
                className="font-bold text-[#FF5722] underline decoration-[#FF5722]/30 underline-offset-2"
              >
                Eerst praten
              </button>{" "}
              hierboven.
            </p>
          </div>
        </div>
      ) : null}

      <div className={verticalSectionClass}>
        <SubscriptionCheckoutLegal variant="footnote" />
      </div>
    </form>
  );
}
