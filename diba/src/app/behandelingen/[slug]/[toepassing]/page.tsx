import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FaqAccordion, { type FaqItem } from "@/components/ui/FaqAccordion";
import Label from "@/components/ui/Label";
import { behandelingVoorSlug, prijsTekst } from "@/data/behandelingen";
import { PILLARS } from "@/data/pillars";
import {
  TOEPASSINGEN,
  toepassingVoor,
  toepassingenBijBehandeling,
} from "@/data/toepassingen";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, faqSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * Eén behandeling bij één klacht.
 *
 * OKAN, 5 september 2026: SkinPen bij acnelittekens, bij grove poriën, bij fijne lijntjes;
 * Nordlys bij couperose, bij rosacea, bij pigment; peeling bij acne, bij pigment, voor
 * huidverjonging; LED bij acne. "Verdienen wel een eigen landingspagina."
 *
 * WAAROM DIT EEN EIGEN ROUTE IS EN GEEN ANKER OP EEN BESTAANDE PAGINA.
 *
 * Wie zoekt op "microneedling acnelittekens" komt nu uit op de behandelpagina, die over
 * alles gaat, of op de klachtpagina, die alle behandelingen noemt. Allebei kloppen ze en
 * geen van beide beantwoordt de vraag. Een anker lost dat niet op: een anker deelt zijn
 * titel, zijn omschrijving en zijn plek in de index met de rest van de pagina.
 *
 * WAAROM HET GEEN DUNNE INHOUD IS. De verleiding bij dit soort pagina's is dertien
 * varianten van dezelfde tekst met een ander woord erin. Elke toepassing draagt daarom drie
 * dingen die nergens anders staan: waarom dit mechaniek bij deze klacht werkt, wat er anders
 * is aan de aanpak, en wanneer het niet de juiste keuze is. Dat laatste is per combinatie
 * anders en het is het deel dat een verkooppagina overslaat.
 *
 * DE URL is /behandelingen/<behandeling>/<toepassing>. Genest onder de behandeling, want
 * dat is wat de verhouding is: dit is die behandeling, toegepast op één ding.
 */

type Params = { slug: string; toepassing: string };

export function generateStaticParams() {
  return TOEPASSINGEN.map((t) => ({
    slug: t.behandeling,
    toepassing: t.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, toepassing } = await params;
  const t = toepassingVoor(slug, toepassing);
  if (!t) return {};
  return zoekmachineVelden({
    pad: `/behandelingen/${slug}/${toepassing}`,
    titel: t.naam,
    omschrijving: t.omschrijving,
  });
}

export default async function ToepassingPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, toepassing } = await params;
  const t = toepassingVoor(slug, toepassing);
  if (!t) notFound();

  const b = behandelingVoorSlug(t.behandeling);
  const probleem = PILLARS.find((p) => p.slug === t.probleem);
  const faq: FaqItem[] = t.faq.map((v) => ({
    question: v.vraag,
    answer: publicCopy(v.antwoord),
  }));

  /* De andere toepassingen van dezelfde behandeling. Wie hier op acnelittekens is
     uitgekomen, zoekt soms eigenlijk poriën; dat staat dan één klik verderop. */
  const buren = toepassingenBijBehandeling(t.behandeling).filter(
    (x) => x.slug !== t.slug,
  );

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Behandelingen", url: `${DIBA_SITE_URL}/behandelingen` },
          ...(b
            ? [
                {
                  name: b.naam,
                  url: `${DIBA_SITE_URL}/behandelingen/${b.slug}`,
                },
              ]
            : []),
          {
            name: t.naam,
            url: `${DIBA_SITE_URL}/behandelingen/${t.behandeling}/${t.slug}`,
          },
        ])}
      />
      <SchemaMarkup data={faqSchema(faq)} />

      {/* ── Hero ── */}
      <section className="mx-auto px-5 pt-12 pb-10 sm:px-9 lg:px-[7.5vw] lg:pt-16">
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
          {b ? (
            <>
              <span aria-hidden="true">/</span>
              <Link
                href={`/behandelingen/${b.slug}`}
                className="hover:text-[var(--g-700)]"
              >
                {b.naam}
              </Link>
            </>
          ) : null}
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <h1 className="diba-display-l max-w-[15ch]">
            {t.kop} <span className="diba-accent">{t.accent}</span>
          </h1>

          <div>
            <p className="max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              {t.intro}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                Plan een huidconsult
              </Link>
              {b ? (
                <Link
                  href={`/behandelingen/${b.slug}`}
                  className="diba-label text-[var(--g-700)] underline underline-offset-4 transition-colors hover:text-[var(--g-800)]"
                >
                  Alles over {b.naam}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ── Waarom dit werkt ── */}
      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <Label>Het mechaniek</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Waarom dit hier <span className="diba-accent">iets aan doet</span>
            </h2>
          </div>
          <div className="max-w-[62ch]">
            {t.waarom.map((alinea, i) => (
              <p
                key={publicCopy(alinea).slice(0, 40)}
                className={`text-[17px] leading-8 text-[var(--t-body)] ${
                  i > 0 ? "mt-5" : ""
                }`}
              >
                {publicCopy(alinea)}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Wat er anders is aan de aanpak ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <Label>De aanpak</Label>
          <h2 className="diba-display-m mt-4 max-w-[22ch]">
            Wat hier <span className="diba-accent">anders gaat dan anders</span>
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.instelling.map((s) => (
              <li
                key={publicCopy(s.kop)}
                className="rounded-[var(--r-lg)] bg-white p-6 sm:p-7"
              >
                <p className="diba-card-title min-h-[2lh] text-[var(--t-strong)]">
                  {publicCopy(s.kop)}
                </p>
                {/* Vier regelhoogtes gereserveerd, ook bij drie regels tekst. De drie
                    kaarten dragen per toepassing verschillend lange zinnen; zonder dit
                    staat de onderrand scheef, en inkorten tot ze toevallig even lang
                    zijn laat de opmaak de inhoud sturen. */}
                <p className="mt-3 min-h-[4lh] text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(s.zin)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Verwachting en grens ──
          Naast elkaar en even zwaar. Wat je ervan mag verwachten en wanneer het niet de
          juiste keuze is horen in één blik, want los van elkaar leest het eerste als een
          belofte en het tweede als een disclaimer. */}
      <section className="bg-white px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <Label>Wat je kunt verwachten</Label>
            <h2 className="diba-display-s mt-3 max-w-[18ch]">
              Wat het je <span className="diba-accent">oplevert</span>
            </h2>
            <p className="mt-6 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              {publicCopy(t.verwachting)}
            </p>
            {b ? (
              <dl className="mt-8 space-y-3 border-t border-[var(--g-100)] pt-6">
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="diba-label text-[var(--t-label)]">Hoe vaak</dt>
                  <dd className="max-w-[34ch] text-right text-[15px] leading-7 text-[var(--t-body)]">
                    {publicCopy(b.sessies)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="diba-label text-[var(--t-label)]">
                    Hersteltijd
                  </dt>
                  <dd className="max-w-[34ch] text-right text-[15px] leading-7 text-[var(--t-body)]">
                    {publicCopy(b.herstel)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="diba-label text-[var(--t-label)]">Vanaf</dt>
                  <dd className="text-right text-[15px] leading-7 text-[var(--t-body)] tabular-nums">
                    {b.prijs > 0 ? prijsTekst(b.prijs) : "Na de intake"}
                  </dd>
                </div>
              </dl>
            ) : null}
          </div>

          <div className="rounded-[var(--r-lg)] bg-[var(--g-050)] p-8 sm:p-10">
            <Label>Wanneer niet</Label>
            <h2 className="diba-display-s mt-3 max-w-[20ch]">
              Wanneer je hier{" "}
              <span className="diba-accent">iets anders voor kiest</span>
            </h2>
            <ul className="mt-6 space-y-4">
              {t.grens.map((g) => (
                <li key={publicCopy(g).slice(0, 40)} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--g-400)]"
                  />
                  <span className="text-[16px] leading-7 text-[var(--t-body)]">
                    {publicCopy(g)}
                  </span>
                </li>
              ))}
            </ul>
            {probleem ? (
              <Link
                href={`/huidproblemen/${t.probleem}`}
                className="diba-label mt-8 inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4 transition-colors hover:text-[var(--g-800)]"
              >
                Alles over deze klacht
                <span aria-hidden="true">›</span>
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      {faq.length > 0 ? (
        <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
          <div className="mx-auto grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <Label>Veelgestelde vragen</Label>
              <h2 className="diba-display-m mt-4 max-w-[16ch]">
                Wat mensen <span className="diba-accent">hierover vragen.</span>
              </h2>
            </div>
            <FaqAccordion items={faq} />
          </div>
        </section>
      ) : null}

      {/* ── De buren ── */}
      {buren.length > 0 && b ? (
        <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-24">
          <div className="mx-auto">
            <Label>Hetzelfde apparaat, andere vraag</Label>
            <h2 className="diba-display-s mt-3 max-w-[24ch]">
              Waar we {b.naam}{" "}
              <span className="diba-accent">nog meer voor gebruiken</span>
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {buren.map((x) => (
                <li key={x.slug}>
                  <Link
                    href={`/behandelingen/${x.behandeling}/${x.slug}`}
                    className="flex h-full flex-col rounded-[var(--r-lg)] bg-white p-6 transition-colors duration-300 [transition-timing-function:var(--ease-diba)] hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                  >
                    <p className="diba-card-title min-h-[2lh] text-[var(--t-strong)]">
                      {x.naam}
                    </p>
                    <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                      {x.intro.split(". ")[0]}.
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ── Afsluiter ── */}
      <section className="px-5 pb-20 sm:px-9 lg:px-[7.5vw] lg:pb-28">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <Label opDonker>De eerste stap</Label>
            <h2 className="diba-display-m mt-4 max-w-[22ch]">
              Of dit bij jou past,
              <br />
              <span className="diba-accent-on-dark">blijkt uit je huid.</span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Alles hierboven geldt voor deze klacht in het algemeen. Wat er bij
              jou aan de hand is en of dit de juiste route is, stelt de
              behandelaar vast tijdens het huidconsult. Is het antwoord nee, dan
              hoor je dat ook.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Plan een huidconsult
              </Link>
              <Link
                href="/behandeling-op-advies"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/50 px-6 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Of laat ons kiezen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
