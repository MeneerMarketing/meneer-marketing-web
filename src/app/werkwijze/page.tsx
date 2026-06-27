import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  GitBranch,
  Lightbulb,
  LineChart,
  Rocket,
  Search,
} from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { siteCtas } from "@/lib/cta";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Werkwijze",
  description:
    "Van eerste gesprek tot oplevering: hoe MeneerMarketing per klant een passende strategie en uitvoering kiest. Transparant en zonder standaardpakketten.",
  alternates: { canonical: absoluteUrl("/werkwijze") },
  openGraph: {
    title: "Werkwijze | MeneerMarketing",
    description:
      "Context eerst, daarna de juiste mix van web, marketing en automatisering.",
    url: absoluteUrl("/werkwijze"),
    locale: "nl_NL",
    type: "website",
  },
};

const phases = [
  {
    title: "Verkennen",
    body: "We brengen jouw markt, aanbod, concurrentie en huidige stack in kaart. Geen pitch-deck. Wel scherpe vragen: waar zit marge, waar lekt tijd, wat wil je over 6–12 maanden anders zien?",
    icon: Search,
  },
  {
    title: "Route kiezen",
    body: "Op basis van die context stel ik een voorstel op: niet ‘alles tegelijk’, maar de volgorde die het meeste oplevert. Soms is dat techniek eerst; andere keren traffic of conversie. Jouw niche bepaalt de mix.",
    icon: GitBranch,
  },
  {
    title: "Bouwen & meten",
    body: "We werken in duidelijke stukken met meetpunten: events, dashboards of gewoon heldere KPI’s in je ads-account. Zo weet je wat werkt voordat we opschalen.",
    icon: Rocket,
  },
  {
    title: "Optimaliseren",
    body: "Live betekent leren. We sturen bij op data én op wat je team merkt in de praktijk. Geen black box: je ziet waarom we iets aanpassen.",
    icon: LineChart,
  },
] as const;

export default function WerkwijzePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <header className="border-b border-mm-border bg-mm-bg">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-mm-sky-deep">
                Werkwijze
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-mm-text sm:text-5xl">
                Geen copy-paste traject. {" "}
                <span className="text-mm-sky-deep">wél een herhaalbaar proces.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-mm-muted">
                Het eindresultaat verschilt per klant: een lokale dienstverlener
                heeft andere hefbomen dan een D2C-brand of een B2B-scale-up. Het
                proces daarachter is wél strak. Zodat je weet waar je aan toe
                bent.
              </p>
            </Reveal>
          </div>
        </header>

        <section
          className="border-b border-mm-border bg-mm-sky-subtle/40 py-16"
          aria-labelledby="phases-heading"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2
                id="phases-heading"
                className="text-2xl font-extrabold text-mm-text sm:text-3xl"
              >
                Fases die je herkent
              </h2>
              <p className="mt-3 max-w-2xl text-mm-muted">
                De inhoud van elke fase wordt per opdracht ingevuld. De kwaliteit
                van de beslissingen hangt af van hoe goed we jouw context
                begrijpen. Daarom start alles met luisteren.
              </p>
            </Reveal>
            <ol className="mt-12 grid gap-6 md:grid-cols-2">
              {phases.map((p, i) => {
                const Icon = p.icon;
                return (
                  <Reveal key={p.title} delay={0.05 * i}>
                    <li className="flex h-full flex-col rounded-3xl border border-mm-border bg-white p-6 shadow-sm sm:p-8">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-mm-sky-subtle text-mm-sky-deep">
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-mm-text">
                        {p.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-mm-muted">
                        {p.body}
                      </p>
                    </li>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="py-16" aria-labelledby="allrounder-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-mm-border bg-gradient-to-br from-mm-accent-subtle/60 to-mm-sky-subtle/50 p-8 sm:p-10 lg:grid lg:grid-cols-[1fr_280px] lg:items-center lg:gap-10">
              <Reveal>
                <div className="flex items-center gap-3 text-mm-accent">
                  <Lightbulb className="size-8" aria-hidden />
                  <p className="text-xs font-bold uppercase tracking-wider text-mm-text">
                    Allrounder met focus
                  </p>
                </div>
                <h2
                  id="allrounder-heading"
                  className="mt-4 text-2xl font-extrabold text-mm-text sm:text-3xl"
                >
                  Één partner die de lijn houdt. Van strategie tot pixels en
                  API’s.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-mm-muted">
                  Je hoeft niet zelf het gesprek tussen designer, developer en
                  marketeer te faciliteren. Ik vertaal doelen naar techniek,
                  campagnes en automatisering, en zie waar die domeinen elkaar
                  helpen of juist tegenwerken. Zo krijgt elk bedrijf een{" "}
                  <strong className="text-mm-text">eigen strategische mix</strong>
                  , in plaats van hetzelfde pakket als de vorige klant.
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="mt-8 flex flex-col gap-3 lg:mt-0">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-mm-accent px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-mm-accent-hover"
                  >
                    Plan een kennismaking
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                  <Link
                    href={siteCtas.groeiscan.href}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-mm-border bg-white px-6 py-3.5 text-sm font-bold text-mm-text hover:bg-mm-surface"
                  >
                    {siteCtas.groeiscan.label}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
