import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { StickerStrip } from "@/components/diensten/premium/StickerStrip";
import { BouwenHero } from "@/components/pillars/premium/BouwenHero";
import { BuildContextSection } from "@/components/pillars/premium/BuildContextSection";
import { BuildStackMatcher } from "@/components/pillars/premium/BuildStackMatcher";
import { BuildStagesScroll } from "@/components/pillars/premium/BuildStagesScroll";
import { PillarProofPanel } from "@/components/pillars/premium/PillarProofPanel";
import { ServiceBlueprintMap } from "@/components/pillars/premium/ServiceBlueprintMap";
import {
  JsonLdScript,
  breadcrumbJsonLd,
} from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import type { PillarPageData } from "@/data/pillar-pages";
import type { PillarPremiumContent } from "@/data/pillar-premium";
import { siteCtas } from "@/lib/cta";
import { megaMenuColumns } from "@/lib/navigation";

const PILLAR_LABEL: Record<PillarPageData["slug"], string> = {
  strategie: "Strategie",
  bouwen: "Bouwen",
  vindbaarheid: "Vindbaarheid",
  campagnes: "Campagnes",
  behoud: "Behoud",
};

interface PillarPremiumViewProps {
  data: PillarPageData;
  premium: PillarPremiumContent;
}

/**
 * Premium hub-pagina voor het blok Bouwen: isometrische lagen-hero,
 * interactieve context, bouwtekening, stack-matcher en bouwtraject.
 */
export function PillarPremiumView({ data, premium }: PillarPremiumViewProps) {
  const column = megaMenuColumns.find((c) => c.pillarSlug === data.slug)!;
  const path = `/${data.slug}`;
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Diensten", path: "/diensten" },
    { name: PILLAR_LABEL[data.slug], path },
  ]);

  const serviceItems = column.items.map((item) => ({
    name: item.name,
    description: item.description,
    href: item.href,
  }));

  return (
    <>
      <JsonLdScript data={breadcrumbLd} />
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Hero */}
        <header className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:44px_44px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent"
            aria-hidden
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:px-8 lg:py-20">
            <div>
              <nav
                className="text-xs font-semibold text-slate-400"
                aria-label="Broodkruimel"
              >
                <ol className="flex flex-wrap items-center gap-1.5">
                  <li>
                    <Link href="/" className="transition-colors hover:text-slate-900">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li>
                    <Link
                      href="/diensten"
                      className="transition-colors hover:text-slate-900"
                    >
                      Diensten
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li className="text-slate-900">{PILLAR_LABEL[data.slug]}</li>
                </ol>
              </nav>

              <p className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#FF5722]/25 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
                <Sparkles className="size-3.5" aria-hidden />
                {column.category} · {column.subtitle}
              </p>

              <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tighter text-slate-900 sm:text-5xl lg:text-[3.6rem]">
                {data.headline}
              </h1>
              <p className="mt-5 max-w-xl text-balance text-xl font-medium leading-relaxed text-slate-600">
                {data.subheadline}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={siteCtas.groeiscan.href}
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-900 px-7 py-4 text-base font-bold tracking-tight text-white transition hover:shadow-lg"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 origin-bottom translate-y-full bg-[#FF5722] transition-transform duration-[550ms] ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-0"
                  />
                  <span className="relative z-10">{siteCtas.groeiscan.label}</span>
                  <ArrowUpRight className="relative z-10 size-4" aria-hidden />
                </Link>
                <Link
                  href="/diensten"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300/80 bg-white/70 px-7 py-4 text-base font-bold tracking-tight text-slate-900 backdrop-blur transition hover:border-slate-900"
                >
                  Alle diensten
                </Link>
              </div>

              <dl className="mt-11 grid max-w-lg grid-cols-3 gap-5 border-t border-slate-200 pt-7 text-sm tracking-tight">
                {data.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-slate-500">{stat.label}</dt>
                    <dd className="mt-1 font-bold text-slate-900">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative hidden lg:block">
              <BouwenHero />
            </div>
          </div>
        </header>

        <StickerStrip items={premium.stickers} />

        <BuildContextSection
          introParagraphs={data.introParagraphs}
          angleTitle={data.angleTitle}
          angleBody={data.angleBody}
          funFact={premium.funFact}
          funFactSource={premium.funFactSource}
          funFactStat={premium.funFactStat}
        />

        {/* De bouwtekening: interactieve diensten-hub */}
        <ServiceBlueprintMap
          title="Elk onderdeel van je site is een vak apart."
          subtitle="Beweeg over de bouwtekening en zie welke dienst waar aan het werk is. Of pak de lijst en spring direct naar het juiste traject."
          services={serviceItems}
        />

        <BuildStackMatcher />

        {/* Bouwtraject als scroll-ervaring */}
        <BuildStagesScroll title={data.processTitle} stages={data.processSteps} />

        {/* Proof */}
        <section className="bg-gradient-to-b from-white to-slate-50/80">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <PillarProofPanel
                title={data.proofTitle}
                body={data.proofBody}
                metrics={premium.proofMetrics}
                featuredHref={column.featured.href}
                featuredLabel="Bekijk uitgelicht"
              />
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden border-t border-slate-800 bg-slate-950">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.06)_1px,transparent_1px)] bg-[size:32px_32px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-[#FF5722]/15 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <Reveal>
              <span className="mx-auto inline-block" aria-hidden>
                <InteractiveLogo className="h-16 w-16" />
              </span>
              <h2 className="mt-5 text-balance text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {data.ctaTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
                {data.ctaBody}
              </p>
              <Link
                href={siteCtas.groeiscan.href}
                className="group relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#FF5722] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#FF5722]/30 transition hover:shadow-[#FF5722]/50"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 origin-bottom translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:translate-y-0"
                />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-slate-900">
                  Start met Groeiscan
                </span>
                <ArrowUpRight className="relative z-10 size-5 transition-colors duration-300 group-hover:text-slate-900" aria-hidden />
              </Link>
              <p className="mt-4 text-xs text-slate-500">
                Liever direct mailen? Vul je contactgegevens in op de Groeiscan-pagina.
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
