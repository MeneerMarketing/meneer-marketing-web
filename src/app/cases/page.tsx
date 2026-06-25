import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, LineChart, Workflow, Zap } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { AnimatedMetric } from "@/components/home/AnimatedMetric";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { siteCtas } from "@/lib/cta";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cases. Resultaten die we met klanten neerzetten",
  description:
    "Voorbeeldtrajecten: Shopify-performance, marketing alignment en e-commerce automatisering. Vervang placeholders met jouw echte merknamen en cijfers.",
  alternates: { canonical: absoluteUrl("/cases") },
  openGraph: {
    title: "MeneerMarketing Cases",
    description:
      "Van trage shop naar schaalbaar platform. Cases in e-com, marketing en automatisering.",
    url: absoluteUrl("/cases"),
    locale: "nl_NL",
    type: "website",
  },
};

const cases = [
  {
    icon: Zap,
    eyebrow: "E-commerce · Shopify",
    title: "Van trage template naar storefront die conversie aankan",
    metric: "–2.1s LCP",
    body: "Herstructurering van kritieke secties, app-audit en image pipeline. Campagnes kregen dezelfde landingservaring. Minder bounce, scherpere ROAS.",
    tags: ["Performance", "CWV", "Ads alignment"],
  },
  {
    icon: LineChart,
    eyebrow: "Marketing · SEO & paid",
    title: "Semantische structuur + ads die hetzelfde verhaal vertellen",
    metric: "Één meetmodel",
    body: "Clusters opgebouwd rond echte vragen van de doelgroep. Events en content afgestemd op funnel. Minder ruis in optimalisatie.",
    tags: ["SEO", "Google Ads", "GTM"],
  },
  {
    icon: Workflow,
    eyebrow: "Automatisering · operations",
    title: "Order → boekhouding → klantmail zonder spreadsheet-stress",
    metric: "Uren terug",
    body: "n8n-flows met retries, logging en alerts. Team ziet status in Slack. Geen ‘even snel handmatig’ meer op vrijdagmiddag.",
    tags: ["n8n", "Shopify", "Finance"],
  },
] as const;

export default function CasesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <header className="border-b border-mm-border bg-mm-sky-subtle">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-mm-sky-deep">
              Bewijs
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-mm-text sm:text-5xl">
              Cases die laten zien{" "}
              <span className="text-mm-sky-deep">hoe wij denken en bouwen.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mm-muted">
              Onderstaande trajecten zijn representatief voor het type werk dat we
              doen. Vervang ze met jouw echte projecten, logo’s en harde cijfers
              zodra je die mag publiceren.
            </p>
            <Link
              href={siteCtas.samenwerken.href}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-mm-accent px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-mm-accent-hover"
            >
              {siteCtas.samenwerken.label}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </header>

        <section className="bg-mm-bg">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <ul className="grid gap-10 lg:gap-14">
              {cases.map((c, i) => {
                const Icon = c.icon;
                return (
                  <Reveal key={c.title} delay={0.06 * i}>
                    <li>
                      <article className="grid gap-8 rounded-3xl border border-mm-border bg-white p-8 shadow-mm-card lg:grid-cols-[1fr_minmax(0,280px)] lg:items-start lg:p-10">
                        <div>
                          <span className="inline-flex items-center gap-2 rounded-full bg-mm-surface px-3 py-1 text-xs font-bold uppercase tracking-wider text-mm-muted">
                            <Icon className="size-3.5 text-mm-sky-deep" />
                            {c.eyebrow}
                          </span>
                          <h2 className="mt-4 text-2xl font-extrabold text-mm-text sm:text-3xl">
                            {c.title}
                          </h2>
                          <p className="mt-4 text-lg leading-relaxed text-mm-muted">
                            {c.body}
                          </p>
                          <ul className="mt-6 flex flex-wrap gap-2">
                            {c.tags.map((t) => (
                              <li
                                key={t}
                                className="rounded-full border border-mm-border bg-mm-bg px-3 py-1 text-xs font-bold text-mm-text"
                              >
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col justify-between rounded-2xl border border-mm-border bg-mm-accent-subtle p-6">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-mm-accent">
                              Highlight
                            </p>
                            <AnimatedMetric className="mt-4 text-3xl font-black tracking-tight text-mm-accent">
                              {c.metric}
                            </AnimatedMetric>
                          </div>
                          <p className="mt-6 text-sm text-mm-muted">
                            Vervang dit door een concreet resultaat uit je analytics
                            of finance-export.
                          </p>
                        </div>
                      </article>
                    </li>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="border-t border-mm-border bg-mm-surface">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <h2 className="text-2xl font-extrabold text-mm-text sm:text-3xl">
                Jouw case hier?
              </h2>
              <p className="mt-4 text-lg text-mm-muted">
                We documenteren trajecten het liefst samen met jouw team. Zo
                worden verhalen eerlijk, meetbaar en commercieel sterk.
              </p>
              <Link
                href={siteCtas.groeiscan.href}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-mm-text px-8 py-4 text-sm font-bold text-white transition hover:bg-mm-sky-deep"
              >
                Start met Groeiscan
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
