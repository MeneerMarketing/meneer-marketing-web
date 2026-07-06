"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { SeoLandingPage } from "@/data/seo-landings/types";
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
import { siteCtas } from "@/lib/cta";
import { seoLandingPath } from "@/lib/seo-landings";
import { getSeoLandingBySlug } from "@/data/seo-landings/registry";

const EASE = [0.22, 1, 0.36, 1] as const;

function SeoLandingVisualPanel({ page }: { page: SeoLandingPage }) {
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

export function SeoLandingPageView({ page }: { page: SeoLandingPage }) {
  const reduce = useReducedMotion();
  const related = page.relatedSlugs
    .map((slug) => getSeoLandingBySlug(slug))
    .filter((p): p is SeoLandingPage => Boolean(p));

  return (
    <>
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

      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
              Herkenbaar? Dan ben je niet de enige.
            </h2>
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

      <section className="border-b border-slate-200 py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
              Wat je van mij krijgt
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Geen vage beloftes. Dit pak ik concreet aan rond {page.primaryKeyword}.
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

      <section className="border-b border-slate-200 bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight lg:text-3xl">
              {page.processTitle}
            </h2>
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

      <section className="border-b border-slate-200 py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Vragen over {page.primaryKeyword}
            </h2>
          </Reveal>
          <div className="mt-8">
            <DienstFAQ items={[...page.faq]} idPrefix={page.slug} />
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-b border-slate-200 bg-slate-50 py-14">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <Reveal>
              <h2 className="text-xl font-extrabold text-slate-900">Gerelateerd</h2>
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
    </>
  );
}
