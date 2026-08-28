import type { Metadata } from "next";
import Link from "next/link";
import Krabcirkel from "@/components/eczeem/Krabcirkel";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarFaq,
  SectieKop,
  WelNiet,
  WijZeggenNee,
} from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  ECZEEM_FAQ,
  ECZEEM_WEL_NIET,
  ECZEEM_WIJ_DOEN_NIET,
  VERWAR_NIET,
} from "@/data/eczeem";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";

/**
 * Eczeem — twaalfde eigen pagina, en de tweede zonder afspraakknop.
 *
 * Eczeem is een aandoening met een medische behandeling en die hoort bij de huisarts of
 * de dermatoloog. Net als bij moedervlekken staat er daarom geen PillarCta, geen
 * NulmetingAssen en geen link naar /intake in de pagina zelf.
 *
 * Het verschil met de moedervlekkenpagina is dat er hier wél één punt is waar wij iets
 * kunnen: de barrière ondersteunen. Dat staat in de cirkel op zijn plek en niet groter
 * dan het is, tussen de drie punten waar wij het niet zijn.
 *
 * Eén donkergroen vlak (§5 staat er twee toe; het tweede is normaal de intake).
 *
 * MEDISCH: alles op deze pagina langs Rojda voordat het online mag.
 */

export const metadata: Metadata = {
  title: "Eczeem: een cirkel, geen plek",
};

const PAD = "/huidproblemen/eczeem";

const ANKERS = [
  { id: "cirkel", label: "De krabcirkel" },
  { id: "verwar", label: "Of is het iets anders" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waarom niet bij ons" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function EczeemPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Eczeem", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Eczeem</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Geen plek.
              <br />
              <span className="diba-accent">Een cirkel.</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Jeuk geeft krabben, krabben breekt je barrière, een kapotte
              barrière laat meer prikkels door, en die geven weer jeuk. Wie
              alleen naar de plek kijkt, behandelt één punt van een lus die
              daarna gewoon doordraait.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Eczeem hoort bij je huisarts. Wij kunnen op één punt van die
              cirkel iets betekenen, en het is eerlijker om te laten zien welk
              punt dat is dan om te doen alsof we de rest ook kunnen.
            </p>

            <div className="mt-9">
              <Button href="#cirkel">Bekijk de cirkel</Button>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-10">
            <Label opDonker>Het korte antwoord</Label>
            <p className="diba-card-title-lg mt-5">
              Jeuk die je uit je slaap houdt, kloofjes, of plekken die steeds
              terugkomen op dezelfde plaats: dat is een reden voor de huisarts.
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--on-dark-body)]">
              Er bestaat behandeling voor, en die begint daar. Hoe langer de
              cirkel draait, hoe moeilijker hij te doorbreken is.
            </p>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      <PillarNav ankers={ANKERS} />

      {/* ── De krabcirkel: de uitblinker ── */}
      <section
        id="cirkel"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De krabcirkel"
            kop="Vier schakels,"
            accent="vier manieren om te breken."
            intro="Elk punt in deze lus houdt de volgende in stand. Tik ze aan en kijk wie hem kan doorbreken. Bij drie van de vier zijn wij dat niet."
          />
          <Krabcirkel />
        </div>
      </section>

      {/* ── Of is het iets anders ── */}
      <section
        id="verwar"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Of is het iets anders"
            kop="Drie dingen die"
            accent="hierop lijken."
            intro="Eczeem wordt vaak gebruikt als verzamelnaam voor alles wat rood en schilferig is. Deze drie zien er verwant uit en vragen alle drie iets anders."
          />

          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] md:grid-cols-3">
            {VERWAR_NIET.map((v) => (
              <li key={v.naam} className="flex flex-col bg-white p-6 sm:p-8">
                <h3 className="diba-card-title">{v.naam}</h3>
                <p className="mt-3 grow text-[15px] leading-7 text-[var(--t-body)]">
                  {v.verschil}
                </p>
                <Link
                  href={v.pad}
                  className="diba-label mt-5 text-[var(--g-700)] underline underline-offset-4"
                >
                  {v.link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WelNiet
        wel={ECZEEM_WEL_NIET.wel}
        niet={ECZEEM_WEL_NIET.niet}
        intro="Het eerste kruisje rechts kost de meeste tijd: wachten met de huisarts omdat je eerst zelf iets wilt proberen."
      />

      <WijZeggenNee
        kop="Wij behandelen"
        accent="geen eczeem."
        intro="Dit is geen aandoening waar een huidkliniek over gaat. We kunnen de barrière ondersteunen als het rustig is, en dat is ook alles. De rest hoort bij een arts."
        punten={ECZEEM_WIJ_DOEN_NIET}
      />

      <PillarFaq items={ECZEEM_FAQ} onderwerp="eczeem" />

      {/* ── Afsluiting zonder afspraakknop ── */}
      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-050)] px-7 py-14 sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto">
          <Label>Waar je wel heen gaat</Label>
          <h2 className="diba-display-s mt-5 max-w-[22ch]">
            Naar je huisarts.
            <br />
            <span className="diba-accent">Wij zijn hooguit een schakel.</span>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Er staat op deze pagina bewust geen knop om bij ons een afspraak te
            maken. Heb je naast eczeem iets anders waar je wél iets aan wilt
            doen, en is je huid op dat moment rustig, dan kijken we graag mee.
            Anders sturen we je door.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <Link
              href="/huidproblemen/droge-huid"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Misschien is het een droge huid
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
