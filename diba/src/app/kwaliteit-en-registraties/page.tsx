import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/ui/Label";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * Kwaliteit en registraties.
 *
 * OKAN, 5 SEPTEMBER 2026, met een lijstje registers en de vraag om ze op de site te zetten.
 * Bij drie van de vijf zet hij zelf een voorwaarde: SKIN Register alleen als de medewerkers
 * geregistreerd zijn, ANBOS alleen bij actief lidmaatschap, NVH alleen voor wie lid is.
 *
 * WAT HIER STAAT EN WAAROM. Drie dingen zijn bevestigd, door Rojda op 3 september 2026: Diba
 * is gecontracteerd bij alle zorgverzekeraars, de huidtherapeuten staan in het
 * Kwaliteitsregister Paramedici, en de kliniek is aangesloten bij ANBOS. Die staan er als
 * feit. De rest staat er niet, ook niet als "waarschijnlijk".
 *
 * GEEN LOGO'S. Een logo is een keurmerk, en een keurmerk van een register waar niemand in
 * staat is erger dan geen keurmerk. Hier staat wat een registratie inhoudt en wat de
 * drempel ervoor is; dat is te controleren en het zegt meer dan een plaatje.
 *
 * [GEGEVEN-NODIG: is Diba of zijn de individuele therapeuten lid van de NVH? Staan de
 * schoonheidsspecialisten in het SKIN Register? Bij welke geschilleninstantie is de kliniek
 * aangesloten? Okan]
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/kwaliteit-en-registraties",
  titel: "Kwaliteit en registraties",
  omschrijving:
    "Bij welke registers Diba Clinics en de huidtherapeuten zijn aangesloten, wat die registratie inhoudt en wat je eraan hebt.",
});

const BEVESTIGD = [
  {
    naam: "Kwaliteitsregister Paramedici",
    wie: "Onze huidtherapeuten",
    wat: "Het register is vrijwillig en de drempel is echt: opnieuw registreren elke vijf jaar, en daarvoor minstens 1600 werkuren over minimaal 36 maanden aantonen plus 160 punten bijscholing.",
    waarom:
      "Huidtherapeut is een beschermde titel (artikel 34 van de Wet BIG). De titel zegt dat iemand de opleiding heeft gedaan; het register zegt dat iemand het vak ook echt uitoefent en bijhoudt.",
    link: { label: "Wie er werkt en met welke titel", href: "/team" },
  },
  {
    naam: "ANBOS",
    wie: "De kliniek",
    wat: "De brancheorganisatie voor schoonheidsspecialisten. Aangesloten leden werken volgens de gedragscode en de hygiënerichtlijnen van de branche.",
    waarom:
      "Het deel van ons werk dat niet paramedisch is, valt hieronder. Ook daar hoort een norm bij die iemand anders dan wijzelf heeft opgeschreven.",
    link: { label: "Waar wij voor staan", href: "/ons-verbond" },
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
              Hieronder staat waar we bij aangesloten zijn, wat dat inhoudt en
              wat je eraan hebt.
            </p>
          </div>
        </div>
      </section>

      {/* ── De registraties ── */}
      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <Label>Aangesloten bij</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Drie dingen{" "}
            <span className="diba-accent">die je kunt nakijken</span>
          </h2>

          <ul className="mt-12 grid gap-4 lg:grid-cols-3 lg:items-start">
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

      {/* ── Klachten ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Als het misgaat</Label>
            <h2 className="diba-display-m mt-4 max-w-[18ch]">
              Een klacht gaat{" "}
              <span className="diba-accent">niet alleen langs ons</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              De Wet kwaliteit, klachten en geschillen zorg verplicht elke
              zorgaanbieder tot een klachtenregeling, een klachtenfunctionaris
              en aansluiting bij een erkende geschilleninstantie. Sinds 2016
              geldt dat ook voor cosmetische behandelingen.
            </p>
            <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              Dat betekent dat je met een klacht niet afhankelijk bent van of
              wij hem redelijk vinden. Er is een route buiten ons om. Begin bij
              ons, want het meeste is in een gesprek op te lossen; komen we er
              niet uit, dan hoor je waar je terechtkunt.
            </p>
            <Link
              href="/contact"
              className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              Neem contact op
            </Link>
          </div>
        </div>
      </section>

      {/* ── Wat hier niet staat ──
          Dezelfde regel als op /partners: een register noemen waarvan niet vaststaat dat we
          erin staan, is een keurmerk claimen. Dat gebeurt hier niet, en dat staat er ook. */}
      <section className="px-5 pb-20 sm:px-9 lg:px-[7.5vw] lg:pb-28">
        <div className="mx-auto rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
          <Label>Wat hier niet staat</Label>
          <p className="diba-card-title mt-3 text-[var(--t-strong)]">
            Registers waarvan we het nog nakijken
          </p>
          <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Er bestaan meer registers in dit vak, zoals de Nederlandse
            Vereniging van Huidtherapeuten en het SKIN Register voor
            schoonheidsspecialisten. Die noemen we pas als vaststaat wie van ons
            erin staat en of het lidmaatschap loopt.
          </p>
          <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Een keurmerk van een register waar niemand in staat, is slechter dan
            geen keurmerk. Dat is dezelfde reden waarom er op deze site geen
            voor-en-na-foto&apos;s staan die niets bewijzen.
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
