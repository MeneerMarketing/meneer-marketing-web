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
 * WAAROM HIER GEEN TWEEDE MANIFEST MEER STAAT.
 *
 * Deze pagina had vijf regels met bij elke regel wat die ons kost, en /ons-verbond heeft
 * er tien ("Tien dingen die wij niet doen"). Twee manifesten dus, waarvan dit het
 * stelligste was. Yasin was daar duidelijk over: die toon hoort alleen in het verbond.
 *
 * Met 64 ontkenningen per 1000 woorden was dit ook de zwaarste pagina van de site die geen
 * juridische tekst is, terwijl "Ons verhaal" nu juist de plek is waar iemand komt kijken
 * wie hier werkt.
 *
 * Er staan nu vijf dingen die de kliniek zijn: sinds 2017 in Rotterdam, een traject dat
 * begint met een huidanalyse, prijzen die openbaar staan, geregistreerde huidtherapeuten
 * en contracten met zorgverzekeraars. De prijstransparantie blijft uitgelicht, want dat is
 * een echt onderscheid en geen weigering.
 *
 * [COPY-NODIG: het persoonlijke verhaal van Rojda, van haarzelf.] Als dat er komt, hoort
 * het bovenaan deze pagina.
 *
 * Eén donkergroen vlak: de prijzen (§5).
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/ons-verhaal",
  titel: "Ons verhaal",
  omschrijving:
    "Huidkliniek in Rotterdam sinds 2017. Geregistreerde huidtherapeuten, een traject dat begint met een huidanalyse en prijzen die op de site staan.",
});

/**
 * Waar de kliniek op draait.
 *
 * Vijf dingen, in de volgorde waarin je ze tegenkomt en niet op belangrijkheid. De prijzen
 * staan apart uitgelicht, want daar wijkt deze kliniek het duidelijkst af van de rest.
 *
 * De tweede kolom heette `kost` en ging over wat een principe ons kostte. Hij heet nu
 * `betekent` en gaat over wat het voor de bezoeker oplevert.
 */
const REGELS = [
  {
    kop: "Sinds 2017 in Rotterdam",
    zin: "Diba Clinics is in 2017 begonnen als huidkliniek in Rotterdam. Onze huidtherapeuten en specialisten behandelen acne, pigment, littekens, huidverbetering en ongewenst haar.",
    betekent:
      "Een team dat elke dag met dezelfde huidklachten werkt, en apparatuur waar het in de praktijk mee is ingeregeld.",
  },
  {
    kop: "Elk traject begint met een huidanalyse",
    zin: "De behandelaar bekijkt je huid en meet met de EVE-M wat er onder de oppervlakte speelt: pigment, vocht, poriën en structuur. Daaruit volgt het behandelplan.",
    betekent:
      "Je ziet zelf waar de adviezen vandaan komen, en bij een volgende afspraak leggen we de opnames naast elkaar.",
  },
  {
    kop: "Elke prijs staat op de site",
    zin: "Per sessie, per zone, per variant, inclusief de duurste. Je weet voordat je komt waar je aan toe bent.",
    betekent:
      "Je kunt thuis rustig vergelijken en beslissen, in plaats van aan de balie op het moment dat het het lastigst is.",
    uitgelicht: true,
  },
  {
    /* [MEDISCHE-CHECK-ROJDA] Rojda noemde "en anbos en skin"; de volledige naam van dat
       tweede register is nog niet bevestigd. De vlag hoort in dit commentaar en niet in de
       zin eronder: deze lijst gaat niet langs publicCopy(), dus de bezoeker leest hem mee. */
    kop: "Huidtherapeuten met een registratie",
    zin: "Onze huidtherapeuten staan ingeschreven in het Kwaliteitsregister Paramedici, en de kliniek is aangesloten bij ANBOS. Beide vragen bij- en nascholing.",
    betekent:
      "Veel aanvullende pakketten stellen die inschrijving als eis voordat ze een behandeling vergoeden.",
  },
  {
    /* [BESLUIT-OKAN] Okan: "gecontracteerd bij alle zorgverzekeraars" alleen gebruiken als
       het aantoonbaar is en jaarlijks nagekeken wordt. Tot die tijd staat hier dezelfde
       formulering als op de homepage: er zijn contracten, en of jouw behandeling vergoed
       wordt hangt af van je klacht en je pakket. */
    kop: "Contracten met zorgverzekeraars",
    zin: "Diba Clinics heeft contracten met zorgverzekeraars. Of jouw behandeling vergoed wordt, hangt af van je klacht en van je aanvullende pakket.",
    betekent:
      "Tijdens de intake hoor je wat er in jouw geval onder de vergoeding valt, en wat je zelf betaalt.",
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

            <h1 className="diba-display-l mt-6 max-w-[21ch]">
              Een huidkliniek in
              <br />
              <span className="diba-accent">Rotterdam</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Sinds {DIBA_PROOF.activeSince} helpen onze huidtherapeuten en
              specialisten je met acne, pigment, littekens, huidverbetering en
              ongewenst haar.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Hieronder staat hoe we werken: waar een traject begint, wat het
              kost en waar onze behandelaars voor staan.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Waar je dit terugziet</Label>
            <p className="mt-5 text-[19px] leading-8 text-[var(--t-body)]">
              Elke afspraak begint met een huidanalyse, en daaruit volgt het
              behandelplan.
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
              De prijzen staan per sessie op de site, dus je weet voordat je
              komt wat het kost. Bij elke behandeling lees je hoeveel sessies
              erbij horen.
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
                  <Label opDonker>Vooraf duidelijk</Label>
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
                      Wat dat voor jou betekent
                    </p>
                    <p className="mt-3 max-w-[52ch] text-[16px] leading-7 text-[var(--on-dark-accent)]">
                      {uitgelicht.betekent}
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
      {/* Vijf punten op een rij blijft een abstract verhaal. Dit is waar het in de praktijk
          gebeurt: twee behandelaars die samen besluiten wat er meegaat. */}
      <section className="px-5 pb-14 sm:px-9 lg:px-[7.5vw] lg:pb-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/team-producten-overleg.jpg"
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
              Waar wij <span className="diba-accent">voor staan</span>
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
                    {/* "Regel 01" is weg. Deze punten hebben geen volgorde en niemand
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
                        Wat dat voor jou betekent
                      </p>
                      <p className="mt-2 max-w-[58ch] text-[15px] leading-7 text-[var(--t-body)]">
                        {r.betekent}
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
            <Label>De eerste afspraak</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Begin met een <span className="diba-accent">huidanalyse</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              De behandelaar bekijkt je huid, meet met de EVE-M en stelt vast
              wat er bij jou past. Je hoort meteen om hoeveel sessies het gaat
              en wat het kost. Word je in dezelfde afspraak behandeld, dan
              vervallen de intakekosten.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Plan een huidconsult
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
