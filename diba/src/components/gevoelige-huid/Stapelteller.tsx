"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import {
  BELASTING_TEKST,
  BOTSING_UITLEG,
  STAPELAARS,
  bepaalBelasting,
} from "@/data/gevoelige-huid";
import { publicCopy } from "@/lib/copy-flags";
import { RASTER_SECTIE } from "@/lib/raster";

/**
 * De stapelteller — de uitblinker van de pagina over een gevoelige huid.
 *
 * Achter "mijn huid verdraagt niets meer" zit zelden één product. Er zit een routine die
 * in de loop van jaren is volgestapeld met stoffen die elk op zich prima zijn en samen op
 * dezelfde barrière werken. Niemand ziet dat, omdat je het per product bekijkt en niet bij
 * elkaar optelt.
 *
 * Dus telt deze op. Je vinkt aan wat je gebruikt, de meter loopt vol, en botsende
 * combinaties worden apart benoemd. Dat is een andere beweging dan de schakelaars op de
 * poriënpagina: daar zet je iets aan om te zien wat het oplevert, hier zie je wat er al
 * aanstaat en wat dat samen doet.
 *
 * De uitkomst is bijna altijd aftrekken, en dat levert ons niets op. Precies daarom staat
 * het er.
 *
 * Toegankelijkheid: gewone checkboxes met een zichtbaar label, en de uitkomst staat in een
 * live region. De meter is versierd, de tekst ernaast draagt de betekenis.
 */

const METER_KLEUR = {
  rustig: "bg-[var(--g-600)]",
  vol: "bg-[var(--warn)]",
  "te-vol": "bg-[var(--litteken-vers)]",
} as const;

const METER_TEKST = {
  rustig: "text-[var(--g-700)]",
  vol: "text-[var(--warn-text)]",
  "te-vol": "text-[var(--t-strong)]",
} as const;

/** Bovengrens van de meter: alles aanvinken kan, maar vol is vol. */
const MAX_PUNTEN = 8;

export default function Stapelteller() {
  const [aan, setAan] = useState<ReadonlySet<string>>(new Set());

  const punten = STAPELAARS.filter((s) => aan.has(s.id)).reduce(
    (t, s) => t + s.gewicht,
    0,
  );
  const belasting = bepaalBelasting(punten);
  const lezing = BELASTING_TEKST[belasting];

  /* Botsende paren, één keer per paar. Zonder die ontdubbeling zie je elke combinatie
     twee keer terug: eenmaal vanaf links en eenmaal vanaf rechts. */
  const botsingen: { a: string; b: string }[] = [];
  for (const s of STAPELAARS) {
    if (!aan.has(s.id)) continue;
    for (const anderId of s.botst) {
      if (!aan.has(anderId)) continue;
      if (botsingen.some((p) => p.a === anderId && p.b === s.id)) continue;
      const ander = STAPELAARS.find((x) => x.id === anderId);
      if (ander) botsingen.push({ a: s.id, b: anderId });
    }
  }

  const naam = (id: string) => STAPELAARS.find((s) => s.id === id)?.naam ?? id;

  return (
    <div className={`mt-12 ${RASTER_SECTIE}`}>
      {/* ── De lijst ── */}
      <ul className="grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] sm:grid-cols-2">
        {STAPELAARS.map((s) => {
          const gekozen = aan.has(s.id);
          return (
            <li key={s.id} className="bg-white">
              <label
                className={`flex h-full cursor-pointer gap-3 p-5 transition-colors ${
                  gekozen ? "bg-[var(--g-050)]" : "hover:bg-[var(--g-025)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={gekozen}
                  onChange={() =>
                    setAan((v) => {
                      const n = new Set(v);
                      if (n.has(s.id)) n.delete(s.id);
                      else n.add(s.id);
                      return n;
                    })
                  }
                  className="mt-1 h-5 w-5 shrink-0 accent-[var(--g-700)]"
                />
                <span>
                  <span className="block text-[16px] leading-6 font-medium text-[var(--t-strong)]">
                    {s.naam}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-[var(--t-muted)]">
                    {s.onder}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {/* ── De uitkomst ── */}
      <div className="self-start lg:sticky lg:top-24">
        <Label>Wat er samen op je huid werkt</Label>

        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-[var(--r-pill)] bg-[var(--g-100)]">
          <div
            className={`h-full rounded-[var(--r-pill)] transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none ${METER_KLEUR[belasting]}`}
            style={{ width: `${Math.min(100, (punten / MAX_PUNTEN) * 100)}%` }}
          />
        </div>

        <div aria-live="polite">
          <h3 className={`diba-card-title-lg mt-6 ${METER_TEKST[belasting]}`}>
            {lezing.kop}
          </h3>
          <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
            {lezing.tekst}
          </p>
          <p className="mt-4 border-l-2 border-[var(--g-300)] pl-4 text-[16px] leading-7 text-[var(--t-strong)]">
            {publicCopy(lezing.advies)}
          </p>

          {botsingen.length > 0 ? (
            <div className="mt-7 rounded-[var(--r-sm)] bg-[var(--g-050)] p-5">
              <Label className="text-[var(--warn-text)]">
                {botsingen.length === 1
                  ? "Eén combinatie valt op"
                  : `${botsingen.length} combinaties vallen op`}
              </Label>
              <ul className="mt-3 space-y-1.5">
                {botsingen.map((p) => (
                  <li
                    key={`${p.a}-${p.b}`}
                    className="text-[15px] leading-6 text-[var(--t-body)]"
                  >
                    {naam(p.a)} naast {naam(p.b).toLowerCase()}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm leading-6 text-[var(--t-muted)]">
                {publicCopy(BOTSING_UITLEG)}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          {belasting === "rustig" ? (
            <Button href="#anders" variant="secundair">
              Kijk dan hieronder verder
            </Button>
          ) : (
            <Button href="/intake?topic=gevoelige-huid">
              Laat meekijken naar je routine
            </Button>
          )}
          {punten > 0 ? (
            <button
              type="button"
              onClick={() => setAan(new Set())}
              className="diba-label underline underline-offset-4 hover:text-[var(--g-700)]"
            >
              Begin opnieuw
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
