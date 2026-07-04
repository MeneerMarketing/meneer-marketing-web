"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import { useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const HOOKS = [
  "Dit lost mijn [probleem] op",
  "Eerlijk: na 2 weken merk ik...",
  "Waarom niemand dit eerder zei",
] as const;

/**
 * Verticale UGC-video met wisselende hooks.
 */
export function HeroUgcWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.7);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [hookIdx, setHookIdx] = useState(0);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full items-center justify-center gap-4"
      >
        <motion.button
          type="button"
          onClick={() => setHookIdx((i) => (i + 1) % HOOKS.length)}
          initial={reduce ? undefined : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-[9/16] w-[160px] overflow-hidden rounded-2xl border-4 border-slate-900 bg-slate-900 shadow-2xl"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200/80 to-orange-100/80" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={hookIdx}
                initial={reduce ? undefined : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-left text-[10px] font-bold leading-snug text-white"
              >
                &ldquo;{HOOKS[hookIdx]}&rdquo;
              </motion.p>
            </AnimatePresence>
          </div>
          <span className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg">
            <Play className="size-4 fill-slate-900 text-slate-900" aria-hidden />
          </span>
          <span className="absolute left-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[8px] font-bold text-white">
            UGC
          </span>
        </motion.button>

        <div className="flex flex-col gap-2" style={{ transform: "translateZ(32px)" }}>
          {HOOKS.map((h, i) => (
            <button
              key={h}
              type="button"
              onClick={() => setHookIdx(i)}
              className={`max-w-[140px] rounded-xl border px-2.5 py-2 text-left text-[9px] font-bold transition ${
                i === hookIdx
                  ? "border-[#FF5722] bg-[#FF5722]/10 text-[#FF5722]"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              Hook {i + 1}
            </button>
          ))}
          <p className="text-[9px] font-medium text-slate-400">Tik voor volgende hook</p>
        </div>
      </motion.div>
    </div>
  );
}
