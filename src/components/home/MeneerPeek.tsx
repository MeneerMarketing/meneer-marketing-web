"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const QUOTES = [
  "Ik zag je scrollen. Strakke scrolltechniek trouwens.",
  "Tussen ons: die oranje knoppen converteren echt.",
  "Marketing zonder plan is gewoon dure hoop.",
  "Jouw concurrent leest deze site niet. Mooi voordeel.",
  "Ik knipper ook als je niet kijkt. Beloofd.",
  "Mijn beste tip is gratis: gewoon beginnen.",
  "Nog een klik? Dan krijg je weer een one-liner.",
] as const;

/** Klikbare Meneer-wolk in de footer. */
export function MeneerPeek() {
  const reduce = useReducedMotion();
  const [quoteIndex, setQuoteIndex] = useState(0);

  function nextQuote() {
    setQuoteIndex((i) => (i + 1) % QUOTES.length);
  }

  return (
    <motion.div
      className="mt-5"
      aria-live="polite"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    >
      <button
        type="button"
        onClick={nextQuote}
        aria-label="Nieuwe quote van Meneer Marketing"
        className="group cursor-pointer text-left outline-none"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={quoteIndex}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="relative inline-block max-w-sm rounded-2xl rounded-bl-sm border border-slate-600/80 bg-slate-900/90 px-4 py-3 text-sm font-bold leading-snug text-slate-100 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)] transition-colors group-hover:border-[#FF5722]/40 group-hover:text-white"
          >
            {QUOTES[quoteIndex]}
            <span
              className="absolute -bottom-[6px] left-6 size-3 rotate-45 border-b border-r border-slate-600/80 bg-slate-900/90 transition-colors group-hover:border-[#FF5722]/40"
              aria-hidden
            />
          </motion.span>
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
