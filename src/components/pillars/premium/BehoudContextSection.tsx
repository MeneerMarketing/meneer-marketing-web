"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Mail, Repeat, Workflow } from "lucide-react";
import { useState } from "react";

interface BehoudContextSectionProps {
  introParagraphs: string[];
  angleTitle: string;
  angleBody: string;
  funFact: string;
  funFactSource: string;
  funFactStat: string;
}

const INSIGHTS = [
  {
    id: "marge",
    icon: Repeat,
    label: "Marge",
    title: "Bestaande klanten zijn goedkoper",
    preview: "Werven kost 5× meer dan behoud.",
    body: "De meeste bedrijven pompen al hun budget in nieuwe klanten en vergeten de klanten die al kochten. Zonde, want daar zit de marge: die klant kent je al, vertrouwt je al en hoeft alleen een goede reden te krijgen om terug te komen.",
  },
  {
    id: "email",
    icon: Mail,
    label: "E-mail",
    title: "Mails die op het juiste moment landen",
    preview: "Timing die converteert.",
    body: "Ik richt de volledige e-mailmarketing in: van welkomstmails tot opvolging na aankoop. Mails op het juiste moment, geen spam. De automatisering erachter regelt het handwerk.",
  },
  {
    id: "systemen",
    icon: Workflow,
    label: "Systemen",
    title: "Alles wat de tweede koop makkelijker maakt",
    preview: "Orders, voorraad, mails in sync.",
    body: "Behoud gaat verder dan e-mail. Het zijn ook de systemen erachter: orders die automatisch worden opgevolgd, voorraad en facturen die kloppen, en een klantenservice die snel antwoordt.",
  },
] as const;

type InsightId = (typeof INSIGHTS)[number]["id"];

export function BehoudContextSection({
  introParagraphs,
  angleTitle,
  angleBody,
  funFact,
  funFactSource,
  funFactStat,
}: BehoudContextSectionProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<InsightId>("marge");
  const [mode, setMode] = useState<"acq" | "retain">("acq");

  const activeInsight = INSIGHTS.find((i) => i.id === active)!;
  const repeatRate = mode === "retain" ? "38%" : "11%";
  const ltv = mode === "retain" ? "€ 840" : "€ 210";

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="behoud-context-heading"
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
          id="behoud-context-heading"
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
                {introParagraphs[1] && active === "systemen" ? (
                  <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-500">
                    {introParagraphs[1]}
                  </p>
                ) : null}
              </motion.div>
            </AnimatePresence>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
              <p className="text-sm font-extrabold tracking-tight text-slate-900">
                Alleen werven of ook behouden?
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Tik en zie wat er gebeurt met herhaalaankopen en klantwaarde.
              </p>
              <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setMode("acq")}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    mode === "acq"
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-500"
                  }`}
                >
                  Alleen werven
                </button>
                <button
                  type="button"
                  onClick={() => setMode("retain")}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    mode === "retain"
                      ? "bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/30"
                      : "text-slate-500"
                  }`}
                >
                  Behoud + mail
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Herhaalaankoop
                  </p>
                  <motion.p
                    key={repeatRate}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-1 text-xl font-extrabold ${
                      mode === "retain" ? "text-emerald-500" : "text-amber-500"
                    }`}
                  >
                    {repeatRate}
                  </motion.p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    LTV per klant
                  </p>
                  <motion.p
                    key={ltv}
                    initial={reduce ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-1 text-xl font-extrabold ${
                      mode === "retain" ? "text-emerald-500" : "text-slate-400"
                    }`}
                  >
                    {ltv}
                  </motion.p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <figure className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-[#FF5722]/25 bg-gradient-to-br from-[#FF5722]/[0.07] via-white to-white p-7 sm:p-8">
              <span
                className="pointer-events-none absolute -right-2 -top-6 select-none text-[5.5rem] font-extrabold leading-none tracking-tighter text-[#FF5722]/[0.09]"
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
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                E-mailflow-voorbeeld
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Welkomstmails, opvolging na aankoop en herinnermails. Timing eerst,
                omzet die elke maand terugkomt.
              </p>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                <ArrowRight className="size-3.5 text-[#FF5722]" aria-hidden />
                {mode === "retain"
                  ? "Zo bouw ik aan behoud."
                  : "Werven zonder opvolgmail laat geld liggen."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
