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
  ACNE_LITTEKENS_FAQ,
  ACNE_LITTEKENS_WEL_NIET,
  ACNE_LITTEKENS_WIJ_DOEN_NIET,
  NA_ACNE_BEELDEN,
  VOLGORDE,
} from "@/data/acne-littekens";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Acnelittekens — de pagina die eerst vaststelt of je er wel een hebt.
 *
 * Waarom deze naast /huidproblemen/littekens en /huidproblemen/acne staat, en waarom de
 * triage de hele pagina is, staat in `src/data/acne-littekens.ts`.
 *
 * DE KAARTEN LATEN ZIEN WAT DE UITKOMST IS, VOORDAT JE LEEST.
 *
 * Drie van de vier beelden zijn geen litteken. Dat is het punt van de pagina en het hoort
 * dus zichtbaar te zijn zonder dat je vier keer een alinea uitleest: elke kaart draagt in
 * woorden of het littekenweefsel is of niet, en of het vanzelf weggaat.
 *
 * Wat er níét gebeurt is een score of een uitslag. De zelfcheck is een vinger en schuin
 * licht; dat brengt de meeste mensen bij de juiste kaart, en de rest komt uit de meting.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda.
 */

export const metadata: Metadata = {
  title: "Acnelittekens en acnevlekjes behandelen in Rotterdam",
  description:
    "Acnevlekjes zijn vaak geen litteken maar kleur. Met schuin licht stel je zelf vast of het een putje is, roodheid of pigment, en dat bepaalt wat helpt.",
};

const PAD = "/huidproblemen/acne-littekens";

const ANKERS = [
  { id: "welke", label: "Wat heb je" },
  { id: "volgorde", label: "De volgorde" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = NA_ACNE_BEELDEN.map((b) => ({
  id: b.id,
  naam: b.naam,
  klanttaal: b.klanttaal,
  vakterm: b.vakterm,
  velden: [
    ["Waar je het zelf aan herkent", b.zelfcheck],
    ["Wat het is", b.watHetIs],
    ["Gaat het vanzelf weg", b.vanzelf],
    ["Wat wij doen", b.watWijDoen],
  ] as const,
  uitgelicht: {
    label: b.echtLitteken ? "Dit is littekenweefsel" : "Dit is geen litteken",
    tekst: b.echtLitteken
      ? "Van de vier beelden op deze pagina is dit het enige waarbij er weefsel verloren is gegaan, en het enige waarbij afwachten niets oplevert."
      : "Er is geen weefsel verloren gegaan. Dat betekent een andere behandeling, en vaak een ander advies dan waar je voor kwam.",
  },
}));

export default function AcneLittekensPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Acnelittekens", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Acnelittekens</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Wat er na acne
              <br />
              <span className="diba-accent">op je huid achterblijft</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Wat er na de puistjes achterbleef heet acnelittekens of
              acnevlekjes, en meestal is het geen van beide letterlijk. Een rood
              vlekje, een bruine vlek en een kuiltje zien er op een foto bijna
              hetzelfde uit. Ze vragen om drie verschillende behandelingen, en
              twee ervan trekken deels vanzelf weg.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Met je vinger en licht van opzij kom je zelf een heel eind.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#welke">Kijk wat jij hebt</Button>
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
              src="/images/shoot/beh-skinpen.jpg"
              alt="Microneedlingbehandeling in de behandelkamer"
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

      {/* ── De triage ──────────────────────────────────────────────────── */}
      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vier beelden"
            raster="gelijk"
            kop="Vier beelden en"
            accent="wat elk ervan vraagt"
            intro="Dit is een herkenningshulp en geen diagnose; het echte antwoord komt uit de meting. Maar deze vier dekken vrijwel alles wat er na acne achterblijft, en bij drie ervan is ons advies iets anders dan waar je voor kwam."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=acne-littekens&beeld={id}"
            ctaLabel="Laat dit beeld bekijken"
            hint="Heb je er meerdere door elkaar? Dat is eerder regel dan uitzondering."
          />
        </div>
      </section>

      {/* ── De volgorde ────────────────────────────────────────────────── */}
      <section
        id="volgorde"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De volgorde"
            kop="De volgorde"
            accent="van behandelen"
            intro="Elke stap hieronder is onmogelijk zolang de vorige niet klaar is. Dat is de reden dat een goede littekenbehandeling zelden begint op de dag dat je binnenkomt."
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {VOLGORDE.map((stap, i) => (
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

          {/* Wie hier komt met een huid die nog actief is, hoort dat te lezen en dan
              door te kunnen naar de plek waar dat wordt behandeld. Niet pas na de rest
              van een pagina die dan nog niet over hem gaat. */}
          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>Komen er nog nieuwe puistjes bij?</Label>
            <p className="diba-card-title-lg mt-4 max-w-[36ch]">
              Dan begint het bij de acne en niet bij de littekens.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Behandelen wat er ligt terwijl de bron nog loopt is dweilen, en in
              een ontstoken huid maakt het de ontsteking bovendien erger.
            </p>
            <div className="mt-7">
              <Button href="/huidproblemen/acne" variant="primair-op-donker">
                Naar de acnepagina
              </Button>
            </div>
          </div>
        </div>
      </section>

      <WelNiet
        wel={ACNE_LITTEKENS_WEL_NIET.wel}
        niet={ACNE_LITTEKENS_WEL_NIET.niet}
        intro="Wat hier het meeste oplevert is vaak niet een behandeling maar de juiste volgorde, en weten wat je voor je hebt."
      />

      <WijZeggenNee
        kop="Wanneer we een behandeling"
        accent="afraden"
        intro="Dit zijn de twee momenten waarop we een traject afhouden dat je zelf wilde boeken. Liever dat, dan een reeks die niets doet of het erger maakt."
        punten={ACNE_LITTEKENS_WIJ_DOEN_NIET}
      />

      <NulmetingAssen
        kop="Putjes zie je alleen in zijlicht."
        alineas={[
          "Dat is de reden dat een foto van je telefoon hier niet volstaat en de spiegel in je badkamer ook niet: recht licht vult elk kuiltje op. De EVE-M legt je huid vast onder vast licht en vanuit een vaste hoek.",
          "Daarmee is het verschil later te zien in plaats van te geloven, en dat is bij dit huidprobleem extra belangrijk: het gaat om maanden, en je eigen gezicht zie je elke dag.",
        ]}
        assen={[
          ["Reliëf", "Waar de huid is ingezakt, en hoe diep"],
          ["Roodheid", "De vaatreactie die na een ontsteking achterblijft"],
          ["Pigment", "Bruine plekken, ook de vlekken die je nu nog niet ziet"],
        ]}
      />

      <PillarFaq items={ACNE_LITTEKENS_FAQ} onderwerp="acnelittekens" />

      <PillarCta
        kop="Plan een intake"
        accent="bij Diba Clinics"
        tekst="In Behandeling Nul stellen we vast of het littekenweefsel is of kleur. Soms is de uitkomst dat je een half jaar niets hoeft te doen, en dan zeggen we dat."
        topic="acne-littekens"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
