import type { Metadata } from "next";
import Image from "next/image";
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
import { zoekmachineVelden } from "@/lib/seo";
import LeesVerder from "@/components/ui/LeesVerder";

/**
 * Het apparatuuroverzicht.
 *
 * Een apparaatnaam zegt minder dan hij lijkt te zeggen. "Wij hebben de Fotona" klinkt als
 * een belofte, alsof het apparaat het werk doet en de kliniek alleen de stekker erin steekt.
 * Deze pagina begint dus met het tegenovergestelde: een apparaat is gereedschap. Wat telt is de instelling, de hand die
 * het vasthoudt en of het bij jouw huid past.
 *
 * Waarom de pagina er dan toch is: omdat mensen op merknamen zoeken, en omdat je bij elk
 * apparaat kunt laten zien wát het niet kan. Dat laatste is de reden dat deze reeks mag
 * bestaan. Zonder dat zijn het merkfolders.
 *
 * Eén donkergroen vlak: de stelling bovenaan (§5).
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/apparatuur",
  titel: "Onze apparatuur",
  omschrijving:
    "Welke apparaten er in de kliniek staan, welke behandelingen erop draaien, tot hoe diep ze komen en wat ze niet kunnen.",
});

export default function ApparatuurPage() {
  /**
   * Alle apparaten in één rij-volgorde, gesorteerd op categorie.
   *
   * Hiervoor stond er een raster per categorie. Zeven categorieën met 1, 4, 2, 1, 2, 1 en 1
   * apparaat, elk in een raster van drie kolommen: vijf van de zeven rasters hadden dus een
   * halve of driekwart lege rij. Dat is wat de pagina onaf deed lijken — niet de inhoud maar
   * de gaten.
   *
   * Twaalf kaarten achter elkaar vullen vier hele rijen. De categorie is niet weg: die staat
   * nu op de kaart zelf, en filteren kan al in de dieptesectie hierboven.
   */
  const apparaten = APPARAAT_CATEGORIEEN.flatMap((c) =>
    APPARATUUR.filter((a) => a.categorie === c.id).map((a) => ({
      apparaat: a,
      categorie: c.label,
    })),
  );

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)] max-lg:flex max-lg:flex-col">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Apparatuur", url: `${DIBA_SITE_URL}/apparatuur` },
        ])}
      />

      {/* ── Hero ──
          Donker, net als de hero's van home, /behandelingen en /tarieven (Yasin,
          7 september 2026). De mintcirkel en het blad rechtsboven zijn weg: die vulden de
          hoek zonder iets te zeggen, en Yasin vond ze niet mooi. */}
      <section className="bg-[var(--g-700)] text-[var(--on-dark)] max-lg:-order-2">
        <div className="mx-auto grid gap-10 px-5 pt-12 pb-14 sm:px-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-[7.5vw] lg:pt-16 lg:pb-16">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label diba-label-on-dark flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--on-dark-body)]">Apparatuur</span>
            </nav>

            <h1 className="diba-display-l mt-8 max-w-[16ch] text-[var(--on-dark)]">
              De apparatuur
              <br />
              <span className="diba-accent-on-dark">in onze kliniek</span>
            </h1>

            <p className="mt-7 max-w-[56ch] text-[17px] leading-8 text-[var(--on-dark-body)]">
              Een apparaatnaam zegt minder dan hij lijkt te zeggen. Wat het
              verschil maakt is wat er vooraf gemeten is en welke instelling
              daarbij hoort, en niet welk merk er op de kast staat.
            </p>
            <LeesVerder opDonker>
              <p className="mt-4 max-w-[56ch] text-[17px] leading-8 text-[var(--on-dark-body)]">
                Het is andersom. Een apparaat is gereedschap. Wat telt is de
                instelling, de hand die het vasthoudt en of het bij jouw huid
                past. Daarom staat bij elk apparaat hieronder ook wat het níet
                kan.
              </p>
            </LeesVerder>
          </div>

          {/* De rechterkolom was leeg (Yasin, 7 september 2026: "zo leeg en niet leuk").
              Nu een opname van een apparaat in de kliniek, in dezelfde vorm als het beeld
              in de hero van de homepage: ronde hoeken, de grote hoek linksonder, een
              plaatsnaam als pil. Op de telefoon staat het beeld onder de tekst. */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--r-lg)] rounded-bl-[4.5rem] bg-[var(--g-600)] sm:aspect-[16/10] lg:aspect-auto lg:h-[460px] lg:rounded-bl-[8rem]">
            <Image
              src="/images/shoot/kliniek-nordlys-staand.jpg"
              alt="Behandelaar met de Nordlys in de gang van de kliniek"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-[50%_35%]"
            />
            <span className="diba-label absolute top-5 left-5 rounded-[var(--r-pill)] bg-white/90 px-4 py-2 text-[var(--g-700)]">
              In de kliniek
            </span>
          </div>
        </div>
      </section>

      {/* ── De stelling ──
          Licht, want de hero erboven is nu donker en twee donkere vlakken achter elkaar
          mag niet (§5). Het blok blijft een vlak, alleen in de zachte tint. */}
      <section className="px-5 py-10 sm:py-14 sm:px-9 lg:px-[7.5vw] lg:py-20">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-050)] p-8 text-[var(--t-strong)] sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
              <div>
                <Label>Waarom dit ertoe doet</Label>
                <p className="diba-display-s mt-4 max-w-[22ch]">
                  Twee klinieken met hetzelfde apparaat{" "}
                  <span className="diba-accent">
                    {" "}
                    geven niet hetzelfde resultaat.
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[16px] leading-7 text-[var(--t-body)]">
                  Het verschil zit in wat er vooraf gemeten is, welke instelling
                  er wordt gekozen en of iemand durft te zeggen dat een
                  behandeling bij jou niet past. Een merknaam zegt daar niets
                  over.
                </p>
                <LeesVerder>
                  <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
                    Daarom begint elk traject hier met een meting en niet met
                    een apparaat.
                  </p>
                </LeesVerder>
                <Link
                  href="/intake"
                  className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)]"
                >
                  Wat er in een huidconsult gebeurt
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Alles op één schaal ── */}
      {/* Deze pagina beweert dat er twaalf apparaten staan. Een opname van een ervan in de
          kamer maakt dat controleerbaar in plaats van een opsomming. */}
      <section className="px-5 pb-10 sm:pb-14 sm:px-9 lg:px-[7.5vw] lg:pb-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/kliniek-nordlys-behandeling.jpg"
            alt="Huidtherapeut behandelt een client met de Nordlys in de behandelkamer"
            onderschrift="De Nordlys, zoals hij bij ons staat"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/9] lg:aspect-[21/9]"
          />
        </div>
      </section>

      <section className="bg-[var(--g-025)] px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
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
      <section className="px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24 max-lg:-order-1">
        <div className="mx-auto">
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {apparaten.map(({ apparaat: a, categorie }) => (
              <li key={a.slug}>
                <Link
                  href={`/apparatuur/${a.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[var(--r-md)] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  {/* De foto van het apparaat zoals het bij ons staat.

                      Deze lagen al in de repo en waren op deze pagina nergens te zien:
                      twaalf apparaten als tekstregels, terwijl er van tien een foto is. Dat
                      is de tweede reden dat het overzicht half aanvoelde — je leest namen
                      die je niet kent en ziet niet wat je voor je hebt.

                      Waar nog geen foto is blijft het vlak mintgroen met het merkteken: geen
                      persfoto van de fabrikant erbij verzinnen. Een foto van een ander
                      exemplaar is erger dan geen foto. */}
                  <span className="relative block aspect-[2/1] overflow-hidden bg-[var(--g-075)] md:aspect-[16/10]">
                    {a.foto ? (
                      <Image
                        src={a.foto.src}
                        alt={a.foto.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 grid place-items-center text-[var(--g-300)]"
                      >
                        <DibaLeafMark className="h-10 w-10" />
                      </span>
                    )}

                    {/* De categorie hoort bij het apparaat en niet bij een kop erboven.
                        Op de foto kost hij geen regel in de tekst. */}
                    <span className="diba-label absolute left-4 top-4 rounded-[var(--r-pill)] bg-white/90 px-3 py-1.5 text-[var(--g-700)] backdrop-blur-sm">
                      {categorie}
                    </span>
                  </span>

                  <span className="flex flex-1 flex-col p-6 sm:p-7">
                    {a.merk ? (
                      <span className="diba-label text-[var(--t-muted)]">
                        {a.merk}
                      </span>
                    ) : null}
                    <span className="diba-card-title mt-2 text-[var(--t-strong)]">
                      {a.naam}
                    </span>
                    <span className="mt-3 flex-1 text-[15px] leading-7 text-[var(--t-body)] max-md:hidden">
                      {publicCopy(a.kort)}
                    </span>
                    <span className="mt-6 border-t border-[var(--g-100)] pt-4 text-[13px] leading-5 text-[var(--t-muted)]">
                      {a.behandelingen
                        .map((s) => behandelingVoorSlug(s)?.naam)
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Verder ──
          Stond als losse tekst op het paginavlak, terwijl elke andere afsluiter op de site
          in een donkergroen blok met ronde hoeken staat. Nu ook hier. */}
      <section className="px-5 pb-12 sm:pb-20 sm:px-9 lg:px-[7.5vw] lg:pb-28">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <Label opDonker>Verder</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Zoek op wat je
              <br />
              <span className="diba-accent-on-dark">wilt bereiken</span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Wie begint bij de techniek komt uit bij waar het meest over
              geschreven is. Dat is zelden hetzelfde als wat bij jouw huid past.
              Begin bij wat je wil veranderen, of laat het eerst meten.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/behandelingen"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Alle behandelingen
              </Link>
              <Link
                href="/huidprofiel"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/50 px-6 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
