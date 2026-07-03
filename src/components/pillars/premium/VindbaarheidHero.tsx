"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

const SURFACES = [
  { id: "google", label: "Google", sub: "SEO", angle: -90, color: "#0F172A" },
  { id: "ai", label: "AI-zoek", sub: "ChatGPT", angle: -18, color: "#38BDF8" },
  { id: "maps", label: "Maps", sub: "Lokaal", angle: 54, color: "#34D399" },
  { id: "reviews", label: "Reviews", sub: "Trust", angle: 126, color: "#FBBF24" },
  { id: "content", label: "Content", sub: "Autoriteit", angle: 198, color: "#FF5722" },
] as const;

type SurfaceId = (typeof SURFACES)[number]["id"];

const BASE_X = 6;
const BASE_Z = -4;
const RADIUS = 108;

/**
 * Hero voor Vindbaarheid: vijf zoekvlakken rond een centrale "Gevonden"-badge.
 * Tik of hover om te zien waar je klant je kan vinden.
 */
export function VindbaarheidHero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<SurfaceId | null>("google");

  const mx = useMotionValue(BASE_X);
  const my = useMotionValue(BASE_Z);
  const tiltX = useSpring(mx, { stiffness: 115, damping: 18 });
  const tiltZ = useSpring(my, { stiffness: 115, damping: 18 });

  function onMove(e: ReactMouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(BASE_X + py * -5);
    my.set(BASE_Z + px * 7);
  }

  function onLeave() {
    mx.set(BASE_X);
    my.set(BASE_Z);
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[440px] select-none"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute -right-4 top-0 size-40 rounded-full bg-sky-300/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-4 -left-4 size-36 rounded-full bg-[#FF5722]/12 blur-3xl"
        aria-hidden
      />

      <div className="relative h-[370px] [perspective:1200px]">
        <motion.div
          style={{
            rotateX: reduce ? BASE_X : tiltX,
            rotateZ: reduce ? BASE_Z : tiltZ,
          }}
          className="absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2"
        >
          <svg viewBox="0 0 300 300" className="absolute inset-0 size-full" aria-hidden>
            <circle
              cx="150"
              cy="150"
              r={RADIUS + 8}
              fill="none"
              stroke="rgba(148,163,184,0.25)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
            {SURFACES.map((s) => {
              const rad = (s.angle * Math.PI) / 180;
              const cx = 150 + Math.cos(rad) * RADIUS;
              const cy = 150 + Math.sin(rad) * RADIUS;
              const isActive = active === s.id;
              return (
                <motion.line
                  key={s.id}
                  x1="150"
                  y1="150"
                  x2={cx}
                  y2={cy}
                  stroke={isActive ? s.color : "#E2E8F0"}
                  strokeWidth={isActive ? 2.5 : 1}
                  animate={{ opacity: isActive ? 1 : 0.4 }}
                />
              );
            })}
          </svg>

          <motion.div
            animate={
              reduce
                ? undefined
                : {
                    boxShadow: [
                      "0 0 0 0 rgba(52,211,153,0)",
                      "0 0 0 14px rgba(52,211,153,0.08)",
                      "0 0 0 0 rgba(52,211,153,0)",
                    ],
                  }
            }
            transition={{ duration: 2.6, repeat: Infinity }}
            className="absolute left-1/2 top-1/2 flex size-[88px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-emerald-400/40 bg-white shadow-lg"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-500">
              Status
            </span>
            <span className="text-sm font-extrabold text-slate-900">Gevonden</span>
          </motion.div>

          {SURFACES.map((surface, i) => {
            const rad = (surface.angle * Math.PI) / 180;
            const x = Math.cos(rad) * RADIUS;
            const y = Math.sin(rad) * RADIUS;
            const isActive = active === surface.id;
            return (
              <motion.button
                key={surface.id}
                type="button"
                initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: isActive ? 1.06 : 1 }}
                transition={{ delay: 0.08 * i, type: "spring", stiffness: 260, damping: 18 }}
                onMouseEnter={() => setActive(surface.id)}
                onFocus={() => setActive(surface.id)}
                onClick={() =>
                  setActive((prev) => (prev === surface.id ? null : surface.id))
                }
                className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl border px-2.5 py-2 transition-shadow ${
                  isActive
                    ? "border-transparent bg-white shadow-[0_14px_28px_-10px_rgba(15,23,42,0.35)] ring-2 ring-[#FF5722]/30"
                    : "border-slate-200 bg-white/95 hover:border-slate-300"
                }`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: surface.color }}
                  aria-hidden
                />
                <span className="mt-1 text-[11px] font-extrabold text-slate-800">
                  {surface.label}
                </span>
                <span className="text-[9px] font-semibold text-slate-400">
                  {surface.sub}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className="relative -mt-1 flex flex-wrap justify-center gap-1.5">
        {SURFACES.map((s) => (
          <button
            key={s.id}
            type="button"
            onMouseEnter={() => setActive(s.id)}
            onMouseLeave={() => setActive(null)}
            onClick={() => setActive((prev) => (prev === s.id ? null : s.id))}
            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors ${
              active === s.id
                ? "border-[#FF5722]/40 bg-[#FF5722]/5 text-[#FF5722]"
                : "border-slate-200 text-slate-500"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <motion.div
        animate={reduce ? undefined : { y: [-4, 4] }}
        transition={{ duration: 2.8, repeat: Infinity, repeatType: "mirror" }}
        className="absolute right-0 top-8 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Positie
        </p>
        <p className="text-sm font-extrabold text-emerald-500">Top 3</p>
      </motion.div>

      <motion.div
        animate={reduce ? undefined : { y: [4, -4] }}
        transition={{ duration: 3.1, repeat: Infinity, repeatType: "mirror" }}
        className="absolute left-0 top-24 rounded-xl border border-slate-900 bg-slate-900 px-3 py-2 shadow-lg"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          AI-vermelding
        </p>
        <p className="text-sm font-extrabold text-white">Ja</p>
      </motion.div>
    </div>
  );
}
