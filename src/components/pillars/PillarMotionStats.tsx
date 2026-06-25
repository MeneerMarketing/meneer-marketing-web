"use client";

import { motion } from "framer-motion";

export interface PillarMotionStat {
  label: string;
  value: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 26 },
  },
};

export function PillarMotionStats({ stats }: { stats: PillarMotionStat[] }) {
  return (
    <motion.ul
      className="mt-10 grid gap-3 sm:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {stats.map((s) => (
        <motion.li
          key={s.label}
          variants={item}
          className="rounded-2xl border border-mm-border/80 bg-white/90 px-4 py-4 shadow-mm-card"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-mm-muted">
            {s.label}
          </p>
          <p className="mt-2 text-sm font-bold leading-snug text-mm-text">
            {s.value}
          </p>
        </motion.li>
      ))}
    </motion.ul>
  );
}
