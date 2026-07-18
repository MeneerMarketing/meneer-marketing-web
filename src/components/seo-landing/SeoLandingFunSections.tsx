"use client";

import { Coffee, Ghost, MapPin, MessageCircle, Split, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type {
  EnrichedSeoLandingPage,
  SeoLandingAnalogy,
  SeoLandingCoffeeChat,
  SeoLandingConfession,
  SeoLandingInnerVoice,
  SeoLandingLocalColor,
  SeoLandingRant,
} from "@/data/seo-landings/enriched-types";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { Reveal } from "@/components/effects/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

function chatBubbleClass(who: "ondernemer" | "meneer" | "stem"): string {
  if (who === "meneer") return "ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#FF5722] px-4 py-3 text-sm font-medium text-white";
  if (who === "stem") return "mx-auto max-w-[90%] rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2 text-center text-xs italic text-slate-500";
  return "max-w-[88%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm";
}

export function SeoLandingCoffeeChat({ chat }: { chat: SeoLandingCoffeeChat }) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-orange-50/60 to-white py-16">
      <div className="mx-auto max-w-2xl px-4 lg:px-8">
        <Reveal>
          <div className="flex items-center gap-2 text-[#FF5722]">
            <Coffee className="size-5" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-[0.18em]">Koffiecorner</p>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-500">{chat.context}</p>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Zo klinkt het gesprek. Echt.
          </h2>
        </Reveal>
        <ul className="mt-8 space-y-4" role="list">
          {chat.lines.map((line, i) => (
            <Reveal key={`${line.who}-${i}`} delay={i * 0.05}>
              <li className="flex flex-col">
                {line.who !== "stem" ? (
                  <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {line.who === "meneer" ? "Meneer Marketing" : "Ondernemer"}
                  </span>
                ) : null}
                <p className={chatBubbleClass(line.who)}>{line.text}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SeoLandingInnerVoice({ voice }: { voice: SeoLandingInnerVoice }) {
  return (
    <section className="border-b border-slate-200 py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <Reveal>
          <div className="flex items-center gap-2">
            <Split className="size-5 text-[#FF5722]" aria-hidden />
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              In je hoofd vs wat er echt gebeurt
            </h2>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Reveal delay={0.05}>
            <article className="h-full rounded-3xl border border-slate-200 bg-slate-100 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Wat je denkt
              </p>
              <p className="mt-4 text-pretty text-base font-semibold leading-relaxed text-slate-700">
                &ldquo;{voice.inHead}&rdquo;
              </p>
            </article>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="h-full rounded-3xl border border-[#FF5722]/25 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF5722]">
                Wat er gebeurt
              </p>
              <p className="mt-4 text-pretty text-base leading-relaxed text-slate-800">
                {voice.reality}
              </p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function SeoLandingLocalColor({ block }: { block: SeoLandingLocalColor }) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-orange-50/70 via-white to-slate-50 py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <Reveal>
          <div className="flex items-center gap-2 text-[#FF5722]">
            <span className="inline-flex size-8 items-center justify-center rounded-xl bg-[#FF5722]/10 shadow-[2px_2px_0_0_rgba(255,87,34,0.2)]">
              <MapPin className="size-4" aria-hidden />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.18em]">Lokaal beeld</p>
          </div>
          <h2 className="mt-4 text-pretty text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
            {block.title}
          </h2>
          <div className="mt-6 space-y-4">
            {block.paragraphs.map((p) => (
              <p
                key={p.slice(0, 40)}
                className="rounded-2xl border border-slate-200/90 bg-white px-5 py-4 text-pretty text-base leading-relaxed text-slate-600 shadow-[0_1px_0_rgba(15,23,42,0.03)]"
              >
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function SeoLandingRantBlock({ rant }: { rant: SeoLandingRant }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <section className="border-b border-slate-200 py-14">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <Reveal>
          <motion.div
            initial={reduce ? false : { rotate: -0.4 }}
            animate={{ rotate: 0 }}
            className="rounded-3xl border-2 border-[#FF5722]/40 bg-gradient-to-br from-orange-50 via-white to-orange-50/30 p-6 shadow-md lg:p-8"
          >
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-[#FF5722]" aria-hidden />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF5722]">
                {rant.title}
              </p>
            </div>
            <p className="mt-4 text-pretty text-lg font-bold leading-snug text-slate-900">
              {rant.body}
            </p>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

export function SeoLandingAnalogyBlock({ analogy }: { analogy: SeoLandingAnalogy }) {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-16">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Als dit een sport was
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
            {analogy.title}
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-slate-600">
            {analogy.setup}
          </p>
          <p className="mt-4 rounded-2xl border-l-4 border-[#FF5722] bg-white py-3 pl-5 pr-4 text-base font-bold leading-relaxed text-slate-900 shadow-sm">
            {analogy.punchline}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function SeoLandingNightmareList({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <section className="border-b border-slate-200 py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <Reveal>
          <div className="flex items-center gap-2">
            <Ghost className="size-5 text-slate-400" aria-hidden />
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h2>
          </div>
          <p className="mt-3 max-w-2xl text-slate-600">
            Geen horrorfilm. Wel accounts en sites die ik te vaak open en dan even moet ademen.
          </p>
        </Reveal>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item} delay={i * 0.04}>
              <li className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/50 px-4 py-4">
                <span className="mt-1 text-sm font-bold text-red-400" aria-hidden>
                  ×
                </span>
                <span className="text-sm font-medium leading-relaxed text-slate-800">{item}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SeoLandingConfessionBlock({ confession }: { confession: SeoLandingConfession }) {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-14">
      <div className="mx-auto flex max-w-3xl items-start gap-4 px-4 lg:px-8">
        <InteractiveLogo className="size-12 shrink-0" interactive={false} />
        <Reveal>
          <div className="flex items-center gap-2">
            <MessageCircle className="size-4 text-[#FF5722]" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF5722]">
              Eerlijke bekentenis
            </p>
          </div>
          <h2 className="mt-2 text-xl font-extrabold text-slate-900">{confession.title}</h2>
          <p className="mt-3 text-pretty text-base leading-relaxed text-slate-600">
            {confession.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
