"use client";

import { useId, useState, type CSSProperties } from "react";
import Link from "next/link";
import Label from "@/components/ui/Label";
import { ONDERARM, PROEF } from "@/data/veroudering";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De onderarmtest — de uitblinker van de pagina over huidveroudering.
 *
 * Dermatologen laten dit al decennia met dezelfde demonstratie zien: kijk naar de
 * binnenkant van je bovenarm, kijk dan naar je gezicht. Allebei precies even oud, en
 * totaal anders. Het verschil is geen leeftijd maar zon.
 *
 * TWEEDE VERSIE, EN DIT IS EEN ANDER SOORT TOOL GEWORDEN.
 *
 * Er stonden twee vlakken nagetekende huid waar je tussen kon vegen: een ruitjespatroon
 * met bruine vlekjes en rode kronkeltjes erop. Dat had twee problemen.
 *
 * Het eerste is dat het niet werkte. Het zag eruit als ruitjespapier met vlekken, niet als
 * huid, en dat is geen tekenfout maar een patroon: elke figuratieve tekening op deze site
 * is gesneuveld en elk abstract informatiestuk is blijven staan. Deze site is goed in
 * ordenen en slecht in afbeelden.
 *
 * Het tweede weegt zwaarder. Het argument van deze pagina is niet "kijk hoe anders het
 * eruitziet" — dat weet de lezer al. Het argument is dat er maar één verschil is tussen
 * die twee stukken huid. En dat is precies wat een tekening niet kan laten zien, want een
 * tekening toont het gevolg en niet de opzet.
 *
 * Dus is het geen plaatje meer maar wat het altijd al was: een proef met een
 * controlegroep. Het enige experiment dat iemand op zijn eigen lichaam kan doen. Alles
 * gelijk, één variabele anders. De schuif zet er je eigen leeftijd in, en het getal dat
 * dan verschijnt staat twee keer identiek in de tabel — want dat is het punt. Je kunt aan
 * de bediening draaien zoveel je wilt; de leeftijd van die twee stukken huid loopt nooit
 * uiteen.
 *
 * We beweren nergens hoeveel van de veroudering door zon komt. Dat weten we niet en dat
 * meten we niet (A7). We laten zien dat al het andere gelijk is.
 */

const MIN = 18;
const MAX = 80;

export default function Onderarmtest() {
  const [leeftijd, setLeeftijd] = useState(35);
  const uid = useId().replace(/:/g, "");

  /* Gemiddeld jaar, dus met schrikkeldagen. Wie het narekent moet gelijk krijgen. */
  const dagen = Math.round(leeftijd * 365.25).toLocaleString("nl-NL");

  const rijen = [
    {
      wat: "Leeftijd",
      beschut: `${dagen} dagen`,
      blootgesteld: `${dagen} dagen`,
    },
    ...PROEF.gelijk.map((g) => ({
      wat: g.wat,
      beschut: g.waarde,
      blootgesteld: g.waarde,
    })),
  ];

  return (
    <div className="mt-12">
      {/* De clou staat vooraan.

          Okan, 4 september: de informatie is waardevol maar het duurt te lang voor je
          begrijpt waar het heen gaat, en de conclusie stond onderaan in een gewone alinea.
          Dat is een bewijsvoering, en die leest niemand op een website.

          Nu eerst de uitkomst in het formaat van een kop. De tabel eronder is daarmee geen
          puzzel meer maar onderbouwing, en die mag je overslaan. */}
      <div className="rounded-[var(--r-lg)] bg-white p-6 sm:p-8">
        <Label>Zon of leeftijd</Label>
        <p className="diba-display-s mt-4 max-w-[26ch]">
          Je binnenarm is even oud als je gezicht.{" "}
          <span className="diba-accent">Toch ziet hij er jonger uit.</span>
        </p>
        <p className="mt-5 max-w-[70ch] text-[17px] leading-8 text-[var(--t-body)]">
          Alles wat je op je gezicht extra ziet, is er dus bij gekomen en niet
          meegegroeid. Dat is het deel waar een behandeling iets aan doet. Zet
          je leeftijd hieronder in en zie hoe de twee zich verhouden.
        </p>

        <div className="mt-6 rounded-[var(--r-sm)] bg-[var(--g-025)] p-5">
          <label htmlFor={`${uid}-leeftijd`} className="diba-label block">
            Hoe oud ben je?
          </label>
          <p className="diba-display-s mt-2 text-[var(--t-strong)] tabular-nums">
            {leeftijd} jaar
          </p>
          <input
            id={`${uid}-leeftijd`}
            type="range"
            min={MIN}
            max={MAX}
            step={1}
            value={leeftijd}
            onChange={(e) => setLeeftijd(Number(e.target.value))}
            aria-valuetext={`${leeftijd} jaar, oftewel ${dagen} dagen`}
            className="diba-schuif fase-rijp mt-4"
            style={
              {
                "--schuif-voortgang": `${((leeftijd - MIN) / (MAX - MIN)) * 100}%`,
              } as CSSProperties
            }
          />
        </div>

        {/* De tabel. Vijf regels die identiek zijn en één die dat niet is; dat contrast is
            de hele tool, dus staat de laatste regel op een eigen vlak en de rest niet. */}
        <div className="mt-8">
          <div className="grid grid-cols-2 gap-x-4 px-5 pb-3 sm:grid-cols-[1.2fr_1fr_1fr]">
            <p className="diba-label hidden text-[var(--t-label)] sm:block">
              Wat er gelijk is
            </p>
            <p className="diba-label text-[var(--t-label)]">
              {ONDERARM.beschut.label}
            </p>
            <p className="diba-label text-[var(--t-label)]">
              {ONDERARM.blootgesteld.label}
            </p>
          </div>

          {rijen.map((r, i) => (
            <div
              key={r.wat}
              className={`grid grid-cols-2 gap-x-4 gap-y-1 rounded-[var(--r-sm)] px-5 py-4 sm:grid-cols-[1.2fr_1fr_1fr] sm:items-baseline ${
                i % 2 === 1 ? "bg-[var(--g-025)]" : ""
              }`}
            >
              <p className="col-span-2 text-[15px] leading-6 font-medium text-[var(--t-strong)] sm:col-span-1">
                {r.wat}
              </p>
              <p className="text-[15px] leading-6 text-[var(--t-body)] tabular-nums">
                {r.beschut}
              </p>
              <p className="text-[15px] leading-6 text-[var(--t-body)] tabular-nums">
                {r.blootgesteld}
              </p>
            </div>
          ))}

          {/* De enige regel die niet gelijk is. */}
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 rounded-[var(--r-sm)] bg-[var(--g-075)] px-5 py-5 sm:grid-cols-[1.2fr_1fr_1fr] sm:items-baseline">
            <p className="col-span-2 text-[15px] leading-6 font-medium text-[var(--t-strong)] sm:col-span-1">
              {PROEF.variabele.wat}
            </p>
            <p className="text-[16px] leading-6 font-medium text-[var(--t-strong)]">
              {PROEF.variabele.beschut}
            </p>
            <p className="text-[16px] leading-6 font-medium text-[var(--t-strong)]">
              {PROEF.variabele.blootgesteld}
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-[76ch] text-[15px] leading-7 text-[var(--t-muted)]">
          {PROEF.slot}
        </p>
      </div>

      {/* Wat je dan ziet. Allebei in beeld, want de vergelijking is het hele stuk. */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {[ONDERARM.beschut, ONDERARM.blootgesteld].map((k) => (
          <div
            key={k.label}
            className="rounded-[var(--r-md)] bg-[var(--g-050)] p-6 sm:p-7"
          >
            <Label>{k.label}</Label>
            <p className="mt-2 text-[14px] leading-6 text-[var(--t-muted)]">
              {k.onder}
            </p>
            <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(k.lezing)}
            </p>
          </div>
        ))}
      </div>

      {/* De afsluiter stond hier als gewone alinea en zakte weg. Als groen vlak is
          hij het antwoord op de vraag die de tabel oproept: en nu. */}
      <div className="mt-8 rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-10">
        <p className="diba-card-title-lg max-w-[34ch]">
          Aan opgebouwd zit een knop. Aan meegegroeid niet.
        </p>
        <p className="mt-4 max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
          Het deel dat door de zon is opgebouwd, is het deel dat we kunnen
          behandelen. Tijdens de intake stelt de huidtherapeut vast hoe groot
          dat deel bij jou is, en welke behandeling daarbij past.
        </p>
        <Link
          href="/intake"
          className="diba-label mt-7 inline-flex min-h-12 w-fit items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Plan een huidconsult
        </Link>
      </div>
    </div>
  );
}
