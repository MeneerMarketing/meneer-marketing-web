import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icon";
import Label from "@/components/ui/Label";
import { publicCopy } from "@/lib/copy-flags";
import {
  RASTER_GELIJK,
  RASTER_SECTIEKOP,
  RASTER_SECTIEKOP_GELIJK,
} from "@/lib/raster";

/**
 * De secties die elke huidprobleempagina deelt.
 *
 * Wat per aandoening verschilt is de inhoud en de eigen interactieve sectie; de rest is
 * ritme. Door die hier te zetten blijft de site consistent en kost een nieuwe pagina
 * inhoud in plaats van opnieuw opbouwen.
 *
 * Vaste regel in alle varianten: maximaal twee donkergroene vlakken per pagina (§5), en
 * die markeren altijd hetzelfde — het moment waarop we nee zeggen, en de volgende stap.
 */

/* ── Sectiekop ─────────────────────────────────────────────────────────── */

export function SectieKop({
  label,
  kop,
  accent,
  intro,
  opDonker = false,
  raster = "standaard",
}: {
  label: string;
  kop: string;
  /** Tweede regel, in kleur. Zo zit het accent in kleur en niet in italic. */
  accent?: string;
  intro?: string;
  opDonker?: boolean;
  /**
   * Welke indeling de inhoud onder deze kop heeft.
   *
   * De kop volgt wat eronder staat en niet andersom: bij twee gelijke helften hoort de
   * introzin op de helft te beginnen, bij kop-links-inhoud-rechts op 0.9/1.1. Zonder dit
   * onderscheid stond de zin zesenveertig pixels naast de kaarten eronder.
   */
  raster?: "standaard" | "gelijk";
}) {
  return (
    /* Eén gedeeld raster met de inhoud eronder. Stond op 0.85/1.15 met gap-6 terwijl de
       tools eronder 0.9/1.1 met gap-8 gebruikten, en dan begint de introzin tweeëndertig
       pixels naast het paneel eronder. Zie `raster.ts`. */
    <div
      className={
        raster === "gelijk" ? RASTER_SECTIEKOP_GELIJK : RASTER_SECTIEKOP
      }
    >
      <div>
        <Label opDonker={opDonker}>{label}</Label>
        <h2 className="diba-display-m mt-4 max-w-[18ch]">
          {kop}
          {accent ? (
            <>
              <br />
              <span
                className={opDonker ? "diba-accent-on-dark" : "diba-accent"}
              >
                {accent}
              </span>
            </>
          ) : null}
        </h2>
      </div>
      {intro ? (
        <p
          className={`max-w-[64ch] text-[16px] leading-7 ${
            opDonker ? "text-[var(--on-dark-body)]" : "text-[var(--t-body)]"
          }`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}

/* ── Wat werkt en wat niet ─────────────────────────────────────────────── */

export function WelNiet({
  wel,
  niet,
  intro,
}: {
  wel: readonly string[];
  niet: readonly string[];
  intro?: string;
}) {
  return (
    <section
      id="wel-niet"
      className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
    >
      <div className="mx-auto">
        <SectieKop
          label="Zonder omwegen"
          kop="Wat werkt. En wat niet."
          intro={
            intro ??
            "De rechterkolom is de nuttigste van de twee. Bij elk kruisje staat waarom, want “niet doen” zonder reden onthoudt niemand."
          }
          raster="gelijk"
        />

        <div className={`mt-12 ${RASTER_GELIJK}`}>
          <div className="rounded-[var(--r-md)] bg-white p-6 sm:p-8">
            <h3 className="diba-label text-[var(--g-700)]">Dit werkt</h3>
            <ul className="mt-5 space-y-4">
              {wel.map((r) => (
                <li key={r} className="flex gap-3 text-[15px] leading-7">
                  <svg
                    viewBox="0 0 20 20"
                    className="mt-1.5 h-4 w-4 shrink-0 text-[var(--g-700)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 10.5 8 14.5 16 5.5" />
                  </svg>
                  <span className="text-[var(--t-body)]">{publicCopy(r)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--r-md)] bg-white p-6 sm:p-8">
            <h3 className="diba-label text-[var(--warn-text)]">
              Dit raden we af
            </h3>
            <ul className="mt-5 space-y-4">
              {niet.map((r) => (
                <li key={r} className="flex gap-3 text-[15px] leading-7">
                  <svg
                    viewBox="0 0 20 20"
                    className="mt-1.5 h-4 w-4 shrink-0 text-[var(--warn)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" />
                  </svg>
                  <span className="text-[var(--t-body)]">{publicCopy(r)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Waar wij nee zeggen (donkergroen 1 van 2) ─────────────────────────── */

export function WijZeggenNee({
  kop,
  accent,
  intro,
  punten,
}: {
  kop: string;
  accent: string;
  intro: string;
  punten: readonly { readonly titel: string; readonly tekst: string }[];
}) {
  return (
    <section
      id="nee"
      className="scroll-mt-[var(--anker-offset)] bg-[var(--g-700)] px-5 py-20 text-[var(--on-dark)] sm:px-9 lg:px-[7.5vw] lg:py-28"
    >
      <div className="mx-auto">
        <SectieKop
          label="Waar wij nee zeggen"
          kop={kop}
          accent={accent}
          intro={intro}
          opDonker
        />

        {/* De kolommen volgen het aantal punten. Met vast drie kolommen laat een
            vierde punt twee lege cellen achter, en die krijgen door de gap-truc de
            lichtere achtergrond van de lijst: een leeg blok dat er opzettelijk uitziet. */}
        <ul
          className={`mt-12 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-white/15 ${
            punten.length % 3 === 0 || punten.length % 2 !== 0
              ? "md:grid-cols-3"
              : "md:grid-cols-2"
          }`}
        >
          {punten.map((p) => (
            <li key={p.titel} className="bg-[var(--g-700)] p-6 sm:p-8">
              <h3 className="diba-card-title">{p.titel}</h3>
              <p className="mt-3 text-[15px] leading-7 text-[var(--on-dark-body)]">
                {publicCopy(p.tekst)}
              </p>
            </li>
          ))}
        </ul>

        <p className="diba-label diba-label-on-dark mt-8">
          Dit staat ook in ons verbond ·{" "}
          <Link href="/ons-verbond" className="underline underline-offset-4">
            lees de tien weigeringen
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ── De Nulmeting, met de assen die bij deze aandoening tellen ─────────── */

export function NulmetingAssen({
  kop,
  alineas,
  assen,
}: {
  kop: string;
  alineas: readonly string[];
  assen: readonly (readonly [string, string])[];
}) {
  return (
    <section
      id="meten"
      className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
    >
      <div className="mx-auto grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div>
          <Label>De Nulmeting</Label>
          <h2 className="diba-display-m mt-4 max-w-[18ch]">{kop}</h2>
          {alineas.map((a) => (
            <p
              key={a}
              className="mt-5 max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]"
            >
              {publicCopy(a)}
            </p>
          ))}
          <Button
            href="/behandelingen/huidanalyse"
            variant="secundair"
            className="mt-8"
          >
            Meer over De Nulmeting
          </Button>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3">
          {assen.map(([as, wat]) => (
            <li
              key={as}
              className="rounded-[var(--r-sm)] bg-[var(--g-050)] p-5"
            >
              <h3 className="diba-card-title">{as}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--t-body)]">
                {wat}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Veelgestelde vragen ───────────────────────────────────────────────── */

export function PillarFaq({
  items,
}: {
  items: readonly { readonly vraag: string; readonly antwoord: string }[];
}) {
  return (
    <section
      id="vragen"
      className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
    >
      <div className="mx-auto grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <Label>Goed om te weten</Label>
          <h2 className="diba-display-m mt-4 max-w-[16ch]">
            De vragen die we het vaakst krijgen.
          </h2>
        </div>

        <div className="border-t border-[var(--g-100)]">
          {items.map((item) => (
            <details
              key={item.vraag}
              className="group border-b border-[var(--g-100)] py-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl tracking-[-.035em]">
                <span>{item.vraag}</span>
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--r-pill)] bg-[var(--g-050)] text-[var(--g-700)] transition group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[68ch] pt-4 text-[15px] leading-7 text-[var(--t-body)]">
                {publicCopy(item.antwoord)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── De volgende stap (donkergroen 2 van 2) ────────────────────────────── */

export function PillarCta({
  kop,
  accent,
  tekst,
  topic,
  whatsappHref,
}: {
  kop: string;
  accent: string;
  tekst: string;
  topic: string;
  whatsappHref: string;
}) {
  return (
    <section className="mx-5 mb-5 overflow-hidden rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
      <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[1.35fr_.65fr]">
        <div>
          <Label opDonker>Behandeling Nul</Label>
          <h2 className="diba-display-l mt-5">
            {kop}
            <br />
            <span className="diba-accent-on-dark">{accent}</span>
          </h2>
        </div>
        <div className="flex flex-col justify-end">
          <p className="max-w-sm text-[16px] leading-7 text-[var(--on-dark-body)]">
            {tekst}
          </p>
          <Button
            href={`/intake?topic=${topic}`}
            variant="primair-op-donker"
            className="mt-8 w-fit"
          >
            Start je intake (4 min)
          </Button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="diba-label diba-label-on-dark mt-4 inline-flex items-center gap-1.5 underline underline-offset-4"
          >
            Nog niet zeker? Stel je vraag
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
