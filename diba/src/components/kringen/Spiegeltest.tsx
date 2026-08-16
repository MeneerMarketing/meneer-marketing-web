"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import {
  TESTEN,
  UITKOMSTEN,
  VOCHT_NOTITIE,
  type Test,
  type UitkomstId,
} from "@/data/kringen";
import { publicCopy } from "@/lib/copy-flags";
import { RASTER_SECTIE } from "@/lib/raster";

/**
 * De spiegeltest — de uitblinker van de pagina over donkere kringen.
 *
 * "Donkere kringen" is geen aandoening maar een uiterlijk kenmerk met drie verschillende
 * oorzaken, en die vragen alle drie iets anders. Bij één ervan kunnen wij niets doen. Wie
 * dat verzwijgt verkoopt drie keer dezelfde behandeling aan drie verschillende problemen.
 *
 * Het bijzondere is dat je zelf kunt uitzoeken welke het is, met twee handelingen die
 * niets kosten. Daarom vraagt deze interactie iets ánders dan alle andere op de site: hij
 * laat je niet klikken om informatie te krijgen, hij laat je iets doen met je eigen
 * gezicht en leest daarna mee.
 *
 * De uitkomst mag ook "wij kunnen niets voor je doen" zijn, en dan staat dat er zonder
 * verzachting en zonder knop naar de intake. Dat is het punt van deze pagina.
 *
 * Toegankelijkheid: één vraag tegelijk, gewone knoppen, en de voortgang staat er in
 * woorden bij. De uitkomst komt in een live region zodat een schermlezer hem oppikt.
 */

type Gegeven = Partial<Record<Test["id"], string>>;

/**
 * De beslisboom. Licht gaat vóór rek, want een schaduw kan zowel pigment als vaatjes
 * overstemmen: als de donkerte verdwijnt bij licht van voren was er geen kleur.
 */
function bepaalUitkomst(gegeven: Gegeven): UitkomstId {
  if (gegeven.licht === "verdwijnt") return "schaduw";
  if (gegeven.rek === "blijft") return "pigment";
  return "vaten";
}

const VLAK = {
  ja: "bg-[var(--g-050)]",
  deels: "bg-[var(--g-025)]",
  nee: "bg-white",
} as const;

/** Schematisch oogvlak. Geen echte of gegenereerde huid (§14). */
function Oogvlak({ test }: { test: Test["id"] }) {
  return (
    <svg viewBox="0 0 260 150" className="w-full" aria-hidden="true">
      <rect width="260" height="150" rx="16" fill="var(--g-050)" />

      {/* Het oog: een lensvorm met een iris. Bewust vlak en schematisch. */}
      <path
        d="M70 62c22-20 98-20 120 0-22 20-98 20-120 0z"
        fill="white"
        stroke="var(--g-300)"
        strokeWidth="2.5"
      />
      <circle cx="130" cy="62" r="13" fill="var(--g-700)" />

      {/* De kring eronder: precies het gebied waar de tests over gaan. */}
      <path
        d="M74 78c20 26 92 26 112 0"
        fill="none"
        stroke="var(--t-muted)"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.22"
      />

      {test === "licht" ? (
        // Twee lichtrichtingen, want dat is precies de vergelijking die je maakt.
        <>
          <path
            d="M130 8v18M112 14l6 14M148 14l-6 14"
            stroke="var(--warn)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text
            x="130"
            y="140"
            textAnchor="middle"
            className="fill-[var(--t-muted)] text-[11px] font-semibold uppercase [letter-spacing:0.12em]"
          >
            Van boven of van voren
          </text>
        </>
      ) : null}

      {test === "rek" ? (
        // Het pijltje wijst naar beneden: dat is de richting van de handeling.
        <>
          <path
            d="M130 96v24M122 112l8 10 8-10"
            stroke="var(--g-700)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <text
            x="130"
            y="142"
            textAnchor="middle"
            className="fill-[var(--t-muted)] text-[11px] font-semibold uppercase [letter-spacing:0.12em]"
          >
            Zachtjes omlaag
          </text>
        </>
      ) : null}

      {test === "ochtend" ? (
        <text
          x="130"
          y="126"
          textAnchor="middle"
          className="fill-[var(--t-muted)] text-[11px] font-semibold uppercase [letter-spacing:0.12em]"
        >
          Ochtend of avond
        </text>
      ) : null}
    </svg>
  );
}

export default function Spiegeltest() {
  const [stap, setStap] = useState(0);
  const [gegeven, setGegeven] = useState<Gegeven>({});

  const klaar = stap >= TESTEN.length;
  const test = TESTEN[stap];

  function beantwoord(id: string) {
    setGegeven((v) => ({ ...v, [test.id]: id }));
    setStap((s) => s + 1);
  }

  function opnieuw() {
    setGegeven({});
    setStap(0);
  }

  if (!klaar) {
    return (
      <div className={`mt-12 ${RASTER_SECTIE}`}>
        <div className="rounded-[var(--r-md)] bg-white p-6 sm:p-8">
          <Oogvlak test={test.id} />
          <p className="mt-5 text-sm leading-6 text-[var(--t-muted)]">
            Je hebt hier alleen een spiegel of je telefoon voor nodig. De test
            kost je twee minuten en bepaalt of behandelen in jouw geval zin
            heeft.
          </p>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Label>{test.nummer}</Label>
            <span className="text-sm text-[var(--t-muted)]">
              {`Vraag ${stap + 1} van ${TESTEN.length}`}
            </span>
          </div>

          {/* Voortgang in beeld én in woorden hierboven. */}
          <div
            className="mt-3 flex gap-1.5"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={TESTEN.length}
            aria-valuenow={stap + 1}
            aria-label="Voortgang van de spiegeltest"
          >
            {TESTEN.map((t, i) => (
              <span
                key={t.id}
                className={`h-1.5 flex-1 rounded-[var(--r-pill)] ${
                  i <= stap ? "bg-[var(--g-700)]" : "bg-[var(--g-100)]"
                }`}
              />
            ))}
          </div>

          <h3 className="diba-card-title-lg mt-6">{test.kop}</h3>
          <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
            {test.opdracht}
          </p>

          <ul className="mt-7 space-y-3">
            {test.antwoorden.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => beantwoord(a.id)}
                  className="w-full rounded-[var(--r-sm)] bg-white p-5 text-left transition-colors hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  <span className="diba-card-title block">{a.label}</span>
                  <span className="mt-1 block text-[15px] leading-7 text-[var(--t-body)]">
                    {a.onder}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-6 rounded-[var(--r-sm)] bg-white p-4 text-sm leading-6 text-[var(--t-muted)]">
            {publicCopy(test.waarom)}
          </p>

          {stap > 0 ? (
            <button
              type="button"
              onClick={() => setStap((s) => s - 1)}
              className="diba-label mt-6 underline underline-offset-4 hover:text-[var(--g-700)]"
            >
              Vorige vraag
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const uitkomst = UITKOMSTEN[bepaalUitkomst(gegeven)];
  const vocht = gegeven.ochtend === "ja";

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
      <div
        className={`self-start rounded-[var(--r-md)] p-6 sm:p-8 ${VLAK[uitkomst.wijHelpen]}`}
      >
        <Label>Wat de test aanwijst</Label>
        <h3 className="diba-card-title-lg mt-4">{uitkomst.kop}</h3>
        <p className="diba-label mt-3 text-[var(--t-muted)]">
          {uitkomst.vakterm}
        </p>

        <button
          type="button"
          onClick={opnieuw}
          className="diba-label mt-8 underline underline-offset-4 hover:text-[var(--g-700)]"
        >
          Test opnieuw doen
        </button>
      </div>

      <div aria-live="polite">
        <dl className="space-y-5">
          <div className="rounded-[var(--r-sm)] bg-white p-4">
            <dt className="diba-label">Wat het is</dt>
            <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(uitkomst.watHetIs)}
            </dd>
          </div>
          <div className="rounded-[var(--r-sm)] bg-white p-4">
            <dt className="diba-label">Wat wij kunnen doen</dt>
            <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(uitkomst.kunnenWij)}
            </dd>
          </div>
          <div className="rounded-[var(--r-sm)] bg-white p-4">
            <dt className="diba-label">Wat jij zelf kunt doen</dt>
            <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(uitkomst.zelf)}
            </dd>
          </div>
        </dl>

        {vocht ? (
          <p className="mt-6 rounded-[var(--r-sm)] bg-[var(--g-050)] p-5 text-[15px] leading-7 text-[var(--t-body)]">
            {publicCopy(VOCHT_NOTITIE)}
          </p>
        ) : null}

        {/* Bij schaduw geen knop naar de intake. Een uitkomst die "wij kunnen niets
            voor je doen" zegt en er dan toch een afspraakknop onder zet, zegt het niet
            echt. */}
        <div className="mt-8">
          {uitkomst.wijHelpen === "nee" ? (
            <p className="text-[16px] leading-7 text-[var(--t-strong)]">
              Hier houdt het voor ons op, en dat is de eerlijke uitkomst.
              Twijfel je of de test klopt? Loop binnen en dan kijken we mee, ook
              als het antwoord hetzelfde blijft.
            </p>
          ) : (
            <Button
              href={`/intake?topic=donkere-kringen&type=${uitkomst.id}`}
              variant={uitkomst.wijHelpen === "ja" ? "primair" : "secundair"}
            >
              {uitkomst.wijHelpen === "ja"
                ? "Laat dit bekijken"
                : "Laat eerlijk narekenen wat dit oplevert"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
