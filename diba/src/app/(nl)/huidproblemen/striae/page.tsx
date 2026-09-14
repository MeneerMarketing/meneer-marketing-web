import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/ui/Linktaal";
import BehandelingenBijProbleem from "@/components/pillar/BehandelingenBijProbleem";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import { HuidStrakker } from "@/components/ui/HuidIcon";
import Label from "@/components/ui/Label";
import {
  STRIAE_BEOORDELING,
  STRIAE_FAQ,
  STRIAE_SOORTEN,
  STRIAE_WEL_NIET,
} from "@/data/striae";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";
import LeesVerder from "@/components/ui/LeesVerder";
import { t, tc } from "@/lib/vertaal";

/**
 * Striae — sinds vandaag weer een eigen pagina.
 *
 * Hij stond als redirect naar de littekenpagina, met als redenering dat het verhaal
 * hetzelfde is. Dat klopt klinisch, maar iemand met striae na een zwangerschap zoekt op
 * striae en krijgt op een littekenpagina drie kwart tekst die niet over hem gaat.
 *
 * De achtergrond bij de inhoud staat in `src/data/striae.ts`.
 *
 * KAARTEN DIE OP DEZELFDE HOOGTE BREKEN.
 *
 * In de kaarten hieronder stond `min-h-[4lh]`: reserveer vier tekstregels, zodat het blok
 * eronder in elke kaart op dezelfde hoogte begint. Dat is een getal dat iemand ooit heeft
 * geteld, en een geteld getal verloopt. De copy werd korter, de reservering bleef staan, en
 * op 15 september 2026 stonden er in deze twee kaarten vier lege regels. Yasin: "waarom zit
 * hier zoveel witruimte?"
 *
 * Erger nog: het getal kan per taal niet kloppen. Dezelfde zin is in het Engels korter en
 * in het Spaans langer, dus één reservering is per definitie in minstens twee van de drie
 * talen het verkeerde getal.
 *
 * Nu doet `grid-template-rows: subgrid` het werk. De kaart neemt de rijen van het raster
 * eromheen over, dus alle kaarten in een rij delen dezelfde rijhoogtes en die hoogtes volgen
 * uit de langste inhoud die er werkelijk staat. Geen getal om bij te houden, en het klopt
 * in elke taal vanzelf.
 *
 * De regel die daarbij hoort, en die `npm run witruimte` bewaakt:
 *
 *   - is het blok het laatste van de kaart, dan hoeft er niets: kaarten in een raster
 *     rekken al tot dezelfde hoogte, dus de onderrand ligt al gelijk;
 *   - staat er nog iets ná het blok, dan krijgt dat blok `grow` (dan zakt de rest naar de
 *     onderrand) of de kaart wordt een subgrid (dan lijnt alles rij voor rij uit);
 *   - een reservering van drie regels of meer staat er niet meer. Dat is altijd een geteld
 *     getal over lopende tekst, en dat is het getal dat verloopt.
 *
 * Twee reserveringen blijven, en die kunnen niet verlopen. `min-h-[1lh]` op een regel die
 * leeg kan zijn (het merk op de apparatuurkaarten: de EVE-M heeft er geen) houdt die ene
 * regel vrij, en `min-h-[2lh]` op een kaartkop houdt er één extra vrij omdat een kop van
 * een of twee regels is. Meer dan één lege regel kan daar niet uit komen.
 *
 * `gap-y-0` hoort bij het subgrid: de rijafstand van het raster wordt daarin de afstand
 * tússen de blokken van de kaart, en de kaart regelt die zelf al met `mt-*`. Daarom alleen
 * bij een raster dat op dat breekpunt uit één rij kaarten bestaat.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/striae",
  titel: "Striae behandelen in Rotterdam",
  omschrijving:
    "Striae behandelen met microneedling en laser. Rode striae reageren het best, bij witte werken we op de structuur.",
});

const PAD = "/huidproblemen/striae";

const ANKERS = [
  { id: "consult", label: "In het consult" },
  { id: "soorten", label: "Twee stadia" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function StriaePage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Striae", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      {/* Donkergroen, zoals elke andere hoofdingang van de site (Yasin, 11 september
          2026). */}
      <section className="bg-[var(--g-700)] text-[var(--on-dark)]">
        {/* Op een telefoon plakte het beeld tegen de onderrand van het groene vlak: de
            tekstkolom bracht zijn eigen onderruimte mee, de beeldkolom niet (Yasin, 11
            september 2026). Vanaf 1024 staan ze naast elkaar en geldt het niet. */}
        <div className="mx-auto grid gap-6 px-5 pb-10 sm:px-9 sm:pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10 lg:px-[7.5vw] lg:pb-0">
          <div className="py-10 sm:py-14 lg:py-20 max-lg:pb-0">
            <nav
              aria-label={tc("Kruimelpad")}
              className="diba-label diba-label-on-dark flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-white">
                {t("Home")}
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/huidproblemen" className="hover:text-white">
                {t("Huidproblemen")}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--on-dark-body)]">{t("Striae")}</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[21ch]">
              {t("Striae")}{" "}
              <span className="diba-accent-on-dark">{t("behandelen")}</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              {t(
                "Striae behandelen we met microneedling en laser, die de aanmaak van collageen in het gescheurde bindweefsel op gang brengen. Zo worden ze vlakker en minder zichtbaar.",
              )}
            </p>
            <LeesVerder opDonker>
              <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                {t(
                  "Het stadium bepaalt wat er haalbaar is. Rode en paarse striae reageren het beste; bij witte werken we op de structuur. Tijdens de intake stelt de behandelaar vast waar jij staat.",
                )}
              </p>
            </LeesVerder>

            <div className="diba-knoprij mt-9">
              <Button
                variant="primair-op-donker"
                href="/intake"
                kort="Plan consult"
              >
                {t("Plan een huidconsult")}
              </Button>
              <Button
                href={DIBA_WHATSAPP_URL}
                variant="secundair-op-donker"
                target="_blank"
                rel="noopener noreferrer"
                kort="Stel een vraag"
              >
                {t("Liever eerst een vraag stellen")}
              </Button>
            </div>
          </div>

          <div className="relative min-h-[220px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-200)] sm:min-h-[300px] lg:min-h-[460px]">
            <Image
              /* Yasin, 7 september 2026: de Fotona-opname van een striaebehandeling uit
                 de shoot, in plaats van de enkele naald die hier stond. */
              src="/images/shoot/beh-fotona-striae.jpg"
              alt={tc(
                "Fotona-laserbehandeling van striae op de huid van het lichaam",
              )}
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <PillarNav ankers={ANKERS} />

      <section
        id="consult"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            icoon={HuidStrakker}
            label="In het consult"
            raster="gelijk"
            kop="Waar we"
            accent="naar kijken"
            intro="Kleur, ouderdom en reliëf bepalen samen wat er te halen valt. De behandelaar loopt die drie langs voordat er een plan komt."
          />

          <ol className="mt-8 sm:mt-12 grid gap-5 lg:grid-cols-3">
            {STRIAE_BEOORDELING.map((stap) => (
              <li
                key={stap.kop}
                className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <h3 className="diba-card-title">{tc(stap.kop)}</h3>
                {/* Laatste blok van de kaart, dus niets uit te lijnen: het raster rekt de
                    kaarten al tot dezelfde hoogte. Zie het blok bovenin. */}
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {tc(stap.tekst)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="soorten"
        className="bg-[var(--g-025)] scroll-mt-[var(--anker-offset)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Twee stadia"
            kop="Rood of"
            accent="wit"
            intro="Striae doorlopen twee fasen. Welke van de twee je hebt, bepaalt wat een behandeling oplevert en hoe snel je erbij moet zijn."
          />

          {/* Zes blokken per kaart, dus `row-span-6`. Subgrid lijnt ze uit; zie het blok
              bovenin dit bestand. Twee kaarten in twee kolommen is één rij, dus `gap-y-0`
              kan hier zonder dat er kaartrijen tegen elkaar aan komen te staan. */}
          <ul className="mt-8 sm:mt-12 grid gap-4 lg:grid-cols-2 lg:gap-y-0">
            {STRIAE_SOORTEN.map((s) => (
              <li
                key={s.id}
                className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-9 lg:grid lg:row-span-6 lg:grid-rows-subgrid"
              >
                <Label>{tc(s.klanttaal)}</Label>
                <h3 className="diba-card-title-lg mt-3 text-[var(--t-strong)]">
                  {tc(s.naam)}
                </h3>
                <p className="diba-label mt-2 text-[var(--t-muted)]">
                  {tc(s.vakterm)}
                </p>
                <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
                  {tc(s.watHetIs)}
                </p>
                <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
                  {tc(s.watWijDoen)}
                </p>
                <p className="mt-6 border-t border-[var(--g-100)] pt-4 text-[15px] leading-7 text-[var(--t-muted)]">
                  {tc(s.verwachting)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WelNiet
        wel={STRIAE_WEL_NIET.wel}
        niet={STRIAE_WEL_NIET.niet}
        intro="Bij striae telt het moment zwaarder dan de techniek. Wie begint zolang ze nog rood zijn, houdt de meeste ruimte over."
      />

      {/* Welke behandelingen bij deze klacht horen, en op welk apparaat ze
          draaien. Leeg als er niets gekoppeld is; zie het component. */}
      <BehandelingenBijProbleem pad="/huidproblemen/striae" />

      <PillarFaq items={STRIAE_FAQ} onderwerp="striae" />

      <PillarCta
        kop="Plan een intake"
        accent="bij Diba Clinics"
        tekst="De behandelaar beoordeelt in welk stadium je striae zijn en wat een reeks in jouw geval kan opleveren. Je hoort meteen wat je ervan kunt verwachten en wat het kost."
        topic="striae"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
