import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Brain,
  Compass,
  MessageSquare,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { ConversionAside } from "@/components/contact/ConversionAside";
import { ConversionForm } from "@/components/contact/ConversionForm";
import { ConversionHero } from "@/components/contact/ConversionHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { absoluteUrl } from "@/lib/site";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo/robots-policy";

export const metadata: Metadata = {
  title: "Start intake",
  description:
    "Vul in twee minuten de intake in. Dan weet ik genoeg om het eerste gesprek scherp te starten.",
  alternates: { canonical: absoluteUrl("/intake") },
  robots: NOINDEX_FOLLOW_ROBOTS,
  openGraph: {
    title: "Start intake | MeneerMarketing",
    description:
      "Kort formulier, helder gesprek. Web, marketing, automatisering of design.",
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
              Twee minuten invullen.{" "}
              <span className="bg-gradient-to-r from-mm-sky-deep via-mm-sky to-mm-accent bg-clip-text text-transparent">
                Eén scherp gesprek
              </span>
              .
            </>
          }
          intro={
            <>
              Geen verkoopcall, geen funnel. Eerst weten waar je staat en wat je
              wilt. Daarna plannen we een gesprek van{" "}
              <span className="font-semibold text-mm-text">30 minuten</span>{" "}
              waarin we samen bepalen wat slim is om eerst aan te pakken.
            </>
          }
          primaryCtaLabel="Naar het formulier"
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
            { icon: <Timer className="size-3.5" />, label: "Formulier ± 2 min" },
            { icon: <Brain className="size-3.5" />, label: "Gesprek 30 min • online" },
            { icon: <ShieldCheck className="size-3.5" />, label: "Vrijblijvend" },
          ]}
          stats={[
            { value: "2 min", label: "Formulier" },
            { value: "30 min", label: "Gesprek" },
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
                  title: "Formulier (± 2 min)",
                  body: "Waar je staat, wat je doel is, contactgegevens. Geen roman nodig.",
                },
                {
                  title: "30 minuten online",
                  body: "Jij: situatie en vragen. Ik: prioriteit, route en eerlijke next steps.",
                },
                {
                  title: "Vervolgadvies",
                  body: "Vrijblijvend memo: wat ik zou doen, en in welke volgorde.",
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
