import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import SoortKiezer, { type SoortOptie } from "@/components/pillar/SoortKiezer";
import Button from "@/components/ui/Button";
import { Haarzakje } from "@/components/ui/HuidIcon";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  BULT_BEELDEN,
  HAARCHECK_STAPPEN,
  INGEGROEID_FAQ,
  INGEGROEID_WEL_NIET,
} from "@/data/ingegroeide-haren";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Ingegroeide haren — de kortste weg van een klacht naar laserontharing, met de eerlijkheid erbij dat het niet altijd de juiste weg is.
 *
 * De achtergrond bij de inhoud staat in `src/data/ingegroeide-haren.ts`.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/ingegroeide-haren",
  titel: "Ingegroeide haren behandelen in Rotterdam",
  omschrijving:
    "Zit er een haar in het bultje, of niet? Dat bepaalt of ontharen bij jou iets oplevert. Met fel licht en een spiegel kom je zelf een heel eind.",
});

const PAD = "/huidproblemen/ingegroeide-haren";

const ANKERS = [
  { id: "check", label: "De haarcheck" },
  { id: "welke", label: "Wat heb je" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = BULT_BEELDEN.map((o) => ({
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
      ? "Hier heeft ontharen zin"
      : "Hier verandert ontharen niets",
    tekst: o.binnenBereik
      ? "Er zit een haar bij betrokken, en dat is waar licht op mikt. Reken op een reeks en niet op een sessie."
      : "Er zit geen haar in, of de zone is nu ontstoken. Ontharen doet hier niets, en beginnen zou een reeks verkopen zonder resultaat zijn.",
  },
}));

export default function Pagina() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Ingegroeide haren", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Ingegroeide haren</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Ingegroeide haren
              <br />
              <span className="diba-accent">na scheren of harsen</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Bultjes in je nek, bikinilijn of benen lijken op elkaar en zijn
              het niet. Zit er een haar in, dan is ontharen de logische route:
              waar geen haar groeit kan ook niets ingroeien. Zit er geen haar
              in, dan verandert ontharen er niets aan.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Soms lost een andere scheertechniek het al op, en dat hoor je dan
              van ons. Blijft het terugkomen, dan haalt laserontharing de haar
              bij de wortel weg en houdt het op. Ook dat zeggen we, al kost het
              ons een klant.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#check">Doe de haarcheck</Button>
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
              src="/images/shoot/beh-xl-hair.jpg"
              alt="Laserontharing in de behandelkamer, met beschermbril"
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
        id="check"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            icoon={Haarzakje}
            label="De haarcheck"
            raster="gelijk"
            kop="Zo bekijk je"
            accent="een bultje van dichtbij"
            intro="Dit is een herkenningshulp en geen diagnose. Het brengt je wel bij het onderscheid dat alles bepaalt, en het kost je een lamp en een spiegel."
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {HAARCHECK_STAPPEN.map((stap, i) => (
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
            label="Vier bultjes"
            kop="Vier soorten bultjes"
            accent="na het scheren"
            intro="Nek, bikinilijn, benen en kaaklijn zijn de zones waar deze vier allemaal voorkomen. Twee ervan hebben baat bij ontharen en twee niet."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=ingegroeide-haren&beeld={id}"
            ctaLabel="Laat dit bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />

          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>Zoek je vooral gladde benen?</Label>
            <p className="diba-card-title-lg mt-4 max-w-[36ch]">
              Dan begint het bij de behandeling en niet bij de klacht.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Gaat het je niet om de bultjes maar om het ontharen zelf, dan
              staan de zones, de tarieven en wat er per huidtype kan op de
              laserontharingspagina.
            </p>
            <div className="mt-7">
              <Button
                href="/behandelingen/laserontharing"
                variant="primair-op-donker"
              >
                Naar laserontharing
              </Button>
            </div>
          </div>
        </div>
      </section>

      <WelNiet
        wel={INGEGROEID_WEL_NIET.wel}
        niet={INGEGROEID_WEL_NIET.niet}
        intro="De winst zit hier vaker in wat je stopt dan in wat je erbij doet. Strak scheren, pincetten en scrubben houden het probleem in stand."
      />

      <PillarFaq items={INGEGROEID_FAQ} onderwerp="ingegroeide haren" />

      <PillarCta
        kop="Plan een intake"
        accent="bij Diba Clinics"
        tekst="In het eerste gesprek stellen we vast of er haren bij betrokken zijn en of jouw huidtype en haarkleur geschikt zijn. Zo niet, dan hoor je dat voordat je iets afspreekt."
        topic="ingegroeide-haren"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
