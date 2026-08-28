import type { Metadata } from "next";
import Link from "next/link";
import Dwarsdoorsnede from "@/components/cellulitis/Dwarsdoorsnede";
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
  CELLULITIS_FAQ,
  CELLULITIS_MYTHES,
  CELLULITIS_WEL_NIET,
  CELLULITIS_WIJ_DOEN_NIET,
} from "@/data/cellulitis";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";

/**
 * Cellulitis — vijftiende eigen pagina, en de vijfde zonder afspraakknop.
 *
 * Hier verkopen we niets, en dat is het punt. Cellulitis is geen vet en geen conditie maar
 * de richting van de bindweefselschotjes onder de huid. Dat ene feit verklaart waarom
 * slanke vrouwen het ook hebben, waarom sporten het patroon niet weghaalt en waarom mannen
 * er nauwelijks mee zitten.
 *
 * Deze pagina bestaat om te voorkomen dat iemand geld uitgeeft aan een belofte die niemand
 * kan waarmaken. Dat maakt hem waardevoller dan een pagina met een aanbod erop.
 *
 * Eén donkergroen vlak (§5 staat er twee toe; het tweede is normaal de intake).
 */

export const metadata: Metadata = {
  title: "Cellulitis: geen vet, maar bouw",
};

const PAD = "/huidproblemen/cellulitis";

const ANKERS = [
  { id: "doorsnede", label: "Wat het echt is" },
  { id: "mythes", label: "Vier mythes" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waarom niet bij ons" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function CellulitisPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Cellulitis", url: `${DIBA_SITE_URL}${PAD}` },
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
              <span className="text-[var(--t-muted)]">Cellulitis</span>
            </nav>

            <h1 className="diba-display-l mt-6">
              Het is geen vet.
              <br />
              <span className="diba-accent">Het is bouw.</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Onder je huid lopen bindweefselschotjes. Bij vrouwen staan die
              overwegend rechtop, bij mannen kruisen ze elkaar. Dat ene verschil
              bepaalt of hetzelfde vet een glad oppervlak geeft of een patroon
              van kuiltjes.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Daarmee valt alles op zijn plek: waarom slanke vrouwen het ook
              hebben, waarom sporten het niet weghaalt, en waarom niemand het
              kan verwijderen.
            </p>

            <div className="mt-9">
              <Button href="#doorsnede">Kijk onder de huid</Button>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-10">
            <Label opDonker>Meteen maar gezegd</Label>
            <p className="diba-card-title-lg mt-5">
              Wij behandelen dit niet. We hebben er geen behandeling voor en we
              gaan er ook geen bedenken.
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--on-dark-body)]">
              Omdat cellulitis door de bouw van het bindweefsel ontstaat, zijn
              de mogelijkheden van huidbehandelingen beperkt. We leggen daarom
              duidelijk uit wat wel en niet realistisch is.
            </p>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      <PillarNav ankers={ANKERS} />

      {/* ── De doorsnede: de uitblinker ── */}
      <section
        id="doorsnede"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De dwarsdoorsnede"
            // Twee gelijke helften eronder, dus de introzin volgt die indeling.
            raster="gelijk"
            kop="Zelfde vet,"
            accent="ander oppervlak."
            intro="Twee doorsnedes naast elkaar, met één schuif die er in allebei evenveel vet in stopt. Links staan de bindweefselschotjes rechtop, rechts kruisen ze. Kijk naar de bovenranden: dat is het oppervlak dat je in de spiegel ziet."
          />
          <Dwarsdoorsnede />
        </div>
      </section>

      {/* ── Mythes ── */}
      <section
        id="mythes"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vier mythes"
            kop="Vier dingen die"
            accent="je vast gehoord hebt."
            intro="Alle vier worden ze gebruikt om iets te verkopen, en alle vier vallen ze om zodra je weet dat het om de bouw gaat en niet om het vet."
          />

          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] md:grid-cols-2">
            {CELLULITIS_MYTHES.map((m) => (
              <li key={m.mythe} className="bg-white p-6 sm:p-8">
                <h3 className="diba-card-title text-[var(--t-muted)]">
                  {m.mythe}
                </h3>
                <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
                  {m.waarheid.replace(/\[[^\]]+\]/g, "").trim()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WelNiet
        wel={CELLULITIS_WEL_NIET.wel}
        niet={CELLULITIS_WEL_NIET.niet}
        intro="De laatste regel links is de enige op deze hele site die niet over je huid gaat, en misschien de belangrijkste van deze pagina."
      />

      <WijZeggenNee
        kop="Hier valt niets"
        accent="te verkopen."
        intro="Sommige behandelingen laten de huid tijdelijk strakker lijken doordat vocht of zwelling verandert. Dat is niet hetzelfde als een blijvende verandering van de kuiltjes."
        punten={CELLULITIS_WIJ_DOEN_NIET}
      />

      <PillarFaq items={CELLULITIS_FAQ} onderwerp="cellulitis" />

      {/* ── Afsluiting zonder afspraakknop ── */}
      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-050)] px-7 py-14 sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto">
          <Label>Wat er dan wel te doen valt</Label>
          <h2 className="diba-display-s mt-5 max-w-[24ch]">
            Niets, wat ons betreft.
            <br />
            <span className="diba-accent">En dat is geen slecht nieuws.</span>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Er staat op deze pagina geen knop om een afspraak te maken. Wil je
            wel iets aan de kwaliteit van je huid doen, dan is dat een andere
            vraag met een ander antwoord, en daar kijken we graag naar mee.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <Link
              href="/huidproblemen/littekens"
              className="diba-label text-[var(--g-700)] underline underline-offset-4"
            >
              Ik zoek eigenlijk iets over striae
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
