import type { Metadata } from "next";
import Link from "next/link";
import ProfielOordeel from "@/components/huidprofiel/ProfielOordeel";
import BeeldVignet from "@/components/ui/BeeldVignet";
import { notFound } from "next/navigation";
import Werkingsvenster from "@/components/apparatuur/Werkingsvenster";
import Variantkiezer from "@/components/behandelingen/Variantkiezer";
import Label from "@/components/ui/Label";
import { apparatenVoorBehandeling } from "@/data/apparatuur";
import ProofBar from "@/components/ui/ProofBar";
import {
  BEHANDELINGEN,
  HUIDLAGEN,
  behandelingVoorSlug,
  diepteVanLagen,
} from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
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
 * DONKERGROENE VLAKKEN: DRIE, EN DAT IS ER ÉÉN TE VEEL (§5).
 *
 * Gemeten op deze pagina: de herokaart, het nietblok en de afsluiter. Dit stond hier
 * eerder als "twee" genoteerd, maar de herokaart is altijd al donkergroen geweest en
 * werd niet meegeteld. Het waren er zelfs vier zolang het lagentrapje ook donkere balken
 * had; dat trapje is nu licht, dus het gaat de goede kant op.
 *
 * Welke van de drie licht wordt is een ontwerpkeuze en geen opruimklus, want alle drie
 * dragen ze iets: de herokaart de getallen, het nietblok de grenzen, de afsluiter de
 * uitnodiging. [BESLUIT-OKAN]
 */

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BEHANDELINGEN.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const b = behandelingVoorSlug(slug);
  if (!b) return {};
  return zoekmachineVelden({
    pad: `/behandelingen/${b.slug}`,
    titel: b.naam,
    omschrijving: publicCopy(b.kort),
  });
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

  /* De koppeling loopt twee kanten op: hier het apparaat, en op de apparatuurpagina de
     behandelingen die erop draaien. Beide uit dezelfde tabel. */
  const apparaten = apparatenVoorBehandeling(b.slug);

  /* De diepste laag die geraakt wordt, en op welke plek die in de rij staat. Dat tweede
     bepaalt welke lagen erboven gepasseerd worden om er te komen. */
  const diepsteIndex = HUIDLAGEN.reduce(
    (tot, laag, i) => (b.lagen.includes(laag.id) ? i : tot),
    -1,
  );
  const diepsteLaag = diepsteIndex < 0 ? null : HUIDLAGEN[diepsteIndex];

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Behandelingen", url: `${DIBA_SITE_URL}/behandelingen` },
          { name: b.naam, url: `${DIBA_SITE_URL}/behandelingen/${b.slug}` },
        ])}
      />

      {/* ── De hero ──

          Het groene blok stond in een eigen kolom naast alles wat links stond: kruimelpad,
          kop, foto, omschrijving en knoppen. Daardoor was het net zo hoog als die hele
          kolom en liep het ruim onder de foto door, met een leeg groen vlak als gevolg.

          Nu staan de foto en het blok samen in een eigen rij met `items-stretch`. Die twee
          zijn daarmee per definitie even hoog: de een kan niet groeien zonder de ander. De
          kop staat erboven en de omschrijving eronder, allebei over de volle breedte.

          Dat laatste is meteen waarom de omschrijving nu op één regel past. Hij stond in
          een kolom van nog geen halve pagina en brak daardoor telkens af halverwege een
          zin die als geheel bedoeld is. */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="py-14 lg:py-20">
          <nav
            aria-label="Kruimelpad"
            className="diba-label flex flex-wrap gap-2"
          >
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

          {/* ── De rij: wat je ziet, naast wat je moet weten ── */}
          <div
            className={`mt-8 grid gap-6 lg:items-stretch ${
              b.foto ? "lg:grid-cols-[1.08fr_0.92fr]" : ""
            }`}
          >
            {b.foto ? (
              <BeeldVignet
                src={b.foto.src}
                alt={b.foto.alt}
                onderschrift={
                  b.apparaat && b.apparaat !== b.naam
                    ? `${b.naam} · ${b.apparaat}`
                    : b.naam
                }
                priority
                sizes="(min-width: 1024px) 52vw, 92vw"
                className="aspect-[4/3] lg:aspect-auto lg:min-h-[520px]"
              />
            ) : null}

            {/* De getallen die het verschil maken, meteen in beeld. */}
            <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-10">
              <Label opDonker>In het kort</Label>
              {/* Vier regels op een eigen vlak in plaats van achter een haarlijn: de
                  huisregel is vullingen, en op --g-800 haalt de tekst 7,57 tegen 4,08 op
                  een doorschijnend wit vlak. "Hoe lang" is er nieuw bij; dat is de vraag
                  die bepaalt of je er vrij voor moet nemen. */}
              <dl className="mt-6 space-y-2">
                {[
                  [
                    "Hoe diep",
                    diepsteLaag ? diepsteLaag.naam : "Raakt niets",
                  ] as const,
                  b.duurMinuten
                    ? (["Hoe lang", `${b.duurMinuten} minuten`] as const)
                    : null,
                  ["Herstel", publicCopy(b.herstel)] as const,
                  [
                    "Hoe vaak",
                    publicCopy(b.sessies, "Nog niet vastgesteld"),
                  ] as const,
                ]
                  .filter((rij): rij is NonNullable<typeof rij> => rij !== null)
                  .map(([kop, waarde]) => (
                    <div
                      key={kop}
                      className="flex items-baseline justify-between gap-6 rounded-[var(--r-sm)] bg-[var(--g-800)] px-5 py-4"
                    >
                      <dt className="diba-label diba-label-on-dark shrink-0">
                        {kop}
                      </dt>
                      <dd className="diba-card-title text-right">{waarde}</dd>
                    </div>
                  ))}
              </dl>

              {/* De prijs staat buiten de dl, want het is geen enkel getal meer maar een
                  keuze. Alle varianten even zichtbaar, ook de duurste. */}
              <div className="mt-4">
                <Variantkiezer
                  varianten={b.varianten ?? []}
                  basisprijs={b.prijs}
                />
              </div>
            </div>
          </div>

          {/* Wat er bij deze bezoeker uit het huidprofiel kwam.

              Staat direct onder de rij en boven de omschrijving: als deze behandeling bij
              jou is afgevallen, hoor je dat te lezen voordat je de verkooptekst leest en
              niet erna. Zonder ingevuld profiel rendert hij niets. */}
          <ProfielOordeel slug={b.slug} />

          {/* ── Onder de rij, over de volle breedte ── */}
          <p className="mt-8 text-[17px] leading-8 text-[var(--t-body)]">
            {publicCopy(b.kort)}
          </p>

          {apparaten.length > 0 ? (
            <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] leading-7 text-[var(--t-body)]">
              <span className="text-[var(--t-muted)]">Draait op</span>
              {apparaten.map((a, i) => (
                <span key={a.slug}>
                  <Link
                    href={`/apparatuur/${a.slug}`}
                    className="font-medium text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                  >
                    {a.naam}
                  </Link>
                  {i < apparaten.length - 1 ? <span>,</span> : null}
                </span>
              ))}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
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
              Vergelijk met de rest
            </Link>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      <nav
        aria-label="Op deze pagina"
        className="sticky top-[var(--nav-h)] z-20 bg-[var(--g-010)]/95 backdrop-blur"
      >
        <ul className="mx-auto flex gap-6 overflow-x-auto px-5 py-4 sm:px-9 lg:px-[7.5vw]">
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
        <div className="mx-auto">
          <Label>Wat het doet</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            {diepsteLaag ? "Waar het aankomt" : "Waarom er niets gebeurt"}
          </h2>
          <p className="mt-6 max-w-[64ch] text-[16px] leading-7 text-[var(--t-body)]">
            {publicCopy(b.werking)}
          </p>

          {/* Draait deze behandeling op een apparaat, dan hoort het mechaniek erbij.

              De diepte komt uit de lagen van deze behandeling en niet uit het apparaat:
              de Fotona haalt vijfentachtig procent, maar niet elke behandeling erop gaat
              zo diep. Het apparaat levert het hoe, de behandeling bepaalt het hoever. */}
          {apparaten.length > 0 && b.lagen.length > 0 ? (
            <div className="mt-10">
              <Werkingsvenster
                apparaat={apparaten[0]}
                diepte={diepteVanLagen(b.lagen)}
              />
            </div>
          ) : null}

          {/* De lagen in woorden.

              Dit was een trapje met donkergroene balken, en dat werkte tot de doorsnede
              erboven kwam te staan. Twee keer hetzelfde signaal geven is niet dubbel zo
              duidelijk maar half zo rustig, en het luidste van de twee wint dan van het
              nauwkeurigste. De tekening zegt nu waar het aankomt; deze lijst voegt toe
              wat elke laag eigenlijk is. */}
          <ul className="mt-10 divide-y divide-[var(--g-100)] overflow-hidden rounded-[var(--r-md)] bg-white">
            {HUIDLAGEN.map((laag, i) => {
              const raakt = b.lagen.includes(laag.id);
              /* Een laag waar niet gewerkt wordt maar die wel boven de diepste ligt,
                 wordt gepasseerd. Een naald die tot in de lederhuid komt gaat nu
                 eenmaal door de hoornlaag heen, en "blijft onaangeroerd" zou daar de
                 tekening tegenspreken. */
              const doorheen = !raakt && i < diepsteIndex;
              return (
                <li
                  key={laag.id}
                  className="flex flex-wrap items-baseline gap-x-5 gap-y-1 p-5"
                >
                  <span className="flex w-[13rem] shrink-0 items-baseline gap-2.5">
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 shrink-0 translate-y-[-1px] rounded-full ${
                        raakt
                          ? "bg-[var(--g-700)]"
                          : doorheen
                            ? "bg-[var(--g-400)]"
                            : "bg-[var(--g-200)]"
                      }`}
                    />
                    <span
                      className={`text-[15px] leading-6 ${
                        raakt
                          ? "font-medium text-[var(--t-strong)]"
                          : doorheen
                            ? "text-[var(--t-body)]"
                            : "text-[var(--t-muted)]"
                      }`}
                    >
                      {laag.naam}
                    </span>
                  </span>
                  <span
                    className={`flex-1 text-[14px] leading-6 ${
                      raakt || doorheen
                        ? "text-[var(--t-body)]"
                        : "text-[var(--t-muted)]"
                    }`}
                  >
                    {laag.zin}
                  </span>
                  <span
                    className={`diba-label shrink-0 ${
                      raakt || doorheen
                        ? "text-[var(--t-label)]"
                        : "text-[var(--t-muted)]"
                    }`}
                  >
                    {raakt
                      ? "Hier werkt het"
                      : doorheen
                        ? "Gaat er doorheen"
                        : "Blijft onaangeroerd"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── In de afspraak ──

          De sectie hing eerst aan `b.stappen`, en vijf behandelingen hebben die niet. Dat waren
          precies de vijf dunste pagina's van de reeks. Nu draagt hij zichzelf zodra er iets
          in te zetten valt: de stappen als die er zijn, en anders het verloop van de
          afspraak. */}
      {b.stappen?.length || b.inDeStoel?.length ? (
        <section
          id="afspraak"
          className="scroll-mt-[var(--anker-offset)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
        >
          <div className="mx-auto">
            <Label>In de afspraak</Label>
            {b.stappen?.length ? (
              <h2 className="diba-display-m mt-4 max-w-[20ch]">
                Wat er gebeurt,
                <br />
                <span className="diba-accent">in volgorde.</span>
              </h2>
            ) : null}

            {/* Geen "Stap 1, Stap 2, Stap 3" boven deze kaarten. De kop erboven zegt al
                "in volgorde", de kaarten staan van links naar rechts, en het is een
                genummerde lijst. Drie keer dezelfde mededeling, waarvan er twee alleen
                als opmaak leesbaar zijn. */}
            {b.stappen?.length ? (
              <ol className="mt-12 grid gap-4 md:grid-cols-3">
                {b.stappen.map((s) => (
                  <li
                    key={s.kop}
                    className="rounded-[var(--r-md)] bg-white p-7 sm:p-8"
                  >
                    <p className="diba-card-title text-[var(--t-strong)]">
                      {s.kop}
                    </p>
                    <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                      {publicCopy(s.zin)}
                    </p>
                  </li>
                ))}
              </ol>
            ) : null}

            {/* Hoe het voelt.

                De drie kaarten hierboven vertellen wat het apparaat doet, en dat staat ook
                op de apparatuurpagina. Dit is het deel dat alleen hier hoort: wat jij ervan
                merkt, en wat je erna wel en niet kunt. Dat is de vraag waarmee iemand op
                deze pagina komt. */}
            {b.inDeStoel?.length ? (
              <div
                className={`grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 ${
                  b.stappen?.length ? "mt-14" : "mt-4"
                }`}
              >
                <div>
                  {b.stappen?.length ? (
                    <>
                      <Label>Hoe het voelt</Label>
                      <h3 className="diba-display-s mt-4 max-w-[18ch]">
                        Wat je ervan{" "}
                        <span className="diba-accent">merkt in de stoel</span>
                      </h3>
                    </>
                  ) : (
                    <h2 className="diba-display-m max-w-[18ch]">
                      Wat je ervan{" "}
                      <span className="diba-accent">merkt in de stoel</span>
                    </h2>
                  )}
                </div>
                <div className="max-w-[64ch] space-y-4">
                  {b.inDeStoel.map((alinea) => (
                    <p
                      key={alinea.slice(0, 40)}
                      className="text-[16px] leading-7 text-[var(--t-body)]"
                    >
                      {publicCopy(alinea)}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── Wel en niet ── */}
      {/* Zonder wel en niet blijft alleen de belofte over dat links en rechts evenveel regels hebben. */}
      {b.wel?.length || b.niet?.length ? (
        <section
          id="grenzen"
          className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
        >
          <div className="mx-auto">
            <Label>Wat het wel en niet doet</Label>
            <h2 className="diba-display-m mt-4 max-w-[24ch]">
              Wat een behandeling{" "}
              <span className="diba-accent">met je huid doet</span>
            </h2>
            <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
              Links waar deze behandeling voor bedoeld is, rechts waar hij niets
              aan doet.
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
      ) : null}

      {/* ── Vragen ── */}
      {/* Een vragenkop zonder vragen. */}
      {b.faq?.length ? (
        <section
          id="vragen"
          className="scroll-mt-[var(--anker-offset)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
        >
          <div className="mx-auto">
            <Label>Vragen</Label>
            <h2 className="diba-display-m mt-4 max-w-[20ch]">
              Wat mensen
              <br />
              <span className="diba-accent">hierover vragen.</span>
            </h2>

            <ul className="mt-10 max-w-[64ch] divide-y divide-[var(--g-100)]">
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
      ) : null}

      {/* ── Afsluiter ── */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-24">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <Label opDonker>Eerst meten</Label>
            <h2 className="diba-display-m mt-4 max-w-[22ch]">
              Of dit bij jou past{" "}
              <span className="diba-accent-on-dark">bespreken we vooraf</span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Deze pagina vertelt wat {b.naam.toLowerCase()} doet. Of het bij
              jouw huid het juiste is, hangt af van wat er bij jou aan de hand
              is, en dat begint met een meting. Soms komt daar uit dat je hier
              niets aan hebt.
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
