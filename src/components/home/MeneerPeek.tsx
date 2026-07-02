"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

const QUOTES = [
  "Psst. Je kunt op me klikken.",
  "Ik zag je scrollen. Strakke scrolltechniek trouwens.",
  "Tussen ons: die oranje knoppen converteren echt.",
  "Marketing zonder plan is gewoon dure hoop.",
  "Jouw concurrent leest deze site niet. Mooi voordeel.",
  "Ik knipper ook als je niet kijkt. Beloofd.",
  "Mijn beste tip is gratis: gewoon beginnen.",
] as const;

/** Hoogte van het kijkvenster boven de sectierand */
const WINDOW_H = 64;
/** Y-stand waarbij Meneer over de rand gluurt */
const PEEK_Y = 10;
/** Y-stand waarbij Meneer volledig weggedoken is */
const HIDDEN_Y = 84;

/**
 * De mascotte gluurt over de bovenrand van de volgende sectie zodra je er
 * naartoe scrolt, met een tekstballon. Klik of tik: hij duikt weg en komt
 * terug met een nieuwe one-liner.
 */
export function MeneerPeek() {
  const reduce = useReducedMotion();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [ducked, setDucked] = useState(false);

  function nextQuote() {
    if (ducked) return;
    if (reduce) {
      setQuoteIndex((i) => (i + 1) % QUOTES.length);
      return;
    }
    setDucked(true);
    window.setTimeout(() => {
      setQuoteIndex((i) => (i + 1) % QUOTES.length);
      setDucked(false);
    }, 380);
  }

  return (
    <div className="relative z-10 mx-auto h-0 max-w-6xl" aria-hidden>
      <div className="absolute bottom-0 right-8 flex flex-col items-end sm:right-14">
        {/* Tekstballon */}
        <AnimatePresence mode="wait">
          {!ducked ? (
            <motion.div
              key={quoteIndex}
              initial={
                reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.92 }
              }
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={
                reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.94 }
              }
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="pointer-events-none relative mb-2 w-max max-w-[220px] rounded-2xl rounded-br-sm border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold leading-snug text-slate-800 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.25)] sm:max-w-[280px] sm:text-sm"
            >
              {QUOTES[quoteIndex]}
              <span
                className="absolute -bottom-[7px] right-6 size-3.5 rotate-45 border-b border-r border-slate-200 bg-white"
                aria-hidden
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Kijkvenster: alles onder de sectierand wordt afgeknipt */}
        <button
          type="button"
          onClick={nextQuote}
          tabIndex={-1}
          className="pointer-events-auto mr-1 block w-[80px] cursor-pointer overflow-hidden"
          style={{ height: WINDOW_H }}
        >
          <motion.div
            initial={{ y: HIDDEN_Y }}
            whileInView={{ y: ducked ? HIDDEN_Y : PEEK_Y }}
            viewport={{ once: false, margin: "-40px" }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 230, damping: 20 }
            }
            className="flex justify-center will-change-transform"
          >
            <InteractiveLogo className="h-[76px] w-[76px]" />
          </motion.div>
        </button>
      </div>
    </div>
  );
}
