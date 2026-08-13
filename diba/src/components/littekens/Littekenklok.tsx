"use client";

import { useState, type CSSProperties } from "react";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { LITTEKEN_FASES, VENSTER_TEKST } from "@/data/littekens";
import { publicCopy } from "@/lib/copy-flags";
import { RASTER_SECTIE } from "@/lib/raster";

/**
 * De littekenklok — de uitblinker van de littekens- en striaepagina.
 *
 * Bij littekens bepaalt de leeftijd de uitkomst meer dan de techniek. Rood en jong
 * betekent dat er nog bloedvaten en beweeglijk collageen zijn; wit en oud betekent dat
 * het weefsel in zijn eindstand ligt. Dat is de enige as die er echt toe doet, en bijna
 * geen enkele kliniek zegt het hardop, want het betekent vaak "u bent te laat".
 *
 * Dus maken we er een schuifbalk van. Hoe verder je schuift, hoe eerlijker het antwoord
 * wordt: bij de laatste stand raadt de pagina behandelen af. Dezelfde beweging als het
 * zonjaar op de pigmentpagina, maar met een andere as en een ander doel.
 *
 * Elegant: striae volgen precies dezelfde as. Rood en nieuw is striae rubrae, wit en oud
 * is striae albae. Eén interactie dekt allebei, en /huidproblemen/striae wijst hierheen.
 *
 * WAT ER WEG IS EN WAAROM.
 *
 * Er stond een tekening boven de schuifbalk: een mintvlak met daarin een kronkelende
 * streep die een litteken moest voorstellen, en drie kleinere streepjes ernaast voor
 * striae. Dat had hetzelfde probleem als het getekende hoofd op de acnepagina. Het was
 * bijna alleen lijn, terwijl deze huisstijl met vlakken bouwt, en je moest maar raden wat
 * je zag. Een streep die je als litteken moet lezen wordt nooit een litteken.
 *
 * Ondertussen zat de eigenlijke boodschap eronder weggestopt in een balkje van twee pixel:
 * het venster dat dichtgaat. Dat is precies wat deze pagina te vertellen heeft, dus dat is
 * nu het hoofdbeeld en de tekening is verdwenen.
 *
 * Toegankelijkheid: een echte range-input, dus pijltjestoetsen en Home/End werken vanzelf.
 * aria-valuetext geeft de fase in woorden in plaats van een getal.
 */

const VENSTER_BREEDTE = { open: "100%", sluit: "45%", gesloten: "8%" } as const;
const VENSTER_KLEUR = {
  open: "var(--g-700)",
  sluit: "var(--warn)",
  gesloten: "var(--t-muted)",
} as const;
const VENSTER_TEKSTKLEUR = {
  open: "text-[var(--g-700)]",
  sluit: "text-[var(--warn-text)]",
  gesloten: "text-[var(--t-muted)]",
} as const;

export default function Littekenklok() {
  const [index, setIndex] = useState(1); // start in het venster, niet op nul
  const fase = LITTEKEN_FASES[index];
  const venster = VENSTER_TEKST[fase.venster];

  return (
    <div className={`mt-12 ${RASTER_SECTIE}`}>
      {/* ── De tekening plus de schuifbalk ──
          De klasse van de fase zet --fase-kleur, en die stuurt zowel de tekening als
          de schuifbalk aan. Eén bron, dus ze kunnen niet uit elkaar lopen. */}
      <div
        className={`rounded-[var(--r-md)] bg-white p-6 sm:p-8 ${fase.kleurKlasse}`}
      >
        {/* ── Het venster ──
            Dit was een klein balkje onderaan, onder een tekening van een kronkelstreep
            met drie streepjes ernaast. Die tekening is weg; zie het docblock. Wat eronder
            zat is nu het hoofdbeeld, want dát is de boodschap: hoeveel er nog te
            veranderen valt, en hoe dat krimpt naarmate je langer wacht. */}
        <div className="rounded-[var(--r-md)] bg-[var(--g-025)] p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <Label className={VENSTER_TEKSTKLEUR[fase.venster]}>
              {venster.kop}
            </Label>
            <span className="diba-label text-[var(--t-muted)]">
              {fase.vakterm}
            </span>
          </div>

          <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
            {venster.tekst}
          </p>

          {/* De balk is dik en de baan blijft zichtbaar, zodat je ziet hoeveel er wég is
              en niet alleen hoeveel er nog staat. Bij de laatste fase blijft er een
              streepje over: nul tonen zou suggereren dat er niets meer kan, en dat klopt
              niet. Er valt dan weinig te halen, niet niets. */}
          <div
            role="img"
            aria-label={`Ruimte om iets te veranderen bij ${fase.label}: ${venster.kop}`}
            className="mt-6 h-5 w-full overflow-hidden rounded-[var(--r-pill)] bg-[var(--g-100)]"
          >
            <div
              className="h-full rounded-[var(--r-pill)] transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
              style={{
                width: VENSTER_BREEDTE[fase.venster],
                background: VENSTER_KLEUR[fase.venster],
              }}
            />
          </div>

          <p className="mt-4 text-[14px] leading-6 text-[var(--t-muted)]">
            De balk is geen meting maar een verhouding: hij laat zien hoe de ruimte om
            iets te veranderen krimpt naarmate een litteken ouder wordt.
          </p>
        </div>


        {/* De schuifbalk. */}
        <div className="mt-7">
          <label htmlFor="littekenklok" className="diba-label block">
            Hoe lang heb je het al?
          </label>
          <input
            id="littekenklok"
            type="range"
            min={0}
            max={LITTEKEN_FASES.length - 1}
            step={1}
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            aria-valuetext={fase.label}
            className="diba-schuif mt-3"
            style={
              {
                "--schuif-voortgang": `${(index / (LITTEKEN_FASES.length - 1)) * 100}%`,
              } as CSSProperties
            }
          />

          <div className="mt-3 flex justify-between gap-1">
            {LITTEKEN_FASES.map((f, i) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-pressed={i === index}
                // Op mobiel staat er "3 mnd" in beeld; een schermlezer hoort altijd
                // de hele fase.
                aria-label={f.label}
                className={`diba-label min-h-12 flex-1 px-1 text-center transition-colors ${
                  i === index
                    ? "text-[var(--t-strong)]"
                    : "text-[var(--t-muted)]"
                } hover:text-[var(--g-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]`}
              >
                {/* Vijf volle labels naast elkaar breken op mobiel in drie regels en
                    maken de rij rafelig. De volledige fase staat er als kop naast,
                    dus de korte variant kost hier geen duidelijkheid. */}
                <span className="sm:hidden">{f.kort}</span>
                <span className="hidden sm:inline">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ── De lezing ── */}
      <div className="flex flex-col" aria-live="polite">
        <h3 className="diba-card-title-lg">{fase.label}</h3>

        <dl className="mt-6 space-y-5">
          {[
            ["Wat er dan in je huid gebeurt", fase.watErGebeurt],
            ["Wat realistisch is", fase.watRealistischIs],
            ["Wat wij zouden doen", fase.watWijDoen],
          ].map(([kop, tekst]) => (
            /* Stond op een streep links (border-l-2). Vlakken, geen lijnen. */
            <div
              key={kop}
              className="rounded-[var(--r-md)] bg-[var(--g-050)] p-5 sm:p-6"
            >
              <dt className="diba-label text-[var(--t-label)]">{kop}</dt>
              <dd className="mt-2 text-[16px] leading-7 text-[var(--t-body)]">
                {publicCopy(tekst)}
              </dd>
            </div>
          ))}
        </dl>

        {/* De knop past zich aan het eerlijke antwoord aan. */}
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button
            href={`/intake?topic=littekens&fase=${fase.id}`}
            variant={fase.venster === "gesloten" ? "secundair" : "primair"}
          >
            {fase.venster === "gesloten"
              ? "Laat het eerlijk narekenen"
              : "Laat dit bekijken"}
          </Button>
          {fase.venster === "open" ? (
            <Label className="max-w-[26ch]">
              Dit is het moment waarop het het meeste uitmaakt.
            </Label>
          ) : null}
        </div>

        <p className="mt-6 text-sm leading-6 text-[var(--t-muted)]">
          Weet je niet precies hoe oud het is? Kijk naar de kleur. Rood betekent
          jong, wit betekent oud. Dat is nauwkeuriger dan je geheugen.
        </p>
      </div>
    </div>
  );
}
