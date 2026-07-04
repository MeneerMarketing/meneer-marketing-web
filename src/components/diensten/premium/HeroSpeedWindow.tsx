"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;
const TARGET_SCORE = 94;

const CX = 130;
const CY = 130;
const NEEDLE_LEN = 78;

const METRICS = [
  { label: "LCP", value: "0,9s" },
  { label: "INP", value: "98ms" },
  { label: "CLS", value: "0,02" },
] as const;

const FIXES = ["Images", "Scripts", "Fonts"] as const;

interface NeedlePoint {
  x: number;
  y: number;
}

/** Boog loopt links→rechts over de bovenkant; score 0 = links, 100 = rechts. */
function scoreToNeedleTip(score: number): NeedlePoint {
  const angle = Math.PI - (score / 100) * Math.PI;
  return {
    x: CX + NEEDLE_LEN * Math.cos(angle),
    y: CY - NEEDLE_LEN * Math.sin(angle),
  };
}

/**
 * Halve speedometer: uniek zwevend element, geen artboard.
 * Naald en score lopen synchroon op; getal staat onder de boog.
 */
export function HeroSpeedWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.75);
  const gaugeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gaugeRef, { once: true, margin: "-40px" });

  const score = useMotionValue(reduce ? TARGET_SCORE : 0);
  const arcProgress = useTransform(score, [0, 100], [0, 1]);

  const startTip = scoreToNeedleTip(0);
  const [displayScore, setDisplayScore] = useState(reduce ? TARGET_SCORE : 0);
  const [needleTip, setNeedleTip] = useState<NeedlePoint>(
    reduce ? scoreToNeedleTip(TARGET_SCORE) : startTip,
  );

  useMotionValueEvent(score, "change", (v) => {
    setDisplayScore(Math.round(v));
    setNeedleTip(scoreToNeedleTip(v));
  });

  useEffect(() => {
    if (!isInView) return;
    if (reduce) {
      score.set(TARGET_SCORE);
      return;
    }
    const controls = animate(score, TARGET_SCORE, {
      duration: 1.6,
      ease: EASE,
    });
    return () => controls.stop();
  }, [isInView, reduce, score]);

  return (
    <div
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center"
      >
        <motion.div
          ref={gaugeRef}
          initial={reduce ? undefined : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative flex flex-col items-center"
          style={{ transform: "translateZ(40px)" }}
        >
          {/* Alleen boog + naald in SVG; score erbuiten */}
          <svg
            width="280"
            height="138"
            viewBox="0 0 260 138"
            className="overflow-visible"
            aria-hidden
          >
            <path
              d="M 30 130 A 100 100 0 0 1 230 130"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <motion.path
              d="M 30 130 A 100 100 0 0 1 230 130"
              fill="none"
              stroke="url(#speedGradOpt)"
              strokeWidth="14"
              strokeLinecap="round"
              style={{ pathLength: arcProgress }}
            />
            <defs>
              <linearGradient id="speedGradOpt" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="55%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Tick labels */}
            <text x="24" y="128" className="fill-slate-400 text-[9px] font-bold">
              0
            </text>
            <text x="238" y="128" className="fill-slate-400 text-[9px] font-bold">
              100
            </text>

            <line
              x1={CX}
              y1={CY}
              x2={needleTip.x}
              y2={needleTip.y}
              stroke="#0f172a"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx={CX} cy={CY} r="10" fill="#0f172a" />
            <circle cx={CX} cy={CY} r="5" fill="#fafaf9" />
          </svg>

          {/* Score onder de boog, ruimte tussen hub en cijfer */}
          <div className="mt-5 text-center">
            <p
              className="text-4xl font-extrabold tabular-nums leading-none tracking-tighter text-emerald-500"
              aria-live="polite"
            >
              {displayScore}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              PageSpeed
            </p>
          </div>
        </motion.div>

        {/* CWV-pills */}
        <div
          className="relative mt-5 flex w-full max-w-[300px] justify-between gap-2 px-2"
          style={{ transform: "translateZ(32px)" }}
        >
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={reduce ? undefined : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 + i * 0.08, ease: EASE }}
              className="flex-1 rounded-2xl border border-emerald-200/80 bg-white px-2.5 py-2 text-center shadow-md"
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                {m.label}
              </p>
              <p className="mt-0.5 text-sm font-extrabold text-emerald-600">{m.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Fix-strip */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.65, ease: EASE }}
          className="relative mt-4 flex flex-wrap items-center justify-center gap-2"
          style={{ transform: "translateZ(28px)" }}
        >
          {FIXES.map((fix) => (
            <span
              key={fix}
              className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[10px] font-semibold text-slate-600 shadow-sm backdrop-blur"
            >
              <span className="text-emerald-500" aria-hidden>
                ✓{" "}
              </span>
              {fix}
            </span>
          ))}
        </motion.div>

        <motion.div
          animate={reduce ? undefined : { y: [-4, 4] }}
          transition={{ duration: 2.8, repeat: Infinity, repeatType: "mirror" }}
          className="absolute right-0 top-10 rounded-2xl border border-[#FF5722]/25 bg-white px-3 py-2 shadow-lg"
          style={{ transform: "translateZ(50px)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Prioriteit
          </p>
          <p className="text-xs font-extrabold text-[#FF5722]">PDP & checkout</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
