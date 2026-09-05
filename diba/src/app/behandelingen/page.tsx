import type { Metadata } from "next";
import Link from "next/link";
import Behandelingenoverzicht from "@/components/behandelingen/Behandelingenoverzicht";
import BehandelingenPerWens, {
  Wenskiezer,
} from "@/components/behandelingen/BehandelingenPerWens";
import Huidreis from "@/components/behandelingen/Huidreis";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import Label from "@/components/ui/Label";
import {
  behandelingVoorSlug,
  COMBINATIES,
  prijsTekst,
} from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_SALONIZED_RATING,
  DIBA_SALONIZED_REVIEWS_URL,
  DIBA_SALONIZED_REVIEW_COUNT,
  DIBA_SITE_URL,
} from "@/lib/site";

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

const TROTS = [
  {
    getal: `${DIBA_SALONIZED_RATING.toLocaleString("nl-NL", { minimumFractionDigits: 1 })}`,
    bij: "op Salonized",
  },
  {
    getal: DIBA_SALONIZED_REVIEW_COUNT.toLocaleString("nl-NL"),
    bij: "reviews",
  },
  { getal: "2017", bij: "open in Rotterdam" },
] as const;

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

/** Wat geen huidbehandeling is maar wel bij ons gebeurt. */
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
      <section className="mx-auto px-5 pt-12 pb-10 sm:px-9 lg:px-[7.5vw] lg:pt-16">
        <nav
          aria-label="Kruimelpad"
          className="diba-label flex flex-wrap gap-2"
        >
          <Link href="/" className="hover:text-[var(--g-700)]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--t-muted)]">Behandelingen</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <h1 className="diba-display-l max-w-[15ch]">
            Onze
            <br />
            <span className="diba-accent">behandelingen</span>
          </h1>

          <div>
            <p className="max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Je hoeft vooraf niet te weten welke behandeling je nodig hebt.
              Kies wat je wilt verbeteren. Tijdens het huidconsult beoordeelt de
              behandelaar welke aanpak bij jouw huid past.
            </p>

            {/* Bewijs in één regel in plaats van een cijferbalk. Kleiner, en het
                onderbreekt de pagina niet halverwege. */}
            <ul className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
              {TROTS.map((t) => (
                <li key={t.bij} className="flex items-baseline gap-2">
                  <span className="text-[19px] leading-7 font-medium text-[var(--g-700)] tabular-nums">
                    {t.getal}
                  </span>
                  <span className="text-[14px] leading-6 text-[var(--t-muted)]">
                    {t.bij}
                  </span>
                </li>
              ))}
              <li>
                <a
                  href={DIBA_SALONIZED_REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                >
                  Lees ze zelf
                </a>
              </li>
            </ul>
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

      {/* ══ Weet je het niet ══
          Okan, 5 september 2026: dit moet een opvallende kaart bovenaan het overzicht zijn.
          De zeven keuzes hierboven werken tot iemand tussen een peeling, een laser en
          microneedling moet kiezen; daar houdt zelf uitzoeken op. */}
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
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-20">
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
            <p className="mt-4 max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]">
              Het consult kost {intakeBedrag} en duurt maximaal een uur. Word je
              in dezelfde afspraak behandeld, dan gaat dat bedrag er weer af.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <Link
              href="/intake"
              className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              Plan een huidconsult
            </Link>
            <Link
              href="/huidprofiel"
              className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-[var(--g-200)] px-6 text-[var(--t-strong)] transition-colors hover:border-[var(--g-700)] hover:bg-[var(--g-075)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              Of maak eerst je huidprofiel
            </Link>
          </div>
        </div>
      </section>

      {/* ══ Meest gevraagd ══
          Zes, en dezelfde zes als in het menu. Niet "de beste", want dat is de vraag die
          verderop op deze pagina geen antwoord krijgt. */}
      <section className="bg-white px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-20">
        <div className="mx-auto">
          <Label>Meest gevraagd</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Waar mensen het vaakst{" "}
            <span className="diba-accent">voor komen</span>
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAIR.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/behandelingen/${b.slug}`}
                  className="flex h-full flex-col rounded-[var(--r-lg)] bg-[var(--g-025)] p-6 transition-colors duration-300 [transition-timing-function:var(--ease-diba)] hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  <p className="diba-card-title text-[var(--t-strong)]">
                    {b.naam}
                  </p>
                  <p className="mt-3 min-h-[3lh] text-[15px] leading-7 text-[var(--t-body)]">
                    {publicCopy(b.kort)}
                  </p>
                  <p className="diba-label mt-5 flex items-baseline justify-between gap-3 text-[var(--t-muted)]">
                    <span className="truncate" title={b.apparaat}>
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

      {/* ══ Alles, per huidwens ══ */}
      <section
        id="alles"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
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

      {/* ══ Veelgekozen combinaties ══
          Deze stonden nergens, terwijl ze wel op de tarievenlijst staan. Als losse kaarten
          zouden ze het overzicht verdubbelen; als blok zijn ze wat ze zijn: twee
          behandelingen in dezelfde afspraak. */}
      <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
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

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMBINATIES.map((c) => {
              const delen = c.delen
                .map((slug) => behandelingVoorSlug(slug))
                .filter(Boolean);
              if (delen.length < 2) return null;
              return (
                <li
                  key={c.delen.join("-")}
                  className="rounded-[var(--r-lg)] bg-white p-6"
                >
                  <p className="diba-card-title text-[var(--t-strong)]">
                    {delen.map((b) => b!.naam).join(" + ")}
                  </p>
                  <p className="mt-3 min-h-[3lh] text-[15px] leading-7 text-[var(--t-body)]">
                    {c.waarom}
                  </p>
                  <ul className="diba-label mt-5 flex flex-wrap gap-x-4 gap-y-2">
                    {delen.map((b) => (
                      <li key={b!.slug}>
                        <Link
                          href={`/behandelingen/${b!.slug}`}
                          className="text-[var(--g-700)] underline underline-offset-4 transition-colors hover:text-[var(--g-800)]"
                        >
                          {b!.naam}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>

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

      {/* ══ De huidreis ══
          Stond hoog op de pagina als de manier om te kiezen. Okan: de diepte mag blijven
          als educatief onderdeel, maar lager. Dat is waar hij nu staat. */}
      <section className="bg-white px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
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
      <section className="bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
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

      {/* ══ Onderzoek en gezondheid ══
          De voedingsintolerantietest stond tussen de huidbehandelingen. Het is een
          bloedafname en geen huidbehandeling, en de claims eromheen moeten nog nagekeken
          worden voor die groter uitgemeten worden. [MEDISCHE-CHECK-ROJDA] */}
      {onderzoeken.length > 0 ? (
        <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-20">
          <div className="mx-auto">
            <Label>Onderzoek en gezondheid</Label>
            <h2 className="diba-display-s mt-3 max-w-[24ch]">
              Geen huidbehandeling,{" "}
              <span className="diba-accent">wel bij ons te doen</span>
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {onderzoeken.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/behandelingen/${b.slug}`}
                    className="flex h-full flex-col rounded-[var(--r-lg)] bg-white p-6 transition-colors duration-300 [transition-timing-function:var(--ease-diba)] hover:bg-[var(--g-075)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
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

      {/* ══ De eerlijke tegenhanger ══ */}
      <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Wat hier niet staat</Label>
            <h2 className="diba-display-m mt-4 max-w-[18ch]">
              Waarom hier niet staat{" "}
              <span className="diba-accent">welke de beste is</span>
            </h2>
            <DibaLeafMark
              aria-hidden="true"
              className="mt-10 hidden h-24 w-24 opacity-70 lg:block"
            />
          </div>

          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Die vraag heeft geen antwoord zonder jouw huid erbij. Dieper is
              niet beter, duurder is niet beter, en nieuwer al helemaal niet.
              Een behandeling is passend of niet passend, en dat verschilt per
              persoon en per moment.
            </p>
            <p className="mt-5 text-[17px] leading-8 text-[var(--t-body)]">
              Ook je huidprofiel hierboven geeft geen advies. Het legt naast
              elkaar wat jij hebt ingevuld en wat een behandeling doet, en zegt
              waar dat wringt. Dat is iets anders dan een aanbeveling, en het is
              bewust iets anders.
            </p>
            <p className="mt-5 text-[17px] leading-8 text-[var(--t-body)]">
              Wat bij jou past hoor je na de meting, van een mens. Soms is dat
              geen van de vijf.
            </p>
          </div>
        </div>
      </section>

      {/* ══ Afsluiter ══ */}
      <section className="px-5 pb-20 sm:px-9 lg:px-[7.5vw] lg:pb-28">
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
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/intake"
                    className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Plan een huidconsult
                  </Link>
                  <Link
                    href="/huidproblemen"
                    className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/50 px-6 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Of begin bij je huidprobleem
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
