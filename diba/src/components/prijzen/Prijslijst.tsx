"use client";

import { useMemo, useState } from "react";
import Label from "@/components/ui/Label";
import PriceTable from "@/components/ui/PriceTable";
import { LASER_GESLACHTEN, type LaserGeslacht } from "@/data/laser-zones";
import {
  VOORLOPIGE_PRIJZEN,
  sectionsForCategory,
  type PriceCategory,
} from "@/data/prices";

/**
 * De prijslijst met haar filters.
 *
 * Alleen dit stuk is client, de rest van de pagina niet. De filters zijn het enige wat hier
 * beweegt en dat hoeft geen hele pagina mee te nemen.
 *
 * GEEN ZOEKVELD, EN DAT BLIJFT ZO.
 *
 * Een prijslijst waarin je moet zoeken verbergt iets. Alles staat er, altijd, uitgeklapt.
 * Dat principe is niet veranderd, maar het probleem eromheen wel: sinds de echte tarieven
 * erin staan zijn het ongeveer vijfentachtig regels over tien secties in plaats van dertig
 * over vier. Vindbaarheid is dan een echt probleem, en de verleiding is om er een zoekveld
 * op te zetten dat de rest wegfiltert.
 *
 * Dat lost het verkeerde op. Wat er nodig is, is sneller kúnnen komen waar je moet zijn,
 * zonder dat er iets verdwijnt. Vandaar een register bovenaan met sprongkoppelingen en het
 * aantal regels per sectie. Je ziet dus nog steeds in één blik hoe lang de lijst is, en
 * dat is precies de informatie die een zoekveld voor je zou wegpoetsen.
 *
 * WEL EEN KEUZE TUSSEN DE TWEE LASERLIJSTEN.
 *
 * Dat is geen filter maar een correctie. De kliniek hanteert voor laserontharing twee
 * tarievenlijsten, en zonder keuze staat "Voorhoofd" twee keer op deze pagina met vijftig
 * en vijfenzestig euro ernaast. Beide bedragen kloppen en samen zeggen ze niets. Er wordt
 * hier dus geen informatie verborgen; er wordt bepaald wélke van de twee voor jou geldt.
 */
/**
 * Alleen nog de laserzones.
 *
 * De huid- en metingregels stonden hier als tweede kopie van wat er al in
 * `behandelingen.ts` staat, en toonden alleen een naam met een bedrag. Twee bronnen voor
 * één prijs lopen binnen een maand uit elkaar, en een bedrag zonder hersteltijd of aantal
 * sessies beantwoordt de vraag niet waarmee iemand hier komt. Die staan nu in
 * `Behandelprijzen`, dat rechtstreeks uit de behandelingentabel leest.
 *
 * Wat hier blijft is wél een tabel: veertig zones tegen twee tarievenlijsten. Dat is
 * rijen en kolommen in de letterlijke zin, en daar is een tabel het juiste gereedschap.
 */
export default function Prijslijst() {
  const [lijst, setLijst] = useState<LaserGeslacht>("dames");
  const categorie: PriceCategory = "laser";

  const secties = useMemo(
    () =>
      sectionsForCategory(categorie).filter(
        (s) => s.geslacht === undefined || s.geslacht === lijst,
      ),
    [categorie, lijst],
  );

  const toontLaser = secties.some((s) => s.category === "laser");
  const totaalRegels = secties.reduce((n, s) => n + s.rows.length, 0);

  return (
    <div>

      {/* De laserlijst geldt per persoon, dus die keuze staat er alleen als hij ertoe doet. */}
      {toontLaser ? (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-[15px] leading-6 text-[var(--t-body)]">
            Laserontharing heeft twee tarievenlijsten. Welke geldt voor jou?
          </p>
          <div
            role="group"
            aria-label="Tarievenlijst laserontharing"
            className="flex flex-wrap gap-2"
          >
            {LASER_GESLACHTEN.map((g) => (
              <button
                key={g.id}
                type="button"
                aria-pressed={g.id === lijst}
                onClick={() => setLijst(g.id)}
                className={`diba-label inline-flex min-h-11 items-center rounded-[var(--r-pill)] px-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                  g.id === lijst
                    ? "diba-pill-active"
                    : "bg-white text-[var(--t-label)] hover:bg-[var(--g-050)]"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {VOORLOPIGE_PRIJZEN ? (
        <p className="mt-6 max-w-[62ch] rounded-[var(--r-sm)] bg-[var(--g-050)] p-5 text-[15px] leading-7 text-[var(--t-body)]">
          De bedragen hieronder zijn voorlopig en nog niet door de kliniek
          vastgesteld. Wat er wel al klopt is de indeling: welke behandelingen
          er zijn, welke zones er bestaan en wat een pakket vervangt.
        </p>
      ) : null}

      {/* Het register: sneller ergens komen, zonder dat er iets verdwijnt. */}
      {secties.length > 1 ? (
        <nav aria-label="Naar een prijslijst" className="mt-8">
          <p className="diba-label text-[var(--t-label)]">
            {totaalRegels} tarieven in {secties.length} lijsten
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {secties.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-[15px] leading-6 text-[var(--g-700)] underline decoration-[var(--g-300)] underline-offset-4 transition-colors hover:decoration-[var(--g-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  {s.caption}{" "}
                  <span className="text-[var(--t-muted)] tabular-nums">
                    {s.rows.length}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {/* Kolommen die vullen, geen raster dat uitrekt.
          Dit was `grid lg:grid-cols-2`, en rasteritems rekken mee met de langste in hun
          rij. De sectie Metingen heeft één regel van 138 pixels en stond naast een buur
          van 1182: dat leverde ruim duizend pixels wit op in een kaart met één prijs
          erin. Precies wat er op het scherm zo raar uitzag.

          De secties verschillen enorm in lengte, van één regel tot vijfentwintig. Dan is
          een raster het verkeerde gereedschap: dat wil rijen, en rijen willen gelijke
          hoogtes. Kolommen laten de secties gewoon doorlopen en achter elkaar aansluiten,
          dus er blijft nergens lucht over. `break-inside-avoid` houdt een sectie heel. */}
      <div className="mt-10 gap-4 lg:columns-2 [&>section]:mb-4 [&>section]:break-inside-avoid">
        {secties.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="scroll-mt-[var(--anker-offset)] overflow-x-auto rounded-[var(--r-md)] bg-white p-6 sm:p-8"
          >
            {s.zin ? (
              <p className="mb-5 max-w-[52ch] text-[14px] leading-6 text-[var(--t-muted)]">
                {s.zin}
              </p>
            ) : null}
            <PriceTable caption={s.caption} rows={[...s.rows]} />
          </section>
        ))}
      </div>

      {secties.length === 0 ? (
        <p className="mt-10 text-[16px] leading-7 text-[var(--t-body)]">
          Er staat nog niets onder deze categorie.
        </p>
      ) : null}

      <p className="mt-8 max-w-[62ch] text-[14px] leading-6 text-[var(--t-muted)]">
        <Label>Geen sterretjes</Label>
        <span className="mt-2 block">
          Er staan hier geen voetnoten met voorwaarden en geen bedragen die pas
          aan de balie compleet worden. Wat je hier ziet is wat een sessie kost.
          Hoeveel sessies je nodig hebt hoor je in de intake, en dat getal
          bepaalt je totaal meer dan het tarief hiernaast.
        </span>
      </p>
    </div>
  );
}
