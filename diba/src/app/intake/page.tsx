import type { Metadata } from "next";
import Link from "next/link";
import BeeldVignet from "@/components/ui/BeeldVignet";
import Meeneemkaart from "@/components/intake/Meeneemkaart";
import Uurtijdlijn from "@/components/intake/Uurtijdlijn";
import { PillarFaq, SectieKop } from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { behandelingVoorSlug, prijsTekst } from "@/data/behandelingen";
import {
  COMBINATIE_AFSPRAAK,
  CONSULT_REVIEW_IDS,
  INTAKE_FAQ,
  INTAKE_FEITEN_VAST,
  INTAKE_MINUTEN,
  OOK_ALS_JE_STOPT,
  VOORBEREIDING,
} from "@/data/intake";
import { SALONIZED_REVIEWS } from "@/data/salonized-reviews";
import { RASTER_GELIJK } from "@/lib/raster";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SALONIZED_BOOKING_URL,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Behandeling Nul — de intake.
 *
 * Hier wijst elke knop op de site naartoe, dus dit is de pagina waar de meeste twijfel
 * zit. Die twijfel gaat zelden over de meting; hij gaat over de vraag of je straks met een
 * verkoopgesprek en een pakket de deur uitloopt.
 *
 * De hele pagina is op die ene vraag gebouwd. De tijdlijn zet bij elke stap wat je op dat
 * moment níet hoeft, en de feitenrij in de hero zegt in vier regels dat er deze afspraak
 * niet behandeld wordt en dat er geen verplichting is. Dat werkt beter dan een alinea over
 * hoe eerlijk we zijn.
 *
 * Herbouwd in de huisstijl van de huidprobleempagina's; de vorige versie draaide op
 * IntakeTemplate en had achtendertig woorden.
 *
 * Twee donkergroene vlakken, niet meer (§5).
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/intake",
  titel: "Behandeling Nul: de intake",
  omschrijving:
    "Wat er in de intake gebeurt, wat het kost, wat je niet hoeft, en wat je overhoudt als je daarna nooit meer terugkomt.",
});

/**
 * De feiten naast de kop.
 *
 * Duur en kosten stonden hier als lege vlaggen, op precies de plek waar iemand kijkt
 * voordat hij boekt. Het bedrag stond ondertussen gewoon in de behandelingentabel en werd
 * op de uitkomst van het huidprofiel al getoond. Nu komt het daarvandaan, zodat de prijs
 * op de boekpagina nooit los kan lopen van de prijslijst.
 */
function intakeFeiten() {
  const nul = behandelingVoorSlug("huidanalyse");
  return [
    /* "Gereserveerd" en niet "duur": de gids wil de tijd als maximum. Wie na veertig
       minuten klaar is en een uur verwachtte, denkt dat hij is afgeraffeld. */
    { label: "Gereserveerd", waarde: `Max. ${INTAKE_MINUTEN} minuten` },
    {
      label: "Kosten",
      waarde: nul ? prijsTekst(nul.prijs) : "Op aanvraag",
    },
    ...INTAKE_FEITEN_VAST,
  ];
}

const ANKERS = [
  { id: "uur", label: "Wat er gebeurt" },
  { id: "voorbereiden", label: "Voorbereiden" },
  { id: "ook-als-je-stopt", label: "Als je hierna stopt" },
  { id: "vragen", label: "Vragen" },
];

export default function IntakePage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Behandeling Nul", url: `${DIBA_SITE_URL}/intake` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Behandeling Nul</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[16ch]">
              Wat er in een
              <br />
              <span className="diba-accent">intake gebeurt</span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Behandeling Nul is een afspraak waarin niet behandeld wordt. We
              meten je huid onder vaste belichting, laten zien wat we zien en
              vertellen wat er realistisch mogelijk is. Meer niet.
            </p>

            <p className="mt-4 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Je hoeft aan het eind niets af te spreken. Soms is het advies
              zelfs om niets te doen, en dan houdt het daar op.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href={DIBA_SALONIZED_BOOKING_URL || "/contact"}>
                Plan Behandeling Nul
              </Button>
              <Button
                href={DIBA_WHATSAPP_URL}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Liever eerst een vraag stellen
              </Button>
            </div>
          </div>

          {/* De feiten. Vier regels die de twijfel wegnemen voordat de tekst begint. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-10">
            <Label opDonker>In het kort</Label>
            <dl className="mt-6 space-y-4">
              {intakeFeiten().map((f) => (
                <div
                  key={f.label}
                  className="flex items-baseline justify-between gap-6 rounded-[var(--r-sm)] bg-[var(--g-800)] px-5 py-4"
                >
                  <dt className="diba-label diba-label-on-dark">{f.label}</dt>
                  <dd className="diba-card-title text-right">
                    {publicCopy(f.waarde, "Nog niet vastgesteld")}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[15px] leading-7 text-[var(--on-dark-body)]">
              Wat kost Behandeling op advies?
            </p>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      {/* ── De twee manieren om te beginnen ──

          Deze sectie stond er niet, en dat was een gat: volgens Okan is de combinatie de
          meest gekozen afspraak, terwijl de pagina alleen de losse meting beschreef en
          hierboven zelfs "Behandeling deze afspraak: Nee" toont.

          Ze staan naast elkaar en niet onder elkaar, want het is een keuze en geen
          volgorde. De losse meting staat links omdat dat de afspraak is die deze pagina
          uitlegt; de combinatie rechts, met de voorwaarde erbij. Die voorwaarde is geen
          kleine lettertjes maar het verschil tussen de twee. */}
      {/* Dit is letterlijk wat Behandeling Nul is: samen naar dezelfde meting kijken. Het
          beeld staat ook op de homepage, en dat is hier geen herhaling maar bevestiging. */}
      <section className="px-5 pb-14 sm:px-9 lg:px-[7.5vw] lg:pb-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/hero-huidscan.jpg"
            alt="Behandelaar bespreekt de uitkomst van een huidscan met een client"
            onderschrift="Hetzelfde scherm, tegelijk"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/9] lg:aspect-[21/9]"
          />
        </div>
      </section>

      <section className="px-5 pt-14 sm:px-9 lg:px-[7.5vw] lg:pt-16">
        <div className="mx-auto">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <Label>Twee manieren om te beginnen</Label>
            <p className="text-[15px] leading-7 text-[var(--t-muted)]">
              Allebei beginnen ze met dezelfde meting.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2 lg:items-stretch">
            <div className="flex flex-col rounded-[var(--r-lg)] bg-white p-7 sm:p-9">
              <Label>Alleen meten</Label>
              <p className="diba-card-title-lg mt-4 text-[var(--t-strong)]">
                Behandeling Nul
              </p>
              <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
                We reserveren er {INTAKE_MINUTEN} minuten voor: meten, uitleg en
                een plan. Er gebeurt niets aan je huid, en je zit nergens aan
                vast.
              </p>
              <p className="diba-label mt-auto pt-6 text-[var(--t-label)]">
                Max. {INTAKE_MINUTEN} minuten
              </p>
            </div>

            <div className="flex flex-col rounded-[var(--r-lg)] bg-[var(--g-075)] p-7 sm:p-9">
              <Label>{COMBINATIE_AFSPRAAK.label}</Label>
              <p className="diba-card-title-lg mt-4 text-[var(--t-strong)]">
                {COMBINATIE_AFSPRAAK.kop}
              </p>
              <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
                {publicCopy(COMBINATIE_AFSPRAAK.zin)}
              </p>
              <p className="mt-4 text-[15px] leading-7 text-[var(--warn-text)]">
                {publicCopy(COMBINATIE_AFSPRAAK.voorwaarde)}
              </p>
              <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                {publicCopy(COMBINATIE_AFSPRAAK.voorbehoud)}
              </p>
              <p className="diba-label mt-auto pt-6 text-[var(--t-label)]">
                Max. {COMBINATIE_AFSPRAAK.minuten} minuten
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Je huidprofiel meenemen ──
          Hier hield de keten op. Je kon op /huidprofiel een profiel opbouwen dat klopte,
          op "plan Behandeling Nul" klikken, en dan kwam je hier op een algemene uitleg die
          niets van je wist. Deze kaart maakt er één ding van: wat je meeneemt staat er, en
          je kopieert het zelf. Versturen doen wij niet, want het profiel hoort in jouw
          browser te blijven. */}
      <section className="px-5 pt-14 sm:px-9 lg:px-[7.5vw] lg:pt-16">
        <div className="mx-auto">
          <Meeneemkaart />
        </div>
      </section>

      {/* In-paginanavigatie, dezelfde vorm als op de huidprobleempagina's. */}
      <nav
        aria-label="Op deze pagina"
        className="sticky top-[var(--nav-h)] z-20 bg-[var(--g-010)]/95 backdrop-blur"
      >
        <ul className="mx-auto flex gap-6 overflow-x-auto px-5 py-4 sm:px-9 lg:px-[7.5vw]">
          {ANKERS.map((a) => (
            <li key={a.id}>
              <a
                href={`#${a.id}`}
                className="diba-label whitespace-nowrap hover:text-[var(--g-700)]"
              >
                {a.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── De tijdlijn: de uitblinker ── */}
      <section
        id="uur"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Het uur, stap voor stap"
            kop="Wat er in dat"
            accent="uur gebeurt"
            intro="De meeste twijfel voor een intake gaat niet over de meting maar over de vraag of je straks met een pakket de deur uitloopt. Daarom staat het bij elke stap erbij, en niet één keer in de kleine lettertjes."
          />
          <Uurtijdlijn />
        </div>
      </section>

      {/* ── Voorbereiden ── */}
      <section
        id="voorbereiden"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Voorbereiden"
            kop="Wat je meeneemt"
            accent="naar je afspraak"
            intro="Niets ingewikkelds, en het scheelt of de meting klopt. Het eerste punt links is het belangrijkste: een meting over foundation heen is geen meting."
            raster="gelijk"
          />

          <div className={`mt-12 ${RASTER_GELIJK}`}>
            <div>
              <Label>Altijd</Label>
              <ul className="mt-5 space-y-3">
                {VOORBEREIDING.altijd.map((v) => (
                  <li
                    key={v}
                    className="rounded-[var(--r-sm)] bg-white p-5 text-[16px] leading-7 text-[var(--t-body)]"
                  >
                    {v}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label>Afhankelijk van waarvoor je komt</Label>
              <ul className="mt-5 space-y-3">
                {VOORBEREIDING.soms.map((v) => (
                  <li
                    key={v.wanneer}
                    className="rounded-[var(--r-sm)] bg-white p-5"
                  >
                    <span className="diba-card-title block">{v.wanneer}</span>
                    <span className="mt-2 block text-[16px] leading-7 text-[var(--t-body)]">
                      {publicCopy(v.wat)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
                <p className="max-w-[54ch] text-[15px] leading-7 text-[var(--t-body)]">
                  Weet je nog niet waarvoor je komt? Dat is geen bezwaar, en de
                  zoeker helpt je een richting te vinden voordat je hier bent.
                </p>
                <Link
                  href="/huidproblemen/symptoomzoeker"
                  className="diba-label text-[var(--g-700)] underline underline-offset-4"
                >
                  Naar de symptoomzoeker
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Wat je overhoudt als je stopt ──
          De drempel bij een intake is niet het bedrag maar het vermoeden dat het de ingang
          van een traject is. Schaarste en kortingen mogen hier niet en werken bij een
          medische keuze averechts; het risico wegnemen werkt wel. Dus staat hier wat de
          afspraak oplevert als je daarna nooit meer terugkomt. */}
      <section
        id="ook-als-je-stopt"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Als je hierna niets doet"
            kop="Wat je dan nog steeds"
            accent="meeneemt."
            intro="De meeste twijfel gaat niet over het bedrag maar over de vraag of dit de ingang van een traject is. Dat is het niet, en dit is wat de afspraak oplevert als je daarna nooit meer terugkomt."
            raster="gelijk"
          />

          <ul className={`mt-12 ${RASTER_GELIJK}`}>
            {OOK_ALS_JE_STOPT.map((k) => (
              <li
                key={k.kop}
                className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9"
              >
                <p className="diba-card-title text-[var(--t-strong)]">
                  {k.kop}
                </p>
                <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
                  {k.zin}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Wat we niet doen: nabellen, een aanbod dat verloopt, of een korting
            als je vandaag beslist. Die staan nergens op deze site en ze komen
            er ook niet.
          </p>
        </div>
      </section>

      {/* ── Wat mensen zeiden die precies dit deden ──
          Op /reviews staan alle 56 met de waarschuwing dat een 5,0 wantrouwen verdient.
          Hier staan alleen de mensen die voor een consult kwamen, geselecteerd op de
          behandeling die erbij staat en niet op inhoud. */}
      <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto">
          <SectieKop
            label="Van mensen die dit boekten"
            kop="Wat ze zeiden over"
            accent="het consult zelf."
            intro="Geselecteerd op de behandeling die bij de review staat, niet op wat er in de tekst staat. Alle 56 staan er, met de kanttekening dat een 5,0 wantrouwen verdient."
          />

          <ul className="mt-12 gap-4 sm:columns-2 xl:columns-3 [&>li]:mb-4 [&>li]:break-inside-avoid">
            {CONSULT_REVIEW_IDS.map((id) => {
              const r = SALONIZED_REVIEWS.find((x) => x.id === id);
              if (!r) return null;
              return (
                <li
                  key={r.id}
                  className="rounded-[var(--r-lg)] bg-[var(--g-050)] p-7 sm:p-8"
                >
                  <blockquote className="text-[16px] leading-7 text-[var(--t-strong)]">
                    {r.quote}
                  </blockquote>
                  <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[15px] leading-6 font-medium text-[var(--t-strong)]">
                      {r.name}
                    </span>
                    {r.relativeDate ? (
                      <span className="text-[14px] leading-6 text-[var(--t-muted)]">
                        {r.relativeDate}
                      </span>
                    ) : null}
                  </div>
                  <p className="diba-label mt-4 inline-flex rounded-[var(--r-pill)] bg-white px-4 py-2 text-[var(--t-label)]">
                    {r.treatment}
                  </p>
                </li>
              );
            })}
          </ul>

          <Link
            href="/reviews"
            className="diba-label mt-8 inline-flex min-h-11 items-center text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
          >
            Alle reviews, en waarom een 5,0 wantrouwen verdient
          </Link>
        </div>
      </section>

      <PillarFaq items={INTAKE_FAQ} onderwerp="intake" />

      {/* ── Slot ── */}
      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto lg:grid lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
          <div>
            <Label opDonker>Behandeling nul</Label>
            <h2 className="diba-display-l mt-5 max-w-[15ch]">
              Eén afspraak,
              <br />
              <span className="diba-accent-on-dark">zonder verplichting</span>
            </h2>
          </div>
          <div className="mt-8 flex flex-col justify-end lg:mt-0">
            <p className="max-w-sm text-[16px] leading-7 text-[var(--on-dark-body)]">
              Je gaat weg met een meting die van jou is en een advies dat ook
              nee mag zijn. Wat je daarna doet, beslis je thuis.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              <Button
                href={DIBA_SALONIZED_BOOKING_URL || "/contact"}
                variant="primair-op-donker"
              >
                Plan Behandeling Nul
              </Button>
              <Button href="/ons-verbond" variant="secundair-op-donker">
                Lees ons verbond
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
