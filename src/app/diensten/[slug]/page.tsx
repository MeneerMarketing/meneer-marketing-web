import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { Reveal } from "@/components/effects/Reveal";
import { DienstFAQ } from "@/components/diensten/DienstFAQ";
import { DienstStrategyBlocks } from "@/components/diensten/DienstStrategyBlocks";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DienstPremiumView } from "@/components/diensten/premium/DienstPremiumView";
import { getDienstContent } from "@/data/dienst-content";
import { getDienstPremium } from "@/data/dienst-premium";
import { getDienstStrategic } from "@/data/dienst-strategic";
import { getDienstExtra } from "@/data/dienst-extras";
import { getAllDienstSlugs, getDienstBySlug, getRelatedDiensten } from "@/lib/diensten";
import { ctaNav, megaMenuColumns } from "@/lib/navigation";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams(): { slug: string }[] {
  return getAllDienstSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDienstBySlug(slug);
  if (!d) return { title: "Dienst" };
  const title = `${d.name} | MeneerMarketing`;
  return {
    title: d.name,
    description: d.description,
    alternates: { canonical: absoluteUrl(`/diensten/${slug}`) },
    openGraph: {
      title,
      description: d.description,
      url: absoluteUrl(`/diensten/${slug}`),
      locale: "nl_NL",
      type: "website",
    },
  };
}

export default async function DienstPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getDienstBySlug(slug);
  if (!d) notFound();

  const body = getDienstContent(slug);
  const extra = getDienstExtra(slug);
  const related = getRelatedDiensten(slug, 4);
  const pageUrl = absoluteUrl(`/diensten/${slug}`);
  const strategic = getDienstStrategic(slug, d.pillar);

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: d.name,
    description: d.description,
    provider: {
      "@type": "Organization",
      name: "MeneerMarketing",
      url: absoluteUrl("/"),
    },
    areaServed: "NL",
    url: pageUrl,
  };

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Diensten", path: "/diensten" },
    { name: d.name, path: `/diensten/${slug}` },
  ]);

  const faqLd =
    extra?.faq.length ? faqPageJsonLd(extra.faq) : null;

  const premium = getDienstPremium(slug);
  if (premium) {
    const pillarSlug = megaMenuColumns.find(
      (col) => col.category === d.pillar,
    )?.pillarSlug;
    return (
      <>
        <JsonLdScript data={serviceLd} />
        <JsonLdScript data={breadcrumbLd} />
        {faqLd ? <JsonLdScript data={faqLd} /> : null}
        <SiteHeader />
        <main id="main" className="flex-1">
          <DienstPremiumView
            dienst={d}
            pillarHref={pillarSlug ? `/${pillarSlug}` : "/diensten"}
            body={body}
            extra={extra}
            strategic={strategic}
            related={related}
            heroKicker={premium.heroKicker}
            funFact={premium.funFact}
            funFactSource={premium.funFactSource}
            approachSteps={premium.approachSteps}
            tickerItems={premium.tickerItems}
            heroStats={premium.heroStats}
          />
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <JsonLdScript data={serviceLd} />
      <JsonLdScript data={breadcrumbLd} />
      {faqLd ? <JsonLdScript data={faqLd} /> : null}
      <SiteHeader />
      <main id="main" className="flex-1">
        <article>
          <header className="relative overflow-hidden border-b border-mm-border bg-mm-sky-subtle">
            <div
              className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-mm-sky/15 blur-3xl"
              aria-hidden
            />
            <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
              <nav
                className="text-xs font-semibold text-mm-muted"
                aria-label="Broodkruimel"
              >
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
                  <li className="text-mm-text">{d.name}</li>
                </ol>
              </nav>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-mm-sky-deep">
                {d.pillar} · {d.pillarSubtitle}
              </p>
              <h1 className="mt-3 max-w-4xl text-balance text-4xl font-extrabold tracking-tight text-mm-text sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                {d.name}
              </h1>
              <p className="mt-5 max-w-2xl text-xl font-medium leading-relaxed text-mm-muted">
                {d.description}
              </p>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14 lg:items-start">
              <div className="min-w-0">
                <Reveal>
                  <p className="text-xl leading-relaxed text-mm-text">{body.intro}</p>
                </Reveal>

                <div className="mt-14">
                  <DienstStrategyBlocks
                    dienstName={d.name}
                    strategic={strategic}
                  />
                </div>

                <Reveal delay={0.06}>
                  <h2 className="mt-14 text-2xl font-extrabold text-mm-text">
                    Zo pakken we het aan
                  </h2>
                  <ul className="mt-6 space-y-4">
                    {body.bullets.map((line) => (
                      <li
                        key={line}
                        className="flex gap-3 rounded-2xl border border-mm-border/80 bg-mm-surface-elevated px-4 py-4 text-base leading-relaxed text-mm-text shadow-sm"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-5 shrink-0 text-mm-accent"
                          aria-hidden
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                {extra?.outcomes.length ? (
                  <Reveal delay={0.1}>
                    <h2 className="mt-14 text-2xl font-extrabold text-mm-text">
                      Concrete resultaten waar je op stuurt
                    </h2>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-1">
                      {extra.outcomes.map((o) => (
                        <li
                          key={o}
                          className="rounded-2xl border border-mm-sky/25 bg-mm-sky-subtle/40 px-5 py-4 text-sm font-semibold leading-snug text-mm-text"
                        >
                          {o}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ) : null}

                <Reveal delay={0.12}>
                  <p className="mt-14 text-lg leading-relaxed text-mm-muted">
                    {body.closing}
                  </p>
                </Reveal>

                {extra?.faq.length ? (
                  <section className="mt-16" aria-labelledby={`faq-${slug}`}>
                    <Reveal>
                      <h2
                        id={`faq-${slug}`}
                        className="text-2xl font-extrabold text-mm-text"
                      >
                        Veelgestelde vragen
                      </h2>
                      <p className="mt-2 text-mm-muted">
                        Korte antwoorden. In een gesprek maken we ze specifiek
                        voor jouw situatie.
                      </p>
                    </Reveal>
                    <div className="mt-8">
                      <DienstFAQ items={extra.faq} idPrefix={slug} />
                    </div>
                  </section>
                ) : null}
              </div>

              <aside className="mt-12 min-w-0 space-y-6 lg:mt-0 lg:sticky lg:top-28">
                <div className="rounded-3xl border border-mm-border bg-mm-accent-subtle p-6 shadow-mm-card">
                  <p className="text-sm font-bold text-mm-text">
                    Klaar om te sparren?
                  </p>
                  <p className="mt-2 text-sm text-mm-muted">
                    Start met intake of Groeiscan. We koppelen deze dienst aan
                    je groeidoelen.
                  </p>
                  <Link
                    href={ctaNav.href}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-mm-accent px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-mm-accent-hover"
                  >
                    {ctaNav.label}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </div>
                {related.length > 0 ? (
                  <div className="rounded-3xl border border-mm-border bg-white p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-mm-muted">
                      Meer binnen {d.pillar}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {related.map((r) => (
                        <li key={r.slug}>
                          <Link
                            href={`/diensten/${r.slug}`}
                            className="group flex items-center justify-between gap-2 text-sm font-semibold text-mm-text hover:text-mm-sky-deep"
                          >
                            <span>{r.name}</span>
                            <ArrowUpRight className="size-4 shrink-0 text-mm-muted opacity-0 transition group-hover:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </aside>
            </div>

            <div className="mt-16 flex flex-wrap gap-3 border-t border-mm-border pt-10">
              <Link
                href={ctaNav.href}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-mm-accent px-6 py-3.5 text-base font-bold text-white shadow-md shadow-mm-accent/25 hover:bg-mm-accent-hover"
              >
                {ctaNav.label}
                <ArrowUpRight className="size-5" aria-hidden />
              </Link>
              <Link
                href="/diensten"
                className="inline-flex items-center justify-center rounded-full border border-mm-border px-6 py-3.5 text-base font-semibold text-mm-text hover:bg-mm-surface"
              >
                Alle diensten
              </Link>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
