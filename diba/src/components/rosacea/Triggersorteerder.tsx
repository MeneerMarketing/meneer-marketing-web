"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { leesTriggers, ROSACEA_TRIGGERS } from "@/data/rosacea";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De triggersorteerder — de uitblinker van de rosaceapagina.
 *
 * Elke rosaceapagina op internet plakt een lijstje triggers. Een lijstje helpt niemand,
 * want je wist al dat wijn je rood maakt. Wat wél helpt is de splitsing: welke van jóuw
 * triggers hebben een knop, en welke niet?
 *
 * Die verhouding bepaalt namelijk het advies. Zitten jouw triggers vooral in gewoontes,
 * dan is het eerlijkste antwoord dat je begint met aanpassen voordat je geld uitgeeft.
 * Zijn ze niet te vermijden — zon, weer, stress, hormonen — dan heeft behandelen van de
 * vaatjes juist zin, want je kunt je leven niet om je huid heen bouwen.
 *
 * Je tikt aan wat je herkent, en de chips verhuizen naar de kolom waar ze horen. Die
 * beweging is het punt: je ziet je eigen patroon ontstaan.
 *
 * "Beïnvloedbaar" betekent hier niet "jouw schuld". Dat staat er ook expliciet, want dat
 * misverstand is bij rosacea de grootste bron van schaamte.
 */

const GROEP_INFO = {
  beinvloedbaar: {
    kop: "Hier heb je zelf invloed op",
    toelichting:
      "Aan deze triggers kun je iets veranderen, en dat levert vaak het meeste op.",
    kleur: "var(--g-700)",
    vlak: "var(--g-050)",
  },
  "niet-beinvloedbaar": {
    kop: "Hier ligt het buiten je hand",
    toelichting:
      "Deze triggers zijn lastig te vermijden. Een behandeling kan dan helpen om de klachten beter te beheersen.",
    kleur: "var(--warn)",
    vlak: "var(--warn-vlak)",
  },
} as const;

export default function Triggersorteerder() {
  const [gekozen, setGekozen] = useState<string[]>([]);
  const lezing = useMemo(() => leesTriggers(gekozen), [gekozen]);

  const wissel = (id: string) =>
    setGekozen((h) =>
      h.includes(id) ? h.filter((x) => x !== id) : [...h, id],
    );

  const nogTeKiezen = ROSACEA_TRIGGERS.filter((t) => !gekozen.includes(t.id));
  const perGroep = (g: keyof typeof GROEP_INFO) =>
    ROSACEA_TRIGGERS.filter((t) => gekozen.includes(t.id) && t.groep === g);

  return (
    <div className="mt-12">
      {/* ── De voorraad: alles wat je nog kunt aantikken ── */}
      <div className="rounded-[var(--r-md)] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <Label>
            {gekozen.length === 0
              ? "Tik aan wat jou rood maakt"
              : `${gekozen.length} van ${ROSACEA_TRIGGERS.length} aangetikt`}
          </Label>
          {gekozen.length > 0 ? (
            <button
              type="button"
              onClick={() => setGekozen([])}
              className="diba-label text-[var(--t-muted)] underline underline-offset-4 hover:text-[var(--g-700)]"
            >
              Opnieuw
            </button>
          ) : null}
        </div>

        <div
          className="mt-5 flex flex-wrap gap-2"
          aria-label="Beschikbare triggers"
        >
          {nogTeKiezen.length === 0 ? (
            <p className="text-[15px] leading-7 text-[var(--t-body)]">
              Je hebt ze allemaal aangetikt. Dat komt voor, en het betekent niet
              dat je er slechter aan toe bent dan iemand met twee.
            </p>
          ) : (
            nogTeKiezen.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={false}
                onClick={() => wissel(t.id)}
                className="diba-label min-h-12 rounded-[var(--r-pill)] bg-[var(--g-050)] px-4 text-[var(--t-label)] transition hover:bg-[var(--g-075)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                {t.naam}
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── De twee kolommen waarin je keuzes belanden ── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {(["beinvloedbaar", "niet-beinvloedbaar"] as const).map((groep) => {
          const info = GROEP_INFO[groep];
          const items = perGroep(groep);
          return (
            <div
              key={groep}
              className="rounded-[var(--r-md)] p-6 sm:p-8"
              style={{ background: info.vlak }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-[var(--r-pill)]"
                  style={{ background: info.kleur }}
                  aria-hidden="true"
                />
                <h3 className="diba-label text-[var(--t-strong)]">
                  {info.kop}
                </h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--t-body)]">
                {info.toelichting}
              </p>

              <ul className="mt-5 space-y-2.5" aria-live="polite">
                {items.length === 0 ? (
                  <li className="text-sm leading-6 text-[var(--t-muted)]">
                    Nog niets in deze groep.
                  </li>
                ) : (
                  items.map((t) => (
                    <li key={t.id}>
                      <button
                        type="button"
                        aria-pressed
                        onClick={() => wissel(t.id)}
                        className="w-full rounded-[var(--r-sm)] bg-white p-4 text-left transition hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                      >
                        <span className="flex items-baseline justify-between gap-3">
                          <strong className="text-[15px] font-medium leading-6">
                            {t.naam}
                          </strong>
                          <span className="diba-label shrink-0 text-[var(--t-muted)]">
                            Weghalen
                          </span>
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-[var(--t-body)]">
                          {publicCopy(t.waarom)}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          );
        })}
      </div>

      {/* ── De lezing: waar bij jou de hefboom zit ── */}
      <div
        className="mt-6 grid gap-6 rounded-[var(--r-md)] bg-white p-6 sm:p-9 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10"
        aria-live="polite"
      >
        <div>
          <h3 className="diba-card-title-lg">{lezing.kop}</h3>
          <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
            {lezing.tekst}
          </p>
        </div>

        <div className="flex flex-col rounded-[var(--r-sm)] bg-[var(--g-075)] p-5">
          <Label>Waar wij dan beginnen</Label>
          <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
            {publicCopy(lezing.waarDeKnopZit)}
          </p>
          <Button
            href={`/intake?topic=rosacea${gekozen.length ? `&triggers=${gekozen.join(",")}` : ""}`}
            className="mt-6 w-fit"
          >
            {gekozen.length
              ? "Neem dit mee naar de intake"
              : "Plan Behandeling Nul"}
          </Button>
        </div>
      </div>

      <p className="mt-5 max-w-[72ch] text-sm leading-6 text-[var(--t-muted)]">
        Dit is geen diagnose en geen test. Het is een manier om je eigen patroon
        te zien voordat je hier binnenloopt, zodat het gesprek niet bij nul
        begint.
      </p>
    </div>
  );
}
