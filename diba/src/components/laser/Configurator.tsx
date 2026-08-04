"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Lichaamskaart from "@/components/laser/Lichaamskaart";
import Label from "@/components/ui/Label";
import {
  FITZPATRICK_TYPES,
  LASER_ZONES,
  type FitzpatrickId,
} from "@/data/laser-zones";
import {
  calculateLaserPrice,
  gedekteZones,
  pakketAdvies,
  toggleZoneSelection,
  zonesNaarQuery,
  zonesUitQuery,
} from "@/lib/laser-pricing";
import { DIBA_SALONIZED_BOOKING_URL, DIBA_WHATSAPP_URL } from "@/lib/site";

/**
 * De laserconfigurator.
 *
 * Wat deze anders maakt dan de meeste: hij kan nog geen bedragen laten zien, en doet ook
 * niet alsof. De tarieven zijn er nog niet, dus staat er "nog niet bekend" en niet € 0.
 * Dat is niet de vervelende versie van eerlijk zijn maar de enige; wie een nul ziet denkt
 * aan een aanbieding, en dat is precies de verwachting die §7 verbiedt.
 *
 * Wat hij wél doet, en dat is het meeste werk:
 *
 * - je wijst je zones aan op een tekening in plaats van ze op te zoeken in een lijst
 * - pakketten vervangen de losse zones die ze dekken, dus nooit twee keer hetzelfde
 * - hij zegt het als je in de buurt van een pakket komt, zonder aftellertje
 * - je keuze staat in de URL, dus je kunt hem bewaren of doorsturen
 *
 * Zodra Okan de tarieven aanlevert verandert er aan dit bestand niets. Dat is de test die
 * de opzet moest doorstaan.
 *
 * PRIJS-NODIG: alle bedragen in `laser-zones.ts`.
 * GEGEVEN-NODIG: het aantal sessies per zone.
 */

/**
 * Het aantal sessies is geen detail maar de kern van de kosten, en het verschilt per zone
 * en per huidtype. Zolang dat getal er niet is, zeggen we wat we wél zeker weten: dat het
 * er meer dan één is en dat één sessie niets oplevert.
 */
const OVER_DE_REEKS = {
  kop: "Laserontharing gaat per reeks, niet per keer",
  regels: [
    "Eén sessie raakt alleen de haren die op dat moment groeien. Dat is nooit alles tegelijk, en daarom is één behandeling geen halve behandeling maar geen behandeling.",
    "Hoeveel sessies je nodig hebt hangt af van de zone, je huidtype en je haargroei. Dat hoor je in de intake, en niet ervoor.",
  ],
} as const;

export default function Configurator() {
  /**
   * De keuze komt uit de URL, en dat gebeurt via `useSearchParams` en niet via een effect
   * dat na het monteren alsnog state zet. Die eerste versie werkte wel maar zette twee
   * renders achter elkaar in gang, en de bezoeker zag daardoor heel even een lege
   * configurator staan voordat zijn eigen keuze verscheen.
   *
   * Next rendert deze tak op de server niet mee (vandaar de Suspense-grens op de pagina),
   * dus de beginwaarde hieronder wordt alleen in de browser bepaald en er valt niets te
   * ontsporen bij de hydratie. Dit leest de URL precies één keer: verder schrijven we hem
   * alleen nog.
   */
  const zoek = useSearchParams();
  const [gekozen, setGekozen] = useState<string[]>(
    () => zonesUitQuery(zoek.toString()).zones,
  );
  const [huidtype, setHuidtype] = useState<FitzpatrickId | null>(() => {
    const t = zonesUitQuery(zoek.toString()).huidtype;
    return t && FITZPATRICK_TYPES.some((f) => f.id === t)
      ? (t as FitzpatrickId)
      : null;
  });
  const [gekopieerd, setGekopieerd] = useState(false);

  /** En terugschrijven, zonder navigatie: de pagina hoort niet te springen. */
  useEffect(() => {
    const q = zonesNaarQuery(gekozen, huidtype);
    window.history.replaceState(null, "", q || window.location.pathname);
  }, [gekozen, huidtype]);

  const opbouw = useMemo(() => calculateLaserPrice(gekozen), [gekozen]);
  const gedekt = useMemo(() => gedekteZones(gekozen), [gekozen]);
  const advies = useMemo(() => pakketAdvies(gekozen), [gekozen]);
  const pakketten = LASER_ZONES.filter((z) => z.area === "pakket");

  function wissel(id: string) {
    setGekozen((vorige) => toggleZoneSelection(vorige, id));
  }

  function label(id: string) {
    return LASER_ZONES.find((z) => z.id === id)?.label ?? id;
  }

  async function deel() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setGekopieerd(true);
      window.setTimeout(() => setGekopieerd(false), 2500);
    } catch {
      /* Klembord geweigerd of niet beschikbaar. De URL staat in de adresbalk, dus er is
         geen alternatief nodig; alleen deze knop doet dan niets en dat mag hij zeggen. */
      setGekopieerd(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-start lg:gap-14">
      {/* ── Links: kiezen ── */}
      <div>
        <Lichaamskaart gekozen={gekozen} gedekt={gedekt} onWissel={wissel} />

        {/* ── Pakketten ── */}
        <div className="mt-12">
          <Label>Of kies een pakket</Label>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-7 text-[var(--t-body)]">
            Een pakket vervangt de losse zones die erin zitten. Die blijven
            aangewezen staan op de tekening, maar tellen niet nog een keer mee.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {pakketten.map((p) => {
              const aan = gekozen.includes(p.id);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={aan}
                    onClick={() => wissel(p.id)}
                    className={`diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] px-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                      aan
                        ? "diba-pill-active"
                        : "bg-white text-[var(--t-label)] hover:bg-[var(--g-050)]"
                    }`}
                  >
                    {p.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {advies ? (
            <p className="mt-5 max-w-[56ch] rounded-[var(--r-sm)] bg-[var(--g-050)] p-5 text-[15px] leading-7 text-[var(--t-body)]">
              Je hebt {advies.gekozen} van de {advies.totaal} zones uit{" "}
              <strong className="font-medium text-[var(--t-strong)]">
                {advies.label}
              </strong>{" "}
              aangewezen. Wat er nog bij zou komen:{" "}
              {advies.erbij.map((id) => label(id).toLowerCase()).join(", ")}. Of
              dat gunstiger uitkomt hoor je zodra de tarieven erin staan.
            </p>
          ) : null}
        </div>

        {/* ── Huidtype ── */}
        <div className="mt-12">
          <Label>Je huidtype</Label>
          <h3 className="diba-display-s mt-4 max-w-[20ch]">
            Zes types,
            <br />
            <span className="diba-accent">allemaal te behandelen.</span>
          </h3>
          <p className="mt-4 max-w-[56ch] text-[15px] leading-7 text-[var(--t-body)]">
            De GentleMax Pro werkt op Fitzpatrick I tot en met VI. Je type
            bepaalt niet óf het kan, maar met welke instellingen. Weet je het
            niet, laat het dan open; we bepalen het in de intake.
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {FITZPATRICK_TYPES.map((t) => {
              const aan = huidtype === t.id;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    aria-pressed={aan}
                    onClick={() => setHuidtype(aan ? null : t.id)}
                    className={`flex min-h-14 w-full flex-col justify-center rounded-[var(--r-sm)] border px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                      aan
                        ? "border-[var(--g-700)] bg-[var(--g-050)]"
                        : "border-[var(--g-100)] bg-white hover:border-[var(--g-300)]"
                    }`}
                  >
                    <span className="text-[15px] leading-6 font-medium text-[var(--t-strong)]">
                      {t.label}
                    </span>
                    <span className="text-[13px] leading-5 text-[var(--t-muted)]">
                      {t.description}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Over de reeks ── */}
        <div className="mt-12 rounded-[var(--r-md)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9">
          <Label opDonker>Wat je moet weten</Label>
          <p className="diba-card-title mt-4">{OVER_DE_REEKS.kop}</p>
          {OVER_DE_REEKS.regels.map((r) => (
            <p
              key={r}
              className="mt-4 max-w-[62ch] text-[15px] leading-7 text-[var(--on-dark-body)]"
            >
              {r}
            </p>
          ))}
        </div>
      </div>

      {/* ── Rechts: de opbouw ── */}
      <aside className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
        <div className="rounded-[var(--r-md)] bg-white p-6 sm:p-7">
          <Label>Je opbouw</Label>

          <p className="mt-3 text-[28px] leading-none font-medium tracking-[-.04em] text-[var(--t-strong)] tabular-nums">
            {opbouw.formattedSubtotal}
          </p>
          <p className="mt-3 text-[14px] leading-6 text-[var(--t-muted)]">
            {opbouw.hasMissingPrices
              ? "De tarieven staan er nog niet in. Je opbouw klopt al wel, dus zodra ze erin staan zie je hier meteen je bedrag."
              : "Prijs per sessie. Het aantal sessies hoor je in de intake."}
          </p>

          {opbouw.lines.length > 0 ? (
            <ul className="mt-6 space-y-3 border-t border-[var(--g-100)] pt-5">
              {opbouw.lines.map((l) => (
                <li
                  key={l.zoneId}
                  className="flex items-baseline justify-between gap-4"
                >
                  <button
                    type="button"
                    onClick={() => wissel(l.zoneId)}
                    className="text-left text-[15px] leading-6 text-[var(--t-strong)] underline decoration-[var(--g-300)] decoration-dotted underline-offset-4 hover:decoration-[var(--g-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                    aria-label={`${l.label} weghalen`}
                  >
                    {l.label}
                  </button>
                  <span className="shrink-0 text-[14px] text-[var(--t-muted)] tabular-nums">
                    {l.formatted}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 border-t border-[var(--g-100)] pt-5 text-[15px] leading-7 text-[var(--t-body)]">
              Nog niets aangewezen. Kies links een zone op de tekening of in de
              lijst ernaast.
            </p>
          )}

          {gedekt.length > 0 ? (
            <p className="mt-4 text-[13px] leading-5 text-[var(--t-muted)]">
              Zit al in je pakket:{" "}
              {gedekt.map((id) => label(id).toLowerCase()).join(", ")}.
            </p>
          ) : null}

          {huidtype ? (
            <p className="mt-4 border-t border-[var(--g-100)] pt-4 text-[14px] leading-6 text-[var(--t-body)]">
              Huidtype Fitzpatrick {huidtype}
            </p>
          ) : null}

          <div className="mt-7 flex flex-col gap-3">
            <Link
              href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
              className="diba-label inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-5 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              Plan Behandeling Nul
            </Link>
            <a
              href={DIBA_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="diba-label inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--r-pill)] border border-[var(--g-100)] px-5 text-[var(--t-label)] transition-colors hover:border-[var(--g-300)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              Vraag stellen
            </a>
          </div>

          {gekozen.length > 0 ? (
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--g-100)] pt-4">
              <button
                type="button"
                onClick={deel}
                className="diba-label min-h-11 text-[var(--g-700)] transition-colors hover:text-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                {gekopieerd ? "Link gekopieerd" : "Bewaar deze keuze"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setGekozen([]);
                  setHuidtype(null);
                }}
                className="diba-label min-h-11 text-[var(--t-muted)] transition-colors hover:text-[var(--t-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                Opnieuw
              </button>
            </div>
          ) : null}
        </div>

        <p className="mt-4 px-1 text-[13px] leading-5 text-[var(--t-muted)]">
          Je keuze staat in de adresbalk. Sla die op of stuur hem door, dan
          staat alles er nog als je terugkomt.
        </p>
      </aside>
    </div>
  );
}
