"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LayoutTemplate } from "lucide-react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import type { OverStoryChapter } from "@/data/over-index";

function SoloScene({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const on = active || !!reduce;

  return (
    <div className="relative flex h-44 items-center justify-center">
      <motion.div
        animate={on ? { scale: 1 } : { scale: 0.92 }}
        className="flex flex-col items-center gap-3"
      >
        <InteractiveLogo className="h-16 w-16" />
        <div className="flex flex-wrap justify-center gap-1.5">
          {["Strategie", "Code", "Ads"].map((chip, i) => (
            <motion.span
              key={chip}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={on ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 4 }}
              transition={{ delay: 0.08 * i }}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm"
            >
              {chip}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ContrastScene({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const on = active || !!reduce;

  return (
    <div className="grid h-44 grid-cols-2 gap-3 p-4">
      <motion.div
        animate={on ? { opacity: 0.35, scale: 0.95 } : { opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 p-3"
      >
        <LayoutTemplate className="size-8 text-red-400" aria-hidden />
        <p className="mt-2 text-center text-[10px] font-bold text-red-500">Template</p>
        <p className="text-[9px] text-red-400">+ 12 plugins</p>
      </motion.div>
      <motion.div
        animate={on ? { opacity: 1, scale: 1 } : { opacity: 0.5, scale: 0.92 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-[#FF5722]/30 bg-[#FF5722]/5 p-3"
      >
        <span className="font-mono text-[10px] font-bold text-emerald-600">{"</>"}</span>
        <p className="mt-2 text-center text-[10px] font-bold text-slate-800">From scratch</p>
        <p className="text-[9px] text-slate-500">snel & schaalbaar</p>
      </motion.div>
    </div>
  );
}

function StackScene({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const on = active || !!reduce;
  const items = ["Shopify", "SEO", "Google Ads", "Meta Ads"];

  return (
    <div className="flex h-44 flex-col items-center justify-center gap-2 p-4">
      <div className="grid w-full max-w-[220px] grid-cols-2 gap-2">
        {items.map((item, i) => (
          <motion.div
            key={item}
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={on ? { opacity: 1, scale: 1 } : { opacity: 0.35, scale: 0.92 }}
            transition={{ delay: 0.06 * i }}
            className="rounded-xl border border-slate-200 bg-white px-2 py-3 text-center text-[10px] font-bold text-slate-700 shadow-sm"
          >
            {item}
          </motion.div>
        ))}
      </div>
      <motion.p
        animate={on ? { opacity: 1 } : { opacity: 0 }}
        className="text-[10px] font-bold text-[#FF5722]"
      >
        alles gekoppeld
      </motion.p>
    </div>
  );
}

function PartnerScene({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const on = active || !!reduce;

  return (
    <div className="flex h-44 items-center justify-center gap-4 p-4">
      <motion.div
        animate={on ? { x: 0 } : { x: -8 }}
        className="flex size-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-black text-slate-400 shadow-sm"
      >
        Jij
      </motion.div>
      <motion.div
        animate={on ? { scaleX: 1 } : { scaleX: 0.3 }}
        className="h-0.5 w-10 origin-left rounded-full bg-[#FF5722]"
      />
      <motion.div
        animate={on ? { x: 0 } : { x: 8 }}
        className="flex flex-col items-center gap-1"
      >
        <InteractiveLogo className="h-12 w-12" />
        <span className="text-[9px] font-bold text-slate-500">Meneer</span>
      </motion.div>
    </div>
  );
}

const SCENES = {
  solo: SoloScene,
  contrast: ContrastScene,
  stack: StackScene,
  partner: PartnerScene,
} as const;

export function OverStoryVisual({
  chapter,
  active,
}: {
  chapter: OverStoryChapter;
  active: boolean;
}) {
  const Scene = SCENES[chapter.scene];
  return <Scene active={active} />;
}
