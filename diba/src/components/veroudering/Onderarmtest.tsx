"use client";

import { useId, useState, type CSSProperties } from "react";
import Label from "@/components/ui/Label";
import { ONDERARM } from "@/data/veroudering";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De onderarmtest — de uitblinker van de pagina over huidveroudering.
 *
 * Dermatologen laten dit al decennia met dezelfde demonstratie zien: kijk naar de
 * binnenkant van je bovenarm, kijk dan naar je gezicht. Allebei precies even oud, en
 * totaal anders. Het verschil is geen leeftijd maar zon.
 *
 * Dat is de enige demonstratie die het argument van deze pagina in één beweging maakt,
 * dus is hij de interactie geworden. Je veegt zelf tussen de twee stukken huid, en het
 * antwoord onderaan verandert mee met welke kant je laat zien.
 *
 * Waarom een veeg en geen schuifbalk zoals bij de littekenklok: dit is geen as met
 * stadia maar een vergelijking van twee toestanden. De beweging hoort dus over het beeld
 * te gaan en niet eronder.
 *
 * Toegankelijkheid: onder de veeg zit een echte range-input over het hele vlak, dus
 * slepen, tikken én pijltjestoetsen werken. aria-valuetext vertelt wat je ziet in plaats
 * van een percentage voor te lezen.
 *
 * BEELD: bewust schematisch. Geen huidtint en geen echte of gegenereerde huid (§14);
 * het gaat om het verschil tussen de twee vlakken, niet om realisme.
 */

/* Het vlak is 1200 bij 420. Alle kenmerken liggen over de héle breedte verdeeld, want
   welke helft je ziet hangt van de veeg af: er mag geen stand zijn waarin een kant leeg
   oogt. De posities zijn met de hand gezet en niet willekeurig, anders wijkt de render op
   de server af van die in de browser. */

/** Ingesleten lijnen. Alleen op de blootgestelde huid. */
const LIJNEN = [
  "M30 92c62-20 124-19 186 3s124 22 186 4",
  "M64 176c58-17 116-16 174 4s116 20 174 3",
  "M22 268c66-21 132-20 198 3s132 21 198 2",
  "M420 118c56-17 112-16 168 4s112 20 168 3",
  "M452 214c52-16 104-15 156 4s104 19 156 2",
  "M436 320c58-18 116-17 174 4s116 20 174 3",
  "M820 84c54-17 108-16 162 4s108 20 162 3",
  "M844 190c50-15 100-14 150 4s100 18 150 2",
  "M812 296c56-17 112-16 168 4s112 19 168 2",
  "M900 372c46-14 92-13 138 4s92 17 138 2",
] as const;

/** Pigmentvlekken: onregelmatig van vorm, verspreid over de hele breedte. */
const VLEKKEN = [
  { cx: 96, cy: 138, rx: 26, ry: 17, r: -14, o: 0.5 },
  { cx: 238, cy: 232, rx: 17, ry: 13, r: 9, o: 0.4 },
  { cx: 168, cy: 328, rx: 13, ry: 10, r: -4, o: 0.32 },
  { cx: 352, cy: 92, rx: 21, ry: 14, r: 16, o: 0.44 },
  { cx: 466, cy: 258, rx: 28, ry: 18, r: -8, o: 0.47 },
  { cx: 392, cy: 356, rx: 15, ry: 11, r: 5, o: 0.3 },
  { cx: 604, cy: 152, rx: 19, ry: 13, r: -12, o: 0.42 },
  { cx: 716, cy: 296, rx: 24, ry: 15, r: 7, o: 0.45 },
  { cx: 648, cy: 384, rx: 12, ry: 9, r: 0, o: 0.28 },
  { cx: 856, cy: 128, rx: 27, ry: 17, r: -10, o: 0.48 },
  { cx: 968, cy: 244, rx: 16, ry: 12, r: 14, o: 0.36 },
  { cx: 1088, cy: 168, rx: 22, ry: 14, r: -6, o: 0.43 },
  { cx: 1132, cy: 330, rx: 14, ry: 11, r: 8, o: 0.31 },
  { cx: 1012, cy: 366, rx: 18, ry: 12, r: -3, o: 0.34 },
] as const;

/** Verwijde vaatjes: korte kronkels, altijd in paren zoals je ze in het echt ziet. */
const VAATJES = [
  "M132 206c18-15 25 11 43-3s21 12 39 0",
  "M286 118c15-13 21 10 36-3s18 11 33-1",
  "M508 340c19-16 26 11 45-3s22 12 41-1",
  "M574 214c14-12 20 9 34-3s17 10 31-1",
  "M782 168c18-15 25 11 43-3s21 11 39-1",
  "M902 288c16-13 22 10 38-3s19 11 35-1",
  "M1046 96c17-14 24 10 41-3s20 11 37-1",
  "M1104 262c15-12 21 9 36-3s18 10 33-1",
] as const;

/** Onder deze stand kijk je vooral naar het gezicht, erboven vooral naar de arm. */
const KANTEL_LAAG = 34;
const KANTEL_HOOG = 66;

function Huidvlak({ blootgesteld, uid }: { blootgesteld: boolean; uid: string }) {
  /* Huid heeft van dichtbij een ruitjespatroon van piepkleine groefjes. Dat patroon
     wordt met de jaren en vooral met zon grover en onregelmatiger, en dat is precies
     wat je hier ziet: links fijn en gelijkmatig, rechts groot en grof. */
  const cel = blootgesteld ? 26 : 13;
  const patroonId = `huid-${uid}-${blootgesteld ? "zon" : "beschut"}`;

  return (
    // Op smalle schermen is het vlak hoger dan de tekening breed is. Bijsnijden in
    // plaats van uitrekken: je ziet dan een uitvergroot stuk in plaats van een
    // vervormd stuk, en dat leest juist beter.
    <svg
      viewBox="0 0 1200 420"
      preserveAspectRatio="xMidYMid slice"
      className="block h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patroonId}
          width={cel}
          height={cel}
          patternUnits="userSpaceOnUse"
          patternTransform={blootgesteld ? "rotate(4)" : undefined}
        >
          <path
            d={`M0 0 L${cel} ${cel} M${cel} 0 L0 ${cel}`}
            stroke={blootgesteld ? "var(--g-200)" : "var(--g-100)"}
            strokeWidth={blootgesteld ? 1.3 : 0.9}
            fill="none"
          />
        </pattern>
      </defs>

      <rect width="1200" height="420" fill="var(--g-050)" />
      <rect width="1200" height="420" fill={`url(#${patroonId})`} opacity={0.9} />

      {blootgesteld ? (
        <>
          {/* Ingesleten lijnen. Grijsgroen en niet groen: een groef is een schaduw,
              geen versiering. */}
          {LIJNEN.map((d) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke="var(--t-muted)"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.32"
            />
          ))}
          {VLEKKEN.map((v) => (
            <ellipse
              key={`${v.cx}-${v.cy}`}
              cx={v.cx}
              cy={v.cy}
              rx={v.rx}
              ry={v.ry}
              transform={`rotate(${v.r} ${v.cx} ${v.cy})`}
              fill="var(--warn)"
              opacity={v.o}
            />
          ))}
          {VAATJES.map((d) => (
            <path
              key={d}
              d={d}
              fill="none"
              className="huid-vaatje"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
          ))}
        </>
      ) : null}
    </svg>
  );
}

export default function Onderarmtest() {
  const [stand, setStand] = useState(50);
  const uid = useId().replace(/:/g, "");

  const kant =
    stand >= KANTEL_HOOG ? "beschut" : stand <= KANTEL_LAAG ? "blootgesteld" : "beide";
  const lezing =
    kant === "beschut"
      ? ONDERARM.beschut.lezing
      : kant === "blootgesteld"
        ? ONDERARM.blootgesteld.lezing
        : "Dit is dezelfde huid van dezelfde persoon op dezelfde dag. Links het stuk dat altijd bedekt was, rechts het stuk dat elke dag buiten kwam. Het verschil dat je ziet is niet aangebracht door de tijd.";

  return (
    <div className="mt-12">
      <div className="relative overflow-hidden rounded-[var(--r-md)] bg-[var(--g-050)]">
        {/* Onderlaag: de huid die zon kreeg. */}
        <div className="aspect-[5/4] w-full sm:aspect-[1200/420]">
          <Huidvlak blootgesteld uid={uid} />
        </div>

        {/* Bovenlaag: de beschutte huid, afgesneden op de stand van de veeg. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - stand}% 0 0)` }}
          aria-hidden="true"
        >
          <Huidvlak blootgesteld={false} uid={uid} />
        </div>

        {/* De scheidingslijn met de greep. */}
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-white/90 shadow-[var(--shadow-float)]"
          style={{ left: `${stand}%` }}
          aria-hidden="true"
        >
          <span className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[var(--r-pill)] border border-[var(--g-100)] bg-white text-[var(--g-700)] shadow-[var(--shadow-float)]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
              <path d="M9 6 4 12l5 6M15 6l5 6-5 6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        {/* Bijschriften. Ze verbleken zodra hun kant bijna weg geveegd is. */}
        <span
          className="pointer-events-none absolute top-4 left-4 rounded-[var(--r-pill)] bg-white/90 px-3 py-1.5 transition-opacity duration-300 sm:top-5 sm:left-5"
          style={{ opacity: stand < 18 ? 0 : 1 }}
        >
          <Label>{ONDERARM.beschut.label}</Label>
        </span>
        {/* Op mobiel past er maar één bijschrift op een regel, dus staat het rechter
            label onderaan. Vanaf sm staan ze weer tegenover elkaar. */}
        <span
          className="pointer-events-none absolute right-4 bottom-4 rounded-[var(--r-pill)] bg-white/90 px-3 py-1.5 transition-opacity duration-300 sm:top-5 sm:right-5 sm:bottom-auto"
          style={{ opacity: stand > 82 ? 0 : 1 }}
        >
          <Label>{ONDERARM.blootgesteld.label}</Label>
        </span>

        {/* De bediening ligt onzichtbaar over het hele vlak: slepen, tikken en
            pijltjestoetsen doen daardoor allemaal hetzelfde. */}
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={stand}
          onChange={(e) => setStand(Number(e.target.value))}
          aria-label="Veeg tussen beschutte en blootgestelde huid"
          aria-valuetext={
            kant === "beschut"
              ? "Vooral beschutte huid in beeld"
              : kant === "blootgesteld"
                ? "Vooral blootgestelde huid in beeld"
                : "Beide stukken huid even groot in beeld"
          }
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] [&::-moz-range-thumb]:h-full [&::-moz-range-thumb]:w-12 [&::-moz-range-thumb]:cursor-ew-resize [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:h-[var(--vlak-hoogte,340px)] [&::-webkit-slider-thumb]:w-12 [&::-webkit-slider-thumb]:cursor-ew-resize [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-transparent"
          style={{ "--vlak-hoogte": "100%" } as CSSProperties}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-10">
        <div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Label>{ONDERARM.beschut.label}</Label>
            <span className="text-sm text-[var(--t-muted)]">{ONDERARM.beschut.onder}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Label>{ONDERARM.blootgesteld.label}</Label>
            <span className="text-sm text-[var(--t-muted)]">
              {ONDERARM.blootgesteld.onder}
            </span>
          </div>
        </div>

        <div aria-live="polite">
          <p className="text-[16px] leading-7 text-[var(--t-body)]">{publicCopy(lezing)}</p>
          <p className="mt-4 border-l-2 border-[var(--g-300)] pl-4 text-[16px] leading-7 text-[var(--t-strong)]">
            Allebei die stukken huid zijn precies even oud. Wat je rechts extra ziet is
            opgebouwd, niet meegegroeid.
          </p>
        </div>
      </div>
    </div>
  );
}
