"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Smartphone, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { OVER_STACK } from "@/data/over-index";

function StackVisual({ itemId }: { itemId: string }) {
  if (itemId === "shopify") {
    return (
      <div className="flex items-center justify-center gap-2 p-6">
        <div className="rounded-xl border border-[#96BF48]/40 bg-[#96BF48]/10 px-4 py-6 text-center">
          <p className="text-[10px] font-bold uppercase text-[#5E8E3E]">B2B-portaal</p>
          <p className="mt-2 text-2xl font-black text-slate-800">24/7</p>
          <p className="text-[9px] text-slate-500">salons bestellen zelf</p>
        </div>
      </div>
    );
  }
  if (itemId === "nextjs") {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-[10px]">
          <p className="text-emerald-400">LCP 0.8s ✓</p>
          <p className="mt-1 text-slate-400">CLS 0.02 ✓</p>
          <p className="mt-1 text-slate-400">INP 45ms ✓</p>
        </div>
      </div>
    );
  }
  if (itemId === "seo") {
    return (
      <div className="flex items-end justify-center gap-2 p-6">
        {["Google", "ChatGPT", "Gemini"].map((l, i) => (
          <div
            key={l}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-10 rounded-t-lg bg-gradient-to-t from-[#00BCD4] to-cyan-200"
              style={{ height: 40 + i * 18 }}
            />
            <span className="text-[8px] font-bold text-slate-500">{l}</span>
          </div>
        ))}
      </div>
    );
  }
  if (itemId === "google-ads") {
    return (
      <div className="flex items-end justify-center gap-3 p-6">
        {["Klikken", "Conversies"].map((l, i) => (
          <div key={l} className="text-center">
            <div
              className={`w-12 rounded-t-lg ${i === 1 ? "bg-[#FF5722]" : "bg-slate-200"}`}
              style={{ height: i === 0 ? 48 : 72 }}
            />
            <p className="mt-1 text-[9px] font-bold text-slate-500">{l}</p>
          </div>
        ))}
      </div>
    );
  }
  if (itemId === "meta-ads") {
    const icons = [Smartphone, Target, TrendingUp] as const;
    return (
      <div className="flex justify-center gap-2 p-6">
        {icons.map((Icon, index) => (
          <span
            key={index}
            className="flex size-12 items-center justify-center rounded-2xl border border-pink-200 bg-pink-50 text-pink-500"
          >
            <Icon className="size-5" strokeWidth={1.8} aria-hidden />
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-2 p-6">
      {["Order", "E-mail", "CRM"].map((n, i) => (
        <div key={n} className="flex flex-col items-center gap-1">
          <span className="rounded-full border border-[#FF5722]/30 bg-[#FF5722]/10 px-2 py-1 text-[9px] font-bold text-[#FF5722]">
            {n}
          </span>
          {i < 2 ? <span className="text-[#FF5722]">→</span> : null}
        </div>
      ))}
    </div>
  );
}

export function OverStackExplorer() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const item = OVER_STACK[active]!;

  return (
    <section
      className="border-b border-slate-800 bg-slate-950"
      aria-labelledby="over-stack-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Stack
        </p>
        <h2
          id="over-stack-heading"
          className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
        >
          Waarmee ik werk (en waarom)
        </h2>
        <p className="mt-3 max-w-xl text-slate-400">
          Geen buzzword-bingo. Tik een blok en zie wat het in de praktijk betekent.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {OVER_STACK.map((stack, index) => {
            const isActive = active === index;
            return (
              <button
                key={stack.id}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                  isActive
                    ? "border-transparent text-white shadow-lg"
                    : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                }`}
                style={
                  isActive
                    ? { backgroundColor: stack.accent, boxShadow: `0 8px 24px -8px ${stack.accent}66` }
                    : undefined
                }
              >
                {stack.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col justify-center"
            >
              <p className="text-lg font-extrabold text-white">{item.label}</p>
              <p className="mt-3 text-base leading-relaxed text-slate-300">{item.body}</p>
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold italic text-[#FF5722]">
                {item.quip}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StackVisual itemId={item.id} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
