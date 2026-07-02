"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

interface Principle {
  title: string;
  body: string;
}

/* ------------------------------------------------------------------ */
/* Scène 1: geluidsgolven die veranderen in een skyline               */
/* ------------------------------------------------------------------ */

const BARS = [
  { idle: [26, 44, 26], sky: 20, duration: 1.1 },
  { idle: [38, 20, 38], sky: 28, duration: 0.9 },
  { idle: [22, 48, 22], sky: 36, duration: 1.3 },
  { idle: [46, 24, 46], sky: 44, duration: 1.0 },
  { idle: [30, 52, 30], sky: 52, duration: 1.2 },
  { idle: [40, 22, 40], sky: 61, duration: 0.85 },
  { idle: [24, 46, 24], sky: 72, duration: 1.15 },
] as const;

function ListenScene({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const resolved = active || !!reduce;

  return (
    <div className="relative flex h-24 items-end justify-center gap-2 overflow-hidden">
      {BARS.map((bar, i) => (
        <motion.span
          key={i}
          className={`w-3.5 rounded-t-md sm:w-4 ${
            resolved && i >= BARS.length - 2
              ? "bg-[#FF5722]"
              : resolved
                ? "bg-slate-900"
                : "bg-slate-300"
          }`}
          animate={
            resolved
              ? { height: bar.sky }
              : { height: [...bar.idle] }
          }
          transition={
            resolved
              ? { type: "spring", stiffness: 240, damping: 17, delay: i * 0.045 }
              : {
                  duration: bar.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          style={{ height: bar.idle[0], willChange: "height" }}
        />
      ))}

      {/* Vlaggetje op het hoogste gebouw */}
      <AnimatePresence>
        {resolved ? (
          <motion.span
            initial={{ opacity: 0, scale: 0, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 15, delay: 0.4 }}
            className="absolute right-[calc(50%-3.65rem)] top-1 sm:right-[calc(50%-4rem)]"
            aria-hidden
          >
            <svg viewBox="0 0 16 16" className="size-4">
              <line x1="3" y1="1" x2="3" y2="15" stroke="#0F172A" strokeWidth="1.6" />
              <path d="M4 2h9l-2.6 2.5L13 7H4z" fill="#FF5722" />
            </svg>
          </motion.span>
        ) : null}
      </AnimatePresence>

      <span
        className="absolute inset-x-4 bottom-0 h-px bg-slate-200"
        aria-hidden
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scène 2: estafette van bureaus smelt samen tot één Meneer          */
/* ------------------------------------------------------------------ */

const CHIPS = [
  { label: "Web", delay: 0.16 },
  { label: "Marketing", delay: 0.25 },
  { label: "Techniek", delay: 0.34 },
] as const;

function OnePointScene({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const resolved = active || !!reduce;

  return (
    <div className="relative flex h-24 items-center justify-center">
      <AnimatePresence mode="wait">
        {!resolved ? (
          <motion.div
            key="relay"
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            className="relative flex w-full max-w-[220px] items-center justify-between px-1"
          >
            <span
              className="absolute inset-x-3 top-1/2 border-t-2 border-dashed border-slate-300"
              aria-hidden
            />
            {/* Het stokje dat wordt doorgegeven */}
            <motion.span
              className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-[#FF5722]"
              animate={{ left: ["6%", "88%"] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "mirror",
              }}
              aria-hidden
            />
            {["A", "B", "C", "D"].map((letter, i) => (
              <span
                key={letter}
                className="relative flex size-9 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-xs font-extrabold text-slate-400"
                style={{ zIndex: 1 }}
              >
                {letter}
                {i === 3 ? (
                  <span className="absolute -bottom-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-slate-200 text-[9px] font-black text-slate-500">
                    ?
                  </span>
                ) : null}
              </span>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="meneer"
            initial={reduce ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="flex w-full max-w-[220px] flex-col items-center gap-1.5 px-1"
          >
            <div className="flex w-full items-center justify-between gap-1.5">
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 16,
                  delay: CHIPS[0].delay,
                }}
                className="inline-block shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm"
              >
                {CHIPS[0].label}
              </motion.span>
              <InteractiveLogo className="h-14 w-14 shrink-0" />
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 16,
                  delay: CHIPS[1].delay,
                }}
                className="inline-block shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm"
              >
                {CHIPS[1].label}
              </motion.span>
            </div>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 16,
                delay: CHIPS[2].delay,
              }}
              className="inline-block whitespace-nowrap rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm"
            >
              {CHIPS[2].label}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scène 3: jargon klapt om naar gewoon Nederlands                    */
/* ------------------------------------------------------------------ */

const TRANSLATIONS = [
  { jargon: "LCP 2,4s → 0,8s", plain: "je site laadt snel" },
  { jargon: "CTR +38%", plain: "meer mensen klikken" },
  { jargon: "canonical tags", plain: "geen dubbele pagina's" },
] as const;

function LanguageScene({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const [cycleIndex, setCycleIndex] = useState(-1);

  useEffect(() => {
    if (active || reduce) return;
    const timer = window.setInterval(() => {
      setCycleIndex((i) => (i + 1) % (TRANSLATIONS.length + 1));
    }, 1500);
    return () => window.clearInterval(timer);
  }, [active, reduce]);

  return (
    <div className="flex h-24 flex-col items-center justify-center gap-1.5">
      {TRANSLATIONS.map((row, i) => {
        const flipped =
          active || !!reduce || (cycleIndex >= 0 && i <= cycleIndex - 1);
        return (
          <div key={row.jargon} className="h-7 w-full max-w-[210px] [perspective:600px]">
            <motion.div
              animate={{ rotateX: flipped ? 180 : 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 260, damping: 22, delay: active ? i * 0.07 : 0 }
              }
              className="relative size-full [transform-style:preserve-3d]"
            >
              <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-900 font-mono text-[11px] font-semibold tracking-tight text-emerald-300 [backface-visibility:hidden]">
                {row.jargon}
              </span>
              <span className="absolute inset-0 flex items-center justify-center rounded-lg border border-[#FF5722]/30 bg-[#FF5722]/10 text-[12px] font-bold text-slate-900 [backface-visibility:hidden] [transform:rotateX(180deg)]">
                {row.plain}
              </span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* De kaarten zelf                                                     */
/* ------------------------------------------------------------------ */

const SCENES = [ListenScene, OnePointScene, LanguageScene] as const;

const SCENE_HINTS = [
  "Beweeg: luisteren wordt bouwen",
  "Beweeg: de keten verdwijnt",
  "Beweeg: jargon vertaalt zichzelf",
] as const;

function PrincipleCard({
  principle,
  index,
}: {
  principle: Principle;
  index: number;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const Scene = SCENES[index % SCENES.length];

  return (
    <motion.li
      initial={reduce ? undefined : { opacity: 0, y: 26, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 200, damping: 21, delay: index * 0.08 }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive((a) => !a)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-[#FF5722]/35 hover:shadow-[0_24px_48px_-28px_rgba(255,87,34,0.5)]"
    >
      {/* De scène */}
      <div className="border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white px-5 pb-2.5 pt-5">
        <Scene active={active} />
        <p
          className="mt-3 truncate text-center text-[9px] font-bold uppercase tracking-[0.14em] text-slate-300 transition-opacity duration-300 group-hover:opacity-0"
          aria-hidden
        >
          {SCENE_HINTS[index % SCENE_HINTS.length]}
        </p>
      </div>

      {/* De tekst */}
      <div className="flex flex-1 flex-col p-6 pt-5">
        <h3 className="text-base font-extrabold tracking-tight text-slate-900">
          {principle.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
          {principle.body}
        </p>
      </div>
    </motion.li>
  );
}

/**
 * Drie werkprincipes als interactieve mini-scènes: geluidsgolven worden een
 * skyline, een estafette smelt samen tot Meneer, en jargon klapt om naar
 * gewoon Nederlands. Hover op desktop, tik op mobiel.
 */
export function PrincipleScenes({ principles }: { principles: Principle[] }) {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-3 sm:items-stretch">
      {principles.map((principle, index) => (
        <PrincipleCard
          key={principle.title}
          principle={principle}
          index={index}
        />
      ))}
    </ul>
  );
}
