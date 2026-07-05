"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Lightbulb } from "lucide-react";
import { useState } from "react";
import type { MarketingFunFact } from "@/data/marketing-fun-facts";

interface SidebarFunFactProps {
  fact: MarketingFunFact;
}

/** Compact feitje voor sidebars op dienstpagina's. */
export function SidebarFunFact({ fact }: SidebarFunFactProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          <Lightbulb className="size-3.5 text-[#FF5722]" aria-hidden />
          Wist je dat?
        </p>
        <Link
          href="/weetjes"
          className="text-[11px] font-bold text-[#FF5722] transition hover:text-slate-900"
        >
          Meer
        </Link>
      </div>

      <p
        className="mt-3 text-4xl font-black tracking-tighter"
        style={{ color: fact.accent }}
      >
        {fact.stat}
      </p>
      <p className="mt-1.5 text-sm font-bold leading-snug text-slate-900">
        {fact.teaser}
      </p>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.25 }}
        className="overflow-hidden"
      >
        <p className="pt-3 text-sm leading-relaxed text-slate-600">{fact.body}</p>
        <Link
          href={fact.href}
          className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#FF5722] hover:text-slate-900"
        >
          {fact.linkLabel}
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </motion.div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 text-xs font-semibold text-slate-400 transition hover:text-slate-700"
        aria-expanded={open}
      >
        {open ? "Minder" : "Lees het hele verhaal"}
      </button>
    </div>
  );
}
