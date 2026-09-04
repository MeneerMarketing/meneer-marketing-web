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
} from "@/components/pillar/PillarSecties";
import SoortKiezer, { type SoortOptie } from "@/components/pillar/SoortKiezer";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { publicCopy } from "@/lib/copy-flags";
import {
  OUDERDOMSVLEKKEN_FAQ,
  OUDERDOMSVLEKKEN_WEL_NIET,
  PIGMENT_BEELDEN,
  VERANDERCHECK_STAPPEN,
} from "@/data/ouderdomsvlekken";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/ouderdomsvlekken",
  titel: "Ouderdomsvlekken behandelen in Rotterdam",
  omschrijving:
    "Ouderdomsvlekken en zonnevlekken weghalen met IPL of laser, meestal in een of twee sessies.",
});

const PAD = "/huidproblemen/ouderdomsvlekken";

const ANKERS = [
  { id: "check", label: "De verandercheck" },
  { id: "welke", label: "Wat heb je" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = PIGMENT_BEELDEN.map((o) => ({
  id: o.id,
  naam: o.naam,
  klanttaal: o.klanttaal,
  vakterm: o.vakterm,
  velden: [
    ["Waar je het zelf aan herkent", o.zelfcheck],
    ["Wat het is", o.watHetIs],
    ["Wat wij doen", o.watWijDoen],
  ] as const,
  uitgelicht: {
    label: o.binnenBereik
      ? "Dit behandelen wij"
      : "Hier kijkt eerst iemand anders",
    tekst: o.binnenBereik
      ? "Een egale, platte vlek op een plek die veel zon heeft gehad. Dit is het beeld waar licht het meest oplevert."
      : "Dit is geen gewone zonnevlek. Behandelen zonder dat er eerst naar gekeken is, is hier precies wat er niet moet gebeuren.",
  },
}));

export default function Pagina() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Ouderdomsvlekken", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

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
              <span className="text-[var(--t-muted)]">Ouderdomsvlekken</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Ouderdomsvlekken
              <br />
              <span className="diba-accent">behandelen</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Ouderdomsvlekken en zonnevlekken zijn onschuldig en goed te
              behandelen. We halen ze weg met IPL of laser, en meestal zijn er
              een of twee sessies nodig.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              De behandelaar beoordeelt eerst elke plek. Verandert er iets aan
              de vorm of de kleur, dan gaat die eerst langs je huisarts.
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
              src="/images/shoot/intent-pigment.jpg"
              alt="Behandelaar beoordeelt pigment op de huid van een cliënt"
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

      {/* ── De verandercheck ── */}
      <section
        id="check"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="In het consult"
            raster="gelijk"
            kop="Waar we"
            accent="naar kijken"
            intro="De behandelaar beoordeelt vorm, rand en kleur, en legt de plek vast in beeld. Zo is later te zien of er iets is veranderd."
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {VERANDERCHECK_STAPPEN.map((stap) => (
              <li
                key={stap.kop}
                className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <h3 className="diba-card-title mt-3">{stap.kop}</h3>
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(stap.tekst)}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>Verandert de plek?</Label>
            <p className="diba-card-title-lg mt-4 max-w-[36ch]">
              Dan kijkt eerst een arts, en daarna behandelen wij.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Een rafelige rand, ongelijke kleur, groei of jeuk zijn redenen om
              het eerst te laten beoordelen. Is het goedaardig, dan halen we de
              plek daarna hier weg.
            </p>
            <div className="mt-7">
              <Button
                href="/huidproblemen/huidkanker-naevi"
                variant="primair-op-donker"
              >
                Naar de ABCDE-check
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vier beelden"
            kop="Vier soorten"
            accent="bruine vlekken"
            intro="Vier soorten bruine vlekken die op elkaar lijken. Verandert er iets aan een plek, dan gaat die eerst langs je huisarts."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=ouderdomsvlekken&beeld={id}"
            ctaLabel="Laat dit bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />
        </div>
      </section>

      <WelNiet
        wel={OUDERDOMSVLEKKEN_WEL_NIET.wel}
        niet={OUDERDOMSVLEKKEN_WEL_NIET.niet}
        intro="Bij pigment is zonbescherming geen advies achteraf maar onderdeel van de behandeling. Zonder dat komt het terug en is het geld weg."
      />

      <NulmetingAssen
        kop="Onder UV zie je wat er nog komt."
        alineas={[
          "Pigment begint dieper in de huid dan waar je het ziet. Onder UV-licht wordt zichtbaar wat er al ligt en aan de oppervlakte nog niet doorkomt, en dat is vaak meer dan mensen verwachten.",
          "Confronterend, en nuttig: het verklaart waarom er zonder zonbescherming steeds nieuwe vlekken bij lijken te komen. Ze kwamen er niet bij; ze waren er al.",
        ]}
        assen={[
          ["Zichtbaar pigment", "De vlekken zoals je ze nu in de spiegel ziet"],
          ["Onderliggend pigment", "Wat er dieper ligt en later doorkomt"],
          ["Zonschade", "Hoeveel de huid over de jaren te verwerken kreeg"],
        ]}
      />

      <PillarFaq items={OUDERDOMSVLEKKEN_FAQ} onderwerp="ouderdomsvlekken" />

      <PillarCta
        kop="Plan een intake"
        accent="bij Diba Clinics"
        tekst="In het huidconsult beoordelen we de plekken en meten we onder UV-licht ook het pigment dat je zelf nog niet ziet. Daarna weet je wat er kan en wat er eerst ergens anders hoort."
        topic="ouderdomsvlekken"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
