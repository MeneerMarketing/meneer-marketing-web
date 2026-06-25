"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const WORDS = [
  "systeem",
  "motor",
  "speelveld",
  "groei-machine",
] as const;

export function HeroKeywordCycle() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2800);
    return () => clearInterval(t);
  }, [reduce]);

  if (reduce) {
    return (
      <span className="text-mm-sky-deep font-extrabold">{WORDS[0]}</span>
    );
  }

  return (
    <span className="relative inline-block min-w-[8.5ch] text-mm-sky-deep">
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[i]}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 whitespace-nowrap font-extrabold"
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible font-extrabold" aria-hidden>
        groei-machine
      </span>
    </span>
  );
}
