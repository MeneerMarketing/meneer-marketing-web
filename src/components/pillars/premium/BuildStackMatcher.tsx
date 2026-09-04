"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Globe, LayoutGrid, ShoppingBag, Workflow } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface StackService {
  name: string;
  href: string;
}

interface BuildGoal {
  id: string;
  icon: typeof Globe;
  label: string;
  title: string;
  stack: string[];
  services: StackService[];
  outcome: string;
}

const GOALS: BuildGoal[] = [
  {
    id: "webshop",
    icon: ShoppingBag,
    label: "Webshop",
    title: "Shopify from scratch",
    stack: ["Shopify OS 2.0", "Custom theme", "Checkout extensies"],
    services: [
      { name: "Shopify Enterprise Development", href: "/diensten/shopify-enterprise" },
      { name: "Conversiegedreven UI/UX", href: "/diensten/webdesign" },
      { name: "Snelheid & vindbaarheid", href: "/diensten/optimalisatie" },
    ],
    outcome: "Schaalbare shop zonder template-limieten. B2B, B2C, alles kan.",
  },
  {
    id: "site",
    icon: Globe,
    label: "Website",
    title: "Corporate site of landings",
    stack: ["Next.js", "Headless CMS", "JSON-LD schema"],
    services: [
      { name: "Websites from scratch", href: "/diensten/webdevelopment" },
      { name: "Merkidentiteit & visuele positionering", href: "/diensten/branding" },
      { name: "Motion & micro-interacties", href: "/diensten/animaties" },
    ],
    outcome: "Snel, vindbaar en klaar voor je ads en SEO-traject.",
  },
  {
    id: "portal",
    icon: Workflow,
    label: "Portaal",
    title: "Webapp of klantportaal",
    stack: ["React", "API-koppelingen", "Auth & logging"],
    services: [
      { name: "Custom Web-Applicaties", href: "/diensten/web-apps" },
      { name: "Websites from scratch", href: "/diensten/webdevelopment" },
      { name: "Snelheid & vindbaarheid", href: "/diensten/optimalisatie" },
    ],
    outcome: "Dashboards, portalen en SaaS-interfaces die met je meegroeien.",
  },
  {
    id: "rebuild",
    icon: LayoutGrid,
    label: "Rebuild",
    title: "Van template naar custom build",
    stack: ["Migratie", "CWV audit", "Component library"],
    services: [
      { name: "Websites from scratch", href: "/diensten/webdevelopment" },
      { name: "Snelheid & vindbaarheid", href: "/diensten/optimalisatie" },
      { name: "Conversiegedreven UI/UX", href: "/diensten/webdesign" },
    ],
    outcome: "Weg met de trage template. Opnieuw bouwen zonder alles kwijt te raken.",
  },
];

/**
 * Interactieve stack-matcher: kies wat je wilt bouwen en zie direct welke
 * diensten, tech en uitkomst daarbij horen.
 */
export function BuildStackMatcher({ defaultGoalId = "webshop" }: { defaultGoalId?: string }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>(defaultGoalId);
  const goal = GOALS.find((g) => g.id === active) ?? GOALS[0];
  const Icon = goal.icon;

  return (
    <section
      className="border-b border-slate-200 bg-gradient-to-b from-slate-50/80 to-white"
      aria-labelledby="stack-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          Wat wil je bouwen?
        </p>
        <h2
          id="stack-heading"
          className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          Kies je doel. Zie je stack.
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">
          Concrete toolbox. Tik op wat jij nodig hebt en je ziet meteen
          welke diensten en techniek daarbij passen.
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
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "border-[#FF5722] bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/25"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <GIcon className="size-4" strokeWidth={2} aria-hidden />
                {g.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.32 }}
            className="mt-8 grid gap-6 lg:grid-cols-3 lg:items-stretch"
          >
            {/* Stack */}
            <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    {goal.label}
                  </p>
                  <h3 className="text-base font-extrabold tracking-tight text-slate-900">
                    {goal.title}
                  </h3>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                {goal.outcome}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {goal.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Diensten */}
            <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FF5722]">
                Passende trajecten
              </p>
              <ul className="mt-4 flex flex-1 flex-col gap-2">
                {goal.services.map((service, i) => (
                  <motion.li
                    key={service.href}
                    initial={reduce ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i }}
                  >
                    <Link
                      href={service.href}
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3.5 transition-all hover:border-[#FF5722]/30 hover:bg-[#FF5722]/[0.04]"
                    >
                      <span className="text-sm font-extrabold tracking-tight text-slate-900">
                        {service.name}
                      </span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FF5722]"
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
                Bespreek dit traject
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
