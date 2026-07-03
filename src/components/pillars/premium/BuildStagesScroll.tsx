"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Code2, Compass, PenTool, Rocket } from "lucide-react";
import { useState } from "react";

export interface BuildStage {
  title: string;
  body: string;
}

const STAGE_ICONS = [Compass, PenTool, Code2, Rocket] as const;
const STAGE_TAGS = ["Verkennen", "Tekenen", "Bouwen", "Lanceren"] as const;

/* ------------------------------------------------------------------ */
/* Stadium-visuals in het browservenster                               */
/* ------------------------------------------------------------------ */

function StageDiscovery() {
  return (
    <div className="space-y-3 p-5">
      {["Wie is je klant?", "Wat moet de site opleveren?", "Welke systemen praten mee?"].map(
        (q, i) => (
          <motion.div
            key={q}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 * i, duration: 0.35 }}
            className="flex items-center gap-2.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/80 px-3.5 py-2.5"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-black text-slate-500">
              ?
            </span>
            <span className="text-xs font-bold text-slate-600">{q}</span>
          </motion.div>
        ),
      )}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="pt-1 text-center font-mono text-[10px] tracking-wider text-slate-400"
      >
        notities.md · wordt aangevuld
      </motion.p>
    </div>
  );
}

function StageWireframe() {
  const blocks = [
    "h-8 w-full",
    "h-14 w-3/4",
    "h-14 w-full",
    "h-10 w-5/6",
  ];
  return (
    <div className="space-y-2.5 p-5">
      {blocks.map((cls, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * i, type: "spring", stiffness: 260, damping: 20 }}
          className={`block rounded-lg border-2 border-dashed border-slate-300 bg-white ${cls}`}
          aria-hidden
        />
      ))}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="pt-1 text-center font-mono text-[10px] tracking-wider text-slate-400"
      >
        wireframe · structuur vóór pixels
      </motion.p>
    </div>
  );
}

function StageBuild() {
  return (
    <div className="p-5">
      <div className="space-y-2.5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <span className="size-5 rounded-md bg-slate-900" aria-hidden />
          <span className="h-2 w-10 rounded-full bg-slate-200" aria-hidden />
          <span className="ml-auto h-5 w-14 rounded-full bg-[#FF5722]" aria-hidden />
        </motion.div>
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="block h-3.5 w-3/4 rounded-full bg-slate-900"
          aria-hidden
        />
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="block h-2.5 w-1/2 rounded-full bg-slate-300"
          aria-hidden
        />
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.28 + 0.09 * i, type: "spring", stiffness: 280, damping: 18 }}
              className="block h-12 rounded-lg bg-gradient-to-br from-sky-100 to-slate-100"
              aria-hidden
            />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span>build in progress</span>
          <span className="text-[#FF5722]">78%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.span
            initial={{ width: "12%" }}
            animate={{ width: "78%" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
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
      {/* Confetti-stipjes */}
      {!reduce
        ? [
            { x: "12%", y: "8%", c: "#FF5722", d: 0.15 },
            { x: "82%", y: "12%", c: "#38BDF8", d: 0.25 },
            { x: "70%", y: "4%", c: "#FBBF24", d: 0.35 },
            { x: "30%", y: "3%", c: "#34D399", d: 0.45 },
          ].map((p) => (
            <motion.span
              key={p.x}
              initial={{ opacity: 0, y: -6, scale: 0 }}
              animate={{ opacity: [0, 1, 0], y: 18, scale: 1 }}
              transition={{ duration: 1.4, delay: p.d, ease: "easeOut" }}
              className="pointer-events-none absolute size-1.5 rounded-full"
              style={{ left: p.x, top: p.y, backgroundColor: p.c }}
              aria-hidden
            />
          ))
        : null}

      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="size-5 rounded-md bg-slate-900" aria-hidden />
          <span className="h-2 w-10 rounded-full bg-slate-200" aria-hidden />
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
            className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            Live
          </motion.span>
        </div>
        <span className="block h-3.5 w-3/4 rounded-full bg-slate-900" aria-hidden />
        <span className="block h-2.5 w-1/2 rounded-full bg-slate-300" aria-hidden />
        <span className="inline-block h-6 w-20 rounded-full bg-[#FF5722]" aria-hidden />
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-12 rounded-lg bg-gradient-to-br from-sky-100 to-slate-100" aria-hidden />
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { label: "LCP", value: "0,8s", tone: "text-emerald-500" },
          { label: "Beheer", value: "Zelf", tone: "text-[#FF5722]" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + 0.12 * i }}
            className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2"
          >
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              {m.label}
            </p>
            <p className={`text-sm font-extrabold ${m.tone}`}>{m.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* De scrollytelling-sectie                                            */
/* ------------------------------------------------------------------ */

interface BuildStagesScrollProps {
  title: string;
  stages: BuildStage[];
}

/**
 * Het bouwtraject als scroll-ervaring: links de fases, rechts een sticky
 * browservenster dat per fase meebouwt van blauwdruk naar live site.
 */
export function BuildStagesScroll({ title, stages }: BuildStagesScrollProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

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
          Scroll mee door het traject. Rechts zie je de site meegroeien van
          blauwdruk naar live.
        </p>

        <div className="mt-12 lg:grid lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          {/* De fases */}
          <ol className="relative space-y-6 lg:space-y-24">
            <span
              className="absolute bottom-8 left-[26px] top-8 hidden w-px bg-slate-200 lg:block"
              aria-hidden
            />
            {stages.map((stage, index) => {
              const Icon = STAGE_ICONS[index % STAGE_ICONS.length];
              const isActive = active === index;
              return (
                <motion.li
                  key={stage.title}
                  onViewportEnter={() => setActive(index)}
                  viewport={{ margin: "-46% 0px -46% 0px" }}
                  className="relative"
                >
                  <div
                    className={`relative flex gap-5 rounded-3xl border p-6 transition-all duration-500 ${
                      isActive
                        ? "border-[#FF5722]/30 bg-white shadow-[0_24px_48px_-28px_rgba(255,87,34,0.4)]"
                        : "border-slate-200 bg-white lg:border-transparent lg:bg-transparent lg:shadow-none"
                    }`}
                  >
                    <span
                      className={`relative z-10 flex size-[52px] shrink-0 items-center justify-center rounded-2xl border transition-all duration-500 ${
                        isActive
                          ? "border-[#FF5722] bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30"
                          : "border-slate-200 bg-white text-slate-500"
                      }`}
                      aria-hidden
                    >
                      <Icon className="size-6" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${
                          isActive ? "text-[#FF5722]" : "text-slate-400"
                        }`}
                      >
                        {STAGE_TAGS[index % STAGE_TAGS.length]}
                      </p>
                      <h3 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">
                        {stage.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                        {stage.body}
                      </p>
                    </div>
                  </div>

                  {/* Mobiel: visual direct onder de actieve fase */}
                  <div className="mt-3 lg:hidden">
                    {isActive ? (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
                        <BrowserChrome tag={STAGE_TAGS[index % STAGE_TAGS.length]} />
                        {visuals[index]}
                      </div>
                    ) : null}
                  </div>
                </motion.li>
              );
            })}
          </ol>

          {/* Sticky meebouwend venster (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_32px_64px_-28px_rgba(15,23,42,0.25)]">
                <BrowserChrome tag={STAGE_TAGS[active % STAGE_TAGS.length]} />
                <div className="min-h-[300px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={reduce ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {visuals[active]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Fase-indicator */}
              <div className="mt-5 flex items-center justify-center gap-2">
                {stages.map((stage, i) => (
                  <span
                    key={stage.title}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === active ? "w-8 bg-[#FF5722]" : "w-3 bg-slate-200"
                    }`}
                    aria-hidden
                  />
                ))}
              </div>
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
