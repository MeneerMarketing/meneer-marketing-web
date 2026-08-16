"use client";

import { useEffect, useRef, useState } from "react";

import { LgePayBlock } from "@/components/verticals/LgePayBlock";
import type { VerticalCampaignPersonalization } from "@/data/verticals/types";
import type { VerticalInterestId } from "@/data/verticals/types";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { packageIdToKey } from "@/lib/lge/package-map";
import { trackCampaignEvent } from "@/lib/lge/track-client";
import { submitContactForm } from "@/lib/contact-submission";
import { trackPilatesEvent } from "@/lib/verticals/analytics";
import {
  formatVerticalMoney,
  getActiveLaunchPromo,
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
  const [error, setError] = useState<string | null>(null);
  const [mailtoHref, setMailtoHref] = useState<string | undefined>();

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
    setMailtoHref(undefined);

    const name = studioName.trim() || "Pilates studio";
    const interestLabel =
      INTEREST_OPTIONS.find((o) => o.id === interest)?.label ?? interest;
    const bookingLabel =
      BOOKING_OPTIONS.find((o) => o.id === bookingNeed)?.label ?? bookingNeed;

    const bodyLines = [
      "Aanvraag via meneermarketing.nl/pilates-studios",
      "",
      `Studio: ${studioName.trim()}`,
      `Plaats: ${city.trim()}`,
      `E-mail: ${email.trim()}`,
      `Telefoon: ${phone.trim() || "n.v.t."}`,
      `Boeken: ${bookingLabel}`,
      `Interesse: ${interestLabel}`,
      promo?.active ? `Launch promo: ${promo.badge}` : null,
      campaignRef ? "Campaign: gekoppeld" : "Campaign: geen",
      "",
      "Situatie / vraag:",
      message.trim() || "n.v.t.",
    ].filter((line): line is string => line !== null);

    const result = await submitContactForm({
      source: "pilates-studios",
      subject: `[Pilates studios] ${studioName.trim() || "Nieuwe studio"} · ${city.trim() || "plaats onbekend"}`,
      replyToEmail: email.trim(),
      replyToName: name,
      body: bodyLines.join("\n"),
      companyWebsite: honeypot,
    });

    if (result.ok) {
      setStatus("ok");
      trackPilatesEvent("pilates_contact_submit", {
        interest,
        has_ref: Boolean(campaignRef),
        booking_need: bookingNeed,
      });

      if (campaignRef) {
        const pkg = packageIdToKey(interest);
        void trackCampaignEvent(
          campaignRef,
          "CONTACT_SUBMITTED",
          {
            path: "/pilates-studios",
            section: "aanvraag",
            ...(pkg ? { package: pkg } : {}),
          },
          `CONTACT_SUBMITTED:${campaignRef}:${email.trim().toLowerCase()}`,
        ).catch(() => {
          console.warn(
            "[lge] CONTACT_SUBMITTED tracking failed after MM success",
          );
        });
      }
      return;
    }

    setStatus("error");
    setError(result.error);
    setMailtoHref(result.mailtoHref);
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
    <form onSubmit={onSubmit} className="space-y-3.5" noValidate>
      {campaignRef ? (
        <input type="hidden" name="campaign_ref" value={campaignRef} readOnly />
      ) : null}

      {promo ? (
        <p className="text-[11px] font-semibold leading-snug text-[#FF5722]">
          {promo.note}
        </p>
      ) : null}

      <fieldset>
        <legend className="sr-only">Welk pakket</legend>
        <div className="flex flex-wrap gap-1.5">
          {INTEREST_OPTIONS.map((opt) => {
            const selected = interest === opt.id;
            return (
              <label
                key={opt.id}
                className={
                  selected
                    ? "cursor-pointer rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white"
                    : "cursor-pointer rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-slate-400 hover:bg-white"
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
                <span
                  className={
                    selected
                      ? "ml-1.5 font-semibold text-slate-400"
                      : "ml-1.5 font-semibold text-slate-400"
                  }
                >
                  {opt.short.replace(/^Vanaf\s+/i, "")}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
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
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
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
            Telefoon <span className="font-normal text-slate-400">optioneel</span>
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

      <LgePayBlock
        vertical="pilates-studios"
        packageId={interest}
        name={studioName}
        email={email}
        businessName={studioName}
        campaignRef={campaignRef}
        onPayStart={markStart}
      />

      <label className="block text-sm">
        <span className="text-xs font-semibold text-slate-700">Boeken / app</span>
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
          rows={2}
          placeholder="Nieuwe studio, zwakke site, lokale SEO…"
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
          {error}{" "}
          {mailtoHref ? (
            <a href={mailtoHref} className="font-bold underline">
              Mail direct
            </a>
          ) : null}
        </p>
      ) : null}

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <span className="w-full border-t border-slate-200" />
        </div>
        <p className="relative mx-auto w-fit bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Of eerst contact
        </p>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-[#FF5722] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,87,34,0.3)] transition hover:bg-[#e64a19] disabled:opacity-60"
      >
        {status === "loading" ? "Versturen…" : "Stuur mijn studio door"}
      </button>
    </form>
  );
}
