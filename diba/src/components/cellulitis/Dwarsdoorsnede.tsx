"use client";

import { useState, type CSSProperties } from "react";
import Label from "@/components/ui/Label";
import { BOUW, GEWICHT_TEKST, type Bouw } from "@/data/cellulitis";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De dwarsdoorsnede — de uitblinker van de cellulitispagina.
 *
 * Eén feit verklaart alles wat mensen over cellulitis niet begrijpen: de richting van de
 * bindweefselschotjes onder de huid. Rechtop bij vrouwen, kruislings bij mannen. Daarom
 * hebben slanke vrouwen het ook, daarom haalt sporten het patroon niet weg, en daarom
 * zitten mannen er nauwelijks mee.
 *
 * TWEEDE VERSIE. WAT ER MIS WAS.
 *
 * Er stond één doorsnede met een schakelaar eronder. Twee dingen gingen daardoor mis.
 *
 * Het eerste is de schakelaar zelf. Het hele argument is een vergelijking — dezelfde
 * hoeveelheid vet, een ander oppervlak — en een schakelaar zet die vergelijking om in een
 * geheugentest. Je ziet stand A, klikt naar stand B, en moet zelf onthouden wat er
 * veranderde. Nu staan ze naast elkaar en beweegt één schuif ze allebei tegelijk. Het
 * verschil is dan geen herinnering meer maar iets wat je ziet gebeuren.
 *
 * Het tweede is de tekening. Die bestond uit lijnen: een zwarte golf voor het oppervlak,
 * groene strepen voor de schotjes, een beige balk voor het vet. Dat las als een rij bogen,
 * niet als een doorsnede, en het was ook nog eens de enige lijntekening op de site terwijl
 * overal elders alles vulling is.
 *
 * Nu is het omgedraaid, en dat is meteen anatomisch juister. Het bindweefsel is het vlak
 * en de vetkamers zijn de lichte vormen daarin. De schotjes zijn dus de tussenruimte: geen
 * streep die iets voorstelt, maar de plek waar geen vet zit. En de bovenrand van dat vlak
 * ís het oppervlak dat je in de spiegel ziet, dus er hoeft geen lijn overheen.
 *
 * BEELD: schematisch, geen huid en geen lichaam (§14).
 */

/** Waar de doorsnede begint en eindigt. Eén plek, want beide tekeningen delen hem. */
const BREED = 300;
const OPPERVLAK = 62;
const HOOG = 196;
/* Hoe diep de spierlaag ligt bij de dunste en de dikste vetlaag. De schuif heet "hoeveel
   vet erin zit", dus moet de laag ook echt dikker worden; hij veranderde eerst alleen de
   bolling, en dan meet de schuif iets anders dan wat er op het label staat. */
const SPIER_DUN = 112;
const SPIER_DIK = 162;

/** Vijf kamers naast elkaar bij rechtopstaande schotjes. */
const KAMERS = [0, 1, 2, 3, 4];
const KAMER = BREED / KAMERS.length;

/**
 * Eén doorsnede.
 *
 * `vet` stuurt twee dingen tegelijk, en dat is precies de boodschap: hoeveel vet erin zit,
 * en hoe ver dat vet omhoog komt. Bij rechtopstaande schotjes gaat het tweede mee omhoog
 * met het eerste. Bij kruislingse schotjes niet, want daar is geen kamer die het vet één
 * kant op duwt.
 */
function Doorsnede({ bouw, vet }: { bouw: Bouw["id"]; vet: number }) {
  const rechtop = bouw === "verticaal";
  const deel = vet / 100;

  /* Hoe diep de kuiltjes zijn. Bij kruislings blijft de bovenrand vlak, hoeveel vet je er
     ook in schuift: dat is het hele bewijs dat het niet om de hoeveelheid gaat. */
  const bolling = rechtop ? 3 + deel * 21 : 0;
  const spier = SPIER_DUN + deel * (SPIER_DIK - SPIER_DUN);

  const bovenrand = rechtop
    ? `M0 ${OPPERVLAK} ` +
      KAMERS.map(
        (i) =>
          `Q${i * KAMER + KAMER / 2} ${OPPERVLAK - bolling * 2} ${(i + 1) * KAMER} ${OPPERVLAK}`,
      ).join(" ")
    : `M0 ${OPPERVLAK} L${BREED} ${OPPERVLAK}`;

  const weefsel = `${bovenrand} L${BREED} ${spier} L0 ${spier} Z`;

  return (
    <svg
      viewBox={`0 0 ${BREED} ${HOOG}`}
      className="block w-full"
      aria-hidden="true"
    >
      {/* Het bindweefsel: het vlak waar alles in ligt. De bovenrand hiervan is het
          oppervlak dat je in de spiegel ziet. */}
      <path
        d={weefsel}
        fill="var(--g-200)"
        className="transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
      />

      {/* De vetkamers. Wat je tússen de kamers ziet zijn de schotjes. */}
      {rechtop
        ? KAMERS.map((i) => (
            <rect
              key={i}
              x={i * KAMER + 9}
              y={OPPERVLAK - bolling + 6}
              width={KAMER - 18}
              height={spier - OPPERVLAK + bolling - 14}
              rx={(KAMER - 18) / 2}
              fill="var(--g-050)"
              className="transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
            />
          ))
        : /* Kruislingse schotjes delen dezelfde ruimte op in een ruitrooster. Ruiten en
             geen liggende kamers, want dan lopen de tussenruimtes schuin in twee
             richtingen tegelijk, en dat is letterlijk wat "kruislings" betekent. Geen
             enkele daarvan loopt van de huid tot de spier door, dus is er ook geen punt
             dat de huid omlaag trekt en blijft de bovenrand vlak. */
          [0, 1, 2].flatMap((rij) =>
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map((kol) => {
              const zij = 15 + deel * 6;
              const x = kol * 36 + (rij % 2 === 0 ? 4 : 22);
              /* De rijen verdelen zich over de laag, hoe dik die ook is. Bij een dunne
                 laag schuiven ze dus naar elkaar toe in plaats van door de spier heen. */
              const y =
                OPPERVLAK + ((spier - OPPERVLAK) * (rij * 2 + 1)) / 6;
              if (x > BREED) return null;
              return (
                <rect
                  key={`${rij}-${kol}`}
                  x={x - zij / 2}
                  y={y - zij / 2}
                  width={zij}
                  height={zij}
                  rx={5}
                  transform={`rotate(45 ${x} ${y})`}
                  fill="var(--g-050)"
                  className="transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
                />
              );
            }),
          )}

      {/* De spierlaag: de vaste bodem waar de schotjes op aanhechten. */}
      <rect
        x="0"
        y={spier}
        width={BREED}
        height={HOOG - spier}
        fill="var(--g-400)"
        className="transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
      />
    </svg>
  );
}

export default function Dwarsdoorsnede() {
  const [vet, setVet] = useState(70);

  return (
    <div className="mt-12">
      <div className="rounded-[var(--r-lg)] bg-white p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {(["verticaal", "kruislings"] as const).map((id) => {
            const b = BOUW[id];
            return (
              <div key={id}>
                <div className="overflow-hidden rounded-[var(--r-sm)] bg-[var(--g-025)]">
                  <Doorsnede bouw={id} vet={vet} />
                </div>
                <p className="diba-label mt-4 text-[var(--t-label)]">
                  {b.onder}
                </p>
                <h3 className="diba-card-title mt-2 text-[var(--t-strong)]">
                  {b.naam}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(b.watErGebeurt)}
                </p>
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {b.gevolg}
                </p>
              </div>
            );
          })}
        </div>

        {/* Eén schuif voor allebei. Dat is het hele punt: dezelfde hoeveelheid vet, twee
            oppervlakken. Twee losse schuiven zouden de vergelijking meteen kapotmaken. */}
        <div className="mt-8 rounded-[var(--r-sm)] bg-[var(--g-025)] p-5 sm:p-6">
          <label htmlFor="vetlaag" className="diba-label block">
            Hoeveel vet er in allebei zit
          </label>
          <input
            id="vetlaag"
            type="range"
            min={20}
            max={100}
            step={1}
            value={vet}
            onChange={(e) => setVet(Number(e.target.value))}
            aria-valuetext={`Vetlaag ${vet < 45 ? "dun" : vet < 75 ? "gemiddeld" : "dik"}, in beide doorsnedes even dik`}
            className="diba-schuif fase-rijp mt-3"
            style={
              {
                "--schuif-voortgang": `${((vet - 20) / 80) * 100}%`,
              } as CSSProperties
            }
          />
          <p className="mt-4 max-w-[76ch] text-[15px] leading-7 text-[var(--t-body)]">
            Schuif hem van links naar rechts en kijk naar de bovenranden. Links
            worden de kuiltjes dieper, rechts blijft het vlak. Zet hem dan
            helemaal naar links: het reliëf wordt vlakker en het patroon staat er
            nog steeds, want de schotjes lopen nog waar ze liepen.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-[var(--r-md)] bg-[var(--g-050)] p-6 sm:p-7">
          <Label>{GEWICHT_TEKST.kop}</Label>
          <p className="mt-3 text-[16px] leading-7 text-[var(--t-body)]">
            {publicCopy(GEWICHT_TEKST.tekst)}
          </p>
        </div>
        <div className="rounded-[var(--r-md)] bg-[var(--g-050)] p-6 sm:p-7">
          <Label>Waar je naar kijkt</Label>
          <p className="mt-3 text-[16px] leading-7 text-[var(--t-body)]">
            Het lichte vlak is vet, het vlak eromheen is bindweefsel en de
            groene balk onderin is spier. De bovenrand van dat middelste vlak is
            het oppervlak dat je in de spiegel ziet. Wat tussen de vetkamers
            zit, zijn de schotjes.
          </p>
        </div>
      </div>
    </div>
  );
}
