"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Flame, Layers, ShoppingBag, Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface StackService {
  name: string;
  href: string;
}

interface CampaignGoal {
  id: string;
  icon: typeof Flame;
  label: string;
  title: string;
  priority: string[];
  services: StackService[];
  outcome: string;
}

const GOALS: CampaignGoal[] = [
  {
    id: "burn",
    icon: Flame,
    label: "Budget weg",
    title: "Ads verbranden zonder winst",
    priority: ["Tracking", "CRO", "Google Ads"],
    services: [
      { name: "Data tracking & analytics", href: "/diensten/tracking" },
      { name: "Meer omzet uit je website (CRO)", href: "/diensten/cro" },
      { name: "Google Ads", href: "/diensten/google-ads" },
    ],
    outcome:
      "Eerst meting en conversie fixen. Daarna pas budget opschalen op wat meetbaar rendeert.",
  },
  {
    id: "creative",
    icon: Video,
    label: "Geen hook",
    title: "Creatives die niet converteren",
    priority: ["UGC", "Media", "Meta Ads"],
    services: [
      { name: "UGC & creatorcontent", href: "/diensten/ugc" },
      { name: "Foto & video-ads", href: "/diensten/media" },
      { name: "Meta Ads", href: "/diensten/meta-ads" },
    ],
    outcome:
      "Echte mensen, korte hooks en formats die passen bij het kanaal. Geen stock die niemand pauzeert.",
  },
  {
    id: "scale",
    icon: Layers,
    label: "Klaar om te schalen",
    title: "Fundament staat, nu opschalen",
    priority: ["Ads-strategie", "Google", "Meta"],
    services: [
      { name: "Advertentiestrategie", href: "/diensten/adverteren" },
      { name: "Google Ads", href: "/diensten/google-ads" },
      { name: "Meta Ads", href: "/diensten/meta-ads" },
    ],
    outcome:
      "Eerst organisch en conversie op orde, dan ads opschalen met lagere CPA vanaf dag één.",
  },
  {
    id: "marketplace",
    icon: ShoppingBag,
    label: "Extra kanaal",
    title: "Bol of Amazon erbij",
    priority: ["Marketplaces", "Media", "Meta Ads"],
    services: [
      { name: "Verkopen via Bol & Amazon", href: "/diensten/marketplaces" },
      { name: "Foto & video-ads", href: "/diensten/media" },
      { name: "Meta Ads", href: "/diensten/meta-ads" },
    ],
    outcome:
      "Listings, creatives en paid die samenwerken. Extra omzet zonder je eigen shop te verwaarlozen.",
  },
];

export function CampaignBudgetMatcher() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState("burn");
  const goal = GOALS.find((g) => g.id === active) ?? GOALS[0];
  const Icon = goal.icon;

  return (
    <section
      className="border-b border-slate-200 bg-gradient-to-b from-slate-50/80 to-white"
      aria-labelledby="campaign-matcher-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          Waar lekt je budget?
        </p>
        <h2
          id="campaign-matcher-heading"
          className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          Herken je situatie? Zie je volgorde.
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">
          Campagnes zijn vooral keuzes maken. Tik op je situatie en zie welke
          diensten en welke volgorde het meeste opleveren.
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
                href="/intake"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#FF5722]"
              >
                Bespreek je campagnes
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
