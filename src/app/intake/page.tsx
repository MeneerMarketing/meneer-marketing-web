import type { Metadata } from "next";
import {
  Compass,
  MessageSquare,
} from "lucide-react";
import { ConversionAside } from "@/components/contact/ConversionAside";
import { ConversionForm } from "@/components/contact/ConversionForm";
import { IntakeHero } from "@/components/contact/IntakeHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { BRAND_DISPLAY } from "@/lib/seo/e-e-a-t";
import { absoluteUrl } from "@/lib/site";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/seo/robots-policy";

export const metadata: Metadata = {
  title: "Start intake",
  description:
    "Vul in twee minuten de intake in. Dan weet ik genoeg om het eerste gesprek scherp te starten.",
  alternates: { canonical: absoluteUrl("/intake") },
  robots: NOINDEX_FOLLOW_ROBOTS,
  openGraph: {
    title: `Start intake | ${BRAND_DISPLAY}`,
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
        <IntakeHero />

        <section
          className="relative border-t border-mm-border/60 bg-mm-bg py-12 sm:py-16"
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
