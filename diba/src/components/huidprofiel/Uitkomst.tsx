"use client";

import Link from "next/link";
import { useMemo } from "react";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import Spinnenweb from "@/components/ui/Spinnenweb";
import { behandelingVoorSlug, prijsTekst } from "@/data/behandelingen";
import {
  compleetheid,
  DOELEN,
  GEVOELIGHEID,
  HERSTELRUIMTE,
  HUIDCONDITIES,
  LEEFTIJD,
  maakMatches,
  meldPunten,
  nogNietGemeten,
  profielSamenvatting,
  PROFIEL_ONDERDELEN,
  waaromNiets,
  type Huidprofiel,
  type Match,
} from "@/data/huidprofiel";
import { publicCopy } from "@/lib/copy-flags";

/**
 * De uitkomst van het huidprofiel.
 *
 * WAT ER MIS WAS MET DE VORIGE VERSIE.
 *
 * Vier blokken onder elkaar waarin de belangrijkste vraag nergens beantwoord werd. Wat je
 * wél kon boeken stond er (maximaal vier), maar wat je níet moest boeken was één zinnetje:
 * "15 vallen af op wat je hebt ingevuld." Vijftien. Zonder te zeggen welke, en zonder te
 * zeggen waarom. Precies de helft van het advies ontbrak dus.
 *
 * DE OPLOSSING IS GROEPEREN, NIET UITKLAPPEN.
 *
 * Vijftien afvallers als vijftien kaarten tonen is onleesbaar. Maar die vijftien hebben
 * samen meestal drie of vier redenen: je gebruinde huid, je hersteltijd, en "dit werkt
 * gewoon niet op jouw doel". Gegroepeerd op reden past het in één blik en leert het je
 * bovendien iets: je ziet meteen dat één antwoord van jou de helft van de lijst wegneemt.
 *
 * DE VOLGORDE IS EEN LEESVOLGORDE.
 *
 *   1. Je profiel, teruggelezen. Herkenning eerst, anders vertrouwt niemand de rest.
 *   2. De uitslag in één regel, plus wat je moet melden.
 *   3. Wat je kunt boeken.
 *   4. Wat nu niet, gegroepeerd op reden.
 *   5. Wat we nog niet weten. Dit blok is donkergroen omdat het de grens markeert.
 *   6. De volgende stap.
 *
 * Blok 4 staat bewust ná blok 3 en niet ervoor: eerst wat er kan, dan wat niet. Andersom
 * leest als een afwijzing.
 *
 * Eén donkergroen vlak: blok 5 (§5). Het blok met de knop erin is mint, want dat is de
 * zwaarste tint die nog geen tweede donker vlak is.
 */

type Props = { readonly profiel: Huidprofiel };

/** Een groep afvallers met dezelfde reden. */
type Afvalgroep = {
  readonly reden: string;
  readonly namen: readonly string[];
  /** Slug van de eerste, zodat de groep ergens naartoe kan linken. */
  readonly eerste: string;
};

function groepeer(matches: readonly Match[]): readonly Afvalgroep[] {
  const kaart = new Map<string, { namen: string[]; eerste: string }>();
  for (const m of matches) {
    const r = publicCopy(m.reden);
    const bestaand = kaart.get(r);
    if (bestaand) bestaand.namen.push(m.behandeling.naam);
    else kaart.set(r, { namen: [m.behandeling.naam], eerste: m.behandeling.slug });
  }
  return [...kaart.entries()]
    .map(([reden, v]) => ({ reden, namen: v.namen, eerste: v.eerste }))
    .sort((a, b) => b.namen.length - a.namen.length);
}

/** Eén regel uit je profiel, als label met waarde. */
function Regel({ kop, waarde }: { kop: string; waarde: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 rounded-[var(--r-sm)] bg-[var(--g-025)] px-4 py-3">
      <dt className="diba-label shrink-0 text-[var(--t-label)]">{kop}</dt>
      <dd className="text-right text-[15px] leading-6 font-medium text-[var(--t-strong)]">
        {waarde}
      </dd>
    </div>
  );
}

export default function Uitkomst({ profiel }: Props) {
  const stand = compleetheid(profiel);
  const matches = useMemo(() => maakMatches(profiel), [profiel]);
  const past = matches.filter((m) => m.oordeel === "past");
  const deels = matches.filter((m) => m.oordeel === "deels");
  const kanNiet = matches.filter((m) => m.oordeel === "past-niet");
  const groepen = useMemo(() => groepeer(kanNiet), [kanNiet]);
  const geenMatch = useMemo(() => waaromNiets(profiel), [profiel]);
  const melden = meldPunten(profiel);
  const samenvatting = profielSamenvatting(profiel);
  const onbekend = nogNietGemeten(profiel);
  const nulmeting = behandelingVoorSlug("huidanalyse");

  /* Je antwoorden als losse regels. Alleen wat je hebt ingevuld: lege regels tonen
     maakt de lijst langer en zegt niets. */
  const regels: { kop: string; waarde: string }[] = [];
  if (profiel.doelen.length > 0) {
    regels.push({
      kop: "Je doel",
      waarde: profiel.doelen
        .map((d) => DOELEN.find((x) => x.id === d)?.label ?? d)
        .join(", "),
    });
  }
  if (profiel.leeftijd) {
    regels.push({
      kop: "Leeftijd",
      waarde: LEEFTIJD.find((l) => l.id === profiel.leeftijd)?.label ?? "",
    });
  }
  if (profiel.huidtype) {
    regels.push({ kop: "Huidtype", waarde: `Fitzpatrick ${profiel.huidtype}` });
  }
  if (profiel.herstel) {
    regels.push({
      kop: "Hersteltijd",
      waarde: HERSTELRUIMTE.find((h) => h.id === profiel.herstel)?.label ?? "",
    });
  }
  if (profiel.conditie) {
    regels.push({
      kop: "Conditie",
      waarde: HUIDCONDITIES.find((c) => c.id === profiel.conditie)?.label ?? "",
    });
  }
  if (profiel.gevoeligheid) {
    regels.push({
      kop: "Gevoeligheid",
      waarde:
        GEVOELIGHEID.find((g) => g.id === profiel.gevoeligheid)?.label ?? "",
    });
  }

  if (stand === 0) {
    return (
      <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
        Vul hierboven iets in, dan staat hier meteen je profiel, wat erbij past
        en wat je in de intake moet melden.
      </p>
    );
  }

  return (
    <div className="mt-10 space-y-4">
      {/* ── 1. Je profiel, teruggelezen ── */}
      <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9 lg:p-11">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
          <div className="mx-auto lg:mx-0">
            {profiel.scan ? (
              <Spinnenweb
                waarden={profiel.scan.assen}
                metLabels
                className="h-[260px] w-[260px]"
              />
            ) : (
              <div className="flex h-[260px] w-[260px] flex-col items-center justify-center rounded-[var(--r-lg)] bg-[var(--g-025)] p-8 text-center">
                <DibaLeafMark className="h-9 w-9 text-[var(--g-300)]" />
                <p className="mt-4 text-[14px] leading-6 text-[var(--t-muted)]">
                  Doe de scan bij stap 1, dan staat je spinnenweb hier.
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="diba-label text-[var(--t-label)]">
              Je huid, zoals jij hem beschrijft
            </p>
            <div className="mt-5 space-y-3">
              {samenvatting.map((z) => (
                <p
                  key={z}
                  className="max-w-[58ch] text-[17px] leading-8 text-[var(--t-body)]"
                >
                  {z}
                </p>
              ))}
            </div>

            {regels.length > 0 ? (
              <dl className="mt-7 grid gap-2 sm:grid-cols-2">
                {regels.map((r) => (
                  <Regel key={r.kop} kop={r.kop} waarde={r.waarde} />
                ))}
              </dl>
            ) : null}

            {stand < PROFIEL_ONDERDELEN ? (
              <p className="mt-6 text-[14px] leading-6 text-[var(--t-muted)]">
                Je hebt {stand} van de {PROFIEL_ONDERDELEN} vragen ingevuld. Elke
                vraag die je nog beantwoordt maakt deze uitkomst preciezer.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── 2. Wat je moet melden ── */}
      {melden.length > 0 ? (
        <div className="rounded-[var(--r-lg)] bg-[var(--g-050)] p-7 sm:p-9 lg:p-11">
          <p className="diba-label text-[var(--t-label)]">
            Meld dit in de intake · {melden.length}
          </p>
          <p className="mt-3 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Dit zijn dingen die in de praktijk pas aan de balie boven tafel
            komen, en dan een afspraak kosten. Nu weet je het vooraf.
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {melden.map((m) => (
              <li
                key={m}
                className="flex gap-3 rounded-[var(--r-md)] bg-white p-5 text-[15px] leading-7 text-[var(--t-body)]"
              >
                <DibaLeafMark className="mt-1.5 h-3.5 w-3.5 shrink-0 text-[var(--g-600)]" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* ── 3. Wat je kunt boeken ── */}
      <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9 lg:p-11">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <p className="diba-label text-[var(--t-label)]">
            {past.length > 0 ? "Dit kun je boeken" : "Wat er nu past"}
          </p>
          {past.length > 0 ? (
            <p className="text-[14px] leading-6 text-[var(--t-muted)] tabular-nums">
              {past.length} van de {matches.length}
            </p>
          ) : null}
        </div>

        {past.length > 0 ? (
          <ul className="mt-6 space-y-3">
            {past.map((m, i) => (
              <li key={m.behandeling.slug}>
                <Link
                  href={`/behandelingen/${m.behandeling.slug}`}
                  className="block rounded-[var(--r-md)] bg-[var(--g-050)] p-5 transition-colors duration-200 hover:bg-[var(--g-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] sm:p-6"
                >
                  <span className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <span className="flex flex-wrap items-baseline gap-3">
                      {i === 0 ? (
                        <span className="diba-label rounded-[var(--r-pill)] bg-[var(--g-700)] px-2.5 py-1 text-white">
                          Beste match
                        </span>
                      ) : null}
                      <span className="text-[18px] leading-7 font-medium text-[var(--t-strong)]">
                        {m.behandeling.naam}
                      </span>
                    </span>
                    <span className="shrink-0 text-[15px] leading-7 text-[var(--t-muted)] tabular-nums">
                      {prijsTekst(m.behandeling.prijs)}
                    </span>
                  </span>

                  <span className="mt-2 block max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
                    {publicCopy(m.reden)}
                  </span>

                  <span className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] leading-6 text-[var(--t-muted)]">
                    <span>Herstel: {publicCopy(m.behandeling.herstel)}</span>
                    <span>
                      {publicCopy(
                        m.behandeling.sessies,
                        "Aantal sessies volgt in de intake",
                      )}
                    </span>
                  </span>

                  {m.letOp.length > 0 ? (
                    <span className="mt-3 block rounded-[var(--r-sm)] bg-white px-4 py-3 text-[13px] leading-6 text-[var(--t-body)]">
                      <span className="diba-label block text-[var(--t-label)]">
                        Eerst bespreken
                      </span>
                      <span className="mt-1 block">{m.letOp.join(". ")}</span>
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : geenMatch ? (
          /* Er is niets dat volledig past, en dan is de reden het belangrijkste
             wat er op deze pagina staat. Een lege lijst vertelt niet dat er één
             ding in de weg staat en dat het volgende maand wel kan. */
          <div className="mt-6 rounded-[var(--r-md)] bg-[var(--g-200)] p-6 sm:p-7">
            <p className="diba-card-title text-[var(--g-900)]">
              {geenMatch.kop}
            </p>
            <p className="mt-3 max-w-[62ch] text-[16px] leading-7 text-[var(--g-900)]">
              {geenMatch.zin}
            </p>
            <p className="mt-4 max-w-[62ch] text-[15px] leading-7 text-[var(--g-900)]">
              {geenMatch.wat}
            </p>
            {geenMatch.danWel.length > 0 ? (
              <div className="mt-6 rounded-[var(--r-sm)] bg-white p-5">
                <p className="diba-label text-[var(--t-label)]">
                  Wat er dan wel past
                </p>
                <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
                  {geenMatch.danWel.join(" · ")}
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-5 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
            Vul aan wat je wil veranderen, dan komt hier de lijst.
          </p>
        )}

        {deels.length > 0 && past.length > 0 ? (
          <p className="mt-6 text-[15px] leading-7 text-[var(--t-muted)]">
            {deels.length === 1 ? (
              <>
                Daarnaast doet er één iets aan je doel zonder dat hij daarvoor
                gemaakt is.
              </>
            ) : (
              <>
                Daarnaast doen er {deels.length} iets aan je doel zonder dat ze
                daarvoor gemaakt zijn.
              </>
            )}{" "}
            Die staan op de behandelingenpagina.
          </p>
        ) : null}
      </div>

      {/* ── 4. Wat nu niet, gegroepeerd op reden ── */}
      {groepen.length > 0 ? (
        <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9 lg:p-11">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <p className="diba-label text-[var(--t-label)]">
              Dit nu niet · {kanNiet.length}
            </p>
            <p className="text-[14px] leading-6 text-[var(--t-muted)]">
              {groepen.length}{" "}
              {groepen.length === 1 ? "reden" : "redenen"}, niet{" "}
              {kanNiet.length} losse
            </p>
          </div>
          <p className="mt-3 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Hier stond eerder alleen een aantal. Wat er wegvalt en waardoor is
            net zo bruikbaar als wat er overblijft, want meestal is het één
            antwoord van jou dat de halve lijst wegneemt.
          </p>

          <ul className="mt-7 space-y-3">
            {groepen.map((g) => (
              <li
                key={g.reden}
                className="rounded-[var(--r-md)] bg-[var(--g-025)] p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="max-w-[62ch] text-[16px] leading-7 font-medium text-[var(--t-strong)]">
                    {g.reden}
                  </p>
                  <p className="shrink-0 text-[14px] leading-7 text-[var(--t-muted)] tabular-nums">
                    {g.namen.length}{" "}
                    {g.namen.length === 1 ? "behandeling" : "behandelingen"}
                  </p>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {g.namen.map((n) => (
                    <li
                      key={n}
                      className="rounded-[var(--r-pill)] bg-white px-4 py-2 text-[14px] leading-5 text-[var(--t-body)]"
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <Link
            href="/behandelingen"
            className="diba-label mt-7 inline-flex min-h-11 items-center text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
          >
            Alle behandelingen, geordend op je profiel
          </Link>
        </div>
      ) : null}

      {/* ── 5. Wat hier niet uit te halen valt ── */}
      <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-7 text-[var(--on-dark)] sm:p-9 lg:p-11">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <p className="diba-label diba-label-on-dark">Eerlijk gezegd</p>
            <p className="diba-display-s mt-4 max-w-[16ch]">
              Dit weten we
              <span className="diba-accent-on-dark"> nog niet.</span>
            </p>
            <p className="mt-6 max-w-[46ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Alles hierboven komt uit jouw antwoorden. Dat is genoeg om te
              ordenen en niet genoeg om te beslissen. Wat er hiernaast staat is
              met het blote oog niet vast te stellen, ook niet door ons.
            </p>
          </div>
          <ul className="space-y-3">
            {onbekend.map((z) => (
              <li
                key={z}
                className="flex gap-3.5 rounded-[var(--r-md)] bg-white/10 p-5 text-[15px] leading-7 text-[var(--on-dark-body)]"
              >
                <DibaLeafMark className="mt-1.5 h-3.5 w-3.5 shrink-0 text-[var(--on-dark-accent)]" />
                {publicCopy(z)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── 6. De volgende stap ──
          Labels staan hier in g-800 en niet in t-label: dat laatste haalt op deze tint
          geen AA (4,21) en g-800 wel (7,14). */}
      <div className="rounded-[var(--r-lg)] bg-[var(--g-200)] p-7 sm:p-9 lg:p-11">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="diba-label text-[var(--g-800)]">De volgende stap</p>
            <h3 className="diba-display-s mt-4 max-w-[16ch]">
              Behandeling Nul.
              <span className="diba-accent"> Meten, niet behandelen.</span>
            </h3>
            <p className="mt-6 max-w-[52ch] text-[16px] leading-8 text-[var(--g-900)]">
              Er gebeurt niets met je huid. Er wordt gekeken, gemeten en
              uitgelegd, en je gaat naar huis met wat er uit de meting kwam en
              wat dat betekent voor je doel. Ook als dat betekent dat we je iets
              afraden.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-7 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                Plan Behandeling Nul
              </Link>
              <Link
                href="/behandelingen/huidanalyse"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Wat er precies gebeurt
              </Link>
            </div>
          </div>

          {/* De feiten komen uit behandelingen.ts, zodat de prijs hier nooit
              los kan gaan lopen van de prijslijst. */}
          <dl className="space-y-3 self-center rounded-[var(--r-md)] bg-white p-6 sm:p-7">
            {[
              [
                "Wat het kost",
                nulmeting ? prijsTekst(nulmeting.prijs) : "Op aanvraag",
              ],
              ["Hersteltijd", nulmeting ? publicCopy(nulmeting.herstel) : "Geen"],
              ["Wat er gebeurt", "Meten en uitleggen, niet behandelen"],
              ["Daarna", "Je zit nergens aan vast"],
            ].map(([kop, waarde]) => (
              <div
                key={kop}
                className="flex items-baseline justify-between gap-6 rounded-[var(--r-sm)] bg-[var(--g-025)] px-4 py-3"
              >
                <dt className="diba-label shrink-0 text-[var(--t-label)]">
                  {kop}
                </dt>
                <dd className="text-right text-[16px] leading-7 font-medium text-[var(--t-strong)]">
                  {waarde}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
