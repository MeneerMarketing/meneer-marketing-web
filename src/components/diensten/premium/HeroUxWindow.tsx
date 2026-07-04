"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { MouseEvent as ReactMouseEvent } from "react";
import { MousePointerClick, PenTool, Smartphone } from "lucide-react";

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
 * Decoratief designvenster: wireframe wordt visueel UI, met CTA-focus
 * en mobiel frame. Zelfde tilt als andere premium dienst-hero's.
 */
export function HeroUxWindow() {
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
        className="pointer-events-none absolute -left-10 -top-10 size-48 rounded-full bg-sky-300/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -right-8 size-40 rounded-full bg-[#FF5722]/15 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_32px_64px_-24px_rgba(15,23,42,0.25)]"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#FF5722]/80" aria-hidden />
          <span className="size-2.5 rounded-full bg-amber-300" aria-hidden />
          <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
          <span className="ml-2 flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-bold text-sky-800">
            <PenTool className="size-3" aria-hidden />
            UI/UX
          </span>
          <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
            Figma
          </span>
        </div>

        <div className="grid grid-cols-[1fr_0.85fr] gap-3 p-4">
          {/* Wireframe kolom */}
          <motion.div
            {...buildIn(0.12, !!reduce)}
            className="space-y-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-3"
          >
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Wireframe
            </p>
            <span className="block h-2 w-3/4 rounded-full bg-slate-300" aria-hidden />
            <span className="block h-2 w-1/2 rounded-full bg-slate-200" aria-hidden />
            <span className="mt-2 block h-16 rounded-lg border border-slate-200 bg-white" aria-hidden />
            <span className="block h-7 w-20 rounded-full border-2 border-dashed border-slate-300 bg-white" aria-hidden />
          </motion.div>

          {/* Visueel design kolom */}
          <motion.div
            {...buildIn(0.28, !!reduce)}
            className="relative space-y-2.5 rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
          >
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Design
            </p>
            <span className="block h-2.5 w-4/5 rounded-full bg-slate-900" aria-hidden />
            <span className="block h-2 w-3/5 rounded-full bg-slate-400" aria-hidden />
            <span className="mt-1 block h-14 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50" aria-hidden />
            <motion.span
              {...buildIn(0.45, !!reduce)}
              className="relative block h-8 w-full rounded-full bg-[#FF5722] shadow-[0_8px_20px_-6px_rgba(255,87,34,0.55)]"
              aria-hidden
            />
            <motion.span
              animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              }
              className="pointer-events-none absolute bottom-5 right-3 flex size-6 items-center justify-center rounded-full border-2 border-[#FF5722] bg-white"
              aria-hidden
            >
              <MousePointerClick className="size-3 text-[#FF5722]" />
            </motion.span>
          </motion.div>
        </div>

        {/* Mobiel preview */}
        <motion.div
          {...buildIn(0.55, !!reduce)}
          className="mx-4 mb-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
            <Smartphone className="size-4 text-slate-600" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Mobiel-first
            </p>
            <p className="truncate text-xs font-semibold text-slate-700">
              Zelfde flow, andere hiërarchie
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            A11y
          </span>
        </motion.div>

        <motion.div
          animate={reduce ? undefined : { y: [-5, 5] }}
          transition={
            reduce
              ? undefined
              : { duration: 2.6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }
          className="absolute -right-5 top-16 rounded-xl border border-[#FF5722]/25 bg-white px-3 py-2 shadow-lg"
          style={{ transform: "translateZ(40px)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Primaire actie
          </p>
          <p className="text-sm font-extrabold text-[#FF5722]">Duidelijk</p>
        </motion.div>

        <motion.div
          animate={reduce ? undefined : { y: [6, -6] }}
          transition={
            reduce
              ? undefined
              : { duration: 3.1, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }
          className="absolute -left-6 bottom-20 rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 shadow-lg"
          style={{ transform: "translateZ(50px)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Handoff
          </p>
          <p className="text-sm font-extrabold text-white">Build-ready</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
