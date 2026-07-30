"use client";

import { useState, type CSSProperties } from "react";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { LITTEKEN_FASES, VENSTER_TEKST } from "@/data/littekens";
import { publicCopy } from "@/lib/copy-flags";

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
 * is striae albae. Eén interactie dekt allebei, en de tekening laat dat ook zien.
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
    <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
      {/* ── De tekening plus de schuifbalk ──
          De klasse van de fase zet --fase-kleur, en die stuurt zowel de tekening als
          de schuifbalk aan. Eén bron, dus ze kunnen niet uit elkaar lopen. */}
      <div className={`rounded-[var(--r-md)] bg-white p-6 sm:p-8 ${fase.kleurKlasse}`}>
        <svg
          viewBox="0 0 320 190"
          className="w-full"
          role="img"
          aria-label={`Schematische huid met een litteken en striae, kleur passend bij: ${fase.label}`}
        >
          {/* Huidvlak, neutraal en abstract. Geen huidtint van een persoon. */}
          <rect x="10" y="10" width="300" height="170" rx="20" fill="var(--g-050)" />

          {/* Het litteken: een getapete streep.
              Eronder een vaste, iets bredere halo. Zonder die halo verdwijnt de vorm
              bij de laatste fase compleet, want wit op mint is geen contrast. Een rijp
              litteken zie je in het echt ook aan zijn reliëf en niet aan zijn kleur,
              dus dit blijft eerlijk: de kleur vervaagt, de vorm blijft. */}
          <path
            d="M70 52c14-6 30-4 44 2s26 14 40 16"
            fill="none"
            stroke="var(--g-100)"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            d="M70 52c14-6 30-4 44 2s26 14 40 16"
            fill="none"
            strokeWidth="9"
            strokeLinecap="round"
            className="litteken-lijn"
          />
          <text
            x="70"
            y="34"
            className="fill-[var(--t-muted)] text-[10px] font-semibold uppercase [letter-spacing:0.12em]"
          >
            Litteken
          </text>

          {/* Striae: dezelfde as, dus dezelfde kleur. Ook hier eerst de halo. */}
          {[0, 1, 2].map((i) => (
            <path
              key={`halo-${i}`}
              d={`M${74 + i * 28} 112c6 14 8 30 4 46`}
              fill="none"
              stroke="var(--g-100)"
              strokeWidth="10"
              strokeLinecap="round"
            />
          ))}
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${74 + i * 28} 112c6 14 8 30 4 46`}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              opacity={0.9 - i * 0.12}
              className="litteken-lijn"
            />
          ))}
          <text
            x="74"
            y="100"
            className="fill-[var(--t-muted)] text-[10px] font-semibold uppercase [letter-spacing:0.12em]"
          >
            Striae
          </text>

          <text
            x="300"
            y="172"
            textAnchor="end"
            className="fill-[var(--t-muted)] text-[10px] font-semibold uppercase [letter-spacing:0.12em]"
          >
            {fase.vakterm}
          </text>
        </svg>

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
                  i === index ? "text-[var(--t-strong)]" : "text-[var(--t-muted)]"
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

        {/* Het venster: krimpt zichtbaar naarmate je verder schuift. */}
        <div className="mt-6 border-t border-[var(--g-100)] pt-5">
          <div className="flex items-baseline justify-between gap-4">
            <Label className={VENSTER_TEKSTKLEUR[fase.venster]}>{venster.kop}</Label>
            <span className="text-sm leading-6 text-[var(--t-muted)]">{venster.tekst}</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-[var(--r-pill)] bg-[var(--g-100)]">
            <div
              className="h-full rounded-[var(--r-pill)] transition-all duration-500 ease-[var(--ease-diba)] motion-reduce:transition-none"
              style={{
                width: VENSTER_BREEDTE[fase.venster],
                background: VENSTER_KLEUR[fase.venster],
              }}
            />
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
            <div key={kop} className="border-l-2 border-[var(--g-200)] pl-4">
              <dt className="diba-label">{kop}</dt>
              <dd className="mt-1.5 text-[16px] leading-7 text-[var(--t-body)]">
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
          Weet je niet precies hoe oud het is? Kijk naar de kleur. Rood betekent jong,
          wit betekent oud. Dat is nauwkeuriger dan je geheugen.
        </p>
      </div>
    </div>
  );
}
