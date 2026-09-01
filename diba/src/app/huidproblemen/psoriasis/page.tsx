import type { Metadata } from "next";
import Link from "next/link";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarFaq,
  SectieKop,
  WelNiet,
  WijZeggenNee,
} from "@/components/pillar/PillarSecties";
import Silhouet from "@/components/psoriasis/Silhouet";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  PSORIASIS_FAQ,
  PSORIASIS_WEL_NIET,
  PSORIASIS_WIJ_DOEN_NIET,
} from "@/data/psoriasis";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";

/**
 * Psoriasis — dertiende eigen pagina, en de derde zonder afspraakknop.
 *
 * De boodschap is dat dit geen huidprobleem is maar een afweeraandoening die zich in de
 * huid laat zien. Dat verschil verklaart waarom een crème de plek aanpakt en niet de
 * oorzaak, en waarom nagels en gewrichten erbij horen.
 *
 * Dat laatste is de reden dat deze pagina bestaat en niet alleen een doorverwijzing is.
 * Gewrichtsklachten bij psoriasis zijn geen bijzaak: gewrichtsschade komt niet terug. Dat
 * is informatie die wij mogen geven en een behandeling niet.
 *
 * Eén donkergroen vlak (§5 staat er twee toe; het tweede is normaal de intake).
 *
 * MEDISCH: alles op deze pagina langs Rojda voordat het online mag.
 */

export const metadata: Metadata = {
  title: "Psoriasis: meer dan huid",
  description:
    "Psoriasis komt uit je afweersysteem en laat zich in de huid zien. Wat dat betekent voor de behandeling, en wat wij er wel en niet bij doen.",
};

const PAD = "/huidproblemen/psoriasis";

const ANKERS = [
  { id: "silhouet", label: "Waar het zit" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waarom niet bij ons" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function PsoriasisPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Psoriasis", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      {/* ── Hero ── */}
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
              <span className="text-[var(--t-muted)]">Psoriasis</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Psoriasis: rode plekken
              <br />
              <span className="diba-accent">met witte schilfers</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Psoriasis is een aandoening van je afweersysteem die zich in de
              huid laat zien. Dat verschil is niet academisch: het verklaart
              waarom een crème de plek aanpakt en niet de oorzaak.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Het verklaart ook waarom je nagels en je gewrichten erbij horen.
              Die worden het vaakst gemist, en bij gewrichten kost dat je iets
              dat niet terugkomt.
            </p>

            <div className="mt-9">
              <Button href="#silhouet">Bekijk waar het zit</Button>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-10">
            <Label opDonker>Waar je niet mee wacht</Label>
            <p className="diba-card-title-lg mt-5">
              Stijve gewrichten in de ochtend, gezwollen vingers of tenen, of
              rugpijn die beter wordt van bewegen. Noem dat bij je huisarts, ook
              als je huidplekken meevallen.
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--on-dark-body)]">
              Schade aan een gewricht is blijvend. Dit is het enige onderdeel
              waar op tijd zijn echt iets verandert.
            </p>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      <PillarNav ankers={ANKERS} />

      {/* ── Het silhouet: de uitblinker ── */}
      <section
        id="silhouet"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Meer dan huid"
            kop="Vier plekken,"
            accent="één aandoening."
            intro="Ze spelen niet altijd tegelijk op en ze horen wel bij elkaar. Twee ervan worden bijna altijd voor iets anders aangezien: nagels voor schimmel, en de hoofdhuid voor hardnekkige roos."
          />
          <Silhouet />
        </div>
      </section>

      <WelNiet
        wel={PSORIASIS_WEL_NIET.wel}
        niet={PSORIASIS_WEL_NIET.niet}
        intro="Het tweede vinkje links is de belangrijkste regel op deze pagina, en de enige waarbij uitstel je iets kost dat niet terugkomt."
      />

      <WijZeggenNee
        kop="Psoriasis begint"
        accent="in je afweersysteem"
        intro="Wij kunnen een plek verzachten en niets aan de oorzaak doen. Dan verkoop je sessies aan iets dat blijft terugkomen, en dat doen we niet."
        punten={PSORIASIS_WIJ_DOEN_NIET}
      />

      <PillarFaq items={PSORIASIS_FAQ} onderwerp="psoriasis" />

      {/* ── Afsluiting zonder afspraakknop ── */}
      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-050)] px-7 py-14 sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto">
          <Label>Waar je wel heen gaat</Label>
          <h2 className="diba-display-s mt-5 max-w-[22ch]">
            Wanneer je bij
            <br />
            <span className="diba-accent">de huisarts hoort</span>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Er staat op deze pagina geen knop om bij ons een afspraak te maken.
            Neem je nagels mee in dat gesprek en noem je gewrichten, ook als je
            er zelf weinig van vindt. Dat zijn de twee dingen die het vaakst
            worden overgeslagen.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <Link
              href="/huidproblemen/eczeem"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Misschien is het eczeem
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
