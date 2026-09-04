import type { Metadata } from "next";
import Link from "next/link";
import BehandelingenBijProbleem from "@/components/pillar/BehandelingenBijProbleem";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import Silhouet from "@/components/psoriasis/Silhouet";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { PSORIASIS_FAQ, PSORIASIS_WEL_NIET } from "@/data/psoriasis";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

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

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/psoriasis",
  titel: "Psoriasis: meer dan huid",
  omschrijving:
    "Psoriasis komt uit je afweersysteem. Wat je huisarts doet, en wat wij daarnaast aan je huidbarrière kunnen doen.",
});

const PAD = "/huidproblemen/psoriasis";

const ANKERS = [
  { id: "silhouet", label: "Waar het zit" },
  { id: "wel-niet", label: "Wat helpt" },
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
              Psoriasis en <span className="diba-accent">je huid</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Psoriasis is een aandoening van je afweersysteem die zich in de
              huid laat zien. De behandeling loopt via je huisarts of
              dermatoloog, en wij werken daarnaast aan je huidbarrière.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Ook je nagels en gewrichten kunnen meedoen. Vooral bij gewrichten
              is het belangrijk dat er op tijd naar gekeken wordt.
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
            kop="Vier"
            accent="plekken"
            intro="Ze spelen niet altijd tegelijk op maar horen wel bij elkaar. Nagels en gewrichten worden het vaakst voor iets anders aangezien."
          />
          <Silhouet />
        </div>
      </section>

      <WelNiet
        wel={PSORIASIS_WEL_NIET.wel}
        niet={PSORIASIS_WEL_NIET.niet}
        intro="Gewrichtsklachten laat je op tijd beoordelen. Uitstel kost daar schade die niet meer terugkomt."
      />

      {/* Welke behandelingen bij deze klacht horen, en op welk apparaat ze
          draaien. Leeg als er niets gekoppeld is; zie het component. */}
      <BehandelingenBijProbleem pad="/huidproblemen/psoriasis" />

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
            Noem je nagels en je gewrichten in dat gesprek, ook als je er zelf
            weinig van merkt. Die twee worden het vaakst overgeslagen. Naast de
            behandeling van je arts werken wij aan je huidbarrière.
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
