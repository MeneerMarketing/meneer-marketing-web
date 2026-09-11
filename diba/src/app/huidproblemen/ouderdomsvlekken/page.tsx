import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BehandelingenBijProbleem from "@/components/pillar/BehandelingenBijProbleem";
import PillarNav from "@/components/pillar/PillarNav";
import {
  HuidanalyseAssen,
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import SoortKiezer, { type SoortOptie } from "@/components/pillar/SoortKiezer";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { publicCopy, zonderVlaggen } from "@/lib/copy-flags";
import {
  OUDERDOMSVLEKKEN_FAQ,
  OUDERDOMSVLEKKEN_WEL_NIET,
  PIGMENT_BEELDEN,
  VERANDERCHECK_STAPPEN,
} from "@/data/ouderdomsvlekken";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";
import LeesVerder from "@/components/ui/LeesVerder";

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

      {/* Donkergroen, zoals elke andere hoofdingang van de site (Yasin, 11 september
          2026). */}
      <section className="bg-[var(--g-700)] text-[var(--on-dark)]">
        {/* Op een telefoon plakte het beeld tegen de onderrand van het groene vlak: de
            tekstkolom bracht zijn eigen onderruimte mee, de beeldkolom niet (Yasin, 11
            september 2026). Vanaf 1024 staan ze naast elkaar en geldt het niet. */}
        <div className="mx-auto grid gap-6 px-5 pb-10 sm:px-9 sm:pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10 lg:px-[7.5vw] lg:pb-0">
          <div className="py-10 sm:py-14 lg:py-20 max-lg:pb-0">
            <nav
              aria-label="Kruimelpad"
              className="diba-label diba-label-on-dark flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/huidproblemen" className="hover:text-white">
                Huidproblemen
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--on-dark-body)]">
                Ouderdomsvlekken
              </span>
            </nav>

            <h1 className="diba-display-l mt-6 text-[var(--on-dark)]">
              Ouderdomsvlekken
              <br />
              <span className="diba-accent-on-dark">behandelen</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Ouderdomsvlekken en zonnevlekken zijn onschuldig en goed te
              behandelen. We halen ze weg met IPL of laser, en meestal zijn er
              een of twee sessies nodig.
            </p>
            <LeesVerder opDonker>
              <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                De behandelaar beoordeelt eerst elke plek. Verandert er iets aan
                de vorm of de kleur, dan gaat die eerst langs je huisarts.
              </p>
            </LeesVerder>

            <div className="diba-knoprij mt-9">
              <Button variant="primair-op-donker" href="#welke">
                Kijk wat jij hebt
              </Button>
              <Button
                href={DIBA_WHATSAPP_URL}
                variant="secundair-op-donker"
                target="_blank"
                rel="noopener noreferrer"
                kort="Stel een vraag"
              >
                Liever eerst een vraag stellen
              </Button>
            </div>
          </div>

          <div className="relative min-h-[220px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-200)] sm:min-h-[300px] lg:min-h-[460px]">
            <Image
              /* Rojda, 7 september 2026: hier een foto van een peeling, want dat is
                 wat er bij ouderdomsvlekken meestal gebeurt. */
              src="/images/shoot/beh-peeling.jpg"
              alt="Een peeling wordt met een wattenstaafje op het voorhoofd aangebracht"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <PillarNav ankers={ANKERS} />

      {/* ── De verandercheck ── */}
      <section
        id="check"
        className="bg-[var(--g-025)] scroll-mt-[var(--anker-offset)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="In het consult"
            raster="gelijk"
            kop="Waar we"
            accent="naar kijken"
            intro="De behandelaar beoordeelt vorm, rand en kleur, en legt de plek vast in beeld. Zo is later te zien of er iets is veranderd."
          />

          <ol className="mt-8 sm:mt-12 grid gap-5 lg:grid-cols-3">
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
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vier beelden"
            kop="Vier soorten"
            accent="bruine vlekken"
            intro="Vier soorten bruine vlekken die op elkaar lijken. Verandert er iets aan een plek, dan gaat die eerst langs je huisarts."
          />
          <SoortKiezer
            opties={zonderVlaggen(SOORTEN)}
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

      <HuidanalyseAssen
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

      {/* Welke behandelingen bij deze klacht horen, en op welk apparaat ze
          draaien. Leeg als er niets gekoppeld is; zie het component. */}
      <BehandelingenBijProbleem pad="/huidproblemen/ouderdomsvlekken" />

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
