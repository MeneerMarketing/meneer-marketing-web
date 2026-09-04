"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/effects/Reveal";
import { ApproachPath } from "@/components/diensten/premium/ApproachPath";
import { DienstFAQ } from "@/components/diensten/DienstFAQ";
import { HeroBuildWindow } from "@/components/diensten/premium/HeroBuildWindow";
import { OutcomeSwitchboard } from "@/components/diensten/premium/OutcomeSwitchboard";
import { PrincipleScenes } from "@/components/diensten/premium/PrincipleScenes";
import { SignalsChat } from "@/components/diensten/premium/SignalsChat";
import { StickerStrip } from "@/components/diensten/premium/StickerStrip";
import { BuildStackMatcher } from "@/components/pillars/premium/BuildStackMatcher";
import { BuildStagesScroll } from "@/components/pillars/premium/BuildStagesScroll";
import { SeoLandingBreadcrumb } from "@/components/seo-landing/SeoLandingBreadcrumb";
import { SeoLandingInlineCta } from "@/components/seo-landing/SeoLandingInlineCta";
import { SeoLandingSceneBreak } from "@/components/seo-landing/SeoLandingSceneBreak";
import { SeoLandingStickyBar } from "@/components/seo-landing/SeoLandingStickyBar";
import { SeoLandingToc } from "@/components/seo-landing/SeoLandingToc";
import { SeoLandingVisualPanel } from "@/components/seo-landing/SeoLandingVisualPanel";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import type { EnrichedSeoLandingPage } from "@/data/seo-landings/enriched-types";
import { getDienstPremium } from "@/data/dienst-premium";
import { getDienstStrategic } from "@/data/dienst-strategic";
import { siteCtas } from "@/lib/cta";
import type { SeoLandingNavProps } from "@/lib/seo-landing-nav";
import { seoLandingPath } from "@/lib/seo-landings";
import {
  getDeliverablesHeading,
  getDeliverablesIntro,
  getMythsSectionHeading,
  getMythsSectionIntro,
  getRecognitionHeading,
} from "@/lib/seo-landings-section-copy";
import { scenesAtPlacement } from "@/lib/seo-landing-sections";

const EASE = [0.22, 1, 0.36, 1] as const;
const premium = getDienstPremium("webdevelopment");
const strategic = getDienstStrategic("webdevelopment", "Bouwen");

function ProseBlock({
  block,
  page,
  variant = "light",
  headingId,
}: {
  block: { title: string; paragraphs: readonly string[] };
  page: EnrichedSeoLandingPage;
  variant?: "light" | "dark";
  headingId?: string;
}) {
  const isDark = variant === "dark";
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:gap-14">
      <div>
        <h2
          id={headingId}
          className={`text-pretty text-2xl font-extrabold tracking-tight lg:text-3xl ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {block.title}
        </h2>
        <div className="mt-6 space-y-5">
          {block.paragraphs.map((p) => (
            <p
              key={p.slice(0, 48)}
              className={`text-pretty text-base leading-relaxed lg:text-lg ${
                isDark ? "text-white/80" : "text-slate-600"
              }`}
            >
              {p}
            </p>
          ))}
        </div>
      </div>
      <div className="flex justify-center lg:sticky lg:top-24 lg:justify-end">
        <div className="scale-[0.9] lg:scale-100">
          <SeoLandingVisualPanel visual={page.visual} keyword={page.primaryKeyword} />
        </div>
      </div>
    </div>
  );
}

function SceneBreaks({
  page,
  placement,
}: {
  page: EnrichedSeoLandingPage;
  placement: "after-story" | "after-aanpak" | "after-deep-dive";
}) {
  const scenes = scenesAtPlacement(page, placement);
  if (scenes.length === 0) return null;
  return (
    <>
      {scenes.map((scene, i) => (
        <SeoLandingSceneBreak
          key={`${scene.placement}-${scene.visual}-${i}`}
          scene={scene}
          page={page}
          flip={i % 2 === 1}
        />
      ))}
    </>
  );
}

function TemplateScratchToggle() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<"template" | "scratch">("template");
  const scratch = mode === "scratch";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 lg:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
        Zelfde site, andere fundering
      </p>
      <p className="mt-2 text-sm text-white/70">
        Tik om het verschil te zien in laadtijd en CWV-score.
      </p>
      <div className="mt-4 flex gap-2">
        {(["template", "scratch"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={
              mode === m
                ? "rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-slate-900"
                : "rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-bold text-white/70 transition hover:border-white/40"
            }
          >
            {m === "template" ? "Template" : "From scratch"}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="mt-5 grid grid-cols-2 gap-3"
        >
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">
              Laadtijd
            </p>
            <p
              className={`mt-1 text-2xl font-black tracking-tight ${
                scratch ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {scratch ? "0,8s" : "4,2s"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">
              CWV-score
            </p>
            <p
              className={`mt-1 text-2xl font-black tracking-tight ${
                scratch ? "text-emerald-400" : "text-orange-300"
              }`}
            >
              {scratch ? "98" : "41"}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function SeoLandingWebsitePremiumView({
  page,
  related,
  citySiblings,
  kennisbankTeaser,
}: {
  page: EnrichedSeoLandingPage;
} & SeoLandingNavProps) {
  const reduce = useReducedMotion() ?? false;

  if (!premium || !strategic) {
    return null;
  }

  const mythsHeading = getMythsSectionHeading(page.slug);
  const mythsIntro = getMythsSectionIntro(page.slug, page.primaryKeyword);
  const recognitionHeading = getRecognitionHeading(page.slug, page.primaryKeyword);
  const deliverablesHeading = getDeliverablesHeading(page.slug, page.primaryKeyword);
  const deliverablesIntro = getDeliverablesIntro(page.slug, page.primaryKeyword);

  return (
    <article>
      <SeoLandingBreadcrumb keyword={page.primaryKeyword} city={page.location?.city} />

      <header className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:44px_44px]"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:px-8 lg:py-20">
          <div>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]"
            >
              <Sparkles className="size-3.5" aria-hidden />
              {page.eyebrow}
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.45, ease: EASE }}
              className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tighter text-slate-900 sm:text-5xl lg:text-[3.4rem]"
            >
              {page.headline}{" "}
              {page.headlineAccent ? (
                <span className="text-[#FF5722]">{page.headlineAccent}</span>
              ) : null}
            </motion.h1>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45, ease: EASE }}
              className="mt-5 max-w-xl text-balance text-xl font-medium leading-relaxed text-slate-600"
            >
              {page.subheadline}
            </motion.p>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.4, ease: EASE }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <Link
                href={siteCtas.startIntake.href}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-900 px-7 py-4 text-base font-bold text-white transition hover:shadow-lg"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 origin-bottom translate-y-full bg-[#FF5722] transition-transform duration-[550ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-0"
                />
                <span className="relative z-10">{siteCtas.startIntake.label}</span>
                <ArrowUpRight className="relative z-10 size-4" aria-hidden />
              </Link>
              <Link
                href="/diensten/webdevelopment"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300/80 bg-white/70 px-7 py-4 text-base font-bold text-slate-900 backdrop-blur transition hover:border-slate-900"
              >
                Websites from scratch
              </Link>
              <Link
                href="/bouwen"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-7 py-4 text-sm font-bold text-slate-700 transition hover:border-[#FF5722]/40 hover:text-[#FF5722]"
              >
                Alles over Bouwen
              </Link>
            </motion.div>
            <dl className="mt-10 grid grid-cols-3 gap-3 border-t border-slate-200 pt-7 text-sm sm:gap-5">
              {premium.heroStats.map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <dt className="text-slate-500">{stat.label}</dt>
                  <dd className="mt-1 font-bold leading-snug text-slate-900">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none">
            <HeroBuildWindow />
            {page.visualCaption ? (
              <p className="mt-4 text-center text-sm font-medium text-slate-500 lg:text-right">
                {page.visualCaption}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <StickerStrip items={[...premium.capabilities]} />

      <section
        id="samenvatting"
        aria-labelledby="seo-summary-heading"
        className="border-b border-slate-200 bg-gradient-to-b from-orange-50/50 to-white py-10 lg:py-12"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_280px] lg:px-8">
          <div>
            <h2 id="seo-summary-heading" className="sr-only">
              Kort antwoord
            </h2>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF5722]">
              Kort antwoord
            </p>
            <p
              id="seo-expert-summary"
              className="mt-3 text-pretty text-lg font-semibold leading-relaxed text-slate-800 lg:text-xl"
            >
              {page.expertSummary}
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {page.keyTakeaways.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm font-medium text-slate-700"
                >
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#FF5722]"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden lg:block">
            <SeoLandingToc items={page.toc} />
          </div>
        </div>
      </section>

      <section id="verhaal" aria-labelledby="verhaal-heading" className="border-b border-slate-200 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <figure className="relative mb-14 overflow-hidden rounded-3xl border border-[#FF5722]/25 bg-gradient-to-br from-[#FF5722]/[0.06] via-white to-white p-7 sm:p-9">
              <span
                className="pointer-events-none absolute -right-3 -top-7 select-none text-[6rem] font-extrabold leading-none tracking-tighter text-[#FF5722]/[0.09] sm:text-[8.5rem]"
                aria-hidden
              >
                {premium.funFactStat}
              </span>
              <p className="relative inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
                Wist je dit?
              </p>
              <blockquote className="relative mt-4 max-w-2xl text-balance text-xl font-extrabold leading-snug tracking-tight text-slate-900 sm:text-2xl">
                {premium.funFact}
              </blockquote>
              <figcaption className="relative mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#FF5722]">
                {premium.funFactSource}
              </figcaption>
            </figure>
            <ProseBlock block={page.story} page={page} headingId="verhaal-heading" />
          </Reveal>
        </div>
      </section>

      <SceneBreaks page={page} placement="after-story" />

      <section id="hoe-ik-werk" aria-labelledby="principles-heading" className="border-b border-slate-200 bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <h2
              id="principles-heading"
              className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
            >
              Hoe ik werk
            </h2>
            <p className="mt-2 max-w-xl text-slate-600">
              Drie dingen die je bij mij altijd krijgt. Wat ik ook bouw.
            </p>
          </Reveal>
          <PrincipleScenes principles={[...premium.principles]} />
          <Reveal delay={0.08}>
            <div className="mt-4 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-7">
              <p className="max-w-2xl text-[15px] leading-relaxed text-slate-700">
                <span className="font-extrabold text-slate-900">De lens op bouwen: </span>
                {premium.lens}
              </p>
              <Link
                href="/bouwen"
                className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-slate-900 transition-colors hover:text-[#FF5722]"
              >
                Alles over Bouwen
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="mythes" aria-labelledby="mythes-heading" className="border-b border-slate-200 py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 size-5 shrink-0 text-[#FF5722]" aria-hidden />
              <div>
                <h2 id="mythes-heading" className="text-xl font-extrabold text-slate-900 lg:text-2xl">
                  {mythsHeading}
                </h2>
                <p className="mt-2 max-w-2xl text-slate-600">{mythsIntro}</p>
              </div>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {page.myths.map((myth, i) => (
              <Reveal key={myth.myth} delay={i * 0.06}>
                <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-2">
                    <X className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden />
                    <p className="text-sm font-bold text-slate-500 line-through decoration-red-300/80">
                      {myth.myth}
                    </p>
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-800">
                    {myth.reality}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="herkenning" aria-labelledby="herkenning-heading" className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <h2 id="herkenning-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
              {recognitionHeading}
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">{page.painSectionIntro}</p>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {page.pains.map((pain, i) => (
              <Reveal key={pain.title} delay={i * 0.06}>
                <article className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-extrabold text-slate-900">{pain.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{pain.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Waar ik bij jou naar kijk
            </h2>
            <p className="mt-2 max-w-xl text-slate-600">
              Echte vragen. Zo start mijn intake, en elk antwoord stuurt de route bij.
            </p>
          </Reveal>
          <div className="mt-8">
            <SignalsChat signals={[...strategic.signals]} ctaHref={siteCtas.startIntake.href} />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-950 py-16 text-white lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
                Scenario
              </p>
              <h2 className="mt-3 text-pretty text-2xl font-extrabold tracking-tight lg:text-3xl">
                {page.scenario.title}
              </h2>
              <div className="mt-6 space-y-4">
                {page.scenario.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="text-pretty text-base leading-relaxed text-white/80">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <TemplateScratchToggle />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="aanpak" aria-labelledby="aanpak-heading" className="border-b border-slate-200 py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <h2 id="aanpak-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
              {deliverablesHeading}
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">{deliverablesIntro}</p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {page.deliverables.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <article className="h-full rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-orange-50/30 p-5">
                  <h3 className="text-base font-extrabold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BuildStackMatcher defaultGoalId="site" />

      <section id="deep-dive" aria-labelledby="deep-dive-heading" className="border-b border-slate-200 bg-orange-50/40 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <ProseBlock block={page.deepDive} page={page} headingId="deep-dive-heading" />
          </Reveal>
        </div>
      </section>

      <SceneBreaks page={page} placement="after-deep-dive" />

      <section id="proces" aria-labelledby="proces-heading" className="border-b border-slate-200 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <h2 id="proces-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {page.processTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Elke fase zichtbaar. Je ziet wat er gebeurt en waarom.
            </p>
          </Reveal>
          <ApproachPath steps={[...page.processSteps]} />
        </div>
      </section>

      <BuildStagesScroll title="Zo loopt een bouwtraject" stages={[...page.processSteps]} />

      <section className="border-b border-slate-200 bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <OutcomeSwitchboard outcomes={[...premium.outcomes]} />
        </div>
      </section>

      <section className="border-b border-slate-200 py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5722]">
                  Bewijs
                  {page.proofCase ? ` · ${page.proofCase}` : ""}
                </p>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
                  {page.proofTitle}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">{page.proofBody}</p>
              </div>
              <dl className="grid grid-cols-3 gap-3 self-center rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Laadtijd
                  </dt>
                  <dd className="mt-1 text-lg font-black text-emerald-600">0,8 sec</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Templates
                  </dt>
                  <dd className="mt-1 text-lg font-black text-slate-900">Nul</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    CWV
                  </dt>
                  <dd className="mt-1 text-lg font-black text-[#FF5722]">Groen</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-orange-50/50 py-12">
        <div className="mx-auto flex max-w-6xl items-start gap-4 px-4 lg:px-8">
          <InteractiveLogo className="size-12 shrink-0" interactive={false} />
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF5722]">
              {page.hotTake.label}
            </p>
            <p className="mt-2 text-pretty text-lg font-bold leading-snug text-slate-900 lg:text-xl">
              {page.hotTake.body}
            </p>
          </Reveal>
        </div>
      </section>

      <SeoLandingInlineCta
        title="Jouw situatie even doorlichten?"
        body="Ik lees je huidige setup en zeg eerlijk wat de volgende stap is. Gratis intake, geen verplichtingen."
      />

      {kennisbankTeaser ? (
        <section className="border-b border-slate-200 bg-slate-50 py-14">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <Reveal>
              <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between lg:p-8">
                <div className="flex items-start gap-3">
                  <BookOpen className="mt-1 size-5 shrink-0 text-[#FF5722]" aria-hidden />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      Verder lezen in de kennisbank
                    </p>
                    <p className="mt-2 font-bold text-slate-900">{kennisbankTeaser.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{kennisbankTeaser.description}</p>
                  </div>
                </div>
                <Link
                  href={`/kennisbank/${kennisbankTeaser.slug}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-slate-900 px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
                >
                  Lees artikel
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section id="faq" aria-labelledby="faq-heading" className="border-b border-slate-200 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <Reveal>
              <h2 id="faq-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
                Vragen over {page.primaryKeyword}
              </h2>
              <p className="mt-3 text-slate-600">
                Eerlijke antwoorden. Als het antwoord nee is, zeg ik nee.
              </p>
              <Link
                href="/diensten/webdevelopment"
                className="group mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5722]"
              >
                Meer over Websites from scratch
                <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
            <div>
              <DienstFAQ items={[...page.faq]} idPrefix={page.slug} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-b border-slate-200 bg-slate-50 py-14">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <Reveal>
              <h2 className="text-xl font-extrabold text-slate-900">Gerelateerd</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Meer onderwerpen waar je op wilt scoren, zonder dezelfde pagina twee keer te lezen.
              </p>
            </Reveal>
            <ul className="mt-5 flex flex-wrap gap-2">
              {related.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={seoLandingPath(rel.slug)}
                    className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#FF5722]/40 hover:text-[#FF5722]"
                  >
                    {rel.primaryKeyword}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {citySiblings.length > 0 ? (
        <section className="border-b border-slate-200 py-14">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <Reveal>
              <h2 className="text-xl font-extrabold text-slate-900">
                Meer in {page.location?.city}
              </h2>
            </Reveal>
            <ul className="mt-5 flex flex-wrap gap-2">
              {citySiblings.map((sib) => (
                <li key={sib.slug}>
                  <Link
                    href={seoLandingPath(sib.slug)}
                    className="inline-flex rounded-full border border-[#FF5722]/25 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#FF5722]/50 hover:text-[#FF5722]"
                  >
                    {sib.primaryKeyword}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
              {page.ctaTitle}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{page.ctaBody}</p>
            <p className="mt-3 text-sm text-slate-500">
              Vrijblijvend · Reactie binnen 1 à 2 werkdagen
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                href={siteCtas.startIntake.href}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5722] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
              >
                {siteCtas.startIntake.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={siteCtas.contact.href}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-900 px-8 py-4 text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
              >
                {siteCtas.contact.label}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SeoLandingStickyBar keyword={page.primaryKeyword} />
    </article>
  );
}
