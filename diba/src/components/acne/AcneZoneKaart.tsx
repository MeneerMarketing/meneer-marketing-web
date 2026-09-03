"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icon";
import Label from "@/components/ui/Label";
import { ACNE_ZONES, lees, type ZoneId } from "@/data/acne-zones";
import { publicCopy } from "@/lib/copy-flags";
import { RASTER_SECTIE } from "@/lib/raster";

/**
 * De acnekaart — het onderdeel dat deze pagina onderscheidt.
 *
 * Waar acne zit ís informatie: de kaaklijn wijst het vaakst op een hormonale factor, de
 * T-zone op talg, wangen vaker op contact en wrijving. Vrijwel elke acnepagina beschrijft
 * acne in het algemeen; deze laat de bezoeker zijn eigen zones aantikken en leest live
 * mee wat dat patroon betekent.
 *
 * WAT HIER STOND EN WAAROM HET WEG MOEST.
 *
 * Een getekend hoofd: een dunne contourlijn met daarin zwevende ellipsen, en twee
 * streepjes voor ogen en één voor een mond. Dat had twee problemen tegelijk.
 *
 * Het eerste is stijl. Deze huisstijl bouwt met gevulde vlakken en geen enkele lijn, en
 * dit was vrijwel alleen lijn: contour, randen om de ellipsen, streepjes. Precies wat er
 * elders van de site is afgehaald.
 *
 * Het tweede is dat het iets probeerde te tékenen. De drie tools op deze site die het
 * beste werken zijn geen van drieën figuratief: het zonjaar is een staafgrafiek, de
 * ABCDE-check is een lijst, de huidmatrix is een raster. Een hoofd met twee streepjes
 * voor ogen wordt nooit mooi, en het hoeft ook niet: wat de bezoeker nodig heeft is de
 * plaats, niet het portret.
 *
 * DUS: TEGELS IN PLAATS VAN EEN TEKENING.
 *
 * Een raster dat de indeling van een gezicht volgt zonder een gezicht te zijn. Voorhoofd
 * boven, dan de band met wangen, neus en kaaklijn, dan de kin, en rug en schouders apart
 * eronder omdat die niet op het gezicht liggen. De volgorde draagt de plaats; de vulling
 * draagt de staat. Verder is er niets nodig.
 *
 * Bijvangst: de losse chips onder de tekening konden weg. Die stonden er als tweede,
 * altijd werkende weg naar dezelfde zones, en de tegels zíjn nu die weg. Elke zone stond
 * dus twee keer op het scherm.
 */

/**
 * Waar elke zone in het raster staat.
 *
 * Drie kolommen. Voorhoofd en kin lopen over de volle breedte omdat ze dat op een gezicht
 * ook doen; de middelste band heeft er drie naast elkaar. `rug` staat er niet in: die
 * krijgt een eigen plek onder een tussenkopje, want hij ligt buiten het gezicht en dat is
 * precies het onderscheid dat de oude tekening niet kon maken.
 */
const RASTER: Record<Exclude<ZoneId, "rug">, string> = {
  voorhoofd: "col-span-3",
  wangen: "col-span-1",
  neus: "col-span-1",
  kaaklijn: "col-span-1",
  kin: "col-span-3",
};

/** De volgorde in het raster, van boven naar beneden zoals op een gezicht. */
const RASTER_VOLGORDE: readonly Exclude<ZoneId, "rug">[] = [
  "voorhoofd",
  "wangen",
  "neus",
  "kaaklijn",
  "kin",
];

export default function AcneZoneKaart() {
  const [gekozen, setGekozen] = useState<ZoneId[]>([]);
  const [zweeft, setZweeft] = useState<ZoneId | null>(null);

  const lezing = useMemo(() => lees(gekozen), [gekozen]);

  const wissel = (id: ZoneId) =>
    setGekozen((huidig) =>
      huidig.includes(id) ? huidig.filter((z) => z !== id) : [...huidig, id],
    );

  const actief = (id: ZoneId) => gekozen.includes(id);

  return (
    <div className={`mt-12 ${RASTER_SECTIE}`}>
      {/* ── Het raster ── */}
      <div>
        <div
          className="rounded-[var(--r-md)] bg-white p-5 sm:p-7"
          role="group"
          aria-label="Zones van het gezicht, aan te tikken"
        >
          <Label>Waar zit het bij jou?</Label>
          <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
            Meerdere mag. De plaats zegt vaak meer over de oorzaak dan hoe erg
            het eruitziet.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {RASTER_VOLGORDE.map((id) => {
              const zone = ACNE_ZONES.find((z) => z.id === id);
              if (!zone) return null;
              const aan = actief(id);
              return (
                <button
                  key={id}
                  type="button"
                  role="checkbox"
                  aria-checked={aan}
                  onClick={() => wissel(id)}
                  onMouseEnter={() => setZweeft(id)}
                  onMouseLeave={() => setZweeft(null)}
                  onFocus={() => setZweeft(id)}
                  onBlur={() => setZweeft(null)}
                  className={`${RASTER[id]} flex min-h-16 items-center justify-center rounded-[var(--r-md)] px-3 py-4 text-center text-[15px] leading-5 font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                    aan
                      ? "bg-[var(--g-700)] text-white"
                      : "bg-[var(--g-050)] text-[var(--t-strong)] hover:bg-[var(--g-100)]"
                  }`}
                >
                  {zone.naam}
                </button>
              );
            })}
          </div>

          {/* Rug en schouders liggen buiten het gezicht. In de oude tekening pasten ze
              nergens en stonden ze alleen als losse chip; hier krijgen ze hun eigen plek
              met de reden erbij. */}
          {(() => {
            const rug = ACNE_ZONES.find((z) => z.buitenGezicht);
            if (!rug) return null;
            const aan = actief(rug.id);
            return (
              <div className="mt-5">
                <p className="diba-label text-[var(--t-label)]">
                  Buiten het gezicht
                </p>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={aan}
                  onClick={() => wissel(rug.id)}
                  onMouseEnter={() => setZweeft(rug.id)}
                  onMouseLeave={() => setZweeft(null)}
                  onFocus={() => setZweeft(rug.id)}
                  onBlur={() => setZweeft(null)}
                  className={`mt-3 flex min-h-16 w-full items-center justify-center rounded-[var(--r-md)] px-3 py-4 text-center text-[15px] leading-5 font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                    aan
                      ? "bg-[var(--g-700)] text-white"
                      : "bg-[var(--g-050)] text-[var(--t-strong)] hover:bg-[var(--g-100)]"
                  }`}
                >
                  {rug.naam}
                </button>
              </div>
            );
          })()}

          {/* Wat de zone waar je op staat op zichzelf betekent. Vaste hoogte, zodat het
              raster niet verspringt zodra je erlangs beweegt. */}
          <div className="mt-5 min-h-[92px] rounded-[var(--r-sm)] bg-[var(--g-025)] p-5">
            {zweeft ? (
              <>
                <p className="diba-label text-[var(--t-label)]">
                  {ACNE_ZONES.find((z) => z.id === zweeft)?.naam}
                </p>
                <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(
                    ACNE_ZONES.find((z) => z.id === zweeft)?.opZichzelf ?? "",
                  )}
                </p>
              </>
            ) : (
              <p className="text-[15px] leading-7 text-[var(--t-muted)]">
                Ga over een zone om te lezen wat die op zichzelf meestal
                betekent. Tik hem aan om hem mee te tellen in de duiding
                hiernaast.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── De lezing ── */}
      <div
        className="flex flex-col rounded-[var(--r-md)] bg-white p-6 sm:p-8"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-4">
          <Label>
            {gekozen.length === 0
              ? "Nog niets gekozen"
              : `${gekozen.length} van 6 zones`}
          </Label>
          {gekozen.length > 0 ? (
            <button
              type="button"
              onClick={() => setGekozen([])}
              className="diba-label text-[var(--t-muted)] underline underline-offset-4 hover:text-[var(--g-700)]"
            >
              Wissen
            </button>
          ) : null}
        </div>

        <h3 className="diba-card-title-lg mt-4">{lezing.kop}</h3>
        <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
          {publicCopy(lezing.tekst)}
        </p>

        <div className="mt-6 rounded-[var(--r-sm)] bg-[var(--g-050)] p-5">
          <Label>Wat wij dan eerst doen</Label>
          <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
            {publicCopy(lezing.eersteStap)}
          </p>
        </div>

        {/* De eerlijkheidsclausule hoort hier, niet in kleine lettertjes onderaan. */}
        <p className="mt-5 text-sm leading-6 text-[var(--t-muted)]">
          Dit is een patroonduiding, geen diagnose. Twee mensen met dezelfde
          zones kunnen een ander plan krijgen. Daarom meten we voordat we
          behandelen.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button
            href={`/intake?topic=acne${gekozen.length ? `&zones=${gekozen.join(",")}` : ""}`}
          >
            {gekozen.length
              ? "Neem dit mee naar de intake"
              : "Plan een huidconsult"}
          </Button>
          {/* Wees hier naar #tijdlijn, en die sectie bestaat niet meer sinds de
              tijdlijn "eerst even slechter" eruit is gehaald. Een link naar een anker
              dat er niet is doet niets en dat merk je nergens aan, dus die wijst nu naar
              wat er wel staat: hoe we meten. */}
          <a
            href="#meten"
            className="diba-label inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4"
          >
            Hoe we dit meten
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
