import type { Metadata } from "next";
import Link from "next/link";
import AbcdeCheck from "@/components/moedervlekken/AbcdeCheck";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarFaq,
  SectieKop,
  WelNiet,
  WijZeggenNee,
} from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  MOEDERVLEK_FAQ,
  MOEDERVLEK_WEL_NIET,
  MOEDERVLEK_WIJ_DOEN_NIET,
} from "@/data/moedervlekken";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";

/**
 * Moedervlekken — achtste eigen pagina, en de enige zonder afspraakknop.
 *
 * Elke andere pagina eindigt bij ons. Deze eindigt bij de huisarts, in elke uitkomst en
 * op elke plek. Wij beoordelen geen moedervlekken en verwijderen ze niet: daar is een
 * dermatoscoop voor nodig en een opleiding die een huidkliniek niet heeft, en de fout die
 * je hier kunt maken is niet terug te draaien.
 *
 * Daarom staan er drie dingen bewust níet op deze pagina: geen PillarCta, geen
 * NulmetingAssen en geen enkele link naar /intake. Een pagina die zegt "hier zijn wij het
 * niet" en er dan toch een afspraakknop onder zet, zegt het niet. Dat is dezelfde regel
 * als bij de uitkomst "schaduw" op de kringenpagina, hier doorgetrokken naar de hele
 * pagina.
 *
 * Eén donkergroen vlak (§5 staat er twee toe; het tweede is normaal de intake, en die
 * hoort hier niet).
 *
 * MEDISCH: alles op deze pagina moet langs Rojda voordat het online mag, inclusief de
 * criteria zelf. Staat tot die tijd op noindex.
 */

export const metadata: Metadata = {
  title: "Moedervlekken: waar je op let en waar je heen gaat",
  description:
    "Wij beoordelen en verwijderen geen moedervlekken. Hier staat waarom niet, waar je er wel mee terechtkunt en waar je zelf op kunt letten.",
};

const PAD = "/huidproblemen/moedervlekken";

const ANKERS = [
  { id: "check", label: "De ABCDE-check" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waarom niet bij ons" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function MoedervlekkenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Moedervlekken", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      {/* ── Hero ──
          Geen beeld naast de kop. Op deze pagina zou een sfeerfoto van een behandeling
          precies het verkeerde suggereren, namelijk dat je hiermee bij ons terechtkunt. */}
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
              <Link href="/huidproblemen" className="hover:text-[var(--g-700)]">
                Huidproblemen
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Moedervlekken</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Hiervoor moet je
              <br />
              <span className="diba-accent">niet bij ons zijn.</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Wij beoordelen geen moedervlekken en we verwijderen ze niet. Dat
              hoort bij je huisarts of een dermatoloog, want daar hebben ze de
              apparatuur en de opleiding waar dit om vraagt.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Wat we wel doen is je vertellen waar je op let. Je ligt bij ons op
              de stoel met je huid in beeld, dus je stelt de vraag toch. Dan
              liever een goed antwoord dan een ontwijkend.
            </p>

            <div className="mt-9">
              <Button href="#check">Loop de ABCDE-check langs</Button>
            </div>
          </div>

          {/* Het enige donkergroene vlak van deze pagina, en het staat er niet om iets te
              verkopen maar om één zin te laten staan. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-10">
            <Label opDonker>Het korte antwoord</Label>
            <p className="diba-card-title-lg mt-5">
              Verandert er iets aan een plekje, dan ga je naar de huisarts. Niet
              naar een kliniek, niet naar een app, en niet naar ons.
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--on-dark-body)]">
              Dat kost je een consult. Het alternatief is een oordeel van iemand
              die het niet mag geven, en dat is het niet waard.
            </p>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      <PillarNav ankers={ANKERS} />

      {/* ── De ABCDE-check: de uitblinker ──────────────────────────────── */}
      <section
        id="check"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De ABCDE-check"
            kop="Zes dingen"
            accent="om naar te kijken."
            intro="Vijf letters die dermatologen gebruiken, plus een zesde die op de meeste sites ontbreekt. Deze check geeft geen uitslag en kan niets uitsluiten. Hij helpt je bepalen of je ermee naar de huisarts gaat, en dat is waar hij voor is."
          />
          <AbcdeCheck />
        </div>
      </section>

      <WelNiet
        wel={MOEDERVLEK_WEL_NIET.wel}
        niet={MOEDERVLEK_WEL_NIET.niet}
        intro="Het eerste kruisje rechts is de enige op deze site die niet over geld gaat: een moedervlek laten weghalen buiten de zorg betekent dat er niets meer te onderzoeken valt."
      />

      <WijZeggenNee
        kop="Hier verwijzen we je"
        accent="naar de dermatoloog"
        intro="Op de andere pagina's zeggen we nee omdat een behandeling te weinig oplevert. Hier zeggen we nee omdat de fout die je kunt maken niet terug te draaien is."
        punten={MOEDERVLEK_WIJ_DOEN_NIET}
      />

      <PillarFaq items={MOEDERVLEK_FAQ} onderwerp="moedervlekken" />

      {/* ── Afsluiting zonder afspraakknop ──
          Waar op elke andere pagina de intake staat, staat hier de huisarts. */}
      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-050)] px-7 py-14 sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto">
          <Label>Waar je wel heen gaat</Label>
          <h2 className="diba-display-s mt-5 max-w-[20ch]">
            Naar je huisarts.
            <br />
            <span className="diba-accent">Daar houdt het bij ons op.</span>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Er staat op deze pagina expres nergens een knop om bij ons een
            afspraak te maken. Kom je voor iets anders en zit er een moedervlek
            in het gebied, dan dekken we die af en gaan we verder. Kom je voor
            de moedervlek zelf, dan sturen we je door voordat je bent gaan
            zitten.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <Link
              href="/huidproblemen/pigmentvlekken"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Ik zoek eigenlijk iets over pigmentvlekken
            </Link>
            <Link
              href="/ons-verbond"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Lees waar wij nog meer nee op zeggen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
