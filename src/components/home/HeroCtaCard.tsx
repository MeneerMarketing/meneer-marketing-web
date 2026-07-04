"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  Hammer,
  Heart,
  Megaphone,
  Rocket,
  Search,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Magnetic } from "@/components/effects/Magnetic";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { siteCtas } from "@/lib/cta";

interface PainOption {
  id: string;
  label: string;
  icon: LucideIcon;
  response: string;
  route: readonly [string, string, string];
}

const PAINS: PainOption[] = [
  {
    id: "start",
    label: "Waar begin ik?",
    icon: Rocket,
    response: "Eerst routekaart. Daarna pas bouwen. Geen twintig kanalen tegelijk.",
    route: ["Plan", "Prioriteit", "Winst"],
  },
  {
    id: "site",
    label: "Site houdt tegen",
    icon: Hammer,
    response: "Traffic zonder conversie is dure scenery. Fix de basis, dan pas harder adverteren.",
    route: ["Site", "Snelheid", "Conv."],
  },
  {
    id: "find",
    label: "Niet gevonden",
    icon: Search,
    response: "Als Google je niet kent, blijven ads ook duur. Vindbaarheid eerst.",
    route: ["SEO", "Content", "AI-zoek"],
  },
  {
    id: "ads",
    label: "Ads zonder winst",
    icon: Megaphone,
    response: "Budget naar klikken is leuk. Naar klanten is beter. Structuur en meting.",
    route: ["Google", "Meta", "ROAS"],
  },
  {
    id: "retain",
    label: "Geen herhaling",
    icon: Heart,
    response: "Nieuwe klant werven is duur sport. Retentie is waar je marge zit.",
    route: ["Mail", "LTV", "Terug"],
  },
];

const CHAOS_LINES: readonly [number, number][] = [
  [0, 2],
  [0, 3],
  [1, 3],
  [1, 4],
  [2, 4],
  [0, 4],
];

/**
 * Interactief bureau: kies je knelpunt, zie de chaos sorteeren, plan het gesprek.
 */
export function HeroCtaCard() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.55);
  const [active, setActive] = useState(PAINS[0].id);
  const pain = PAINS.find((p) => p.id === active) ?? PAINS[0];

  return (
    <div
      className="relative w-full max-w-[480px] [perspective:1200px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative isolate overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_32px_80px_-28px_rgba(15,23,42,0.22)]"
      >
        <DeskGrid />

        <div className="relative z-10 p-6 sm:p-8" style={{ transform: "translateZ(24px)" }}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              meneer.desk
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              <span className="relative flex size-1.5">
                {!reduce ? (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-emerald-500"
                    animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  />
                ) : null}
                <span className="relative size-1.5 rounded-full bg-emerald-500" />
              </span>
              3 plekken Q3
            </span>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <InteractiveLogo className="size-11 shrink-0 sm:size-12" />
            <AnimatePresence mode="wait">
              <motion.div
                key={pain.id}
                initial={reduce ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="relative min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">
                  Meneer zegt
                </p>
                <p className="mt-1 text-sm font-bold leading-snug text-slate-800">
                  {pain.response}
                </p>
                <span
                  aria-hidden
                  className="absolute -left-[6px] top-4 size-3 rotate-45 border-b border-l border-slate-200 bg-slate-50"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Waar knelt het nu?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PAINS.map((p) => {
              const Icon = p.icon;
              const isOn = p.id === active;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(p.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-left text-xs font-bold transition-all ${
                    isOn
                      ? "border-[#FF5722] bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/25"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="size-3.5" strokeWidth={2} aria-hidden />
                  {p.label}
                </button>
              );
            })}
          </div>

          <ChaosToRouteMap activeId={pain.id} route={pain.route} reduce={reduce} />

          <div className="mt-6">
            <Magnetic strength={12} radius={180} wobble={false}>
              <Link
                href={siteCtas.startIntake.href}
                className="group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl bg-slate-900 px-5 py-4 text-left shadow-[0_16px_40px_-16px_rgba(15,23,42,0.55)] transition-shadow hover:shadow-[0_22px_48px_-14px_rgba(255,87,34,0.35)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-1.5 bg-[#FF5722] transition-all duration-500 group-hover:w-2"
                />
                {!reduce ? (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#FF5722]/0 via-[#FF5722]/10 to-[#FF5722]/0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  />
                ) : null}
                <span className="relative z-10 flex flex-col pl-2">
                  <span className="text-base font-extrabold tracking-tight text-white">
                    Leg het op tafel
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 group-hover:text-slate-300">
                    30 min · gratis · jij praat, ik luister
                  </span>
                </span>
                <span className="relative z-10 flex size-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors group-hover:bg-[#FF5722]">
                  <ArrowUpRight
                    className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </Magnetic>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#FF5722]" aria-hidden />
              Reactie binnen 24 uur
            </span>
            <span className="hidden size-1 rounded-full bg-slate-300 sm:inline" aria-hidden />
            <span>Geen verkooppraat</span>
          </div>
        </div>
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -right-6 -z-10 size-36 rounded-full bg-[#FF5722]/15 blur-3xl"
      />
    </div>
  );
}

function DeskGrid() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full opacity-[0.35]"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern id="desk-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path
            d="M 28 0 L 0 0 0 28"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#desk-grid)" />
    </svg>
  );
}

interface ChaosToRouteMapProps {
  activeId: string;
  route: readonly [string, string, string];
  reduce: boolean;
}

function ChaosToRouteMap({ activeId, route, reduce }: ChaosToRouteMapProps) {
  const nodePositions = [
    { x: 18, y: 28 },
    { x: 50, y: 12 },
    { x: 82, y: 30 },
    { x: 28, y: 58 },
    { x: 72, y: 62 },
  ];

  const pipelineX = [14, 50, 86];

  return (
    <div className="relative mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 px-3 py-4">
      <p className="mb-3 text-center font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
        Van knoop · naar route
      </p>

      <svg viewBox="0 0 100 72" className="mx-auto h-[88px] w-full max-w-[320px]" aria-hidden>
        <AnimatePresence mode="wait">
          <motion.g
            key={`chaos-${activeId}`}
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {CHAOS_LINES.map(([a, b], i) => (
              <motion.line
                key={`${a}-${b}`}
                x1={nodePositions[a].x}
                y1={nodePositions[a].y}
                x2={nodePositions[b].x}
                y2={nodePositions[b].y}
                stroke="#475569"
                strokeWidth="0.8"
                strokeDasharray="2 3"
                initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.45 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              />
            ))}
            {nodePositions.map((pos, i) => (
              <motion.circle
                key={`chaos-node-${i}`}
                cx={pos.x}
                cy={pos.y}
                r="3.2"
                fill="#1E293B"
                stroke="#64748B"
                strokeWidth="1"
                initial={reduce ? undefined : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 400, damping: 22 }}
              />
            ))}
          </motion.g>
        </AnimatePresence>

        <motion.g
          initial={reduce ? undefined : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 26 }}
        >
          <line x1="8" y1="68" x2="92" y2="68" stroke="#334155" strokeWidth="0.6" />
          {pipelineX.slice(0, 2).map((x, i) => (
            <motion.line
              key={`pipe-${i}`}
              x1={pipelineX[i]}
              y1="68"
              x2={pipelineX[i + 1]}
              y2="68"
              stroke="#FF5722"
              strokeWidth="2"
              strokeLinecap="round"
              initial={reduce ? undefined : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.25 + i * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
          {pipelineX.map((x, i) => (
            <g key={`step-${route[i]}`}>
              <motion.circle
                cx={x}
                cy="68"
                r="4.5"
                fill="#FF5722"
                initial={reduce ? undefined : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 420, damping: 20 }}
              />
              <text
                x={x}
                y="62"
                textAnchor="middle"
                className="fill-slate-400 text-[6px] font-bold uppercase"
                style={{ fontSize: 6 }}
              >
                {route[i]}
              </text>
            </g>
          ))}
        </motion.g>
      </svg>

      <motion.p
        key={activeId}
        initial={reduce ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-1 text-center text-[10px] font-bold text-slate-400"
      >
        Tik een chip · route past mee
      </motion.p>
    </div>
  );
}
