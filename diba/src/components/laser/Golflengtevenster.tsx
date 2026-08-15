"use client";

import { useId, useState } from "react";
import {
  GOLFLENGTES,
  golflengte,
  toewijzing,
  type GolflengteId,
} from "@/data/gentlemax";
import { FITZPATRICK_TYPES, type FitzpatrickId } from "@/data/laser-zones";

/**
 * Het golflengtevenster.
 *
 * WAT DIT LAAT ZIEN DAT NERGENS ANDERS STAAT.
 *
 * Dat er twee lasers in dit apparaat zitten, en dat jouw huidtype bepaalt welke van de
 * twee je krijgt. Dat is de enige technische keuze op deze site die rechtstreeks over
 * veiligheid gaat, en in folders staat hij nooit: die noemen "geschikt voor huidtype I tot
 * VI" en laten weg dat dat aan twee verschillende golflengtes te danken is.
 *
 * DE TEKENING, TWEEDE VERSIE.
 *
 * Er stonden twee witte staven met een bal aan het uiteinde op een donkergroen vlak, en
 * een dun lijntje naar nog een bal met "wortel" ernaast. Dat las als twee thermometers en
 * een lolly. Zelfde fout als bij het handstuk in het werkingsvenster: dingen tekenen in
 * plaats van laten zien wat er gebeurt.
 *
 * En de tekening liet het verkeerde zien. Ze zette de twee stralen naast elkaar op hun
 * eigen diepte, alsof die diepte een eigenschap van de golflengte is. Dat is het niet. Het
 * hele punt van deze pagina is dat het van jóuw huid afhangt: de 755 wordt sterk door
 * pigment opgenomen, dus zit er pigment in de bovenlaag, dan neemt die het op en komt er
 * niets bij de wortel aan. Dat is het verschil tussen een goede behandeling en een
 * brandwond, en het stond in de tekst maar niet in het beeld.
 *
 * Nu wel. De bovenlaag wordt donkerder naarmate je een hoger huidtype kiest, en de 755
 * wordt daar zichtbaar in opgeslokt: bij type VI haalt hij de wortel niet eens. De 1064
 * gaat er grotendeels langs en komt er wel. Je ziet dus niet twee stralen naast elkaar
 * maar één oorzaak met twee gevolgen.
 *
 * De niet-gekozen straal blijft zwak staan. Weglaten zou de vergelijking kapotmaken, en de
 * vergelijking is het hele punt.
 *
 * GEEN HUIDSKLEUREN IN DE TEKENING.
 *
 * De ring toont Fitzpatrick-types als cijfers en niet als kleurvlakjes. Zes vakjes in
 * oplopende bruintinten naast de vraag "welke ben jij" leest als een sorteerkaart, en dat
 * is precies wat je op een medische pagina niet wil. Het cijfer plus de omschrijving doet
 * hetzelfde werk zonder iemand in een kleurvak te zetten.
 *
 * [MEDISCHE-CHECK-ROJDA] de koppeling huidtype naar golflengte in `gentlemax.ts`.
 */

const OPPERVLAK = 26;
const BODEM = 190;
/** Waar de opperhuid ophoudt. Daar zit het pigment dat de 755 opslokt. */
const OPPERHUID = 62;
/**
 * Op welke diepte de haarwortel ligt. Het doelwit, dus de meetlat van de tekening.
 *
 * Stond eerst op 60, en dat kon niet: de 755 haalt volgens de data zelf maar 45. De wortel
 * lag dus dieper dan die golflengte ooit reikt, en daarmee zei de tekening dat de 755 bij
 * geen enkel huidtype werkt. Precies het tegenovergestelde van wat er in de tekst staat.
 * Op een lichte huid is de 755 juist de golflengte van keuze, dus hoort de wortel binnen
 * zijn bereik te liggen. [MEDISCHE-CHECK-ROJDA]
 */
const WORTEL = 42;

function diepteY(procent: number): number {
  return OPPERVLAK + ((BODEM - OPPERVLAK) * procent) / 100;
}

/**
 * Hoeveel pigment er in de bovenlaag zit, per Fitzpatrick-type.
 *
 * Geen meetwaarden maar een oplopende reeks: de schaal zelf is een indeling in zes
 * stappen en niet een getal. Wat de tekening ermee doet is één ding laten zien, namelijk
 * dat er meer van te absorberen valt naarmate je hoger in de reeks zit.
 * [MEDISCHE-CHECK-ROJDA]
 */
const PIGMENT: Record<FitzpatrickId, number> = {
  I: 0.05,
  II: 0.14,
  III: 0.27,
  IV: 0.44,
  V: 0.64,
  VI: 0.84,
};

export default function Golflengtevenster() {
  const [type, setType] = useState<FitzpatrickId>("III");
  const id = useId();

  const keuze = toewijzing(type);
  const actief: readonly GolflengteId[] =
    keuze.kies === "beide" ? ["755", "1064"] : [keuze.kies];

  const vlakId = id.replace(/:/g, "");
  const pigment = PIGMENT[type];

  /**
   * Hoe diep een straal komt bij dit huidtype.
   *
   * De 755 wordt sterk door pigment opgenomen, dus die verliest onderweg door de
   * bovenlaag het grootste deel van zijn bereik. De 1064 gaat er grotendeels langs en
   * merkt er nauwelijks iets van. Dat verschil ís de reden dat ze bij verschillende
   * huidtypes horen; het stond alleen nog nergens in beeld.
   */
  function bereik(gid: GolflengteId): number {
    const g = golflengte(gid);
    const vol = diepteY(g.diepte);
    const verlies = gid === "755" ? pigment * 0.82 : pigment * 0.1;
    return OPPERVLAK + (vol - OPPERVLAK) * (1 - verlies);
  }

  /**
   * Wat er onder de tekening staat.
   *
   * Hangt aan de toewijzing en niet aan de pixels. De tekening is een schets met
   * verzonnen verhoudingen; als de zin aan die verhoudingen hangt, dan bepaalt een
   * tekenconstante wat we over een veiligheidskeuze beweren. Dat hoort andersom.
   */
  const bijschrift =
    keuze.kies === "755"
      ? "Er zit weinig pigment in de bovenlaag om onderweg op te nemen, dus de 755 komt tot bij de wortel. Dat is meteen de reden dat hij hier de krachtigste van de twee is."
      : keuze.kies === "1064"
        ? "Kijk waar de 755 stopt. Het pigment in de bovenlaag neemt hem op, dus er komt niets bij de wortel aan en de warmte blijft achter in de huid. Daarom werken we hier met de 1064."
        : "Hier ligt het op de grens. De bovenlaag neemt al een deel van de 755 op, en of dat te veel is hangt af van hoe jouw huid op zon reageert. Dat bepalen we bij de intake en niet op deze pagina.";

  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      {/* Kiezer plus tekening. */}
      <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9">
        <p className="diba-label text-[var(--t-label)]">Kies je huidtype</p>
        <p className="mt-3 max-w-[46ch] text-[15px] leading-7 text-[var(--t-body)]">
          De schaal van Fitzpatrick gaat over hoe je huid op zon reageert, niet
          over hoe hij eruitziet. Weet je het niet zeker, dan wordt hij bij de
          intake bepaald.
        </p>

        <div
          role="radiogroup"
          aria-labelledby={`${id}-kop`}
          className="mt-6 flex flex-wrap gap-2"
        >
          <span id={`${id}-kop`} className="sr-only">
            Fitzpatrick huidtype
          </span>
          {FITZPATRICK_TYPES.map((t) => {
            const aan = t.id === type;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={aan}
                onClick={() => setType(t.id)}
                className={`min-h-12 min-w-12 rounded-[var(--r-md)] px-4 text-[16px] leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                  aan
                    ? "bg-[var(--g-700)] text-white"
                    : "bg-[var(--g-025)] text-[var(--g-900)] hover:bg-[var(--g-050)]"
                }`}
              >
                {t.id}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
          {FITZPATRICK_TYPES.find((t) => t.id === type)?.description}
        </p>

        {/* De doorsnede. */}
        <svg
          viewBox="0 0 270 210"
          role="img"
          aria-label={`Doorsnede van de huid. Bij huidtype ${type} wordt gewerkt met ${actief.map((a) => `${golflengte(a).nm} nanometer`).join(" of ")}. ${bijschrift}`}
          className="mt-8 w-full"
        >
          <defs>
            {/* Licht dooft naar beneden toe. Een balk met een harde onderkant leest als
                een voorwerp; een straal die uitdooft leest als licht dat opgenomen wordt. */}
            {GOLFLENGTES.map((g) => (
              <linearGradient
                key={g.id}
                id={`${vlakId}-straal-${g.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="white" stopOpacity="0.92" />
                <stop offset="72%" stopColor="white" stopOpacity="0.78" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* De huid: licht, zodat er geen tweede donker vlak op deze pagina bij komt
              (§5). Wel vol genoeg, want de stralen zijn wit en die moeten ergens tegen
              afsteken. */}
          <rect
            x="0"
            y={OPPERVLAK}
            width="270"
            height={BODEM - OPPERVLAK}
            rx="10"
            fill="var(--g-200)"
          />

          {/* De bovenlaag, met het pigment erin. Dit vlak is de hele tool: hoe donkerder
              het wordt, hoe minder er van de 755 doorheen komt. */}
          <path
            d={`M0 ${OPPERVLAK + 10} a10 10 0 0 1 10 -10 h250 a10 10 0 0 1 10 10 v${OPPERHUID - OPPERVLAK - 10} h-270 Z`}
            fill="var(--g-300)"
          />
          <path
            d={`M0 ${OPPERVLAK + 10} a10 10 0 0 1 10 -10 h250 a10 10 0 0 1 10 10 v${OPPERHUID - OPPERVLAK - 10} h-270 Z`}
            fill="var(--g-900)"
            style={{
              opacity: pigment * 0.62,
              transition: "opacity .45s var(--ease-diba)",
            }}
          />

          {/* De haarwortel als diepte, niet als tekeningetje: een band over de hele
              breedte, zodat je in één blik ziet wélke straal er komt. */}
          <rect
            x="0"
            y={diepteY(WORTEL) - 2}
            width="270"
            height="4"
            fill="var(--g-700)"
          />

          {/* De twee stralen. */}
          {GOLFLENGTES.map((g, i) => {
            const aan = actief.includes(g.id);
            const x = i === 0 ? 74 : 158;
            const eind = bereik(g.id);
            return (
              <g
                key={g.id}
                style={{
                  opacity: aan ? 1 : 0.55,
                  transition: "opacity .4s ease",
                }}
              >
                <rect
                  x={x - 16}
                  y={OPPERVLAK}
                  width="32"
                  height={eind - OPPERVLAK}
                  fill={`url(#${vlakId}-straal-${g.id})`}
                  style={{ transition: "height .45s var(--ease-diba)" }}
                />
                <text
                  x={x}
                  y={BODEM - 12}
                  textAnchor="middle"
                  className="fill-[var(--g-900)] text-[13px] font-medium"
                >
                  {g.nm}
                </text>
              </g>
            );
          })}

          <text
            x="10"
            y={OPPERVLAK - 8}
            className="fill-[var(--t-label)] text-[9px] tracking-[.14em] uppercase"
          >
            Bovenlaag met pigment
          </text>
          <text
            x="10"
            y={diepteY(WORTEL) - 8}
            className="fill-[var(--t-label)] text-[9px] tracking-[.14em] uppercase"
          >
            Haarwortel
          </text>
        </svg>

        <p
          className="mt-4 rounded-[var(--r-sm)] bg-[var(--g-025)] p-4 text-[15px] leading-7 text-[var(--t-body)]"
          aria-live="polite"
        >
          {bijschrift}
        </p>
        <p className="mt-3 text-[13px] leading-6 text-[var(--t-muted)]">
          Schematisch. De verhoudingen kloppen niet op de millimeter.
        </p>
      </div>

      {/* De uitkomst. */}
      <div className="flex flex-col gap-4">
        <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
          <p className="diba-label diba-label-on-dark">
            Bij huidtype {type} werken we met
          </p>
          <p className="mt-4 text-[34px] leading-none font-medium tracking-[-.05em]">
            {keuze.kies === "beide"
              ? "Allebei, dat hangt af van jou"
              : `${golflengte(keuze.kies).nm} nm`}
          </p>
          {keuze.kies !== "beide" ? (
            <p className="mt-2 text-[17px] leading-7 text-[var(--on-dark-accent)]">
              {golflengte(keuze.kies).naam}
            </p>
          ) : null}
          <p className="mt-5 max-w-[52ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
            {keuze.waarom}
          </p>
        </div>

        {/* items-start, want anders rekken beide kaarten mee met de langste. De 755 heeft
            minder tekst dan de 1064 en kreeg daardoor driehonderd pixels wit onderin. */}
        <ul className="grid gap-4 sm:grid-cols-2 sm:items-start">
          {GOLFLENGTES.map((g) => {
            const aan = actief.includes(g.id);
            return (
              <li
                key={g.id}
                className={`rounded-[var(--r-lg)] p-6 transition-colors duration-300 sm:p-7 ${
                  aan ? "bg-[var(--g-200)]" : "bg-white"
                }`}
              >
                <p
                  className={`text-[22px] leading-none font-medium tracking-[-.04em] ${aan ? "text-[var(--g-900)]" : "text-[var(--t-strong)]"}`}
                >
                  {g.nm} nm
                </p>
                <p
                  className={`mt-2 text-[15px] leading-6 ${aan ? "text-[var(--g-900)]" : "text-[var(--t-body)]"}`}
                >
                  {g.naam}
                </p>
                <p
                  className={`mt-4 text-[14px] leading-6 ${aan ? "text-[var(--g-900)]" : "text-[var(--t-muted)]"}`}
                >
                  {g.opname}
                </p>
                <p
                  className={`mt-4 text-[15px] leading-7 ${aan ? "text-[var(--g-900)]" : "text-[var(--t-body)]"}`}
                >
                  {g.sterk}
                </p>
                <p
                  className={`mt-4 rounded-[var(--r-md)] p-4 text-[14px] leading-6 ${
                    aan
                      ? "bg-white text-[var(--t-body)]"
                      : "bg-[var(--g-025)] text-[var(--t-body)]"
                  }`}
                >
                  <span className="diba-label block text-[var(--t-label)]">
                    De keerzijde
                  </span>
                  <span className="mt-2 block">{g.zwak}</span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
