import type { Metadata } from "next";
import Link from "next/link";
import Prijslijst from "@/components/prijzen/Prijslijst";
import Behandelprijzen from "@/components/prijzen/Behandelprijzen";
import PrijzenVoorJou from "@/components/prijzen/PrijzenVoorJou";
import FaqAccordion, { type FaqItem } from "@/components/ui/FaqAccordion";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { behandelingVoorSlug, prijsTekst } from "@/data/behandelingen";
import { kostenVraag } from "@/data/pillar-kosten";
import { SITUATIES, VAST } from "@/data/voorwaarden";
import { breadcrumbSchema, faqSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * De tarievenpagina.
 *
 * Herbouwd, en niet alleen qua vorm. De vorige versie bouwde de laserlijst met een
 * hulpfunctie die elke prijs op nul zette, en toonde bij nul letterlijk "[PRIJS-NODIG]"
 * op het scherm. Sinds er tarieven in `laser-zones.ts` staan zou deze pagina overal € 0
 * hebben laten zien terwijl de configurator ernaast de juiste bedragen toont.
 *
 * Alle regels komen nu uit dezelfde bron als de rest van de site. Een prijs die op twee
 * plekken staat, staat binnen een maand twee keer verschillend.
 *
 * Eén donkergroen vlak op deze pagina: de afsluiter. Een prijslijst hoort licht te zijn,
 * anders leest hij als een offerte.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/tarieven",
  titel: "Tarieven",
  omschrijving:
    "Alle tarieven van Diba Clinics op één pagina, per sessie en per zone. Wat er staat is wat je betaalt.",
});

const intakeBehandeling = behandelingVoorSlug("huidanalyse");
const intakeBedrag = intakeBehandeling
  ? prijsTekst(intakeBehandeling.prijs)
  : "een vast bedrag";

function situatie(id: string): string {
  return SITUATIES.find((s) => s.id === id)?.gebeurt ?? "";
}

/**
 * De vragen die alleen op deze pagina opkomen.
 *
 * De kostenvraag komt uit pillar-kosten.ts, dezelfde die op de huidprobleempagina's staat:
 * een tarief dat je op twee plekken overschrijft, staat binnen een maand twee keer
 * verschillend. De annulerings- en betaalregels komen om dezelfde reden uit voorwaarden.ts.
 */
const PRIJZEN_FAQ: FaqItem[] = [
  { question: kostenVraag().vraag, answer: kostenVraag().antwoord },
  {
    question: "Staat de btw er al bij?",
    answer:
      "Ja. De bedragen op deze pagina zijn wat je aan de balie betaalt. Er komt niets bij voor materiaal of voor het aanleggen van een dossier.",
  },
  {
    question: "Krijg ik dit vergoed?",
    answer:
      "Dat hangt af van je aanvullende verzekering en of er een medische indicatie is. Diba Clinics is gecontracteerd bij alle zorgverzekeraars; op de vergoedingenpagina staat per verzekeraar wat eronder valt.",
  },
  {
    question: "Zijn er kortingen, pakketten of acties?",
    answer: VAST[0].zin,
  },
  {
    question: "Wat als ik mijn afspraak afzeg?",
    answer: `${situatie("afzeggen-op-tijd")} ${situatie("afzeggen-te-laat")}`,
  },
  {
    question: "Wanneer betaal ik?",
    answer: situatie("betalen"),
  },
  {
    question: "Wat als de behandeling niet door kan gaan?",
    answer:
      SITUATIES.find((s) => s.id === "behandeling-kan-niet")?.kost ??
      "Je betaalt de behandeling dan niet.",
  },
];

export default function TarievenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Tarieven", url: `${DIBA_SITE_URL}/tarieven` },
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
              <span className="text-[var(--t-muted)]">Tarieven</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[21ch]">
              Alle tarieven
              <br />
              <span className="diba-accent">op één plek</span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Wat een behandeling kost hoor je liever voordat je een afspraak
              maakt dan erna. Daarom staat het hier: elk tarief, per sessie en
              per zone, zonder dat je ervoor hoeft te bellen.
            </p>

            <p className="mt-4 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Wat je hier niet vindt is een pakket met een streep door de oude
              prijs. Er zijn geen kortingen en geen acties, dus er is ook nooit
              een moment waarop je te vroeg of te laat was.
            </p>
          </div>

          {/* Stond op een rand. Vlakken dragen zichzelf; op --g-010 is wit al genoeg
              onderscheid en een lijntje eromheen is precies de stijl die hier niet hoort. */}
          {/* De belangrijkste prijs op deze pagina stond er niet: die van de intake. Wat
              een behandeling kost hangt af van welke het wordt, en dat is precies wat je
              daar hoort. Het bedrag komt uit de behandelingentabel, zodat het niet naast
              /intake en het huidprofiel uit de pas gaat lopen. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Waar een prijs begint</Label>
            <p className="diba-card-title mt-4 text-[var(--t-strong)]">
              De intake: {intakeBedrag}
            </p>
            <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
              Welke behandeling bij je huid past, hoor je tijdens de intake. Tot
              dat gesprek is elk bedrag een gok, en daarom staat het hier als
              enige niet in een lijst.
            </p>
            <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
              Word je in dezelfde afspraak behandeld, dan gaat dat bedrag er
              weer af. Je betaalt dan alleen de behandeling.
            </p>
            <Link
              href="/intake"
              className="diba-label mt-6 inline-flex min-h-12 items-center gap-2 self-start rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              Zo werkt de intake
            </Link>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      {/* ── Wat het bij jou kost ──
          De lijst hieronder is ruim vier schermen lang, en dat blijft zo: alles staat er,
          altijd. Maar het antwoord op de vraag waarmee iemand hier komt stond daardoor
          ergens in die vier schermen verstopt. De behandelingenpagina ordende al op het
          huidprofiel; deze pagina deed dat niet, dus las je daar wat bij je past en hier
          weer een alfabetische muur. Dit blok haalt die twee bij elkaar. Er wordt niets
          weggefilterd; het staat erboven en niet ervoor in de plaats. */}
      <section className="px-5 pt-14 sm:px-9 lg:px-[7.5vw] lg:pt-16">
        <div className="mx-auto">
          <PrijzenVoorJou />
        </div>
      </section>

      {/* ── De behandelingen, met wat je voor dat bedrag krijgt ──
          Dit was een tabel met een naam links en een bedrag rechts. De vraag achter "wat
          kost een peeling" gaat nooit alleen over het bedrag, maar over of het bij je
          past, hoe vaak je moet komen en hoe lang je erna rood bent. Dat stond allemaal
          al in behandelingen.ts en werd hier niet gebruikt. Nu wel, uitklapbaar, met het
          bedrag altijd in beeld. */}
      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Per behandeling</Label>
            <h2 className="diba-display-m mt-4">
              Wat een behandeling <span className="diba-accent">kost</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Klap een behandeling open en je ziet hoe vaak je moet komen, hoe
              lang de hersteltijd is en wat het niet doet. Het bedrag blijft
              staan, ook dicht.
            </p>
          </div>
          <div className="mt-10">
            <Behandelprijzen />
          </div>
        </div>
      </section>

      {/* ── De laserzones ──
          Dit blijft een tabel, want dat is het ook: veertig zones tegen twee
          tarievenlijsten. Rijen en kolommen in de letterlijke zin. */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Laserontharing per zone</Label>
            <h2 className="diba-display-m mt-4">
              Elke zone,{" "}
              <span className="diba-accent">met het tarief erbij.</span>
            </h2>
          </div>
          <div className="mt-10">
            <Prijslijst />
          </div>
        </div>
      </section>

      {/* ── Veelgestelde vragen ──
          Een tarievenpagina roept vragen op die nergens anders thuishoren: gaat er btw
          overheen, krijg ik het vergoed, wat als ik afzeg. Die antwoorden stonden al in de
          voorwaarden en op /vergoedingen, alleen niet op de pagina waar de vraag opkomt. */}
      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <SchemaMarkup data={faqSchema(PRIJZEN_FAQ)} />
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Label>Vragen over prijzen</Label>
              <h2 className="diba-display-m mt-4 max-w-[16ch]">
                Wat mensen <span className="diba-accent">hierover vragen.</span>
              </h2>
              <p className="mt-6 max-w-[38ch] text-[16px] leading-7 text-[var(--t-body)]">
                Staat je vraag er niet bij, dan hoor je het antwoord aan de
                telefoon zonder dat er een afspraak uit hoeft te komen.
              </p>
              {/* De antwoorden hierboven zijn kort omdat de volledige versie elders
                  staat. Deze twee links wijzen daarheen. */}
              <ul className="diba-label mt-6 space-y-2">
                <li>
                  <Link
                    href="/vergoedingen"
                    className="text-[var(--g-700)] underline underline-offset-4 transition-colors hover:text-[var(--g-800)]"
                  >
                    Vergoeding per verzekeraar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/algemene-voorwaarden"
                    className="text-[var(--g-700)] underline underline-offset-4 transition-colors hover:text-[var(--g-800)]"
                  >
                    Afzeggen, betalen en verzetten
                  </Link>
                </li>
              </ul>
            </div>
            <FaqAccordion items={PRIJZEN_FAQ} />
          </div>
        </div>
      </section>

      {/* ── Afsluiter ──
          Hier stond een uitnodiging om de laserconfigurator te openen, met een tekening
          waarop je zones aanwijst. Die staat tijdelijk uit. De knoppen wezen al ergens
          anders heen, maar de tekst beloofde nog wat er niet meer is. */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <Label opDonker>Wat het totaal bepaalt</Label>
            <h2 className="diba-display-m mt-4 max-w-[22ch]">
              Niet de prijs per sessie,
              <br />
              <span className="diba-accent-on-dark">maar het aantal.</span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              De bedragen hierboven liggen vast. Wat je in totaal kwijt bent
              hangt af van hoe vaak je komt, en dat verschilt per huid. Een
              aantal noemen voordat we gemeten hebben is een gok met jouw geld,
              dus dat doen we niet.
            </p>
            <p className="mt-4 max-w-[58ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Tijdens de intake hoor je om hoeveel sessies het bij jou gaat en
              wat dat samen wordt. Dat is het eerste moment waarop iemand daar
              iets zinnigs over kan zeggen.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Plan een intake
              </Link>
              <Link
                href="/behandelingen"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/50 px-6 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Wat de behandelingen doen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
