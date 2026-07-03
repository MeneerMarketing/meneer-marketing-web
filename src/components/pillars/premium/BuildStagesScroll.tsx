"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Code2, Compass, PenTool, Rocket } from "lucide-react";
import { useCallback, useState } from "react";

export interface BuildStage {
  title: string;
  body: string;
}

const STAGE_ICONS = [Compass, PenTool, Code2, Rocket] as const;
const STAGE_TAGS = ["Verkennen", "Tekenen", "Bouwen", "Lanceren"] as const;

function StageDiscovery() {
  return (
    <div className="space-y-2.5 p-5">
      {["Wie is je klant?", "Wat moet de site opleveren?", "Welke systemen praten mee?"].map(
        (q, i) => (
          <motion.div
            key={q}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.3 }}
            className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/80 px-3 py-2"
          >
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[9px] font-black text-slate-500">
              ?
            </span>
            <span className="text-[11px] font-bold text-slate-600">{q}</span>
          </motion.div>
        ),
      )}
    </div>
  );
}

function StageWireframe() {
  return (
    <div className="space-y-2 p-5">
      {["h-7 w-full", "h-12 w-3/4", "h-12 w-full", "h-8 w-5/6"].map((cls, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 * i, type: "spring", stiffness: 260, damping: 20 }}
          className={`block rounded-lg border-2 border-dashed border-slate-300 bg-white ${cls}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

function StageBuild() {
  return (
    <div className="p-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="size-4 rounded-md bg-slate-900" aria-hidden />
          <span className="h-1.5 w-8 rounded-full bg-slate-200" aria-hidden />
          <span className="ml-auto h-4 w-12 rounded-full bg-[#FF5722]" aria-hidden />
        </div>
        <span className="block h-3 w-3/4 rounded-full bg-slate-900" aria-hidden />
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-10 rounded-lg bg-gradient-to-br from-sky-100 to-slate-100"
              aria-hidden
            />
          ))}
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between font-mono text-[9px] text-slate-400">
          <span>build</span>
          <span className="text-[#FF5722]">78%</span>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-100">
          <motion.span
            initial={{ width: "12%" }}
            animate={{ width: "78%" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="block h-full rounded-full bg-gradient-to-r from-orange-300 to-[#FF5722]"
          />
        </div>
      </div>
    </div>
  );
}

function StageLaunch({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative p-5">
      {!reduce
        ? [
            { x: "12%", y: "8%", c: "#FF5722" },
            { x: "82%", y: "12%", c: "#38BDF8" },
          ].map((p) => (
            <motion.span
              key={p.x}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: [0, 1, 0], y: 14 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="pointer-events-none absolute size-1.5 rounded-full"
              style={{ left: p.x, top: p.y, backgroundColor: p.c }}
              aria-hidden
            />
          ))
        : null}
      <div className="flex items-center gap-2">
        <span className="size-4 rounded-md bg-slate-900" aria-hidden />
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600"
        >
          Live
        </motion.span>
      </div>
      <span className="mt-2 block h-3 w-3/4 rounded-full bg-slate-900" aria-hidden />
      <span className="mt-2 inline-block h-5 w-16 rounded-full bg-[#FF5722]" aria-hidden />
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          { label: "LCP", value: "0,8s", tone: "text-emerald-500" },
          { label: "Beheer", value: "Zelf", tone: "text-[#FF5722]" },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-2"
          >
            <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
              {m.label}
            </p>
            <p className={`text-sm font-extrabold ${m.tone}`}>{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BuildStagesScrollProps {
  title: string;
  stages: BuildStage[];
}

/**
 * Bouwtraject met klikbare fases links en sticky preview rechts.
 * Geen scroll-triggered hover meer: je kiest zelf de fase.
 */
export function BuildStagesScroll({ title, stages }: BuildStagesScrollProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const selectStage = useCallback((index: number) => {
    setActive(index);
  }, []);

  const visuals = [
    <StageDiscovery key="discovery" />,
    <StageWireframe key="wireframe" />,
    <StageBuild key="build" />,
    <StageLaunch key="launch" reduce={!!reduce} />,
  ];

  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="stages-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2
          id="stages-heading"
          className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">
          Klik een fase en zie rechts hoe je site meegroeit van blauwdruk naar live.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          {/* Fase-selectie */}
          <div className="flex flex-col gap-2">
            {stages.map((stage, index) => {
              const Icon = STAGE_ICONS[index % STAGE_ICONS.length];
              const isActive = active === index;
              return (
                <button
                  key={stage.title}
                  type="button"
                  onClick={() => selectStage(index)}
                  aria-pressed={isActive}
                  className={`flex flex-1 items-start gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-300 sm:px-5 sm:py-4 ${
                    isActive
                      ? "border-[#FF5722]/40 bg-[#FF5722]/[0.04] shadow-[0_12px_32px_-20px_rgba(255,87,34,0.45)]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80"
                  }`}
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                      isActive
                        ? "border-[#FF5722] bg-[#FF5722] text-white"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                    aria-hidden
                  >
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <p
                      className={`text-[10px] font-black uppercase tracking-[0.16em] ${
                        isActive ? "text-[#FF5722]" : "text-slate-400"
                      }`}
                    >
                      {STAGE_TAGS[index % STAGE_TAGS.length]}
                    </p>
                    <h3 className="mt-0.5 text-base font-extrabold tracking-tight text-slate-900">
                      {stage.title}
                    </h3>
                    <p
                      className={`mt-1 text-sm leading-snug text-slate-600 transition-all duration-300 ${
                        isActive ? "line-clamp-none" : "line-clamp-2"
                      }`}
                    >
                      {stage.body}
                    </p>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sticky preview */}
          <div className="flex flex-col">
            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_48px_-28px_rgba(15,23,42,0.2)] lg:sticky lg:top-28">
              <BrowserChrome tag={STAGE_TAGS[active % STAGE_TAGS.length]} />
              <div className="flex min-h-[260px] flex-1 flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {visuals[active]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {stages.map((stage, i) => (
                <button
                  key={stage.title}
                  type="button"
                  onClick={() => selectStage(i)}
                  aria-label={stage.title}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? "w-8 bg-[#FF5722]" : "w-3 bg-slate-200 hover:bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrowserChrome({ tag }: { tag: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
      <span className="size-2.5 rounded-full bg-[#FF5722]/80" aria-hidden />
      <span className="size-2.5 rounded-full bg-amber-300" aria-hidden />
      <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
      <span className="ml-3 flex-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-400">
        jouw-site.nl
      </span>
      <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
        {tag}
      </span>
    </div>
  );
}
