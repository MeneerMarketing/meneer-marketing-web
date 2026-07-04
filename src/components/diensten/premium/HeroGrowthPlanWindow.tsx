"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const CHANNELS = [
  { id: "seo", label: "SEO", angle: -55 },
  { id: "ads", label: "Google Ads", angle: 0 },
  { id: "site", label: "Site", angle: 55 },
  { id: "mail", label: "Mail", angle: 110 },
  { id: "cro", label: "CRO", angle: -110 },
] as const;

const MAX = 3;

/**
 * Groeikompas: tik max drie kanalen aan. Uniek t.o.v. andere hero's.
 */
export function HeroGrowthPlanWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.7);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [picked, setPicked] = useState<string[]>([]);

  function toggle(id: string) {
    setPicked((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX) return prev;
      return [...prev, id];
    });
  }

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5722]/10 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative size-[280px]"
          style={{ transform: "translateZ(35px)" }}
        >
          {/* Compass ring */}
          <svg viewBox="0 0 200 200" className="size-full" aria-hidden>
            <circle cx="100" cy="100" r="88" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 6" />
            <circle cx="100" cy="100" r="58" fill="none" stroke="#f1f5f9" strokeWidth="1" />
          </svg>

          {/* Center hub */}
          <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-slate-900 bg-white shadow-lg">
            <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Focus</p>
            <p className="text-xl font-extrabold tabular-nums text-[#FF5722]">
              {picked.length}/{MAX}
            </p>
          </div>

          {/* Channel chips around compass */}
          {CHANNELS.map((ch, i) => {
            const rad = (ch.angle * Math.PI) / 180;
            const x = 100 + 78 * Math.sin(rad);
            const y = 100 - 78 * Math.cos(rad);
            const active = picked.includes(ch.id);
            const rank = picked.indexOf(ch.id) + 1;

            return (
              <motion.button
                key={ch.id}
                type="button"
                onClick={() => toggle(ch.id)}
                initial={reduce ? undefined : { opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : undefined}
                transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 280, damping: 18 }}
                style={{ left: `${(x / 200) * 100}%`, top: `${(y / 200) * 100}%` }}
                className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all ${
                  active
                    ? "border-[#FF5722] bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/30"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#FF5722]/50"
                }`}
              >
                {active ? `${rank}. ${ch.label}` : ch.label}
              </motion.button>
            );
          })}
        </motion.div>

        <motion.p
          initial={reduce ? undefined : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ delay: 0.7 }}
          className="mt-4 text-center text-[11px] font-bold text-slate-500"
          style={{ transform: "translateZ(30px)" }}
        >
          {picked.length === MAX
            ? "Dit is je groeiplan. De rest wacht."
            : "Tik je max drie focuspunten aan"}
        </motion.p>
      </motion.div>
    </div>
  );
}
