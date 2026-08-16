"use client";

import { useState } from "react";
import { FormSubmitError } from "@/components/contact/FormSubmitError";
import { submitContactForm } from "@/lib/contact-submission";
import type { MeterScanResult } from "@/lib/meter/types";
import { siteCtas } from "@/lib/cta";
import Link from "next/link";

interface MeterLeadCaptureProps {
  result: MeterScanResult;
  userGuess?: number;
}

function buildMeterLeadBody(result: MeterScanResult, userGuess?: number): string {
  const lines = [
    "Meneer Meter scan",
    "",
    `URL: ${result.url}`,
    `Site: ${result.siteName}`,
    `Score: ${result.total}/100 (${result.verdict})`,
    "",
    "Assen:",
    ...result.scores.map((s) => `- ${s.label}: ${s.value}/100 (${s.hint})`),
    "",
    `Oordeel: ${result.oneLiner}`,
  ];

  if (userGuess !== undefined) {
    lines.push("", `Gok van bezoeker: ${userGuess}/100`);
  }

  if (result.signals.good.length) {
    lines.push("", "Pluspunten:", ...result.signals.good.map((g) => `- ${g}`));
  }
  if (result.signals.bad.length) {
    lines.push("", "Minpunten:", ...result.signals.bad.map((b) => `- ${b}`));
  }

  lines.push("", "Bron: meneermarketing.nl/meter");
  return lines.join("\n");
}

export function MeterLeadCapture({ result, userGuess }: MeterLeadCaptureProps) {
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [bedrijf, setBedrijf] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [mailtoHref, setMailtoHref] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const res = await submitContactForm({
      source: "meter",
      subject: `Meneer Meter · ${result.siteName} (${result.total}/100)`,
      replyToEmail: email.trim(),
      replyToName: naam.trim(),
      body: buildMeterLeadBody(result, userGuess),
      companyWebsite: "",
    });

    if (res.ok) {
      setStatus("done");
      if (typeof window !== "undefined") {
        const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
        w.dataLayer = w.dataLayer ?? [];
        w.dataLayer.push({
          event: "meter_lead_submit",
          score: result.total,
          verdict: result.verdict,
          site: result.siteName,
        });
      }
      return;
    }

    setStatus("error");
    setError(res.error);
    setMailtoHref(res.mailtoHref);
  }

  if (status === "done") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
          Binnen
        </p>
        <p className="mt-2 text-2xl font-extrabold text-slate-900">
          Ik kom bij je terug met een scherper plan.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Je scan van {result.siteName} staat in mijn inbox. Geen generiek advies.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5722]">
        Volgende stap
      </p>
      <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
        Wil je dat ik dit fix?
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Stuur je gegevens. Ik koppel je scan aan een concreet voorstel. Of plan direct een
        gesprek als je liever meteen belt.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">Naam</span>
            <input
              required
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">E-mail</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20"
              autoComplete="email"
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-slate-700">
            Bedrijf (optioneel)
          </span>
          <input
            value={bedrijf}
            onChange={(e) => setBedrijf(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20"
            autoComplete="organization"
          />
        </label>

        <input
          type="text"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        {status === "error" && error ? (
          <FormSubmitError message={error} mailtoHref={mailtoHref} />
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[#FF5722] px-6 py-4 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(255,87,34,0.5)] transition hover:bg-[#e64a19] disabled:opacity-60"
          >
            {status === "loading" ? "Versturen…" : "Stuur mijn scan door"}
          </button>
          <Link
            href={siteCtas.startIntake.href}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-4 text-sm font-bold text-slate-800 transition hover:border-[#FF5722] hover:text-[#FF5722]"
          >
            Plan gesprek
          </Link>
        </div>
      </form>
    </div>
  );
}
