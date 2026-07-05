import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { PillarMotionStats } from "@/components/pillars/PillarMotionStats";
import {
  JsonLdScript,
  breadcrumbJsonLd,
} from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { PillarPageData } from "@/data/pillar-pages";
import { siteCtas } from "@/lib/cta";
import { megaMenuColumns } from "@/lib/navigation";
const PILLAR_LABEL: Record<PillarPageData["slug"], string> = {
  strategie: "Strategie",
  bouwen: "Bouwen",
  vindbaarheid: "Vindbaarheid",
  campagnes: "Campagnes",
  behoud: "Behoud",
};

export function PillarLandingView({ data }: { data: PillarPageData }) {
  const column = megaMenuColumns.find((c) => c.pillarSlug === data.slug)!;
  const path = `/${data.slug}`;
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: PILLAR_LABEL[data.slug], path },
  ]);

  return (
    <>
      <JsonLdScript data={breadcrumbLd} />
      <SiteHeader />
      <main id="main" className="flex-1">
        <header className="relative overflow-hidden border-b border-mm-border bg-mm-sky-subtle">
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-mm-sky/10 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <nav className="text-xs font-semibold text-mm-muted" aria-label="Broodkruimel">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="hover:text-mm-sky-deep">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/diensten" className="hover:text-mm-sky-deep">
                    Diensten
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-mm-text">{PILLAR_LABEL[data.slug]}</li>
              </ol>
            </nav>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-mm-sky/25 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-mm-sky-deep shadow-sm backdrop-blur-sm">
              <Sparkles className="size-3.5" aria-hidden />
              Blok
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-mm-text sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              {data.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mm-muted">
              {data.subheadline}
            </p>
            <PillarMotionStats stats={data.stats} />
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={siteCtas.startIntake.href}
                className="inline-flex items-center gap-2 rounded-full bg-mm-accent px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-mm-accent/25 transition hover:bg-mm-accent-hover"
              >
                {siteCtas.startIntake.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/diensten"
                className="inline-flex items-center gap-2 rounded-full border-2 border-mm-text/15 bg-white px-6 py-3.5 text-sm font-bold text-mm-text transition hover:border-mm-sky/40"
              >
                Alle diensten
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </header>

        <section className="border-b border-mm-border bg-mm-bg">
          <div className="mx-auto max-w-6xl space-y-6 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <h2 className="text-2xl font-extrabold text-mm-text sm:text-3xl">
                Context die telt
              </h2>
            </Reveal>
            {data.introParagraphs.map((p, i) => (
              <Reveal key={i} delay={0.05 * (i + 1)}>
                <p className="max-w-3xl text-lg leading-relaxed text-mm-muted">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-b border-mm-border bg-mm-surface-elevated">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-8 lg:py-20">
            <Reveal>
              <h2 className="text-2xl font-extrabold text-mm-text sm:text-3xl">
                {data.angleTitle}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-mm-muted">
                {data.angleBody}
              </p>
            </Reveal>
            <Reveal delay={0.08} className="mt-10 lg:mt-0">
              <div className="rounded-3xl border border-mm-border bg-mm-sky-subtle/40 p-8 shadow-mm-card">
                <p className="text-xs font-bold uppercase tracking-wider text-mm-accent">
                  Diensten in dit blok
                </p>
                <p className="mt-2 text-sm text-mm-muted">{data.serviceIntro}</p>
                <ul className="mt-6 space-y-3">
                  {column.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group flex items-start justify-between gap-3 rounded-xl border border-transparent bg-white/80 px-4 py-3 transition hover:border-mm-border hover:shadow-md"
                      >
                        <span>
                          <span className="block font-bold text-mm-text group-hover:text-mm-sky-deep">
                            {item.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-mm-muted">
                            {item.description}
                          </span>
                        </span>
                        <ArrowUpRight className="size-4 shrink-0 text-mm-muted transition group-hover:text-mm-sky" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-mm-border bg-mm-bg">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <h2 className="text-2xl font-extrabold text-mm-text sm:text-3xl">
                {data.processTitle}
              </h2>
            </Reveal>
            <ol className="mt-10 grid gap-6 md:grid-cols-2">
              {data.processSteps.map((step, index) => (
                <Reveal key={step.title} delay={0.06 * index}>
                  <li className="relative flex gap-4 rounded-2xl border border-mm-border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-mm-float">
                    <div>
                      <h3 className="text-lg font-bold text-mm-text">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-mm-muted">
                        {step.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-mm-accent-subtle">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <div className="rounded-3xl border border-mm-border bg-white p-8 shadow-mm-card sm:p-10 lg:p-12">
                <h2 className="text-2xl font-extrabold text-mm-text sm:text-3xl">
                  {data.proofTitle}
                </h2>
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-mm-muted">
                  {data.proofBody}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={column.featured.href}
                    title={column.featured.title}
                    className="inline-flex items-center gap-2 rounded-full bg-mm-text px-6 py-3.5 text-sm font-bold text-white transition hover:bg-mm-sky-deep"
                  >
                    Bekijk uitgelicht
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                  <Link
                    href="/cases"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-mm-border bg-white px-6 py-3.5 text-sm font-bold text-mm-text hover:border-mm-sky/40"
                  >
                    Naar cases
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-mm-border bg-mm-sky-subtle">
          <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <h2 className="text-2xl font-extrabold text-mm-text sm:text-3xl">
                {data.ctaTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-mm-muted">
                {data.ctaBody}
              </p>
              <Link
                href={siteCtas.startIntake.href}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-mm-accent px-8 py-4 text-base font-bold text-white shadow-lg shadow-mm-accent/25 transition hover:bg-mm-accent-hover"
              >
                Start intake
                <ArrowUpRight className="size-5" aria-hidden />
              </Link>
              <p className="mt-4 text-xs text-mm-muted">
                Liever direct mailen? Dat kan via het contactformulier.
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
