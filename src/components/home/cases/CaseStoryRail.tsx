"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CasePalette, HomeCase } from "@/data/home-cases";

const BLOCKS = [
  { key: "challenge", label: "De uitdaging" },
  { key: "move", label: "Onze aanpak" },
  { key: "result", label: "Het resultaat" },
] as const;

interface CaseStoryRailProps {
  caseItem: HomeCase;
  palette: CasePalette;
}

/** Volle-breedte verhaalblokken in plaats van smalle 3-kolommen. */
export function CaseStoryRail({ caseItem, palette }: CaseStoryRailProps) {
  const reduce = useReducedMotion();

  return (
    <div className="mt-6 space-y-3">
      {BLOCKS.map((block, index) => {
        const text = caseItem[block.key];
        return (
          <motion.div
            key={block.key}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5"
          >
            <span
              className="absolute inset-y-0 left-0 w-1"
              style={{ backgroundColor: palette.accent }}
              aria-hidden
            />
            <p
              className="pl-3 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: palette.accent }}
            >
              {block.label}
            </p>
            <p className="mt-2 pl-3 text-sm leading-relaxed text-slate-700 sm:text-[15px] sm:leading-relaxed">
              {text}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
