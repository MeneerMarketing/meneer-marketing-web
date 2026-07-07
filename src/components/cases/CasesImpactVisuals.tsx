"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { GoogleLogoMark } from "@/components/icons/GoogleLogoMark";
import { MetaIcon } from "@/components/icons/MetaIcon";
import { ShopifyMark } from "@/components/icons/ShopifyMark";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

const EASE = [0.22, 1, 0.36, 1] as const;

const STACK = [
  { id: "shopify", node: <ShopifyMark className="size-5" /> },
  { id: "google", node: <GoogleLogoMark className="size-5" /> },
  { id: "nextjs", node: (
    <Image src="/icons/nextjs-mark.png" alt="" width={20} height={20} className="size-5 rounded-sm" unoptimized />
  ) },
  { id: "meta", node: <MetaIcon size={20} /> },
] as const;

export function CasesImpactExperienceVisual() {
  const reduce = useReducedMotion();
  const [year, setYear] = useState(2012);

  useEffect(() => {
    if (reduce) {
      setYear(2026);
      return;
    }
    const id = window.setInterval(() => {
      setYear((y) => (y >= 2026 ? 2012 : y + 1));
    }, 140);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="flex h-[140px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-3">
      <div className="flex items-center justify-center gap-4 pt-1">
        <InteractiveLogo className="size-11 shrink-0" interactive={false} />
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Sinds</p>
          <p className="font-mono text-lg font-black tabular-nums leading-none text-white">{year}</p>
        </div>
        <div className="h-10 w-px bg-white/10" aria-hidden />
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Nu</p>
          <p className="text-lg font-black leading-none text-[#FF5722]">12+ jr</p>
        </div>
      </div>

      <div className="relative mt-2">
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#FF5722] to-orange-400"
            initial={reduce ? false : { width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          {STACK.map((item, i) => (
            <motion.span
              key={item.id}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i, ease: EASE }}
              className="flex flex-1 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] py-2"
            >
              {item.node}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

const INTAKE_LINES = [
  { from: "meneer" as const, text: "Waar lekt het nu het meest?" },
  { from: "jij" as const, text: "Site converteert niet" },
  { from: "meneer" as const, text: "Dan geen ads. Eerst fixen." },
];

export function CasesImpactIntakeVisual() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? INTAKE_LINES.length : 0);

  useEffect(() => {
    if (reduce || step >= INTAKE_LINES.length) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), 900);
    return () => window.clearTimeout(t);
  }, [step, reduce]);

  return (
    <div className="flex h-[140px] flex-col justify-end gap-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-3">
      {INTAKE_LINES.slice(0, step).map((line, i) => (
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-end gap-2 ${line.from === "jij" ? "flex-row-reverse" : ""}`}
        >
          {line.from === "meneer" ? (
            <InteractiveLogo className="size-6 shrink-0" interactive={false} />
          ) : (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FF5722] text-[8px] font-black text-white">
              J
            </span>
          )}
          <p
            className={`max-w-[85%] rounded-xl px-2.5 py-1.5 text-[10px] font-semibold leading-snug ${
              line.from === "meneer"
                ? "rounded-bl-sm bg-white/10 text-slate-200"
                : "rounded-br-sm bg-[#FF5722]/20 text-orange-100"
            }`}
          >
            {line.text}
          </p>
        </motion.div>
      ))}
      {step < INTAKE_LINES.length && !reduce ? (
        <span className="ml-8 inline-flex gap-1 rounded-xl bg-white/10 px-3 py-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-1 rounded-full bg-slate-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
            />
          ))}
        </span>
      ) : null}
    </div>
  );
}

const OPTIONS = ["SEO", "Bouwen", "Ads", "Mail", "Branding"] as const;

export function CasesImpactFocusVisual() {
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState<readonly string[]>(["SEO", "Bouwen", "Mail"]);

  useEffect(() => {
    if (reduce) return;
    const sequence: (typeof OPTIONS)[number][][] = [
      ["SEO", "Bouwen", "Ads"],
      ["Bouwen", "Mail", "Ads"],
      ["SEO", "Bouwen", "Mail"],
    ];
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % sequence.length;
      setPicked(sequence[i]!);
    }, 2200);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="h-[140px] rounded-2xl border border-white/10 bg-slate-900/80 p-3">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
        Jouw fase kiest volgorde
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {OPTIONS.map((opt) => {
          const active = picked.includes(opt);
          return (
            <motion.span
              key={opt}
              animate={{
                scale: active ? 1 : 0.92,
                opacity: active ? 1 : 0.35,
              }}
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                active ? "bg-[#FF5722] text-white" : "border border-white/10 text-slate-500"
              }`}
            >
              {opt}
            </motion.span>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {picked.map((slot, i) => (
          <motion.div
            key={`${slot}-${i}`}
            layout
            className="rounded-lg border border-[#FF5722]/30 bg-[#FF5722]/10 py-2 text-center text-[10px] font-extrabold text-[#FF5722]"
          >
            {i + 1}. {slot}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
