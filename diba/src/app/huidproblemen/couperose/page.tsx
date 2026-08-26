import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PillarNav from "@/components/pillar/PillarNav";
import {
  NulmetingAssen,
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
  WijZeggenNee,
} from "@/components/pillar/PillarSecties";
import SoortKiezer, { type SoortOptie } from "@/components/pillar/SoortKiezer";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  COUPEROSE_BEELDEN,
  COUPEROSE_FAQ,
  COUPEROSE_WEL_NIET,
  COUPEROSE_WIJ_DOEN_NIET,
  DRUKPROEF_STAPPEN,
} from "@/data/couperose";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Couperose — eigen pagina, met de drukproef als uitblinker.
 *
 * WAAROM DEZE PAGINA NAAST /huidproblemen/rosacea STAAT.
 *
 * Couperose stond alleen in de titel van de rosaceapagina en als één van de vier beelden
 * daarbinnen. Klinisch klopte dat; als ingang niet. Iemand die "couperose" intikt zoekt de
 * lijntjes naast zijn neus en niet een pagina over opvlammingen, triggers en stadia. De
 * uitleg in `src/data/couperose.ts` zet uiteen waarom dit wél een eigen pagina verdient en
 * striae dat niet kreeg.
 *
 * De twee pagina's wijzen expliciet naar elkaar, in allebei de richtingen. Wie hier
 * binnenkomt en meer herkent dan vaatjes alleen hoort dat hier te lezen, niet pas na een
 * intake.
 *
 * DE UITBLINKER: DE DRUKPROEF.
 *
 * Elke pillarpagina heeft één ding dat statische tekst niet kan. Bij acne is dat de
 * zonekaart, bij rosacea de triggersorteerder. Hier is het een test die je zelf doet, met
 * je eigen vinger, in twee seconden, en waarvan de uitslag bepaalt welke kant het gesprek
 * op gaat. Dat is geen widget maar drie stappen tekst, en dat is precies genoeg: hij werkt
 * op je eigen huid en niet op het scherm.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda.
 */

export const metadata: Metadata = {
  title: "Couperose behandelen in Rotterdam",
  description:
    "Rode vaatjes op je wangen of naast je neus. Met de drukproef zie je zelf of het couperose is of een rode gloed, en dat bepaalt wat helpt.",
};

const PAD = "/huidproblemen/couperose";

const ANKERS = [
  { id: "drukproef", label: "De drukproef" },
  { id: "welke", label: "Welk beeld" },
  { id: "rosacea", label: "Of is het rosacea" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = COUPEROSE_BEELDEN.map((b) => ({
  id: b.id,
  naam: b.naam,
  klanttaal: b.klanttaal,
  vakterm: b.vakterm,
  velden: [
    ["Wat de drukproef doet", b.drukproef],
    ["Wat het betekent", b.watHetBetekent],
    ["Wat wij eerst doen", b.aanpak],
  ] as const,
  uitgelicht: {
    label: "Wat mensen hier vaak verkeerd hebben",
    tekst: b.verwarring,
  },
}));

/** Het onderscheid dat mensen het vaakst zelf al kunnen maken. */
const COUPEROSE_OF_ROSACEA = [
  [
    "De drukproef",
    "Blijft een lijntje staan, dan is het couperose. Trekt alles weg, dan is het een gloed.",
  ],
  [
    "Opvlammen",
    "Bij rosacea komt en gaat het in aanvallen. Losse vaatjes staan er elke dag hetzelfde bij.",
  ],
  ["Branderig gevoel", "Hoort bij rosacea. Een verwijd vaatje voel je niet."],
  [
    "Bultjes",
    "Rode bultjes zonder mee-eters wijzen op rosacea, en daar hoort een arts bij.",
  ],
] as const;

export default function CouperosePage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Couperose", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="py-14 lg:py-20">
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
              <span className="text-[var(--t-muted)]">Couperose</span>
            </nav>

            {/* De kop is de drukproef in twee regels. Dat is meteen het onderscheid
                waar de hele pagina om draait, en je kunt hem nalezen voor je verder
                scrolt. */}
            <h1 className="diba-display-l mt-6">
              Een lijntje blijft staan.
              <br />
              <span className="diba-accent">Een gloed trekt weg.</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Rode vaatjes op je wangen of naast je neus heten couperose. Een
              rode waas zonder losse lijntjes is iets anders, en vraagt om een
              andere aanpak. Met je eigen vinger zie je binnen twee seconden
              welke van de twee je hebt.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              En nee, je hoeft hier niets uit te leggen over hoe snel je rood
              wordt.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#drukproef">Doe de drukproef</Button>
              <Button
                href={DIBA_WHATSAPP_URL}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Liever eerst een vraag stellen
              </Button>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-200)] lg:min-h-[460px]">
            <Image
              src="/images/shoot/beh-nordlys.jpg"
              alt="Behandelaar werkt met de Nordlys aan de huid van een cliënt"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      <PillarNav ankers={ANKERS} />

      {/* ── De drukproef: de uitblinker ────────────────────────────────── */}
      <section
        id="drukproef"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De drukproef"
            raster="gelijk"
            kop="Twee seconden,"
            accent="en je weet het zelf."
            intro="Dit is geen diagnose en het vervangt geen meting. Het is wel het enige onderscheid dat je thuis kunt maken, en het bepaalt of licht bij jou iets oplevert of dat we eerst naar de triggers moeten kijken."
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {DRUKPROEF_STAPPEN.map((stap, i) => (
              <li
                key={stap.kop}
                className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <span className="diba-label text-[var(--g-700)]">
                  Stap {i + 1}
                </span>
                <h3 className="diba-card-title mt-3">{stap.kop}</h3>
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(stap.tekst)}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-8 max-w-[70ch] text-[15px] leading-7 text-[var(--t-muted)]">
            Zag je allebei? Dat is de meest voorkomende uitkomst, en geen
            tussenvorm die je zelf hoeft op te lossen. Hieronder staat wat elk
            van de twee vraagt.
          </p>
        </div>
      </section>

      {/* ── Welk beeld ─────────────────────────────────────────────────── */}
      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Herkenning"
            kop="Drie beelden,"
            accent="en ze vragen niet hetzelfde."
            intro="De uitslag van de drukproef bepaalt bij welk beeld je uitkomt. Bij één daarvan begint het bij licht, bij een ander juist niet, en dat verschil is het hele punt van deze pagina."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=couperose&beeld={id}"
            ctaLabel="Laat dit beeld bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />
        </div>
      </section>

      {/* ── Couperose of rosacea ───────────────────────────────────────── */}
      <section
        id="rosacea"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Het verschil dat uitmaakt"
            kop="Couperose of rosacea?"
            intro="Ze lopen vaak samen en worden daarom door elkaar gehaald, ook door ons vak. Vier verschillen die je zelf kunt nagaan voordat je iets boekt."
          />

          <dl className="mt-12 grid gap-5 lg:grid-cols-2">
            {COUPEROSE_OF_ROSACEA.map(([kop, tekst]) => (
              <div
                key={kop}
                className="rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <dt className="diba-card-title">{kop}</dt>
                <dd className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(tekst)}
                </dd>
              </div>
            ))}
          </dl>

          {/* De doorverwijzing hoort hier en niet onderaan. Wie na deze vier
              verschillen doorheeft dat het rosacea is, moet dan weg kunnen en niet
              eerst de rest van een pagina door die niet over hem gaat. */}
          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>Herken je meer dan de vaatjes</Label>
            <p className="diba-card-title-lg mt-4 max-w-[34ch]">
              Dan is dit niet je pagina, en dat zeggen we liever nu.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Opvlammingen na warmte of wijn, een branderig gevoel, bultjes
              zonder mee-eters: dat wijst op rosacea. Daar hoort een ander
              gesprek bij, en soms een arts.
            </p>
            <div className="mt-7">
              <Button href="/huidproblemen/rosacea" variant="primair-op-donker">
                Naar de rosaceapagina
              </Button>
            </div>
          </div>
        </div>
      </section>

      <WelNiet
        wel={COUPEROSE_WEL_NIET.wel}
        niet={COUPEROSE_WEL_NIET.niet}
        intro="Bij couperose is de lijst korter dan bij de meeste huidproblemen, en dat is geen bescheidenheid. Er is één ding dat werkt op een vaatje dat al zichtbaar is, en er is veel dat er niets aan doet."
      />

      <WijZeggenNee
        kop="Twee keer nee,"
        accent="en allebei om dezelfde reden."
        intro="Licht op de verkeerde huid of op het verkeerde moment maakt roodheid erger. Dat is precies wat je hier niet komt halen."
        punten={COUPEROSE_WIJ_DOEN_NIET}
      />

      <NulmetingAssen
        kop="Vaatjes zijn te tellen."
        alineas={[
          "Dat klinkt klein, maar het is de reden dat je bij dit huidprobleem niet hoeft te geloven dat het werkte. De Eve-M legt de vaatstructuur vast onder vast licht, vóór de eerste sessie.",
          "Na de reeks leggen we de twee beelden naast elkaar. Zie je zelf geen verschil, dan is dat het antwoord en gaan we niet door omdat er nog sessies in een pakket zaten.",
        ]}
        assen={[
          [
            "Vaatstructuur",
            "Hoeveel zichtbare lijntjes er zijn en hoe ze lopen",
          ],
          ["Roodheid", "De basiskleur van de huid, los van de losse vaatjes"],
          [
            "Gevoeligheid",
            "Hoe snel je huid reageert, want dat bepaalt de instelling",
          ],
        ]}
      />

      <PillarFaq items={COUPEROSE_FAQ} />

      <PillarCta
        kop="Eerst tellen."
        accent="Dan pas licht."
        tekst="Behandeling Nul legt vast wat er nu zichtbaar is. Daarna weet je hoeveel sessies er nodig zijn, en wij ook."
        topic="couperose"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
