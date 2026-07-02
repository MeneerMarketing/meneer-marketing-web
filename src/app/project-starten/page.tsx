import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeEuro,
  Gauge,
  Layers,
  Rocket,
  Sparkles,
  Timer,
} from "lucide-react";
import { ConversionAside } from "@/components/contact/ConversionAside";
import { ConversionForm } from "@/components/contact/ConversionForm";
import { ConversionHero } from "@/components/contact/ConversionHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { siteCtas } from "@/lib/cta";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Project starten",
  description:
    "Dien een projectaanvraag in bij MeneerMarketing: type, budget, timing. We reageren met een concreet vervolg.",
  alternates: { canonical: absoluteUrl("/project-starten") },
  openGraph: {
    title: "Project starten | MeneerMarketing",
    description:
      "Van idee naar een helder plan op maat. Bouw, marketing, automatisering of design.",
    url: absoluteUrl("/project-starten"),
    locale: "nl_NL",
    type: "website",
  },
};

export default function ProjectStartenPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <ConversionHero
          tone="accent"
          eyebrow="Project starten"
          title={
            <>
              Van idee naar{" "}
              <span className="bg-gradient-to-r from-mm-accent via-orange-500 to-mm-sky-deep bg-clip-text text-transparent">
                plan op maat
              </span>
              .
            </>
          }
          intro={
            <>
              Vertel kort wat je wilt bouwen of verbeteren. Type, budget en
              timing geven ons direct genoeg om{" "}
              <span className="font-semibold text-mm-text">scherp mee te denken</span>
              {" "}. Zonder rondjes om de hete brei.
            </>
          }
          primaryCtaLabel="Start projectaanvraag"
          secondary={
            <Link
              href={siteCtas.groeiscan.href}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-mm-text/10 bg-white px-6 py-3.5 text-sm font-bold text-mm-text transition hover:border-mm-accent/40"
            >
              Eerst de Groeiscan
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          }
          badges={[
            { icon: <Rocket className="size-3.5" />, label: "Scherpe kickoff" },
            { icon: <BadgeEuro className="size-3.5" />, label: "Realistische budgetindicatie" },
            { icon: <Timer className="size-3.5" />, label: "Start binnen weken mogelijk" },
          ]}
          stats={[
            { value: "7 typen", label: "Projectscopes" },
            { value: "5", label: "Budgetbanden" },
            { value: "≤ 2d", label: "Eerste reactie" },
          ]}
        />

        <section
          className="relative border-t border-mm-border/60 bg-mm-bg py-16 sm:py-24"
          aria-label="Projectaanvraag"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:px-8">
            <ConversionForm variant="project-starten" />
            <ConversionAside
              quickMailSubject="Projectaanvraag bespreken"
              steps={[
                {
                  title: "Voorbereiding",
                  body: "We scannen je site/shop en toetsen scope aan jouw doelen.",
                },
                {
                  title: "Scope-call (30 min)",
                  body: "Online, concreet. Jij met beslissers, wij met uitvoerenden.",
                },
                {
                  title: "Voorstel met fases",
                  body: "Met prijsvork, planning en een eerste productbare win.",
                },
              ]}
              links={[
                {
                  label: "Bekijk alle diensten",
                  href: "/diensten",
                  description: "Per blok wat we uitvoeren en wanneer.",
                  icon: <Layers className="size-4" />,
                },
                {
                  label: "Groeiscan playground",
                  href: siteCtas.groeiscan.href,
                  description: "Prioriteit bepalen vóór scope.",
                  icon: <Gauge className="size-4" />,
                },
                {
                  label: "Onze cases",
                  href: "/cases",
                  description: "Echte outcomes, geen moodboards.",
                  icon: <Sparkles className="size-4" />,
                },
              ]}
              trustLabel="Je krijgt een antwoord van een engineer of strateeg. Niet van een AI."
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
