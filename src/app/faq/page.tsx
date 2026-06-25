import type { Metadata } from "next";
import { DienstFAQ } from "@/components/diensten/DienstFAQ";
import { Reveal } from "@/components/effects/Reveal";
import { JsonLdScript, breadcrumbJsonLd, faqPageJsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description:
    "Antwoorden over samenwerking, maatwerk, platforms en werkwijze bij MeneerMarketing.",
  alternates: { canonical: absoluteUrl("/faq") },
  openGraph: {
    title: "FAQ | MeneerMarketing",
    description:
      "Praktische antwoorden. In een gesprek maken we het concreet voor jouw situatie.",
    url: absoluteUrl("/faq"),
    locale: "nl_NL",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "Werken jullie met vaste pakketten?",
    answer:
      "Nee. Elk bedrijf heeft andere marges, salescyclus en stack. We starten met context (doelen, markt, systemen) en stellen daarna een voorstel op met de juiste volgorde en scope. Geen standaard ‘goud/zilver/brons’.",
  },
  {
    question: "Kan ik alleen één onderdeel afnemen, bijvoorbeeld alleen SEO?",
    answer:
      "Ja, als dat op dat moment de slimste hefboom is. Soms adviseren we eerst techniek of conversie, omdat SEO of ads dan pas echt gaat renderen. Je krijgt altijd uitleg waarom.",
  },
  {
    question: "Met welke platforms werken jullie?",
    answer:
      "We bouwen maatwerk websites from scratch, Shopify-thema's op maat, web-apps met Next.js, en automatisering met o.a. n8n en Make. Het platform kiezen we op basis van jouw situatie — niet op basis van wat we ‘altijd’ doen.",
  },
  {
    question: "Hoe snel kan ik live?",
    answer:
      "Dat hangt af van scope en beschikbaarheid van content en assets. Een strakke landingspagina kan snel; een enterprise shop of maatwerk-app vraagt meer tijd. In het voorstel staan realistische mijlpalen.",
  },
  {
    question: "Werken jullie remote of op locatie?",
    answer:
      "Voornamelijk remote, met overleg waar het helpt. Voor workshops of alignment kan op locatie of hybride. In overleg.",
  },
  {
    question: "Wat kost een traject?",
    answer:
      "Pas na helderheid over scope en prioriteit sturen we een offerte. Wil je eerst richting zonder groot commitment? Start met de Groeiscan of een korte intake. Dan weet je snel of de match klopt.",
  },
] as const;

export default function FaqPage() {
  const faqLd = faqPageJsonLd([...FAQ_ITEMS]);

  return (
    <>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <JsonLdScript data={faqLd} />
      <SiteHeader />
      <main id="main" className="flex-1">
        <header className="border-b border-mm-border bg-mm-sky-subtle/50">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-mm-sky-deep">
                FAQ
              </p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-mm-text sm:text-5xl">
                Veelgestelde vragen
              </h1>
              <p className="mt-5 text-lg text-mm-muted">
                Korte antwoorden op veel voorkomende vragen. Staat jouw vraag er
                niet tussen?{" "}
                <a
                  href="/contact"
                  className="font-semibold text-mm-sky-deep underline-offset-2 hover:underline"
                >
                  Mail ons
                </a>{" "}. Dan duiken we er persoonlijk in.
              </p>
            </Reveal>
          </div>
        </header>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <DienstFAQ items={[...FAQ_ITEMS]} idPrefix="site-faq" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
