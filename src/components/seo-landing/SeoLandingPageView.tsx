"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, Lightbulb, Sparkles, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { EnrichedSeoLandingPage } from "@/data/seo-landings/enriched-types";
import { SeoLandingBreadcrumb } from "@/components/seo-landing/SeoLandingBreadcrumb";
import { SeoLandingToc } from "@/components/seo-landing/SeoLandingToc";
import {
  SeoLandingAiVisual,
  SeoLandingBuildVisual,
  SeoLandingContentVisual,
  SeoLandingGoogleAdsVisual,
  SeoLandingMetaAdsVisual,
  SeoLandingPortalVisual,
  SeoLandingSerpVisual,
  SeoLandingWebshopVisual,
} from "@/components/seo-landing/visuals/SeoLandingVisuals";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { Reveal } from "@/components/effects/Reveal";
import { DienstFAQ } from "@/components/diensten/DienstFAQ";
import {
  SeoLandingAnalogyBlock,
  SeoLandingCoffeeChat,
  SeoLandingConfessionBlock,
  SeoLandingInnerVoice,
  SeoLandingLocalColor,
  SeoLandingNightmareList,
  SeoLandingRantBlock,
} from "@/components/seo-landing/SeoLandingFunSections";
import { siteCtas } from "@/lib/cta";
import { seoLandingPath } from "@/lib/seo-landings";
import { getSeoLandingBySlug, getAllSeoLandingPages } from "@/data/seo-landings/registry";
import { getKennisbankArticleBySlug } from "@/lib/kennisbank";

const EASE = [0.22, 1, 0.36, 1] as const;

function SeoLandingVisualPanel({ page }: { page: EnrichedSeoLandingPage }) {
  switch (page.visual) {
    case "google-ads":
      return <SeoLandingGoogleAdsVisual />;
    case "meta-ads":
      return <SeoLandingMetaAdsVisual />;
    case "seo-serp":
      return <SeoLandingSerpVisual keyword={page.primaryKeyword} />;
    case "website-build":
      return <SeoLandingBuildVisual />;
    case "webshop":
      return <SeoLandingWebshopVisual />;
    case "b2b-portal":
      return <SeoLandingPortalVisual />;
    case "content-hub":
      return <SeoLandingContentVisual />;
    case "ai-search":
      return <SeoLandingAiVisual keyword={page.primaryKeyword} />;
    default:
      return null;
  }
}

function ProseSection({
  block,
  variant = "light",
}: {
  block: { title: string; paragraphs: readonly string[] };
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";
  return (
    <div>
      <h2
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
  );
}

export function SeoLandingPageView({ page }: { page: EnrichedSeoLandingPage }) {
  const reduce = useReducedMotion() ?? false;
  const related = page.relatedSlugs
    .map((slug) => getSeoLandingBySlug(slug))
    .filter((p): p is EnrichedSeoLandingPage => Boolean(p));

  const kennisbankArticle = page.kennisbankSlug
    ? getKennisbankArticleBySlug(page.kennisbankSlug)
    : null;

  const citySiblings = page.location
    ? getAllSeoLandingPages()
        .filter(
          (p) =>
            p.location?.city === page.location?.city && p.slug !== page.slug,
        )
        .slice(0, 8)
        .map((p) => getSeoLandingBySlug(p.slug))
        .filter((p): p is EnrichedSeoLandingPage => Boolean(p))
    : [];

  return (
    <article>
      <SeoLandingBreadcrumb
        keyword={page.primaryKeyword}
        city={page.location?.city}
      />
      <section className="relative overflow-x-clip border-b border-slate-200 bg-white py-16 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,87,34,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]"
            >
              {page.eyebrow}
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.45, ease: EASE }}
              className="mt-4 text-pretty text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 lg:text-5xl"
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
              className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-slate-600"
            >
              {page.subheadline}
            </motion.p>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.4, ease: EASE }}
              className="mt-4 max-w-xl rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-3 text-pretty text-sm font-medium leading-relaxed text-slate-700"
            >
              {page.uniqueOpener}
            </motion.p>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.4, ease: EASE }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href={siteCtas.startIntake.href}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
              >
                {siteCtas.startIntake.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={`/${page.pillarSlug}`}
                className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
              >
                Meer over {page.pillarLabel}
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.5, ease: EASE }}
            className="flex flex-col items-center lg:items-end"
          >
            <SeoLandingVisualPanel page={page} />
            {page.visualCaption ? (
              <p className="mt-4 max-w-md text-center text-sm font-medium text-slate-500 lg:text-right">
                {page.visualCaption}
              </p>
            ) : null}
          </motion.div>
        </div>
      </section>

      <section
        id="samenvatting"
        aria-labelledby="seo-summary-heading"
        className="border-b border-slate-200 bg-gradient-to-b from-orange-50/50 to-white py-10"
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
              className="mt-3 text-pretty text-lg font-semibold leading-relaxed text-slate-800"
            >
              {page.expertSummary}
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {page.keyTakeaways.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm font-medium text-slate-700"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#FF5722]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-slate-500">
              Door Meneer Marketing
              {page.location?.city === "Apeldoorn"
                ? " · gevestigd in Apeldoorn"
                : page.location
                  ? ` · actief in ${page.location.city}`
                  : " · marketingbureau Nederland"}
            </p>
          </div>
          <div className="hidden lg:block">
            <SeoLandingToc items={page.toc} />
          </div>
        </div>
      </section>

      <section id="verhaal" aria-labelledby="verhaal-heading" className="border-b border-slate-200 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Reveal>
            <ProseSection block={page.story} />
          </Reveal>
        </div>
      </section>

      <SeoLandingCoffeeChat chat={page.coffeeChat} />

      <section id="mythes" aria-labelledby="mythes-heading" className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 size-5 shrink-0 text-[#FF5722]" aria-hidden />
              <div>
                <h2 id="mythes-heading" className="text-xl font-extrabold text-slate-900 lg:text-2xl">
                  Mythe vs werkelijkheid
                </h2>
                <p className="mt-2 max-w-2xl text-slate-600">
                  Wat je op forums leest over {page.primaryKeyword}, en wat ik in accounts en shops
                  echt zie.
                </p>
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

      <section id="herkenning" aria-labelledby="herkenning-heading" className="border-b border-slate-200 py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <h2 id="herkenning-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
              Herkenbaar? Dan ben je niet de enige.
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              {page.painSectionIntro}
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {page.pains.map((pain, i) => (
              <Reveal key={pain.title} delay={i * 0.06}>
                <article className="h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
                  <h3 className="text-lg font-extrabold text-slate-900">{pain.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{pain.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SeoLandingInnerVoice voice={page.innerVoice} />

      <section className="border-b border-slate-200 bg-slate-950 py-16 text-white lg:py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Reveal>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:p-8">
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
            </div>
          </Reveal>
        </div>
      </section>

      {page.localColor ? <SeoLandingLocalColor block={page.localColor} /> : null}

      <section id="aanpak" aria-labelledby="aanpak-heading" className="border-b border-slate-200 py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <h2 id="aanpak-heading" className="text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
              Wat je van mij krijgt
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Geen vage beloftes rond {page.primaryKeyword}. Dit pak ik concreet aan, met je marge en
              je tijd in gedachten.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {page.deliverables.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <article className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-orange-50/30 p-5">
                  <h3 className="text-base font-extrabold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="deep-dive" aria-labelledby="deep-dive-heading" className="border-b border-slate-200 bg-orange-50/40 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Reveal>
            <ProseSection block={page.deepDive} />
          </Reveal>
        </div>
      </section>

      <SeoLandingRantBlock rant={page.rant} />

      <SeoLandingAnalogyBlock analogy={page.analogy} />

      <section id="proces" aria-labelledby="proces-heading" className="border-b border-slate-200 bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <h2 id="proces-heading" className="text-2xl font-extrabold tracking-tight lg:text-3xl">
              {page.processTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-white/65">
              Geen mysterieus black box proces. Wel een volgorde die je bankrekening snapt.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {page.processSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-extrabold text-[#FF5722]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{step.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF5722]">
                Bewijs
                {page.proofCase ? ` · ${page.proofCase}` : ""}
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
                {page.proofTitle}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
                {page.proofBody}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <SeoLandingNightmareList title={page.nightmare.title} items={page.nightmare.items} />

      <section className="border-b border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-1 size-5 shrink-0 text-amber-500" aria-hidden />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Weetje
                </p>
                <p className="mt-2 text-pretty text-lg font-semibold leading-relaxed text-slate-800">
                  {page.weirdFact}
                </p>
              </div>
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
            <p className="mt-2 text-pretty text-lg font-bold leading-snug text-slate-900">
              {page.hotTake.body}
            </p>
          </Reveal>
        </div>
      </section>

      <SeoLandingConfessionBlock confession={page.confession} />

      <section className="border-b border-slate-200 py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {page.thisWeek.title}
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Gratis winst of inzicht. Geen retainer nodig om hier te beginnen.
            </p>
          </Reveal>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {page.thisWeek.items.map((item, i) => (
              <Reveal key={item} delay={i * 0.04}>
                <li className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <span
                    className="mt-2 size-2 shrink-0 rounded-full bg-[#FF5722]"
                    aria-hidden
                  />
                  <span className="text-sm font-medium leading-relaxed text-slate-700">{item}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-900 py-14 text-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Reveal>
            <h2 className="text-xl font-extrabold tracking-tight lg:text-2xl">
              {page.honestNo.title}
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-white/80">
              {page.honestNo.body}
            </p>
          </Reveal>
        </div>
      </section>

      {kennisbankArticle ? (
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
                    <p className="mt-2 font-bold text-slate-900">{kennisbankArticle.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{kennisbankArticle.description}</p>
                  </div>
                </div>
                <Link
                  href={`/kennisbank/${kennisbankArticle.slug}`}
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

      <section id="faq" aria-labelledby="faq-heading" className="border-b border-slate-200 py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Reveal>
            <h2 id="faq-heading" className="text-2xl font-extrabold tracking-tight text-slate-900">
              Vragen over {page.primaryKeyword}
            </h2>
            <p className="mt-3 text-slate-600">
              Eerlijke antwoorden. Geen salesscript. Als het antwoord nee is, zeg ik nee.
            </p>
          </Reveal>
          <div className="mt-8">
            <DienstFAQ items={[...page.faq]} idPrefix={page.slug} />
          </div>
        </div>
      </section>

      {citySiblings.length > 0 ? (
        <section className="border-b border-slate-200 bg-orange-50/30 py-14">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <Reveal>
              <h2 className="text-xl font-extrabold text-slate-900">
                Meer in {page.location?.city}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Andere diensten in dezelfde stad. Handig als je meer wilt weten wat ik lokaal aanbied.
              </p>
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

      {related.length > 0 ? (
        <section className="border-b border-slate-200 bg-slate-50 py-14">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <Reveal>
              <h2 className="text-xl font-extrabold text-slate-900">Gerelateerd</h2>
              <p className="mt-2 text-sm text-slate-600">
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

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {page.ctaTitle}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{page.ctaBody}</p>
            <Link
              href={siteCtas.startIntake.href}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white transition hover:bg-[#FF5722]"
            >
              Plan je intake
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
