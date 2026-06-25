import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Brain,
  Compass,
  MessageSquare,
  ShieldCheck,
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
  title: "Start intake",
  description:
    "Plan een intake bij MeneerMarketing. Kies onderwerp en prioriteit, wij bereiden een scherp eerste gesprek voor.",
  alternates: { canonical: absoluteUrl("/intake") },
  openGraph: {
    title: "Start intake | MeneerMarketing",
    description:
      "Web, marketing, automatisering of design: start met een heldere eerste sessie.",
    url: absoluteUrl("/intake"),
    locale: "nl_NL",
    type: "website",
  },
};

export default function IntakePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <ConversionHero
          tone="dual"
          eyebrow="Intake"
          title={
            <>
              Start met een{" "}
              <span className="bg-gradient-to-r from-mm-sky-deep via-mm-sky to-mm-accent bg-clip-text text-transparent">
                heldere eerste sessie
              </span>
              .
            </>
          }
          intro={
            <>
              Geen verkoopcall, geen funnel. Een gesprek waarin we samen
              scherp krijgen wat slim is om{" "}
              <span className="font-semibold text-mm-text">eerst</span> aan te pakken.
            </>
          }
          primaryCtaLabel="Plan mijn intake"
          secondary={
            <Link
              href="/werkwijze"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-mm-text/10 bg-white px-6 py-3.5 text-sm font-bold text-mm-text transition hover:border-mm-sky/40"
            >
              Onze werkwijze
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          }
          badges={[
            { icon: <Brain className="size-3.5" />, label: "Senior strateeg aan tafel" },
            { icon: <Timer className="size-3.5" />, label: "30 minuten • online" },
            { icon: <ShieldCheck className="size-3.5" />, label: "Vrijblijvend" },
          ]}
          stats={[
            { value: "30 min", label: "Intake-duur" },
            { value: "0 €", label: "Kosten" },
            { value: "≤ 2d", label: "Plancheck" },
          ]}
        />

        <section
          className="relative border-t border-mm-border/60 bg-mm-bg py-16 sm:py-24"
          aria-label="Intake formulier"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:px-8">
            <ConversionForm variant="intake" />
            <ConversionAside
              processTitle="Hoe de intake werkt"
              quickMailSubject="Intake inplannen"
              steps={[
                {
                  title: "Aanvraag binnen",
                  body: "We bevestigen persoonlijk en stellen één voorbereidende vraag indien nodig.",
                },
                {
                  title: "30 minuten online",
                  body: "Jij: doelen, situatie, vragen. Wij: duiden, prioriteit, scenario’s.",
                },
                {
                  title: "Vervolgadvies",
                  body: "Vrijblijvend memo: wat we zouden doen, en in welke volgorde.",
                },
              ]}
              links={[
                {
                  label: "Werkwijze",
                  href: "/werkwijze",
                  description: "Begrijpen → ontwerpen → bouwen → overdragen.",
                  icon: <Compass className="size-4" />,
                },
                {
                  label: "Groeiscan playground",
                  href: siteCtas.groeiscan.href,
                  description: "Eerst zelf spelen met context.",
                  icon: <Sparkles className="size-4" />,
                },
                {
                  label: "Liever mailen?",
                  href: "/contact",
                  description: "Vrijblijvend via het contactformulier.",
                  icon: <MessageSquare className="size-4" />,
                },
              ]}
              responseLabel="meestal binnen 1 werkdag"
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
