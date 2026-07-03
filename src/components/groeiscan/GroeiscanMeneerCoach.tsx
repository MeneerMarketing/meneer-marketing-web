"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

interface GroeiscanMeneerCoachProps {
  message: string;
  compact?: boolean;
}

export function GroeiscanMeneerCoach({ message, compact = false }: GroeiscanMeneerCoachProps) {
  const reduce = useReducedMotion();

  return (
    <div className={`flex items-start gap-3 ${compact ? "" : "rounded-2xl border border-white/10 bg-white/[0.04] p-4"}`}>
      <InteractiveLogo className={`shrink-0 ${compact ? "h-10 w-10" : "h-12 w-12"}`} />
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          initial={reduce ? false : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.25 }}
          className="relative min-w-0 flex-1"
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">
            Meneer zegt
          </p>
          <p
            className={`mt-1 font-bold leading-snug text-slate-200 ${compact ? "text-xs" : "text-sm"}`}
          >
            {message}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
