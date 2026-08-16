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
 * De kop gaat over huid en niet over deze website. Een eerdere versie opende met
 * "zeventien pagina's, vijf gaan niet over ons": waar voor de bouwer, nutteloos voor
 * iemand die met een probleem binnenkomt.
 *
 * Wat er nu staat is het idee achter de hele reeks: elke aandoening heeft een andere
 * eerste vraag, en met de verkeerde vraag beginnen kost maanden. Dat is klinisch, het is
 * waar, en het verklaart in één zin waarom deze zeventien pagina's niet op elkaar lijken.
 *
 * De groepen zitten nu in het raster, in klinische taal in plaats van als paginatelling.
 *
 * Twee donkergroene vlakken, niet meer (§5): de zoeker bovenaan en de intake onderaan.
 */

export const metadata: Metadata = {
  title: "Huidproblemen: elk probleem zijn eigen eerste vraag",
  description:
    "Bij acne telt waar het zit, bij pigment welk seizoen het is, bij littekens hoe oud ze zijn. Kies waar je last van hebt en zie waar we mee beginnen.",
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
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
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
              Elk huidprobleem heeft
              <br />
              <span className="diba-accent">een eigen eerste vraag.</span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Bij acne telt wáár het zit, want de plek zegt iets over de
              oorzaak. Bij pigment telt welk seizoen het is. Bij littekens telt
              hoe oud ze zijn, en bij melasma hoe diep het pigment ligt.
            </p>

            <p className="mt-4 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Dat klinkt als een detail en het bepaalt de uitkomst. Wie met de
              verkeerde vraag begint, behandelt maanden het verkeerde en denkt
              daarna dat het niet werkt.
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

      {/* ── Het filterbare raster ──
          Wit vlak, mintkaarten. Stond de sectie ook op mint, dan liepen kaart en
          ondergrond in elkaar over en las het als losse tekst in plaats van als kaarten. */}
      <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto">
          <Raster />
        </div>
      </section>

      {/* ── Wat elke pagina gemeen heeft ── */}
      <section className="px-5 pb-20 sm:px-9 lg:px-[7.5vw]">
        <div className="mx-auto rounded-[var(--r-md)] bg-[var(--g-050)] p-7 sm:p-10">
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
              <li key={kop} className="rounded-[var(--r-sm)] bg-white p-5">
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
        <div className="mx-auto lg:grid lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
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
