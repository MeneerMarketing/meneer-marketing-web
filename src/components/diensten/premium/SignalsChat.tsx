"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

interface SignalsChatProps {
  signals: string[];
  ctaHref: string;
}

function Bubble({
  children,
  index,
  reduce,
}: {
  children: React.ReactNode;
  index: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 20,
        delay: 0.22 * index,
      }}
      className="flex items-end gap-2.5"
      style={{ transformOrigin: "bottom left" }}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm"
        aria-hidden
      >
        <InteractiveLogo className="h-7 w-7" />
      </span>
      <p className="max-w-[85%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-snug text-slate-800 shadow-sm">
        {children}
      </p>
    </motion.div>
  );
}

/**
 * De intake als live gesprek: Meneer Marketing stelt zijn vragen in
 * chat-bubbels, met zijn eigen kop (ogen volgen je cursor) als avatar.
 */
export function SignalsChat({ signals, ctaHref }: SignalsChatProps) {
  const reduce = useReducedMotion();
  const closingIndex = signals.length;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-[0_24px_48px_-32px_rgba(15,23,42,0.35)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:28px_28px]"
        aria-hidden
      />

      {/* Chat-header */}
      <div className="relative flex items-center gap-3 border-b border-slate-200 bg-white/80 px-5 py-3.5 backdrop-blur-sm">
        <span className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white">
          <InteractiveLogo className="h-8 w-8" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold tracking-tight text-slate-900">
            Meneer Marketing
          </p>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
            <span className="relative flex size-1.5" aria-hidden>
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            stelt de juiste vragen
          </p>
        </div>
      </div>

      {/* Bubbels */}
      <div className="relative space-y-3.5 px-5 py-6 sm:px-7">
        {signals.map((signal, index) => (
          <Bubble key={signal} index={index} reduce={!!reduce}>
            {signal}
          </Bubble>
        ))}

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 20,
            delay: 0.22 * closingIndex,
          }}
          className="flex justify-end"
        >
          <p className="max-w-[85%] rounded-2xl rounded-br-md bg-slate-900 px-4 py-3 text-sm font-medium leading-snug text-white shadow-md">
            En met die antwoorden weet ik precies welke route bij jou past.
          </p>
        </motion.div>
      </div>

      {/* Antwoordbalk */}
      <div className="relative border-t border-slate-200 bg-white/80 px-5 py-4 backdrop-blur-sm sm:px-7">
        <Link
          href={ctaHref}
          className="group flex items-center justify-between gap-3 rounded-full border border-slate-200 bg-white py-2 pl-5 pr-2 shadow-sm transition-colors hover:border-[#FF5722]/50"
        >
          <span className="text-sm font-medium text-slate-400 transition-colors group-hover:text-slate-600">
            Antwoorden mag gewoon in een gesprek…
          </span>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FF5722] text-white transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="size-4" aria-hidden />
          </span>
        </Link>
      </div>
    </div>
  );
}
