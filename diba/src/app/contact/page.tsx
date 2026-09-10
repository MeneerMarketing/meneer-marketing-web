import type { Metadata } from "next";
import Link from "next/link";
import Contactformulier from "@/components/contact/Contactformulier";
import Ingangkiezer from "@/components/contact/Ingangkiezer";
import Kaart, { MAPS_URL } from "@/components/contact/Kaart";
import BeeldVignet from "@/components/ui/BeeldVignet";
import Label from "@/components/ui/Label";
import Reviewregel from "@/components/reviews/Reviewregel";
import { SITUATIES } from "@/data/voorwaarden";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_ADDRESS,
  DIBA_EMAIL,
  DIBA_INSTAGRAM_URL,
  DIBA_OPENINGSTIJDEN,
  DIBA_SITE,
  DIBA_SITE_URL,
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Contact.
 *
 * WAAROM DEZE PAGINA ANDERS IS OPGEBOUWD DAN DE REST.
 *
 * De meeste pagina's hier beginnen bij een vraag over je huid. Deze niet: wie hier komt
 * heeft al een vraag en zoekt alleen nog waar hij die kwijt kan. De opbouw volgt dat, en
 * daarom staat het adres bovenaan en niet in een voettekst.
 *
 * DE HERZIENING VAN 10 SEPTEMBER 2026.
 *
 * Yasin: "die hele contactpagina vind ik qua tekst en indeling te zweverig, we hebben veel
 * witruimte en zweverige aparte teksten." Drie dingen zijn daarop veranderd:
 *
 * 1. Een formulier, in de linkerkolom naast de openingstijden. Daar stond een kop met een
 *    lege kolom eronder. Wie snel iets wil vragen hoeft nu geen kanaal meer te kiezen.
 * 2. Een kaart, in de linkerkolom bij de route, waar ook al een kop met witruimte stond.
 * 3. De kop boven de ingangkiezer ging over wat andere contactpagina's fout doen
 *    ("de meeste contactpagina's zetten drie iconen naast elkaar en laten jou raden").
 *    Dat is een mening over de branche en geen antwoord op een vraag van een bezoeker.
 *    Er staat nu wat er te kiezen valt en waarom.
 *
 * Weggehaald: het donkergroene blok "Wat een bericht je oplevert", vier kaarten met een
 * belofte per stuk. De kern ervan, dat het laatste stukje van elk antwoord pas komt als we
 * je huid gezien hebben, staat nu in twee regels boven het formulier. Daar is het een
 * verwachting bij een handeling in plaats van een sectie op zichzelf.
 *
 * WAT ER EERDER AL IS RECHTGEZET.
 *
 * Telefoon en e-mail stonden als "[GEGEVEN-NODIG]" en waren daarmee leeg, terwijl ze
 * allebei in `site.ts` staan. En er stond "tram 4 of 8 richting Kralingse Zoom" terwijl de
 * kliniek in Hillegersberg staat; dat is verzonnen reisadvies waar iemand naar handelt.
 * [GEGEVEN-NODIG: de route en het parkeren bevestigen, Okan]
 *
 * OPENINGSTIJDEN.
 *
 * Uit `DIBA_OPENINGSTIJDEN` in site.ts, en diezelfde bron voedt het bedrijfsschema voor
 * Google. Wijzig ze daar en niet hier, anders geven de pagina en Google twee verschillende
 * antwoorden op dezelfde vraag. Bevestigd door Okan op 5 september 2026, naast het
 * Google-profiel van de kliniek gelegd. Er staat bewust bij dat de agenda actueler is dan
 * het rijtje: binnen openingstijden staat niet elk uur een therapeut vrij.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/contact",
  titel: "Contact en route",
  omschrijving: `Diba Clinics staat aan de ${DIBA_ADDRESS.street} in ${DIBA_SITE.neighborhood}, ${DIBA_ADDRESS.city}. Bellen, appen, mailen of je vraag stellen via het formulier.`,
});

/** De vier manieren die geen keuze vragen: ze staan er gewoon. */
const DIRECT = [
  {
    label: "Bellen",
    waarde: DIBA_TELEFOON,
    href: DIBA_TELEFOON_HREF,
    extern: false,
  },
  {
    label: "WhatsApp",
    waarde: "Stuur een bericht",
    href: DIBA_WHATSAPP_URL,
    extern: true,
  },
  {
    label: "E-mail",
    waarde: DIBA_EMAIL,
    href: `mailto:${DIBA_EMAIL}`,
    extern: false,
  },
  /* Rojda, 7 september 2026: de Instagram koppelen. Een bericht via Instagram is voor een
     deel van de klanten de gewone manier om een kliniek iets te vragen. */
  {
    label: "Instagram",
    waarde: "@dibaclinics",
    href: DIBA_INSTAGRAM_URL,
    extern: true,
  },
];

/* Voorlopige tekst: de reistijden en de lijnnummers horen door de kliniek bevestigd te
   worden voordat de site live gaat. [GEGEVEN-NODIG: route en parkeren, Okan] */
const ROUTE = [
  [
    "Met de auto",
    "Vanaf de A20 afslag Rotterdam-Centrum en dan noordwaarts via de Straatweg. Reken op een kwartier vanaf de ring, buiten de spits.",
  ],
  [
    "Parkeren",
    "Voor en achter de kliniek is ruim plek. Je hoeft dus niet eerst een rondje te rijden en je staat er vlak voor de deur.",
  ],
  [
    "Met het openbaar vervoer",
    "Station Rotterdam Noord ligt op ruim een kilometer, en vanaf Rotterdam Centraal rijden er trams en bussen richting Hillegersberg.",
  ],
  [
    "Op de fiets",
    "Vanuit het centrum ben je er in ongeveer twintig minuten. Stallen kan niet pal voor de deur; zet hem in de straat.",
  ],
] as const;

export default function ContactPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Contact", url: `${DIBA_SITE_URL}/contact` },
        ])}
      />

      {/* ── Hero: het adres en de vier manieren ── */}
      <section className="bg-[var(--g-700)] px-5 text-[var(--on-dark)] sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label diba-label-on-dark flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--on-dark-body)]">Contact</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[21ch]">
              Contact en <span className="diba-accent-on-dark">route</span>
            </h1>

            <address className="mt-7 text-[20px] leading-8 text-[var(--on-dark)] not-italic">
              {DIBA_ADDRESS.street}
              <br />
              {DIBA_ADDRESS.postalCode} {DIBA_ADDRESS.city}
            </address>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Bel ons, stuur een bericht of vul het formulier hieronder in. Wil
              je een afspraak maken, dan gaat de online agenda het snelst.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-6 text-[var(--t-strong)] sm:p-10">
            <Label>Direct</Label>
            <ul className="mt-5 space-y-1">
              {DIRECT.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    {...(r.extern
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="-mx-4 flex min-h-14 items-center justify-between gap-4 rounded-[var(--r-md)] px-4 transition-colors hover:bg-[var(--g-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                  >
                    <span className="diba-label text-[var(--t-label)]">
                      {r.label}
                    </span>
                    <span className="text-[16px] leading-6 font-medium text-[var(--t-strong)]">
                      {r.waarde}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-[var(--t-muted)]">
              Bellen kan tijdens onze{" "}
              <Link
                href="#openingstijden"
                className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                openingstijden
              </Link>
              , die staan hieronder.
            </p>
          </div>
        </div>
      </section>

      {/* ── Het formulier, met de openingstijden ernaast ──
          Hier stond een kop met een lege linkerkolom en de tijden rechts. Nu draagt die
          kolom het formulier: op deze pagina is dat de handeling, en de tijden zijn het
          antwoord op de vraag ernaast (Yasin, 10 september 2026). */}
      <section
        id="openingstijden"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-10 sm:px-9 sm:py-16 lg:px-[7.5vw] lg:py-24"
      >
        <div className="mx-auto">
          <Label>Contact</Label>
          <h2 className="diba-display-m mt-4">
            Stel je vraag <span className="diba-accent">of kom langs</span>
          </h2>

          <Reviewregel className="mt-6" keuze={3} />

          <div className="mt-8 grid gap-6 sm:mt-12 lg:grid-cols-2 lg:items-start lg:gap-10">
            <Contactformulier />

            <div className="rounded-[var(--r-lg)] bg-white p-6 sm:p-8">
              <p className="diba-card-title text-[var(--t-strong)]">
                Openingstijden
              </p>
              <ul className="mt-5">
                {DIBA_OPENINGSTIJDEN.map((d, i) => (
                  <li
                    key={d.dag}
                    className={`flex items-baseline justify-between gap-6 rounded-[var(--r-sm)] px-3 py-2.5 text-[16px] leading-6 sm:px-4 sm:py-3 ${
                      i % 2 === 1 ? "bg-[var(--g-025)]" : ""
                    }`}
                  >
                    <span className="text-[var(--t-strong)]">{d.label}</span>
                    <span
                      className={
                        d.van
                          ? "text-[var(--t-body)] tabular-nums"
                          : "text-[var(--t-muted)]"
                      }
                    >
                      {d.van ? `${d.van} tot ${d.tot}` : "Gesloten"}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[15px] leading-7 text-[var(--t-body)]">
                Binnen die tijden staat niet elk uur een therapeut vrij. Wat je
                in de agenda kunt aanklikken is wat er echt open is. Kom je
                liever langs zonder afspraak, bel dan eerst.
              </p>

              <Link
                href="/afspraak"
                className="diba-label mt-6 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                Bekijk de agenda
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Welke vraag bij welk kanaal ── */}
      <section className="px-5 py-10 sm:px-9 sm:py-16 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <Label>Waar je moet zijn</Label>
          <h2 className="diba-display-m mt-4">
            Bellen, appen <span className="diba-accent">of mailen?</span>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[17px] leading-8 text-[var(--t-body)]">
            Gaat het over je afspraak, dan is bellen het snelst: er kijkt meteen
            iemand met je mee in de agenda. Voor een vraag over een behandeling
            of de kosten is een bericht genoeg. Kies hieronder je vraag, dan zie
            je waar je die het beste stelt en hoe snel je antwoord hebt.
          </p>

          <div className="mt-8 sm:mt-10">
            <Ingangkiezer />
          </div>
        </div>
      </section>

      {/* ── Afzeggen, te laat, niet komen ──
          De twee grootste redenen dat iemand een contactpagina opzoekt: hij moet afzeggen
          of hij staat in de file. Het antwoord stond alleen in de algemene voorwaarden, in
          de u-vorm tussen de juridische tekst. Zelfde bron, hier in gewone taal. */}
      <section className="bg-[var(--g-050)] px-5 py-10 sm:px-9 sm:py-16 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <Label>Voordat je belt</Label>
          <h2 className="diba-display-m mt-4">
            Afzeggen, verzetten{" "}
            <span className="diba-accent">of te laat komen.</span>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[17px] leading-8 text-[var(--t-body)]">
            Bel je hierover, dan hoor je dit. Het staat hier zodat je vooraf
            weet wat het kost in plaats van achteraf.
          </p>

          <ul className="mt-8 grid gap-4 sm:mt-12 lg:grid-cols-2 lg:items-start">
            {SITUATIES.map((s) => (
              <li
                key={s.id}
                className="rounded-[var(--r-lg)] bg-white p-6 sm:p-8"
              >
                <p className="diba-card-title text-[var(--t-strong)]">
                  {s.kop}
                </p>
                <p className="mt-4 text-[16px] leading-7 text-[var(--t-body)]">
                  {s.gebeurt}
                </p>
                <div className="mt-5 rounded-[var(--r-sm)] bg-[var(--g-025)] p-4">
                  <p className="diba-label text-[var(--t-label)]">
                    Wat het kost
                  </p>
                  <p className="mt-1.5 text-[16px] leading-7 text-[var(--t-strong)]">
                    {s.kost}
                  </p>
                </div>
                <p className="mt-5 text-[15px] leading-7 text-[var(--t-muted)]">
                  {s.waarom}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-[70ch] text-[15px] leading-7 text-[var(--t-muted)]">
            Deze vier staan voluit in de{" "}
            <Link
              href="/algemene-voorwaarden"
              className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              algemene voorwaarden
            </Link>
            , samen met wat er gebeurt als wij moeten afzeggen.
          </p>
        </div>
      </section>

      {/* ── Route, met de kaart in de kolom die leeg stond ── */}
      <section className="px-5 py-10 sm:px-9 sm:py-16 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <Label>Route</Label>
          <h2 className="diba-display-m mt-4">
            Aan de <span className="diba-accent">Weissenbruchlaan.</span>
          </h2>

          {/* Geen `items-start` hier: de kaart hoort de hoogte van de kolom ernaast te
              volgen, anders staat er een halve kolom wit onder een postzegel. */}
          <div className="mt-8 grid gap-6 sm:mt-12 lg:grid-cols-2 lg:gap-10">
            <Kaart />

            <div>
              <p className="text-[17px] leading-8 text-[var(--t-body)]">
                De kliniek zit aan de noordkant van {DIBA_ADDRESS.city}, in een
                woonwijk. Rustig dus, en je parkeert in de straat in plaats van
                in een garage.
              </p>

              <dl className="mt-6 space-y-3">
                {ROUTE.map(([kop, zin]) => (
                  <div
                    key={kop}
                    className="rounded-[var(--r-md)] bg-white p-5 sm:p-6"
                  >
                    <dt className="diba-label text-[var(--t-label)]">{kop}</dt>
                    <dd className="mt-2 text-[16px] leading-7 text-[var(--t-body)]">
                      {zin}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  Open in Google Maps
                  <span aria-hidden="true">↗</span>
                </a>
                <Link
                  href="/intake"
                  className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                >
                  Plan meteen je huidconsult
                </Link>
              </div>
            </div>
          </div>

          {/* Waar je binnenkomt. Onderaan en niet bovenaan: eerst het adres, de tijden en
              de route, en dan pas het plaatje bij de plek. */}
          <BeeldVignet
            src="/images/shoot/ontvangst-koffie.jpg"
            alt="Een client krijgt koffie aangereikt bij binnenkomst in de kliniek"
            onderschrift="Bij binnenkomst"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="mt-10 aspect-[16/9] sm:mt-14 lg:aspect-[21/9]"
          />
        </div>
      </section>
    </main>
  );
}
