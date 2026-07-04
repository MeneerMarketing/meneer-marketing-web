"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Gauge, Zap } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const METRICS = [
  { label: "LCP", value: "0,9s", width: 88, delay: 0.15 },
  { label: "INP", value: "98 ms", width: 92, delay: 0.28 },
  { label: "CLS", value: "0,02", width: 95, delay: 0.41 },
] as const;

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
 * Decoratief CWV-dashboard: metrics animeren naar groen, met tilt en
 * zwevende badges. Past bij Snelheid & vindbaarheid hero's.
 */
export function HeroSpeedWindow() {
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
        className="pointer-events-none absolute -left-10 -top-10 size-48 rounded-full bg-emerald-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -right-8 size-40 rounded-full bg-[#FF5722]/15 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-2xl border border-slate-200 bg-white shadow-[0_32px_64px_-24px_rgba(15,23,42,0.25)]"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#FF5722]/80" aria-hidden />
          <span className="size-2.5 rounded-full bg-amber-300" aria-hidden />
          <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
          <span className="ml-2 flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
            <Gauge className="size-3" aria-hidden />
            Core Web Vitals
          </span>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
            Groen
          </span>
        </div>

        <div className="space-y-5 p-5">
          <motion.div
            {...buildIn(0.08, !!reduce)}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pagina
              </p>
              <p className="text-sm font-extrabold text-slate-900">/product/premium-led-mask</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Score
              </p>
              <p className="text-2xl font-extrabold text-emerald-500">94</p>
            </div>
          </motion.div>

          <div className="space-y-3">
            {METRICS.map((metric) => (
              <motion.div key={metric.label} {...buildIn(metric.delay, !!reduce)}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{metric.label}</span>
                  <span className="font-extrabold text-emerald-600">{metric.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.span
                    className="block h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                    initial={reduce ? { width: `${metric.width}%` } : { width: "28%" }}
                    whileInView={{ width: `${metric.width}%` }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.9, delay: metric.delay + 0.1, ease: EASE }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...buildIn(0.55, !!reduce)}
            className="flex flex-wrap gap-2 pt-1"
          >
            {["Fonts getrimd", "Apps: 4", "Images: WebP"].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600"
              >
                {chip}
              </span>
            ))}
          </motion.div>
        </div>

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
            LCP
          </p>
          <p className="text-sm font-extrabold text-emerald-500">0,9 sec</p>
        </motion.div>

        <motion.div
          animate={reduce ? undefined : { y: [6, -6] }}
          transition={
            reduce
              ? undefined
              : { duration: 3.1, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }
          className="absolute -left-6 bottom-14 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 shadow-lg"
          style={{ transform: "translateZ(50px)" }}
        >
          <Zap className="size-3.5 text-[#FF5722]" aria-hidden />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Omzet-pagina
            </p>
            <p className="text-sm font-extrabold text-white">Prioriteit</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
