import type { Metadata } from "next";
import Link from "next/link";
import BeeldVignet from "@/components/ui/BeeldVignet";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { APPARATUUR } from "@/data/apparatuur";
import { KWALITEITSREGISTER, TEAM, VAKGEBIEDEN } from "@/data/team";
import { WEIGER_SOORTEN } from "@/data/weigeren";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_ADDRESS,
  DIBA_EMAIL,
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE,
  DIBA_SITE_URL,
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
} from "@/lib/site";

/**
 * Voor zorgverleners die willen doorverwijzen.
 *
 * WAAROM DEZE PAGINA ER MOEST KOMEN.
 *
 * Elke andere pagina op deze site praat tegen iemand met een huidvraag. Een huisarts,
 * dermatoloog of praktijkondersteuner die overweegt hierheen te verwijzen wil iets heel
 * anders weten, en vond dat nergens bij elkaar: wie voert het uit en met welke titel, waar
 * ligt de grens van wat hier gebeurt, wat krijgt mijn patiënt te horen, en hoe verwijs ik.
 *
 * Die informatie stond wel op de site, maar verspreid over /team, /dit-behandelen-wij-niet,
 * /vergoedingen en /apparatuur. Voor een verwijzer die tien minuten heeft is dat hetzelfde
 * als niet aanwezig.
 *
 * DE SIGNATUUR: DE GRENS STAAT BOVENAAN.
 *
 * De meeste verwijspagina's beginnen met wat een kliniek allemaal kan. Voor een verwijzer
 * is de omgekeerde vraag belangrijker: wat stuur je hier níet heen. Wie dat vooraf weet
 * verwijst gerichter, en dat scheelt zijn patiënt een afspraak die op niets uitloopt.
 * Vandaar dat de drie soorten nee direct onder de kop staan.
 *
 * DE AANSPREEKVORM.
 *
 * Deze pagina staat in de u-vorm, en dat is de enige niet-juridische pagina op de site waar
 * dat zo is. Besluit van Yasin: deze pagina praat niet tegen een klant maar tegen een
 * huisarts, en in professioneel Nederlands is "u" daar de norm. De je-vorm van §10 blijft
 * gelden voor alle andere pagina's, ook voor /werken-bij, dat ook tegen een vakgenoot praat
 * maar wel iemand aanspreekt die hier zelf komt werken.
 *
 * De uitzondering staat in de lijst JURIDISCH in scripts/controleer-huisregels.mjs, dus de
 * controle weet ervan en blijft de rest bewaken. Niet oplossen door de controle uit te
 * zetten: dan verdwijnt ook het toezicht op de zesentachtig pagina's die het wél moeten
 * volgen.
 *
 * [GEGEVEN-NODIG: een eigen verwijskanaal. Nu staan het algemene nummer en adres er.
 * Okan: komt er een apart mailadres of telefoonnummer voor verwijzers, en wie leest dat?]
 * [BESLUIT-OKAN] koppelen we terug aan de verwijzer na de meting, en zo ja hoe en met
 * welke toestemming. Dat is de vraag die een huisarts als eerste stelt en waar deze pagina
 * nu geen antwoord op geeft.
 * [MEDISCHE-CHECK-ROJDA] de afbakening hieronder: klopt het waar de grens ligt tussen wat
 * een huidtherapeut doet en wat bij een arts hoort.
 *
 * Eén donkergroen vlak: het blok over wie de behandeling uitvoert (§5).
 */

export const metadata: Metadata = {
  title: "Voor verwijzers",
  description:
    "Voor huisartsen en andere zorgverleners die willen doorverwijzen. Waar de grens ligt, wie de behandeling uitvoert en hoe u verwijst.",
};

/**
 * Wat een patiënt hier als eerste krijgt.
 *
 * Bewust in deze volgorde: een verwijzer wil weten of zijn patiënt met een plan of met een
 * verkooppraatje thuiskomt. [MEDISCHE-CHECK-ROJDA]
 */
const WAT_JE_PATIENT_KRIJGT = [
  {
    kop: "Een meting onder vast licht",
    zin: "Elke eerste afspraak begint met een objectieve huidanalyse: zelfde licht, zelfde hoek, zelfde instellingen. Die opname blijft het nulpunt waar volgende afspraken tegen afgezet worden.",
  },
  {
    kop: "Een plan met een grens erin",
    zin: "Wat er kan, hoeveel sessies dat vraagt en wat het niet gaat doen. Bij elke behandeling op deze site staat de grens er even nadrukkelijk bij als de werking.",
  },
  {
    kop: "Soms het advies om niets te doen",
    zin: "Blijkt uit de meting dat behandelen weinig oplevert of dat het moment verkeerd is, dan hoort uw patiënt dat. Dat gebeurt en het is geen uitzondering.",
  },
];

/**
 * De verwijsroute in drie stappen.
 *
 * Geen formulier en geen portaal: die zijn er niet, en doen alsof is erger dan het gewoon
 * zeggen. [GEGEVEN-NODIG: klopt deze route, Okan?]
 */
const HOE_VERWIJZEN = [
  {
    stap: "Eerste stap",
    kop: "Meegeven of mailen",
    zin: "Uw patiënt kan zelf een afspraak maken, of u stuurt de verwijzing vooruit. Wat erin staat bepaalt u zelf; een korte omschrijving van de klacht en wat u al heeft geprobeerd helpt het meest.",
  },
  {
    stap: "Wat er dan gebeurt",
    kop: "De meting eerst",
    zin: "Er wordt niet behandeld op de verwijzing alleen. Eerst de meting, dan pas een plan, en dat plan kan afwijken van wat er in de verwijzing staat.",
  },
  {
    stap: "Bij twijfel",
    kop: "Overleg vooraf",
    zin: "Weet u niet zeker of iets hier thuishoort, belt u dan even. Dat kost u vijf minuten en uw patiënt een afspraak die anders op niets uitloopt.",
  },
];

export default function VerwijzersPage() {

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Voor verwijzers", url: `${DIBA_SITE_URL}/verwijzers` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch lg:py-20">
          <div className="flex flex-col">
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Voor verwijzers</span>
            </nav>

            <div className="mt-8">
              <Label>Voor zorgverleners</Label>
              <h1 className="diba-display-l mt-4">
                Verwijzen naar Diba.{" "}
                <span className="diba-accent">Wat u moet weten.</span>
              </h1>
            </div>

            <p className="mt-7 max-w-[62ch] text-[17px] leading-8 text-[var(--t-body)]">
              Deze pagina is voor huisartsen, praktijkondersteuners,
              dermatologen en andere zorgverleners die overwegen een patiënt
              hierheen te sturen. Hij begint met waar de grens ligt, want dat is
              de vraag die uw verwijzing bruikbaar maakt.
            </p>

            <p className="mt-4 max-w-[62ch] text-[17px] leading-8 text-[var(--t-body)]">
              {DIBA_SITE.name} zit in {DIBA_SITE.neighborhood},{" "}
              {DIBA_ADDRESS.city}. Er werken {TEAM.length} mensen, van wie een
              deel een wettelijk beschermde titel draagt.
            </p>

            <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-10">
              <a
                href={DIBA_TELEFOON_HREF}
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                Overleg vooraf: {DIBA_TELEFOON}
              </a>
              <Link
                href="/dit-behandelen-wij-niet"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Wat wij niet behandelen
              </Link>
            </div>
          </div>

          {/* De drie soorten nee, meteen in beeld. Dat is wat een verwijzer
              als eerste nodig heeft. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Waar de grens ligt</Label>
            <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
              Er zijn drie redenen waarom iets hier niet gebeurt. Ze staan per
              klacht uitgewerkt op een eigen pagina.
            </p>
            <ul className="mt-6 space-y-3">
              {WEIGER_SOORTEN.map((s) => (
                <li
                  key={s.id}
                  className="rounded-[var(--r-md)] bg-[var(--g-025)] p-5"
                >
                  <p className="text-[16px] leading-6 font-medium text-[var(--t-strong)]">
                    {s.label}
                  </p>
                  <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
                    {s.zin}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              href="/dit-behandelen-wij-niet"
              className="diba-label mt-6 inline-block text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              De volledige lijst
            </Link>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      {/* ── Wie het uitvoert ── */}
      {/* Een verwijzer stuurt iemand naar een plek die hij zelf nooit heeft gezien. Dit is
          die plek. */}
      <section className="px-5 pb-14 sm:px-9 lg:px-[7.5vw] lg:pb-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/kliniek-behandelkamer.jpg"
            alt="Behandelaar werkt aan de huid van een client in de behandelkamer"
            onderschrift="Waar uw patient terechtkomt"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/9] lg:aspect-[21/9]"
          />
        </div>
      </section>

      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <Label opDonker>Wie de behandeling doet</Label>
              <h2 className="diba-display-m mt-4">
                Eén titel is{" "}
                <span className="diba-accent-on-dark">wettelijk beschermd.</span>
              </h2>
              <p className="mt-6 max-w-[46ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                Voor een verwijzer is dat het verschil dat telt, en op de meeste
                kliniekwebsites staat het nergens. Hier wel, inclusief wat níet
                beschermd is.
              </p>
            </div>

            <div className="space-y-6">
              {VAKGEBIEDEN.map((v) => (
                <div key={v.id}>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="diba-card-title text-[var(--on-dark)]">
                      {v.label}
                    </p>
                    <span className="diba-label rounded-[var(--r-pill)] bg-white/15 px-3 py-1.5 text-[var(--on-dark-accent)]">
                      {v.beschermd ? "Beschermde titel" : "Geen beschermde titel"}
                    </span>
                  </div>
                  <p className="mt-2 max-w-[58ch] text-[15px] leading-7 text-[var(--on-dark-body)]">
                    {v.wat}
                  </p>
                </div>
              ))}

              <div className="rounded-[var(--r-md)] bg-white/10 p-6">
                <p className="diba-label diba-label-on-dark">
                  {KWALITEITSREGISTER.naam}
                </p>
                <p className="mt-2 max-w-[58ch] text-[15px] leading-7 text-[var(--on-dark-accent)]">
                  {KWALITEITSREGISTER.eisen}
                </p>
                <a
                  href={KWALITEITSREGISTER.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="diba-label mt-4 inline-block text-[var(--on-dark-accent)] underline underline-offset-4"
                >
                  Het register bekijken
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Wat uw patiënt krijgt ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="shrink-0">
              <Label>Wat uw patiënt krijgt</Label>
              <h2 className="diba-display-m mt-4">
                Eerst meten.{" "}
                <span className="diba-accent">Dan pas een plan.</span>
              </h2>
            </div>
            <p className="max-w-[46ch] text-[16px] leading-7 text-[var(--t-body)]">
              Er wordt niet behandeld op een verwijzing alleen. Dat is geen
              formaliteit: het is de reden dat het advies dat uw patiënt
              meekrijgt eerlijk kan zijn.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 lg:grid-cols-3">
            {WAT_JE_PATIENT_KRIJGT.map((k) => (
              <li
                key={k.kop}
                className="rounded-[var(--r-lg)] bg-white p-7 sm:p-8"
              >
                <p className="diba-card-title text-[var(--t-strong)]">
                  {k.kop}
                </p>
                <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
                  {k.zin}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── De route ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="shrink-0">
              <Label>Hoe u verwijst</Label>
              <h2 className="diba-display-m mt-4">
                Geen portaal.{" "}
                <span className="diba-accent">Wel een telefoonnummer.</span>
              </h2>
            </div>
            <p className="max-w-[46ch] text-[16px] leading-7 text-[var(--t-body)]">
              Er is geen verwijzersportaal en geen digitaal formulier. Doen
              alsof die er zijn is erger dan het gewoon zeggen.
            </p>
          </div>

          <ol className="mt-10 grid gap-4 lg:grid-cols-3">
            {HOE_VERWIJZEN.map((h) => (
              <li
                key={h.kop}
                className="rounded-[var(--r-lg)] bg-white p-7 sm:p-8"
              >
                <p className="diba-label text-[var(--t-label)]">{h.stap}</p>
                <p className="diba-card-title mt-3 text-[var(--t-strong)]">
                  {h.kop}
                </p>
                <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
                  {h.zin}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-[var(--r-lg)] bg-[var(--g-075)] p-7 sm:p-9">
            <Label className="text-[var(--warn-text)]">
              Wat hier nog niet staat
            </Label>
            <p className="mt-3 max-w-[74ch] text-[16px] leading-7 text-[var(--t-body)]">
              Of en hoe er na de meting wordt teruggekoppeld aan de verwijzer is
              nog niet vastgelegd, en daarom staat er geen belofte over. Belt of
              mailt u gerust met de vraag; dan hoort u hoe het op dat moment gaat.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={DIBA_TELEFOON_HREF}
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                {DIBA_TELEFOON}
              </a>
              <a
                href={`mailto:${DIBA_EMAIL}`}
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                {DIBA_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Verder lezen ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <Label>Verder lezen</Label>
          <h2 className="diba-display-m mt-4">
            Wat er verder{" "}
            <span className="diba-accent">te controleren valt.</span>
          </h2>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/dit-behandelen-wij-niet",
                kop: "Wat wij niet behandelen",
                zin: "Per klacht de reden, en waar het dan wel thuishoort.",
              },
              {
                href: "/apparatuur",
                kop: `De ${APPARATUUR.length} apparaten`,
                zin: "Wat er staat, tot welke diepte het komt en wat het niet kan.",
              },
              {
                href: "/vergoedingen",
                kop: "Vergoeding",
                zin: "Waarom de verzekeraar niet de eerste vraag is, en wanneer een verwijzing nodig is.",
              },
              {
                href: "/team",
                kop: "Het team",
                zin: `Wie er werkt, met welke titel en wat die titel betekent.`,
              },
            ].map((k) => (
              <li key={k.href}>
                <Link
                  href={k.href}
                  className="flex h-full flex-col rounded-[var(--r-lg)] bg-white p-7 transition-shadow duration-500 hover:shadow-[0_18px_44px_rgba(23,55,42,.09)]"
                >
                  <p className="diba-card-title text-[var(--t-strong)]">
                    {k.kop}
                  </p>
                  <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                    {k.zin}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
