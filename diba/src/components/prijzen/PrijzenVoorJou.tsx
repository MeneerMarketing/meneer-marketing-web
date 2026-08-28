"use client";

import Link from "next/link";
import { useMemo } from "react";
import Label from "@/components/ui/Label";
import { prijsTekst } from "@/data/behandelingen";
import {
  compleetheid,
  maakMatches,
  PROFIEL_ONDERDELEN,
  waaromNiets,
} from "@/data/huidprofiel";
import { publicCopy } from "@/lib/copy-flags";
import { useHuidprofiel } from "@/lib/huidprofiel-opslag";

/**
 * Wat het bij jou zou kosten.
 *
 * WAAROM DIT BOVENAAN DE PRIJSLIJST HOORT.
 *
 * De prijslijst is ruim vier schermen lang en tweeënzestig regels breed. Dat is met opzet
 * zo: alles staat er, altijd, want prijzen verbergen is precies wat deze site niet doet.
 * Maar het antwoord op de vraag waarmee iemand hier komt, namelijk "wat kost dit voor
 * mij", staat dan wel ergens in die vier schermen verstopt.
 *
 * De behandelingenpagina ordent al op het huidprofiel; de prijslijst deed dat niet. Dus
 * stond de bezoeker daar wel te lezen wat bij hem past, en hier weer voor een alfabetische
 * muur. Dit blok haalt die twee bij elkaar: bovenaan de prijzen van wat bij jou past, met
 * de reden erbij, en daaronder blijft de volledige lijst gewoon staan.
 *
 * ER WORDT NIETS WEGGEFILTERD.
 *
 * Dat is het verschil met een zoekveld, en de reden dat dit erboven staat in plaats van
 * dat het de lijst vervangt. Je ziet nog steeds in één blik hoe lang de lijst is en wat er
 * allemaal bestaat; je hoeft er alleen niet meer doorheen om je eigen antwoord te vinden.
 *
 * GEEN PROFIEL IS OOK EEN STAND.
 *
 * Dan staat er geen leeg blok maar een reden om er een te maken, met wat het oplevert.
 * Wie geen profiel wil, scrolt gewoon door naar de lijst en mist niets.
 */
export default function PrijzenVoorJou() {
  const { profiel } = useHuidprofiel();

  const stand = compleetheid(profiel);
  const matches = useMemo(() => maakMatches(profiel), [profiel]);
  const geenMatch = useMemo(() => waaromNiets(profiel), [profiel]);

  const past = matches.filter((m) => m.oordeel === "past");
  /* Behandelingen zonder vaste prijs (een traject op aanvraag) horen hier onderaan en
     niet weggelaten: dat er geen bedrag is, is zelf ook een antwoord. */
  const metPrijs = past.filter((m) => m.behandeling.prijs > 0);
  const opAanvraag = past.filter((m) => m.behandeling.prijs <= 0);

  if (stand === 0) {
    return (
      <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9">
        <Label>Wat kost dit voor mij</Label>
        <p className="diba-card-title mt-3 text-[var(--t-strong)]">
          De lijst hieronder is lang. Die van jou is dat niet.
        </p>
        <p className="mt-4 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
          Stel je huidprofiel samen en hier staan de prijzen van wat bij jou
          past, met de reden erbij. De volledige lijst blijft er gewoon onder
          staan; er wordt niets weggefilterd.
        </p>
        <Link
          href="/huidprofiel"
          className="diba-label mt-7 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
        >
          Stel je huidprofiel samen
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9 lg:p-11">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <Label>Wat kost dit voor jou</Label>
        <p className="text-[14px] leading-6 text-[var(--t-muted)] tabular-nums">
          {stand} van {PROFIEL_ONDERDELEN} vragen ingevuld
        </p>
      </div>

      {past.length > 0 ? (
        <>
          <p className="mt-3 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Dit is wat er op grond van je profiel bij je past, met het tarief
            erbij. De volledige lijst staat er gewoon onder; er is niets
            weggefilterd. Wat bij jou afviel, staat daar aangemerkt.
          </p>

          <ul className="mt-7 space-y-2">
            {metPrijs.map((m, i) => (
              <li key={m.behandeling.slug}>
                <Link
                  href={`/behandelingen/${m.behandeling.slug}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-[var(--r-md)] bg-[var(--g-050)] px-5 py-4 transition-colors hover:bg-[var(--g-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    {i === 0 ? (
                      <span className="diba-label rounded-[var(--r-pill)] bg-[var(--g-700)] px-2.5 py-1 text-white">
                        Beste match
                      </span>
                    ) : null}
                    <span className="text-[17px] leading-7 font-medium text-[var(--t-strong)]">
                      {m.behandeling.naam}
                    </span>
                    <span className="text-[14px] leading-6 text-[var(--t-muted)]">
                      {publicCopy(m.reden)}
                    </span>
                  </span>
                  <span className="shrink-0 text-[17px] leading-7 font-medium text-[var(--t-strong)] tabular-nums">
                    {prijsTekst(m.behandeling.prijs)}
                  </span>
                </Link>
              </li>
            ))}

            {opAanvraag.map((m) => (
              <li key={m.behandeling.slug}>
                <Link
                  href={`/behandelingen/${m.behandeling.slug}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-[var(--r-md)] bg-[var(--g-050)] px-5 py-4 transition-colors hover:bg-[var(--g-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  <span className="text-[17px] leading-7 font-medium text-[var(--t-strong)]">
                    {m.behandeling.naam}
                  </span>
                  <span className="shrink-0 text-[15px] leading-7 text-[var(--t-muted)]">
                    Prijs volgt uit de meting
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : geenMatch ? (
        /* Niets dat past is zelf een antwoord, en meestal een tijdelijk antwoord.
           Zonder deze uitleg zou hier een leeg blok boven een lange prijslijst staan. */
        <div className="mt-5 rounded-[var(--r-md)] bg-[var(--g-200)] p-6 sm:p-7">
          <p className="diba-card-title text-[var(--g-900)]">{geenMatch.kop}</p>
          <p className="mt-3 max-w-[62ch] text-[16px] leading-7 text-[var(--g-900)]">
            {geenMatch.zin}
          </p>
          {geenMatch.danWel.length > 0 ? (
            <p className="mt-4 max-w-[62ch] text-[15px] leading-7 text-[var(--g-900)]">
              Wat er dan wel past: {geenMatch.danWel.join(" · ")}.
            </p>
          ) : null}

          {/* Ook als er niets past hoort de lijst eronder leesbaar te blijven. Zonder deze
              regel scrol je naar eenentwintig prijzen zonder te weten dat de merktekens
              daar van jou zijn. */}
          <p className="mt-4 max-w-[62ch] text-[15px] leading-7 text-[var(--g-900)]">
            De volledige lijst staat er gewoon onder; er is niets weggefilterd.
            Wat bij jou afviel, staat daar aangemerkt.
          </p>
        </div>
      ) : (
        <p className="mt-5 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
          Vul aan wat je wil veranderen, dan staan hier de tarieven die daarbij
          horen.
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link
          href="/huidprofiel"
          className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
        >
          {stand < PROFIEL_ONDERDELEN
            ? "Profiel aanvullen voor een preciezer antwoord"
            : "Je huidprofiel bijwerken"}
        </Link>
        <span className="text-[14px] leading-6 text-[var(--t-muted)]">
          Je profiel blijft in deze browser staan.
        </span>
      </div>
    </div>
  );
}
