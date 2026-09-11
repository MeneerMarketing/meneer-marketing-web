import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Behandelingenoverzicht from "@/components/behandelingen/Behandelingenoverzicht";
import BehandelingenPerWens, {
  Wenskiezer,
} from "@/components/behandelingen/BehandelingenPerWens";
import Huidreis from "@/components/behandelingen/Huidreis";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import Reviewregel from "@/components/reviews/Reviewregel";
import Label from "@/components/ui/Label";
import Veegrij from "@/components/ui/Veegrij";
import {
  behandelingVoorSlug,
  COMBINATIES,
  prijsTekst,
} from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import { DIBA_SITE_URL } from "@/lib/site";
import LeesVerder from "@/components/ui/LeesVerder";

/**
 * De behandelingenpagina.
 *
 * VIERDE VERSIE, en elke ronde ging over hetzelfde verwijt: het klopt wel, maar het pakt
 * niet. Versie één was een raster met "[COPY-NODIG]". Versie twee was een goed geschreven
 * brochure. Versie drie kreeg de huidreis en werd daarmee een pagina met één sterke tool.
 *
 * Wat er nu bij is, en waardoor het een ervaring wordt in plaats van een tool met tekst
 * eromheen: DE PAGINA ONTHOUDT JOU.
 *
 * Je vult drie dingen in, en de pagina zegt op basis daarvan wat past, wat half past en
 * wat niet past. Dat profiel blijft in je browser staan, dus als je morgen terugkomt staat
 * het er nog. Geen account, geen mailadres, geen server. Het is het voorproefje van Mijn
 * Diba, en meteen de belofte die daar gaat gelden.
 *
 * De opbouw is een trechter die andersom loopt dan gebruikelijk. Niet: hier zijn onze
 * behandelingen, kies er een. Maar: vertel drie dingen, dan zeggen wij welke afvallen.
 * Een kliniek die begint met wat er níet bij je past heeft daarna geen verkooppraatje
 * meer nodig.
 *
 * Ritme in kleur. Zes secties die afwisselen tussen paginavlak, mint en wit, met precies
 * één donkergroen vlak aan het eind (§5). De matchkaarten in het profiel zijn kaarten en
 * geen vlakken; die tellen niet mee, maar ze zijn er wel de reden voor dat de rest van de
 * pagina licht blijft.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/behandelingen",
  titel: "Behandelingen",
  omschrijving:
    "Kies waar je iets aan wilt doen: acne, pigment, littekens, huidveroudering, glow of haar. Tijdens het huidconsult bepaalt de behandelaar wat bij jouw huid past.",
});

const intakeBehandeling = behandelingVoorSlug("huidanalyse");
const intakeBedrag = intakeBehandeling
  ? prijsTekst(intakeBehandeling.prijs)
  : "een vast bedrag";

/**
 * Zes, en dezelfde zes als in het megamenu.
 *
 * Niet "de beste": die vraag krijgt verderop op deze pagina bewust geen antwoord. Dit is
 * waar de meeste afspraken voor gemaakt worden, en dat is controleerbaar.
 *
 * Fotona TimeWalker en het consult met EVE-M staan er niet bij. Het eerste is een apparaat
 * waar zes behandelingen op draaien, het tweede is het startpunt hierboven.
 */
const POPULAIR = [
  "hydrafacial",
  "skinpen",
  "peelings",
  "nordlys-pigment",
  "led-therapie",
  "laserontharing",
]
  .map((slug) => behandelingVoorSlug(slug))
  .filter((b): b is NonNullable<typeof b> => Boolean(b));

/** Onderzoek waarbij er niets aan een huid gedaan wordt. */
const onderzoeken = ["voedingsintolerantietest"]
  .map((slug) => behandelingVoorSlug(slug))
  .filter((b): b is NonNullable<typeof b> => Boolean(b));

export default function BehandelingenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Behandelingen", url: `${DIBA_SITE_URL}/behandelingen` },
        ])}
      />

      {/* ══ Hero ══
          De kop zei "Onze 35 behandelingen van licht tot diep". Twee dingen mis: het aantal
          verandert steeds en zegt de klant niets, en "van licht tot diep" verkoopt de
          diepte als de manier om te kiezen. Niemand komt binnen met een diepte in gedachten.
          De twee mintvlakken en het blad die hier stonden zijn weg; die maakten de hero een
          half scherm hoger zonder iets te zeggen. */}
      {/* Donker, net als de hero van de homepage (Yasin, 7 september 2026: "het ziet er
          nu te wit uit allemaal"). De merkkleur staat er zo voordat iemand scrolt, en
          het lichte vlak met de zeven keuzes eronder krijgt daardoor een rand. */}
      <section className="bg-[var(--g-700)] text-[var(--on-dark)]">
        <div className="mx-auto px-5 pt-12 pb-14 sm:px-9 lg:px-[7.5vw] lg:pt-16 lg:pb-16">
          <nav
            aria-label="Kruimelpad"
            className="diba-label diba-label-on-dark flex flex-wrap gap-2"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--on-dark-body)]">Behandelingen</span>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <div>
              <h1 className="diba-display-l max-w-[15ch] text-[var(--on-dark)]">
                Onze
                <br />
                <span className="diba-accent-on-dark">behandelingen</span>
              </h1>
              {/* Direct onder de kop, zoals op /tarieven. Hij stond in de rechterkolom,
                  los van de kop (Yasin, 7 september 2026: "waarom heeft de titel geen
                  subtekstje"). */}
              <p className="mt-6 max-w-[54ch] text-[17px] leading-8 text-[var(--on-dark-body)]">
                Je hoeft vooraf niet te weten welke behandeling je nodig hebt.
                Kies wat je wilt verbeteren. Tijdens het huidconsult beoordeelt
                de behandelaar welke aanpak bij jouw huid past.
              </p>

              {/* Hier stonden drie cijfers en een link naar de reviews. Yasin, 10
                  september 2026: eraf. Wie op deze pagina komt zoekt een behandeling, en
                  het cijfer staat al in de balk bovenaan elke pagina. */}
            </div>

            {/* De rechterkolom was leeg op drie cijfers na (Yasin, 7 september 2026: "zo
                leeg en niet leuk"). Nu een opname uit de behandelkamer, in dezelfde vorm
                als het beeld in de hero van de homepage. Op de telefoon onder de tekst. */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--r-lg)] rounded-bl-[4.5rem] bg-[var(--g-600)] sm:aspect-[16/10] lg:aspect-auto lg:h-[460px] lg:rounded-bl-[8rem]">
              <Image
                src="/images/shoot/hero-behandeling.jpg"
                alt="Laserbehandeling in de behandelkamer, met oogbescherming voor behandelaar en cliënt"
                fill
                priority
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover object-[50%_40%]"
              />
              <span className="diba-label absolute top-5 left-5 rounded-[var(--r-pill)] bg-white/90 px-4 py-2 text-[var(--g-700)]">
                In de kliniek
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ De zeven keuzes ══
          Dit is de hoofdnavigatie van de pagina geworden. Ze springen naar de blokken
          verderop, zodat je niet eerst door een uitleg over huidlagen heen moet. */}
      <section className="bg-[var(--g-050)] px-5 py-10 sm:px-9 lg:px-[7.5vw] lg:py-12">
        <div className="mx-auto">
          <Label>Waar wil je iets aan doen</Label>
          <div className="mt-5">
            <Wenskiezer />
          </div>
        </div>
      </section>

      {/* ══ Alles, per huidwens ══ */}
      <section
        id="alles"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <Label>Alles op een rij</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Alle behandelingen,{" "}
            <span className="diba-accent">op wat je wilt bereiken</span>
          </h2>
          <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
            Een behandeling kan onder meerdere kopjes staan. Een medische
            peeling doet iets bij acne, bij pigment en bij een doffe huid, en
            welke van die drie het bij jou wordt hangt af van de sterkte die de
            behandelaar kiest.
          </p>

          <div className="mt-14">
            <BehandelingenPerWens />
          </div>
        </div>
      </section>

      {/* ══ Onderzoek en gezondheid ══
          De voedingsintolerantietest stond tussen de huidbehandelingen. Het is een
          bloedafname en geen huidbehandeling, en de claims eromheen moeten nog nagekeken
          worden voor die groter uitgemeten worden. [MEDISCHE-CHECK-ROJDA] */}
      {/* Yasin, 10 september 2026: "die sectie is nog te wit en saai, geef dat een
          blokje." Klopte: één witte kaart op een bijna-witte pagina is geen kaart maar een
          alinea. Nu staat het geheel in een groen vlak, met de kaart wit erin, en het staat
          hoger op de pagina. */}
      {onderzoeken.length > 0 ? (
        <section className="px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-20">
          <div className="mx-auto rounded-[var(--r-xl)] bg-[var(--g-050)] p-7 sm:p-10 lg:p-14">
            <Label>Onderzoek en gezondheid</Label>
            <h2 className="diba-display-s mt-3 max-w-[24ch]">
              Onderzoek <span className="diba-accent">dat we ook doen</span>
            </h2>
            <p className="mt-4 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
              Niet elke afspraak gaat over je huid. Dit onderzoek doen we ook,
              en het staat hier omdat mensen het bij ons aanvragen zonder dat ze
              een behandeling zoeken.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {onderzoeken.map((b) => (
                <li key={b.slug} className="min-w-0">
                  <Link
                    href={`/behandelingen/${b.slug}`}
                    className="flex h-full min-w-0 flex-col rounded-[var(--r-lg)] border border-[var(--g-100)] bg-white p-6 transition-colors duration-300 [transition-timing-function:var(--ease-diba)] hover:border-[var(--g-700)] hover:bg-[var(--g-025)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                  >
                    <p className="diba-card-title text-[var(--t-strong)]">
                      {b.naam}
                    </p>
                    <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                      {publicCopy(b.kort)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ══ Meest gevraagd ══
          Zes, en dezelfde zes als in het menu. Niet "de beste", want dat is de vraag die
          verderop op deze pagina geen antwoord krijgt. */}
      <section className="bg-white px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-20">
        <div className="mx-auto">
          <Label>Meest gevraagd</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Waar mensen het vaakst{" "}
            <span className="diba-accent">voor komen</span>
          </h2>
          <ul className="mt-8 sm:mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAIR.map((b) => (
              /* min-w-0 op kaart en regel: het afgekapte apparaatlabel had anders een
                 minimale breedte van zijn hele tekst, en op een telefoon duwde dat de
                 hele kaart 80px buiten het scherm, prijs en al. */
              <li key={b.slug} className="min-w-0">
                <Link
                  href={`/behandelingen/${b.slug}`}
                  className="flex h-full min-w-0 flex-col rounded-[var(--r-lg)] bg-[var(--g-025)] p-6 transition-colors duration-300 [transition-timing-function:var(--ease-diba)] hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  <p className="diba-card-title text-[var(--t-strong)]">
                    {b.naam}
                  </p>
                  <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)] max-md:hidden md:min-h-[3lh]">
                    {publicCopy(b.kort)}
                  </p>
                  <p className="diba-label mt-5 flex min-w-0 items-baseline justify-between gap-3 text-[var(--t-muted)]">
                    <span className="min-w-0 truncate" title={b.apparaat}>
                      {b.apparaat ?? ""}
                    </span>
                    <span className="shrink-0 text-[var(--g-700)]">
                      {b.prijs === 0
                        ? "Op aanvraag"
                        : `vanaf ${prijsTekst(b.prijs)}`}
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ Veelgekozen combinaties ══
          Deze stonden nergens, terwijl ze wel op de tarievenlijst staan. Als losse kaarten
          zouden ze het overzicht verdubbelen; als blok zijn ze wat ze zijn: twee
          behandelingen in dezelfde afspraak. */}
      {/* Op een vlak, want de kaarten zijn wit en de pagina is dat bijna ook: je zag
          geen kaarten maar zeven alinea's onder elkaar (Yasin, 10 september 2026). */}
      <section className="bg-[var(--g-050)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
            <div>
              <Label>Vaak samen</Label>
              <h2 className="diba-display-m mt-4 max-w-[16ch]">
                Twee behandelingen,{" "}
                <span className="diba-accent">één afspraak</span>
              </h2>
            </div>
            <p className="max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]">
              Sommige behandelingen doen meer naast elkaar dan achter elkaar.
              Wat er in jouw geval kan hangt af van je huid op dat moment; de
              behandelaar bepaalt tijdens de afspraak of de tweede stap
              doorgaat.
            </p>
          </div>

          <Veegrij
            label="Veelgekozen combinaties"
            klasse="-mx-5 mt-8 sm:-mx-9 sm:mt-12 lg:-mx-[7.5vw]"
            breedte="w-[82%] max-w-[420px] sm:w-[46%] lg:w-[31%]"
            items={COMBINATIES.map((c) => {
              const delen = c.delen
                .map((slug) => behandelingVoorSlug(slug))
                .filter(Boolean);
              if (delen.length < 2) return null;
              return {
                sleutel: c.delen.join("-"),
                naam: delen.map((b) => b!.naam).join(" en "),
                inhoud: (
                  <div className="flex h-full flex-col rounded-[var(--r-lg)] bg-white p-6">
                    {/* De twee namen onder elkaar met een plus ertussen, in plaats van
                      "A + B" op één regel. Zo zie je in één oogopslag dat het er twee
                      zijn, en breekt de langste naam niet midden in de combinatie af. */}
                    <ul className="space-y-1.5">
                      {delen.map((b, n) => (
                        <li key={b!.slug}>
                          {n > 0 ? (
                            <span
                              aria-hidden="true"
                              className="mb-1.5 block h-px w-6 bg-[var(--g-200)]"
                            />
                          ) : null}
                          <Link
                            href={`/behandelingen/${b!.slug}`}
                            className="diba-card-title text-[var(--t-strong)] underline decoration-[var(--g-200)] underline-offset-4 transition-colors hover:decoration-[var(--g-700)]"
                          >
                            {b!.naam}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 grow text-[15px] leading-7 text-[var(--t-body)]">
                      {c.waarom}
                    </p>
                  </div>
                ),
              };
            }).filter((x) => x !== null)}
          />

          <p className="mt-8 max-w-[58ch] text-[15px] leading-7 text-[var(--t-muted)]">
            De tarieven van de combinaties staan bij de losse behandelingen op
            de{" "}
            <Link
              href="/tarieven"
              className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              tarievenpagina
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ══ Weet je het niet ══
          Okan, 5 september 2026: dit moet een opvallende kaart bovenaan het overzicht zijn.
          De zeven keuzes hierboven werken tot iemand tussen een peeling, een laser en
          microneedling moet kiezen; daar houdt zelf uitzoeken op. */}
      {/* Eén review tussen de blokken, klein (Yasin, 10 september 2026). */}
      <section className="px-5 pt-8 sm:px-9 lg:px-[7.5vw]">
        <div className="mx-auto">
          <Reviewregel keuze={1} />
        </div>
      </section>

      <section className="px-5 pt-10 sm:px-9 lg:px-[7.5vw] lg:pt-12">
        <div className="mx-auto">
          <Link
            href="/behandeling-op-advies"
            className="group flex flex-col gap-6 rounded-[var(--r-lg)] border border-[var(--g-200)] bg-white p-8 transition-colors duration-300 [transition-timing-function:var(--ease-diba)] hover:border-[var(--g-700)] hover:bg-[var(--g-025)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
          >
            <div>
              <span className="diba-label text-[var(--g-700)]">
                Weet je het niet
              </span>
              <p className="diba-display-s mt-3 max-w-[22ch] text-[var(--t-strong)]">
                Boek een behandeling op advies
              </p>
              <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
                Je weet wat je aan je huid wilt verbeteren, maar niet of daar
                een peeling, een laser of microneedling bij hoort. Vertel wat je
                stoort; de behandelaar kiest en legt uit waarom.
              </p>
            </div>
            <span className="diba-label inline-flex min-h-12 shrink-0 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)]">
              Zo werkt het
            </span>
          </Link>
        </div>
      </section>

      {/* ══ Het startpunt ══
          De huidanalyse stond tussen de behandelingen. Het is er geen: er gebeurt niets aan
          je huid. Okan: maak er het startpunt van, en zeg erbij dat de behandelaar bepaalt
          en niet de scanner. */}
      <section className="px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-20">
        <div className="mx-auto grid gap-8 rounded-[var(--r-lg)] bg-white p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:p-12">
          <div>
            <Label>Begin hier</Label>
            <h2 className="diba-display-s mt-3 max-w-[20ch]">
              Weet je niet wat bij{" "}
              <span className="diba-accent">jouw huid past?</span>
            </h2>
            <p className="mt-5 max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]">
              Begin met een huidconsult. De behandelaar beoordeelt je huid en
              gebruikt de EVE-M als aanvullende meting. Het apparaat levert de
              cijfers; de keuze blijft bij de mens die tegenover je zit.
            </p>
            <LeesVerder>
              <p className="mt-4 max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]">
                Het consult kost {intakeBedrag} en duurt dertig minuten. Wil je
                in dezelfde afspraak behandeld worden, boek dan een behandeling
                op advies; dat bedrag gaat er dan weer af.
              </p>
            </LeesVerder>
          </div>
          <div className="diba-knoprij lg:justify-end">
            <Link
              href="/intake"
              className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              <span className="sm:hidden">Huidconsult</span>
              <span className="max-sm:hidden">Plan een huidconsult</span>
            </Link>
            <Link
              href="/huidprofiel"
              className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-[var(--g-200)] px-6 text-[var(--t-strong)] transition-colors hover:border-[var(--g-700)] hover:bg-[var(--g-075)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              <span className="sm:hidden">Huidprofiel</span>
              <span className="max-sm:hidden">
                Of maak eerst je huidprofiel
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ De huidreis ══
          Stond hoog op de pagina als de manier om te kiezen. Okan: de diepte mag blijven
          als educatief onderdeel, maar lager. Dat is waar hij nu staat.

          Op een telefoon staat hij helemaal niet meer (Yasin, 10 september 2026). De
          sonde die je door de huidlagen sleept vraagt om een muis en om ruimte; op 375
          pixels is het een blok dat je voorbijscrolt. Hij blijft in de HTML staan, dus
          Google leest hem gewoon. */}
      <section className="bg-white px-5 py-12 max-lg:hidden sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
            <div>
              <Label>Goed om te weten</Label>
              <h2 className="diba-display-m mt-4 max-w-[16ch]">
                Waar het aankomt
                <br />
                <span className="diba-accent">bepaalt de rest</span>
              </h2>
            </div>
            <p className="max-w-[46ch] text-[16px] leading-7 text-[var(--t-body)]">
              Sleep de sonde door je huid naar beneden. Hoe dieper je komt, hoe
              minder behandelingen er nog bij zijn. Daar hangt aan vast hoe lang
              je rood bent en hoe vaak je terug moet. Kiezen doe je er niet mee;
              begrijpen wel.
            </p>
          </div>

          <div className="mt-12">
            <Huidreis />
          </div>
        </div>
      </section>

      {/* ══ Liever filteren ══
          De oude ingang. Hij filtert op hersteltijd en op je huidprofiel, en dat is iets
          wat de indeling hierboven niet doet. */}
      {/* Negen schermen filter op een telefoon, onder een lijst die daar al alles toont:
          Yasin, 10 september 2026, "mag op mobiel helemaal weg". Op een groot scherm staat
          hij naast de lijst en doet hij wel werk. */}
      <section className="bg-[var(--g-025)] px-5 py-12 max-lg:hidden sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto">
          <Label>Of filter zelf</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Hoeveel hersteltijd{" "}
            <span className="diba-accent">heb je eigenlijk?</span>
          </h2>
          <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
            Dat filter staat nergens anders, terwijl het vaak het meest bepaalt.
            Vul je huidprofiel in en de lijst zet bovenaan wat bij je past, met
            bij de rest waarom niet.
          </p>

          <div className="mt-12">
            <Behandelingenoverzicht />
          </div>
        </div>
      </section>

      {/* ══ Afsluiter ══ */}
      <section className="px-5 pb-12 sm:pb-20 sm:px-9 lg:px-[7.5vw] lg:pb-28">
        <div className="mx-auto">
          <div className="relative overflow-hidden rounded-[var(--r-xl)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-14">
            <DibaLeafMark
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -bottom-10 h-[260px] w-[260px] -rotate-12 opacity-20"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
              <div>
                <Label opDonker>Beginnen</Label>
                <h2 className="diba-display-m mt-4 max-w-[16ch]">
                  Zo kies je
                  <br />
                  <span className="diba-accent-on-dark">een behandeling</span>
                </h2>
              </div>

              <div>
                <p className="max-w-[50ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                  In het huidconsult kijken we onder vast licht wat er bij jou
                  aan de hand is. Neem je huidprofiel mee: dan hoef je het
                  gesprek niet bij nul te beginnen.
                </p>
                <div className="mt-8 diba-knoprij">
                  <Link
                    href="/intake"
                    className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span className="sm:hidden">Huidconsult</span>
                    <span className="max-sm:hidden">Plan een huidconsult</span>
                  </Link>
                  <Link
                    href="/huidproblemen"
                    className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/50 px-6 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span className="sm:hidden">Huidprobleem</span>
                    <span className="max-sm:hidden">
                      Of begin bij je huidprobleem
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
