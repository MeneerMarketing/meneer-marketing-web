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
import { HuidGlans } from "@/components/ui/HuidIcon";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  DOF_BEELDEN,
  DOF_FAQ,
  DOF_WEL_NIET,
  DOF_WIJ_DOEN_NIET,
  LICHTTEST_STAPPEN,
} from "@/data/doffe-huid";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Doffe huid — een klacht zonder vakterm, met vier oorzaken en twee waar wij niets aan verkopen.
 *
 * De achtergrond bij de inhoud staat in `src/data/doffe-huid.ts`.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/doffe-huid",
  titel: "Doffe huid: waar komt die grauwe tint vandaan",
  omschrijving:
    "Dof is licht dat verstrooit in plaats van weerkaatst. Vier oorzaken, en bij twee ervan is de beste behandeling een gewoonte en geen afspraak.",
});

const PAD = "/huidproblemen/doffe-huid";

const ANKERS = [
  { id: "test", label: "De lichttest" },
  { id: "welke", label: "Waar komt het vandaan" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = DOF_BEELDEN.map((o) => ({
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
    label: o.binnenBereik ? "Hier kunnen wij iets" : "Hier verkopen wij niets",
    tekst: o.binnenBereik
      ? "Dit zit in de bovenste laag van je huid en is te beïnvloeden. Bij dofheid is het effect vaak al bij de eerste behandeling te zien."
      : "Dit vraagt om een ander traject of om een gewoonte. Een gezichtsbehandeling maskeert het hooguit een paar weken.",
  },
}));

export default function Pagina() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Doffe huid", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Doffe huid</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Een vale huid
              <br />
              <span className="diba-accent">zonder glans</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Er bestaat geen vakterm voor, en toch zie je het: een huid die het
              licht niet meer terugkaatst. Dat heeft vier verschillende
              oorzaken, en die vragen om vier verschillende dingen.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Bij twee ervan kunnen wij iets. Bij de andere twee is de beste
              behandeling een gewoonte, en dan zeggen we dat.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#test">Doe de lichttest</Button>
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
              src="/images/shoot/beh-oxygeneo.jpg"
              alt="Gezichtsbehandeling in de behandelkamer"
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
            icoon={HuidGlans}
            label="De lichttest"
            raster="gelijk"
            kop="Zo bekijk je"
            accent="je huid bij daglicht"
            intro="Dofheid is licht dat verstrooit in plaats van weerkaatst, en dat maak je met een lamp en een hoek zichtbaar. Niet in de badkamer: licht van boven maakt elke huid vlak en verstopt juist wat je wil zien."
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {LICHTTEST_STAPPEN.map((stap, i) => (
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
            label="Vier oorzaken"
            kop="Vier oorzaken van"
            accent="een doffe huid"
            intro="Dat laatste is geen afschuiven. Een behandeling die tegen je slaap en je gewoontes in moet werken is weggegooid geld, en dat hoor je liever nu dan na drie afspraken."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=doffe-huid&beeld={id}"
            ctaLabel="Laat dit bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />

          {/* Het doorverwijsblok hoort hier en niet onderaan: wie na de beelden doorheeft
              dat hij op de verkeerde pagina is, moet weg kunnen zonder eerst de rest te
              lezen die dan niet over hem gaat. */}
          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>Is het vooral ongelijke kleur?</Label>
            <p className="diba-card-title-lg mt-4 max-w-[36ch]">
              Dan is dofheid het gevolg en pigment de oorzaak.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Een ongelijke tint leest je oog als vermoeid, ook zonder dat er
              ergens een duidelijke vlek zit. Dat is met een gezichtsbehandeling
              niet op te lossen; daar hoort een pigmenttraject bij dat over
              maanden loopt.
            </p>
            <div className="mt-7">
              <Button
                href="/huidproblemen/pigmentvlekken"
                variant="primair-op-donker"
              >
                Naar pigmentvlekken
              </Button>
            </div>
          </div>
        </div>
      </section>

      <WelNiet
        wel={DOF_WEL_NIET.wel}
        niet={DOF_WEL_NIET.niet}
        intro="Bij dofheid is het effect vaak snel zichtbaar en ook weer tijdelijk. Dat is geen bezwaar zolang je het weet, en een probleem zodra iemand denkt een oorzaak af te kopen."
      />

      <WijZeggenNee
        kop="Wanneer we een behandeling"
        accent="afraden"
        intro="Het effect van een behandeling op dofheid zakt na verloop van tijd. Steeds dieper gaan omdat het vorige effect wegtrok, is de snelste route naar een geïrriteerde huid die juist doffer oogt."
        punten={DOF_WIJ_DOEN_NIET}
      />

      <NulmetingAssen
        kop="Glans is te meten."
        alineas={[
          "Dat klinkt vreemd bij een klacht die geen vakterm heeft, en het is waarom het hier nuttig is: dof is een indruk, en indrukken schuiven mee met je humeur en het licht in de kamer. De EVE-M legt vast hoe je huid het licht terugkaatst, onder vast licht en vanuit een vaste hoek.",
          "Daarmee is na een reeks te zien of er werkelijk iets is veranderd of dat je een goede week had. Bij dit huidprobleem is dat verschil groter dan bij welk ander ook.",
        ]}
        assen={[
          ["Textuur", "Hoe glad het oppervlak is, want daar begint de glans"],
          ["Vocht", "Wat de bovenste laag vasthoudt"],
          ["Gelijkmatigheid", "Hoe egaal de kleur is over het hele vlak"],
        ]}
      />

      <PillarFaq items={DOF_FAQ} onderwerp="een doffe huid" />

      <PillarCta
        kop="Uitzoeken welke van"
        accent="de vier het bij jou is"
        tekst="In Behandeling Nul zoeken we uit welke van de vier het bij jou is. Blijkt het vooral je nachten te zijn, dan hoor je dat, en dan is er niets te boeken."
        topic="doffe-huid"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
