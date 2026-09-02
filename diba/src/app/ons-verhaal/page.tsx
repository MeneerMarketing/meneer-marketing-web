import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/ui/Label";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF, DIBA_SITE_URL } from "@/lib/site";
import BeeldVignet from "@/components/ui/BeeldVignet";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * Ons verhaal.
 *
 * WAAROM DEZE PAGINA NIET OVER DE OPRICHTER GAAT.
 *
 * Een verhaalpagina is meestal een oprichtersverhaal: iemand liep tegen iets aan en begon
 * daarom een kliniek. Dat verhaal bestaat hier vast ook, maar het is niet aan mij om te
 * schrijven en het is niet wat een bezoeker nodig heeft. Wie hier komt wil weten waarom
 * deze kliniek anders werkt dan de vorige waar hij was.
 *
 * Dus staan er vijf regels, en dat zijn geen bedachte kernwaarden: het zijn de regels die
 * de rest van deze site al afdwingt. Prijzen staan openbaar omdat regel drie dat zegt. Bij
 * elk apparaat staat wat het niet kan omdat regel vier dat zegt. Elke pagina is bewijs.
 *
 * DE SIGNATUUR: WAT ELKE REGEL ONS KOST.
 *
 * Een principe zonder prijs is een slogan. Iedereen zegt eerlijk te zijn; bijna niemand
 * zet erbij wat die eerlijkheid hem kost. Bij elke regel staat hier dus wat we ervoor
 * inleveren, en dat is telkens omzet of gemak. Dat is de enige manier waarop zo'n lijst
 * te controleren valt.
 *
 * [COPY-NODIG: het persoonlijke verhaal van Rojda, van haarzelf.] Als dat er komt, hoort
 * het bovenaan deze pagina en niet in plaats van de vijf regels.
 *
 * Eén donkergroen vlak: de regel die het meeste kost (§5).
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/ons-verhaal",
  titel: "Ons verhaal",
  omschrijving:
    "Vijf regels waar deze kliniek zich aan houdt, en bij elke regel wat die ons kost. Ook als dat een behandeling is die we niet doen.",
});

/**
 * De vijf regels.
 *
 * Ze staan in de volgorde waarin je ze op de site tegenkomt, en niet op belangrijkheid.
 * De derde is de duurste en die staat daarom apart uitgelicht.
 *
 * [MEDISCHE-CHECK-ROJDA] regel 1 en 4, want daar staan uitspraken over wat er wel en niet
 * te voorspellen valt.
 */
const REGELS = [
  {
    kop: "Elk traject begint met een meting",
    zin: "Elk traject begint met een meting, ook als je precies weet wat je wil. Zonder nulpunt is over drie maanden niet vast te stellen of er iets veranderd is, behalve op gevoel.",
    kost: "Een afspraak die geen behandeling is. Een deel van de mensen haakt daar af, want ze wilden vandaag geholpen worden en niet gemeten.",
  },
  {
    kop: "Nee zeggen mag, en gebeurt",
    zin: "Past een behandeling niet bij je huid, bij je hersteltijd of bij het moment, dan hoor je dat. Ook als je er speciaal voor gekomen bent.",
    kost: "Omzet, direct en meetbaar. Elke nee is een behandeling die niet geboekt wordt, en er staat niets tegenover behalve dat het klopt.",
  },
  {
    kop: "Elke prijs staat op de site",
    zin: "Per sessie, per zone, per variant, inclusief de duurste. Geen bedrag dat je pas hoort als je al op de stoel ligt.",
    kost: "Het onderhandelingsvoordeel. Een bedrag dat pas aan de balie valt, valt op het moment dat je het moeilijkst nee zegt. Dat voordeel geven we weg, en dat merken we.",
    uitgelicht: true,
  },
  {
    kop: "Bij elke behandeling staat wat hij niet kan",
    zin: "Op elke behandelpagina en bij elk apparaat staat de grens erbij, even nadrukkelijk als wat het wel doet. Een peeling neemt geen rimpels weg, want hij komt daar niet.",
    kost: "De helft van je verkooptekst. Een pagina die alleen voordelen opsomt verkoopt beter; hij levert alleen teleurstelling op bij de tweede afspraak.",
  },
  {
    kop: "Geen belofte zonder getal",
    zin: "Geen resultaatgaranties, geen voor-en-na dat niet klopt, geen aantal sessies dat we niet kunnen onderbouwen. Wat we niet weten, zeggen we niet.",
    kost: "De grote woorden. Een pagina vol stellige beloftes leest spannender dan deze, en dat blijft zo.",
  },
];

export default function OnsVerhaalPage() {
  const uitgelicht = REGELS.find((r) => r.uitgelicht);
  const rest = REGELS.filter((r) => !r.uitgelicht);

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Ons verhaal", url: `${DIBA_SITE_URL}/ons-verhaal` },
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
              <span className="text-[var(--t-muted)]">Ons verhaal</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[14ch]">
              Vijf regels waar we
              <br />
              <span className="diba-accent">ons aan houden</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Elke kliniek zegt eerlijk te zijn. Bijna geen enkele zet erbij wat
              die eerlijkheid haar kost, en zonder die prijs is een principe een
              slogan.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Hieronder staan de vijf regels waar we ons sinds{" "}
              {DIBA_PROOF.activeSince} aan houden, met bij elke regel wat we
              ervoor inleveren.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Hoe je dit kunt controleren</Label>
            <p className="mt-5 text-[19px] leading-8 text-[var(--t-body)]">
              Deze regels zijn geen bedachte kernwaarden. Het zijn de regels die
              de rest van deze site al afdwingt.
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
              De prijzen staan openbaar omdat regel drie dat zegt. Bij elk
              apparaat staat wat het niet kan omdat regel vier dat zegt. Elke
              pagina is bewijs, of ze klopt niet.
            </p>
          </div>
        </div>
      </section>

      {/* ── De duurste regel apart ── */}
      {uitgelicht ? (
        <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-20">
          <div className="mx-auto">
            <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                <div>
                  {/* Hier stond het volgnummer op 64px. Een groot cijfer dat nergens naar
                      verwijst is decoratie, en het label eronder zegt al wat dit is. */}
                  <Label opDonker>De duurste regel</Label>
                  <h2 className="diba-display-m mt-5 max-w-[16ch]">
                    {uitgelicht.kop}
                  </h2>
                </div>
                <div>
                  <p className="max-w-[52ch] text-[17px] leading-8 text-[var(--on-dark-body)]">
                    {uitgelicht.zin}
                  </p>
                  <div className="mt-8 rounded-[var(--r-md)] bg-white/10 p-6 sm:p-7">
                    <p className="diba-label diba-label-on-dark">
                      Wat het ons kost
                    </p>
                    <p className="mt-3 max-w-[52ch] text-[16px] leading-7 text-[var(--on-dark-accent)]">
                      {uitgelicht.kost}
                    </p>
                  </div>
                  <Link
                    href="/prijzen"
                    className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white"
                  >
                    Kijk zelf, alles staat er
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── De andere vier ── */}
      {/* Vijf regels en wat ze kosten is een abstract verhaal. Dit is waar zo'n regel in de
          praktijk wordt toegepast: twee mensen die samen besluiten of iets meegaat. */}
      <section className="px-5 pb-14 sm:px-9 lg:px-[7.5vw] lg:pb-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/producten-overleg.jpg"
            alt="Twee behandelaars bekijken samen een verpakking in de kliniek"
            onderschrift="Wat er wel en niet in huis komt"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/10] lg:aspect-[2/1]"
          />
        </div>
      </section>

      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>De andere vier</Label>
            <h2 className="diba-display-m mt-4">
              Elk principe{" "}
              <span className="diba-accent">heeft een rekening.</span>
            </h2>
          </div>

          <ul className="mt-10 space-y-4">
            {rest.map((r) => (
              <li
                key={r.kop}
                className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9 lg:p-11"
              >
                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
                  <div>
                    {/* "Regel 01" is weg. De regels hebben geen volgorde en niemand
                        verwijst ernaar met een nummer; de kop zegt genoeg. */}
                    <p className="mt-4 text-[30px] leading-[1.05] font-normal tracking-[-.05em] text-balance sm:text-[34px]">
                      {r.kop}
                    </p>
                  </div>
                  <div>
                    <p className="max-w-[58ch] text-[16px] leading-8 text-[var(--t-body)]">
                      {r.zin}
                    </p>
                    <div className="mt-6 rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
                      <p className="diba-label text-[var(--t-label)]">
                        Wat het ons kost
                      </p>
                      <p className="mt-2 max-w-[58ch] text-[15px] leading-7 text-[var(--t-body)]">
                        {r.kost}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Afsluiter ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Houd ons eraan</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Klopt er iets <span className="diba-accent">niet?</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Kom je op deze site een belofte tegen zonder onderbouwing, een
              prijs die niet klopt of een behandeling zonder grens erbij, zeg
              het dan. Een lijst regels is pas iets waard als iemand er iets
              tegenin kan brengen.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/contact"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Laat het weten
              </Link>
              <Link
                href="/over-ons"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Wie we zijn, in cijfers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
