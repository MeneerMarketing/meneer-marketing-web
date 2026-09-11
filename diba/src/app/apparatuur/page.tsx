import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Dieptevergelijker from "@/components/apparatuur/Dieptevergelijker";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import BeeldVignet from "@/components/ui/BeeldVignet";
import Label from "@/components/ui/Label";
import { APPARAAT_CATEGORIEEN, APPARATUUR } from "@/data/apparatuur";
import { behandelingVoorSlug, prijsCijfer } from "@/data/behandelingen";
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

/**
 * De regel onder de haarlijn op een kaart: waarvoor het apparaat gebruikt wordt.
 *
 * Hij mag één regel zijn. Uitgeschreven werd dat bij de Fotona een blok van vijf regels,
 * en een raster van kaarten waarin één kaart vijf regels langer is dan de rest komt
 * nergens meer uit (Yasin, 10 september 2026: "die dikke gestapelde lijst moet weg, noem er
 * twee en zeg 'en meer'").
 */
const consult = behandelingVoorSlug("huidanalyse");
const intakeBedrag = consult ? `${prijsCijfer(consult.prijs)} euro` : "50 euro";

function waarvoor(slugs: readonly string[]): string {
  const namen = slugs
    .map((s) => behandelingVoorSlug(s)?.naam)
    .filter((n): n is string => Boolean(n));
  if (namen.length === 0) return "";
  if (namen.length <= 2) return namen.join(" en ");
  return `${namen[0]}, ${namen[1]} en nog ${namen.length - 2}`;
}

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
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
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
      <section className="bg-[var(--g-700)] text-[var(--on-dark)]">
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
              /* Op 35 procent viel het hoofd van de behandelaar buiten het kader
                 (Yasin, 10 september 2026). Op 12 staat ze er helemaal op. */
              className="object-cover object-[50%_12%]"
            />
            <span className="diba-label absolute top-5 left-5 rounded-[var(--r-pill)] bg-white/90 px-4 py-2 text-[var(--g-700)]">
              In de kliniek
            </span>
          </div>
        </div>
      </section>

      {/* ── De apparaten ──
          Op een vlak, want de kaarten zijn wit en de pagina is dat bijna ook: je zag alleen
          bij hover dat het kaarten waren (Yasin, 10 september 2026). En dit staat nu direct
          onder de hero, want dit is waar de pagina over gaat. */}
      <section className="bg-[var(--g-050)] px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
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
                    {/* Altijd een regel, ook zonder merk. De EVE-M heeft er geen, en
                        daardoor begon zijn naam een regel hoger dan die van de kaarten
                        ernaast en liep de hele kaart uit de pas (Yasin, 10 september
                        2026: "dat oogt niet strak"). */}
                    <span className="diba-label min-h-[1lh] text-[var(--t-muted)]">
                      {a.merk ?? ""}
                    </span>
                    <span className="diba-card-title mt-2 text-[var(--t-strong)]">
                      {a.naam}
                    </span>
                    {/* De beschrijving stond op een telefoon uit. Dan las je merk, naam en
                        daaronder een rij behandelnamen, en bij de Dermapen 4 stond er onder
                        "Dermapen 4" nog een keer "Dermapen 4" (Yasin, 10 september 2026). */}
                    <span className="mt-3 flex-1 text-[15px] leading-7 text-[var(--t-body)]">
                      {publicCopy(a.kort)}
                    </span>
                    {/* Twee namen en dan "en nog X". De Fotona draagt vijftien
                        behandelingen; uitgeschreven werd dat een blok van vijf regels
                        onderaan één kaart, waardoor geen enkele kaart meer uitkwam. */}
                    <span className="mt-6 border-t border-[var(--g-100)] pt-4 text-[13px] leading-5 text-[var(--t-muted)]">
                      {waarvoor(a.behandelingen)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
                {/* De merkenpagina hing tot 10 september 2026 aan een blok op
                    /kwaliteit-en-registraties dat eruit is gegaan, en had daarna geen enkele
                    verwijzing meer in een tekst staan. Hier hoort hij: dit is de alinea die
                    zegt dat een merknaam niets zegt, en wie dan tóch wil weten welke er
                    staan klikt hier door. */}
                <Link
                  href="/partners"
                  className="diba-label mt-4 inline-block text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                >
                  Welke merken hier staan
                </Link>
                <Link
                  href="/intake"
                  className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)]"
                >
                  <span className="sm:hidden">Huidconsult</span>
                  <span className="max-sm:hidden">
                    Wat er in een huidconsult gebeurt
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Alles op één schaal ── */}
      {/* Deze pagina beweert dat er twaalf apparaten staan. Een opname van een ervan in de
          kamer maakt dat controleerbaar in plaats van een opsomming. */}
      <section className="px-5 py-10 sm:px-9 sm:py-14 lg:px-[7.5vw] lg:py-16">
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

      {/* Yasin, 10 september 2026: de kop "12 apparaten, één schaal" zegt niets, en de
          schuifbalk waarmee je door de huidlagen gaat is op een telefoon een blok dat je
          voorbijscrolt. De kop noemt nu waar het over gaat, en op een telefoon staat de
          sectie uit. Hij blijft in de HTML, dus Google leest hem gewoon. */}
      <section className="bg-[var(--g-025)] px-5 py-10 max-lg:hidden sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Naast elkaar</Label>
            <h2 className="diba-display-m mt-4">
              Hoe diep komt <span className="diba-accent">welk apparaat</span>
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

      {/* ── Afsluiter ──
          Er stond "Zoek op wat je wilt bereiken", met een alinea over mensen die bij de
          techniek beginnen. Yasin, 10 september 2026: "dat is zweverig, maak er een simpele
          afsluiter van in begrijpelijke taal en conversiegericht." Er staat nu wat de
          volgende stap is, hoe lang die duurt en wat hij kost. De witruimte eronder is
          gehalveerd; die was ruimer dan bij welke andere afsluiter ook. */}
      <section className="px-5 pb-8 sm:pb-12 sm:px-9 lg:px-[7.5vw] lg:pb-16">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <Label opDonker>De volgende stap</Label>
            <h2 className="diba-display-m mt-4 max-w-[18ch]">
              Welk apparaat bij jou past,{" "}
              <span className="diba-accent-on-dark">
                hoor je in het consult
              </span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Een huidtherapeut kijkt naar je huid, meet mee met de EVE-M en
              vertelt welke behandeling erbij past, hoe vaak je moet komen en
              wat het kost. Dertig minuten, {intakeBedrag}, en je beslist daarna
              zelf.
            </p>
            <div className="mt-8 diba-knoprij">
              <Link
                href="/afspraak"
                className="diba-label inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="sm:hidden">Afspraak</span>
                <span className="max-sm:hidden">Afspraak maken</span>
              </Link>
              <Link
                href="/tarieven"
                className="diba-label inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--r-pill)] border border-white/50 px-6 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Tarieven
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
