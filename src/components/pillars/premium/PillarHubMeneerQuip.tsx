"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

interface PillarHubMeneerQuipProps {
  readonly quip: string;
  readonly logoClassName?: string;
}

/**
 * Meneer-quip onder hub-illustraties: officieel InteractiveLogo, geen afwijkend poppetje.
 */
export function PillarHubMeneerQuip({
  quip,
  logoClassName = "size-14 shrink-0",
}: PillarHubMeneerQuipProps) {
  const reduce = useReducedMotion();

  return (
    <div className="mt-5 flex items-end gap-3 border-t border-slate-100 pt-4">
      <InteractiveLogo className={logoClassName} interactive={false} />
      <AnimatePresence mode="wait">
        <motion.div
          key={quip}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="relative min-w-0 flex-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm"
        >
          <p className="text-[11px] font-semibold leading-snug text-slate-700 sm:text-xs">
            {quip}
          </p>
          <span
            aria-hidden
            className="absolute -bottom-1.5 left-4 size-2.5 rotate-45 border-b border-l border-slate-200 bg-white"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
