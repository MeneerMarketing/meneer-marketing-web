"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Gauge, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LivingCloudGrid } from "@/components/effects/LivingCloudGrid";
import { GroeiscanMeneerCoach } from "@/components/groeiscan/GroeiscanMeneerCoach";
import { MeterAxisBars } from "@/components/meter/MeterAxisBars";
import { MeterDial } from "@/components/meter/MeterDial";
import { MeterLeadCapture } from "@/components/meter/MeterLeadCapture";
import type { MeterPhase, MeterScanResult } from "@/lib/meter/types";

const SCAN_LINES = [
  "Ik kijk even of je H1 bestaat.",
  "Viewport check. Spannend.",
  "Tel CTA's. Of het gebrek eraan.",
  "Zoek naar boek-knoppen die verstoppen.",
  "Meta description. Kort en krachtig, hopelijk.",
  "Even voelen of dit nog 2017 ruikt.",
];

export function MeterExperience() {
  const reduce = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<MeterPhase>("idle");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MeterScanResult | null>(null);
  const [guess, setGuess] = useState(52);
  const [scanLine, setScanLine] = useState(0);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [scanPulse, setScanPulse] = useState(38);
  const [loading, setLoading] = useState(false);

  const activeScanLine = useMemo(
    () => SCAN_LINES[scanLine % SCAN_LINES.length] ?? SCAN_LINES[0]!,
    [scanLine],
  );

  useEffect(() => {
    if (phase !== "scanning") return;
    const id = window.setInterval(() => {
      setScanLine((n) => n + 1);
    }, 900);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "scanning" || reduce) return;
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      const wave = 38 + Math.sin(frame * 0.55) * 22 + Math.sin(frame * 0.18) * 8;
      setScanPulse(Math.round(Math.max(12, Math.min(72, wave))));
    }, 120);
    return () => window.clearInterval(id);
  }, [phase, reduce]);

  useEffect(() => {
    if (phase !== "revealing" || !result) return;
    setRevealIndex(-1);
    let i = -1;
    const id = window.setInterval(() => {
      i += 1;
      setRevealIndex(i);
      if (i >= result.scores.length - 1) {
        window.clearInterval(id);
        window.setTimeout(() => setPhase("verdict"), 700);
      }
    }, reduce ? 120 : 650);
    return () => window.clearInterval(id);
  }, [phase, result, reduce]);

  const runScan = useCallback(async () => {
    setError(null);
    setLoading(true);
    setPhase("scanning");
    setResult(null);

    try {
      const res = await fetch("/api/meter/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data: unknown = await res.json();
      const record = data as { ok?: boolean; result?: MeterScanResult; error?: string };

      if (!res.ok || !record.ok || !record.result) {
        setPhase("idle");
        setError(record.error ?? "Scan mislukt. Probeer opnieuw.");
        return;
      }

      setResult(record.result);
      setPhase("guess");

      if (typeof window !== "undefined") {
        const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
        w.dataLayer = w.dataLayer ?? [];
        w.dataLayer.push({
          event: "meter_scan_complete",
          score: record.result.total,
          verdict: record.result.verdict,
          site: record.result.siteName,
        });
      }
    } catch {
      setPhase("idle");
      setError("Netwerkprobleem. Probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  function reset() {
    setPhase("idle");
    setResult(null);
    setError(null);
    setRevealIndex(-1);
    setScanLine(0);
  }

  function handleGuessSubmit() {
    setPhase("revealing");
  }

  const guessDelta =
    result && phase === "verdict"
      ? Math.abs(result.total - guess)
      : null;

  return (
    <div className="relative">
      <LivingCloudGrid />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C2410C]">
            <Gauge className="size-3.5" aria-hidden />
            De Meneer Meter
          </p>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl lg:text-6xl">
            Plak je URL.
            <span className="mt-1 block text-[#FF5722]">Ik geef één droog oordeel.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Geen generieke PageSpeed-clone. Vier assen, één eindcijfer, één zin waar je mee verder
            kunt. Gratis. Brutaal eerlijk.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <AnimatePresence mode="wait">
            {phase === "idle" || phase === "scanning" ? (
              <motion.div
                key="input"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-3xl border border-slate-200/80 bg-white/90 p-2 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)] backdrop-blur-md"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                  <label className="sr-only" htmlFor="meter-url">
                    Website URL
                  </label>
                  <input
                    id="meter-url"
                    type="url"
                    inputMode="url"
                    placeholder="jouwstudio.nl"
                    value={url}
                    disabled={phase === "scanning"}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && url.trim()) void runScan();
                    }}
                    className="min-w-0 flex-1 rounded-2xl border border-transparent bg-slate-50 px-5 py-4 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FF5722]/30 focus:bg-white"
                  />
                  <button
                    type="button"
                    disabled={!url.trim() || loading}
                    onClick={() => void runScan()}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white transition hover:bg-[#FF5722] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[160px]"
                  >
                    {phase === "scanning" ? "Scannen…" : "Start scan"}
                    <ArrowRight className="size-4" aria-hidden />
                  </button>
                </div>
                {error ? (
                  <p className="mt-3 px-3 text-sm font-semibold text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {phase === "scanning" ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-12 max-w-lg text-center"
          >
            <MeterDial value={scanPulse} size="hero" animate variant="light" />
            <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Meter loopt…
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeScanLine}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-3 text-lg font-bold text-slate-800"
              >
                {activeScanLine}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ) : null}

        {phase === "guess" && result ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-12 max-w-xl"
            aria-labelledby="meter-guess-heading"
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {result.siteName}
              </p>
              <h2
                id="meter-guess-heading"
                className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
              >
                Raad je score voordat ik hem laat zien.
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Design, vindbaarheid, conversie, snelheid. Eén getal. Geen peeking.
              </p>

              <div className="mt-8">
                <div className="flex items-end justify-between">
                  <span className="text-sm font-bold text-slate-500">Jouw gok</span>
                  <span className="font-black tabular-nums text-4xl text-[#FF5722]">
                    {guess}
                    <span className="text-lg text-slate-400">/100</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={guess}
                  onChange={(e) => setGuess(Number(e.target.value))}
                  className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-[#FF5722]"
                  aria-label="Raad je score"
                />
              </div>

              <button
                type="button"
                onClick={handleGuessSubmit}
                className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[#FF5722] px-6 py-4 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(255,87,34,0.45)] transition hover:bg-[#e64a19]"
              >
                Laat het oordeel zien
              </button>
            </div>
          </motion.section>
        ) : null}

        {(phase === "revealing" || phase === "verdict") && result ? (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start"
          >
            <div>
              <MeterAxisBars scores={result.scores} revealIndex={revealIndex} />
            </div>

            <div className="space-y-5 lg:sticky lg:top-24">
              <div className="rounded-3xl border border-slate-900 bg-slate-900 p-6 text-white shadow-2xl">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Eindstand
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <MeterDial
                    value={phase === "verdict" ? result.total : 0}
                    size="result"
                    animate={phase === "verdict"}
                    variant="dark"
                  />
                </div>
                <AnimatePresence>
                  {phase === "verdict" ? (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 120, damping: 16 }}
                    >
                      <p className="mt-2 text-center font-black tabular-nums text-6xl text-[#FF5722]">
                        {result.total}
                        <span className="text-2xl text-white/40">/100</span>
                      </p>
                      <p className="mt-2 text-center text-xl font-black uppercase tracking-wide">
                        {result.verdict}
                      </p>
                      {guessDelta !== null ? (
                        <p className="mt-3 text-center text-xs font-semibold text-white/60">
                          Jij zat {guessDelta === 0 ? "precies" : `${guessDelta} punten`}{" "}
                          {guessDelta === 0 ? "goed." : "naast."}
                        </p>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {phase === "verdict" ? (
                <GroeiscanMeneerCoach message={result.oneLiner} theme="light" />
              ) : null}

              {phase === "verdict" ? (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#FF5722] hover:text-[#FF5722]"
                >
                  <RotateCcw className="size-4" aria-hidden />
                  Nog een URL scannen
                </button>
              ) : null}
            </div>
          </motion.section>
        ) : null}

        {phase === "verdict" && result ? (
          <div className="mx-auto mt-12 max-w-2xl">
            <MeterLeadCapture result={result} userGuess={guess} />
          </div>
        ) : null}

        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-dashed border-slate-200 bg-white/60 p-5 text-center backdrop-blur-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Instagram tip
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Deel je score in je story en tag{" "}
            <span className="font-bold text-slate-900">@meneermarketing</span>. Elke scan is
            potentiële content. Jij levert de URL, ik het oordeel.
          </p>
        </div>
      </div>
    </div>
  );
}
