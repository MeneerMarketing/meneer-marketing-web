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
import { VerstoptePorie } from "@/components/ui/HuidIcon";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  KORRELCHECK_STAPPEN,
  ONZUIVER_FAQ,
  ONZUIVER_WEL_NIET,
  PORIE_BEELDEN,
} from "@/data/onzuivere-huid";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Onzuivere huid — de pagina die eerst uitlegt dat de meeste 'mee-eters' op je neus geen mee-eters zijn.
 *
 * De achtergrond bij de inhoud staat in `src/data/onzuivere-huid.ts`.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/onzuivere-huid",
  titel: "Onzuivere huid en mee-eters",
  omschrijving:
    "Mee-eters en verstopte poriën behandelen met HydraFacial en peelings. Het verschil tussen normale porie-inhoud en echte mee-eters.",
});

const PAD = "/huidproblemen/onzuivere-huid";

const ANKERS = [
  { id: "check", label: "In het consult" },
  { id: "welke", label: "Wat heb je" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "vragen", label: "Vragen" },
] as const;

const SOORTEN: readonly SoortOptie[] = PORIE_BEELDEN.map((o) => ({
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
      ? "Hier valt iets te doen"
      : "Hier begint het ergens anders",
    tekst: o.binnenBereik
      ? "Een porie die is volgelopen en dicht is gebleven of verkleurd. Dat is te ontlasten, in stappen die je huid aankan."
      : "Dit is normale huid, of het gaat al over acne. In het eerste geval valt er niets te behandelen; in het tweede hoort er een ander traject bij.",
  },
}));

export default function Pagina() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Onzuivere huid", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Onzuivere huid</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Mee-eters en
              <br />
              <span className="diba-accent">een onzuivere huid</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Mee-eters en verstopte poriën behandelen we met een HydraFacial,
              peelings en gerichte verzorging. Zo maken we de poriën leeg en
              houden we ze rustiger.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              In de intake kijken we mee onder vergroting en stellen we vast om
              welk type onzuiverheid het gaat.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="/intake">Plan een huidconsult</Button>
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
              src="/images/shoot/beh-hydrafacial.jpg"
              alt="HydraFacial-behandeling in de behandelkamer"
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
            icoon={VerstoptePorie}
            label="In het consult"
            raster="gelijk"
            kop="Waar we"
            accent="naar kijken"
            intro="De huidtherapeut kijkt onder vergroting naar je poriën en beoordeelt of het om normale porie-inhoud gaat of om echte mee-eters."
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {KORRELCHECK_STAPPEN.map((stap) => (
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
        </div>
      </section>

      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vier beelden"
            kop="Wat er in een porie"
            accent="kan zitten"
            intro="Verstopte poriën, mee-eters en onzuiverheden lopen in de volksmond door elkaar. Het verschil bepaalt welke behandeling werkt."
          />
          <SoortKiezer
            opties={SOORTEN}
            ctaHrefPatroon="/intake?topic=onzuivere-huid&beeld={id}"
            ctaLabel="Laat dit bekijken"
            hint="Twijfel je tussen twee? Dan kijken we samen."
          />

          {/* Het doorverwijsblok hoort hier en niet onderaan: wie na de beelden doorheeft
              dat hij op de verkeerde pagina is, moet weg kunnen zonder eerst de rest te
              lezen die dan niet over hem gaat. */}
          <div className="mt-10 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
            <Label opDonker>Komen er ontstoken plekken bij?</Label>
            <p className="diba-card-title-lg mt-4 max-w-[36ch]">
              Dan gaat het niet meer om onzuiverheden.
            </p>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Regelmatig rode, pijnlijke puistjes die vlekjes achterlaten is
              acne, en dat vraagt om een andere aanpak en een andere volgorde
              dan het ontlasten van poriën.
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
        wel={ONZUIVER_WEL_NIET.wel}
        niet={ONZUIVER_WEL_NIET.niet}
        intro="De winst zit hier vaker in wat je stopt dan in wat je erbij doet. Strenger reinigen levert bij een verstopte porie meestal niets op."
      />

      <PillarFaq items={ONZUIVER_FAQ} onderwerp="een onzuivere huid" />

      <PillarCta
        kop="Plan een intake"
        accent="bij Diba Clinics"
        tekst="In het huidconsult kijken we onder vergroting mee. Blijkt het grotendeels normale porie-inhoud, dan hoor je dat, en dan is er niets te boeken."
        topic="onzuivere-huid"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
