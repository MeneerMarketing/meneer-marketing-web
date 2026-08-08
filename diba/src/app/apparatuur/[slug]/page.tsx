import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Werkingsvenster from "@/components/apparatuur/Werkingsvenster";
import Label from "@/components/ui/Label";
import { APPARATUUR, apparaatVoorSlug } from "@/data/apparatuur";
import { behandelingVoorSlug, prijsTekst } from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";

/**
 * De apparatuurpagina's.
 *
 * Eén sjabloon voor alle apparaten, want ze beantwoorden allemaal dezelfde drie vragen:
 * wat is het, wat draait erop, en wat kan het niet.
 *
 * Die derde is de reden dat deze reeks bestaat. Een apparatuurpagina zonder "wat het niet
 * kan" is een merkfolder, en daar heeft niemand iets aan behalve de fabrikant.
 *
 * De koppeling naar behandelingen loopt twee kanten op: hier staat wat er op dit apparaat
 * draait, en op elke behandelpagina staat op welk apparaat die behandeling gaat. Beide
 * komen uit dezelfde tabel in `apparatuur.ts`.
 *
 * Eén donkergroen vlak: het nietblok (§5).
 */

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return APPARATUUR.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const a = apparaatVoorSlug(slug);
  if (!a) return {};
  return { title: a.naam, description: publicCopy(a.kort) };
}

export default async function ApparaatPage({ params }: PageProps) {
  const { slug } = await params;
  const a = apparaatVoorSlug(slug);
  if (!a) notFound();

  const behandelingen = a.behandelingen
    .map((s) => behandelingVoorSlug(s))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Apparatuur", url: `${DIBA_SITE_URL}/apparatuur` },
          { name: a.naam, url: `${DIBA_SITE_URL}/apparatuur/${a.slug}` },
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
              <Link href="/apparatuur" className="hover:text-[var(--g-700)]">
                Apparatuur
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">{a.naam}</span>
            </nav>

            <div className="mt-8">
              {a.merk ? <Label>{a.merk}</Label> : null}
              <h1 className="diba-display-l mt-3 max-w-[16ch]">{a.naam}</h1>
            </div>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(a.kort)}
            </p>

            <p className="mt-6 max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(a.wat)}
            </p>
          </div>

          {/* Wat erop draait. De hele reden dat deze pagina bestaat naast de behandeling. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Hierop draait</Label>
            {behandelingen.length > 0 ? (
              <ul className="mt-5 space-y-2">
                {behandelingen.map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/behandelingen/${b.slug}`}
                      className="-mx-4 flex items-baseline justify-between gap-4 rounded-[var(--r-sm)] px-4 py-3 transition-colors hover:bg-[var(--g-050)]"
                    >
                      <span className="text-[16px] leading-6 font-medium text-[var(--t-strong)]">
                        {b.naam}
                      </span>
                      <span className="shrink-0 text-[14px] leading-6 text-[var(--t-muted)] tabular-nums">
                        {prijsTekst(b.prijs)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-[15px] leading-7 text-[var(--t-body)]">
                Nog niet gekoppeld aan een behandeling op deze site.
              </p>
            )}

            <p className="mt-6 border-t border-[var(--g-100)] pt-5 text-[14px] leading-6 text-[var(--t-muted)]">
              Welke instelling er gekozen wordt hangt af van je huid, en dat
              bepaalt een mens na de meting. Niet dit apparaat en niet deze
              pagina.
            </p>
          </div>
        </div>
      </section>

      {/* ── Het mechaniek ── */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-24">
        <div className="mx-auto">
          <div className="max-w-[62ch]">
            <Label>Hoe het werkt</Label>
            <h2 className="diba-display-m mt-4 max-w-[20ch]">
              Niet wat het doet.
              <br />
              <span className="diba-accent">Hoe het het doet.</span>
            </h2>
            <p className="mt-6 text-[16px] leading-7 text-[var(--t-body)]">
              Elk apparaat grijpt ergens op aan en komt tot een bepaalde diepte.
              Dat is meteen ook de grens van wat het kan. Hieronder zie je die
              grens, in dezelfde doorsnede als bij elk ander apparaat, zodat je
              ze naast elkaar kunt leggen.
            </p>
          </div>

          <div className="mt-10">
            <Werkingsvenster apparaat={a} />
          </div>
        </div>
      </section>

      {/* ── Waarvoor en waarvoor niet ── */}
      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <Label>Wat het wel en niet kan</Label>
          <h2 className="diba-display-m mt-4 max-w-[22ch]">
            Even lang,
            <br />
            <span className="diba-accent">en dat is met opzet.</span>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Een apparatuurpagina zonder deze rechterkolom is een folder van de
            fabrikant. Daarom staan hier links en rechts evenveel regels.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <Label>Hiervoor is het gemaakt</Label>
              <ul className="mt-5 space-y-3">
                {a.waarvoor.map((w) => (
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
              <Label>Hiervoor niet</Label>
              <ul className="mt-5 space-y-3">
                {a.nietVoor.map((n) => (
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
        </div>
      </section>

      {/* ── Afsluiter ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Beeld</Label>
            <h2 className="diba-display-m mt-4 max-w-[18ch]">
              Het apparaat is
              <br />
              <span className="diba-accent">niet de behandeling.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Twee klinieken met dit apparaat geven niet hetzelfde resultaat.
              Het verschil zit in wat er vooraf gemeten is, welke instelling er
              wordt gekozen en of iemand durft te zeggen dat het bij jou niet
              past.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Plan Behandeling Nul
              </Link>
              <Link
                href="/apparatuur"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
              >
                Alle apparatuur
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
