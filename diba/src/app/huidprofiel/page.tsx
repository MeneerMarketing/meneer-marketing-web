import type { Metadata } from "next";
import Link from "next/link";
import BeeldVignet from "@/components/ui/BeeldVignet";
import ProfielBouwer from "@/components/huidprofiel/ProfielBouwer";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import { PROFIEL_ONDERDELEN, telwoord } from "@/data/huidprofiel";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";

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
 */

export const metadata: Metadata = {
  title: "Je huidprofiel",
  description:
    `Bouw je huidprofiel op in ${telwoord(PROFIEL_ONDERDELEN)} stappen. Wat past, wat niet past en wat je in de intake moet melden. Blijft in je eigen browser.`,
};

export default function HuidprofielPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Je huidprofiel", url: `${DIBA_SITE_URL}/huidprofiel` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-24 h-[460px] w-[460px] rounded-full bg-[var(--g-050)]"
        />
        <DibaLeafMark
          aria-hidden="true"
          className="pointer-events-none absolute top-14 right-20 hidden h-[180px] w-[180px] rotate-12 text-[var(--g-200)] lg:block"
        />

        <div className="relative mx-auto px-5 pt-12 pb-14 sm:px-9 lg:px-[7.5vw] lg:pt-16">
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
          <h1 className="diba-display-l mt-8 max-w-[17ch]">
            Je huid,
            <br />
            <span className="diba-accent">
              in {telwoord(PROFIEL_ONDERDELEN)} stappen.
            </span>
          </h1>

          <p className="mt-7 max-w-[56ch] text-[17px] leading-8 text-[var(--t-body)]">
            De meeste vragen hieronder gaan niet over wat je wil, maar over wat
            er kán. Retinol, zwangerschap, een gebruinde huid, medicatie. Dat
            komt in een kliniek meestal pas aan de balie boven tafel, en dan
            gaat de afspraak niet door.
          </p>
          <p className="mt-4 max-w-[56ch] text-[17px] leading-8 text-[var(--t-body)]">
            Hier weet je het vooraf. En je profiel loopt mee: op de
            behandelingenpagina staat daarna bovenaan wat bij je past, en bij de
            rest waarom niet.
          </p>
        </div>
      </section>

      {/* ── De stappen ── */}
      {/* Een profiel invullen is abstract tot je ziet waar het terechtkomt: bij iemand
          die het erbij pakt voordat je binnenkomt. */}
      <section className="px-5 pb-14 sm:px-9 lg:px-[7.5vw] lg:pb-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/behandelaar-met-tablet.jpg"
            alt="Behandelaar loopt door de kliniek met een tablet"
            onderschrift="Wat jij invult, zien wij bij de intake"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/10] lg:aspect-[2/1]"
          />
        </div>
      </section>

      <section className="bg-[var(--g-025)] px-5 py-14 sm:px-9 lg:px-[7.5vw] lg:py-16">
        <div className="mx-auto">
          <ProfielBouwer />
        </div>
      </section>
    </main>
  );
}
