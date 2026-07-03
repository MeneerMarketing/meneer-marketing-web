"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bot, Globe, MapPin, Star } from "lucide-react";
import { useState } from "react";

interface VindbaarheidContextSectionProps {
  introParagraphs: string[];
  angleTitle: string;
  angleBody: string;
  funFact: string;
  funFactSource: string;
  funFactStat: string;
}

const INSIGHTS = [
  {
    id: "ai",
    icon: Bot,
    label: "AI-zoek",
    title: "ChatGPT is ook een zoekmachine",
    preview: "Geen antwoord? Dan kijkt je klant verder.",
    body: "Steeds meer klanten vragen eerst aan ChatGPT, Gemini of Claude welk bedrijf ze moeten kiezen. Sta jij niet in dat antwoord, dan ben je voor hen simpelweg geen optie meer.",
  },
  {
    id: "keten",
    icon: Globe,
    label: "Keten",
    title: "SEO is breder dan rankings",
    preview: "Content, techniek, lokaal, reviews.",
    body: "Vindbaarheid is de combinatie van goede content, een technisch kloppende site, lokale aanwezigheid en reviews die vertrouwen geven. Wij pakken die keten als geheel op, want de onderdelen versterken elkaar.",
  },
  {
    id: "volgorde",
    icon: Star,
    label: "Volgorde",
    title: "Organisch eerst, ads daarna",
    preview: "SkinComplete-model: SEO vóór budget.",
    body: "SkinComplete stond bovenaan in Google vóór er één euro aan advertenties werd uitgegeven. Organische vindbaarheid maakt elke advertentie-euro daarna goedkoper, omdat je merk al vertrouwen heeft opgebouwd waar klanten zoeken.",
  },
] as const;

type InsightId = (typeof INSIGHTS)[number]["id"];

export function VindbaarheidContextSection({
  introParagraphs,
  angleTitle,
  angleBody,
  funFact,
  funFactSource,
  funFactStat,
}: VindbaarheidContextSectionProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<InsightId>("ai");
  const [mode, setMode] = useState<"google" | "full">("google");

  const activeInsight = INSIGHTS.find((i) => i.id === active)!;
  const visibility = mode === "full" ? 92 : 38;
  const channels = mode === "full" ? 5 : 1;

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="vindbaarheid-context-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.028)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.028)_1px,transparent_1px)] bg-[size:40px_40px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
          Context die telt
        </p>
        <h2
          id="vindbaarheid-context-heading"
          className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          {angleTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-lg text-slate-600">{angleBody}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_minmax(0,400px)] lg:items-stretch lg:gap-12">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2 sm:grid-cols-3">
              {INSIGHTS.map((insight) => {
                const Icon = insight.icon;
                const isActive = active === insight.id;
                return (
                  <button
                    key={insight.id}
                    type="button"
                    onClick={() => setActive(insight.id)}
                    className={`rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                      isActive
                        ? "border-[#FF5722]/40 bg-[#FF5722]/[0.04] shadow-[0_16px_40px_-24px_rgba(255,87,34,0.5)]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-flex size-9 items-center justify-center rounded-xl ${
                        isActive
                          ? "bg-[#FF5722] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                      aria-hidden
                    >
                      <Icon className="size-4" strokeWidth={2} />
                    </span>
                    <p
                      className={`mt-3 text-[10px] font-black uppercase tracking-[0.16em] ${
                        isActive ? "text-[#FF5722]" : "text-slate-400"
                      }`}
                    >
                      {insight.label}
                    </p>
                    <p className="mt-1 text-sm font-extrabold leading-snug text-slate-900">
                      {insight.preview}
                    </p>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                className="flex-1 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50/80 to-white p-6 sm:p-7"
              >
                <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                  {activeInsight.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  {activeInsight.body}
                </p>
                {introParagraphs[0] && active === "ai" ? (
                  <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-500">
                    {introParagraphs[0]}
                  </p>
                ) : null}
              </motion.div>
            </AnimatePresence>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
              <p className="text-sm font-extrabold tracking-tight text-slate-900">
                Alleen Google of overal vindbaar?
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Tik en zie het verschil in bereik en zichtbaarheidsscore.
              </p>
              <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setMode("google")}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    mode === "google"
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-500"
                  }`}
                >
                  Alleen Google
                </button>
                <button
                  type="button"
                  onClick={() => setMode("full")}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    mode === "full"
                      ? "bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30"
                      : "text-slate-500"
                  }`}
                >
                  Volledig spectrum
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Zichtbaarheid
                  </p>
                  <motion.p
                    key={visibility}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-1 text-xl font-extrabold ${
                      mode === "full" ? "text-emerald-500" : "text-amber-500"
                    }`}
                  >
                    {visibility}%
                  </motion.p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Kanalen actief
                  </p>
                  <motion.p
                    key={channels}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xl font-extrabold text-slate-900"
                  >
                    {channels}
                  </motion.p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(mode === "full"
                  ? ["Google", "ChatGPT", "Gemini", "Claude", "Maps"]
                  : ["Google"]
                ).map((ch) => (
                  <span
                    key={ch}
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                      mode === "full"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <figure className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-[#FF5722]/25 bg-gradient-to-br from-[#FF5722]/[0.07] via-white to-white p-7 sm:p-8">
              <span
                className="pointer-events-none absolute -right-2 -top-6 select-none text-[5rem] font-extrabold leading-none tracking-tighter text-[#FF5722]/[0.09]"
                aria-hidden
              >
                {funFactStat}
              </span>
              <p className="relative inline-flex w-fit rounded-full bg-[#FF5722] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
                Wist je dit?
              </p>
              <blockquote className="relative mt-4 flex-1 text-balance text-lg font-extrabold leading-snug tracking-tight text-slate-900 sm:text-xl">
                {funFact}
              </blockquote>
              <figcaption className="relative mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#FF5722]">
                {funFactSource}
              </figcaption>
            </figure>

            <div className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white sm:p-6">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-[#FF5722]" aria-hidden />
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Live preview
                </p>
              </div>
              <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] text-slate-400">Zoekopdracht</p>
                <p className="text-sm font-bold text-white">
                  {mode === "full"
                    ? "Beste Shopify expert Nederland"
                    : "shopify expert amsterdam"}
                </p>
                <div className="mt-2 space-y-1.5">
                  {(mode === "full"
                    ? [
                        "meneermarketing.nl · SEO & bouw",
                        "Genoemd in AI-antwoord",
                        "4,9 ★ · 47 reviews",
                      ]
                    : ["Concurrent A", "Concurrent B", "..."]
                  ).map((line, i) => (
                    <p
                      key={line}
                      className={`text-xs ${
                        i === 0 && mode === "full"
                          ? "font-bold text-emerald-300"
                          : "text-slate-400"
                      }`}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                <ArrowRight className="size-3.5 text-[#FF5722]" aria-hidden />
                {mode === "full"
                  ? "Zo voelt vindbaarheid overal."
                  : "Eén kanaal is te weinig in 2026."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
