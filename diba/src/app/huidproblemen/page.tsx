import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import Raster from "@/components/huidproblemen/Raster";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Het overzicht van alle huidproblemen.
 *
 * De indeling ís het punt van deze pagina. Elke andere kliniek zet zijn onderwerpen op
 * alfabet of op populariteit, want alles is toch te koop. Hier staan ze gegroepeerd naar
 * wat wíj ermee doen, en dan wordt meteen zichtbaar dat vier van de zestien onderwerpen
 * naar de huisarts gaan en één nergens heen.
 *
 * Dat is geen eerlijkheid in de kleine lettertjes onderaan maar de structuur zelf.
 *
 * Herbouwd in de huisstijl van de zeventien onderliggende pagina's; hij draaide nog op
 * het oude sjabloon met FigmaHeading en de figma-inner-layout-klassen, en week daarmee
 * zichtbaar af van alles waar hij naar linkt.
 *
 * Twee donkergroene vlakken, niet meer (§5): de zoeker bovenaan en de intake onderaan.
 */

export const metadata: Metadata = {
  title: "Huidproblemen: wat we behandelen en wat niet",
  description:
    "Zestien huidproblemen, ingedeeld naar wat wij ermee doen. Vier gaan naar de huisarts en bij één doen we niets.",
};

export default function HuidproblemenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
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
              <span className="text-[var(--t-muted)]">Huidproblemen</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              Zeventien pagina&apos;s.
              <br />
              <span className="diba-accent">Vijf gaan niet over ons.</span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              De meeste kliniekwebsites zetten hun onderwerpen op alfabet, want
              alles is toch te koop. Hier staan ze op volgorde van wat wij ermee
              doen, en dan valt meteen op dat een deel bij een arts hoort en één
              onderwerp nergens.
            </p>

            <p className="mt-4 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Elke pagina begint bij de vraag die er bij dat probleem het meest
              toe doet. Bij littekens is dat hoe oud het is, bij pigment welk
              seizoen het is, en bij poriën dat kleiner maken niet kan.
            </p>
          </div>

          {/* De zoeker als eerste uitweg, voor wie de naam niet kent. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-10">
            <Label opDonker>Geen idee waar je moet zijn</Label>
            <p className="diba-card-title-lg mt-5">
              Je hoeft niet te weten hoe het heet. Kruis aan wat je ziet, dan
              zoeken wij de pagina erbij.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              <Button
                href="/huidproblemen/symptoomzoeker"
                variant="primair-op-donker"
              >
                Naar de symptoomzoeker
              </Button>
              <Button
                href={DIBA_WHATSAPP_URL}
                variant="secundair-op-donker"
                target="_blank"
                rel="noopener noreferrer"
              >
                Of stel je vraag
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      {/* ── Het filterbare raster ── */}
      <section className="bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <Raster />
        </div>
      </section>

      {/* ── Wat elke pagina gemeen heeft ── */}
      <section className="px-5 pb-20 sm:px-9 lg:px-[7.5vw]">
        <div className="mx-auto max-w-[1800px] rounded-[var(--r-md)] bg-[var(--g-050)] p-7 sm:p-10">
          <Label>Wat op elke pagina terugkomt</Label>
          <h2 className="diba-display-s mt-5 max-w-[20ch]">
            Dezelfde vier vragen,
            <br />
            <span className="diba-accent">elke keer.</span>
          </h2>
          <ul className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "Wat is het eigenlijk",
                "Uitgelegd zoals we het in de behandelkamer zouden zeggen, met de vakterm ernaast en niet ervoor.",
              ],
              [
                "Wat werkt en wat niet",
                "Twee kolommen naast elkaar. De rechterkolom staat er even groot bij als de linker.",
              ],
              [
                "Waar wij nee zeggen",
                "Elke pagina heeft er een. Soms omdat het te weinig oplevert, soms omdat het niet aan ons is.",
              ],
              [
                "Hoe we het meten",
                "Zonder beginpunt is een verschil later iets dat je moet geloven. Daarom leggen we vast waar we starten.",
              ],
            ].map(([kop, tekst]) => (
              <li key={kop} className="border-t border-[var(--g-200)] pt-5">
                <h3 className="diba-card-title">{kop}</h3>
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {tekst}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Slot ── */}
      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto max-w-[1800px] lg:grid lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
          <div>
            <Label opDonker>Behandeling nul</Label>
            <h2 className="diba-display-l mt-5 max-w-[16ch]">
              Alles begint
              <br />
              <span className="diba-accent-on-dark">bij meten.</span>
            </h2>
          </div>
          <div className="mt-8 flex flex-col justify-end lg:mt-0">
            <p className="max-w-sm text-[16px] leading-7 text-[var(--on-dark-body)]">
              Welke pagina je ook las, het begint hetzelfde: kijken wat er is
              voordat er iets gebeurt. Soms is de uitkomst dat we je niets
              verkopen, en dat hoort erbij.
            </p>
            <div className="mt-7">
              <Button href="/intake" variant="primair-op-donker">
                Plan de nulmeting
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
