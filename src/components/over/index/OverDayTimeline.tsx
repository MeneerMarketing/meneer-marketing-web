"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import {
  OverDayMoodDot,
  OverDayPingBadge,
  OverDayVisual,
} from "@/components/over/index/OverDayVisuals";
import { OVER_DAY } from "@/data/over-index";

const EASE = [0.22, 1, 0.36, 1] as const;

function DayClock({ time, timeLabel, progress }: { time: string; timeLabel: string; progress: number }) {
  const [h, m] = time.split(":").map(Number);
  const hourAngle = ((h ?? 0) % 12) * 30 + (m ?? 0) * 0.5;
  const minuteAngle = (m ?? 0) * 6;

  return (
    <div className="relative mx-auto size-36 sm:size-40">
      <svg viewBox="0 0 160 160" className="size-full" aria-hidden>
        <circle cx="80" cy="80" r="74" fill="white" stroke="#E2E8F0" strokeWidth="2" />
        <circle
          cx="80"
          cy="80"
          r="74"
          fill="none"
          stroke="#FF5722"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${progress * 4.65} 465`}
          transform="rotate(-90 80 80)"
          opacity="0.35"
        />
        <line
          x1="80"
          y1="80"
          x2="80"
          y2="42"
          stroke="#0F172A"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 80 80)`}
        />
        <line
          x1="80"
          y1="80"
          x2="80"
          y2="28"
          stroke="#FF5722"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 80 80)`}
        />
        <circle cx="80" cy="80" r="4" fill="#FF5722" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <p className="text-2xl font-black tabular-nums text-slate-900">{time}</p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">{timeLabel}</p>
      </div>
    </div>
  );
}

function MomentCard({
  moment,
  isActive,
  compact,
}: {
  moment: (typeof OVER_DAY)[number];
  isActive: boolean;
  compact?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      animate={{ opacity: isActive ? 1 : 0.45, scale: isActive ? 1 : 0.98 }}
      transition={{ duration: 0.28, ease: EASE }}
      className={`rounded-3xl border bg-white transition-shadow ${
        isActive
          ? "border-[#FF5722]/25 shadow-[0_24px_48px_-24px_#FF572266]"
          : "border-slate-200 shadow-sm"
      } ${compact ? "p-5" : "overflow-hidden"}`}
    >
      {!compact ? (
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <OverDayVisual mood={moment.mood} accent={moment.accent} ping={moment.ping} />
        </div>
      ) : null}

      <div className={compact ? "" : "p-5 sm:p-6"}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black tabular-nums text-slate-700">
            {moment.time}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {moment.timeLabel}
          </span>
        </div>

        <h3 className="mt-3 text-pretty text-lg font-extrabold text-slate-900 sm:text-xl">
          {moment.title}
        </h3>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
          {moment.body}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {moment.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500"
            >
              {chip}
            </span>
          ))}
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: isActive ? 1 : 0.7, y: 0 }}
          className="relative mt-5 overflow-hidden rounded-2xl border border-[#FF5722]/20 bg-gradient-to-br from-[#FF5722]/8 to-orange-50/50 px-4 py-3.5"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
            Meneer zegt
          </p>
          <p className="mt-1.5 text-pretty text-sm font-bold leading-snug text-slate-800">
            &ldquo;{moment.quip}&rdquo;
          </p>
        </motion.div>

        {compact ? (
          <div className="mt-4">
            <OverDayVisual mood={moment.mood} accent={moment.accent} ping={moment.ping} />
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

export function OverDayTimeline() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const moment = OVER_DAY[active]!;
  const progress = (active + 1) / OVER_DAY.length;

  return (
    <section
      id="over-day"
      className="relative overflow-hidden border-b border-slate-200 bg-[#FEFCFC]"
      aria-labelledby="over-day-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #FF572208 0%, transparent 45%), radial-gradient(circle at 80% 80%, #4285F408 0%, transparent 40%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, #0F172A 1px, transparent 1px), linear-gradient(to bottom, #0F172A 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="lg:grid lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Achter de schermen
            </p>
            <h2
              id="over-day-heading"
              className="mt-3 max-w-2xl text-pretty text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
            >
              Zo ziet mijn dag eruit.{" "}
              <span className="text-slate-400">Geen hustle-porn.</span>
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-slate-600">
              Tik een moment en zie wat ik doe. Geen mystiek, wel ritme. Zo weet je waar je tijd
              en budget naartoe gaan als we samenwerken.
            </p>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 hidden max-w-xs rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:mt-0 lg:block"
          >
            <div className="flex items-start gap-3">
              <InteractiveLogo className="size-9 shrink-0" interactive={false} />
              <p className="text-xs font-semibold italic leading-relaxed text-slate-500">
                &ldquo;Ik film mezelf niet met laptop op het strand. Dit is het echte
                werk.&rdquo;
              </p>
            </div>
          </motion.div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="mt-10 space-y-6 lg:hidden">
          {OVER_DAY.map((item) => (
            <MomentCard key={item.id} moment={item} isActive compact />
          ))}
        </div>

        {/* Desktop: klik door de dag, geen lege scroll-ruimte */}
        <div className="mt-12 hidden lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10">
          <div className="flex flex-col">
            <DayClock time={moment.time} timeLabel={moment.timeLabel} progress={progress} />

            <div className="relative mt-8 flex flex-col gap-1 pl-1">
              <span
                className="absolute bottom-4 left-[1.35rem] top-4 w-px bg-slate-200"
                aria-hidden
              />
              <motion.span
                className="absolute left-[1.35rem] top-4 w-px origin-top bg-[#FF5722]"
                aria-hidden
                animate={{ height: `${(active / (OVER_DAY.length - 1)) * 100}%` }}
                style={{ maxHeight: "calc(100% - 2rem)" }}
                transition={{ duration: 0.35, ease: EASE }}
              />

              {OVER_DAY.map((item, index) => {
                const isActive = active === index;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-pressed={isActive}
                    className="group relative z-10 flex w-full items-start gap-4 rounded-2xl py-3 pl-0 pr-2 text-left transition hover:bg-white/60"
                  >
                    <OverDayMoodDot mood={item.mood} active={isActive} />
                    <span className="min-w-0 flex-1 pt-0.5">
                      <span className="text-[10px] font-bold tabular-nums text-slate-400">
                        {item.time}
                      </span>
                      <span
                        className={`mt-0.5 block text-sm font-extrabold transition ${
                          isActive ? "text-[#FF5722]" : "text-slate-800 group-hover:text-slate-900"
                        }`}
                      >
                        {item.title}
                      </span>
                      {isActive ? (
                        <motion.span
                          initial={reduce ? false : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-2 block"
                        >
                          <OverDayPingBadge ping={item.ping} accent={item.accent} />
                        </motion.span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              {OVER_DAY.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={item.title}
                  aria-current={active === index ? "step" : undefined}
                  className={`h-1.5 rounded-full transition-all ${
                    active === index ? "w-6 bg-[#FF5722]" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={moment.id}
                initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <MomentCard moment={moment} isActive />
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActive((i) => Math.max(0, i - 1))}
                disabled={active === 0}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-300 disabled:opacity-30"
              >
                Vorige
              </button>
              <p className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {active + 1} / {OVER_DAY.length}
              </p>
              <button
                type="button"
                onClick={() => setActive((i) => Math.min(OVER_DAY.length - 1, i + 1))}
                disabled={active === OVER_DAY.length - 1}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-300 disabled:opacity-30"
              >
                Volgende
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
