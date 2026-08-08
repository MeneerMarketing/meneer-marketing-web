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
import DrieKnoppen from "@/components/porien/DrieKnoppen";
import Button from "@/components/ui/Button";
import ProofBar from "@/components/ui/ProofBar";
import { FIGMA_INTENT_ACNE } from "@/data/figma-home-images";
import {
  PORIEN_FAQ,
  PORIEN_SOORTEN,
  PORIEN_WEL_NIET,
  PORIEN_WIJ_DOEN_NIET,
} from "@/data/porien";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Poriën — zesde eigen pagina, met de kortste en scherpste boodschap van allemaal.
 *
 * De kernvraag verschilt per pagina. Acne: waar. Pigment: wanneer in het jaar. Rosacea:
 * wat zet het aan. Littekens: hoe oud is het. Veroudering: tijd of zon. Hier: wat kun je
 * eigenlijk veranderen, en het eerlijke antwoord begint met wat niet.
 *
 * Dit is de enige pagina waarop de hele belofte van de concurrentie onjuist is. "Poriën
 * verkleinen" staat op tientallen kliniekwebsites en het kan niet. Daarom staat het
 * argument hier in de bediening en niet in een alinea: de vierde schakelaar doet het niet.
 *
 * Twee donkergroene vlakken, niet meer (§5). Staat op noindex tot Rojda en de prijzen.
 */

export const metadata: Metadata = {
  title: "Poriën: wat er wel en niet aan te doen is",
  ...NOG_IN_AANBOUW,
};

const PAD = "/huidproblemen/porien";

const ANKERS = [
  { id: "knoppen", label: "Wat kun je veranderen" },
  { id: "welke", label: "Wat je ziet" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = PORIEN_SOORTEN.map((s) => ({
  id: s.id,
  naam: s.naam,
  klanttaal: s.klanttaal,
  vakterm: s.vakterm,
  velden: [
    ["Wat je ziet", s.watJeZiet],
    ["Wat het betekent", s.watHetBetekent],
    ["Wat wij doen", s.aanpak],
  ] as const,
  uitgelicht: {
    label: "Wat mensen hier vaak verkeerd hebben",
    tekst: s.verwarring,
  },
}));

export default function PorienPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Poriën", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Poriën</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Kleiner maken
              <br />
              <span className="diba-accent">kan niet.</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              De doorsnede van een porie ligt vast in je aanleg. Wij beloven dus
              niet dat ze kleiner worden, want dat kan niemand waarmaken. Dat is
              meteen het meest gestelde ding op deze pagina uit de weg.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Er zijn wel drie dingen die je echt kunt veranderen, en samen
              schelen die zoveel dat de meeste mensen denken dat hun poriën
              kleiner zijn geworden. Hieronder mag je ze zelf aanzetten.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#knoppen">Zet de drie knoppen aan</Button>
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

          {/* Leent het acnebeeld: poriën en comedonen liggen dicht bij elkaar en er is
              nog geen eigen shoot voor dit onderwerp. Vervangen zodra die er is. */}
          <div className="relative min-h-[300px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-200)] lg:min-h-[460px]">
            <Image
              src={FIGMA_INTENT_ACNE.src}
              alt={FIGMA_INTENT_ACNE.alt}
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

      {/* ── De drie knoppen: de uitblinker ─────────────────────────────── */}
      <section
        id="knoppen"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Drie knoppen"
            kop="Zet ze aan"
            accent="en kijk wat er gebeurt."
            intro="Drie dingen bepalen hoe zichtbaar een porie is, en die kun je alle drie beïnvloeden. Er is ook een vierde knop. Die doet het niet, en dat is geen storing."
          />
          <DrieKnoppen />
        </div>
      </section>

      {/* ── Wat je ziet ────────────────────────────────────────────────── */}
      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Herkenning"
            kop="Vier beelden,"
            accent="en één is geen porie."
            intro="Het vierde beeld is het meest gemaakte misverstand van deze pagina en het kost mensen sessies aan de verkeerde behandeling. Kies wat het dichtst bij jou komt."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=porien&beeld={id}"
            ctaLabel="Laat dit beeld bekijken"
            hint="Twijfel je? Dan kijken we er samen naar."
          />

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--r-md)] bg-white p-6">
            <p className="max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
              Heb je er ook rode, ontstoken plekjes bij? Dan begint het verhaal
              daar, want werken aan poriën in een ontstoken huid is dweilen met
              de kraan open.
            </p>
            <Link
              href="/huidproblemen/acne"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Naar de acnepagina
            </Link>
          </div>
        </div>
      </section>

      <WelNiet
        wel={PORIEN_WEL_NIET.wel}
        niet={PORIEN_WEL_NIET.niet}
        intro="Vier van de vijf kruisjes rechts zijn dingen die mensen thuis doen in de overtuiging dat ze helpen. Ze kosten niets om te laten en dat is de goedkoopste winst op deze pagina."
      />

      <WijZeggenNee
        kop="Wij beloven"
        accent="geen kleinere poriën."
        intro="Dat staat nergens op deze site en het zal er ook niet komen. Wat we wel beloven is dat ze minder opvallen, en dat kunnen we naast elkaar leggen onder hetzelfde licht."
        punten={PORIEN_WIJ_DOEN_NIET}
      />

      <NulmetingAssen
        kop="Onder hetzelfde licht, of het zegt niets."
        alineas={[
          "Poriën zijn het gevoeligst van alle onderwerpen voor hoe je ernaar kijkt. In strijklicht en van dichtbij ziet iedereen ze, in gewoon daglicht bijna niemand. Zonder vaste opstelling meet je dus vooral je lamp.",
          "Daarom leggen we ze vast onder dezelfde belichting en op dezelfde afstand. Dan is een verschil later echt een verschil en geen ander moment van de dag.",
        ]}
        assen={[
          ["Zichtbaarheid", "Hoe sterk de openingen afsteken onder vast licht"],
          ["Vulling", "Hoeveel poriën een donkere kern hebben"],
          ["Glans", "Hoeveel het oppervlak weerkaatst"],
        ]}
      />

      <PillarFaq items={PORIEN_FAQ} />

      <PillarCta
        kop="Minder zichtbaar"
        accent="is wel te doen."
        tekst="We kijken onder vast licht waar je naar kijkt, of het poriën zijn of iets anders, en wat er in jouw geval realistisch aan te veranderen valt."
        topic="porien"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
