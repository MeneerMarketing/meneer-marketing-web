import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/ui/Label";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * Kwaliteit en registraties.
 *
 * OKAN, 5 SEPTEMBER 2026, met een lijstje registers en de vraag om ze op de site te zetten,
 * met de voorwaarde dat er alleen staat wat vaststaat. ROJDA, 6 SEPTEMBER 2026, met het
 * antwoord:
 *
 *   - De huidtherapeuten zijn lid van de Nederlandse Vereniging van Huidtherapeuten (NVH)
 *     en staan in het Kwaliteitsregister Paramedici (KP). Voor NVH-leden is die
 *     registratie verplicht.
 *   - De schoonheidsspecialisten zijn aangesloten bij ANBOS en staan in het SKIN Register,
 *     het kwaliteitsregister dat individuele schoonheidsspecialisten registreert.
 *   - Klachten lopen via de ANBOS-klachtenregeling: eerst met ons; komen we er niet uit,
 *     dan de onafhankelijke klachtenfunctionaris van het Centraal Bureau
 *     Klachtenmanagement in de Zorg (CBKZ); helpt bemiddeling niet, dan de
 *     Geschillencommissie Uiterlijke Verzorging.
 *
 * Eerder (3 september) bevestigde ze het contract met alle zorgverzekeraars. Alles op deze
 * pagina is dus bevestigd; er staat niets "waarschijnlijk".
 *
 * GEEN LOGO'S. Een logo is een keurmerk, en een keurmerk zegt pas iets als je weet wat
 * erachter zit. Hier staat wat een registratie inhoudt en wat de drempel ervoor is; dat is
 * te controleren en het zegt meer dan een plaatje.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/kwaliteit-en-registraties",
  titel: "Kwaliteit en registraties",
  omschrijving:
    "Bij welke registers Diba Clinics, de huidtherapeuten en de schoonheidsspecialisten zijn aangesloten, wat die registratie inhoudt en hoe een klacht loopt.",
});

const BEVESTIGD = [
  {
    naam: "Nederlandse Vereniging van Huidtherapeuten",
    wie: "Onze huidtherapeuten",
    wat: "De beroepsvereniging van huidtherapeuten. Wie lid is, moet geregistreerd staan in het Kwaliteitsregister Paramedici; het een kan niet zonder het ander.",
    waarom:
      "Een beroepsvereniging schrijft de beroepscode en de richtlijnen waaraan een huidtherapeut zich te houden heeft. Dat is een norm van buiten de kliniek.",
    link: { label: "Wie er werkt en met welke titel", href: "/team" },
  },
  {
    naam: "Kwaliteitsregister Paramedici",
    wie: "Onze huidtherapeuten",
    wat: "Het register is vrijwillig en de drempel is echt: opnieuw registreren elke vijf jaar, en daarvoor minstens 1600 werkuren over minimaal 36 maanden aantonen plus 160 punten bijscholing.",
    waarom:
      "Huidtherapeut is een beschermde titel (artikel 34 van de Wet BIG). De titel zegt dat iemand de opleiding heeft gedaan; het register zegt dat iemand het vak ook echt uitoefent en bijhoudt.",
    link: { label: "Vergoeding per verzekeraar", href: "/vergoedingen" },
  },
  {
    naam: "ANBOS",
    wie: "De kliniek en onze schoonheidsspecialisten",
    wat: "De brancheorganisatie voor schoonheidsspecialisten. Aangesloten salons werken volgens de gedragscode en de hygiënerichtlijnen van de branche, en vallen onder de ANBOS-klachtenregeling.",
    waarom:
      "Het deel van ons werk dat niet paramedisch is, valt hieronder. Ook daar hoort een norm bij die iemand anders dan wijzelf heeft opgeschreven, en een klachtroute die niet bij ons ophoudt.",
    link: { label: "Hoe een klacht loopt", href: "#klachten" },
  },
  {
    naam: "SKIN Register",
    wie: "Onze schoonheidsspecialisten",
    wat: "Het kwaliteitsregister voor schoonheidsspecialisten. Het registreert mensen, geen salons: elke schoonheidsspecialist staat er op eigen naam in.",
    waarom:
      "Schoonheidsspecialist is geen beschermde titel. Het register is de manier om te zien dat iemand het vak geleerd heeft en het bijhoudt.",
    link: { label: "Wie er werkt en met welke titel", href: "/team" },
  },
  {
    naam: "Gecontracteerd bij alle zorgverzekeraars",
    wie: "De kliniek",
    wat: "Er is een contract met alle Nederlandse zorgverzekeraars. Dat betekent niet dat alles vergoed wordt: wat je terugkrijgt hangt af van je aanvullende polis en van de indicatie.",
    waarom:
      "Het scheelt je het gedoe van voorschieten en declareren op de behandelingen die wél onder je polis vallen.",
    link: { label: "Vergoeding per verzekeraar", href: "/vergoedingen" },
  },
] as const;

/**
 * De klachtroute, in de volgorde waarin je hem loopt.
 *
 * Eerst wat je nú kunt doen, dan pas de formele weg. Wie alleen de eerste stap leest,
 * heeft genoeg; wie verder moet, ziet dat de route niet bij ons ophoudt.
 */
const KLACHTROUTE = [
  {
    kop: "Eerst met ons",
    tekst:
      "Zeg het tegen je behandelaar, of tegen iemand anders van het team als dat makkelijker is. Het meeste is in een gesprek op te lossen, en dat is ook de eerste stap van de ANBOS-klachtenregeling waar wij onder vallen.",
  },
  {
    kop: "Dan de onafhankelijke klachtenfunctionaris",
    tekst:
      "Komen we er samen niet uit, dan kun je terecht bij de klachtenfunctionaris van het Centraal Bureau Klachtenmanagement in de Zorg (CBKZ). Die staat los van ons, kiest geen partij, kost je niets en bemiddelt.",
    link: { label: "cbkz.nl", href: "https://www.cbkz.nl" },
  },
  {
    kop: "Helpt bemiddeling niet: de geschillencommissie",
    tekst:
      "Dan kun je het geschil voorleggen aan de Geschillencommissie Uiterlijke Verzorging. Die doet een bindende uitspraak; je hebt er geen advocaat voor nodig.",
    link: {
      label: "degeschillencommissie.nl",
      href: "https://www.degeschillencommissie.nl",
    },
  },
] as const;

export default function KwaliteitPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Over Diba", url: `${DIBA_SITE_URL}/over-ons` },
          {
            name: "Kwaliteit en registraties",
            url: `${DIBA_SITE_URL}/kwaliteit-en-registraties`,
          },
        ])}
      />

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
          <Link href="/over-ons" className="hover:text-[var(--g-700)]">
            Over Diba
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--t-muted)]">
            Kwaliteit en registraties
          </span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <h1 className="diba-display-l max-w-[15ch]">
            Waar je ons <span className="diba-accent">op kunt aanspreken</span>
          </h1>
          <div>
            <p className="max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Iedereen mag in Nederland een huidkliniek beginnen. Wat een
              kliniek onderscheidt is dus niet wat zij zelf zegt, maar bij welke
              regels zij zich heeft laten aansluiten en wie daarop toeziet.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Hieronder staat waar we bij aangesloten zijn, wat dat inhoudt, wat
              je eraan hebt en hoe een klacht loopt.
            </p>
          </div>
        </div>
      </section>

      {/* ── De registraties ── */}
      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <Label>Aangesloten bij</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Vijf dingen{" "}
            <span className="diba-accent">die je kunt nakijken</span>
          </h2>

          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:items-start">
            {BEVESTIGD.map((r) => (
              <li
                key={r.naam}
                className="flex h-full flex-col rounded-[var(--r-lg)] bg-white p-7 sm:p-8"
              >
                <Label>{r.wie}</Label>
                <p className="diba-card-title mt-3 min-h-[2lh] text-[var(--t-strong)]">
                  {r.naam}
                </p>
                <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
                  {r.wat}
                </p>
                <p className="mt-4 grow text-[15px] leading-7 text-[var(--t-body)]">
                  {r.waarom}
                </p>
                <Link
                  href={r.link.href}
                  className="diba-label mt-6 inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4 transition-colors hover:text-[var(--g-800)]"
                >
                  {r.link.label}
                  <span aria-hidden="true">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Wie staat waarin ──
          Rojda's onderscheid, want dat is precies wat mensen door elkaar halen: een
          huidtherapeut en een schoonheidsspecialist zijn twee vakken met elk hun eigen
          vereniging en hun eigen register. */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Twee vakken</Label>
            <h2 className="diba-display-m mt-4 max-w-[18ch]">
              Wie staat <span className="diba-accent">waarin</span>
            </h2>
            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Bij Diba werken huidtherapeuten en schoonheidsspecialisten. Dat
              zijn twee vakken, elk met een eigen vereniging en een eigen
              register. Daarom staan er hierboven vier namen en niet twee.
            </p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[var(--r-lg)] bg-[var(--g-050)] p-7">
              <dt className="diba-card-title text-[var(--t-strong)]">
                Huidtherapeuten
              </dt>
              <dd className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                Lid van de Nederlandse Vereniging van Huidtherapeuten en
                geregistreerd in het Kwaliteitsregister Paramedici. Voor
                NVH-leden is die registratie verplicht.
              </dd>
            </div>
            <div className="rounded-[var(--r-lg)] bg-[var(--g-050)] p-7">
              <dt className="diba-card-title text-[var(--t-strong)]">
                Schoonheidsspecialisten
              </dt>
              <dd className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                Aangesloten bij ANBOS en op eigen naam geregistreerd in het SKIN
                Register, het kwaliteitsregister voor schoonheidsspecialisten.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── Klachten ── */}
      <section
        id="klachten"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
      >
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Als het misgaat</Label>
            <h2 className="diba-display-m mt-4 max-w-[18ch]">
              Een klacht gaat{" "}
              <span className="diba-accent">niet alleen langs ons</span>
            </h2>
            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              De Wet kwaliteit, klachten en geschillen zorg verplicht elke
              zorgaanbieder tot een klachtenregeling, een klachtenfunctionaris
              en aansluiting bij een erkende geschilleninstantie. Sinds 2016
              geldt dat ook voor cosmetische behandelingen. Wij vallen onder de
              klachtenregeling van ANBOS; zo loopt die.
            </p>
            <Link
              href="/contact"
              className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              Neem contact op
            </Link>
          </div>
          <ol className="grid gap-4">
            {KLACHTROUTE.map((stap, i) => (
              <li
                key={stap.kop}
                className="flex gap-5 rounded-[var(--r-lg)] bg-white p-6 sm:p-7"
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--g-700)] text-[14px] font-semibold text-white tabular-nums"
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[17px] leading-6 font-medium text-[var(--t-strong)]">
                    {stap.kop}
                  </p>
                  <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
                    {stap.tekst}
                  </p>
                  {"link" in stap ? (
                    <a
                      href={stap.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="diba-label mt-3 inline-block text-[var(--g-700)] underline underline-offset-4 transition-colors hover:text-[var(--g-800)]"
                    >
                      {stap.link.label}
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Geen logo's ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto rounded-[var(--r-lg)] bg-[var(--g-050)] p-8 sm:p-10">
          <Label>Waarom hier geen logo&apos;s staan</Label>
          <p className="diba-card-title mt-3 text-[var(--t-strong)]">
            Een keurmerk zegt pas iets als je weet wat erachter zit
          </p>
          <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Daarom staat hierboven per register wat het inhoudt en wat de
            drempel ervoor is, in plaats van een rij plaatjes. Dat kun je
            nakijken; een plaatje niet.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/team"
              className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              Wie er werkt en met welke titel
            </Link>
            <Link
              href="/partners"
              className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              De merken waarmee we werken
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
