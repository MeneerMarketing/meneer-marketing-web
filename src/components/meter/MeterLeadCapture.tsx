"use client";

import Link from "next/link";

import { siteCtas } from "@/lib/cta";
import { whatsappHref } from "@/lib/contact";
import type { MeterScanResult } from "@/lib/meter/types";

interface MeterLeadCaptureProps {
  result: MeterScanResult;
  userGuess?: number;
}

export function MeterLeadCapture({ result, userGuess }: MeterLeadCaptureProps) {
  const guessNote =
    typeof userGuess === "number"
      ? ` Ik gokte ${userGuess}, jij gaf ${result.total}.`
      : "";
  const wa = whatsappHref(
    `Hoi! Ik scande ${result.siteName} met de Meneer Meter (${result.total}/100, ${result.verdict}).${guessNote} Kun je me helpen dit te fixen?`,
  );

  return (
    <section
      aria-labelledby="meter-lead-heading"
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5722]">
        Volgende stap
      </p>
      <h2
        id="meter-lead-heading"
        className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900"
      >
        Score gezien. Nu oplossen.
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Ik kan dit niet alleen met een cijfer fixen. App me met je URL, of start een
        intake. Dan kijk ik mee naar {result.scores[0]?.label.toLowerCase() ?? "design"} en
        de rest van je stack.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white transition hover:brightness-105"
          >
            App me op WhatsApp
          </a>
        ) : null}
        <Link
          href={siteCtas.startIntake.href}
          className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-900 bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          {siteCtas.startIntake.label}
        </Link>
      </div>
    </section>
  );
}
