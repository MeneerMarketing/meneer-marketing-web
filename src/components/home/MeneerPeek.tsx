"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { siteCtas } from "@/lib/cta";

const QUOTES = [
  "Footer bereikt. Hier vallen de meeste mensen in slaap. Jij scrollt door. Respect.",
  "Ik wacht hier als een plant. Maar dan eentje die groei kan fixen.",
  "Plot twist: jij kent mij bijna. Ik ken jouw bedrijf nog nul procent. Oneerlijk hè.",
  "Ik ga je niks verkopen wat je niet nodig hebt. Slecht voor mijn omzet. Goed voor jou.",
  "Nog klikken? Dan ben je officieel nieuwsgierig. Dat is mijn favoriete type klant.",
  "Geen chatbot. Geen stagiair. Gewoon ik. Met koffie klaar. Virtueel, maar echt.",
  "Dit was het. Nog één klik en we gaan echt praten.",
] as const;

const BUBBLE_TAIL =
  "absolute -bottom-[6px] left-6 size-3 rotate-45 border-b border-r";

/** Klikbare Meneer-wolk in de footer. Na de laatste quote: oranje CTA. */
export function MeneerPeek() {
  const reduce = useReducedMotion();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showCta, setShowCta] = useState(false);

  function nextQuote() {
    if (quoteIndex >= QUOTES.length - 1) {
      setShowCta(true);
      return;
    }
    setQuoteIndex((i) => i + 1);
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
      <AnimatePresence mode="wait">
        {showCta ? (
          <motion.div
            key="cta"
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-flex max-w-md flex-col gap-2 rounded-2xl rounded-bl-sm border border-[#FF5722]/60 bg-[#FF5722] px-4 py-3.5 shadow-[0_16px_40px_-12px_rgba(255,87,34,0.55)]"
          >
            <p className="text-sm font-bold leading-snug text-white">
              Genoeg quotes. Tijd om echt te praten.
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <Link
                href={siteCtas.groeiscan.href}
                className="group inline-flex items-center gap-1 text-sm font-extrabold text-white underline decoration-white/40 underline-offset-2 transition hover:decoration-white"
              >
                {siteCtas.groeiscan.label}
                <ArrowUpRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
              <span className="text-white/50" aria-hidden>
                ·
              </span>
              <Link
                href={siteCtas.contact.href}
                className="group inline-flex items-center gap-1 text-sm font-extrabold text-white/90 underline decoration-white/25 underline-offset-2 transition hover:text-white hover:decoration-white/60"
              >
                {siteCtas.contact.label}
                <ArrowUpRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
            </div>
            <span
              className={`${BUBBLE_TAIL} border-[#FF5722]/60 bg-[#FF5722]`}
              aria-hidden
            />
          </motion.div>
        ) : (
          <motion.button
            key={`quote-${quoteIndex}`}
            type="button"
            onClick={nextQuote}
            aria-label="Nieuwe quote van Meneer Marketing"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="group cursor-pointer text-left outline-none"
          >
            <span className="relative inline-block max-w-md rounded-2xl rounded-bl-sm border border-slate-600/80 bg-slate-900/90 px-4 py-3 text-sm font-bold leading-snug text-slate-100 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)] transition-colors group-hover:border-[#FF5722]/40 group-hover:text-white">
              {QUOTES[quoteIndex]}
              <span
                className={`${BUBBLE_TAIL} border-slate-600/80 bg-slate-900/90 transition-colors group-hover:border-[#FF5722]/40`}
                aria-hidden
              />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
