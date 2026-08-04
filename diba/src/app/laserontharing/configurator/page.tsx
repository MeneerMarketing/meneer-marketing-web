import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Configurator from "@/components/laser/Configurator";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";

/**
 * De laserconfigurator.
 *
 * Herbouwd. De vorige versie was een lijst met knoppen per gebied en een prijsvak dat
 * "[PRIJS-NODIG]" als bedrag toonde: een vlag uit de broncode, zichtbaar voor iedereen die
 * de pagina opende. Verder stond er "Waar wilt u ontharen" boven, en dat is de u-vorm die
 * §2 verbiedt.
 *
 * Nu een tekening waarop je aanwijst, pakketlogica die uitlegt wat ze doet, en een opbouw
 * die eerlijk zegt dat de tarieven er nog niet zijn. Zie `Configurator.tsx` voor waarom
 * dat laatste zo staat.
 *
 * Twee donkergroene vlakken op deze pagina: het blok over de reeks in de configurator en
 * de afsluiter onderaan. Niet meer (§5).
 */

export const metadata: Metadata = {
  title: "Stel je laserbehandeling samen",
  description:
    "Wijs je zones aan, zie wat er in een pakket zit en wat er los overblijft. Geen bedrag dat je pas aan de balie hoort.",
};

export default function LaserConfiguratorPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Laserontharing", url: `${DIBA_SITE_URL}/laserontharing` },
          {
            name: "Samenstellen",
            url: `${DIBA_SITE_URL}/laserontharing/configurator`,
          },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1800px] px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href="/laserontharing"
                className="hover:text-[var(--g-700)]"
              >
                Laserontharing
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Samenstellen</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              Wijs aan
              <br />
              <span className="diba-accent">wat je wil.</span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              De meeste twijfel over laserontharing gaat niet over of het werkt,
              maar over waar een zone begint en ophoudt en wat je straks aan de
              balie hoort. Daarom wijs je het hier aan in plaats van dat je het
              opzoekt.
            </p>

            <p className="mt-4 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Je zit nergens aan vast. Dit is een berekening en geen boeking.
            </p>
          </div>

          {/* Het voorbehoud staat meteen in beeld en niet in de kleine lettertjes. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] border border-[var(--g-100)] bg-white p-8 sm:p-10">
            <Label>Voordat je begint</Label>
            <p className="diba-card-title mt-4 text-[var(--t-strong)]">
              De tarieven staan er nog niet in
            </p>
            <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
              We zetten liever geen bedrag neer dan een bedrag dat straks anders
              blijkt. Je opbouw klopt al wel: welke zones je kiest, wat een
              pakket vervangt en wat er los overblijft. Zodra de tarieven erin
              staan zie je hier je bedrag.
            </p>
            <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
              Wil je het nu al weten, stel je vraag dan via WhatsApp. Dan krijg
              je antwoord van een mens en niet van een lege tabel.
            </p>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      {/* ── De configurator ── */}
      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto max-w-[1800px]">
          <Suspense
            fallback={
              <p className="text-[15px] leading-7 text-[var(--t-body)]">
                Configurator wordt geladen.
              </p>
            }
          >
            <Configurator />
          </Suspense>
        </div>
      </section>

      {/* ── Afsluiter ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto max-w-[1800px]">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <Label opDonker>Daarna</Label>
            <h2 className="diba-display-m mt-4 max-w-[20ch]">
              Eerst kijken,
              <br />
              <span className="diba-accent-on-dark">dan pas laseren.</span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Wat je hier samenstelt is een plan op papier. In Behandeling Nul
              kijken we of het klopt: je huidtype, je haargroei en of laseren
              bij jou zin heeft. Soms is het antwoord nee, en dan hoor je dat
              voordat je iets betaalt.
            </p>
            <Link
              href="/intake"
              className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Wat er in de intake gebeurt
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
