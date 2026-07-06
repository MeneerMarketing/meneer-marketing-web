"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { BouwenCaseBrowser } from "@/components/home/mobile/HomeMobileBouwenCaseVisual";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { HOME_CASES } from "@/data/home-cases";
import {
  HOME_MOBILE_BOUWEN_CAN_BUILD,
  HOME_MOBILE_BOUWEN_HOT_TAKE,
  HOME_MOBILE_BOUWEN_INTRO,
  HOME_MOBILE_BOUWEN_STORY,
  HOME_MOBILE_BOUWEN_TOOLS,
  type BouwenCaseId,
  type BouwenToolId,
} from "@/data/home-mobile-bouwen";

/** Desktop bouw-sectie: zelfde verhaal als mobiel, twee kolommen, lichte animaties. */
export function HomeDesktopBouwenSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [tool, setTool] = useState<BouwenToolId>("shopify");

  const activeTool = HOME_MOBILE_BOUWEN_TOOLS.find((t) => t.id === tool)!;
  const activeCase = useMemo(
    () => HOME_CASES.find((c) => c.id === activeTool.caseId)!,
    [activeTool.caseId],
  );

  return (
    <section
      ref={sectionRef}
      id="bouwen"
      aria-labelledby="bouwen-desktop-title"
      className="relative overflow-x-clip border-b border-slate-800 bg-slate-950 py-20 lg:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-24 top-12 size-72 rounded-full bg-[#FF5722]/18 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            {HOME_MOBILE_BOUWEN_INTRO.eyebrow}
          </p>
          <h2
            id="bouwen-desktop-title"
            className="mt-4 text-pretty text-4xl font-extrabold leading-[1.05] tracking-tight text-white xl:text-5xl"
          >
            {HOME_MOBILE_BOUWEN_INTRO.title}{" "}
            <span className="text-[#FF5722]">{HOME_MOBILE_BOUWEN_INTRO.titleAccent}</span>
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-400">
            {HOME_MOBILE_BOUWEN_INTRO.lead}
          </p>

          <div className="mt-8 flex gap-3">
            <InteractiveLogo className="mt-1 size-8 shrink-0" interactive={false} />
            <div className="min-w-0 space-y-3">
              {HOME_MOBILE_BOUWEN_STORY.map((line, i) => (
                <p
                  key={line}
                  className={`text-pretty text-sm leading-relaxed lg:text-[15px] ${
                    i === 0 ? "font-bold text-white" : "text-slate-300"
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {HOME_MOBILE_BOUWEN_CAN_BUILD.map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-bold tracking-tight text-white/85"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
              Voorbeeld live
            </p>
            <div className="grid max-w-md grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
              {HOME_MOBILE_BOUWEN_TOOLS.map((t) => {
                const activeTab = tool === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTool(t.id)}
                    className={`rounded-xl px-4 py-3 text-left transition-colors duration-200 ${
                      activeTab
                        ? "bg-white text-slate-900 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]"
                        : "text-white/60 hover:text-white/90"
                    }`}
                  >
                    <span className="block text-sm font-extrabold tracking-tight">{t.label}</span>
                    <span
                      className={`mt-0.5 block text-[11px] font-medium ${
                        activeTab ? "text-slate-500" : "text-white/40"
                      }`}
                    >
                      {t.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Link
            href="/bouwen"
            className="group mt-10 inline-flex items-center gap-2 text-sm font-extrabold tracking-tight text-[#FF5722] transition hover:text-orange-400"
          >
            Meer over bouwen
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">
              <span
                className="size-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                aria-hidden
              />
              Echte cases
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
              {activeCase.client}
            </span>
          </div>

          <BouwenCaseBrowser caseItem={activeCase} />

          {(activeTool.caseId as BouwenCaseId) === "skincomplete" ? (
            <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-5 pt-6 ring-1 ring-white/[0.06]">
              <div
                className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#FF5722]/70 to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5722] shadow-[0_0_14px_rgba(255,87,34,0.65)]"
                aria-hidden
              />
              <div className="flex items-start gap-3">
                <InteractiveLogo className="mt-0.5 size-9 shrink-0" interactive={false} />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5722]">
                    Heet take
                  </p>
                  <p className="mt-2 text-pretty text-sm font-bold leading-snug tracking-tight text-white/95 lg:text-[15px]">
                    {HOME_MOBILE_BOUWEN_HOT_TAKE}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
