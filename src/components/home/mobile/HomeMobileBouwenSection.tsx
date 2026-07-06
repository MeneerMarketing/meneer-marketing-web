"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { HomeMobileBouwenCaseVisual } from "@/components/home/mobile/HomeMobileBouwenCaseVisual";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import {
  HOME_MOBILE_BOUWEN_CAN_BUILD,
  HOME_MOBILE_BOUWEN_HOT_TAKE,
  HOME_MOBILE_BOUWEN_INTRO,
  HOME_MOBILE_BOUWEN_STORY,
  HOME_MOBILE_BOUWEN_TOOLS,
  type BouwenCaseId,
  type BouwenToolId,
} from "@/data/home-mobile-bouwen";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Mobiele bouw-sectie: vertellend, cases, heet take bij SkinComplete. */
export function HomeMobileBouwenSection() {
  const reduce = useReducedMotion();
  const [tool, setTool] = useState<BouwenToolId>("shopify");
  const [activeCaseId, setActiveCaseId] = useState<BouwenCaseId>("skincomplete");

  const activeTool = HOME_MOBILE_BOUWEN_TOOLS.find((t) => t.id === tool)!;

  return (
    <section
      id="bouwen"
      aria-labelledby="bouwen-mobile-title"
      className="relative overflow-x-clip border-b border-slate-800 bg-slate-950 py-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-16 top-8 size-56 rounded-full bg-[#FF5722]/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto w-full min-w-0 max-w-6xl px-4">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.4, ease: EASE }}
          className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]"
        >
          {HOME_MOBILE_BOUWEN_INTRO.eyebrow}
        </motion.p>

        <motion.h2
          id="bouwen-mobile-title"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ delay: 0.04, duration: 0.45, ease: EASE }}
          className="mt-4 text-pretty text-[clamp(1.75rem,8vw,2.35rem)] font-extrabold leading-[1.05] tracking-tight text-white"
        >
          {HOME_MOBILE_BOUWEN_INTRO.title}{" "}
          <span className="text-[#FF5722]">{HOME_MOBILE_BOUWEN_INTRO.titleAccent}</span>
        </motion.h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ delay: 0.08, duration: 0.45, ease: EASE }}
          className="mt-4 max-w-md text-pretty text-[15px] leading-[1.65] text-slate-400"
        >
          {HOME_MOBILE_BOUWEN_INTRO.lead}
        </motion.p>

        {/* Meneer vertelt */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ delay: 0.1, duration: 0.45, ease: EASE }}
          className="mt-8 flex gap-2.5"
        >
          <InteractiveLogo className="mt-0.5 size-7 shrink-0" interactive={false} />
          <div className="min-w-0 space-y-3">
            {HOME_MOBILE_BOUWEN_STORY.map((line, i) => (
              <motion.p
                key={line}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ delay: 0.04 * i, duration: 0.35, ease: EASE }}
                className={`text-pretty text-sm leading-relaxed tracking-tight ${
                  i === 0 ? "font-bold text-white" : "text-slate-300"
                }`}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* Wat ik kan bouwen */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.14, duration: 0.4 }}
          className="mt-8 -mx-4 overflow-x-auto px-4 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex w-max gap-2">
            {HOME_MOBILE_BOUWEN_CAN_BUILD.map((item) => (
              <li
                key={item}
                className="shrink-0 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold tracking-tight text-white/80"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Tool-kiezer → scrollt case */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ delay: 0.16, duration: 0.4, ease: EASE }}
          className="mt-8"
        >
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
            Voorbeeld live
          </p>
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
            {HOME_MOBILE_BOUWEN_TOOLS.map((t) => {
              const activeTab = tool === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTool(t.id)}
                  className={`rounded-xl px-3 py-2.5 text-left transition-all duration-300 ${
                    activeTab
                      ? "bg-white text-slate-900 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]"
                      : "text-white/60 hover:text-white/85"
                  }`}
                >
                  <span className="block text-sm font-extrabold tracking-tight">{t.label}</span>
                  <span
                    className={`mt-0.5 block text-[10px] font-medium ${
                      activeTab ? "text-slate-500" : "text-white/40"
                    }`}
                  >
                    {t.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ delay: 0.18, duration: 0.45, ease: EASE }}
          className="mt-8"
        >
          <HomeMobileBouwenCaseVisual
            preferredCaseId={activeTool.caseId}
            onActiveCaseChange={setActiveCaseId}
          />

          {activeCaseId === "skincomplete" ? (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 pt-5 ring-1 ring-white/[0.06]"
            >
              <div
                className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#FF5722]/70 to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5722] shadow-[0_0_14px_rgba(255,87,34,0.65)]"
                aria-hidden
              />
              <div className="flex items-start gap-3">
                <InteractiveLogo className="mt-0.5 size-8 shrink-0" interactive={false} />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5722]">
                    Heet take
                  </p>
                  <p className="mt-1.5 text-pretty text-sm font-bold leading-snug tracking-tight text-white/95">
                    {HOME_MOBILE_BOUWEN_HOT_TAKE}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22, duration: 0.4, ease: EASE }}
          className="mt-8"
        >
          <Link
            href="/bouwen"
            className="group inline-flex items-center gap-2 text-sm font-extrabold tracking-tight text-[#FF5722]"
          >
            Meer over bouwen
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
