"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Radio, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { WERKWIJZE_HERO } from "@/data/werkwijze-index";
import { siteCtas } from "@/lib/cta";

const STATUS_LINES = [
  { label: "Intake", state: "Klaar voor jouw context" },
  { label: "Routekaart", state: "Wacht op data" },
  { label: "Build", state: "Standby" },
  { label: "Sturen", state: "Standby" },
] as const;

export function WerkwijzeHero() {
  const reduce = useReducedMotion();
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setPulse((p) => (p + 1) % 4), 2800);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <header className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-slate-50/80 to-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-0 size-96 rounded-full bg-[#FF5722]/[0.06] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center lg:gap-12">
          <div>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]"
            >
              {WERKWIJZE_HERO.eyebrow}
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-4 max-w-2xl text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
            >
              {WERKWIJZE_HERO.title}
            </motion.h1>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600"
            >
              {WERKWIJZE_HERO.subtitle}
            </motion.p>
            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.14 }}
              className="mt-4 max-w-lg text-sm italic text-slate-500"
            >
              {WERKWIJZE_HERO.aside}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href={siteCtas.startIntake.href}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5722]/25 transition hover:bg-[#E64A19]"
              >
                {siteCtas.startIntake.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:border-slate-300"
              >
                Contact opnemen
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </motion.div>

            <dl className="mt-10 flex flex-wrap gap-6">
              {WERKWIJZE_HERO.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-extrabold text-slate-900">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-[0_32px_64px_-24px_rgba(15,23,42,0.45)]"
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="size-2.5 rounded-full bg-[#FF5722]" aria-hidden />
              <span className="size-2.5 rounded-full bg-amber-400" aria-hidden />
              <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
              <span className="ml-2 font-mono text-[10px] text-slate-500">traject.live</span>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                <Radio className="size-3" aria-hidden />
                Live
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <InteractiveLogo className="size-10 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Jouw traject
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Wacht op jouw intake. Daarna gaat het snel.
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {STATUS_LINES.map((line, i) => {
                  const active = i === pulse;
                  const done = i < pulse;
                  return (
                    <motion.li
                      key={line.label}
                      animate={
                        active && !reduce
                          ? { borderColor: "rgba(255,87,34,0.5)", backgroundColor: "rgba(255,87,34,0.08)" }
                          : { borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)" }
                      }
                      className="flex items-center gap-3 rounded-xl border px-3 py-2.5"
                    >
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-lg ${
                          done
                            ? "bg-emerald-500/20 text-emerald-400"
                            : active
                              ? "bg-[#FF5722]/20 text-[#FF5722]"
                              : "bg-white/5 text-slate-500"
                        }`}
                      >
                        {done ? (
                          <Check className="size-3.5" strokeWidth={3} aria-hidden />
                        ) : (
                          <span
                            className={`size-2 rounded-full ${active ? "bg-[#FF5722]" : "bg-slate-600"}`}
                            aria-hidden
                          />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white">{line.label}</p>
                        <p className="truncate text-[10px] text-slate-500">{line.state}</p>
                      </div>
                      {active ? (
                        <Timer className="size-3.5 shrink-0 text-[#FF5722]" aria-hidden />
                      ) : null}
                    </motion.li>
                  );
                })}
              </ul>

              <p className="mt-4 text-center text-[10px] font-medium text-slate-500">
                Animatie ter illustratie. Jouw volgorde bepalen we samen.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
