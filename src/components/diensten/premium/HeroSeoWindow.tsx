"use client";

import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const RESULTS = [
  { rank: 8, title: "Generieke gids 2024", url: "blog.example.nl", dim: true },
  { rank: 5, title: "Concurrent · vergelijking", url: "andere-site.nl", dim: true },
  { rank: 3, title: "Forum · oud advies", url: "forum.nl", dim: true },
  { rank: 1, title: "Jouw bedrijf · dé antwoordpagina", url: "jouw-site.nl", dim: false },
] as const;

const RANK_SEQUENCE = [8, 5, 3, 1] as const;

/**
 * Zwevende SERP-kaarten: posities klimmen naar #1. Geen browsermockup.
 */
export function HeroSeoWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.8);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [step, setStep] = useState(reduce ? 3 : 0);

  useEffect(() => {
    if (!isInView || reduce) {
      setStep(3);
      return;
    }
    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      setStep(Math.min(i, 3));
      if (i >= 3) window.clearInterval(tick);
    }, 900);
    return () => window.clearInterval(tick);
  }, [isInView, reduce]);

  const activeRank = RANK_SEQUENCE[step] ?? 1;

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-8 size-56 -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center px-2"
      >
        {/* Zoekbalk */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative z-10 flex w-full max-w-[320px] items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-lg"
          style={{ transform: "translateZ(50px)" }}
        >
          <Search className="size-4 shrink-0 text-slate-400" aria-hidden />
          <span className="truncate text-sm font-medium text-slate-700">
            beste {` `}
            <motion.span
              animate={reduce ? undefined : { opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="font-bold text-slate-900"
            >
              [jouw dienst]
            </motion.span>
            {` `}nederland
          </span>
        </motion.div>

        {/* SERP stack */}
        <div className="relative mt-8 w-full max-w-[340px]" style={{ transform: "translateZ(30px)" }}>
          {RESULTS.map((row, i) => {
            const isWinner = row.rank === activeRank && row.rank === 1;
            const isVisible = row.rank >= activeRank || row.rank === 1;
            const yOffset = (4 - i) * 52;

            return (
              <motion.div
                key={row.title}
                initial={reduce ? undefined : { opacity: 0, y: yOffset + 40 }}
                animate={{
                  opacity: isVisible ? (row.dim && !isWinner ? 0.55 : 1) : 0,
                  y: yOffset,
                  scale: isWinner ? 1.02 : 1,
                }}
                transition={{ type: "spring", stiffness: 180, damping: 22, delay: i * 0.05 }}
                className={`absolute inset-x-0 rounded-2xl border px-4 py-3 shadow-md backdrop-blur-sm ${
                  isWinner
                    ? "border-[#FF5722]/40 bg-white ring-2 ring-[#FF5722]/20"
                    : "border-slate-200/80 bg-white/95"
                }`}
              >
                <div className="flex items-start gap-3">
                  <motion.span
                    animate={
                      isWinner && !reduce
                        ? { scale: [1, 1.15, 1], color: ["#FF5722", "#ea580c", "#FF5722"] }
                        : undefined
                    }
                    transition={{ duration: 0.6 }}
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                      isWinner ? "bg-[#FF5722] text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isWinner ? 1 : row.rank}
                  </motion.span>
                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm font-bold ${
                        isWinner ? "text-[#FF5722]" : "text-sky-700"
                      }`}
                    >
                      {row.title}
                    </p>
                    <p className="truncate text-[10px] text-emerald-600">{row.url}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Positie badge */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, ease: EASE }}
          className="absolute bottom-6 right-0 rounded-2xl border border-emerald-200 bg-white px-3 py-2 shadow-lg"
          style={{ transform: "translateZ(45px)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Positie
          </p>
          <motion.p
            key={activeRank}
            initial={reduce ? undefined : { y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-lg font-extrabold text-emerald-600"
          >
            #{activeRank === 1 ? "1" : activeRank}
            {activeRank === 1 ? " 🎯" : ""}
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
