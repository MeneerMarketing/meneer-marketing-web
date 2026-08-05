import type { Metadata } from "next";
import Link from "next/link";
import Dieptemeter from "@/components/behandelingen/Dieptemeter";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { BEHANDELINGEN, HUIDLAGEN, diepte } from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";

/**
 * Het behandelingenoverzicht.
 *
 * Herbouwd. De vorige versie was een raster met kaarten waarop "[COPY-NODIG]" stond, onder
 * de kop "Alle behandelingen, openbaar". Openbaar zijn is geen prestatie als er niets te
 * lezen valt.
 *
 * Deze pagina is om één vraag heen gebouwd, net als de huidprobleempagina's:
 *
 *     Hoe diep komt deze behandeling, en wat kost dat aan hersteltijd?
 *
 * Dat is de enige vraag die de hele lijst tegelijk verklaart. Waarom een peeling
 * goedkoper is dan microneedling, waarom je van de een een dag rood bent, en waarom
 * dieper niet hetzelfde is als beter. Een lijst met vijf namen beantwoordt daar niets van;
 * een doorsnede van de huid beantwoordt het in één beeld.
 *
 * Twee donkergroene vlakken op deze pagina: het blok over kiezen en verder niets (§5).
 */

export const metadata: Metadata = {
  title: "Behandelingen",
  description:
    "Vijf behandelingen, geordend op hoe diep ze komen. Daar volgt de rest uit: de prijs, de hersteltijd en of het bij jouw huid past.",
};

const ANKERS = [
  { id: "diepte", label: "Hoe diep" },
  { id: "alles", label: "Alle vijf" },
  { id: "kiezen", label: "Kiezen" },
];

export default function BehandelingenPage() {
  const opDiepte = [...BEHANDELINGEN].sort((a, b) => diepte(a) - diepte(b));

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Behandelingen", url: `${DIBA_SITE_URL}/behandelingen` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1800px] px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <nav aria-label="Kruimelpad" className="diba-label flex flex-wrap gap-2">
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Behandelingen</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              Niet welke,
              <br />
              <span className="diba-accent">maar hoe diep.</span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Een lijst met behandelingen leest als een menukaart, en op een menukaart kies
              je wat het lekkerst klinkt. Maar het verschil tussen een peeling en
              microneedling is geen smaakverschil. Het is een verschil in welke laag van je
              huid je raakt.
            </p>

            <p className="mt-4 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Daar volgt de rest uit. Wat het kost, hoe lang je rood bent, hoe vaak je moet
              komen en of het kan wat je wil. Daarom staat die vraag hier bovenaan en niet
              in de kleine lettertjes.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] border border-[var(--g-100)] bg-white p-8 sm:p-10">
            <Label>Wat hier niet staat</Label>
            <p className="diba-card-title mt-4 text-[var(--t-strong)]">
              Welke de beste is
            </p>
            <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
              Die vraag heeft geen antwoord zonder je huid erbij. Dieper is niet beter,
              duurder is niet beter, en nieuwer al helemaal niet. Wat het wel is: passend
              of niet passend bij wat jij wil veranderen.
            </p>
            <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
              Wat er bij jou past hoor je in Behandeling Nul, na de meting. Soms is het
              antwoord dat geen van de vijf iets voor je doet.
            </p>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      <nav
        aria-label="Op deze pagina"
        className="sticky top-[var(--nav-h)] z-20 border-y border-[var(--g-100)] bg-[var(--g-010)]/95 backdrop-blur"
      >
        <ul className="mx-auto flex max-w-[1800px] gap-6 overflow-x-auto px-5 py-4 sm:px-9 lg:px-[7.5vw]">
          {ANKERS.map((a) => (
            <li key={a.id}>
              <a
                href={`#${a.id}`}
                className="diba-label whitespace-nowrap hover:text-[var(--g-700)]"
              >
                {a.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── De dieptemeter ── */}
      <section
        id="diepte"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
      >
        <div className="mx-auto max-w-[1800px]">
          <Label>Hoe diep komt het</Label>
          <h2 className="diba-display-m mt-4 max-w-[18ch]">
            Vier lagen,
            <br />
            <span className="diba-accent">en dat verklaart alles.</span>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Kies een behandeling en kijk waar hij aankomt. De hoornlaag herstelt in dagen,
            de lederhuid in weken. Dat verschil is niet alleen medisch: het is precies wat
            je terugziet in de prijs en in de tijd die je kwijt bent.
          </p>

          <Dieptemeter />
        </div>
      </section>

      {/* ── Alle vijf op een rij ── */}
      <section
        id="alles"
        className="scroll-mt-[var(--anker-offset)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
      >
        <div className="mx-auto max-w-[1800px]">
          <Label>Alle vijf</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Van de buitenkant
            <br />
            <span className="diba-accent">naar binnen.</span>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            In volgorde van hoe diep ze komen. De eerste raakt je huid niet eens, en dat is
            geen vergissing in de lijst maar het begin ervan.
          </p>

          <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {opDiepte.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/behandelingen/${b.slug}`}
                  className="flex h-full flex-col rounded-[var(--r-md)] bg-white p-7 transition-colors hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  <span className="diba-label text-[var(--t-muted)]">
                    {b.lagen.length === 0
                      ? "Raakt niets"
                      : `Tot in de ${HUIDLAGEN.find(
                          (l) => l.id === b.lagen[b.lagen.length - 1],
                        )?.naam.toLowerCase()}`}
                  </span>
                  <span className="diba-card-title mt-3 text-[var(--t-strong)]">
                    {b.naam}
                  </span>
                  <span className="mt-3 flex-1 text-[15px] leading-7 text-[var(--t-body)]">
                    {publicCopy(b.kort)}
                  </span>
                  <span className="mt-6 flex items-baseline justify-between gap-4 border-t border-[var(--g-100)] pt-4">
                    <span className="text-[13px] leading-5 text-[var(--t-muted)]">
                      {publicCopy(b.herstel)}
                    </span>
                    <span className="shrink-0 text-[15px] font-medium text-[var(--t-strong)] tabular-nums">
                      € {b.prijs}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Kiezen ── */}
      <section
        id="kiezen"
        className="scroll-mt-[var(--anker-offset)] px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-24"
      >
        <div className="mx-auto max-w-[1800px]">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <Label opDonker>Kiezen</Label>
            <h2 className="diba-display-m mt-4 max-w-[22ch]">
              Je kiest geen behandeling.
              <br />
              <span className="diba-accent-on-dark">Je kiest een doel.</span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Begin bij wat je wil veranderen en niet bij de techniek. Wie start bij de
              techniek komt uit bij waar het meest over geschreven is, en dat is zelden
              hetzelfde als wat bij jouw huid past.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/huidproblemen"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Begin bij je huidprobleem
              </Link>
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/50 px-6 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Of laat het eerst meten
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
