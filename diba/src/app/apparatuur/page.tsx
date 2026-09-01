import type { Metadata } from "next";
import Link from "next/link";
import Dieptevergelijker from "@/components/apparatuur/Dieptevergelijker";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import BeeldVignet from "@/components/ui/BeeldVignet";
import Label from "@/components/ui/Label";
import { APPARAAT_CATEGORIEEN, APPARATUUR } from "@/data/apparatuur";
import { behandelingVoorSlug } from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";

/**
 * Het apparatuuroverzicht.
 *
 * Klinieken verkopen apparaatnamen. "Wij hebben de Fotona." Alsof het apparaat het werk
 * doet en de kliniek alleen de stekker erin steekt. Deze pagina begint dus met het
 * tegenovergestelde: een apparaat is gereedschap. Wat telt is de instelling, de hand die
 * het vasthoudt en of het bij jouw huid past.
 *
 * Waarom de pagina er dan toch is: omdat mensen op merknamen zoeken, en omdat je bij elk
 * apparaat kunt laten zien wát het niet kan. Dat laatste is de reden dat deze reeks mag
 * bestaan. Zonder dat zijn het merkfolders.
 *
 * Eén donkergroen vlak: de stelling bovenaan (§5).
 */

export const metadata: Metadata = {
  title: "Onze apparatuur",
  description:
    "Welke apparaten er in de kliniek staan, wat erop draait en wat ze niet kunnen. Een apparaat is gereedschap, geen belofte.",
};

export default function ApparatuurPage() {
  const perCategorie = APPARAAT_CATEGORIEEN.map((c) => ({
    ...c,
    items: APPARATUUR.filter((a) => a.categorie === c.id),
  })).filter((c) => c.items.length > 0);

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Apparatuur", url: `${DIBA_SITE_URL}/apparatuur` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-28 h-[440px] w-[440px] rounded-full bg-[var(--g-050)]"
        />
        <DibaLeafMark
          aria-hidden="true"
          className="pointer-events-none absolute top-16 right-24 hidden h-[170px] w-[170px] rotate-12 text-[var(--g-200)] lg:block"
        />
        <div className="relative mx-auto px-5 pt-12 pb-14 sm:px-9 lg:px-[7.5vw] lg:pt-16">
          <nav
            aria-label="Kruimelpad"
            className="diba-label flex flex-wrap gap-2"
          >
            <Link href="/" className="hover:text-[var(--g-700)]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--t-muted)]">Apparatuur</span>
          </nav>

          <h1 className="diba-display-l mt-8 max-w-[16ch]">
            {APPARATUUR.length} apparaten.
            <br />
            <span className="diba-accent">Geen van alle een belofte.</span>
          </h1>

          <p className="mt-7 max-w-[56ch] text-[17px] leading-8 text-[var(--t-body)]">
            Klinieken verkopen apparaatnamen. Wij hebben de Fotona, wij hebben
            de HydraFacial. Alsof het apparaat het werk doet en wij alleen de
            stekker erin steken.
          </p>
          <p className="mt-4 max-w-[56ch] text-[17px] leading-8 text-[var(--t-body)]">
            Het is andersom. Een apparaat is gereedschap. Wat telt is de
            instelling, de hand die het vasthoudt en of het bij jouw huid past.
            Daarom staat bij elk apparaat hieronder ook wat het níet kan.
          </p>
        </div>
      </section>

      {/* ── De stelling ── */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-20">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
              <div>
                <Label opDonker>Waarom dit ertoe doet</Label>
                <p className="diba-display-s mt-4 max-w-[22ch]">
                  Twee klinieken met hetzelfde apparaat{" "}
                  <span className="diba-accent-on-dark">
                    {" "}
                    geven niet hetzelfde resultaat.
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[16px] leading-7 text-[var(--on-dark-body)]">
                  Het verschil zit in wat er vooraf gemeten is, welke instelling
                  er wordt gekozen en of iemand durft te zeggen dat een
                  behandeling bij jou niet past. Een merknaam zegt daar niets
                  over.
                </p>
                <p className="mt-4 text-[16px] leading-7 text-[var(--on-dark-body)]">
                  Daarom begint elk traject hier met een meting en niet met een
                  apparaat.
                </p>
                <Link
                  href="/intake"
                  className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white"
                >
                  Wat er in Behandeling Nul gebeurt
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Alles op één schaal ── */}
      {/* Deze pagina beweert dat er twaalf apparaten staan. Een opname van een ervan in de
          kamer maakt dat controleerbaar in plaats van een opsomming. */}
      <section className="px-5 pb-14 sm:px-9 lg:px-[7.5vw] lg:pb-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/kliniek-nordlys-staand.jpg"
            alt="Behandelaar naast de Nordlys in de behandelkamer van Diba Clinics"
            onderschrift="De Nordlys, zoals hij bij ons staat"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/9] lg:aspect-[21/9]"
          />
        </div>
      </section>

      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Naast elkaar</Label>
            <h2 className="diba-display-m mt-4">
              {APPARATUUR.length} apparaten,{" "}
              <span className="diba-accent">één schaal.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Het verschil tussen deze apparaten zit in twee dingen: waar ze op
              aangrijpen en tot hoe diep ze komen. Dat tweede is meteen de grens
              van wat ze kunnen. Een peeling neemt geen rimpels weg omdat hij
              daar niet komt, en dat is hieronder te zien in plaats van te
              geloven.
            </p>
          </div>

          <div className="mt-10">
            <Dieptevergelijker />
          </div>
        </div>
      </section>

      {/* ── De apparaten ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto space-y-16">
          {perCategorie.map((c) => (
            <div key={c.id}>
              <Label>{c.label}</Label>
              <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {c.items.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/apparatuur/${a.slug}`}
                      className="flex h-full flex-col rounded-[var(--r-md)] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] sm:p-7"
                    >
                      {a.merk ? (
                        <span className="diba-label text-[var(--t-muted)]">
                          {a.merk}
                        </span>
                      ) : null}
                      <span className="diba-card-title mt-2 text-[var(--t-strong)]">
                        {a.naam}
                      </span>
                      <span className="mt-3 flex-1 text-[15px] leading-7 text-[var(--t-body)]">
                        {publicCopy(a.kort)}
                      </span>
                      <span className="mt-6 pt-4 text-[13px] leading-5 text-[var(--t-muted)]">
                        {a.behandelingen
                          .map((s) => behandelingVoorSlug(s)?.naam)
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Verder ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Verder</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Zoek op wat je
              <br />
              <span className="diba-accent">wilt bereiken</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Wie begint bij de techniek komt uit bij waar het meest over
              geschreven is. Dat is zelden hetzelfde als wat bij jouw huid past.
              Begin bij wat je wil veranderen, of laat het eerst meten.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/behandelingen"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Alle behandelingen
              </Link>
              <Link
                href="/huidprofiel"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
              >
                Maak je huidprofiel
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
