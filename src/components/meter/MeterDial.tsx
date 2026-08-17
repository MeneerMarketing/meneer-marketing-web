"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

interface MeterDialProps {
  value: number;
  size?: "hero" | "result";
  animate?: boolean;
  variant?: "light" | "dark";
}

const R = 76;
const CX = 110;
const CY = 108;
const ARC_PATH = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;
const ARC_LENGTH = Math.PI * R;

export function MeterDial({
  value,
  size = "result",
  animate = true,
  variant = "light",
}: MeterDialProps) {
  const reduce = useReducedMotion() ?? false;
  const uid = useId().replace(/:/g, "");
  const clamped = Math.max(0, Math.min(100, value));
  const dashOffset = ARC_LENGTH * (1 - clamped / 100);
  const dim = size === "hero" ? 300 : 248;
  const stroke = size === "hero" ? 15 : 13;
  const dark = variant === "dark";

  return (
    <div
      className="relative mx-auto select-none"
      style={{ width: dim, height: dim * 0.52 }}
      aria-hidden
    >
      <svg
        viewBox="0 0 220 128"
        className="h-full w-full overflow-visible"
        role="presentation"
      >
        <defs>
          <linearGradient id={`meter-fill-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF5722" />
            <stop offset="50%" stopColor="#FF8A5B" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        <path
          d={ARC_PATH}
          fill="none"
          stroke={dark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.07)"}
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <motion.path
          d={ARC_PATH}
          fill="none"
          stroke={`url(#meter-fill-${uid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={ARC_LENGTH}
          initial={
            animate && !reduce ? { strokeDashoffset: ARC_LENGTH, opacity: 0.4 } : false
          }
          animate={{ strokeDashoffset: dashOffset, opacity: clamped > 0 ? 1 : 0.35 }}
          transition={{ duration: reduce ? 0 : 1.15, ease: [0.22, 1, 0.36, 1] }}
        />

        <text
          x={CX - R}
          y={CY + 16}
          textAnchor="middle"
          className={
            dark
              ? "fill-white/25 text-[8px] font-bold"
              : "fill-slate-300 text-[8px] font-bold"
          }
        >
          0
        </text>
        <text
          x={CX + R}
          y={CY + 16}
          textAnchor="middle"
          className={
            dark
              ? "fill-white/25 text-[8px] font-bold"
              : "fill-slate-300 text-[8px] font-bold"
          }
        >
          100
        </text>
      </svg>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-1">
        {size === "hero" && animate && !reduce ? (
          <motion.span
            className="inline-flex gap-1"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1.5 rounded-full bg-[#FF5722]"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </motion.span>
        ) : null}
        <p
          className={
            dark
              ? "font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/40"
              : "font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400"
          }
        >
          Meneer Meter
        </p>
      </div>
    </div>
  );
}
