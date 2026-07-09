"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface WerkwijzeSprintTimelineProps {
  readonly activeIndex: number;
  readonly labels: readonly string[];
  readonly emojis: readonly string[];
}

/**
 * Illustratie: Meneer-route als band met vier stations.
 */
export function WerkwijzeSprintTimeline({
  activeIndex,
  labels,
  emojis,
}: WerkwijzeSprintTimelineProps) {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <svg viewBox="0 0 320 200" className="h-auto w-full" aria-hidden>
        <defs>
          <linearGradient id="ww-track" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF5722" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF5722" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        <path
          d="M 24 140 Q 80 60, 160 100 T 296 80"
          fill="none"
          stroke="url(#ww-track)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="8 6"
        />

        {labels.map((label, i) => {
          const x = 24 + (272 / Math.max(labels.length - 1, 1)) * i;
          const y = i % 2 === 0 ? 130 - i * 8 : 95 + i * 4;
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;

          return (
            <g key={label}>
              <circle
                cx={x}
                cy={y}
                r={isActive ? 22 : 18}
                fill={isActive ? "#FF5722" : isPast ? "#0F172A" : "#F1F5F9"}
                stroke={isActive ? "#FF5722" : "#E2E8F0"}
                strokeWidth="2"
              />
              <text x={x} y={y + 5} textAnchor="middle" fontSize="14">
                {emojis[i]}
              </text>
              <text
                x={x}
                y={y + 36}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill={isActive ? "#FF5722" : "#64748B"}
              >
                {label}
              </text>
            </g>
          );
        })}

        <g transform="translate(140, 155)">
          <rect width="40" height="40" rx="10" fill="#0F172A" />
          <ellipse cx="20" cy="26" rx="10" ry="9" fill="#F8CBA3" />
          <rect x="12" y="10" width="16" height="3" rx="1" fill="#FF5722" />
        </g>
      </svg>

      <AnimatePresence mode="wait">
        <motion.p
          key={activeIndex}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -4 }}
          className="mt-2 text-center text-xs font-bold text-slate-500"
        >
          Station {activeIndex + 1} van {labels.length}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
