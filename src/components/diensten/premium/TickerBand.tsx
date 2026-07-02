"use client";

import { motion, useReducedMotion } from "framer-motion";

interface TickerBandProps {
  items: string[];
}

/** Donkere band met doorlopende woorden. Pauzeert niet, leidt niet af, geeft tempo. */
export function TickerBand({ items }: TickerBandProps) {
  const reduce = useReducedMotion();
  const row = [...items, ...items];

  if (reduce) {
    return (
      <div className="border-y border-slate-800 bg-slate-900 py-4">
        <p className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-6 gap-y-1 px-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
          {items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </p>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden border-y border-slate-800 bg-slate-900 py-4"
      aria-hidden
    >
      <motion.div
        className="flex w-max items-center gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-10 text-sm font-bold uppercase tracking-[0.18em] text-slate-400"
          >
            {item}
            <span className="size-1.5 rounded-full bg-[#FF5722]" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
