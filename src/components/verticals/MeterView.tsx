"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { BrochureOmeter } from "@/components/kennisbank/BrochureOmeter";
import { siteCtas } from "@/lib/cta";

interface MeterViewProps {
  initialUrl: string;
}

function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function MeterView({ initialUrl }: MeterViewProps) {
  const [siteUrl, setSiteUrl] = useState(initialUrl);
  const displayUrl = useMemo(() => normalizeUrl(siteUrl), [siteUrl]);
  const shareUrl = useMemo(() => {
    if (!displayUrl) return "/meter";
    const params = new URLSearchParams({ url: displayUrl });
    return `/meter?${params.toString()}`;
  }, [displayUrl]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
        Meneer Meter
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Waar lekt je site?
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
        Plak je URL. Vink aan wat je herkent. Je ziet direct waar copy en
        structuur conversie kosten, zonder AI-bullshit-score.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-800">
          Jouw website
          <input
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://jouwstudio.nl"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20"
          />
        </label>
        {displayUrl ? (
          <p className="mt-3 text-xs text-slate-500">
            Scan voor:{" "}
            <a
              href={displayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#FF5722] hover:underline"
            >
              {displayUrl}
            </a>
            {" · "}
            <Link href={shareUrl} className="font-semibold text-slate-700 hover:underline">
              Deel deze meter-link
            </Link>
          </p>
        ) : null}
      </div>

      <BrochureOmeter siteUrl={displayUrl || null} sharePath={shareUrl} />

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/pilates-studios"
          className="inline-flex items-center justify-center rounded-full bg-[#FF5722] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#e64a19]"
        >
          Pilates studio aanpak
        </Link>
        <Link
          href={siteCtas.startIntake.href}
          className="inline-flex items-center justify-center rounded-full border border-slate-900 px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
        >
          {siteCtas.startIntake.label}
        </Link>
      </div>
    </div>
  );
}
