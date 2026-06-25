"use client";

import { motion, useReducedMotion } from "framer-motion";

export type BackdropTone = "sky" | "accent" | "dual" | "violet";

interface ConversionBackdropProps {
  readonly tone?: BackdropTone;
  readonly className?: string;
}

const TONE_PRESETS: Record<
  BackdropTone,
  { readonly a: string; readonly b: string; readonly c: string; readonly d: string }
> = {
  sky: {
    a: "rgba(14, 165, 233, 0.38)",
    b: "rgba(2, 132, 199, 0.24)",
    c: "rgba(125, 211, 252, 0.32)",
    d: "rgba(224, 242, 254, 0.5)",
  },
  accent: {
    a: "rgba(234, 88, 12, 0.26)",
    b: "rgba(251, 146, 60, 0.32)",
    c: "rgba(14, 165, 233, 0.20)",
    d: "rgba(255, 237, 213, 0.55)",
  },
  dual: {
    a: "rgba(14, 165, 233, 0.34)",
    b: "rgba(234, 88, 12, 0.22)",
    c: "rgba(125, 211, 252, 0.30)",
    d: "rgba(255, 237, 213, 0.45)",
  },
  violet: {
    a: "rgba(139, 92, 246, 0.30)",
    b: "rgba(14, 165, 233, 0.28)",
    c: "rgba(236, 72, 153, 0.22)",
    d: "rgba(224, 242, 254, 0.50)",
  },
};

export function ConversionBackdrop({
  tone = "sky",
  className = "",
}: ConversionBackdropProps) {
  const reduce = useReducedMotion();
  const preset = TONE_PRESETS[tone];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(1200px 600px at 10% -10%, ${preset.a}, transparent 60%),
                       radial-gradient(900px 500px at 110% 10%, ${preset.b}, transparent 55%),
                       radial-gradient(800px 600px at 50% 120%, ${preset.c}, transparent 60%),
                       linear-gradient(180deg, ${preset.d}, transparent 70%)`,
        }}
      />

      <motion.div
        className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: preset.a }}
        animate={
          reduce
            ? undefined
            : {
                x: [0, 40, -20, 0],
                y: [0, 30, -10, 0],
                scale: [1, 1.08, 0.95, 1],
              }
        }
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -right-20 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: preset.b }}
        animate={
          reduce
            ? undefined
            : {
                x: [0, -30, 20, 0],
                y: [0, -20, 20, 0],
                scale: [1, 1.05, 0.97, 1],
              }
        }
        transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 h-[280px] w-[280px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: preset.c }}
        animate={
          reduce
            ? undefined
            : { x: [-30, 30, -30], y: [0, 20, 0], opacity: [0.6, 0.9, 0.6] }
        }
        transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.08]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="mm-grid-fine"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-mm-text"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mm-grid-fine)" />
      </svg>

      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(14,165,233,0.45), transparent)",
        }}
      />
    </div>
  );
}
