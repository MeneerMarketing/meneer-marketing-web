import type { Metadata } from "next";
import Link from "next/link";
import BeeldVignet from "@/components/ui/BeeldVignet";
import ProfielBouwer from "@/components/huidprofiel/ProfielBouwer";
import Reviewregel from "@/components/reviews/Reviewregel";
import { PROFIEL_ONDERDELEN, telwoord } from "@/data/huidprofiel";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";
import LeesVerder from "@/components/ui/LeesVerder";

/**
 * /huidprofiel — je huid in negen stappen.
 *
 * Waarom dit een eigen pagina is: wat hier gevraagd wordt zijn geen voorkeuren maar feiten
 * die bepalen wat er kán. Retinol, zwangerschap, een gebruinde huid, isotretinoïne,
 * neiging tot keloïd. Dat zijn precies de dingen die in de praktijk pas aan de balie boven
 * tafel komen, met een afspraak die dan niet doorgaat.
 *
 * Het profiel loopt daarna mee over de hele site: het uitklapje rechtsonder toont het, en
 * de behandelingenpagina zet bovenaan wat bij je past en zegt bij de rest waarom niet.
 *
 * Eén donkergroen vlak op deze pagina: het meldblok in de uitkomst (§5).
 *
 * De hero was drie blokken hoog: tekst, dan een foto over de volle breedte, dan pas de
 * eerste vraag. Dat is anderhalf scherm voor je bij het enige bent waarvoor je kwam.
 * Het is nu één blok van twee kolommen, met de foto ernaast in plaats van eronder.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidprofiel",
  titel: "Je huidprofiel",
  omschrijving: `Bouw je huidprofiel op in ${telwoord(PROFIEL_ONDERDELEN)} stappen. Wat past, wat niet past en wat je tijdens de intake moet melden. Blijft in je eigen browser.`,
});

export default function HuidprofielPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Je huidprofiel", url: `${DIBA_SITE_URL}/huidprofiel` },
        ])}
      />

      {/* ── Hero ──
          Twee kolommen in plaats van drie blokken onder elkaar. De foto stond hieronder
          over de volle breedte op 2:1; die kostte een half scherm en zei hetzelfde als de
          tekst ernaast. Nu staat hij náást de tekst, staand, in het formaat waar een
          rechterkolom om vraagt. */}
      <section className="mx-auto px-5 pt-10 pb-12 sm:px-9 lg:px-[7.5vw] lg:pt-12 lg:pb-16">
        <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Je huidprofiel</span>
            </nav>

            {/* Het aantal komt uit PROFIEL_ONDERDELEN en staat hier niet als woord:
                er kwam een negende vraag bij en de kop bleef "in acht stappen" staan. */}
            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              Stel je huidprofiel
              <br />
              <span className="diba-accent">samen</span>
            </h1>

            <p className="mt-6 max-w-[50ch] text-[17px] leading-8 text-[var(--t-body)]">
              {telwoord(PROFIEL_ONDERDELEN).replace(/^./, (c) =>
                c.toUpperCase(),
              )}{" "}
              vragen, twee minuten. Dit weet je daarna:
            </p>

            {/* Wat je eruit krijgt, in drie regels die elk één ding noemen.

                Er stond "wat je huid nu aankan" en "welke behandelingen bovenaan komen te
                staan, en bij de rest waarom niet". Yasin, 9 september 2026: "te zweverig
                en onduidelijk, het moet kort maar krachtig". Een regel die om iets
                abstracts draait (aankunnen, bovenaan komen) leest als een belofte zonder
                voorwerp; deze drie noemen het voorwerp: behandelingen, nu of later, de
                intake. Geen "met tarief", want het profiel toont geen bedragen; die staan
                op de tarievenpagina, met dit profiel ernaast. */}
            <ul className="mt-5 space-y-3">
              {[
                "Welke behandelingen bij jouw huid passen",
                "Wat nu kan en wat beter nog even wacht",
                "Wat je bij de intake moet melden",
              ].map((regel) => (
                <li key={regel} className="flex gap-3">
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    className="mt-1 shrink-0"
                    fill="none"
                    stroke="var(--g-700)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3.5 9.5 7 13l7.5-8" />
                  </svg>
                  <span className="text-[16px] leading-7 text-[var(--t-body)]">
                    {regel}
                  </span>
                </li>
              ))}
            </ul>

            {/* Waarom je dit vooraf doet, in één zin met drie voorbeelden. Kort genoeg om
                ook op een telefoon te blijven staan. */}
            <p className="mt-6 max-w-[50ch] text-[17px] leading-8 text-[var(--t-body)]">
              Retinol, zwangerschap, een gebruinde huid: je ziet het hier
              meteen, niet pas aan de balie.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 max-sm:grid max-sm:grid-cols-2">
              <Link
                href="#profiel"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] max-sm:justify-center max-sm:px-3 transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                <span className="sm:hidden">Begin</span>
                <span className="max-sm:hidden">Begin bij de eerste vraag</span>
              </Link>
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-[var(--g-200)] px-6 max-sm:justify-center max-sm:px-3 text-[var(--t-strong)] transition-colors hover:border-[var(--g-700)] hover:bg-[var(--g-025)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                <span className="sm:hidden">Hoe het werkt</span>
                <span className="max-sm:hidden">Zo werkt het huidconsult</span>
              </Link>
            </div>

            <p className="diba-label mt-6 text-[var(--t-muted)]">
              Blijft in je eigen browser &middot; Geen account
            </p>

            <Reviewregel className="mt-6 max-w-[52ch]" keuze={2} />
          </div>

          {/* Staande foto in een staande kolom. Dezelfde behandelaar met dezelfde tablet
              als hiervoor, alleen niet meer over de volle breedte. */}
          <BeeldVignet
            src="/images/shoot/behandelaar-met-tablet.jpg"
            alt="Behandelaar bekijkt de uitkomst van een huidprofiel op een tablet"
            onderschrift="Wat jij invult, zien wij bij de intake"
            sizes="(min-width: 1024px) 44vw, 92vw"
            brandpunt={22}
            className="aspect-[16/9] sm:aspect-[4/5] lg:aspect-[3/4]"
          />
        </div>
      </section>

      <section
        id="profiel"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-10 sm:py-14 sm:px-9 lg:px-[7.5vw] lg:py-16"
      >
        <div className="mx-auto">
          <ProfielBouwer />
        </div>
      </section>
    </main>
  );
}
