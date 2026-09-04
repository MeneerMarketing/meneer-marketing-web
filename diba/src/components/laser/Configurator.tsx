"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Lichaamskaart from "@/components/laser/Lichaamskaart";
import Label from "@/components/ui/Label";
import {
  FITZPATRICK_TYPES,
  LASER_GESLACHTEN,
  LASER_ZONES,
  LASER_ZONE_AREAS,
  VOORLOPIGE_PRIJZEN,
  VORM_HOOFDZONE,
  zoneId as maakZoneId,
  zonesVoor,
  type FitzpatrickId,
  type LaserGeslacht,
} from "@/data/laser-zones";
import {
  calculateLaserPrice,
  formatLaserPrice,
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
 * Wat hij doet:
 *
 * - je wijst je zones aan op een schematisch lichaam in plaats van ze op te zoeken in een
 *   lijst, en je ziet bij het zweven meteen wat die zone kost
 * - pakketten vervangen de losse zones die ze dekken, dus nooit twee keer hetzelfde
 * - hij zegt het als je in de buurt van een pakket komt, zonder aftellertje
 * - je keuze staat in de URL, dus je kunt hem bewaren of doorsturen
 *
 * TWEE PRIJSLIJSTEN.
 *
 * De bedragen zijn niet langer verzonnen; ze komen van de tarievenpagina van de kliniek.
 * Daarmee kwam er wel iets bij: het zijn twee lijsten. Voor dezelfde zone betalen heren
 * meer dan dames, en hun lijst kent geen benen en geen bikinilijn. Eén gemiddelde tonen
 * zou voor iedereen het verkeerde bedrag zijn, dus staat de keuze bovenaan en rekent de
 * configurator per lijst.
 *
 * Wisselen wist de keuze. Dat is vervelend en toch juist: de zones van de ene lijst
 * bestaan niet op de andere, dus zouden ze stilzwijgend uit de opbouw vallen en zou je
 * een totaal zien dat niet meer klopt bij wat je hebt aangewezen.
 *
 * Een bedrag van nul betekent "nog niet bekend" en nooit "gratis". Wie € 0 ziet staan
 * denkt aan een aanbieding, en dat is de verwachting die §7 verbiedt. Eén zone staat er
 * zo bij: de haarlijn voor dames, die als € 6 op hun site staat en vrijwel zeker een nul
 * mist. [PRIJS-NODIG: haarlijn dames, Okan]
 *
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
    "Hoeveel sessies je nodig hebt hangt af van de zone, je huidtype en je haargroei. Dat hoor je tijdens de intake, en niet ervoor.",
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
  const [geslacht, setGeslacht] = useState<LaserGeslacht>(
    () => zonesUitQuery(zoek.toString()).geslacht,
  );
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
    const q = zonesNaarQuery(gekozen, huidtype, geslacht);
    window.history.replaceState(null, "", q || window.location.pathname);
  }, [gekozen, huidtype, geslacht]);

  const opbouw = useMemo(() => calculateLaserPrice(gekozen), [gekozen]);
  const gedekt = useMemo(() => gedekteZones(gekozen), [gekozen]);
  const advies = useMemo(() => pakketAdvies(gekozen), [gekozen]);
  const pakketten = zonesVoor(geslacht).filter((z) => z.area === "pakket");

  /* De tarieven die geen eigen vorm op de kaart hebben.
   *
   * De kaart kent vijftien vormen, de prijslijst ruim dertig regels. Hals, nek en alle
   * combinatietarieven ("Onderkin + hals") vallen daarbuiten, en zonder deze lijst zijn
   * ze op deze pagina simpelweg niet te kiezen terwijl ze wel bestaan. Dat is precies de
   * soort onvolledigheid die je pas merkt als een klant ernaar vraagt. */
  const hoofdzones = new Set(
    Object.values(VORM_HOOFDZONE).map((s) => maakZoneId(geslacht, s)),
  );
  const overigePerGebied = LASER_ZONE_AREAS.filter((a) => a.id !== "pakket")
    .map((a) => ({
      ...a,
      zones: zonesVoor(geslacht).filter(
        (z) => z.area === a.id && !hoofdzones.has(z.id),
      ),
    }))
    .filter((a) => a.zones.length > 0);

  /* Van lijst wisselen wist de keuze: de ids zijn per lijst en zouden anders zonder
     mededeling uit de opbouw verdwijnen. */
  function wisselLijst(id: LaserGeslacht) {
    if (id === geslacht) return;
    setGeslacht(id);
    setGekozen([]);
  }

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
        {/* ── Welke prijslijst ── */}
        <div className="mb-8">
          <Label>Welke prijslijst</Label>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-7 text-[var(--t-body)]">
            De kliniek hanteert twee tarievenlijsten. Voor dezelfde zone
            verschilt het bedrag, en niet elke zone staat op beide lijsten.
          </p>
          <div
            role="group"
            aria-label="Prijslijst"
            className="mt-4 flex flex-wrap gap-2"
          >
            {LASER_GESLACHTEN.map((g) => (
              <button
                key={g.id}
                type="button"
                aria-pressed={g.id === geslacht}
                onClick={() => wisselLijst(g.id)}
                className={`diba-label inline-flex min-h-12 items-center rounded-[var(--r-pill)] px-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                  g.id === geslacht
                    ? "diba-pill-active"
                    : "bg-white text-[var(--t-label)] hover:bg-[var(--g-100)]"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <Lichaamskaart
          gekozen={gekozen}
          gedekt={gedekt}
          onWissel={wissel}
          geslacht={geslacht}
        />

        {/* ── De tarieven zonder eigen vorm op de kaart ── */}
        {overigePerGebied.length > 0 ? (
          <div className="mt-12">
            <Label>Verder op de tarievenlijst</Label>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-7 text-[var(--t-body)]">
              Niet elke regel heeft een eigen plek op de tekening. Deze staan
              wel op de lijst en zijn hier net zo goed te kiezen.
            </p>
            {overigePerGebied.map((gebied) => (
              <div key={gebied.id} className="mt-7">
                <p className="diba-label text-[var(--t-label)]">
                  {gebied.label}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {gebied.zones.map((z) => {
                    const aan = gekozen.includes(z.id);
                    const dicht = gedekt.includes(z.id);
                    return (
                      <li key={z.id}>
                        <button
                          type="button"
                          aria-pressed={aan}
                          disabled={dicht}
                          onClick={() => wissel(z.id)}
                          className={`inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] px-5 text-[14px] leading-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                            aan
                              ? "diba-pill-active"
                              : dicht
                                ? "bg-[var(--g-100)] text-[var(--t-muted)]"
                                : "bg-white text-[var(--t-label)] hover:bg-[var(--g-100)]"
                          }`}
                        >
                          {z.label}
                          <span className="tabular-nums opacity-70">
                            {dicht
                              ? "zit er al in"
                              : formatLaserPrice(z.singlePrice)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        {/* ── Pakketten ── */}
        <div className="mt-12">
          <Label>Of kies een pakket</Label>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-7 text-[var(--t-body)]">
            Een pakket vervangt de losse zones die erin zitten. Die blijven
            aangewezen staan op de tekening, maar tellen niet nog een keer mee.
          </p>
          {/* Kaartjes en geen labelknoppen.

              De pakketten heetten "Bovenlichaam compleet" toen ik ze nog verzon; de
              echte heten "Pakket B: oksels, gehele armen en bikinilijn groot". In
              kapitalen, zoals `diba-label` ze zet, is dat geen knop meer maar een
              schreeuw van drie regels. En er hoort een bedrag op: een pakket kiezen
              zonder te zien wat het kost is precies wat deze site niet doet. */}
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {pakketten.map((p) => {
              const aan = gekozen.includes(p.id);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={aan}
                    onClick={() => wissel(p.id)}
                    className={`flex min-h-14 w-full items-center justify-between gap-4 rounded-[var(--r-sm)] border px-5 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] ${
                      aan
                        ? "border-[var(--g-700)] bg-[var(--g-700)]"
                        : "border-[var(--g-100)] bg-white hover:border-[var(--g-300)]"
                    }`}
                  >
                    <span
                      className={`text-[15px] leading-6 font-medium ${
                        aan ? "text-white" : "text-[var(--t-strong)]"
                      }`}
                    >
                      {p.label}
                    </span>
                    <span
                      className={`shrink-0 text-[14px] tabular-nums ${
                        aan
                          ? "text-[var(--on-dark-body)]"
                          : "text-[var(--t-muted)]"
                      }`}
                    >
                      {formatLaserPrice(p.singlePrice)}
                    </span>
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
              dat gunstiger uitkomt hangt af van de definitieve tarieven.
            </p>
          ) : null}
        </div>

        {/* ── Huidtype ── */}
        <div className="mt-12">
          <Label>Je huidtype</Label>
          <h2 className="diba-display-s mt-4 max-w-[20ch]">
            Zes huidtypes
            <br />
            <span className="diba-accent">en alle zes te behandelen</span>
          </h2>
          <p className="mt-4 max-w-[56ch] text-[15px] leading-7 text-[var(--t-body)]">
            De GentleMax Pro werkt op Fitzpatrick I tot en met VI. Je type
            bepaalt niet óf het kan, maar met welke instellingen. Weet je het
            niet, laat het dan open; we bepalen het tijdens de intake.
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

          {/* Een leeg totaal is niet hetzelfde als een onbekend totaal.

              `formatLaserPrice` maakt van nul euro "Nog niet bekend", en dat klopt voor een
              zone zonder tarief. Bij een lege keuze stond er daardoor "Nog niet bekend" te
              lezen terwijl er gewoon nog niets gekozen was: alsof de kliniek haar eigen
              prijzen niet kent. Nul euro tonen kan ook niet, want dat leest als gratis. */}
          <p className="mt-3 text-[28px] leading-none font-medium tracking-[-.04em] text-[var(--t-strong)] tabular-nums">
            {opbouw.lines.length === 0 ? "Nog leeg" : opbouw.formattedSubtotal}
          </p>
          <p className="mt-3 text-[14px] leading-6 text-[var(--t-muted)]">
            {opbouw.lines.length === 0
              ? "Wijs een zone aan, dan staat het bedrag hier."
              : opbouw.hasMissingPrices
                ? "Voor een deel van je keuze is nog geen tarief bekend. De opbouw klopt al wel."
                : "Prijs per sessie. Het aantal sessies hoor je tijdens de intake."}
          </p>

          {/* Hangt aan de vlag in de data, niet aan een los stukje tekst. Zolang daar
              verzonnen bedragen in staan kan deze mededeling er niet af. */}
          {VOORLOPIGE_PRIJZEN ? (
            <p className="mt-3 rounded-[var(--r-sm)] bg-[var(--g-050)] p-3 text-[13px] leading-5 text-[var(--t-body)]">
              Deze bedragen zijn voorlopig en nog niet door de kliniek
              vastgesteld.
            </p>
          ) : null}

          {opbouw.lines.length > 0 ? (
            <ul className="mt-6 space-y-3 pt-5">
              {opbouw.lines.map((l) => (
                <li
                  key={l.zoneId}
                  className="flex items-center justify-between gap-4"
                >
                  {/* Dit is een knop die een zone weer weghaalt, en hij was zo hoog als
                      zijn tekstregel: vierentwintig pixels. Op een telefoon is dat mikken.
                      De huisregel is achtenveertig. */}
                  <button
                    type="button"
                    onClick={() => wissel(l.zoneId)}
                    className="inline-flex min-h-12 items-center text-left text-[15px] leading-6 text-[var(--t-strong)] underline decoration-[var(--g-300)] decoration-dotted underline-offset-4 hover:decoration-[var(--g-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
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
            <p className="mt-6 pt-5 text-[15px] leading-7 text-[var(--t-body)]">
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
            <p className="mt-4 pt-4 text-[14px] leading-6 text-[var(--t-body)]">
              Huidtype Fitzpatrick {huidtype}
            </p>
          ) : null}

          <div className="mt-7 flex flex-col gap-3">
            <Link
              href={DIBA_SALONIZED_BOOKING_URL || "/intake"}
              className="diba-label inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-5 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              Plan een huidconsult
            </Link>
            <a
              href={DIBA_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="diba-label inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-050)] px-5 text-[var(--t-label)] transition-colors hover:bg-[var(--g-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
            >
              Vraag stellen
            </a>
          </div>

          {gekozen.length > 0 ? (
            <div className="mt-5 flex items-center justify-between gap-3 pt-4">
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
