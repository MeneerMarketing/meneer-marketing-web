import type { Metadata } from "next";
import Link from "next/link";
import Wachtweegschaal from "@/components/isnodig/Wachtweegschaal";
import Label from "@/components/ui/Label";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";

/**
 * Is het nodig?
 *
 * WAAROM DEZE PAGINA BESTAAT EN WAAROM HIJ ANDERS IS OPGEBOUWD.
 *
 * Elke andere pagina hier legt uit wat een behandeling doet. Deze gaat over het
 * alternatief dat nergens wordt aangeboden: niets doen. Dat is geen bescheidenheid maar
 * de logische afsluiting van een site die bij elke behandeling zet wat hij níet kan.
 *
 * De opbouw volgt de gedachtegang van iemand die twijfelt, en die loopt precies andersom
 * dan een verkooppagina:
 *
 *   1. Waarom deze vraag zelden gesteld wordt, en door wie niet.
 *   2. De weegschaal: wat er over twaalf maanden gebeurt als je wacht, naast wat er
 *      gebeurt als je behandelt. Bij twee van de vijf voorbeelden wint wachten.
 *   3. De drie momenten waarop wachten wél iets kost, want dat is de andere helft van
 *      een eerlijk antwoord.
 *   4. Pas daarna waar je heen kunt.
 *
 * De signatuurvorm is de tijdlijn met twee sporen naast elkaar (zie `Wachtweegschaal`).
 * Die komt nergens anders op de site voor, want geen andere pagina zet het alternatief
 * naast het aanbod.
 *
 * Eén donkergroen vlak: de drie momenten waarop wachten iets kost (§5).
 */

export const metadata: Metadata = {
  title: "Is het nodig?",
  description:
    "De vraag die een kliniek zelden stelt. Wat er gebeurt als je niets doet, naast wat er gebeurt als je behandelt, over twaalf maanden.",
};

/**
 * Wanneer wachten wél iets kost.
 *
 * Dit is de tegenhanger van de weegschaal. Zonder dit blok is de pagina een houding en
 * geen advies; met dit blok staat er ook wanneer uitstellen duurder wordt.
 * [MEDISCHE-CHECK-ROJDA]
 */
const WACHTEN_KOST = [
  {
    kop: "Als er nu schade ontstaat",
    zin: "Actieve ontstekingen kunnen putjes en littekens achterlaten. Die zijn later moeilijker en duurder aan te pakken dan de ontsteking zelf. Dat is een reden om niet te wachten, en het is een andere reden dan een mooiere huid.",
  },
  {
    kop: "Als je niet weet wat het is",
    zin: "Wachten met behandelen is prima. Wachten met kijken is iets anders. Een plek die verandert van vorm, kleur of grootte hoort door een arts bekeken te worden, en daar is geen kliniek voor nodig maar een huisarts.",
  },
  {
    kop: "Als het je dagelijks bezighoudt",
    zin: "Er bestaat geen meetlat voor hoeveel last genoeg last is. Merk je dat je je erop verkijkt in de spiegel, foto's ontwijkt of je kleding erop aanpast, dan is dat op zichzelf een reden om er iets aan te doen.",
  },
];

export default function IsHetNodigPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Is het nodig?", url: `${DIBA_SITE_URL}/is-het-nodig` },
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
              <span className="text-[var(--t-muted)]">Is het nodig?</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[13ch]">
              Soms is het
              <br />
              <span className="diba-accent">antwoord nee.</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Dit is de vraag die een kliniek zelden stelt, om een reden die
              niet zo ingewikkeld is: wij verdienen aan het antwoord ja. Dus
              stellen we hem hier zelf, en niet met een slag om de arm.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Bij een deel van wat mensen hier brengen is niets doen het betere
              spoor. Hieronder staat bij welke, en waarom.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Waar het op neerkomt</Label>
            <p className="diba-display-s mt-4 max-w-[16ch]">
              Niets doen is ook
              <span className="diba-accent"> een behandelplan.</span>
            </p>
            <p className="mt-6 text-[16px] leading-8 text-[var(--t-body)]">
              Alleen staat het nergens op een prijslijst, en daarom wordt het
              zelden voorgesteld. Het kost niets, het heeft geen hersteltijd en
              bij een aantal dingen is het de beste uitkomst die er is.
            </p>
          </div>
        </div>
      </section>

      {/* ── De weegschaal: de signatuur van deze pagina ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Twaalf maanden, twee sporen</Label>
            <h2 className="diba-display-m mt-4">
              Wat er gebeurt
              <span className="diba-accent">als je niets doet.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Kies waar het bij jou over gaat. Links staat het verloop zonder
              behandeling, rechts met. Bij sommige dingen lopen die twee bijna
              gelijk op, en dan is de vraag niet of het werkt maar of het de
              moeite waard is.
            </p>
          </div>

          <div className="mt-10">
            <Wachtweegschaal />
          </div>
        </div>
      </section>

      {/* ── Wanneer wachten wél iets kost ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <div>
                <Label opDonker>De andere helft</Label>
                <h2 className="diba-display-m mt-4 max-w-[16ch]">
                  Drie keer kost
                  <span className="diba-accent-on-dark">
                    {" "}
                    wachten wél iets.
                  </span>
                </h2>
                <p className="mt-6 max-w-[44ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                  Een pagina die alleen zegt dat je vaak kunt wachten is net zo
                  eenzijdig als een pagina die alleen behandelingen aanprijst.
                  Dit zijn de gevallen waarin uitstellen duurder wordt.
                </p>
              </div>

              <ul className="space-y-5">
                {WACHTEN_KOST.map((w) => (
                  <li
                    key={w.kop}
                    className="border-b border-white/15 pb-5 last:border-b-0 last:pb-0"
                  >
                    <p className="text-[18px] leading-7 font-medium">{w.kop}</p>
                    <p className="mt-2 max-w-[54ch] text-[15px] leading-7 text-[var(--on-dark-body)]">
                      {w.zin}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Waar je heen kunt ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>En nu</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Meten kan ook
              <br />
              <span className="diba-accent">zonder behandelen.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Twijfel je nog, dan is een meting geen verplichting tot iets. Er
              wordt gekeken en uitgelegd, en je gaat naar huis met wat eruit
              kwam. Komt daar uit dat wachten bij jou het verstandigst is, dan
              hoor je dat ook. Dat is geen mislukte afspraak maar een antwoord.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Plan Behandeling Nul
              </Link>
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Eerst je vraag stellen
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
