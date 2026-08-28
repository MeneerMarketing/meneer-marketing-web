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
import { HuidStrakker } from "@/components/ui/HuidIcon";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  VERSLAPPING_BEELDEN,
  VERSLAPPING_FAQ,
  VERSLAPPING_WEL_NIET,
  VERSLAPPING_WIJ_DOEN_NIET,
  ZWAARTEKRACHT_STAPPEN,
} from "@/data/huidverslapping";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Huidverslapping — de pagina die de grens met chirurgie benoemt in plaats van hem te verzwijgen.
 *
 * De achtergrond bij de inhoud staat in `src/data/huidverslapping.ts`.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda.
 */

export const metadata: Metadata = {
  title: "Huidverslapping behandelen in Rotterdam",
  description:
    "Wat je liggend ziet is de bovengrens van wat aanspannen kan bereiken. Met de zwaartekrachttest weet je vooraf of een behandeling bij jou iets oplevert.",
};

const PAD = "/huidproblemen/huidverslapping";

const ANKERS = [
  { id: "test", label: "De zwaartekrachttest" },
  { id: "welke", label: "Welk stadium" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = VERSLAPPING_BEELDEN.map((o) => ({
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
    label: o.binnenBereik ? "Hier zijn wij aan zet" : "Hier zijn wij het niet",
    tekst: o.binnenBereik
      ? "Er is nog structuur om op voort te bouwen. Reken op een reeks over maanden, en op scherper in plaats van strak."
      : "Dit gaat over volume of over weefsel dat verwijderd moet worden, en dat is niet wat een apparaat doet. Wij verwijzen dan door.",
  },
}));

export default function Pagina() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Huidverslapping", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Huidverslapping</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Ga even liggen.
              <br />
              <span className="diba-accent">Dat is je bovengrens.</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Verslapping is het enige huidprobleem dat verandert met de stand
              van je hoofd. Wat er liggend strakker uitziet, is wat de
              zwaartekracht overdag naar beneden trekt, en daarmee ongeveer het
              maximum van wat aanspannen kan bereiken.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Dat is in twee richtingen eerlijk: het temt te hoge verwachtingen,
              en het laat zien wanneer er wel degelijk iets te winnen valt.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#test">Doe de zwaartekrachttest</Button>
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
              src="/images/shoot/beh-fotona.jpg"
              alt="Fotona-laserbehandeling in de behandelkamer, met oogbescherming"
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

      <section
        id="test"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            icoon={HuidStrakker}
            label="De zwaartekrachttest"
            raster="gelijk"
            kop="Staand, liggend,"
            accent="en dan het verschil."
            intro="Geen diagnose, wel de eerlijkste voorspelling die er bestaat. Verder terug dan liggend gaat aanspannen niet, dus wat je daar ziet is de bovenkant van wat er mogelijk is."
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {ZWAARTEKRACHT_STAPPEN.map((stap, i) => (
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
        </div>
      </section>

      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vier stadia"
            kop="Bij twee valt er iets te winnen,"
            accent="bij twee ligt het elders."
            intro="Verslapping, volumeverlies en losgelaten huid worden door elkaar gehaald en vragen om drie verschillende dingen. Alleen het eerste is ons vak."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=huidverslapping&beeld={id}"
            ctaLabel="Laat dit bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />

          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>Zit je vooral met lijnen?</Label>
            <p className="diba-card-title-lg mt-4 max-w-[36ch]">
              Dan is verslapping niet je onderwerp.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Lijnen en verslapping komen samen voor maar zijn niet hetzelfde.
              Gaat het je om de lijnen zelf, dan begint het bij de beweegtest op
              de rimpelpagina.
            </p>
            <div className="mt-7">
              <Button href="/huidproblemen/rimpels" variant="primair-op-donker">
                Naar rimpels en fijne lijntjes
              </Button>
            </div>
          </div>
        </div>
      </section>

      <WelNiet
        wel={VERSLAPPING_WEL_NIET.wel}
        niet={VERSLAPPING_WEL_NIET.niet}
        intro="Hier is geduld geen bijzaak. Collageen bouwt over maanden op, en dat is niet te versnellen door vaker te komen."
      />

      <WijZeggenNee
        kop="Twee keer nee,"
        accent="en de eerste is de duurste."
        intro="Iemand die een facelift zoekt een reeks van drie verkopen is het makkelijkste geld op deze hele site. Precies daarom staat het hier."
        punten={VERSLAPPING_WIJ_DOEN_NIET}
      />

      <NulmetingAssen
        kop="Maanden zie je niet in de spiegel."
        alineas={[
          "Verslapping verandert traag, en jij kijkt elke dag. Daardoor merk je vooruitgang net zo min op als achteruitgang. De EVE-M legt je huid vast onder vast licht en vanuit een vaste hoek, voordat de eerste sessie plaatsvindt.",
          "Dat werkt twee kanten op. Het maakt verschil aantoonbaar, en het maakt ook zichtbaar wanneer er weinig verandert. Dat laatste is een reden om te stoppen of iets anders te doen, en niet om door te gaan omdat er nog sessies in een pakket zaten.",
        ]}
        assen={[
          ["Elasticiteit", "Hoe snel de huid terugveert, en waar niet meer"],
          [
            "Contour",
            "De lijn langs kaak en hals, vastgelegd vanuit een vaste hoek",
          ],
          [
            "Textuur",
            "Het oppervlak, want dat verandert vaak eerder dan de vorm",
          ],
        ]}
      />

      <PillarFaq items={VERSLAPPING_FAQ} onderwerp="huidverslapping" />

      <PillarCta
        kop="Eerst liggen."
        accent="Dan pas plannen."
        tekst="In Behandeling Nul doen we de zwaartekrachttest samen en meten we wat er nu is. Blijkt er weinig te winnen, dan hoor je dat, en dan is dat het advies."
        topic="huidverslapping"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
