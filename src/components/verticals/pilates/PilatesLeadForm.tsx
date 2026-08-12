"use client";

import { useEffect, useRef, useState } from "react";

import type { VerticalCampaignPersonalization } from "@/data/verticals/types";
import type { VerticalInterestId } from "@/data/verticals/types";
import { submitContactForm } from "@/lib/contact-submission";
import { trackPilatesEvent } from "@/lib/verticals/analytics";

const INTEREST_OPTIONS: { id: VerticalInterestId; label: string }[] = [
  { id: "studio-edition", label: "Studio Edition" },
  { id: "local-growth", label: "Local Growth" },
  { id: "growth-partner", label: "Growth Partner" },
  { id: "unsure", label: "Help mij kiezen" },
];

interface PilatesLeadFormProps {
  personalization: VerticalCampaignPersonalization | null;
  campaignRef: string | null;
}

export function PilatesLeadForm({
  personalization,
  campaignRef,
}: PilatesLeadFormProps) {
  const started = useRef(false);
  const [studioName, setStudioName] = useState(
    personalization?.businessName ?? "",
  );
  const [city, setCity] = useState(personalization?.city ?? "");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<VerticalInterestId>("unsure");
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

  function markStart() {
    if (started.current) return;
    started.current = true;
    trackPilatesEvent("pilates_contact_start");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    setMailtoHref(undefined);

    const name = contactName.trim() || studioName.trim() || "Pilates studio";
    const interestLabel =
      INTEREST_OPTIONS.find((o) => o.id === interest)?.label ?? interest;

    const bodyLines = [
      "Aanvraag via meneermarketing.nl/pilates-studios",
      "",
      `Studio: ${studioName.trim()}`,
      `Plaats: ${city.trim()}`,
      `Contact: ${contactName.trim() || "n.v.t."}`,
      `E-mail: ${email.trim()}`,
      `Telefoon: ${phone.trim() || "n.v.t."}`,
      `Interesse: ${interestLabel}`,
      campaignRef ? `Campaign ref: ${campaignRef}` : "Campaign ref: geen",
    ];

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
      });
      return;
    }

    setStatus("error");
    setError(result.error);
    setMailtoHref(result.mailtoHref);
  }

  if (status === "ok") {
    return (
      <div className="border border-emerald-200 bg-emerald-50 p-6 text-sm leading-relaxed text-emerald-900">
        Binnen. Ik lees je aanvraag en neem contact op. Meestal snel,
        rechtstreeks.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-semibold text-slate-800">Studio naam</span>
          <input
            required
            value={studioName}
            onChange={(e) => setStudioName(e.target.value)}
            onFocus={markStart}
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none ring-[#FF5722] focus:ring-2"
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
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none ring-[#FF5722] focus:ring-2"
            autoComplete="address-level2"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-semibold text-slate-800">
            Naam <span className="font-normal text-slate-400">(optioneel)</span>
          </span>
          <input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            onFocus={markStart}
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none ring-[#FF5722] focus:ring-2"
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
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none ring-[#FF5722] focus:ring-2"
            autoComplete="email"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-semibold text-slate-800">
          Telefoon <span className="font-normal text-slate-400">(optioneel)</span>
        </span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onFocus={markStart}
          className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none ring-[#FF5722] focus:ring-2"
          autoComplete="tel"
        />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold text-slate-800">
          Interesse
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {INTEREST_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={
                interest === opt.id
                  ? "cursor-pointer border-2 border-slate-900 bg-slate-900 px-3 py-2.5 text-center text-xs font-bold text-white"
                  : "cursor-pointer border border-slate-300 bg-white px-3 py-2.5 text-center text-xs font-bold text-slate-700 hover:border-slate-400"
              }
            >
              <input
                type="radio"
                name="interest"
                value={opt.id}
                checked={interest === opt.id}
                onChange={() => setInterest(opt.id)}
                onFocus={markStart}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

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

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-[#FF5722] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#e64a19] disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Versturen…" : "Stuur mijn studio door"}
      </button>
    </form>
  );
}
