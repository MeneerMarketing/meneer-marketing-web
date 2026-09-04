import type { Metadata } from "next";
import Link from "next/link";
import BehandelingenBijProbleem from "@/components/pillar/BehandelingenBijProbleem";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  CELLULITIS_FAQ,
  CELLULITIS_MYTHES,
  CELLULITIS_WEL_NIET,
  CELLULITIS_FEITEN,
} from "@/data/cellulitis";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

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

export const metadata: Metadata = zoekmachineVelden({
  pad: "/huidproblemen/cellulitis",
  titel: "Cellulitis: geen vet, maar bouw",
  omschrijving:
    "Cellulitis behandelen met technieken die de doorbloeding en de stevigheid van het bindweefsel verbeteren. Wat er haalbaar is.",
});

const PAD = "/huidproblemen/cellulitis";

const ANKERS = [
  { id: "doorsnede", label: "Wat het echt is" },
  { id: "mythes", label: "Vier mythes" },
  { id: "wel-niet", label: "Wat helpt" },
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
              Waarom cellulitis
              <br />
              <span className="diba-accent">ontstaat</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Cellulitis ontstaat doordat de bindweefselschotjes onder je huid
              bij vrouwen overwegend rechtop staan. Hetzelfde vet geeft daardoor
              een patroon van kuiltjes in plaats van een glad oppervlak.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              We behandelen het met technieken die de doorbloeding en de
              stevigheid van het bindweefsel verbeteren. Tijdens de intake
              bespreken we wat er in jouw geval haalbaar is.
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
          {/* Hier stond een dwarsdoorsnede met twee tekeningen. Yasin, 5 september: te
              zweverig. Hij heeft gelijk dat het veel vraagt om een doorsnede te lezen voor
              een punt dat in een zin past.

              Dat punt blijft, want het is het interessantste van deze pagina: het zit niet
              in het vet maar in de richting van het bindweefsel eromheen. */}
          <SectieKop
            label="Wat het echt is"
            raster="gelijk"
            kop="Het zit niet in het vet"
            accent="maar in de verpakking"
            intro="Vier dingen die verklaren waarom het ontstaat, waarom mannen het zelden hebben en waar wel iets aan te doen valt."
          />

          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {CELLULITIS_FEITEN.map((f) => (
              <li
                key={f.kop}
                className="rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <h3 className="diba-card-title">{f.kop}</h3>
                {/* Zes regelhoogtes, zodat de vier kaarten in een rij gelijk blijven. */}
                <p className="mt-3 min-h-[6lh] text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(f.zin)}
                </p>
              </li>
            ))}
          </ul>
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
            kop="Vier"
            accent="misverstanden"
            intro="Alle vier vallen ze om zodra je weet dat cellulitis over de bouw van je onderhuid gaat en niet over je gewicht."
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
        intro="Cellulitis hangt samen met de bouw van je onderhuid. Dat het bij jou zichtbaar is, zegt niets over hoe je leeft."
      />

      {/* Welke behandelingen bij deze klacht horen, en op welk apparaat ze
          draaien. Leeg als er niets gekoppeld is; zie het component. */}
      <BehandelingenBijProbleem pad="/huidproblemen/cellulitis" />

      <PillarFaq items={CELLULITIS_FAQ} onderwerp="cellulitis" />

      {/* ── Afsluiting zonder afspraakknop ── */}
      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-050)] px-7 py-14 sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto">
          <Label>Wat we kunnen doen</Label>
          <h2 className="diba-display-s mt-5 max-w-[24ch]">
            Aan de huid <span className="diba-accent">eromheen</span>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            De kuiltjes zelf komen uit de bouw van je onderhuid. Aan de
            stevigheid en de doorbloeding van de huid erboven valt wel te
            werken, en dat maakt het beeld rustiger. Tijdens de intake bespreken
            we wat er in jouw geval haalbaar is.
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
