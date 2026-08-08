import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Gauge,
  Layers,
  Sparkles,
} from "lucide-react";
import { ConversionAside } from "@/components/contact/ConversionAside";
import { ConversionForm } from "@/components/contact/ConversionForm";
import { ConversionHero } from "@/components/contact/ConversionHero";
import { HeroProjectWindow } from "@/components/contact/HeroProjectWindow";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { siteCtas } from "@/lib/cta";
import { BRAND_DISPLAY } from "@/lib/seo/e-e-a-t";
import { absoluteUrl } from "@/lib/site";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo/robots-policy";

export const metadata: Metadata = {
  title: "Project starten",
  description:
    "Dien een projectaanvraag in bij Meneer Marketing: type, budget, timing. Ik reageer met een concreet vervolg.",
  alternates: { canonical: absoluteUrl("/project-starten") },
  robots: NOINDEX_FOLLOW_ROBOTS,
  openGraph: {
    title: `Project starten | ${BRAND_DISPLAY}`,
    description:
      "Van idee naar een helder plan op maat. Bouw, marketing, automatisering of design.",
    url: absoluteUrl("/project-starten"),
    locale: "nl_NL",
    type: "website",
  },
};

const PROJECT_STICKERS = [
  "Scherpe kickoff",
  "Scope eerst",
  "Budgetbanden",
  "Webshop of site",
  "Marketing",
  "Autopilot",
  "Eerste win snel",
] as const;

export default function ProjectStartenPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <ConversionHero
          tone="accent"
          eyebrow="Project starten · plan op maat"
          title={
            <>
              Van idee naar{" "}
              <span className="text-[#FF5722]">plan op maat</span>.
            </>
          }
          intro={
            <>
              Vertel kort wat je wilt bouwen of verbeteren. Type, budget en
              timing geven mij direct genoeg om{" "}
              <span className="font-semibold text-slate-900">scherp mee te denken</span>
              .
            </>
          }
          primaryCtaLabel="Start projectaanvraag"
          secondary={
            <Link
              href={siteCtas.startIntake.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/80 bg-white/70 px-6 py-3.5 text-sm font-bold text-slate-900 backdrop-blur transition hover:border-slate-900"
            >
              Eerst de intake
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          }
          stats={[
            { value: "7 typen", label: "Projectscopes" },
            { value: "5 banden", label: "Budget" },
            { value: "≤ 2d", label: "Eerste reactie" },
          ]}
          visual={<HeroProjectWindow />}
          stickers={PROJECT_STICKERS}
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
                  body: "Ik scan je site/shop en toets scope aan jouw doelen.",
                },
                {
                  title: "Scope-call (30 min)",
                  body: "Online, concreet. Jij met beslissers, ik met de uitvoering.",
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
                  description: "Per blok wat ik uitvoer en wanneer.",
                  icon: <Layers className="size-4" />,
                },
                {
                  label: "Start intake",
                  href: siteCtas.startIntake.href,
                  description: "Twee minuten context, daarna plan ik het gesprek.",
                  icon: <Gauge className="size-4" />,
                },
                {
                  label: "Cases",
                  href: "/cases",
                  description: "Echte outcomes, echte beelden.",
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
