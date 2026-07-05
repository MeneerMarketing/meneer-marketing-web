"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Ban,
  Check,
  Code2,
  LayoutTemplate,
  Mail,
  Palette,
  TrendingUp,
  X,
} from "lucide-react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import type { OverStoryChapter } from "@/data/over-index";

function SoloScene({ active, chapter }: { active: boolean; chapter: OverStoryChapter }) {
  const reduce = useReducedMotion();
  const on = active || !!reduce;
  const timeline = [
    { label: "App dev", year: "Start", icon: Code2 },
    { label: "Design & web", year: "Jaren", icon: Palette },
    { label: "Groei & omzet", year: "Nu", icon: TrendingUp },
  ];

  return (
    <div className="flex h-full min-h-[300px] flex-col justify-between p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <motion.div
          animate={on ? { scale: 1, opacity: 1 } : { scale: 0.92, opacity: 0.5 }}
          className="rounded-2xl border border-[#FF5722]/20 bg-white p-3 shadow-sm"
        >
          <InteractiveLogo className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]" />
        </motion.div>
        <motion.div
          animate={on ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
        >
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            {chapter.metric.label}
          </p>
          <p className="text-lg font-extrabold text-[#FF5722]">{chapter.metric.value}</p>
        </motion.div>
      </div>

      <div className="mt-4 space-y-2">
        {timeline.map((item, i) => {
          const StepIcon = item.icon;
          return (
          <motion.div
            key={item.label}
            initial={reduce ? false : { opacity: 0, x: -10 }}
            animate={on ? { opacity: 1, x: 0 } : { opacity: 0.35, x: -4 }}
            transition={{ delay: 0.08 * i }}
            className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2.5"
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                i === 2 ? "bg-[#FF5722] text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              <StepIcon className="size-3.5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {item.year}
              </p>
              <p className="text-xs font-extrabold text-slate-800">{item.label}</p>
            </div>
            {i === 2 ? (
              <ArrowUpRight className="size-3.5 shrink-0 text-[#FF5722]" aria-hidden />
            ) : null}
          </motion.div>
          );
        })}
      </div>

      <motion.div
        animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        className="mt-4 flex flex-wrap gap-2"
      >
        {chapter.highlights.map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm"
          >
            {chip}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ContrastScene({ active, chapter }: { active: boolean; chapter: OverStoryChapter }) {
  const reduce = useReducedMotion();
  const on = active || !!reduce;
  const wins = ["Core Web Vitals", "Eigen code", "Meetplan inbegrepen"];

  return (
    <div className="grid h-full min-h-[300px] grid-cols-2 gap-3 p-5 sm:gap-4 sm:p-6">
      <motion.div
        animate={on ? { opacity: 0.45, scale: 0.96 } : { opacity: 0.7, scale: 1 }}
        className="relative flex flex-col rounded-2xl border border-dashed border-red-200 bg-red-50/40 p-4"
      >
        <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-red-100 text-red-500">
          <X className="size-3.5" aria-hidden />
        </span>
        <LayoutTemplate className="size-8 text-red-400" aria-hidden />
        <p className="mt-3 text-xs font-extrabold text-red-600">Template</p>
        <p className="mt-1 text-[10px] leading-relaxed text-red-400">
          + 12 plugins
          <br />
          Vastgelopen na 6 mnd
        </p>
        <p className="mt-auto pt-4 text-[9px] font-bold uppercase tracking-wider text-red-300 line-through">
          Niet ons werk
        </p>
      </motion.div>

      <motion.div
        animate={on ? { opacity: 1, scale: 1 } : { opacity: 0.55, scale: 0.94 }}
        className="flex flex-col rounded-2xl border border-[#FF5722]/25 bg-gradient-to-br from-[#FF5722]/8 to-white p-4 shadow-[0_16px_40px_-28px_rgba(255,87,34,0.55)]"
      >
        <span className="flex size-8 items-center justify-center rounded-xl bg-[#FF5722]/10 text-[#FF5722]">
          <Code2 className="size-4" aria-hidden />
        </span>
        <p className="mt-3 text-xs font-extrabold text-slate-900">From scratch</p>
        <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
          Snel, schoon, schaalbaar
        </p>
        <ul className="mt-4 space-y-2">
          {wins.map((item, i) => (
            <motion.li
              key={item}
              initial={reduce ? false : { opacity: 0, x: 6 }}
              animate={on ? { opacity: 1, x: 0 } : { opacity: 0.4, x: 3 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center gap-2 text-[10px] font-bold text-slate-700"
            >
              <Check className="size-3 shrink-0 text-emerald-500" aria-hidden />
              {item}
            </motion.li>
          ))}
        </ul>
        <p className="mt-auto pt-3 text-[10px] font-bold text-[#FF5722]">
          {chapter.metric.value} templates
        </p>
      </motion.div>
    </div>
  );
}

function StackScene({ active, chapter }: { active: boolean; chapter: OverStoryChapter }) {
  const reduce = useReducedMotion();
  const on = active || !!reduce;

  const layers = [
    {
      id: "shopify",
      label: "Shopify",
      detail: "Shop · orders · B2B",
      rotate: -5,
      dot: "#96BF48",
      bars: ["w-full", "w-2/3"],
    },
    {
      id: "nextjs",
      label: "Next.js",
      detail: "Sites from scratch",
      rotate: 4,
      dot: "#0F172A",
      bars: ["w-4/5", "w-1/2"],
    },
    {
      id: "seo",
      label: "SEO",
      detail: "Google + AI-antwoorden",
      rotate: -2.5,
      dot: "#00BCD4",
      bars: ["w-full", "w-3/5"],
    },
    {
      id: "ads",
      label: "Google & Meta",
      detail: "Campagnes met plan",
      rotate: 3,
      dot: "#FF5722",
      bars: ["w-11/12", "w-2/5"],
    },
  ] as const;

  return (
    <div className="relative flex h-full min-h-[300px] flex-col p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Stack · één lijn
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-[#FF5722]/20 bg-[#FF5722]/5 px-2.5 py-1 text-[9px] font-bold text-[#FF5722]">
            {chapter.metric.value}
          </span>
          <motion.span
            animate={on ? { opacity: 1, scale: 1 } : { opacity: 0.6, scale: 0.96 }}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700"
          >
            Alles gekoppeld
          </motion.span>
        </div>
      </div>

      <div className="relative mx-auto mt-5 w-full flex-1 px-3 sm:px-4">
        <motion.div
          animate={on ? { opacity: 1, scaleY: 1 } : { opacity: 0.35, scaleY: 0.85 }}
          className="absolute bottom-4 left-6 top-4 w-px origin-top rounded-full bg-gradient-to-b from-[#FF5722]/20 via-[#FF5722] to-emerald-400/70"
          aria-hidden
        />

        <div className="relative min-h-[280px] py-1">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.id}
              initial={false}
              animate={{
                y: on ? i * 52 : i * 52 + (i % 2 === 0 ? 3 : -3),
                x: 0,
                rotate: on ? layer.rotate * 0.2 : layer.rotate * 0.45,
                opacity: on ? 1 : 0.45,
                scale: on ? 1 : 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 24,
                delay: i * 0.05,
              }}
              className="absolute left-1 right-1 isolate origin-center rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.28)] sm:left-2 sm:right-2"
              style={{ top: i * 52, zIndex: 10 + i }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="size-2 shrink-0 rounded-full ring-4 ring-white"
                  style={{ backgroundColor: layer.dot }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-extrabold tracking-tight text-slate-900">
                    {layer.label}
                  </p>
                  <p className="text-[9px] text-slate-400">{layer.detail}</p>
                </div>
                {on ? (
                  <motion.span
                    initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.12 + i * 0.07 }}
                    className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                  >
                    <Check className="size-3" aria-hidden />
                  </motion.span>
                ) : null}
              </div>
              <div className="mt-2.5 space-y-1.5">
                {layer.bars.map((width, barIndex) => (
                  <span
                    key={`${layer.id}-${barIndex}`}
                    className={`block h-1.5 rounded-full bg-slate-100 ${width}`}
                    aria-hidden
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PartnerScene({ active, chapter }: { active: boolean; chapter: OverStoryChapter }) {
  const reduce = useReducedMotion();
  const on = active || !!reduce;

  return (
    <div className="flex h-full min-h-[300px] flex-col gap-4 p-5 sm:p-6">
      <div className="flex items-center justify-center gap-4">
        <motion.div
          animate={on ? { x: 0 } : { x: -8 }}
          className="flex size-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-black text-slate-500 shadow-sm"
        >
          Jij
        </motion.div>
        <motion.div
          animate={on ? { scaleX: 1, opacity: 1 } : { scaleX: 0.2, opacity: 0.4 }}
          className="relative h-0.5 w-12 origin-left rounded-full bg-[#FF5722]"
        >
          {!reduce ? (
            <motion.span
              animate={on ? { x: [0, 36, 0] } : { x: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-1 size-2 rounded-full bg-[#FF5722]"
            />
          ) : null}
        </motion.div>
        <motion.div
          animate={on ? { x: 0 } : { x: 8 }}
          className="flex flex-col items-center gap-1"
        >
          <InteractiveLogo className="h-12 w-12" />
          <span className="text-[9px] font-bold text-slate-500">Meneer</span>
        </motion.div>
      </div>

      <motion.div
        animate={on ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 6 }}
        className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Mail className="size-3.5 text-[#FF5722]" aria-hidden />
          <p className="text-[10px] font-bold text-slate-500">Inbox · normale taal</p>
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex justify-end">
            <p className="max-w-[85%] rounded-2xl rounded-br-md bg-slate-900 px-3 py-2 text-[10px] font-medium text-white">
              Staat de campagne al live?
            </p>
          </div>
          <div className="flex gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#FF5722]">
              <InteractiveLogo className="h-4 w-4" />
            </span>
            <p className="rounded-2xl rounded-bl-md bg-slate-100 px-3 py-2 text-[10px] font-medium leading-relaxed text-slate-800">
              Ja, live sinds 09:12. ROAS zit op 4,2. Geen novel nodig.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={on ? { opacity: 1 } : { opacity: 0.4 }}
        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <Ban className="size-3.5 text-emerald-600" aria-hidden />
          <p className="text-[10px] font-bold text-emerald-800">Geen corporate masker</p>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">
          {chapter.metric.value}
        </span>
      </motion.div>
    </div>
  );
}

const SCENES = {
  solo: SoloScene,
  contrast: ContrastScene,
  stack: StackScene,
  partner: PartnerScene,
} as const;

export function OverStoryVisual({
  chapter,
  active,
}: {
  chapter: OverStoryChapter;
  active: boolean;
}) {
  const Scene = SCENES[chapter.scene];
  return <Scene active={active} chapter={chapter} />;
}
