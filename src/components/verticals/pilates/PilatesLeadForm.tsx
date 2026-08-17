"use client";

import { MessageCircle, Rocket, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { LgePayBlock } from "@/components/verticals/LgePayBlock";
import { SubscriptionCheckoutLegal } from "@/components/verticals/SubscriptionCheckoutLegal";
import { MollieTrustLine } from "@/components/verticals/PaymentMethodBadges";
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

const INTEREST_OPTIONS: {
  id: VerticalInterestId;
  label: string;
  short: string;
  hint: string;
}[] = [
  {
    id: "studio-edition",
    label: "Studio Edition",
    short: formatVerticalMoney(PILATES_VERTICAL.pricing.packages[0]!.monthly),
    hint: "Site + lokaal gevonden",
  },
  {
    id: "local-growth",
    label: "Local Growth",
    short: formatVerticalMoney(PILATES_VERTICAL.pricing.packages[1]!.monthly),
    hint: "Meer proeflessen uit Google",
  },
  {
    id: "growth-partner",
    label: "Growth Partner",
    short: formatVerticalMoney(PILATES_VERTICAL.pricing.packages[2]!.monthly),
    hint: "Ads + creators, vol gas",
  },
  {
    id: "signature-custom",
    label: "Signature",
    short: formatVerticalMoney(
      PILATES_VERTICAL.pricing.signatureCustom.fromPrice,
    ),
    hint: "Volledig op maat",
  },
  {
    id: "unsure",
    label: "Help mij kiezen",
    short: "Advies",
    hint: "Ik denk mee",
  },
];

const BOOKING_OPTIONS = [
  { id: "existing", label: "Heb al een boekingssysteem" },
  { id: "need-app", label: "Wil branded app / Trainin" },
  { id: "unsure", label: "Nog niet zeker" },
  { id: "none", label: "Nog geen digitaal boeken" },
] as const;

type BookingNeed = (typeof BOOKING_OPTIONS)[number]["id"];
type FormIntent = "pay" | "talk";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20";

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
  const [intent, setIntent] = useState<FormIntent>("pay");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "redirecting" | "error">(
    "idle",
  );
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

  useEffect(() => {
    if (!payEligible && intent === "pay") {
      setIntent("talk");
    }
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
      <div className="p-6 sm:p-8 text-center text-sm text-slate-600">
        Even doorsturen naar je bevestiging…
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="divide-y divide-slate-100" noValidate>
      {campaignRef ? (
        <input type="hidden" name="campaign_ref" value={campaignRef} readOnly />
      ) : null}

      <div className="p-6 sm:p-8">
        <fieldset>
          <legend className="text-sm font-extrabold tracking-tight text-slate-900">
            Welk pakket past bij jou?
          </legend>
          {promo ? (
            <p className="mt-1 text-xs font-semibold text-[#FF5722]">
              {promo.note}
            </p>
          ) : null}
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {INTEREST_OPTIONS.map((opt) => {
              const selected = interest === opt.id;
              return (
                <label
                  key={opt.id}
                  className={
                    selected
                      ? "cursor-pointer rounded-2xl border-2 border-[#FF5722] bg-orange-50/60 p-3.5 shadow-[0_8px_24px_-16px_rgba(255,87,34,0.35)] ring-1 ring-[#FF5722]/15 transition"
                      : "cursor-pointer rounded-2xl border border-slate-200 bg-white p-3.5 transition hover:border-slate-300 hover:bg-slate-50"
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
                  <span className="block text-sm font-extrabold text-slate-900">
                    {opt.label}
                  </span>
                  <span className="mt-0.5 block font-mono text-xs font-bold text-[#FF5722]">
                    {opt.short.replace(/^Vanaf\s+/i, "")}
                    <span className="font-sans font-semibold text-slate-400">
                      {" "}
                      ex. btw/m
                    </span>
                  </span>
                  <span className="mt-1 block text-[11px] leading-snug text-slate-500">
                    {opt.hint}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="p-6 sm:p-8">
        <p className="text-sm font-extrabold tracking-tight text-slate-900">
          Jouw studio
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-xs font-semibold text-slate-700">
              Studio naam
            </span>
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

      <div className="p-6 sm:p-8">
        <p className="text-sm font-extrabold tracking-tight text-slate-900">
          Hoe wil je verder?
        </p>

        <div
          className="mt-4 grid gap-2 sm:grid-cols-2"
          role="tablist"
          aria-label="Kies je route"
        >
          <button
            type="button"
            role="tab"
            aria-selected={intent === "pay"}
            disabled={!payEligible}
            onClick={() => setIntent("pay")}
            className={
              intent === "pay"
                ? "flex items-center gap-3 rounded-2xl border-2 border-[#FF5722] bg-[#FF5722] px-4 py-3.5 text-left text-white shadow-[0_12px_28px_-12px_rgba(255,87,34,0.55)]"
                : payEligible
                  ? "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-left transition hover:border-slate-300"
                  : "flex cursor-not-allowed items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3.5 text-left opacity-60"
            }
          >
            <Rocket className="size-5 shrink-0" aria-hidden />
            <span>
              <span className="block text-sm font-extrabold">Direct starten</span>
              <span
                className={
                  intent === "pay"
                    ? "block text-[11px] text-orange-100"
                    : "block text-[11px] text-slate-500"
                }
              >
                Betaal via iDEAL, ik plan meteen
              </span>
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={intent === "talk"}
            onClick={() => setIntent("talk")}
            className={
              intent === "talk"
                ? "flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-slate-900 px-4 py-3.5 text-left text-white shadow-md"
                : "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-left transition hover:border-slate-300"
            }
          >
            <MessageCircle className="size-5 shrink-0" aria-hidden />
            <span>
              <span className="block text-sm font-extrabold">Eerst praten</span>
              <span
                className={
                  intent === "talk"
                    ? "block text-[11px] text-slate-300"
                    : "block text-[11px] text-slate-500"
                }
              >
                Vragen? Stuur door, ik bel of mail
              </span>
            </span>
          </button>
        </div>

        {intent === "pay" && payEligible ? (
          <div className="mt-6">
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
          </div>
        ) : null}

        {intent === "talk" || !payEligible ? (
          <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
            {!payEligible ? (
              <p className="text-sm leading-relaxed text-slate-600">
                Voor Signature of hulp bij kiezen starten we via contact. Ik denk
                mee welk pakket past.
              </p>
            ) : null}

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
                placeholder="Waar loop je tegenaan? Nieuwe studio, zwakke site, twijfel over pakket…"
                className={`${inputClass} resize-none`}
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5722] px-5 py-4 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(255,87,34,0.45)] transition hover:bg-[#e64a19] disabled:opacity-60"
            >
              {status === "loading"
                ? "Versturen…"
                : "Stuur mijn studio door · ik neem contact op"}
            </button>
          </div>
        ) : null}

        {intent === "pay" && payEligible ? (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
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
        ) : null}
      </div>

      <div className="p-6 sm:p-8">
        <SubscriptionCheckoutLegal variant="footnote" />
      </div>
    </form>
  );
}
