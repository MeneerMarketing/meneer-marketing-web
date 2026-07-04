"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Eén verhaal: product-PDP, cursor naar winkelwagenknop, klik, bevestiging. */
type StoryPhase =
  | "blank"
  | "reveal"
  | "idle"
  | "approach"
  | "hover"
  | "press"
  | "success"
  | "reset";

const PHASE_MS: Record<StoryPhase, number> = {
  blank: 400,
  reveal: 1300,
  idle: 800,
  approach: 1000,
  hover: 780,
  press: 220,
  success: 1600,
  reset: 450,
};

const PHASE_ORDER: StoryPhase[] = [
  "blank",
  "reveal",
  "idle",
  "approach",
  "hover",
  "press",
  "success",
  "reset",
];

/** Cursor t.o.v. contentblok (320×~300px). */
const CURSOR = {
  start: { x: 28, y: 268 },
  button: { x: 148, y: 248 },
} as const;

function nextPhase(current: StoryPhase): StoryPhase {
  const i = PHASE_ORDER.indexOf(current);
  return PHASE_ORDER[(i + 1) % PHASE_ORDER.length];
}

function revealTransition(phase: StoryPhase, index: number) {
  return {
    duration: 0.45,
    delay: phase === "reveal" ? 0.08 + index * 0.09 : 0,
    ease: EASE,
  };
}

/**
 * "De klik die converteert": mini productpagina waar de
 * winkelwagenknop het motion-verhaal vertelt.
 */
export function HeroMotionWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.5);
  const [phase, setPhase] = useState<StoryPhase>(reduce ? "success" : "blank");

  useEffect(() => {
    if (reduce) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = (current: StoryPhase) => {
      if (cancelled) return;
      const upcoming = nextPhase(current);
      timer = setTimeout(() => {
        if (cancelled) return;
        setPhase(upcoming);
        tick(upcoming);
      }, PHASE_MS[current]);
    };

    tick("blank");
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduce]);

  const visible = phase !== "blank" && phase !== "reset";
  const cursorVisible = phase === "approach" || phase === "hover" || phase === "press";
  const cursorAtButton =
    phase === "hover" || phase === "press" || phase === "success";
  const isHover = phase === "hover" || phase === "press";
  const isPress = phase === "press";
  const isSuccess = phase === "success";

  const cursorX = cursorAtButton ? CURSOR.button.x : CURSOR.start.x;
  const cursorY = cursorAtButton ? CURSOR.button.y : CURSOR.start.y;

  const fadeIn = (delayIndex: number) => ({
    opacity: visible || isSuccess ? 1 : 0,
    y: visible || isSuccess ? 0 : 12,
  });

  return (
    <div
      className="relative mx-auto flex h-[440px] w-full max-w-[440px] flex-col items-center justify-center [perspective:1500px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="flex w-full max-w-[320px] flex-col items-center"
      >
        <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          De klik die converteert
        </p>

        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_48px_-20px_rgba(15,23,42,0.22)]"
          style={{ transform: "translateZ(28px)" }}
        >
          <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50/90 px-3 py-2.5">
            <span className="size-2 rounded-full bg-[#FF5722]/80" aria-hidden />
            <span className="size-2 rounded-full bg-amber-300" aria-hidden />
            <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
            <span className="ml-2 h-1.5 flex-1 max-w-[88px] rounded-full bg-slate-200" aria-hidden />
          </div>

          <div className="relative min-h-[300px] px-4 pb-5 pt-4">
            {/* Productafbeelding */}
            <motion.div
              initial={false}
              animate={fadeIn(0)}
              transition={revealTransition(phase, 0)}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200"
              aria-hidden
            >
              <div className="aspect-[4/3] w-full" />
              <motion.div
                animate={visible && !reduce ? { x: ["-30%", "130%"] } : undefined}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              />
              <span className="absolute bottom-2 left-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-500">
                PDP
              </span>
            </motion.div>

            {/* Titel */}
            <div className="mt-3 space-y-2">
              {[0.88, 0.62].map((width, i) => (
                <motion.span
                  key={i}
                  initial={false}
                  animate={fadeIn(i + 1)}
                  transition={revealTransition(phase, i + 1)}
                  className="block h-2.5 rounded-full bg-slate-900"
                  style={{ width: `${width * 100}%` }}
                  aria-hidden
                />
              ))}
            </div>

            {/* Prijs + rating */}
            <motion.div
              initial={false}
              animate={fadeIn(3)}
              transition={revealTransition(phase, 3)}
              className="mt-3 flex items-center justify-between gap-2"
            >
              <span className="text-sm font-extrabold text-slate-900" aria-hidden>
                € 89,00
              </span>
              <span className="flex items-center gap-0.5" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`size-1.5 rounded-full ${i < 4 ? "bg-[#FF5722]" : "bg-slate-200"}`}
                  />
                ))}
              </span>
            </motion.div>

            {/* Korte specs */}
            <div className="mt-3 space-y-1.5">
              {[0.78, 0.55].map((width, i) => (
                <motion.span
                  key={i}
                  initial={false}
                  animate={fadeIn(i + 4)}
                  transition={revealTransition(phase, i + 4)}
                  className="block h-1.5 rounded-full bg-slate-200"
                  style={{ width: `${width * 100}%` }}
                  aria-hidden
                />
              ))}
            </div>

            {/* Trust */}
            <motion.div
              initial={false}
              animate={fadeIn(6)}
              transition={revealTransition(phase, 6)}
              className="mt-3 flex flex-wrap gap-1.5"
              aria-hidden
            >
              {["Gratis verzending", "Veilig betalen"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[7px] font-semibold uppercase tracking-wide text-slate-500"
                >
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Winkelwagenknop */}
            <motion.div
              initial={false}
              animate={fadeIn(7)}
              transition={revealTransition(phase, 7)}
              className="mt-4"
            >
              <motion.button
                type="button"
                tabIndex={-1}
                aria-hidden
                animate={{
                  y: isHover && !isPress && !isSuccess ? -2 : isPress ? 1 : 0,
                  scale: isPress ? 0.97 : isHover && !isSuccess ? 1.015 : 1,
                  boxShadow: isSuccess
                    ? "0 12px 28px -10px rgba(16,185,129,0.5)"
                    : isHover
                      ? "0 14px 30px -12px rgba(255,87,34,0.5)"
                      : "0 8px 22px -12px rgba(255,87,34,0.35)",
                }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
                className={`relative w-full overflow-hidden rounded-xl px-3 py-3 text-center text-[10px] font-bold leading-tight transition-colors duration-300 sm:text-[11px] ${
                  isSuccess ? "bg-emerald-500 text-white" : "bg-[#FF5722] text-white"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.span
                      key="done"
                      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="flex items-center justify-center gap-1.5"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                        <path
                          d="M 3 7 L 6 10 L 11 4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Toegevoegd aan winkelwagen
                    </motion.span>
                  ) : (
                    <motion.span
                      key="cta"
                      initial={false}
                      animate={{ opacity: visible ? 1 : 0 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center justify-center gap-1.5"
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden>
                        <path
                          d="M 1 1 h 1.5 l 1.2 6.2 h 6.8 l 1.4-4.5 H 3.8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="5.2" cy="10.5" r="0.9" fill="currentColor" />
                        <circle cx="9.4" cy="10.5" r="0.9" fill="currentColor" />
                      </svg>
                      Toevoegen aan winkelwagen
                    </motion.span>
                  )}
                </AnimatePresence>

                {isPress && !reduce ? (
                  <motion.span
                    initial={{ scale: 0, opacity: 0.4 }}
                    animate={{ scale: 2.4, opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="pointer-events-none absolute inset-0 rounded-xl bg-white/35"
                    aria-hidden
                  />
                ) : null}
              </motion.button>
            </motion.div>

            {!reduce ? (
              <motion.div
                initial={false}
                animate={{
                  x: cursorX,
                  y: cursorY,
                  opacity:
                    cursorVisible || (cursorAtButton && !isSuccess) ? 1 : 0,
                  scale: isPress ? 0.88 : 1,
                }}
                transition={
                  phase === "approach"
                    ? { duration: 0.95, ease: EASE }
                    : { type: "spring", stiffness: 380, damping: 26 }
                }
                className="pointer-events-none absolute left-0 top-0 z-10"
                aria-hidden
              >
                <svg width="18" height="22" viewBox="0 0 18 22" className="drop-shadow-md">
                  <path
                    d="M 1 1 L 1 16 L 5.5 12.5 L 8.5 19 L 10.5 18 L 7.5 11.5 L 12 11 Z"
                    fill="#0F172A"
                    stroke="#fff"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            ) : null}
          </div>
        </motion.div>

        <motion.p
          key={phase === "success" || reduce ? "done" : "story"}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="mt-3 whitespace-nowrap text-center text-[10px] font-medium text-slate-500"
        >
          {isSuccess || reduce
            ? "Zo voelt een knop die verkoopt."
            : "Product bekeken. Nu de klik die telt."}
        </motion.p>
      </motion.div>
    </div>
  );
}
