"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  BarChart3,
  Check,
  Coffee,
  MessageCircle,
  Rocket,
  Send,
  Terminal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { OverDayMoment } from "@/data/over-index";

type DayMood = OverDayMoment["mood"];

interface OverDayVisualProps {
  mood: DayMood;
  accent: string;
  ping: string;
}

function VisualFrame({
  label,
  accent,
  children,
}: {
  label: string;
  accent: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-[240px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-4 shadow-inner sm:min-h-[280px]">
      <p
        className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em]"
        style={{ color: accent }}
      >
        {label}
      </p>
      <div className="relative flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}

function CoffeeVisual({ accent, ping }: { accent: string; ping: string }) {
  const reduce = useReducedMotion();

  return (
    <VisualFrame label="Overnight check" accent={accent}>
      <div className="grid w-full max-w-xs gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <motion.span
            animate={reduce ? undefined : { y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="flex size-11 items-center justify-center rounded-xl bg-[#FF5722]/10 text-[#FF5722]"
          >
            <Coffee className="size-5" strokeWidth={1.8} aria-hidden />
          </motion.span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-400">Status</p>
            <p className="truncate text-xs font-extrabold text-slate-900">{ping}</p>
          </div>
          <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Conv.", value: "+3" },
            { label: "Errors", value: "0" },
            { label: "ROAS", value: "4.1x" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="rounded-lg border border-slate-200 bg-white p-2 text-center"
            >
              <p className="text-[8px] font-bold uppercase text-slate-400">{stat.label}</p>
              <p className="text-sm font-black text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

function CodeVisual({ accent, ping }: { accent: string; ping: string }) {
  const reduce = useReducedMotion();

  return (
    <VisualFrame label="In de zone" accent={accent}>
      <div className="w-full max-w-xs overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-xl">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="size-2 rounded-full bg-red-400/90" aria-hidden />
          <span className="size-2 rounded-full bg-amber-400/90" aria-hidden />
          <span className="size-2 rounded-full bg-emerald-400/90" aria-hidden />
          <span className="ml-1 truncate font-mono text-[9px] text-slate-500">{ping}</span>
        </div>
        <div className="space-y-1 p-3 font-mono text-[9px]">
          <p className="text-violet-400">export default function Hero()</p>
          <p className="text-slate-500">// geen template, wel snel</p>
          <motion.div
            initial={reduce ? false : { width: 0 }}
            animate={{ width: "72%" }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-2 h-1 rounded-full bg-emerald-400/80"
          />
          <p className="flex items-center gap-1 text-emerald-400">
            <Terminal className="size-2.5" aria-hidden />
            build ✓
          </p>
        </div>
      </div>
    </VisualFrame>
  );
}

function ChartVisual({ accent }: { accent: string }) {
  const reduce = useReducedMotion();

  return (
    <VisualFrame label="Eerlijk bijsturen" accent={accent}>
      <div className="w-full max-w-xs rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-end justify-center gap-3">
          {[
            { h: 56, label: "A", active: true },
            { h: 72, label: "B", active: true },
            { h: 28, label: "C", active: false },
          ].map((bar, i) => (
            <div key={bar.label} className="flex flex-col items-center">
              <motion.div
                initial={reduce ? false : { height: 0 }}
                animate={{ height: bar.h }}
                transition={{ delay: 0.1 * i, type: "spring", stiffness: 180 }}
                className={`w-10 rounded-t-md ${bar.active ? "bg-[#4285F4]" : "bg-slate-300 opacity-50"}`}
              />
              <p className="mt-1 text-[9px] font-bold text-slate-500">{bar.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-2.5 py-2">
          <TrendingDown className="size-3.5 shrink-0 text-red-500" aria-hidden />
          <p className="text-[9px] font-bold text-red-700">Set C gepauzeerd. Budget naar A.</p>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-2">
          <TrendingUp className="size-3.5 shrink-0 text-emerald-600" aria-hidden />
          <p className="text-[9px] font-bold text-emerald-800">ROAS omhoog. Geen gevoel, wel cijfers.</p>
        </div>
      </div>
    </VisualFrame>
  );
}

function CallVisual({ accent, ping }: { accent: string; ping: string }) {
  const reduce = useReducedMotion();

  return (
    <VisualFrame label="Update zonder jargon" accent={accent}>
      <div className="w-full max-w-xs space-y-2">
        <div className="rounded-2xl rounded-tl-sm border border-[#25D366]/30 bg-[#25D366]/10 px-3 py-2.5">
          <p className="text-[9px] font-bold text-[#128C7E]">Meneer Marketing</p>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-1 text-[11px] font-semibold leading-snug text-slate-800"
          >
            {ping}
          </motion.p>
          <p className="mt-1 text-right text-[8px] font-bold text-slate-400">15:02 ✓✓</p>
        </div>
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-700">Top, thanks!</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <MessageCircle className="size-4 text-[#25D366]" aria-hidden />
          <p className="text-[9px] font-bold text-slate-500">Geen slides. Wel antwoord.</p>
        </div>
      </div>
    </VisualFrame>
  );
}

function DeployVisual({ accent }: { accent: string }) {
  const reduce = useReducedMotion();

  return (
    <VisualFrame label="Ship it" accent={accent}>
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="relative flex size-20 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 shadow-lg"
        >
          <Rocket className="size-9 text-emerald-600" strokeWidth={1.6} aria-hidden />
          {!reduce ? (
            <motion.span
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="absolute inset-0 rounded-2xl bg-emerald-400/20"
              aria-hidden
            />
          ) : null}
        </motion.div>
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100 px-4 py-2"
        >
          <Check className="size-4 text-emerald-700" aria-hidden />
          <span className="text-sm font-black text-emerald-800">Live op productie</span>
        </motion.div>
        <p className="text-center text-[10px] font-bold text-slate-500">
          Geen mapje final_v3_definitief_echt.
        </p>
      </div>
    </VisualFrame>
  );
}

export function OverDayVisual({ mood, accent, ping }: OverDayVisualProps) {
  switch (mood) {
    case "coffee":
      return <CoffeeVisual accent={accent} ping={ping} />;
    case "code":
      return <CodeVisual accent={accent} ping={ping} />;
    case "chart":
      return <ChartVisual accent={accent} />;
    case "call":
      return <CallVisual accent={accent} ping={ping} />;
    case "deploy":
      return <DeployVisual accent={accent} />;
    default:
      return <CoffeeVisual accent={accent} ping={ping} />;
  }
}

export function OverDayPingBadge({ ping, accent }: { ping: string; accent: string }) {
  return (
    <span
      className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full border bg-white px-2.5 py-1 text-[9px] font-bold text-slate-600 shadow-sm"
      style={{ borderColor: `${accent}33` }}
    >
      <Send className="size-2.5 shrink-0" style={{ color: accent }} aria-hidden />
      <span className="truncate">{ping}</span>
    </span>
  );
}

export function OverDayMoodDot({ mood, active }: { mood: DayMood; active: boolean }) {
  const icons = {
    coffee: Coffee,
    code: Terminal,
    chart: BarChart3,
    call: MessageCircle,
    deploy: Rocket,
  } as const;
  const Icon = icons[mood];

  return (
    <span
      className={`flex size-10 items-center justify-center rounded-2xl border-2 transition-all ${
        active
          ? "border-[#FF5722] bg-[#FF5722] text-white shadow-[0_8px_24px_-8px_#FF5722]"
          : "border-slate-200 bg-white text-slate-400"
      }`}
    >
      <Icon className="size-4" strokeWidth={active ? 2.2 : 1.8} aria-hidden />
    </span>
  );
}
