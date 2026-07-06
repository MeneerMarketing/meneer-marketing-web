"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { HomeCampagnesVisual } from "@/components/home/shared/HomeCampagnesVisual";
import { GoogleLogoMark } from "@/components/icons/GoogleLogoMark";
import { GoogleShoppingIcon } from "@/components/icons/GoogleShoppingIcon";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { Check, TrendingUp } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface SeoLandingSerpVisualProps {
  keyword: string;
}

/** Compacte SERP-demo voor SEO-landingspagina's. */
export function SeoLandingSerpVisual({ keyword }: SeoLandingSerpVisualProps) {
  const reduce = useReducedMotion() ?? false;
  const [rank, setRank] = useState(1);
  const isWinner = rank === 1;

  return (
    <div className="w-full max-w-md">
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <GoogleLogoMark className="size-4 shrink-0" />
        <span className="truncate text-sm text-slate-600">{keyword}</span>
      </div>
      <div className="mb-3 flex gap-2">
        {[9, 3, 1].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRank(r)}
            className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${
              rank === r
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-500 hover:text-slate-800"
            }`}
          >
            #{r}
          </button>
        ))}
      </div>
      <motion.div
        key={rank}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={`rounded-xl border-2 p-4 ${
          isWinner ? "border-[#FF5722]/40 bg-orange-50/80" : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${
              isWinner ? "bg-[#FF5722]" : "bg-slate-400"
            }`}
          >
            {rank}
          </span>
          <div>
            <p className={`text-[10px] font-bold uppercase ${isWinner ? "text-[#FF5722]" : "text-slate-400"}`}>
              Jouw merk
            </p>
            <p className={`mt-1 text-sm font-extrabold ${isWinner ? "text-[#1a0dab]" : "text-slate-600"}`}>
              Meneer Marketing · {keyword}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Custom build, SEO en ads onder één dak. Geen template-prutswerk.
            </p>
          </div>
        </div>
        {isWinner ? (
          <p className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <Check className="size-3.5" aria-hidden />
            Positie 1 · organisch
          </p>
        ) : (
          <p className="mt-3 text-[11px] font-medium text-slate-500">
            Tik #1 en zie het verschil.
          </p>
        )}
      </motion.div>
    </div>
  );
}

export function SeoLandingGoogleAdsVisual() {
  return (
    <div className="w-full max-w-lg">
      <HomeCampagnesVisual size="desktop" bubblePlacement="external" />
    </div>
  );
}

export function SeoLandingMetaAdsVisual() {
  return (
    <div className="w-full max-w-lg">
      <HomeCampagnesVisual size="desktop" bubblePlacement="external" channel="meta" />
    </div>
  );
}

export function SeoLandingBuildVisual() {
  const reduce = useReducedMotion() ?? false;
  const lines = [
    "export function JouwSite() {",
    "  return <Landingspagina converteert />",
    "}",
  ];

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400/80" />
        <span className="size-2.5 rounded-full bg-amber-400/80" />
        <span className="size-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-[10px] font-mono text-white/40">page.tsx</span>
      </div>
      <div className="space-y-1 p-4 font-mono text-[12px] leading-relaxed">
        {lines.map((line, i) => (
          <motion.p
            key={line}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, ease: EASE }}
            className="text-emerald-300"
          >
            {line}
          </motion.p>
        ))}
        <motion.p
          animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-[#FF5722]"
        >
          // Geen template. From scratch.
        </motion.p>
      </div>
    </div>
  );
}

export function SeoLandingWebshopVisual() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <GoogleShoppingIcon className="size-8" />
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          Shopping live
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["Product A", "Product B", "Bundle", "B2B kit"].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-slate-100 bg-gradient-to-br from-orange-50 to-slate-50 p-3"
          >
            <div className="mb-2 aspect-square rounded-lg bg-white shadow-inner" />
            <p className="text-[11px] font-bold text-slate-800">{label}</p>
            <p className="text-[10px] text-slate-500">Klaar voor ads</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SeoLandingPortalVisual() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">B2B portaal</p>
        <p className="text-sm font-extrabold text-slate-900">Klantlogin · prijzen · herbestellen</p>
      </div>
      <div className="space-y-2 p-4">
        {["Order #1842 · opnieuw bestellen", "Prijslijst salon · zichtbaar", "Factuur · gedownload"].map(
          (row) => (
            <div
              key={row}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-[11px] font-semibold text-slate-700"
            >
              {row}
              <Check className="size-3.5 text-emerald-500" aria-hidden />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export function SeoLandingContentVisual() {
  const topics = ["FAQ pagina", "Gids", "Vergelijking", "Case"];
  return (
    <div className="w-full max-w-md space-y-2">
      {topics.map((topic, i) => (
        <div
          key={topic}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-orange-50 text-xs font-black text-[#FF5722]">
            {i + 1}
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">{topic}</p>
            <p className="text-[11px] text-slate-500">Rankt op echte vragen</p>
          </div>
          <TrendingUp className="ml-auto size-4 text-emerald-500" aria-hidden />
        </div>
      ))}
    </div>
  );
}

interface SeoLandingAiVisualProps {
  keyword: string;
}

export function SeoLandingAiVisual({ keyword }: SeoLandingAiVisualProps) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-2xl">
      <div className="mb-3 flex items-center gap-2">
        <InteractiveLogo className="size-8" interactive={false} />
        <div>
          <p className="text-xs font-bold text-white">AI-antwoord</p>
          <p className="text-[10px] text-white/40">ChatGPT · Gemini</p>
        </div>
      </div>
      <p className="rounded-xl bg-white/10 px-3 py-2 text-[11px] text-white/70">
        Welk bureau voor {keyword}?
      </p>
      <p className="mt-2 rounded-xl bg-[#FF5722]/15 px-3 py-2.5 text-sm font-medium leading-relaxed text-white">
        Op basis van cases en reviews val ik voor{" "}
        <span className="font-extrabold text-[#FF5722]">Meneer Marketing</span>. Ze bouwen
        from scratch en pakken vindbaarheid én ads aan.
      </p>
    </div>
  );
}
