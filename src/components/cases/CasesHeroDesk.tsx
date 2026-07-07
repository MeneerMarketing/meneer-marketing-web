"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { CASES_PAGE_HERO } from "@/data/cases-page";

const EASE = [0.22, 1, 0.36, 1] as const;
const { console: desk } = CASES_PAGE_HERO;

export function CasesHeroDesk() {
  const reduce = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(reduce ? desk.lines.length : 0);
  const [year, setYear] = useState(2012);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setYear((y) => (y >= 2026 ? 2012 : y + 1));
    }, 90);
    return () => window.clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    if (visibleLines >= desk.lines.length) return;
    const t = window.setTimeout(() => setVisibleLines((n) => n + 1), 520);
    return () => window.clearTimeout(t);
  }, [visibleLines, reduce]);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setCursorOn((c) => !c), 530);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/80 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400/90" aria-hidden />
        <span className="size-2.5 rounded-full bg-amber-400/90" aria-hidden />
        <span className="size-2.5 rounded-full bg-emerald-400/90" aria-hidden />
        <span className="ml-1 truncate font-mono text-[10px] text-slate-500">
          {desk.host} — sinds {desk.since}
        </span>
      </div>

      <div className="p-4 font-mono text-[11px] leading-relaxed sm:p-5">
        <div className="mb-4 flex items-end justify-between gap-3 rounded-xl border border-[#FF5722]/20 bg-[#FF5722]/8 px-3 py-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#FF5722]">
              Ervaring
            </p>
            <p className="text-3xl font-black tabular-nums text-white">12+</p>
            <p className="text-[10px] font-bold text-slate-400">jaar marketing</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Sinds
            </p>
            <p className="text-xl font-black tabular-nums text-emerald-400">{year}</p>
            <p className="text-[10px] font-bold text-slate-500">en tellend</p>
          </div>
        </div>

        <div className="space-y-2">
          {desk.lines.slice(0, visibleLines).map((line) => (
            <motion.div
              key={line.key}
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <p className="text-slate-500">
                <span className="text-[#FF5722]">›</span> {line.label}
              </p>
              <p
                className={`pl-3 ${
                  line.key === "nu" ? "font-bold text-[#FF5722]" : "text-slate-200"
                }`}
              >
                {line.value}
              </p>
            </motion.div>
          ))}
          {!reduce && visibleLines < desk.lines.length ? (
            <span className="inline-block h-4 w-2 bg-[#FF5722]/80" aria-hidden />
          ) : (
            <p className="flex items-center gap-1 text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
              online
              <span
                className={`ml-0.5 inline-block h-3.5 w-1.5 bg-slate-400 ${cursorOn ? "opacity-100" : "opacity-0"}`}
                aria-hidden
              />
            </p>
          )}
        </div>

        <p className="mt-4 border-t border-white/10 pt-3 text-[10px] font-semibold italic leading-snug text-slate-500">
          &ldquo;{desk.quip}&rdquo;
        </p>
      </div>
    </div>
  );
}
