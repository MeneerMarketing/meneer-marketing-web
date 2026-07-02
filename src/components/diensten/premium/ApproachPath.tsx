"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Code2, Compass, PenTool, Rocket } from "lucide-react";
import { useRef } from "react";

export interface ApproachStep {
  title: string;
  body: string;
}

const STEP_ICONS = [Compass, PenTool, Code2, Rocket] as const;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * "Zo pakken we het aan" als route in plaats van gestapelde blokken:
 * een oranje lijn die meetekent met je scroll, met stations onderweg.
 */
export function ApproachPath({ steps }: { steps: ApproachStep[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 78%", "end 70%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  return (
    <ol ref={ref} className="relative mt-10 space-y-9 pl-14">
      <span
        className="absolute bottom-3 left-[22px] top-3 w-px bg-slate-200"
        aria-hidden
      />
      <motion.span
        style={{ scaleY: reduce ? 1 : scaleY }}
        className="absolute bottom-3 left-[22px] top-3 w-px origin-top bg-[#FF5722]"
        aria-hidden
      />
      {steps.map((step, index) => {
        const Icon = STEP_ICONS[index % STEP_ICONS.length];
        return (
          <motion.li
            key={step.title}
            initial={reduce ? false : { opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.5, delay: 0.06 * index, ease: EASE }}
            className="group relative"
          >
            <span
              className="absolute -left-14 top-0 flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors duration-300 group-hover:border-[#FF5722]/50 group-hover:text-[#FF5722]"
              aria-hidden
            >
              <Icon className="size-5" strokeWidth={1.8} />
            </span>
            <div className="rounded-2xl border border-transparent px-4 py-2 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-slate-200 group-hover:bg-white group-hover:shadow-[0_16px_32px_-20px_rgba(15,23,42,0.25)]">
              <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                {step.title}
              </h3>
              <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-slate-600">
                {step.body}
              </p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
