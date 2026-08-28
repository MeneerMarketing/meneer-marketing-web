"use client";

import { useId, useState, type CSSProperties } from "react";
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
      <div className="rounded-[var(--r-lg)] bg-white p-6 sm:p-8">
        <Label>Het enige experiment met een controlegroep</Label>
        <p className="mt-3 max-w-[70ch] text-[17px] leading-8 text-[var(--t-body)]">
          Twee stukken huid van dezelfde persoon. Zet je eigen leeftijd erin en
          kijk hoeveel regels er verschillen.
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

      <p className="mt-8 max-w-[76ch] text-[17px] leading-8 text-[var(--t-strong)]">
        Allebei die stukken huid zijn precies even oud. Wat je op het ene extra
        ziet is opgebouwd, niet meegegroeid. Dat is ook het enige goede nieuws
        op deze pagina: aan opgebouwd zit een knop, aan meegegroeid niet.
      </p>
    </div>
  );
}
