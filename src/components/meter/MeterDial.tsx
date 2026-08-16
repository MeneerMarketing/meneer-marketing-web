"use client";

import { motion, useReducedMotion } from "framer-motion";

interface MeterDialProps {
  value: number;
  size?: "hero" | "result";
  animate?: boolean;
}

export function MeterDial({ value, size = "result", animate = true }: MeterDialProps) {
  const reduce = useReducedMotion() ?? false;
  const clamped = Math.max(0, Math.min(100, value));
  const rotation = -90 + (clamped / 100) * 180;
  const dim = size === "hero" ? 280 : 220;

  return (
    <div
      className="relative mx-auto select-none"
      style={{ width: dim, height: dim * 0.62 }}
      aria-hidden
    >
      <svg
        viewBox="0 0 220 140"
        className="h-full w-full drop-shadow-[0_20px_40px_rgba(255,87,34,0.18)]"
      >
        <defs>
          <linearGradient id="meterArc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="45%" stopColor="#FF5722" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
        </defs>

        <path
          d="M 20 120 A 90 90 0 0 1 200 120"
          fill="none"
          stroke="rgba(15,23,42,0.08)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <motion.path
          d="M 20 120 A 90 90 0 0 1 200 120"
          fill="none"
          stroke="url(#meterArc)"
          strokeWidth="14"
          strokeLinecap="round"
          initial={animate && !reduce ? { pathLength: 0 } : false}
          animate={{ pathLength: clamped / 100 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = (-180 + (tick / 100) * 180) * (Math.PI / 180);
          const cx = 110 + Math.cos(angle) * 72;
          const cy = 120 + Math.sin(angle) * 72;
          return (
            <g key={tick}>
              <circle cx={cx} cy={cy} r="2.5" fill="rgba(15,23,42,0.25)" />
              <text
                x={110 + Math.cos(angle) * 84}
                y={120 + Math.sin(angle) * 84 + 4}
                textAnchor="middle"
                className="fill-slate-400 text-[9px] font-bold"
              >
                {tick}
              </text>
            </g>
          );
        })}

        <motion.g
          initial={animate && !reduce ? { rotate: -90 } : false}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 70, damping: 14 }}
          style={{ transformOrigin: "110px 120px" }}
        >
          <line
            x1="110"
            y1="120"
            x2="110"
            y2="42"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="110" cy="120" r="8" fill="#0f172a" />
          <circle cx="110" cy="120" r="4" fill="#FF5722" />
        </motion.g>
      </svg>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 text-center">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Meneer Meter
        </p>
      </div>
    </div>
  );
}
