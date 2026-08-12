"use client";

import { useEffect, useRef, useState } from "react";

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
  hint: string;
}[] = [
  {
    id: "studio-edition",
    label: "Studio Edition",
    hint: `${formatVerticalMoney(PILATES_VERTICAL.pricing.packages[0]!.monthly)}/m · 5 dagen + Pilates [stad]`,
  },
  {
    id: "local-growth",
    label: "Local Growth",
    hint: `${formatVerticalMoney(PILATES_VERTICAL.pricing.packages[1]!.monthly)}/m · meer pagina's & SEO`,
  },
  {
    id: "growth-partner",
    label: "Growth Partner",
    hint: `${formatVerticalMoney(PILATES_VERTICAL.pricing.packages[2]!.monthly)}/m · SEO + Google Ads`,
  },
  {
    id: "signature-custom",
    label: "Signature Custom",
    hint: `${formatVerticalMoney(PILATES_VERTICAL.pricing.signatureCustom.fromPrice)} · from scratch`,
  },
  {
    id: "unsure",
    label: "Help mij kiezen",
    hint: "Ik adviseer wat past",
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
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/25";

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
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
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

    const name = contactName.trim() || studioName.trim() || "Pilates studio";
    const interestLabel =
      INTEREST_OPTIONS.find((o) => o.id === interest)?.label ?? interest;
    const bookingLabel =
      BOOKING_OPTIONS.find((o) => o.id === bookingNeed)?.label ?? bookingNeed;

    const bodyLines = [
      "Aanvraag via meneermarketing.nl/pilates-studios",
      "",
      `Studio: ${studioName.trim()}`,
      `Plaats: ${city.trim()}`,
      `Contact: ${contactName.trim() || "n.v.t."}`,
      `E-mail: ${email.trim()}`,
      `Telefoon: ${phone.trim() || "n.v.t."}`,
      `Huidige website: ${websiteUrl.trim() || "n.v.t."}`,
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
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm leading-relaxed text-emerald-900">
        <p className="font-extrabold text-emerald-950">Binnen. Nice.</p>
        <p className="mt-2">
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

      {promo ? (
        <p className="rounded-2xl border border-orange-200 bg-orange-50 px-3.5 py-2.5 text-xs font-semibold leading-relaxed text-orange-950">
          {promo.note}
        </p>
      ) : null}

      <fieldset>
        <legend className="text-sm font-extrabold text-slate-900">
          Welk pakket past het dichtst?
        </legend>
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          {INTEREST_OPTIONS.map((opt) => {
            const selected = interest === opt.id;
            return (
              <label
                key={opt.id}
                className={
                  selected
                    ? "cursor-pointer rounded-2xl border-2 border-slate-900 bg-slate-900 px-3.5 py-3 text-white"
                    : "cursor-pointer rounded-2xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-slate-800 transition hover:border-slate-400 hover:bg-white"
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
                <span className="block text-xs font-extrabold tracking-tight">
                  {opt.label}
                </span>
                <span
                  className={
                    selected
                      ? "mt-0.5 block text-[11px] text-slate-300"
                      : "mt-0.5 block text-[11px] text-slate-500"
                  }
                >
                  {opt.hint}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-semibold text-slate-800">Studio naam</span>
          <input
            required
            value={studioName}
            onChange={(e) => setStudioName(e.target.value)}
            onFocus={markStart}
            placeholder="Bijv. Core Reformer"
            className={inputClass}
            autoComplete="organization"
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold text-slate-800">Plaats</span>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-semibold text-slate-800">Jouw naam</span>
          <input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            onFocus={markStart}
            placeholder="Voornaam is genoeg"
            className={inputClass}
            autoComplete="name"
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold text-slate-800">E-mail</span>
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-semibold text-slate-800">
            Telefoon{" "}
            <span className="font-normal text-slate-400">(handig voor snel schakelen)</span>
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
        <label className="block text-sm">
          <span className="font-semibold text-slate-800">
            Huidige website{" "}
            <span className="font-normal text-slate-400">(optioneel)</span>
          </span>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            onFocus={markStart}
            placeholder="https://"
            className={inputClass}
            autoComplete="url"
          />
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-slate-800">
          Boeken / app
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {BOOKING_OPTIONS.map((opt) => {
            const selected = bookingNeed === opt.id;
            return (
              <label
                key={opt.id}
                className={
                  selected
                    ? "cursor-pointer rounded-xl border-2 border-[#FF5722] bg-orange-50 px-3 py-2.5 text-xs font-bold text-slate-900"
                    : "cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 hover:border-slate-400"
                }
              >
                <input
                  type="radio"
                  name="booking"
                  value={opt.id}
                  checked={selected}
                  onChange={() => setBookingNeed(opt.id)}
                  onFocus={markStart}
                  className="sr-only"
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className="block text-sm">
        <span className="font-semibold text-slate-800">
          Wat speelt er nu?{" "}
          <span className="font-normal text-slate-400">(kort is prima)</span>
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={markStart}
          rows={3}
          placeholder="Bijv. nieuwe studio, zwakke site, wil lokalere Google-vindbaarheid, of eerst alleen een nette website…"
          className={`${inputClass} resize-y min-h-[88px]`}
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

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate-500">
          Je praat met mij. Rechtstreeks antwoord.
        </p>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-[#FF5722] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(255,87,34,0.35)] transition hover:bg-[#e64a19] disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? "Versturen…" : "Stuur mijn studio door"}
        </button>
      </div>
    </form>
  );
}
