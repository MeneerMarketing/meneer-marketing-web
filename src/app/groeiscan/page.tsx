import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Compass,
  Gauge,
  Rocket,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import { ConversionAside } from "@/components/contact/ConversionAside";
import { ConversionForm } from "@/components/contact/ConversionForm";
import { ConversionHero } from "@/components/contact/ConversionHero";
import { Reveal } from "@/components/effects/Reveal";
import { GroeiscanInteractive } from "@/components/home/GroeiscanInteractive";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Groeiscan. Interactieve playground",
  description:
    "Stel je groeidoel, ambitie, digitale volwassenheid, frictie en marketingkanalen in. Zie live een speelse groei-index en wat dat voor jouw traject kan betekenen.",
  alternates: { canonical: absoluteUrl("/groeiscan") },
  openGraph: {
    title: "Groeiscan. MeneerMarketing",
    description:
      "Interactieve playground: stel je groeiprofiel in en zie live een index.",
    url: absoluteUrl("/groeiscan"),
    locale: "nl_NL",
    type: "website",
  },
};

const STEPS = [
  {
    n: "01",
    title: "Kies je hoofddoel",
    body: "Eén richting voor de komende 12 maanden. Scherp zit fijner dan breed.",
  },
  {
    n: "02",
    title: "Zet de schuivers",
    body: "Ambitie, digitale volwassenheid, tijdverspilling, kanalen. Alles leeft live.",
  },
  {
    n: "03",
    title: "Lees het inzicht",
    body: "Geen rapport in PDF-taal: één paragraaf waar je wat aan hebt.",
  },
] as const;

export default function GroeiscanPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <ConversionHero
          tone="sky"
          eyebrow="Interactieve Groeiscan"
          title={
            <>
              Speel met je profiel. {" "}
              <span className="bg-gradient-to-r from-mm-sky-deep via-mm-sky to-mm-accent bg-clip-text text-transparent">
                zie de index meebewegen
              </span>
              .
            </>
          }
          intro={
            <>
              Geen offerte, geen diagnose. Een{" "}
              <span className="font-semibold text-mm-text">speels rekenmodel</span>{" "}
              om strategie voelbaar te maken vóór we elkaar spreken.
            </>
          }
          anchorId="groeiscan-playground"
          primaryCtaLabel="Naar de playground"
          secondary={
            <Link
              href="#groeiscan-aanvraag"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-mm-text/10 bg-white px-6 py-3.5 text-sm font-bold text-mm-text transition hover:border-mm-sky/40"
            >
              Direct vervolg plannen
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          }
          badges={[
            { icon: <Sparkles className="size-3.5" />, label: "Live rekenmodel" },
            { icon: <Gauge className="size-3.5" />, label: "Vijf dimensies" },
            { icon: <Wand2 className="size-3.5" />, label: "Speels, niet frivool" },
          ]}
          stats={[
            { value: "5", label: "Dimensies" },
            { value: "< 2 min", label: "Om te spelen" },
            { value: "0 €", label: "Verplichting" },
          ]}
        />

        <section className="relative border-t border-mm-border/60 bg-mm-bg py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <ol className="grid gap-4 sm:grid-cols-3">
                {STEPS.map((s) => (
                  <li
                    key={s.n}
                    className="group relative overflow-hidden rounded-2xl border border-mm-border bg-white p-5 shadow-mm-card"
                  >
                    <p className="text-[11px] font-black tracking-widest text-mm-sky-deep">
                      {s.n}
                    </p>
                    <h3 className="mt-2 text-base font-extrabold text-mm-text">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-mm-muted">
                      {s.body}
                    </p>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-mm-sky-subtle opacity-0 blur-2xl transition duration-500 group-hover:opacity-100"
                    />
                  </li>
                ))}
              </ol>
            </Reveal>

            <div id="groeiscan-playground" className="mt-14 scroll-mt-24">
              <Reveal>
                <GroeiscanInteractive />
              </Reveal>
              <p className="mt-10 text-center text-sm text-mm-muted">
                Liever meteen contact?{" "}
                <Link
                  href="/"
                  className="font-bold text-mm-sky-deep underline-offset-4 hover:underline"
                >
                  Terug naar home
                </Link>
                {" · "}
                <Link
                  href="/over"
                  className="font-bold text-mm-sky-deep underline-offset-4 hover:underline"
                >
                  Over ons
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section
          id="groeiscan-aanvraag"
          className="relative border-t border-mm-border/60 bg-mm-sky-subtle/40 py-16 scroll-mt-24 sm:py-24"
          aria-labelledby="groeiscan-form-heading"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mb-10 max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-mm-sky-deep">
                  Vervolg
                </p>
                <h2
                  id="groeiscan-form-heading"
                  className="mt-3 text-3xl font-extrabold tracking-tight text-mm-text sm:text-4xl"
                >
                  Klaar voor de{" "}
                  <span className="bg-gradient-to-r from-mm-sky-deep via-mm-sky to-mm-accent bg-clip-text text-transparent">
                    echte Groeiscan
                  </span>
                  ?
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-mm-muted">
                  Playground was jouw warming-up. Tijd om jouw situatie scherp
                  tegen het licht te houden. Met data, context en een plan.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
              <ConversionForm variant="groeiscan" idPrefix="groeiscan-lead" />
              <ConversionAside
                processTitle="Na de aanvraag"
                quickMailSubject="Groeiscan follow-up"
                steps={[
                  {
                    title: "Korte terugkoppeling",
                    body: "We stellen 1–2 voorbereidende vragen via mail.",
                  },
                  {
                    title: "Groeiscan-sessie",
                    body: "Online, 45 min. Samen prioriteit bepalen.",
                  },
                  {
                    title: "Memo & vervolgvoorstel",
                    body: "Kort document met de volgorde die klopt voor jou.",
                  },
                ]}
                links={[
                  {
                    label: "Over onze werkwijze",
                    href: "/werkwijze",
                    description: "Begrijpen → ontwerpen → bouwen → overdragen.",
                    icon: <Compass className="size-4" />,
                  },
                  {
                    label: "Start een intake",
                    href: "/intake",
                    description: "Liever meteen gesprek? Kan ook.",
                    icon: <Target className="size-4" />,
                  },
                  {
                    label: "Een project starten",
                    href: "/project-starten",
                    description: "Weet je al wat er moet gebeuren?",
                    icon: <Rocket className="size-4" />,
                  },
                ]}
                trustLabel="De Groeiscan is onze scope. Je krijgt bruikbare inzichten, geen generieke audit."
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
