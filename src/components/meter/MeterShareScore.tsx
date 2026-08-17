"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import {
  buildMeterScoreCardUrl,
  buildMeterShareText,
  buildMeterShareUrl,
} from "@/lib/meter/share";
import type { MeterScanResult } from "@/lib/meter/types";

interface MeterShareScoreProps {
  result: MeterScanResult;
  userGuess?: number;
}

export function MeterShareScore({ result, userGuess }: MeterShareScoreProps) {
  const [copied, setCopied] = useState<"text" | "link" | null>(null);

  const shareText = buildMeterShareText(result, userGuess);
  const shareUrl = buildMeterShareUrl(result.url);
  const scoreCardUrl = buildMeterScoreCardUrl(result);

  async function copyValue(value: string, kind: "text" | "link") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2200);
    } catch {
      /* clipboard blocked */
    }
  }

  async function nativeShare() {
    if (typeof navigator.share !== "function") {
      void copyValue(shareText, "text");
      return;
    }
    try {
      await navigator.share({
        title: `Meneer Meter · ${result.siteName}`,
        text: shareText,
        url: scoreCardUrl,
      });
    } catch {
      /* user cancelled */
    }
  }

  return (
    <section
      aria-labelledby="meter-share-heading"
      className="mx-auto mt-8 max-w-2xl rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-xl sm:p-8"
    >
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
        Deel je score
      </p>
      <h2 id="meter-share-heading" className="mt-2 text-xl font-extrabold tracking-tight">
        {result.siteName} · {result.total}/100 · {result.verdict}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/70">
        Story, WhatsApp of teamchat. Tag{" "}
        <span className="font-bold text-white">@meneermarketing</span> als je durft.
      </p>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="font-mono text-xs leading-relaxed text-white/85">{shareText}</p>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => void copyValue(shareText, "text")}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF5722] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#e64a19]"
        >
          {copied === "text" ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {copied === "text" ? "Gekopieerd" : "Kopieer tekst"}
        </button>
        <button
          type="button"
          onClick={() => void copyValue(shareUrl, "link")}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
        >
          {copied === "link" ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {copied === "link" ? "Link ok" : "Kopieer link"}
        </button>
        <button
          type="button"
          onClick={() => void nativeShare()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
        >
          <Share2 className="size-4" aria-hidden />
          Delen
        </button>
      </div>
    </section>
  );
}
