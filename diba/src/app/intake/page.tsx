import type { Metadata } from "next";
import Link from "next/link";
import BeeldVignet from "@/components/ui/BeeldVignet";
import Meeneemkaart from "@/components/intake/Meeneemkaart";
import Uurtijdlijn from "@/components/intake/Uurtijdlijn";
import { PillarFaq, SectieKop } from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import BelOfApp from "@/components/ui/BelOfApp";
import DibaLeafMark from "@/components/ui/DibaLeafMark";
import Label from "@/components/ui/Label";
import { behandelingVoorSlug, prijsTekst } from "@/data/behandelingen";
import {
  ADVIES_MINUTEN,
  COMBINATIE_AFSPRAAK,
  CONSULT_REVIEW_IDS,
  INTAKE_FAQ,
  INTAKE_FEITEN_VAST,
  INTAKE_MINUTEN,
  VOORBEREIDING,
} from "@/data/intake";
import { SALONIZED_REVIEWS } from "@/data/salonized-reviews";
import { RASTER_GELIJK } from "@/lib/raster";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";
import MobielInklap from "@/components/ui/MobielInklap";

/**
 * Het huidconsult — de intake.
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
  titel: "Het huidconsult: wat er gebeurt",
  omschrijving:
    "Wat er in het huidconsult gebeurt, hoe lang het duurt en wat het kost. Bij behandelen in dezelfde afspraak vervallen de intakekosten.",
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
  { id: "vragen", label: "Vragen" },
];

export default function IntakePage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Het huidconsult", url: `${DIBA_SITE_URL}/intake` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="bg-[var(--g-700)] text-[var(--on-dark)] px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label diba-label-on-dark flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--on-dark-body)]">Huidconsult</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[21ch]">
              Wat er in een
              <br />
              <span className="diba-accent-on-dark">intake gebeurt</span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              De behandelaar bekijkt je huid en meet met de EVE-M onder vaste
              belichting. Je kijkt mee op het scherm en hoort wat er bij jou
              mogelijk is, in welke volgorde en over hoeveel sessies.
            </p>

            <p className="mt-4 max-w-[52ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Word je in dezelfde afspraak behandeld, dan vervallen de
              intakekosten. Je beslist in je eigen tijd wat je daarna doet.
            </p>

            <div className="diba-knoprij mt-9">
              <Button
                variant="primair-op-donker"
                href="/afspraak"
                kort="Plan consult"
              >
                Plan een huidconsult
              </Button>
              <Button
                href={DIBA_WHATSAPP_URL}
                variant="secundair-op-donker"
                target="_blank"
                rel="noopener noreferrer"
                kort="Stel een vraag"
              >
                Liever eerst een vraag stellen
              </Button>
            </div>
          </div>

          {/* De feiten. Vier regels die de twijfel wegnemen voordat de tekst begint. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 text-[var(--t-strong)] sm:p-10">
            <Label>In het kort</Label>
            <dl className="mt-6 space-y-4">
              {intakeFeiten().map((f) => (
                <div
                  key={f.label}
                  className="flex items-baseline justify-between gap-6 rounded-[var(--r-sm)] bg-[var(--g-050)] px-5 py-4"
                >
                  <dt className="diba-label">{f.label}</dt>
                  <dd className="diba-card-title text-right">
                    {publicCopy(f.waarde, "Nog niet vastgesteld")}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* De balk met vier cijfers stond hier. Yasin, 10 september 2026: eraf, net als op
          /tarieven en de behandelpagina's. Het cijfer staat al in de balk bovenaan. */}

      {/* ── De twee manieren om te beginnen ──

          Deze sectie stond er niet, en dat was een gat: volgens Okan is de combinatie de
          meest gekozen afspraak, terwijl de pagina alleen de losse meting beschreef en
          hierboven zelfs "Behandeling deze afspraak: Nee" toont.

          Ze staan naast elkaar en niet onder elkaar, want het is een keuze en geen
          volgorde. De losse meting staat links omdat dat de afspraak is die deze pagina
          uitlegt; de combinatie rechts, met de voorwaarde erbij. Die voorwaarde is geen
          kleine lettertjes maar het verschil tussen de twee. */}
      {/* Dit is letterlijk wat het huidconsult is: samen naar dezelfde meting kijken. Het
          beeld staat ook op de homepage, en dat is hier geen herhaling maar bevestiging. */}
      {/* Vulling boven en onder, niet alleen onder. Zonder die bovenkant plakte de foto
          tegen de sectie erboven (Yasin, 11 september 2026). */}
      <section className="px-5 py-10 sm:px-9 sm:py-14 lg:px-[7.5vw] lg:py-16">
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

      <section className="px-5 pt-10 sm:pt-14 sm:px-9 lg:px-[7.5vw] lg:pt-16">
        <div className="mx-auto">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <Label>Twee manieren om te beginnen</Label>
            <p className="text-[15px] leading-7 text-[var(--t-muted)]">
              Allebei beginnen ze met dezelfde meting.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2 lg:items-stretch">
            <div className="flex flex-col rounded-[var(--r-lg)] bg-white p-5 sm:p-9">
              <Label>Alleen meten</Label>
              <p className="diba-card-title-lg mt-4 text-[var(--t-strong)]">
                Het huidconsult
              </p>
              <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
                We reserveren er maximaal {INTAKE_MINUTEN} minuten voor: het
                gesprek, de beoordeling van je huid en een advies dat je mee
                naar huis krijgt. Aan je huid gebeurt deze afspraak nog niets.
              </p>
              {/* De prijs stond op deze kaart nergens, terwijl "wat kost het" een van de
                  negen vragen uit de gids is en dit de pagina is waar iemand boekt.
                  [BESLUIT-OKAN] of het bedrag ook vervalt bij een behandeling die later
                  geboekt wordt, of alleen in dezelfde afspraak. De zin hieronder klopt in
                  allebei de gevallen; het antwoord bepaalt of hij scherper kan. */}
              <p className="mt-4 text-[16px] leading-7 text-[var(--warn-text)]">
                Hij kost 50 euro. Kies je voor de afspraak waarin ook behandeld
                kan worden, dan vervalt dat bedrag zodra we behandelen.
              </p>
              <p className="diba-label mt-auto pt-6 text-[var(--t-label)]">
                Max. {INTAKE_MINUTEN} minuten
              </p>
            </div>

            <div className="flex flex-col rounded-[var(--r-lg)] bg-[var(--g-075)] p-5 sm:p-9">
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
              {/* Yasin, 10 september 2026: "twee opties voor als je het zelf niet weet,
                  dat moet overal duidelijk staan; ik zie nu alleen de losse intake
                  terugkomen." Deze kaart wás die tweede optie, maar noemde zijn eigen naam
                  niet en linkte nergens heen. Nu allebei, met de twee tijden erbij: als
                  nieuwe klant twee uur, als bestaande klant een uur. */}
              <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
                Deze afspraak heet{" "}
                <Link
                  href="/behandeling-op-advies"
                  className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                >
                  behandeling op advies
                </Link>
                . Ben je al klant, dan hoeft de intake niet opnieuw en duurt hij{" "}
                {ADVIES_MINUTEN.bestaand} minuten.
              </p>
              <p className="diba-label mt-auto pt-6 text-[var(--t-label)]">
                {COMBINATIE_AFSPRAAK.minuten} minuten, met minstens{" "}
                {ADVIES_MINUTEN.minimaalBehandelen} minuten behandeltijd
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Je huidprofiel meenemen ──
          Hier hield de keten op. Je kon op /huidprofiel een profiel opbouwen dat klopte,
          op "plan een huidconsult" klikken, en dan kwam je hier op een algemene uitleg die
          niets van je wist. Deze kaart maakt er één ding van: wat je meeneemt staat er, en
          je kopieert het zelf. Versturen doen wij niet, want het profiel hoort in jouw
          browser te blijven. */}
      <section className="px-5 pt-10 sm:pt-14 sm:px-9 lg:px-[7.5vw] lg:pt-16">
        <div className="mx-auto">
          <Meeneemkaart />
        </div>
      </section>

      {/* In-paginanavigatie, dezelfde vorm als op de huidprobleempagina's. */}
      <nav
        aria-label="Op deze pagina"
        className="sticky top-[var(--nav-h)] z-20 bg-[var(--g-010)]/95 backdrop-blur"
      >
        <ul className="diba-schuifrij mx-auto flex gap-6 px-5 py-4 sm:px-9 lg:px-[7.5vw]">
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
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Het uur, stap voor stap"
            kop="Wat er in dat"
            accent="uur gebeurt"
            intro="De meeste twijfel voor een intake gaat over de vraag of je straks met een pakket de deur uitloopt. Daarom staat het bij elke stap erbij, en niet één keer in de kleine lettertjes."
          />
          <Uurtijdlijn />
        </div>
      </section>

      {/* ── Voorbereiden ── */}
      <section
        id="voorbereiden"
        className="scroll-mt-[var(--anker-offset)] px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Voorbereiden"
            kop="Wat je meeneemt"
            accent="naar je afspraak"
            intro="Twee kleine dingen, en ze bepalen of de meting klopt. Het eerste punt links telt het zwaarst: foundation zit tussen de camera en je huid in."
            raster="gelijk"
          />

          <div className={`mt-12 ${RASTER_GELIJK}`}>
            <div>
              <Label>Altijd</Label>
              <MobielInklap className="mt-5" label="Toon de lijst">
                <ul className="space-y-3">
                  {VOORBEREIDING.altijd.map((v) => (
                    <li
                      key={v}
                      className="rounded-[var(--r-sm)] bg-white p-5 text-[16px] leading-7 text-[var(--t-body)]"
                    >
                      {v}
                    </li>
                  ))}
                </ul>
              </MobielInklap>
            </div>

            <div>
              <Label>Afhankelijk van waarvoor je komt</Label>
              <MobielInklap className="mt-5" label="Toon de lijst">
                <ul className="space-y-3">
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
              </MobielInklap>

              {/* De zin hierboven zei "bel of app even" zonder dat je dat kon. Hij staat in
                  data en kan dus geen koppeling dragen; daarom de knoppen hier, waar de
                  twijfel ontstaat. */}
              <BelOfApp className="mt-5" />

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
                <p className="max-w-[54ch] text-[15px] leading-7 text-[var(--t-body)]">
                  Weet je nog niet waarvoor je komt? Dat hoeft ook niet, en de
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

      {/* ── Wat mensen zeiden die precies dit deden ──
          Op /reviews staan alle 56, met uitleg over wat zo een cijfer wel en niet zegt.
          Hier staan alleen de mensen die voor een consult kwamen, geselecteerd op de
          behandeling die erbij staat en niet op inhoud. */}
      <section className="px-5 py-12 sm:py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto">
          <SectieKop
            label="Van mensen die dit boekten"
            kop="Wat ze zeiden over"
            accent="het consult zelf."
            intro="Geselecteerd op de behandeling die bij de review staat, niet op wat er in de tekst staat. Op de reviewpagina staan ze allemaal, met uitleg over hoe je zo een cijfer leest."
          />

          <ul className="mt-12 gap-4 sm:columns-2 xl:columns-3 [&>li]:mb-4 [&>li]:break-inside-avoid">
            {CONSULT_REVIEW_IDS.map((id, i) => {
              const r = SALONIZED_REVIEWS.find((x) => x.id === id);
              if (!r) return null;
              return (
                <li
                  key={r.id}
                  className={`rounded-[var(--r-lg)] bg-[var(--g-050)] p-7 sm:p-8${
                    i >= 2 ? " max-md:hidden" : ""
                  }`}
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
            Alle reviews, en hoe je ze het beste leest
          </Link>
        </div>
      </section>

      <PillarFaq items={INTAKE_FAQ} onderwerp="intake" />

      {/* ── Slot ── */}
      <section className="relative overflow-hidden mx-5 mt-16 mb-5 rounded-[var(--r-xl)] lg:mt-20 bg-[var(--g-700)] px-7 py-10 sm:py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <DibaLeafMark
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -bottom-10 h-[260px] w-[260px] -rotate-12 opacity-20"
        />
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
            <div className="mt-7 diba-knoprij">
              <Button
                href="/afspraak"
                variant="primair-op-donker"
                kort="Huidconsult"
              >
                Plan een huidconsult
              </Button>
              {/* Wees naar /ons-verbond; die pagina is op 10 september 2026 weggehaald.
                  Wat een bezoeker hier nog wil is de prijs zien voordat hij boekt. */}
              <Button
                href="/tarieven"
                variant="secundair-op-donker"
                kort="Tarieven"
              >
                Bekijk de tarieven
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
