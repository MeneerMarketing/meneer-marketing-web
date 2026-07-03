"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Bot, Mail, Repeat, Workflow } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface StackService {
  name: string;
  href: string;
}

interface RetentionGoal {
  id: string;
  icon: typeof Repeat;
  label: string;
  title: string;
  priority: string[];
  services: StackService[];
  outcome: string;
}

const GOALS: RetentionGoal[] = [
  {
    id: "repeat",
    icon: Repeat,
    label: "Geen herhaal",
    title: "Klanten kopen één keer en verdwijnen",
    priority: ["E-mail", "Retentie", "Flows"],
    services: [
      { name: "E-mailmarketing", href: "/diensten/email" },
      { name: "Retentie & loyaliteit", href: "/diensten/retentie" },
      { name: "E-commerce workflows", href: "/diensten/workflows" },
    ],
    outcome:
      "Welkom, opvolging en win-back flows op het juiste moment. Herhaalaankopen meetbaar maken.",
  },
  {
    id: "handwerk",
    icon: Workflow,
    label: "Handwerk",
    title: "Orders en mails worden handmatig gekopieerd",
    priority: ["Automatisering", "Workflows", "E-mail"],
    services: [
      { name: "Processen automatiseren", href: "/diensten/automatisering" },
      { name: "E-commerce workflows", href: "/diensten/workflows" },
      { name: "E-mailmarketing", href: "/diensten/email" },
    ],
    outcome:
      "Systemen die met elkaar praten. Geen dubbel werk, minder fouten, meer rust in je team.",
  },
  {
    id: "stil",
    icon: Mail,
    label: "E-mail stil",
    title: "Je lijst groeit maar er gaat weinig uit",
    priority: ["E-mail", "Retentie", "Automatisering"],
    services: [
      { name: "E-mailmarketing", href: "/diensten/email" },
      { name: "Retentie & loyaliteit", href: "/diensten/retentie" },
      { name: "Processen automatiseren", href: "/diensten/automatisering" },
    ],
    outcome:
      "Flows die logisch zijn voor de klantreis. Nieuwsbrief met ritme, geen sporadische blast.",
  },
  {
    id: "support",
    icon: Bot,
    label: "Support druk",
    title: "Dezelfde vragen, elke dag opnieuw",
    priority: ["Chatbots", "Workflows", "E-mail"],
    services: [
      { name: "AI-chatbots & klantenservice", href: "/diensten/chatbots" },
      { name: "E-commerce workflows", href: "/diensten/workflows" },
      { name: "E-mailmarketing", href: "/diensten/email" },
    ],
    outcome:
      "AI-antwoorden op basis van jouw data en tone of voice. Team houdt tijd over voor echte cases.",
  },
];

export function RetentionSituationMatcher() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState("repeat");
  const goal = GOALS.find((g) => g.id === active) ?? GOALS[0];
  const Icon = goal.icon;

  return (
    <section
      className="border-b border-slate-200 bg-gradient-to-b from-slate-50/80 to-white"
      aria-labelledby="retention-matcher-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          Waar lekt je behoud?
        </p>
        <h2
          id="retention-matcher-heading"
          className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          Herken je situatie? Zie je volgorde.
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">
          Behoud is vooral gaten dichten in de klantreis. Tik op je situatie en zie
          welke trajecten het meeste opleveren.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {GOALS.map((g) => {
            const GIcon = g.icon;
            const isActive = active === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setActive(g.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-all ${
                  isActive
                    ? "border-[#FF5722] bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/25"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <GIcon className="size-4" aria-hidden />
                {g.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            className="mt-8 grid gap-6 lg:grid-cols-3 lg:items-stretch"
          >
            <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-[#FF5722] text-white">
                  <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    {goal.label}
                  </p>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {goal.title}
                  </h3>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                {goal.outcome}
              </p>
              <div className="mt-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FF5722]">
                  Aanbevolen volgorde
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {goal.priority.map((step) => (
                    <span
                      key={step}
                      className="rounded-full border border-[#FF5722]/20 bg-[#FF5722]/5 px-3 py-1 text-[11px] font-bold text-[#FF5722]"
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FF5722]">
                Passende trajecten
              </p>
              <ul className="mt-4 flex flex-1 flex-col gap-2">
                {goal.services.map((service) => (
                  <motion.li
                    key={service.href}
                    initial={reduce ? false : { opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Link
                      href={service.href}
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3.5 transition-all hover:border-[#FF5722]/30 hover:bg-[#FF5722]/5"
                    >
                      <span className="text-sm font-extrabold text-slate-900">
                        {service.name}
                      </span>
                      <ArrowUpRight
                        className="size-4 text-slate-400 group-hover:text-[#FF5722]"
                        aria-hidden
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <Link
                href="/groeiscan"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#FF5722]"
              >
                Bespreek je behoud
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
