"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Gauge, Layers, Zap } from "lucide-react";
import { useState } from "react";

interface BuildContextSectionProps {
  introParagraphs: string[];
  angleTitle: string;
  angleBody: string;
  funFact: string;
  funFactSource: string;
  funFactStat: string;
}

const INSIGHTS = [
  {
    id: "fundament",
    icon: Layers,
    label: "Fundament",
    title: "Traagheid begint vóór de eerste pixel",
    preview: "Templates, botsende apps, geen plan.",
    body: "De meeste traagheid op het web komt niet van één plugin, maar van keuzes die niet passen: een template dat niet klopt, apps die botsen, content zonder structuur.",
  },
  {
    id: "schaal",
    icon: Zap,
    label: "Schaal",
    title: "Gebouwd voor wat er ná launch komt",
    preview: "Verdubbeld verkeer, nieuwe markten, strakkere landings.",
    body: "Of je nu een internationale webshop, een site met honderden pagina's of een klantportaal nodig hebt: het fundament moet snel laden, makkelijk beheren en ruimte geven om te groeien zonder alles opnieuw te doen.",
  },
  {
    id: "groei",
    icon: Gauge,
    label: "Groei",
    title: "Geen black box, wel een bouwplan",
    preview: "Frontends, koppelingen, logging, documentatie.",
    body: "We denken vanuit groei: wat gebeurt er als verkeer verdubbelt, als je nieuwe markten opent, als marketing strakkere landingspagina's nodig heeft? Daarom combineren we strakke frontends met robuuste koppelingen, logging en documentatie.",
  },
] as const;

type InsightId = (typeof INSIGHTS)[number]["id"];

/**
 * Interactieve intro voor Bouwen: kies een inzicht, lees de uitleg en zie
 * live hoe CWV-score en template-keuze verschuiven.
 */
export function BuildContextSection({
  introParagraphs,
  angleTitle,
  angleBody,
  funFact,
  funFactSource,
  funFactStat,
}: BuildContextSectionProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<InsightId>("fundament");
  const [mode, setMode] = useState<"template" | "scratch">("template");

  const activeInsight = INSIGHTS.find((i) => i.id === active)!;
  const cwvScore = mode === "scratch" ? 98 : 41;
  const loadTime = mode === "scratch" ? "0,8s" : "4,2s";

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="context-heading"
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
          id="context-heading"
          className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          {angleTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-lg text-slate-600">{angleBody}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_minmax(0,400px)] lg:items-stretch lg:gap-12">
          {/* Links: inzichten + vergelijking */}
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
                    className={`group relative overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                      isActive
                        ? "border-[#FF5722]/40 bg-[#FF5722]/[0.04] shadow-[0_16px_40px_-24px_rgba(255,87,34,0.5)]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-flex size-9 items-center justify-center rounded-xl transition-colors ${
                        isActive
                          ? "bg-[#FF5722] text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
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
                    <p className="mt-1 text-sm font-extrabold leading-snug tracking-tight text-slate-900">
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
                transition={{ duration: 0.28 }}
                className="flex-1 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50/80 to-white p-6 sm:p-7"
              >
                <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                  {activeInsight.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  {activeInsight.body}
                </p>
                {introParagraphs[0] && active === "fundament" ? (
                  <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-500">
                    {introParagraphs[0]}
                  </p>
                ) : null}
              </motion.div>
            </AnimatePresence>

            {/* Template vs from scratch toggle */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
              <p className="text-sm font-extrabold tracking-tight text-slate-900">
                Zelfde site, andere fundering
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Tik om het verschil te zien in laadtijd en CWV-score.
              </p>
              <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setMode("template")}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    mode === "template"
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Template
                </button>
                <button
                  type="button"
                  onClick={() => setMode("scratch")}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    mode === "scratch"
                      ? "bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  From scratch
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Laadtijd
                  </p>
                  <motion.p
                    key={loadTime}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-1 text-xl font-extrabold ${
                      mode === "scratch" ? "text-emerald-500" : "text-amber-500"
                    }`}
                  >
                    {loadTime}
                  </motion.p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    CWV-score
                  </p>
                  <motion.p
                    key={cwvScore}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-1 text-xl font-extrabold ${
                      mode === "scratch" ? "text-emerald-500" : "text-red-400"
                    }`}
                  >
                    {cwvScore}
                  </motion.p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.span
                  animate={{ width: `${cwvScore}%` }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className={`block h-full rounded-full ${
                    mode === "scratch"
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                      : "bg-gradient-to-r from-amber-300 to-red-400"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Rechts: fun fact + live meter */}
          <div className="flex flex-col gap-4">
            <figure className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-[#FF5722]/25 bg-gradient-to-br from-[#FF5722]/[0.07] via-white to-white p-7 sm:p-8">
              <span
                className="pointer-events-none absolute -right-2 -top-6 select-none text-[5.5rem] font-extrabold leading-none tracking-tighter text-[#FF5722]/[0.09]"
                aria-hidden
              >
                {funFactStat}
              </span>
              <p className="relative inline-flex w-fit items-center gap-2 rounded-full bg-[#FF5722] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
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
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Live meting
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    mode === "scratch"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {mode === "scratch" ? "Groen" : "Oranje"}
                </span>
              </div>
              <div className="mt-4 flex items-end gap-3">
                <svg viewBox="0 0 80 44" className="h-14 w-24 shrink-0" aria-hidden>
                  <path
                    d="M8 38 A 32 32 0 0 1 72 38"
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <motion.path
                    d="M8 38 A 32 32 0 0 1 72 38"
                    fill="none"
                    stroke={mode === "scratch" ? "#34D399" : "#FBBF24"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="100"
                    animate={{ strokeDashoffset: 100 - cwvScore }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <line
                    x1="40"
                    y1="38"
                    x2={40 + Math.cos(((180 - (cwvScore / 100) * 180) * Math.PI) / 180) * 28}
                    y2={38 - Math.sin(((cwvScore / 100) * 180 * Math.PI) / 180) * 28}
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
                <div>
                  <p className="text-3xl font-extrabold tabular-nums">{cwvScore}</p>
                  <p className="text-xs text-slate-400">
                    {mode === "scratch" ? "Klaar voor ads" : "Ads worden duurder"}
                  </p>
                </div>
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                <ArrowRight className="size-3.5 text-[#FF5722]" aria-hidden />
                {mode === "scratch"
                  ? "Gratis SEO-ruimte én hogere conversie."
                  : "Elke seconde extra kost je conversie."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
