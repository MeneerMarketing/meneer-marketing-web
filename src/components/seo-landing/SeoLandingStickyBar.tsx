"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { siteCtas } from "@/lib/cta";

const SHOW_AFTER = 420;

interface SeoLandingStickyBarProps {
  readonly keyword: string;
}

/**
 * Sticky conversiebar op SEO-landings. Verschijnt na scroll, weg bij footer.
 */
export function SeoLandingStickyBar({ keyword }: SeoLandingStickyBarProps) {
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
          className="fixed inset-x-0 bottom-3 z-40 flex justify-center px-4 sm:bottom-5 sm:px-6"
          style={{ willChange: "transform" }}
        >
          <div className="pointer-events-auto flex w-full max-w-4xl items-center gap-2.5 rounded-full border border-slate-200 bg-white/95 py-2 pl-2.5 pr-2 shadow-[0_10px_40px_rgba(15,23,42,0.16)] backdrop-blur-lg sm:gap-4 sm:py-2.5 sm:pl-4 sm:pr-2.5">
            <InteractiveLogo className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" interactive={false} />

            <p className="min-w-0 flex-1 truncate text-[13px] font-bold leading-snug text-slate-900 sm:text-sm">
              <span className="whitespace-nowrap">Interesse in {keyword}?</span>
              <span className="hidden font-medium text-slate-500 lg:inline">
                {" "}
                Plan je intake. Ik denk mee.
              </span>
            </p>

            <Link
              href={siteCtas.contact.href}
              className="hidden shrink-0 items-center gap-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:border-slate-300 md:inline-flex"
            >
              {siteCtas.contact.label}
            </Link>
            <Link
              href={siteCtas.startIntake.href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FF5722] px-4 py-2.5 text-[13px] font-bold text-white shadow-md shadow-orange-500/30 transition hover:bg-orange-600 sm:text-sm"
            >
              {siteCtas.startIntake.label}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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
