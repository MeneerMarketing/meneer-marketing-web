"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { siteCtas } from "@/lib/cta";

/** Vanaf hoeveel px scrollen de bar verschijnt */
const SHOW_AFTER = 560;

interface DienstStickyBarProps {
  /** Naam van de dienst, voor een persoonlijke tekst in de bar */
  dienstName?: string;
}

/**
 * Sticky conversiebar onderaan dienstpagina's. Verschijnt na het scrollen,
 * verdwijnt netjes bij de footer en is wegklikbaar. Meneer kijkt mee.
 */
export function DienstStickyBar({ dienstName }: DienstStickyBarProps) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let nearFooter = false;
    let scrolledEnough = false;

    const sync = () => setVisible(scrolledEnough && !nearFooter);

    function onScroll() {
      scrolledEnough = window.scrollY > SHOW_AFTER;
      sync();
    }

    const footer = document.querySelector("footer");
    const observer = footer
      ? new IntersectionObserver(
          ([entry]) => {
            nearFooter = entry.isIntersecting;
            sync();
          },
          { rootMargin: "120px" },
        )
      : null;
    if (footer && observer) observer.observe(footer);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const show = visible && !dismissed;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={reduce ? { opacity: 0 } : { y: 96, opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: 96, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 sm:bottom-5 sm:px-6"
          style={{ willChange: "transform" }}
        >
          <div className="pointer-events-auto flex w-full max-w-xl items-center gap-2.5 rounded-full border border-mm-border bg-white/92 py-2 pl-2.5 pr-2 shadow-[0_10px_40px_rgba(15,23,42,0.16)] backdrop-blur-lg sm:gap-4 sm:py-2.5 sm:pl-4 sm:pr-2.5 lg:max-w-3xl">
            <div className="relative shrink-0">
              <InteractiveLogo className="h-9 w-9 sm:h-10 sm:w-10" />
              <span className="absolute -right-0.5 top-0 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-white bg-emerald-500" />
              </span>
            </div>

            <p className="min-w-0 flex-1 truncate text-[13px] font-bold leading-snug text-mm-text sm:text-sm">
              <span className="whitespace-nowrap">Zin om te groeien?</span>
              <span className="hidden font-medium text-mm-muted lg:inline">
                {" "}
                {dienstName
                  ? `Meneer denkt graag mee over ${dienstName.toLowerCase()}.`
                  : "Meneer denkt graag met je mee."}
              </span>
            </p>

            <Link
              href={siteCtas.groeiscan.href}
              className="hidden shrink-0 items-center gap-1 rounded-full border border-mm-border px-4 py-2.5 text-sm font-bold text-mm-text transition hover:border-mm-sky-deep/40 hover:text-mm-sky-deep md:inline-flex"
            >
              {siteCtas.groeiscan.label}
            </Link>
            <Link
              href={siteCtas.projectStarten.href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-mm-accent px-4 py-2.5 text-[13px] font-bold text-white shadow-md shadow-mm-accent/30 transition hover:bg-mm-accent-hover sm:text-sm"
            >
              {siteCtas.projectStarten.label}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-mm-muted transition hover:bg-mm-surface hover:text-mm-text"
              aria-label="Balk sluiten"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
