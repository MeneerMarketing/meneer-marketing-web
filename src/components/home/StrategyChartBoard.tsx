"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { Flag, Mail, Megaphone, Search, Share2 } from "lucide-react";
import type { MouseEvent as ReactMouseEvent } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const CHANNEL_BADGES = [
  {
    label: "SEO",
    Icon: Search,
    position: "-left-5 top-14",
    tone: "border-cyan-200 text-cyan-600",
    float: [-5, 5] as const,
    duration: 2.8,
    delay: 0.9,
  },
  {
    label: "Google Ads",
    Icon: Megaphone,
    position: "-right-5 top-8",
    tone: "border-orange-200 text-[#FF5722]",
    float: [5, -5] as const,
    duration: 3.2,
    delay: 1.05,
  },
  {
    label: "E-mail",
    Icon: Mail,
    position: "-left-7 bottom-16",
    tone: "border-slate-200 text-slate-700",
    float: [4, -4] as const,
    duration: 2.5,
    delay: 1.2,
  },
  {
    label: "Social",
    Icon: Share2,
    position: "-right-6 bottom-24",
    tone: "border-sky-200 text-sky-600",
    float: [-4, 4] as const,
    duration: 3.0,
    delay: 1.35,
  },
] as const;

const MILESTONES = [
  { x: 38, y: 96, label: "Fundament", delay: 0.75 },
  { x: 120, y: 74, label: "Verkeer", delay: 1.05 },
  { x: 204, y: 38, label: "Omzet", delay: 1.35 },
] as const;

/**
 * Decoratief groeiplan-dashboard: de omzetlijn tekent zichzelf zodra de
 * sectie in beeld komt, mijlpalen ploppen erbij en kanaal-badges zweven
 * eromheen. Kantelt subtiel mee met de muis.
 */
export function StrategyChartBoard() {
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
    rx.set(py * -6);
    ry.set(px * 8);
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
        className="pointer-events-none absolute -left-8 -top-8 size-44 rounded-full bg-[#FF5722]/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -right-6 size-40 rounded-full bg-sky-300/25 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-2xl border border-slate-200 bg-white shadow-[0_32px_64px_-24px_rgba(15,23,42,0.25)]"
      >
        {/* Kop van het plan */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Groeiplan
            </p>
            <p className="text-sm font-extrabold tracking-tight text-slate-900">
              jouwbedrijf.nl
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            Live
          </span>
        </div>

        {/* De grafiek die zichzelf tekent */}
        <div className="p-5">
          <svg viewBox="0 0 240 130" className="w-full" aria-hidden>
            {/* Rasterlijnen */}
            {[26, 58, 90].map((gy) => (
              <line
                key={gy}
                x1="8"
                y1={gy}
                x2="232"
                y2={gy}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="3 5"
              />
            ))}

            {/* Vlakvulling onder de lijn */}
            <motion.path
              d="M10 112 C50 108 70 96 100 84 C134 70 160 58 204 38 L232 26 L232 122 L10 122 Z"
              fill="url(#mm-growth-fill)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: reduce ? 0 : 1.1 }}
            />
            <defs>
              <linearGradient id="mm-growth-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5722" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#FF5722" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* De groeilijn */}
            <motion.path
              d="M10 112 C50 108 70 96 100 84 C134 70 160 58 204 38 L232 26"
              fill="none"
              stroke="#FF5722"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: reduce ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
            />

            {/* Mijlpalen */}
            {MILESTONES.map((m) => (
              <motion.g
                key={m.label}
                initial={reduce ? undefined : { opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 18,
                  delay: reduce ? 0 : m.delay,
                }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <circle cx={m.x} cy={m.y} r="6" fill="#fff" stroke="#FF5722" strokeWidth="2.5" />
                <circle cx={m.x} cy={m.y} r="2.2" fill="#FF5722" />
                <text
                  x={m.x}
                  y={m.y - 12}
                  textAnchor="middle"
                  className="fill-slate-500"
                  style={{ fontSize: 9, fontWeight: 700 }}
                >
                  {m.label}
                </text>
              </motion.g>
            ))}
          </svg>

          {/* Onderin: waar het plan op stuurt */}
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[
              { label: "Kanalen", value: "Op maat" },
              { label: "Volgorde", value: "Slim" },
              { label: "Sturen op", value: "Omzet" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={reduce ? undefined : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, ease: EASE, delay: reduce ? 0 : 0.5 + i * 0.12 }}
                className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5"
              >
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  {item.label}
                </p>
                <p className="text-xs font-extrabold text-slate-900">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Finish-vlag */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0, rotate: -12 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 300, damping: 16, delay: reduce ? 0 : 1.7 }}
          className="absolute -right-4 -top-4 flex size-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg"
          style={{ transform: "translateZ(45px)" }}
        >
          <Flag className="size-5" aria-hidden />
        </motion.div>

        {/* Zwevende kanaal-badges */}
        {CHANNEL_BADGES.map((badge) => (
          <motion.div
            key={badge.label}
            initial={reduce ? undefined : { opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 18,
              delay: reduce ? 0 : badge.delay,
            }}
            className={`absolute ${badge.position}`}
            style={{ transform: "translateZ(40px)" }}
          >
            <motion.span
              animate={reduce ? undefined : { y: [...badge.float] }}
              transition={
                reduce
                  ? undefined
                  : {
                      duration: badge.duration,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    }
              }
              className={`inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-[11px] font-bold shadow-md ${badge.tone}`}
            >
              <badge.Icon className="size-3.5" aria-hidden />
              {badge.label}
            </motion.span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
