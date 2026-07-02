"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { MouseEvent as ReactMouseEvent } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

function buildIn(delay: number, reduce: boolean) {
  if (reduce) return {};
  return {
    initial: { opacity: 0, y: 14, scale: 0.96 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.55, delay, ease: EASE },
  };
}

/**
 * Decoratief browservenster dat zichzelf "from scratch" opbouwt zodra het in
 * beeld komt. Reageert subtiel op de muis (tilt), met zwevende resultaat-badges.
 */
export function HeroBuildWindow() {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 120, damping: 16 });
  const rotateY = useSpring(ry, { stiffness: 120, damping: 16 });

  function onMove(e: ReactMouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rx.set(py * -7);
    ry.set(px * 9);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[440px] [perspective:1200px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute -left-10 -top-10 size-48 rounded-full bg-[#FF5722]/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -right-8 size-40 rounded-full bg-sky-300/20 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-2xl border border-slate-200 bg-white shadow-[0_32px_64px_-24px_rgba(15,23,42,0.25)]"
      >
        {/* Browserbalk */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#FF5722]/80" aria-hidden />
          <span className="size-2.5 rounded-full bg-amber-300" aria-hidden />
          <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
          <span className="ml-3 flex-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold tracking-tight text-slate-400">
            jouwbedrijf.nl
          </span>
        </div>

        {/* Site die zichzelf opbouwt */}
        <div className="space-y-4 p-5">
          <motion.div {...buildIn(0.1, !!reduce)} className="flex items-center gap-3">
            <span className="size-6 rounded-lg bg-slate-900" aria-hidden />
            <span className="h-2 w-12 rounded-full bg-slate-200" aria-hidden />
            <span className="h-2 w-10 rounded-full bg-slate-200" aria-hidden />
            <span className="ml-auto h-6 w-16 rounded-full bg-[#FF5722]" aria-hidden />
          </motion.div>

          <motion.div {...buildIn(0.3, !!reduce)} className="space-y-2 pt-2">
            <span className="block h-4 w-4/5 rounded-full bg-slate-900" aria-hidden />
            <span className="block h-4 w-3/5 rounded-full bg-slate-900" aria-hidden />
            <span className="block h-2 w-2/3 rounded-full bg-slate-200" aria-hidden />
            <span className="block h-2 w-1/2 rounded-full bg-slate-200" aria-hidden />
          </motion.div>

          <motion.div {...buildIn(0.5, !!reduce)} className="flex gap-2 pt-1">
            <span className="h-8 w-28 rounded-full bg-[#FF5722]" aria-hidden />
            <span className="h-8 w-24 rounded-full border-2 border-slate-200 bg-white" aria-hidden />
          </motion.div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[0.65, 0.78, 0.91].map((delay) => (
              <motion.div
                key={delay}
                {...buildIn(delay, !!reduce)}
                className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
              >
                <span className="block h-8 rounded-lg bg-slate-200/80" aria-hidden />
                <span className="block h-1.5 w-4/5 rounded-full bg-slate-200" aria-hidden />
                <span className="block h-1.5 w-3/5 rounded-full bg-slate-200" aria-hidden />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Zwevende resultaat-badges */}
        <motion.div
          animate={reduce ? undefined : { y: [-5, 5] }}
          transition={
            reduce
              ? undefined
              : { duration: 2.6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }
          className="absolute -right-5 top-16 rounded-xl border border-emerald-200 bg-white px-3 py-2 shadow-lg"
          style={{ transform: "translateZ(40px)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Laadtijd
          </p>
          <p className="text-sm font-extrabold text-emerald-500">0,8 sec</p>
        </motion.div>

        <motion.div
          animate={reduce ? undefined : { y: [6, -6] }}
          transition={
            reduce
              ? undefined
              : { duration: 3.1, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }
          className="absolute -left-6 bottom-14 rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 shadow-lg"
          style={{ transform: "translateZ(50px)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Templates gebruikt
          </p>
          <p className="text-sm font-extrabold text-white">Nul</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
