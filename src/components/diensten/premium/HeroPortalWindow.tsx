"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { Calendar, LayoutGrid, Lock } from "lucide-react";
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
 * Decoratief portaalvenster: login, rollen en agenda/dashboard.
 * Zelfde tilt-interactie als de andere premium dienst-hero's.
 */
export function HeroPortalWindow() {
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
        className="pointer-events-none absolute -left-10 -top-10 size-48 rounded-full bg-violet-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -right-8 size-40 rounded-full bg-[#FF5722]/12 blur-3xl"
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
          <span className="ml-2 flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold text-violet-700">
            <LayoutGrid className="size-3" aria-hidden />
            Portaal
          </span>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
            <Lock className="size-3" aria-hidden />
            Auth
          </span>
        </div>

        <div className="grid grid-cols-2 gap-0">
          {/* Login-kolom */}
          <div className="border-r border-slate-100 bg-slate-50/80 p-4">
            <motion.div {...buildIn(0.1, !!reduce)}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Inloggen
              </p>
              <div className="mt-3 space-y-2">
                <span className="block h-7 rounded-lg border border-slate-200 bg-white" />
                <span className="block h-7 rounded-lg border border-slate-200 bg-white" />
              </div>
              <span className="mt-3 flex h-8 items-center justify-center rounded-lg bg-violet-600 text-[9px] font-bold text-white">
                Toegang
              </span>
            </motion.div>
            <motion.div
              {...buildIn(0.25, !!reduce)}
              className="mt-4 flex flex-wrap gap-1"
            >
              {["Salon", "Admin", "Klant"].map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[8px] font-bold text-violet-700"
                >
                  {role}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Dashboard / agenda */}
          <div className="p-4">
            <motion.div {...buildIn(0.15, !!reduce)} className="flex items-center gap-2">
              <Calendar className="size-3.5 text-violet-600" aria-hidden />
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Agenda
              </span>
            </motion.div>
            <div className="mt-3 space-y-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  {...buildIn(0.2 + i * 0.08, !!reduce)}
                  className="flex items-center gap-2 rounded-lg border border-slate-100 bg-white px-2 py-1.5"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-[#FF5722]" aria-hidden />
                  <span className="h-1.5 flex-1 rounded-full bg-slate-200" />
                </motion.div>
              ))}
            </div>
            <motion.div
              {...buildIn(0.45, !!reduce)}
              className="mt-3 rounded-lg border border-dashed border-violet-200 bg-violet-50/50 px-2 py-2 text-center text-[8px] font-bold text-violet-700"
            >
              API · CRM · Shopify
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.span
        {...buildIn(0.5, !!reduce)}
        className="pointer-events-none absolute -left-3 top-16 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-700 shadow-lg"
      >
        B2B-portaal
      </motion.span>
      <motion.span
        {...buildIn(0.62, !!reduce)}
        className="pointer-events-none absolute -right-2 bottom-20 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-[10px] font-bold text-violet-800 shadow-lg"
      >
        Boekingsapp
      </motion.span>
      <motion.span
        {...buildIn(0.74, !!reduce)}
        className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-emerald-700 shadow-lg"
      >
        Rollen & rechten
      </motion.span>
    </div>
  );
}
