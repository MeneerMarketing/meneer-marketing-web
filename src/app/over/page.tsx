import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Cpu, Heart, Target } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { SpotlightCard } from "@/components/home/SpotlightCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { siteCtas } from "@/lib/cta";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Over MeneerMarketing. Systeem achter groei",
  description:
    "Wie we zijn, hoe we werken en waarom we geloven dat groei een combinatie is van techniek, marketing en menselijke helderheid.",
  alternates: { canonical: absoluteUrl("/over") },
  openGraph: {
    title: "Over MeneerMarketing",
    description:
      "Strategisch partner voor web, marketing en automatisering. Met oog voor schaal en sanity.",
    url: absoluteUrl("/over"),
    locale: "nl_NL",
    type: "website",
  },
};

const principles = [
  {
    title: "Meetbaar",
    body: "Als het niet meetbaar is, optimaliseren we op meningen. KPI’s, events en heldere dashboards horen bij elk traject.",
    icon: Target,
  },
  {
    title: "Technisch sterk",
    body: "Shopify, maatwerk websites, Next.js, n8n. We bouwen en koppelen alsof het productie is. Want dat ís het.",
    icon: Cpu,
  },
  {
    title: "Menselijk",
    body: "Geen gatekeeping: documentatie, overdracht en taal die je team begrijpt. Succes delen we, complexiteit niet.",
    icon: Heart,
  },
] as const;

export default function OverPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <header className="border-b border-mm-border bg-mm-bg">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-mm-sky-deep">
                Over ons
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-mm-text sm:text-5xl">
                Groei is geen toeval. {" "}
                <span className="text-mm-sky-deep">het is een systeem.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-mm-muted">
                MeneerMarketing is de technische en strategische partner voor
                ondernemers die niet alleen een “site” willen, maar een stack die
                marketing, sales en operations met elkaar verbindt.
              </p>
            </Reveal>
          </div>
        </header>

        <section className="border-b border-mm-border bg-mm-surface-elevated">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
              <Reveal>
                <h2 className="text-2xl font-extrabold text-mm-text sm:text-3xl">
                  Wat je van ons mag verwachten
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-mm-muted">
                  We combineren strategie met uitvoering: geen eindeloze
                  powerpoints zonder build, en geen code zonder context. Jij
                  krijgt heldere keuzes, realistische planning en transparantie over
                  risico’s en trade-offs.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-mm-muted">
                  Of het nu gaat om een internationale Shopify, een maatwerk website
                  from scratch, een web-app of n8n-workflows die je team rust
                  geven. We denken in pijlers: bouwen, groeien, automatiseren,
                  vormgeven.
                </p>
              </Reveal>
              <Reveal className="mt-10 lg:mt-0" delay={0.08}>
                <div className="rounded-3xl border border-mm-border bg-mm-sky-subtle/50 p-8 shadow-mm-card">
                  <p className="text-sm font-bold uppercase tracking-wider text-mm-accent">
                    Werkwijze
                  </p>
                  <ol className="mt-6 space-y-4 text-mm-text">
                    <li>
                      <strong className="text-mm-text">Begrijpen</strong>. Intake, data, doelen, stack.
                    </li>
                    <li>
                      <strong className="text-mm-text">Ontwerpen</strong>. Architectuur, roadmap, quick wins vs. fundament.
                    </li>
                    <li>
                      <strong className="text-mm-text">Bouwen & sturen</strong>. Iteraties, meten, bijschaven.
                    </li>
                    <li>
                      <strong className="text-mm-text">Overdragen</strong>. Documentatie, training, doorontwikkeling.
                    </li>
                  </ol>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-mm-bg">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <h2 className="text-center text-2xl font-extrabold text-mm-text sm:text-3xl">
                Drie principes waar we niet over onderhandelen
              </h2>
            </Reveal>
            <ul className="mt-12 grid list-none gap-6 p-0 md:grid-cols-3">
              {principles.map((p, i) => {
                const Icon = p.icon;
                return (
                  <SpotlightCard key={p.title} revealDelay={0.06 * i}>
                    <div className="flex gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-mm-sky-subtle text-mm-sky-deep">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-mm-text">
                          {p.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-mm-muted">
                          {p.body}
                        </p>
                      </div>
                    </div>
                  </SpotlightCard>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="border-t border-mm-border bg-mm-accent-subtle">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <h2 className="text-2xl font-extrabold text-mm-text sm:text-3xl">
                Laten we kennismaken
              </h2>
              <p className="mt-4 text-lg text-mm-muted">
                Geen verplichtingen. Wel een scherpe eerste sessie. Kies Groeiscan
                voor context en prioriteit, of intake als je al weet wat er moet
                gebeuren.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href={siteCtas.groeiscan.href}
                  className="inline-flex items-center gap-2 rounded-full bg-mm-accent px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-mm-accent-hover"
                >
                  {siteCtas.groeiscan.label}
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
                <Link
                  href="/diensten"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-mm-border bg-white px-6 py-3.5 text-sm font-bold text-mm-text hover:border-mm-sky/40"
                >
                  Bekijk diensten
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
