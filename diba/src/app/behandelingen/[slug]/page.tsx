import type { Metadata } from "next";
import Link from "next/link";
import ProfielOordeel from "@/components/huidprofiel/ProfielOordeel";
import BeeldVignet from "@/components/ui/BeeldVignet";
import { notFound } from "next/navigation";
import Werkingsvenster from "@/components/apparatuur/Werkingsvenster";
import Variantkiezer from "@/components/behandelingen/Variantkiezer";
import Label from "@/components/ui/Label";
import { apparatenVoorBehandeling } from "@/data/apparatuur";
import { PillarFaq } from "@/components/pillar/PillarSecties";
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
  { id: "grenzen", label: "Waar het voor is" },
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

          <h1 className="diba-display-l mt-6 max-w-[21ch]">{b.naam}</h1>

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
                    diepsteLaag ? diepsteLaag.naam : "Meet, zonder aanraking",
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
              Plan een huidconsult
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
            {diepsteLaag ? "Waar het aankomt" : "Wat het oplevert"}
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
                    {/* Drie regelhoogtes gereserveerd. Even lange teksten geven niet
                        vanzelf even hoge kaarten, want dat hangt af van waar de woorden
                        breken; in lh schaalt het bovendien mee met de lettergrootte. */}
                    <p className="mt-3 min-h-[3lh] text-[15px] leading-7 text-[var(--t-body)]">
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
                className={`grid gap-4 lg:items-stretch ${
                  b.fotoInDeStoel ? "lg:grid-cols-2" : ""
                } ${b.stappen?.length ? "mt-14" : "mt-4"}`}
              >
                {/* Links de foto, rechts het groene vlak, allebei even hoog.

                    De foto stond eerst onder de kop in een smalle kolom met de tekst
                    ernaast. Bij Nordlys was die foto bijna achthonderd pixels hoog en de
                    tekst tweehonderd, dus stond er rechts zeshonderd pixels wit.

                    `lg:items-stretch` met `lg:aspect-auto` laat de kortste van de twee
                    meegroeien met de langste, wie dat ook is. Dezelfde opbouw als de hero
                    bovenaan deze pagina, dus het leest als een herhaling. */}
                {b.fotoInDeStoel ? (
                  <BeeldVignet
                    src={b.fotoInDeStoel.src}
                    alt={b.fotoInDeStoel.alt}
                    sizes="(min-width: 1024px) 46vw, 92vw"
                    className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto lg:min-h-[520px]"
                  />
                ) : null}

                <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-10 lg:p-12">
                  <Label opDonker>Hoe het voelt</Label>
                  {b.stappen?.length ? (
                    <h3 className="diba-display-s mt-4 max-w-[18ch]">
                      Wat je ervan{" "}
                      <span className="diba-accent-on-dark">
                        merkt in de stoel
                      </span>
                    </h3>
                  ) : (
                    <h2 className="diba-display-m mt-4 max-w-[18ch]">
                      Wat je ervan{" "}
                      <span className="diba-accent-on-dark">
                        merkt in de stoel
                      </span>
                    </h2>
                  )}

                  <div className="mt-6 max-w-[52ch] space-y-4">
                    {b.inDeStoel.map((alinea) => (
                      <p
                        key={alinea.slice(0, 40)}
                        className="text-[16px] leading-7 text-[var(--on-dark-body)]"
                      >
                        {publicCopy(alinea)}
                      </p>
                    ))}
                  </div>

                  {/* Deze knop staat er niet om het vlak te vullen. Iemand heeft net
                      gelezen hoe de behandeling voelt, en dat is het moment waarop de
                      vraag "en nu" komt. */}
                  <Link
                    href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
                    className="diba-label mt-8 inline-flex min-h-12 w-fit items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Plan een huidconsult
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── Wel en niet ── */}
      {/* `wel` en `niet` heten nog zo in de data, maar `niet` draagt sinds vandaag de
          route: waarom deze behandeling het niet is, en welke het dan wel is. Een grens
          zonder vervolg stuurt iemand de deur uit; met vervolg is het een verwijzing.

          Links en rechts hebben evenveel regels, dat blijft. */}
      {b.wel?.length || b.niet?.length ? (
        <section
          id="grenzen"
          className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
        >
          <div className="mx-auto">
            <Label>Waar het voor is</Label>
            <h2 className="diba-display-m mt-4 max-w-[24ch]">
              {b.welNietKop?.kop ?? "Waar deze behandeling"}{" "}
              <span className="diba-accent">
                {b.welNietKop?.accent ?? "voor bedoeld is"}
              </span>
            </h2>
            <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
              Links waar deze behandeling goed werkt, rechts wanneer een andere
              behandeling meer voor je doet.
            </p>

            <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <Label>Hier werkt het goed bij</Label>
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
                <Label>Hiervoor kies je iets anders</Label>
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

      {/* ── Vragen ──

          Hier stond een eigen opmaak: kop bovenaan over de volle breedte, daaronder de
          vragen in een kolom van 64 tekens tegen de linkerrand. Op een breed scherm is dat
          een smal strookje met een half leeg vlak ernaast, terwijl elke andere sectie op
          deze site kop links en inhoud rechts zet.

          Het was bovendien een tweede kopie van PillarFaq, die datzelfde doet mét de
          indeling van de rest en de vragen ook aanmeldt bij Google. Dat laatste deden deze
          pagina's dus niet. */}
      {b.faq?.length ? (
        <PillarFaq items={b.faq} onderwerp={b.naam.toLowerCase()} />
      ) : null}

      {/* ── Afsluiter ── */}
      {/* Geen onderruimte hier: de voettekst brengt die mee. Stond dit er wel, dan
          telde het op tot honderdvierenveertig pixels tussen het groene vlak en de eerste
          lijn van de voettekst, en dat is te veel. */}
      <section className="px-5 pt-16 sm:px-9 lg:px-[7.5vw] lg:pt-20">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <Label opDonker>De eerste afspraak</Label>
            <h2 className="diba-display-m mt-4 max-w-[22ch]">
              Begin met een{" "}
              <span className="diba-accent-on-dark">huidanalyse</span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              De behandelaar bekijkt je huid, meet met de EVE-M en stelt vast
              wat er bij jou past. Je hoort meteen om hoeveel sessies het gaat
              en wat het kost. Word je in dezelfde afspraak behandeld, dan
              vervallen de intakekosten.
            </p>
            <Link
              href="/intake"
              className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Wat er in een huidconsult gebeurt
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
