"use client";

import { motion, useReducedMotion } from "framer-motion";

interface MeterDialProps {
  value: number;
  size?: "hero" | "result";
  animate?: boolean;
  variant?: "light" | "dark";
}

const SIZE = {
  hero: { box: 200, stroke: 10, font: "text-4xl" },
  result: { box: 160, stroke: 9, font: "text-3xl" },
} as const;

export function MeterDial({
  value,
  size = "hero",
  animate = true,
  variant = "light",
}: MeterDialProps) {
  const reduce = useReducedMotion() ?? false;
  const dims = SIZE[size];
  const radius = (dims.box - dims.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  const track = variant === "dark" ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.08)";
  const labelClass =
    variant === "dark" ? "text-white/50" : "text-slate-400";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: dims.box, height: dims.box }}
      aria-hidden
    >
      <svg width={dims.box} height={dims.box} className="-rotate-90">
        <circle
          cx={dims.box / 2}
          cy={dims.box / 2}
          r={radius}
          fill="none"
          stroke={track}
          strokeWidth={dims.stroke}
        />
        <motion.circle
          cx={dims.box / 2}
          cy={dims.box / 2}
          r={radius}
          fill="none"
          stroke="#FF5722"
          strokeWidth={dims.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reduce || !animate ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {size === "hero" ? (
        <span
          className={`absolute font-black tabular-nums text-[#FF5722] ${dims.font} ${labelClass}`}
        >
          {clamped}
        </span>
      ) : null}
    </div>
  );
}
