"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SerpHeroConfig, SerpHeroResult } from "@/data/serp-hero-configs";

interface GoogleSerpInteractiveHeroProps {
  config: SerpHeroConfig;
  className?: string;
}

/**
 * Interactieve Google SERP-kaart: typewriter, klikbare zoekbalk,
 * resultaten (organisch of gesponsord) waarbij jij naar #1 klimt.
 */
export function GoogleSerpInteractiveHero({
  config,
  className = "",
}: GoogleSerpInteractiveHeroProps) {
  const reduce = useReducedMotion();
  const [queryIndex, setQueryIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "results" | "climb">("typing");
  const userTouched = useRef(false);

  const query = config.queries[queryIndex]!;
  const results = config.serpSets[queryIndex]!;

  const runDemo = useCallback(
    (index: number) => {
      const q = config.queries[index]!;
      setQueryIndex(index);
      setPhase("typing");
      setTyped("");

      if (reduce) {
        setTyped(q);
        setPhase("climb");
        return;
      }

      let char = 0;
      const typeTimer = window.setInterval(() => {
        char += 1;
        setTyped(q.slice(0, char));
        if (char >= q.length) {
          window.clearInterval(typeTimer);
          window.setTimeout(() => setPhase("results"), 400);
          window.setTimeout(() => setPhase("climb"), 1100);
        }
      }, 38);

      return () => window.clearInterval(typeTimer);
    },
    [config.queries, reduce],
  );

  useEffect(() => {
    if (userTouched.current) return;
    const cleanup = runDemo(0);
    return cleanup;
  }, [runDemo]);

  useEffect(() => {
    if (userTouched.current || phase !== "climb") return;
    const t = window.setTimeout(() => {
      if (userTouched.current) return;
      const next = (queryIndex + 1) % config.queries.length;
      runDemo(next);
    }, 3200);
    return () => window.clearTimeout(t);
  }, [phase, queryIndex, runDemo, config.queries.length]);

  function handleSearchClick() {
    userTouched.current = true;
    const next = (queryIndex + 1) % config.queries.length;
    runDemo(next);
  }

  const sortedResults =
    phase === "climb"
      ? [...results].sort((a, b) => (a.isYou ? -1 : b.isYou ? 1 : 0))
      : results;

  const youBadge =
    config.variant === "ads" ? "Jij · Top ad" : "Jij · #1";

  return (
    <div className={`relative mx-auto w-full max-w-[420px] select-none ${className}`}>
      <div
        className="pointer-events-none absolute -right-6 top-0 size-36 rounded-full bg-sky-200/25 blur-3xl"
        aria-hidden
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_56px_-24px_rgba(15,23,42,0.28)]">
        <div className="border-b border-slate-100 px-5 pt-5 pb-4">
          <div className="flex items-center justify-center">
            <img
              src="/images/google-logo.png"
              alt="Google"
              width={110}
              height={36}
              className="h-8 w-auto bg-transparent"
              draggable={false}
            />
          </div>

          <button
            type="button"
            onClick={handleSearchClick}
            className="group mt-4 flex w-full cursor-pointer items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            aria-label="Volgende zoekopdracht tonen"
          >
            <Search className="size-4 shrink-0 text-slate-400" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-left text-sm text-slate-700">
              {typed}
              {phase === "typing" && !reduce ? (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="ml-px inline-block h-4 w-px bg-slate-800 align-middle"
                  aria-hidden
                />
              ) : null}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 transition group-hover:bg-[#FF5722]/10 group-hover:text-[#FF5722]">
              Zoek
            </span>
          </button>

          <p className="mt-2 text-center text-[10px] text-slate-400">
            {config.clickHint}
          </p>
        </div>

        <div className="min-h-[240px] space-y-3 p-4">
          <AnimatePresence mode="wait">
            {phase === "typing" ? (
              <motion.p
                key="wait"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-[190px] items-center justify-center text-sm text-slate-400"
              >
                {config.waitingText}
              </motion.p>
            ) : (
              <motion.div
                key={query}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <p className="text-[10px] text-slate-400">
                  Ongeveer 2.400.000 resultaten ({(0.42).toLocaleString("nl-NL")} sec)
                </p>

                {config.variant === "ads" ? (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Advertenties
                  </p>
                ) : null}

                {sortedResults.map((result, i) => (
                  <SerpResultCard
                    key={`${query}-${result.url}`}
                    result={result}
                    index={i}
                    phase={phase}
                    reduce={!!reduce}
                    youBadge={youBadge}
                    variant={config.variant}
                  />
                ))}

                {config.footerMetric && phase === "climb" ? (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-center"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {config.footerMetric.label}
                    </p>
                    <p className="text-lg font-extrabold text-sky-600">
                      {config.footerMetric.after}
                    </p>
                  </motion.div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SerpResultCard({
  result,
  index,
  phase,
  reduce,
  youBadge,
  variant,
}: {
  result: SerpHeroResult;
  index: number;
  phase: "typing" | "results" | "climb";
  reduce: boolean;
  youBadge: string;
  variant: "organic" | "ads";
}) {
  const isHighlighted = result.isYou && phase === "climb";

  return (
    <motion.div
      layout
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isHighlighted ? 1.02 : 1,
      }}
      transition={{
        layout: { type: "spring", stiffness: 280, damping: 22 },
        delay: isHighlighted ? 0.15 : 0.05 * index,
      }}
      className={`rounded-xl px-3 py-2.5 transition-colors ${
        isHighlighted
          ? "border border-[#FF5722]/30 bg-[#FF5722]/5"
          : "border border-transparent"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {variant === "ads" && result.isAd ? (
          <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
            Gesponsord
          </span>
        ) : null}
        <p className="text-[10px] text-emerald-700">{result.url}</p>
        {isHighlighted ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="rounded-full bg-[#FF5722] px-1.5 py-0.5 text-[8px] font-bold text-white"
          >
            {youBadge}
          </motion.span>
        ) : null}
      </div>
      <p
        className={`mt-0.5 text-sm font-medium ${
          result.isYou ? "text-[#1a0dab]" : "text-[#1a0dab]/80"
        }`}
      >
        {result.title}
      </p>
      <p className="mt-0.5 line-clamp-1 text-xs text-slate-600">{result.snippet}</p>
    </motion.div>
  );
}
