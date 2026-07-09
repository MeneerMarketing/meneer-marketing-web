"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

interface MobileNavToggleProps {
  open: boolean;
  onClick: () => void;
}

/** Compact menu-knop, één kleur, morph naar X. */
export function MobileNavToggle({ open, onClick }: MobileNavToggleProps) {
  const reduce = useReducedMotion() ?? false;
  const barColor = open ? "bg-white" : "bg-slate-900";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="mobile-nav"
      aria-label={open ? "Menu sluiten" : "Menu openen"}
      className={`inline-flex size-9 items-center justify-center rounded-xl border transition-[border-color,background-color,box-shadow] duration-200 lg:hidden ${
        open
          ? "border-[#FF5722] bg-[#FF5722] shadow-sm shadow-orange-500/25"
          : "border-slate-200 bg-white shadow-sm hover:border-slate-300"
      }`}
    >
      <span className="flex size-4 flex-col items-center justify-center" aria-hidden>
        <motion.span
          animate={
            reduce
              ? undefined
              : open
                ? { rotate: 45, y: 5, width: 14 }
                : { rotate: 0, y: 0, width: 14 }
          }
          transition={{ duration: 0.22, ease: EASE }}
          className={`block h-[1.5px] rounded-full ${barColor}`}
          style={{ width: 14 }}
        />
        <motion.span
          animate={
            reduce
              ? undefined
              : open
                ? { opacity: 0, scaleX: 0 }
                : { opacity: 1, scaleX: 1 }
          }
          transition={{ duration: 0.15, ease: EASE }}
          className={`my-[3.5px] block h-[1.5px] rounded-full ${barColor}`}
          style={{ width: 14 }}
        />
        <motion.span
          animate={
            reduce
              ? undefined
              : open
                ? { rotate: -45, y: -5, width: 14 }
                : { rotate: 0, y: 0, width: 14 }
          }
          transition={{ duration: 0.22, ease: EASE }}
          className={`block h-[1.5px] rounded-full ${barColor}`}
          style={{ width: 14 }}
        />
      </span>
    </button>
  );
}
