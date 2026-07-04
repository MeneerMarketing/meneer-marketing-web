"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

const QUOTES = [
  "Ik zag je scrollen. Strakke scrolltechniek trouwens.",
  "Tussen ons: die oranje knoppen converteren echt.",
  "Marketing zonder plan is gewoon dure hoop.",
  "Jouw concurrent leest deze site niet. Mooi voordeel.",
  "Ik knipper ook als je niet kijkt. Beloofd.",
  "Mijn beste tip is gratis: gewoon beginnen.",
  "Nog een klik? Dan krijg je weer een one-liner.",
] as const;

const WINDOW_H = 56;
const PEEK_Y = 8;
const HIDDEN_Y = 72;

/**
 * Meneer gluurt rechtsonder met een klikbare wolk. Ballon + hoofd = één knop.
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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8" aria-live="polite">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={nextQuote}
          aria-label="Nieuwe quote van Meneer Marketing"
          className="group flex max-w-full cursor-pointer items-end gap-2 rounded-2xl border border-transparent p-1 text-left outline-none transition hover:border-slate-200/80 hover:bg-white/80 sm:gap-3 sm:p-2"
        >
          <AnimatePresence mode="wait">
            {!ducked ? (
              <motion.span
                key={quoteIndex}
                initial={
                  reduce ? { opacity: 0 } : { opacity: 0, x: 8, scale: 0.96 }
                }
                animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
                exit={
                  reduce ? { opacity: 0 } : { opacity: 0, x: 6, scale: 0.96 }
                }
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                className="relative mb-1 max-w-[min(100%,16rem)] rounded-2xl rounded-br-sm border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold leading-snug text-slate-800 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.25)] transition-shadow group-hover:border-[#FF5722]/35 group-hover:shadow-[0_12px_32px_-10px_rgba(255,87,34,0.22)] sm:max-w-xs sm:px-4 sm:py-3 sm:text-sm"
              >
                {QUOTES[quoteIndex]}
                <span
                  className="absolute -bottom-[6px] right-8 size-3 rotate-45 border-b border-r border-slate-200 bg-white transition-colors group-hover:border-[#FF5722]/35"
                  aria-hidden
                />
              </motion.span>
            ) : null}
          </AnimatePresence>

          <span
            className="relative shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm"
            style={{ width: 64, height: WINDOW_H }}
          >
            <motion.span
              initial={{ y: HIDDEN_Y }}
              whileInView={{ y: ducked ? HIDDEN_Y : PEEK_Y }}
              viewport={{ once: false, margin: "-20px" }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 230, damping: 20 }
              }
              className="absolute left-1/2 top-0 flex -translate-x-1/2 justify-center will-change-transform"
            >
              <InteractiveLogo className="h-[68px] w-[68px]" />
            </motion.span>
          </span>
        </button>
      </div>
    </div>
  );
}
