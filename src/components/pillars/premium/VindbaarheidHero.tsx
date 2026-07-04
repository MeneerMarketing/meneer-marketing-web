"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { GoogleWordmark } from "@/components/pillars/premium/GoogleWordmark";

const QUERIES = [
  "beste marketing bureau nederland",
  "shopify expert die ook seo doet",
  "vindbaar worden in chatgpt",
  "wie bouwt websites from scratch",
] as const;

interface SerpResult {
  url: string;
  title: string;
  snippet: string;
  isYou?: boolean;
}

const SERP_SETS: SerpResult[][] = [
  [
    { url: "concurrent-a.nl", title: "Marketing bureau Amsterdam", snippet: "Full-service agency sinds 2012..." },
    { url: "concurrent-b.nl", title: "Online marketing totaalpakket", snippet: "Ads, social en een beetje SEO..." },
    { url: "meneermarketing.nl", title: "MeneerMarketing · SEO, bouw & groei", snippet: "Websites from scratch, vindbaar in Google én AI. Eén lijn.", isYou: true },
  ],
  [
    { url: "template-shop.nl", title: "Shopify themes kopen", snippet: "Kies uit 200+ templates..." },
    { url: "meneermarketing.nl", title: "Shopify from scratch · MeneerMarketing", snippet: "Custom themes, geen templates. Shopify-expert.", isYou: true },
    { url: "concurrent-c.nl", title: "Webshop laten bouwen", snippet: "Snel online met ons pakket..." },
  ],
  [
    { url: "meneermarketing.nl", title: "Vindbaar in AI-zoek · MeneerMarketing", snippet: "Genoemd worden in ChatGPT, Gemini en Claude. Wij regelen het.", isYou: true },
    { url: "seo-blog.nl", title: "AI SEO tips 2026", snippet: "10 tricks die je concurrent al kent..." },
    { url: "concurrent-d.nl", title: "ChatGPT optimalisatie", snippet: "Wij schrijven AI-content..." },
  ],
  [
    { url: "meneermarketing.nl", title: "Websites from scratch · MeneerMarketing", snippet: "Geen page builders. Custom build, CWV groen.", isYou: true },
    { url: "wordpress-host.nl", title: "Website in 1 dag", snippet: "Template + plugins = klaar!" },
    { url: "concurrent-e.nl", title: "Goedkope website", snippet: "Vanaf € 299 all-in..." },
  ],
];

/**
 * Hero voor Vindbaarheid: interactieve Google-zoekbalk met typewriter,
 * vergrootglas dat meebeweegt en SERP waar jouw site naar #1 springt.
 */
export function VindbaarheidHero() {
  const reduce = useReducedMotion();
  const [queryIndex, setQueryIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "results" | "climb">("typing");
  const [lensPos, setLensPos] = useState({ x: 50, y: 30 });
  const containerRef = useRef<HTMLDivElement>(null);
  const userTouched = useRef(false);

  const query = QUERIES[queryIndex];
  const results = SERP_SETS[queryIndex];

  const runDemo = useCallback(
    (index: number) => {
      const q = QUERIES[index];
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
    [reduce],
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
      const next = (queryIndex + 1) % QUERIES.length;
      runDemo(next);
    }, 3200);
    return () => window.clearTimeout(t);
  }, [phase, queryIndex, runDemo]);

  function handleSearchClick() {
    userTouched.current = true;
    const next = (queryIndex + 1) % QUERIES.length;
    runDemo(next);
  }

  function onMove(e: ReactMouseEvent<HTMLDivElement>) {
    if (!containerRef.current || reduce) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({
      x: Math.min(88, Math.max(12, x)),
      y: Math.min(78, Math.max(18, y)),
    });
  }

  const sortedResults =
    phase === "climb"
      ? [...results].sort((a, b) => (a.isYou ? -1 : b.isYou ? 1 : 0))
      : results;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[420px] select-none"
      onMouseMove={onMove}
    >
      <div
        className="pointer-events-none absolute -right-6 top-0 size-36 rounded-full bg-sky-200/25 blur-3xl"
        aria-hidden
      />

      {/* Vergrootglas dat meebeweegt */}
      <motion.div
        className="pointer-events-none absolute z-20"
        animate={{ left: `${lensPos.x}%`, top: `${lensPos.y}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        style={{ x: "-50%", y: "-50%" }}
        aria-hidden
      >
        <div className="relative">
          <div className="flex size-14 items-center justify-center rounded-full border-2 border-white/80 bg-white/30 shadow-[0_8px_32px_rgba(15,23,42,0.15)] backdrop-blur-sm">
            <Search className="size-6 text-[#FF5722]" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white bg-[#FF5722]" />
        </div>
      </motion.div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_56px_-24px_rgba(15,23,42,0.28)]">
        {/* Google-achtige header */}
        <div className="border-b border-slate-100 px-5 pt-5 pb-4">
          <div className="flex items-center justify-center gap-0.5">
            <GoogleWordmark />
            <span className="text-sm font-normal text-slate-400">.nl</span>
          </div>

          <button
            type="button"
            onClick={handleSearchClick}
            className="group mt-4 flex w-full items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 hover:shadow-md"
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
            Klik de zoekbalk voor de volgende query
          </p>
        </div>

        {/* SERP */}
        <div className="min-h-[220px] space-y-3 p-4">
          <AnimatePresence mode="wait">
            {phase === "typing" ? (
              <motion.p
                key="wait"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-[180px] items-center justify-center text-sm text-slate-400"
              >
                Even typen...
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
                {sortedResults.map((result, i) => (
                  <motion.div
                    key={result.url}
                    layout
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: result.isYou && phase === "climb" ? 1.02 : 1,
                    }}
                    transition={{
                      layout: { type: "spring", stiffness: 280, damping: 22 },
                      delay: result.isYou && phase === "climb" ? 0.15 : 0.05 * i,
                    }}
                    className={`rounded-xl px-3 py-2.5 transition-colors ${
                      result.isYou && phase === "climb"
                        ? "border border-[#FF5722]/30 bg-[#FF5722]/5"
                        : "border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-emerald-700">{result.url}</p>
                      {result.isYou && phase === "climb" ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="rounded-full bg-[#FF5722] px-1.5 py-0.5 text-[8px] font-bold text-white"
                        >
                          Jij · #{i + 1}
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
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-600">
                      {result.snippet}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
