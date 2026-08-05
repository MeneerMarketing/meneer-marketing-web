import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  BEHANDELINGEN,
  HUIDLAGEN,
  behandelingVoorSlug,
  prijsTekst,
} from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SALONIZED_BOOKING_URL,
  DIBA_SITE_URL,
} from "@/lib/site";

/**
 * De behandelpagina's.
 *
 * Eén sjabloon voor alle vijf, gevoed uit `behandelingen.ts`. Dat is hier de juiste keuze
 * en bij de huidproblemen niet: die hebben elk een eigen interactie omdat elk huidprobleem
 * bij een andere vraag begint. Behandelingen beginnen allemaal bij dezelfde vraag, dus
 * verdienen ze dezelfde opbouw. Vijf keer hetzelfde met een ander accentje zou alleen maar
 * verbergen dat ze inderdaad hetzelfde zijn.
 *
 * De volgorde van de secties is niet willekeurig. Eerst wat het doet en hoe diep, dan wat
 * je ervan merkt, dan wat het níet doet, en pas daarna een knop. De meeste behandelsites
 * doen dat andersom.
 *
 * De wel- en nietlijst zijn even lang. Dat is geen toeval maar de bedoeling: een lijstje
 * van zes voordelen met één nadeeltje eronder is geen eerlijkheid maar opmaak.
 *
 * Twee donkergroene vlakken per pagina: het nietblok en de afsluiter (§5).
 */

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BEHANDELINGEN.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const b = behandelingVoorSlug(slug);
  if (!b) return {};
  return {
    title: b.naam,
    description: publicCopy(b.kort),
  };
}

const ANKERS = [
  { id: "werking", label: "Wat het doet" },
  { id: "afspraak", label: "In de afspraak" },
  { id: "grenzen", label: "Wat het niet doet" },
  { id: "vragen", label: "Vragen" },
];

export default async function BehandelingPage({ params }: PageProps) {
  const { slug } = await params;
  const b = behandelingVoorSlug(slug);
  if (!b) notFound();

  const diepsteLaag =
    b.lagen.length === 0
      ? null
      : HUIDLAGEN.find((l) => l.id === b.lagen[b.lagen.length - 1]);

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Behandelingen", url: `${DIBA_SITE_URL}/behandelingen` },
          { name: b.naam, url: `${DIBA_SITE_URL}/behandelingen/${b.slug}` },
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
              <Link href="/behandelingen" className="hover:text-[var(--g-700)]">
                Behandelingen
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">{b.naam}</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[16ch]">{b.naam}</h1>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(b.kort)}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                Plan Behandeling Nul
              </Link>
              <Link
                href="/behandelingen"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Vergelijk met de andere vier
              </Link>
            </div>
          </div>

          {/* De drie getallen die het verschil maken, meteen in beeld. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-10">
            <Label opDonker>In het kort</Label>
            <dl className="mt-6 space-y-4">
              <div className="flex items-baseline justify-between gap-6 border-b border-white/20 pb-4">
                <dt className="diba-label diba-label-on-dark">Hoe diep</dt>
                <dd className="diba-card-title text-right">
                  {diepsteLaag ? diepsteLaag.naam : "Raakt niets"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-b border-white/20 pb-4">
                <dt className="diba-label diba-label-on-dark">Herstel</dt>
                <dd className="diba-card-title text-right">
                  {publicCopy(b.herstel)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-b border-white/20 pb-4">
                <dt className="diba-label diba-label-on-dark">Hoe vaak</dt>
                <dd className="diba-card-title text-right">
                  {publicCopy(b.sessies, "Nog niet vastgesteld")}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6">
                <dt className="diba-label diba-label-on-dark">Per sessie</dt>
                <dd className="diba-card-title text-right tabular-nums">
                  {prijsTekst(b.prijs)}
                </dd>
              </div>
            </dl>

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

      {/* ── Werking ── */}
      <section
        id="werking"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
      >
        <div className="mx-auto max-w-[1800px]">
          <Label>Wat het doet</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            {diepsteLaag ? "Waar het aankomt" : "Waarom er niets gebeurt"}
          </h2>
          <p className="mt-6 max-w-[64ch] text-[16px] leading-7 text-[var(--t-body)]">
            {publicCopy(b.werking)}
          </p>

          {/* De lagen als trapje: je ziet in één oogopslag waar het stopt. */}
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)]">
            {HUIDLAGEN.map((laag) => {
              const raakt = b.lagen.includes(laag.id);
              return (
                <li
                  key={laag.id}
                  className={`flex flex-wrap items-baseline gap-x-5 gap-y-1 p-5 ${
                    raakt ? "bg-[var(--g-700)]" : "bg-white"
                  }`}
                >
                  <span
                    className={`w-[13rem] shrink-0 text-[15px] leading-6 font-medium ${
                      raakt ? "text-white" : "text-[var(--t-strong)]"
                    }`}
                  >
                    {laag.naam}
                  </span>
                  <span
                    className={`flex-1 text-[14px] leading-6 ${
                      raakt ? "text-[var(--on-dark-body)]" : "text-[var(--t-muted)]"
                    }`}
                  >
                    {laag.zin}
                  </span>
                  <span
                    className={`diba-label shrink-0 ${
                      raakt ? "diba-label-on-dark" : "text-[var(--t-muted)]"
                    }`}
                  >
                    {raakt ? "Hier werkt het" : "Blijft onaangeroerd"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── In de afspraak ── */}
      <section
        id="afspraak"
        className="scroll-mt-[var(--anker-offset)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
      >
        <div className="mx-auto max-w-[1800px]">
          <Label>In de afspraak</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Wat er gebeurt,
            <br />
            <span className="diba-accent">in volgorde.</span>
          </h2>

          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {(b.stappen ?? []).map((s, i) => (
              <li
                key={s.kop}
                className="rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <span className="diba-label text-[var(--t-muted)] tabular-nums">
                  Stap {i + 1}
                </span>
                <p className="diba-card-title mt-3 text-[var(--t-strong)]">{s.kop}</p>
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(s.zin)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Wel en niet ── */}
      <section
        id="grenzen"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
      >
        <div className="mx-auto max-w-[1800px]">
          <Label>Wat het wel en niet doet</Label>
          <h2 className="diba-display-m mt-4 max-w-[24ch]">
            Even lang,
            <br />
            <span className="diba-accent">en dat is met opzet.</span>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Zes voordelen met één nadeeltje eronder is geen eerlijkheid maar opmaak.
            Daarom staan hier links en rechts evenveel regels.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <Label>Hier doet het iets aan</Label>
              <ul className="mt-5 space-y-3">
                {(b.wel ?? []).map((w) => (
                  <li
                    key={w}
                    className="rounded-[var(--r-sm)] bg-white p-5 text-[16px] leading-7 text-[var(--t-body)]"
                  >
                    {publicCopy(w)}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label>Hier niet</Label>
              <ul className="mt-5 space-y-3">
                {(b.niet ?? []).map((n) => (
                  <li
                    key={n}
                    className="rounded-[var(--r-sm)] bg-[var(--g-700)] p-5 text-[16px] leading-7 text-[var(--on-dark-body)]"
                  >
                    {publicCopy(n)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <Label>Komt vaak voor bij</Label>
            <ul className="mt-5 flex flex-wrap gap-2">
              {(b.bijProblemen ?? []).map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="diba-label inline-flex min-h-12 items-center rounded-[var(--r-pill)] bg-white px-5 text-[var(--t-label)] transition-colors hover:bg-[var(--g-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Vragen ── */}
      <section
        id="vragen"
        className="scroll-mt-[var(--anker-offset)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
      >
        <div className="mx-auto max-w-[1800px]">
          <Label>Vragen</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Wat mensen
            <br />
            <span className="diba-accent">hierover vragen.</span>
          </h2>

          <ul className="mt-10 max-w-[64ch] divide-y divide-[var(--g-100)] border-y border-[var(--g-100)]">
            {(b.faq ?? []).map((v) => (
              <li key={v.vraag}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] leading-7 font-medium text-[var(--t-strong)] [&::-webkit-details-marker]:hidden">
                    {v.vraag}
                    <svg
                      viewBox="0 0 12 12"
                      className="h-3 w-3 shrink-0 text-[var(--t-muted)] transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2.5 4.5 6 8l3.5-3.5" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-[16px] leading-7 text-[var(--t-body)]">
                    {publicCopy(v.antwoord)}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Afsluiter ── */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-24">
        <div className="mx-auto max-w-[1800px]">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <Label opDonker>Eerst meten</Label>
            <h2 className="diba-display-m mt-4 max-w-[22ch]">
              Of dit bij jou past
              <br />
              <span className="diba-accent-on-dark">weten we nog niet.</span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Deze pagina vertelt wat {b.naam.toLowerCase()} doet. Of het bij jouw huid het
              juiste is, hangt af van wat er bij jou aan de hand is, en dat begint met een
              meting. Soms komt daar uit dat je hier niets aan hebt.
            </p>
            <Link
              href="/intake"
              className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Wat er in Behandeling Nul gebeurt
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
