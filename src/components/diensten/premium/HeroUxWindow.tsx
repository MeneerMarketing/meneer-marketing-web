"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const SECTION_IDS = ["nav", "hero", "cta", "grid", "trust", "footer"] as const;
type SectionId = (typeof SECTION_IDS)[number];

/** Hoeveel secties zijn ingeschoven (1 = alleen nav, 6 = volledige pagina). */
const MAX_STEP = SECTION_IDS.length;

function SectionBlock({ id }: { id: SectionId }) {
  switch (id) {
    case "nav":
      return (
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
          <span className="size-5 rounded-md bg-slate-900" aria-hidden />
          <span className="h-1.5 w-12 rounded-full bg-slate-200" aria-hidden />
          <span className="ml-auto h-5 w-14 rounded-full bg-slate-100" aria-hidden />
        </div>
      );
    case "hero":
      return (
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 px-3 py-3">
          <div className="space-y-1.5">
            <span className="block h-2.5 w-full rounded-full bg-slate-900" aria-hidden />
            <span className="block h-2 w-4/5 rounded-full bg-slate-800" aria-hidden />
            <span className="block h-1.5 w-3/5 rounded-full bg-slate-300" aria-hidden />
          </div>
          <span
            className="rounded-lg bg-gradient-to-br from-slate-200 to-slate-100"
            aria-hidden
          />
        </div>
      );
    case "cta":
      return (
        <div className="px-3 pb-3">
          <span className="block rounded-full bg-[#FF5722] py-2 text-center text-[9px] font-bold text-white">
            Volgende stap
          </span>
        </div>
      );
    case "grid":
      return (
        <div className="grid grid-cols-3 gap-1.5 px-3 pb-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-1.5">
              <span className="block aspect-[4/3] rounded bg-slate-200/80" aria-hidden />
              <span className="mt-1 block h-1 w-3/4 rounded-full bg-slate-200" aria-hidden />
            </div>
          ))}
        </div>
      );
    case "trust":
      return (
        <div className="flex justify-center gap-2 border-t border-slate-100 px-3 py-2.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-2 rounded-full bg-emerald-400"
              aria-hidden
            />
          ))}
        </div>
      );
    case "footer":
      return (
        <div className="space-y-1 border-t border-slate-100 bg-slate-50/80 px-3 py-2.5">
          <span className="block h-1 w-full rounded-full bg-slate-200" aria-hidden />
          <span className="block h-1 w-1/2 rounded-full bg-slate-100" aria-hidden />
        </div>
      );
  }
}

/**
 * Verticale pagina-wireframe: secties bouwen de pagina laag voor laag op.
 * Geen 3×3-puzzel, wel echte klantreis (nav → hero → …).
 */
export function HeroUxWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.55);
  const [step, setStep] = useState(reduce ? MAX_STEP : 1);

  useEffect(() => {
    if (reduce) return;
    let current = 1;
    const timer = window.setInterval(() => {
      current = current >= MAX_STEP ? 1 : current + 1;
      setStep(current);
    }, 950);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <div
      className="relative mx-auto flex h-[400px] w-full max-w-[440px] items-center justify-center [perspective:1500px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="flex w-full max-w-[380px] flex-col items-center"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
          className="w-full"
          style={{ transform: "translateZ(36px)" }}
        >
          <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Wireframe eerst
          </p>

          {/* Browserframe */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_48px_-20px_rgba(15,23,42,0.2)]">
            <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50/90 px-3 py-2">
              <span className="size-2 rounded-full bg-[#FF5722]/80" aria-hidden />
              <span className="size-2 rounded-full bg-amber-300" aria-hidden />
              <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
              <span className="ml-2 h-1.5 flex-1 max-w-[100px] rounded-full bg-slate-200" aria-hidden />
            </div>

            <div className="relative min-h-[280px] overflow-hidden bg-white">
              <AnimatePresence initial={false}>
                {SECTION_IDS.filter((_, index) => step > index).map((id) => (
                  <motion.div
                    key={id}
                    initial={reduce ? false : { x: 48, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={reduce ? undefined : { x: 48, opacity: 0 }}
                    transition={{ duration: 0.48, ease: EASE }}
                    className="overflow-hidden border-b border-slate-100/80 last:border-b-0"
                  >
                    <SectionBlock id={id} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <p className="mt-3 whitespace-nowrap text-center text-[10px] font-medium text-slate-500">
            Klantreis eerst. Design from scratch.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
