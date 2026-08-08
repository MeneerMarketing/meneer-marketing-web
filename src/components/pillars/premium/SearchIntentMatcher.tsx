"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Bot, MapPin, Search, Star, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface IntentService {
  name: string;
  href: string;
}

interface SearchIntent {
  id: string;
  icon: typeof Search;
  label: string;
  title: string;
  focus: string[];
  services: IntentService[];
  outcome: string;
}

const INTENTS: SearchIntent[] = [
  {
    id: "onzichtbaar",
    icon: Search,
    label: "Onzichtbaar",
    title: "Site live, maar niemand vindt je",
    focus: ["SEO", "Techniek", "Content"],
    services: [
      { name: "Gevonden worden in Google (SEO)", href: "/diensten/seo" },
      { name: "Contentmarketing", href: "/diensten/content-marketing" },
      { name: "Vindbaar in AI-antwoorden", href: "/diensten/ai-zoek" },
    ],
    outcome:
      "Ik breng structuur, content en techniek op orde zodat Google en AI je site begrijpen en ranken.",
  },
  {
    id: "ai",
    icon: Bot,
    label: "Niet in AI",
    title: "ChatGPT noemt je concurrent, niet jou",
    focus: ["AI-antwoorden", "Content", "Autoriteit"],
    services: [
      { name: "Vindbaar in AI-antwoorden", href: "/diensten/ai-zoek" },
      { name: "Contentmarketing", href: "/diensten/content-marketing" },
      { name: "Gevonden worden in Google (SEO)", href: "/diensten/seo" },
    ],
    outcome:
      "Structured data, expert-content en vermeldingen die AI-modellen wél oppakken als antwoord.",
  },
  {
    id: "lokaal",
    icon: MapPin,
    label: "Lokaal zwak",
    title: "Maps toont de concurrent eerder",
    focus: ["Lokaal", "Reviews", "SEO"],
    services: [
      { name: "Lokale vindbaarheid", href: "/diensten/local-seo" },
      { name: "Reviews & reputatie", href: "/diensten/reviews" },
      { name: "Gevonden worden in Google (SEO)", href: "/diensten/seo" },
    ],
    outcome:
      "Google Business, lokale pagina's en reviews die je in de Maps-pack tillen.",
  },
  {
    id: "verkeer",
    icon: TrendingDown,
    label: "Traffic daalt",
    title: "Posities zakken, verkeer weg",
    focus: ["SEO", "Content", "Techniek"],
    services: [
      { name: "Gevonden worden in Google (SEO)", href: "/diensten/seo" },
      { name: "Contentmarketing", href: "/diensten/content-marketing" },
      { name: "Reviews & reputatie", href: "/diensten/reviews" },
    ],
    outcome:
      "Audit, content refresh en autoriteit herstellen voordat je ads er tegenaan gooit.",
  },
  {
    id: "reviews",
    icon: Star,
    label: "Weinig trust",
    title: "Bezoekers twijfelen vóór ze klikken",
    focus: ["Reviews", "Content", "Lokaal"],
    services: [
      { name: "Reviews & reputatie", href: "/diensten/reviews" },
      { name: "Contentmarketing", href: "/diensten/content-marketing" },
      { name: "Lokale vindbaarheid", href: "/diensten/local-seo" },
    ],
    outcome:
      "Social proof op de plekken waar klanten vergelijken, plus content die vertrouwen versterkt.",
  },
];

export function SearchIntentMatcher() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState("onzichtbaar");
  const intent = INTENTS.find((i) => i.id === active) ?? INTENTS[0];
  const Icon = intent.icon;

  return (
    <section
      className="border-b border-slate-200 bg-gradient-to-b from-slate-50/80 to-white"
      aria-labelledby="intent-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
          Waar lekt je vindbaarheid?
        </p>
        <h2
          id="intent-heading"
          className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          Herken het probleem. Zie de fix.
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">
          Vindbaarheid is geen truc. Tik op je situatie en zie welke trajecten
          en focuspunten het meeste opleveren.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {INTENTS.map((item) => {
            const ItemIcon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-bold transition-all ${
                  isActive
                    ? "border-[#FF5722] bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/25"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <ItemIcon className="size-4" aria-hidden />
                {item.label}
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
                    {intent.label}
                  </p>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {intent.title}
                  </h3>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                {intent.outcome}
              </p>
              <div className="mt-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FF5722]">
                  Eerste focus
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {intent.focus.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#FF5722]/20 bg-[#FF5722]/5 px-3 py-1 text-[11px] font-bold text-[#FF5722]"
                    >
                      {tag}
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
                {intent.services.map((service) => (
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
                      <ArrowUpRight className="size-4 text-slate-400 group-hover:text-[#FF5722]" aria-hidden />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <Link
                href="/intake"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#FF5722]"
              >
                Check je vindbaarheid
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
