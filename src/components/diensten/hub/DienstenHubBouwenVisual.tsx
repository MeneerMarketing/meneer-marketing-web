"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const LINES = [
  { text: "$ npm run build", color: "text-slate-400" },
  { text: "✓ Compiled successfully", color: "text-emerald-500" },
  { text: "✓ Core Web Vitals · groen", color: "text-emerald-500" },
  { text: "✓ deploy → meneermarketing.nl", color: "text-[#FF5722]" },
] as const;

export function DienstenHubBouwenVisual() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(reduce ? LINES.length : 0);

  useEffect(() => {
    if (reduce) return;
    if (visible >= LINES.length) {
      const reset = setTimeout(() => setVisible(0), 2400);
      return () => clearTimeout(reset);
    }
    const t = setTimeout(() => setVisible((v) => v + 1), 700);
    return () => clearTimeout(t);
  }, [visible, reduce]);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-400/80" />
        <span className="size-2.5 rounded-full bg-amber-300/80" />
        <span className="size-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 font-mono text-[10px] text-slate-500">terminal · from scratch</span>
      </div>
      <div className="space-y-2 p-5 font-mono text-xs sm:text-sm">
        {LINES.slice(0, visible).map((line, i) => (
          <motion.p
            key={line.text}
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className={line.color}
          >
            {line.text}
          </motion.p>
        ))}
        {visible < LINES.length && !reduce ? (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block h-4 w-2 bg-emerald-400"
          />
        ) : null}
      </div>
    </div>
  );
}
