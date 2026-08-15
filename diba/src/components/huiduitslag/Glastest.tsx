"use client";

import { useId, useState, type CSSProperties } from "react";
import Label from "@/components/ui/Label";
import { GLASTEST, GLASTEST_UITLEG, type Uitkomst } from "@/data/huiduitslag";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De glastest — de uitblinker van de pagina over huiduitslag.
 *
 * Dit is de enige zelftest op de hele site die over spoed gaat. Vlekjes die niet
 * wegdrukken onder glas kunnen betekenen dat er bloed buiten de vaatjes zit, en dat is in
 * combinatie met ziek zijn een reden om vandaag te bellen in plaats van morgen. Artsen
 * gebruiken hem zelf, hij kost tien seconden, en bijna niemand kent hem.
 *
 * TWEEDE VERSIE, EN DE EERSTE DEMONSTREERDE DE TEST NIET.
 *
 * De opzet klopte op papier: laat beide uitkomsten zien, dan hoef je niet te raden welke
 * je zelf hebt. In de uitvoering stond er iets anders. Links stond "onder het glas" en
 * rechts "zonder druk", en dat zijn niet de twee uitkomsten van de test — dat is één
 * uitkomst, twee keer. De helft die telt, vlekjes die onder het glas blijven staan, was
 * nergens te zien. Wie dus wél die uitkomst had, herkende hem hier niet.
 *
 * En de lezing eronder wisselde met de stand van de schuif. Dat is een antwoord dat
 * verandert omdat je iets verschuift, terwijl het antwoord van jouw huid afhangt.
 *
 * WAT ER NU STAAT.
 *
 * Eén vlak met twee helften, en in allebei precies dezelfde vlekjes: even groot, even
 * donker, op dezelfde plek. Zonder druk zijn ze niet uit elkaar te houden, en dat is geen
 * tekortkoming van de tekening maar de reden dat de test bestaat.
 *
 * De schuif drukt het glas van boven naar beneden aan over allebei tegelijk. In het stuk
 * onder het glas verbleekt de linkerhelft en blijft de rechterhelft staan. Je ziet het
 * verschil dus ontstaan in één beweging, op vlekjes waarvan je net nog zag dat ze gelijk
 * waren.
 *
 * Beide lezingen staan er altijd, naast elkaar, en veranderen nergens van.
 *
 * De test kan niets uitsluiten en dat staat er expliciet bij. Er is geen uitkomst die
 * geruststelt en er staat nergens een knop naar onze intake.
 *
 * BEELD: schematisch, geen huid en geen foto's van uitslag (§14).
 */

const BREED = 460;
const HOOG = 250;
/** De naad tussen de twee helften. Geen lijn: een strook achtergrond. */
const NAAD = 14;
const HELFT = (BREED - NAAD) / 2;

/**
 * De vlekjes. Eén lijst, twee keer getekend.
 *
 * Dat is het hele punt: links en rechts moeten identiek zijn, anders kun je ze zonder glas
 * al uit elkaar houden en bewijst de demonstratie niets. Vaste posities, geen willekeur,
 * zodat de server hetzelfde tekent als de browser.
 */
const VLEKJES = Array.from({ length: 34 }, (_, i) => {
  const rij = Math.floor(i / 6);
  const kol = i % 6;
  return {
    cx: 22 + kol * 33 + (rij % 2 === 0 ? 0 : 15),
    cy: 26 + rij * 34 + ((kol * 11) % 15),
    r: 4.5 + ((i * 7) % 4) * 0.9,
  };
});

function Vlekjes({ dof }: { dof?: boolean }) {
  return (
    <>
      {VLEKJES.map((v) => (
        <circle
          key={`${v.cx}-${v.cy}`}
          cx={v.cx}
          cy={v.cy}
          r={v.r}
          fill="var(--litteken-vers)"
          opacity={dof ? 0.07 : 0.62}
        />
      ))}
    </>
  );
}

function Uitleg({ u }: { u: Uitkomst }) {
  return (
    <div className="rounded-[var(--r-md)] bg-white p-6 sm:p-7">
      {u.spoed ? (
        <Label className="text-[var(--warn-text)]">
          Dit is een reden om te bellen
        </Label>
      ) : (
        <Label>Geen haast, wel een vraag</Label>
      )}
      <h3 className="diba-card-title-lg mt-3">{u.kop}</h3>
      <dl className="mt-5 space-y-4">
        {[
          ["Wat je ziet", u.watJeZag],
          ["Wat dat kan betekenen", u.watHetKanBetekenen],
          ["Wat je dan doet", u.watJeDoet],
        ].map(([kop, tekst]) => (
          <div
            key={kop}
            className={`rounded-[var(--r-sm)] p-4 ${
              u.spoed ? "bg-[var(--g-050)]" : "bg-[var(--g-025)]"
            }`}
          >
            <dt className="diba-label text-[var(--t-label)]">{kop}</dt>
            <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(tekst)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function Glastest() {
  const [druk, setDruk] = useState(45);
  const uid = useId().replace(/:/g, "");
  const rand = (druk / 100) * HOOG;

  return (
    <div className="mt-12">
      <div className="rounded-[var(--r-lg)] bg-white p-5 sm:p-8">
        <div className="overflow-hidden rounded-[var(--r-sm)]">
          <svg
            viewBox={`0 0 ${BREED} ${HOOG}`}
            className="block w-full"
            aria-hidden="true"
          >
            <defs>
              {/* Alles boven de rand ligt onder het glas. */}
              <clipPath id={`${uid}-glas`}>
                <rect x="0" y="0" width={BREED} height={rand} />
              </clipPath>
              <clipPath id={`${uid}-rechts`}>
                <rect x={HELFT + NAAD} y="0" width={HELFT} height={HOOG} />
              </clipPath>
            </defs>

            <rect width={BREED} height={HOOG} fill="var(--g-025)" />
            <rect width={HELFT} height={HOOG} fill="var(--g-050)" />
            <rect
              x={HELFT + NAAD}
              width={HELFT}
              height={HOOG}
              fill="var(--g-050)"
            />

            {/* De vlekjes zonder druk. Links en rechts identiek, en dat hoort zo. */}
            <g>
              <Vlekjes />
            </g>
            <g transform={`translate(${HELFT + NAAD} 0)`}>
              <Vlekjes />
            </g>

            {/* Onder het glas. Het glas duwt het bloed uit de huid, dus alles verbleekt
                een beetje; daarna komt alleen rechts weer terug. */}
            <g clipPath={`url(#${uid}-glas)`}>
              <rect width={BREED} height={HOOG} fill="white" opacity="0.72" />
              <g transform={`translate(${HELFT + NAAD} 0)`}>
                <Vlekjes />
              </g>
              {/* Links blijft er een spoor over: verbleken is niet verdwijnen. */}
              <g>
                <Vlekjes dof />
              </g>
            </g>

            {/* De onderrand van het glas, als vulling en niet als lijn. */}
            <rect
              x="0"
              y={Math.max(0, rand - 5)}
              width={BREED}
              height={rand > 0 && rand < HOOG ? 5 : 0}
              fill="var(--g-300)"
            />
          </svg>
        </div>

        {/* De bijschriften staan buiten de tekening, want in de tekening zouden ze onder
            het glas mee verbleken. */}
        <div
          className="mt-4 grid gap-3"
          style={{
            gridTemplateColumns: `${HELFT}fr ${NAAD}fr ${HELFT}fr`,
          }}
        >
          <p className="diba-label text-[var(--t-label)]">
            Deze verbleken onder het glas
          </p>
          <span aria-hidden="true" />
          <p className="diba-label text-[var(--warn-text)]">
            Deze blijven staan
          </p>
        </div>

        <div className="mt-6 rounded-[var(--r-sm)] bg-[var(--g-025)] p-5">
          <label htmlFor={`${uid}-schuif`} className="diba-label block">
            Druk het glas aan
          </label>
          <input
            id={`${uid}-schuif`}
            type="range"
            min={0}
            max={100}
            step={1}
            value={druk}
            onChange={(e) => setDruk(Number(e.target.value))}
            aria-valuetext={
              druk < 6
                ? "Glas nog niet aangedrukt. Beide helften zien er hetzelfde uit."
                : druk > 94
                  ? "Glas volledig aangedrukt. Links verbleekt, rechts blijft staan."
                  : "Glas half aangedrukt. Boven de rand zie je het verschil, eronder nog niet."
            }
            className="diba-schuif fase-vers mt-3"
            style={{ "--schuif-voortgang": `${druk}%` } as CSSProperties}
          />
          <p className="mt-4 max-w-[76ch] text-[15px] leading-7 text-[var(--t-body)]">
            Zet hem eerst helemaal naar links. Beide helften zijn dan niet uit
            elkaar te houden, en precies daarom bestaat deze test. Druk het glas
            dan aan en kijk wat er onder de rand gebeurt.
          </p>
        </div>
      </div>

      {/* Beide uitkomsten, altijd allebei in beeld. Ze wisselen niet met de schuif mee:
          wat er bij jou aan de hand is hangt van je huid af en niet van deze bediening. */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Uitleg u={GLASTEST.wegdrukbaar} />
        <Uitleg u={GLASTEST["niet-wegdrukbaar"]} />
      </div>

      <p className="mt-8 max-w-[80ch] text-sm leading-6 text-[var(--t-muted)]">
        {publicCopy(GLASTEST_UITLEG)}
      </p>
    </div>
  );
}
