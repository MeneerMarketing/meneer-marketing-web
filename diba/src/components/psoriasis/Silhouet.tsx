"use client";

import { useState } from "react";
import Label from "@/components/ui/Label";
import { SILHOUET_SLOT, ZONES } from "@/data/psoriasis";
import { publicCopy } from "@/lib/copy-flags";
import { RASTER_SECTIE } from "@/lib/raster";

/**
 * Het silhouet — de uitblinker van de psoriasispagina.
 *
 * Psoriasis wordt gezocht als huidprobleem en is er geen. Het is een afweeraandoening die
 * zich op meerdere plekken laat zien, en juist die spreiding is het bewijs: hoofdhuid,
 * strekzijden, nagels en gewrichten horen bij elkaar. Wie alleen naar de plekken kijkt,
 * mist de nagels die voor schimmel worden aangezien en de gewrichten waar wachten
 * blijvende schade geeft.
 *
 * Daarom een silhouet en geen gezicht. De acnekaart laat zien wáár op je gezicht iets zit
 * en waarom dat iets betekent over de oorzaak; dit laat zien hoe ver de aandoening reikt.
 * Andere vraag, ander beeld.
 *
 * De gewrichtszone is de enige met een dringende toon, en dat is geen opsmuk: schade aan
 * een gewricht komt niet terug.
 *
 * BEELD: schematisch silhouet zonder gezicht en zonder huidtint (§14).
 */

export default function Silhouet() {
  const [actief, setActief] = useState(0);
  const zone = ZONES[actief];

  return (
    <div className={`mt-12 ${RASTER_SECTIE}`}>
      {/* ── De plekken ──
          Hier stond een getekend poppetje: hoofd, romp en ledematen als losse vlakken,
          met vier labels eromheen gehangen op vaste ankerpunten. Hetzelfde bezwaar als
          bij het hoofd op de acnepagina en de kronkelstreep bij littekens. Je moest maar
          raden wat je zag, de labels hadden een zweefschaduw die deze huisstijl niet
          voert, en zodra een naam iets langer werd botste hij tegen de romp.

          De boodschap is bovendien niet hoe een lichaam eruitziet maar dat deze vier bij
          elkaar horen. Als lijst van boven naar beneden lees je die spreiding net zo
          goed, en er is ruimte om erbij te zetten waar elk van de vier voor wordt
          aangezien. Dat laatste is bij psoriasis het punt: nagels gaan door voor
          schimmel, de hoofdhuid voor hardnekkige roos. */}
      <ul
        role="radiogroup"
        aria-label="De plekken waar psoriasis zich laat zien"
        className="flex flex-col gap-2 rounded-[var(--r-md)] bg-white p-5 sm:p-6 lg:h-full"
      >
        <li>
          <p className="diba-label text-[var(--t-label)]">
            Van boven naar beneden
          </p>
          <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
            Ze horen bij dezelfde aandoening, ook als ze niet tegelijk opspelen.
          </p>
        </li>
        {ZONES.map((z, i) => {
          const aan = i === actief;
          return (
            <li key={z.id} className={i === 0 ? "mt-3" : undefined}>
              <button
                type="button"
                role="radio"
                aria-checked={aan}
                onClick={() => setActief(i)}
                className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-[var(--r-sm)] px-5 py-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                  aan
                    ? "bg-[var(--g-700)] text-white"
                    : "bg-[var(--g-050)] text-[var(--t-strong)] hover:bg-[var(--g-100)]"
                }`}
              >
                <span className="text-[16px] leading-6 font-medium">
                  {z.naam}
                </span>
                {/* Bij de gewrichten kan wachten blijvende schade geven. Dat mag je niet
                    pas zien nadat je hem hebt aangetikt. */}
                {z.dringend ? (
                  <span
                    className={`diba-label shrink-0 rounded-[var(--r-pill)] px-3 py-1 ${
                      aan
                        ? "bg-white/20 text-white"
                        : "bg-[var(--g-050)] text-[var(--warn-text)]"
                    }`}
                  >
                    Niet mee wachten
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {/* ── De lezing ── */}
      <div aria-live="polite">
        {zone.dringend ? (
          <Label className="text-[var(--warn-text)]">
            Hier niet mee wachten
          </Label>
        ) : (
          <Label>Wat hier bij hoort</Label>
        )}

        <h3 className="diba-card-title-lg mt-4">{zone.naam}</h3>
        <p className="diba-label mt-3 text-[var(--t-muted)]">{zone.vakterm}</p>

        {/* Stond op strepen links. Vlakken of niets, en hier is niets genoeg: een label
            met een waarde eronder heeft geen bak nodig, ruimte doet het werk. */}
        <dl className="mt-7 space-y-6">
          <div>
            <dt className="diba-label text-[var(--t-label)]">
              Wat je ziet of voelt
            </dt>
            <dd className="mt-1.5 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(zone.watJeZiet)}
            </dd>
          </div>
          <div>
            <dt
              className={`diba-label ${
                zone.dringend
                  ? "text-[var(--warn-text)]"
                  : "text-[var(--t-label)]"
              }`}
            >
              Waarom dit telt
            </dt>
            <dd className="mt-1.5 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(zone.waaromHetTelt)}
            </dd>
          </div>
        </dl>

        <p className="mt-8 rounded-[var(--r-sm)] bg-[var(--g-050)] p-5 text-[15px] leading-7 text-[var(--t-body)]">
          {SILHOUET_SLOT}
        </p>
      </div>
    </div>
  );
}
