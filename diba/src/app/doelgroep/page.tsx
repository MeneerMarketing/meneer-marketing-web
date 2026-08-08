import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/ui/Label";
import { DOELGROEPEN } from "@/data/doelgroep";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";

/**
 * De hub voor de vier doelgroepen.
 *
 * WAAROM DEZE PAGINA MET EEN VOORBEHOUD BEGINT.
 *
 * Een pagina die je in vier hokjes indeelt, suggereert dat er vier soorten huidzorg
 * bestaan. Die zijn er niet. Wat er wel is, zijn vier groepen met per stuk iets dat je
 * beter vooraf kunt weten, en dat is een veel kleiner verhaal dan een aparte behandellijn.
 *
 * Dus staat dat voorbehoud bovenaan en niet in de kleine lettertjes, en telt elke kaart
 * hieronder hoeveel er per groep écht anders is. Dat getal is nergens hoger dan drie.
 */

export const metadata: Metadata = {
  title: "Voor wie",
  description:
    "Vier groepen met per stuk iets dat je beter vooraf kunt weten. Geen aparte behandellijnen: dezelfde lijst, een andere volgorde.",
};

export default function DoelgroepHubPage() {
  const totaalAnders = DOELGROEPEN.reduce((n, d) => n + d.anders.length, 0);

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Voor wie", url: `${DIBA_SITE_URL}/doelgroep` },
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
              <span className="text-[var(--t-muted)]">Voor wie</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              Vier groepen,
              <br />
              <span className="diba-accent">één behandellijst.</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Een site die je in hokjes indeelt, suggereert dat er vier soorten
              huidzorg bestaan. Die zijn er niet. Wat er wel is, is per groep
              iets dat je beter vooraf kunt weten.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Bij elkaar zijn dat {totaalAnders} punten over vier groepen. Al
              het andere is voor iedereen gelijk.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Wat op elke pagina staat</Label>
            <ul className="mt-6 space-y-4">
              {[
                [
                  "Wat er echt anders is",
                  "Met de reden erbij, niet alleen de constatering.",
                ],
                [
                  "Wat er niet anders is",
                  "Even lang, en meestal het langste van de twee.",
                ],
                [
                  "Wat je moet melden",
                  "Zodat het niet pas aan de balie boven tafel komt.",
                ],
              ].map(([kop, zin]) => (
                <li key={kop}>
                  <p className="text-[16px] leading-6 font-medium text-[var(--t-strong)]">
                    {kop}
                  </p>
                  <p className="mt-1 text-[15px] leading-7 text-[var(--t-body)]">
                    {zin}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── De vier ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <ul className="grid gap-4 md:grid-cols-2">
            {DOELGROEPEN.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/doelgroep/${d.slug}`}
                  className="flex h-full flex-col rounded-[var(--r-lg)] bg-white p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] sm:p-10"
                >
                  <span className="diba-label text-[var(--t-label)]">
                    {d.anders.length} dingen anders
                  </span>
                  <span className="diba-display-s mt-3 block text-[var(--t-strong)]">
                    {d.meta}
                  </span>
                  <span className="mt-4 flex-1 text-[16px] leading-8 text-[var(--t-body)]">
                    {publicCopy(d.korteOmschrijving)}
                  </span>
                  <span className="diba-label mt-7 inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4">
                    Wat er anders is, en wat niet
                    <span aria-hidden="true">›</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Afsluiter ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>En de rest</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Sta je er niet
              <br />
              <span className="diba-accent">tussen?</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Dan verandert er niets aan hoe het hier gaat. Deze vier
              pagina&apos;s bestaan omdat er per groep iets te melden valt, en
              niet omdat de rest ergens anders terechtkan. Alles begint bij
              dezelfde meting, en wat daarna volgt hangt af van wat eruit komt.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Plan Behandeling Nul
              </Link>
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Eerst je vraag stellen
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
