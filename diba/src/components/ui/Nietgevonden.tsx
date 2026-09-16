"use client";

import Link from "@/components/ui/Taalpad";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import Zoekhulp, { type Zoekdoel } from "@/components/ui/Zoekhulp";
import { APPARATUUR } from "@/data/apparatuur";
import { BEHANDELINGEN } from "@/data/behandelingen";
import { LANDINGS, landingNaam } from "@/data/landings";
import { BESTEMMINGEN } from "@/data/symptoomzoeker";
import { useT, useTc } from "@/lib/gebruik-taal";
import {
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * De pagina voor een adres dat hier niet bestaat.
 *
 * WAT HIER STOND EN WAAROM DAT ZONDE WAS.
 *
 * "Deze pagina bestaat niet (meer)", met een knop naar de homepage. Dat is waar en het is
 * een doodlopende weg: iemand die via Google op een oud adres uitkomt, zocht precies wat
 * wij doen. Hem naar de homepage sturen betekent dat hij opnieuw moet zoeken, en de meeste
 * mensen gaan dan terug naar de zoekresultaten.
 *
 * De oude WordPress-site staat nog jaren in Google met adressen die hier niet meer
 * bestaan. Deze pagina is dus geen foutmelding maar een wegwijzer, en het woord 404 komt
 * er niet op voor: dat zegt de bezoeker niets en het klinkt als onze fout, terwijl het
 * gewoon een oude link is.
 *
 * DRIE LAGEN, VAN SPECIFIEK NAAR ALGEMEEN.
 *
 * 1. Het adres zelf. `Zoekhulp` leest het in de browser en zoekt er onze eigen pagina's
 *    bij; bij genoeg overeenkomst staan er maximaal drie voorstellen.
 * 2. De twee ingangen voor wie het niet weet: de symptoomzoeker en een afspraak.
 * 3. De vier hoofdwegen, voor wie zelf verder kijkt.
 *
 * En onderaan het telefoonnummer, want een deel van de mensen die hier belandt wil geen
 * pagina maar een antwoord.
 *
 * Deze pagina blijft op `noindex` staan: hij hoort niet in de zoekresultaten, hij hoort
 * mensen op te vangen die er al in zaten.
 */

/**
 * Alles waar iemand op kan uitkomen, in één platte lijst voor de zoekhulp.
 *
 * Uit dezelfde bronnen als de rest van de site, dus een nieuwe behandeling of
 * landingspagina staat hier vanzelf tussen.
 */
const DOELEN: readonly Zoekdoel[] = [
  ...BESTEMMINGEN.map((b) => ({
    pad: b.pad,
    naam: b.naam,
    soort: "Huidprobleem",
  })),
  ...BEHANDELINGEN.map((b) => ({
    pad: `/behandelingen/${b.slug}`,
    naam: b.naam,
    soort: "Behandeling",
  })),
  ...APPARATUUR.map((a) => ({
    pad: `/apparatuur/${a.slug}`,
    naam: a.naam,
    soort: "Apparaat",
  })),
  ...LANDINGS.map((l) => ({
    pad: `/kennisbank/${l.slug}`,
    naam: landingNaam(l),
    soort: "Kennisbank",
  })),
  { pad: "/laserontharing", naam: "Laserontharing", soort: "Behandeling" },
  { pad: "/tarieven", naam: "Tarieven", soort: "Praktisch" },
  { pad: "/vergoedingen", naam: "Vergoedingen", soort: "Praktisch" },
  { pad: "/intake", naam: "Het huidconsult", soort: "Praktisch" },
  { pad: "/afspraak", naam: "Afspraak maken", soort: "Praktisch" },
  { pad: "/team", naam: "Ons team", soort: "Over ons" },
  { pad: "/contact", naam: "Contact en route", soort: "Praktisch" },
  { pad: "/reviews", naam: "Ervaringen van onze klanten", soort: "Over ons" },
];

const WEGEN = [
  {
    pad: "/huidproblemen",
    kop: "Per klacht",
    zin: "Acne, pigment, littekens, couperose, haargroei. Kies waar je last van hebt.",
  },
  {
    pad: "/behandelingen",
    kop: "Per behandeling",
    zin: "Alles wat we doen, met wat het inhoudt, wat het kost en hoeveel sessies erbij horen.",
  },
  {
    pad: "/tarieven",
    kop: "De tarieven",
    zin: "Elk tarief per sessie en per zone, zonder dat je ervoor hoeft te bellen.",
  },
  {
    pad: "/kennisbank",
    kop: "De kennisbank",
    zin: "Wat een behandeling inhoudt, waar een klacht vandaan komt en wat een apparaat kan.",
  },
];

/**
 * De inhoud van de 404, als client component.
 *
 * De taal komt uit het pad in de adresbalk en niet uit het serverdoosje: bij een 404 heeft
 * de indeling van /en niet gedraaid, dus daar staat niets in. Iemand die /en/afspraak
 * intikt hoort een Engelse wegwijzer te krijgen en geen Nederlandse.
 */
export default function Nietgevonden() {
  const t = useT();
  const tc = useTc();
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <section className="px-5 py-12 sm:px-9 sm:py-20 lg:px-[7.5vw] lg:py-24">
        <div className="max-w-[72ch]">
          <Label>{t("Verkeerd uitgekomen")}</Label>
          <h1 className="diba-display-l mt-4 max-w-[18ch]">
            {t("Deze link hoort bij")}{" "}
            <span className="diba-accent">{t("de oude site")}</span>
          </h1>
          <p className="mt-6 text-[17px] leading-8 text-[var(--t-body)]">
            {t(
              "Onze site is opnieuw gebouwd, en dit adres hoorde bij de vorige versie. Wat erop stond is er meestal nog wel, alleen op een andere plek. Hieronder de kortste weg ernaartoe.",
            )}
          </p>

          <Zoekhulp doelen={DOELEN} />

          <div className="diba-knoprij mt-10">
            <Button href="/huidproblemen/symptoomzoeker">
              {t("Weet je niet hoe het heet?")}
            </Button>
            <Button href="/afspraak" variant="secundair">
              {t("Afspraak maken")}
            </Button>
          </div>
        </div>

        <ul className="mx-auto mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {WEGEN.map((w) => (
            <li key={w.pad} className="flex">
              <Link
                href={w.pad}
                className="group flex h-full w-full flex-col rounded-[var(--r-lg)] bg-white p-6 transition-shadow duration-500 hover:shadow-[0_14px_36px_rgba(67,79,58,.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] sm:p-7"
              >
                <p className="diba-card-title text-[var(--t-strong)]">
                  {tc(w.kop)}
                </p>
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {tc(w.zin)}
                </p>
                <span
                  aria-hidden="true"
                  className="diba-label mt-auto flex items-center gap-2 pt-6 text-[var(--g-700)]"
                >
                  {t("Bekijken")}
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12 max-w-[72ch] text-[16px] leading-7 text-[var(--t-body)]">
          {t("Kom je er niet uit, bel dan")}{" "}
          <a
            href={DIBA_TELEFOON_HREF}
            className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
          >
            {DIBA_TELEFOON}
          </a>{" "}
          {t("of stel je vraag via")}{" "}
          <a
            href={DIBA_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
          >
            {t("WhatsApp")}
          </a>
          {t(
            ". Daar zit een behandelaar aan de andere kant en geen formulier.",
          )}
        </p>
      </section>
    </main>
  );
}
