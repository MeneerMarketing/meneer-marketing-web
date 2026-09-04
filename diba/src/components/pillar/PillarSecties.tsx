import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icon";
import Label from "@/components/ui/Label";
import { publicCopy } from "@/lib/copy-flags";
import { faqSchema, SchemaMarkup } from "@/lib/schema";
import {
  RASTER_GELIJK,
  RASTER_SECTIE,
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
  icoon: Icoon,
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
  /**
   * Het huidicoon boven het label.
   *
   * Alleen voor de sectie die het eigen onderzoek van een pagina draagt: de drukproef,
   * de ochtendtest, de beweegtest. Die sectie is per pagina anders en verdient een eigen
   * gezicht; de vaste secties eronder zijn overal hetzelfde en horen dat te blijven.
   *
   * Zet hem dus niet overal neer. Een icoon boven elke kop is geen accent meer maar
   * behang, en dan zegt het niets meer over waar je bent.
   */
  icoon?: (p: { size?: number }) => React.ReactElement;
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
        {Icoon ? (
          <span
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-[var(--r-md)] ${
              opDonker
                ? "bg-white/12 text-[var(--on-dark)]"
                : "bg-[var(--g-100)] text-[var(--g-700)]"
            }`}
          >
            <Icoon size={34} />
          </span>
        ) : null}
        <Label opDonker={opDonker}>{label}</Label>
        {/* 18ch kneep de kop af, en met de accentregel eronder kwam je dan op drie
            regels uit. Drieendertig sectiekoppen op de site hadden dat. 26ch laat de
            eerste regel heel, en de kolom is er breed genoeg voor. */}
        {/* De regelafbreking tussen kop en accent stond er altijd, ook bij een kop van
            twee woorden. "Drie oorzaken" werd dan "Drie" met "oorzaken" eronder, en dat
            oogt als een kop die is afgekapt. Onder de twintig tekens passen ze samen op
            een regel en laten we de browser het breken bepalen. */}
        <h2 className="diba-display-m mt-4 max-w-[26ch]">
          {kop}
          {accent ? (
            <>
              {(kop + " " + accent).length > 24 ? <br /> : " "}
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
          kop="Wat helpt en wat we afraden"
          intro={
            intro ??
            "Bij elk punt staat waarom, want een “niet doen” zonder reden onthoudt niemand."
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

        {/* ── Rijen, geen kolommen ──
            Hier stonden drie kolommen met haarlijntjes ertussen: een raster met gap-px op
            een lichter vlak, waarbij elke cel dezelfde donkergroene achtergrond had als de
            sectie. Het waren dus geen kaarten maar losse tekstkolommen met streepjes
            ertussen, en dat is precies de lijnenstijl die deze huisstijl niet voert.

            Erger was wat het met de inhoud deed. Drie weigeringen met ongelijk lange
            redenen naast elkaar geven onderaan rafelrand: de korte kolom houdt lucht over,
            de lange loopt door. Naast elkaar zetten dwingt ze bovendien in dezelfde breedte
            terwijl ze niet even zwaar wegen.

            Als rijen klopt het wel. De weigering staat groot links, de reden ernaast, en
            elke rij vult de volle breedte. Lange en korte redenen kunnen naast elkaar
            bestaan zonder dat er iets rafelt, en de weigeringen komen onder elkaar te
            staan waardoor je ze als reeks leest. Ze beginnen alle drie met "Geen", dus dat
            wordt vanzelf een ritme. */}
        <ul className="mt-12 space-y-3">
          {punten.map((p) => (
            <li
              key={p.titel}
              /* Donkerder dan de sectie en niet lichter. Met bg-white/10 werd het groen
                 opgelicht tot rgb(62,120,86) en zakte de bodytekst naar 4,08, onder de
                 AA-grens. Op --g-800 haalt diezelfde tekst 7,57 en de titel 9,68, dus het
                 vlak dat de rijen afbakent maakt ze meteen beter leesbaar. */
              className="grid gap-4 rounded-[var(--r-lg)] bg-[var(--g-800)] p-7 sm:p-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-baseline lg:gap-12"
            >
              <h3 className="text-[22px] leading-[1.15] font-medium tracking-[-.03em] text-balance sm:text-[26px]">
                {p.titel}
              </h3>
              <p className="max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                {publicCopy(p.tekst)}
              </p>
            </li>
          ))}
        </ul>

        <p className="diba-label diba-label-on-dark mt-10">
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
      {/* ── Eén meetpaneel in plaats van drie zwevende kaartjes ──
            De rechterkolom was 145 pixels hoog naast een linkerkolom van 347, en stond
            ook nog verticaal gecentreerd. Drie kaartjes die in tweehonderd pixels leegte
            hangen; dat is wat er scheef aan oogde.

            De inhoud is bovendien geen drie losse dingen maar één ding: wat er bij deze
            aandoening gemeten wordt. Als één paneel met de assen eronder leest het als een
            meetrapport, wat het ook is, en het loopt door tot dezelfde onderkant als de
            tekst ernaast. */}
      <div className={`mx-auto ${RASTER_SECTIE}`}>
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

        <div className="rounded-[var(--r-lg)] bg-[var(--g-050)] p-7 sm:p-9 lg:h-full">
          <p className="diba-label text-[var(--t-label)]">Wat we hier meten</p>
          <dl className="mt-6 space-y-6">
            {assen.map(([as, wat]) => (
              <div key={as}>
                <dt className="text-[19px] leading-7 font-medium text-[var(--t-strong)]">
                  {as}
                </dt>
                <dd className="mt-1 max-w-[46ch] text-[15px] leading-7 text-[var(--t-body)]">
                  {wat}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-[46ch] text-[14px] leading-6 text-[var(--t-muted)]">
            Elke as wordt bij elke controle opnieuw gemeten, onder dezelfde
            belichting. Daarom is verschil later iets dat je ziet en niet iets
            dat je moet geloven.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Veelgestelde vragen ───────────────────────────────────────────────── */

/**
 * De vragenlijst, met het bijbehorende FAQPage-schema erin.
 *
 * WAAROM DAT SCHEMA HIER STAAT EN NIET OP DE PAGINA.
 *
 * Eenendertig pagina's tonen deze lijst en precies één ervan meldde hem ook aan bij Google.
 * Dat is de soort fout die een handmatige lijst altijd maakt: je bouwt de pagina, de vragen
 * staan er, het ziet er af uit, en het schema vergeet je omdat het onzichtbaar is.
 *
 * Nu hoort het bij de component. Wie de vragen toont, meldt ze ook aan, en er is geen stap
 * meer om over te slaan.
 *
 * Wat het oplevert: Google kan de vragen uitklapbaar onder het zoekresultaat tonen. Dat is
 * meer ruimte op de pagina en, belangrijker, iemand met een vraag ziet het antwoord al
 * voordat hij klikt. Dat scheelt een teleurstelde klik.
 *
 * De antwoorden gaan door publicCopy heen, net als op het scherm: een redactievlag hoort
 * niet in het schema terecht te komen dat wij zelf bij Google aanmelden.
 */
export function PillarFaq({
  items,
  onderwerp,
}: {
  items: readonly { readonly vraag: string; readonly antwoord: string }[];
  /** Het onderwerp in de kop. Zonder dit staat er alleen "Veelgestelde vragen". */
  onderwerp?: string;
}) {
  return (
    <section
      id="vragen"
      className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
    >
      {items.length > 0 ? (
        <SchemaMarkup
          data={faqSchema(
            items.map((i) => ({
              question: i.vraag,
              answer: publicCopy(i.antwoord),
            })),
          )}
        />
      ) : null}

      <div className="mx-auto grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        {/* Het onderwerp stond in de kop, en daardoor liep "Veelgestelde vragen over de
            U225 intradermale injector" over vijf regels in een kolom van zestien tekens.
            Vijftien pagina's hadden dat probleem. Het onderwerp staat nu in het label
            erboven, waar het in kleine kapitalen op een regel past, en de kop is overal
            dezelfde twee woorden. */}
        <div>
          <Label>{onderwerp ? `Over ${onderwerp}` : "Goed om te weten"}</Label>
          <h2 className="diba-display-m mt-4 max-w-[16ch]">
            Veelgestelde vragen
          </h2>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <details
              key={item.vraag}
              className="group rounded-[var(--r-md)] bg-white px-6 py-5"
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
  /* mt-16 en niet nul. Dit blok had alleen mx en mb, dus het plakte tegen de sectie
     erboven: een groen vlak dat direct op een mintvlak begon, met een zichtbare naad
     ertussen. Nu draagt het blok zijn eigen bovenruimte, op elke pagina hetzelfde. */
  return (
    <section className="mx-5 mb-5 mt-16 overflow-hidden rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 lg:mt-20 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
      <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[1.35fr_.65fr]">
        <div>
          <Label opDonker>Huidconsult</Label>
          <h2 className="diba-display-l mt-5">
            {kop} <span className="diba-accent-on-dark">{accent}</span>
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
            Plan een huidconsult
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
