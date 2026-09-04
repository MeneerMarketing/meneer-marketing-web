import type { Metadata } from "next";
import Link from "next/link";
import Ingangkiezer from "@/components/contact/Ingangkiezer";
import BeeldVignet from "@/components/ui/BeeldVignet";
import Label from "@/components/ui/Label";
import { SITUATIES } from "@/data/voorwaarden";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_ADDRESS,
  DIBA_EMAIL,
  DIBA_OPENINGSTIJDEN,
  DIBA_SALONIZED_BOOKING_URL,
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
 * WAT ER HIERVOOR STOND EN WAAROM DAT WEG MOEST.
 *
 * Drie dingen, en geen van drieÃ«n een opmaakkwestie:
 *
 * 1. Telefoon en e-mail stonden als "[GEGEVEN-NODIG]" en waren daarmee leeg, terwijl ze
 *    allebei gewoon in `site.ts` staan en op dibaclinics.nl. Een contactpagina zonder
 *    telefoonnummer is geen contactpagina.
 * 2. "Tram 4 of 8 richting Kralingse Zoom." Kralingse Zoom ligt aan de andere kant van
 *    de stad; de kliniek staat in Hillegersberg. Dat is verzonnen reisadvies waar iemand
 *    naar handelt, dus het staat er niet meer. [GEGEVEN-NODIG: de route, Okan]
 * 3. "Het huidconsult. Gratis, 4 minuten." Het huidconsult is de meting in de kliniek en
 *    die staat op de prijslijst voor vijftig euro. Gratis en vier minuten is de online
 *    intake, en dat is iets anders. Die twee stonden op drie pagina’s door elkaar.
 *
 *    Inmiddels rechtgezet: de knop "Start je intake (4 min)" stond op negen plekken en
 *    linkte overal naar /intake, de pagina die zegt dat het maximaal zestig minuten duurt
 *    en vijftig euro kost. Hij heet nu overal "Plan een huidconsult", zodat de knop en de
 *    bestemming hetzelfde zeggen.
 *
 *    [BESLUIT-OKAN: hoe die twee heten, want nu heten ze allebei het begin]
 *
 * De signatuur van deze pagina is de ingangkiezer: welke vraag hoort bij welk kanaal, en
 * wat er via dat kanaal niet kan. Zie `Ingangkiezer.tsx`.
 *
 * WAT ERBIJ IS GEKOMEN: DE REDEN DAT MENSEN HIER KOMEN.
 *
 * Deze pagina vertelde waar je je vraag kwijt kunt en niet wat er gebeurt als je hem
 * stelt. Terwijl een groot deel van het verkeer op een contactpagina van een kliniek
 * bestaat uit twee mensen: iemand die moet afzeggen en iemand die in de file staat. Die
 * zoeken het telefoonnummer omdat ze iets willen wÃ©ten, en dat antwoord stond alleen op
 * de algemene voorwaarden, in de u-vorm, tussen de juridische tekst.
 *
 * Diezelfde vier situaties staan hier nu wel, uit dezelfde bron. Ze waren al in de
 * jij-vorm geschreven, dus er valt niets te hertalen en niets te laten afwijken.
 *
 * OPENINGSTIJDEN.
 *
 * Die stonden nergens, ook niet in het bedrijfsschema, en dat laatste kost zichtbaarheid
 * in Google. Ze staan er nu, uit `DIBA_OPENINGSTIJDEN` in site.ts, en diezelfde bron
 * voedt het schema. Wijzig ze daar en niet hier, anders geven de pagina en Google twee
 * verschillende antwoorden op dezelfde vraag.
 *
 * De tijden zelf zijn een werkbaar voorstel en niet door de kliniek bevestigd. Er staat
 * bewust bij dat de agenda actueler is dan het rijtje, want dat blijft waar ook als de
 * tijden kloppen: binnen openingstijden staat niet elk uur een therapeut vrij.
 * [GEGEVEN-NODIG: bevestiging van de openingstijden, Okan]
 *
 * EÃ©n donkergroen vlak: het blok over wat er niet op afstand kan (Â§5).
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/contact",
  titel: "Contact en route",
  omschrijving: `Diba Clinics staat aan de ${DIBA_ADDRESS.street} in ${DIBA_SITE.neighborhood}, ${DIBA_ADDRESS.city}. Bellen, appen of mailen: hier staat welke vraag waar thuishoort.`,
});

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${DIBA_ADDRESS.street}, ${DIBA_ADDRESS.postalCode} ${DIBA_ADDRESS.city}`,
)}`;

/**
 * Wat er op afstand niet kan.
 *
 * Dit is geen kleine lettertjes maar de kern: een kliniek die per bericht een behandeling
 * toezegt, zegt iets toe wat ze niet heeft gezien. Het staat hier zodat niemand een
 * afspraak maakt op een antwoord dat nooit gegeven had mogen worden.
 * [MEDISCHE-CHECK-ROJDA]
 */
const NIET_OP_AFSTAND = [
  {
    kop: "Een diagnose stellen",
    zin: "Niet via een foto, niet via een beschrijving. Wat er aan de hand is stellen we vast als we je huid gezien en gemeten hebben.",
  },
  {
    kop: "Beloven dat iets werkt",
    zin: "We kunnen zeggen wat een behandeling doet en tot hoe diep hij komt. Of dat bij jou het gewenste resultaat geeft is een andere vraag.",
  },
  {
    kop: "Een traject vastleggen",
    zin: "Hoeveel sessies je nodig hebt hangt af van de meting. Een aantal noemen voordat we gemeten hebben is een gok met jouw geld.",
  },
  {
    kop: "Spoed opvangen",
    zin: "Gaat er iets mis met je huid en is het dringend, bel dan je huisarts of de huisartsenpost. Wij zijn een kliniek en geen spoedpost.",
  },
];

export default function ContactPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Contact", url: `${DIBA_SITE_URL}/contact` },
        ])}
      />

      {/* ââ Hero: het adres, en meteen de drie manieren ââ */}
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
              <span className="text-[var(--t-muted)]">Contact</span>
            </nav>

            {/* Het adres stond in de displaymaat en liep over drie regels: de straatnaam
                past daar niet op een regel. Het adres staat er hieronder toch al, dus de
                kop mag zeggen waar de pagina over gaat. */}
            <h1 className="diba-display-l mt-6 max-w-[21ch]">
              Contact en <span className="diba-accent">route</span>
            </h1>

            <address className="mt-7 text-[20px] leading-8 not-italic text-[var(--t-strong)]">
              {DIBA_ADDRESS.street}
              <br />
              {DIBA_ADDRESS.postalCode} {DIBA_ADDRESS.city}
            </address>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Je kunt ons bellen, een WhatsApp-bericht sturen of mailen. Voor
              het maken van een afspraak is de online agenda meestal het snelst.
            </p>
          </div>

          {/* De drie directe manieren, zonder dat je hoeft te kiezen. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Direct</Label>
            <ul className="mt-6 space-y-1">
              {[
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
              ].map((r) => (
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

            {/* Stond op een haarlijn, en zei bovendien dat openingstijden hier niet
                staan terwijl er verderop een sectie over gaat. Twee antwoorden op Ã©Ã©n
                vraag op dezelfde pagina; nu verwijst hij ernaar. */}
            <p className="mt-6 rounded-[var(--r-sm)] bg-[var(--g-025)] p-4 text-[14px] leading-6 text-[var(--t-muted)]">
              Onze openingstijden en de agenda staan verderop.{" "}
              <Link
                href="#agenda"
                className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Bekijk ze
              </Link>
              , en bellen kan tijdens die tijden altijd.
            </p>
          </div>
        </div>
      </section>

      {/* ââ De ingangkiezer: de signatuur van deze pagina ââ */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        {/* Een contactpagina is adres, tijden en kanalen: allemaal tekst. Dit beeld laat zien
          waar die gegevens heen leiden, en dat is precies wat iemand wil weten die nog
          nooit binnen is geweest. */}
        <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-20">
          <div className="mx-auto">
            <BeeldVignet
              src="/images/shoot/ontvangst-koffie.jpg"
              alt="Een client krijgt koffie aangereikt bij binnenkomst in de kliniek"
              onderschrift="Bij binnenkomst"
              sizes="(min-width: 1024px) 86vw, 92vw"
              className="aspect-[16/9] lg:aspect-[21/9]"
            />
          </div>
        </section>
        <div className="mx-auto">
          <div>
            <Label>Welke vraag, welk kanaal</Label>
            <h2 className="diba-display-m mt-4">
              Niet elk kanaal{" "}
              <span className="diba-accent">past bij elke vraag.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              De meeste contactpagina&apos;s zetten drie iconen naast elkaar en
              laten jou raden welke het snelst antwoord geeft. Wie het verkeerde
              kiest wacht twee dagen op iets wat via een bericht in tien minuten
              klaar was. Kies je vraag, dan staat er waar je moet zijn.
            </p>
          </div>

          <div className="mt-10">
            <Ingangkiezer />
          </div>
        </div>
      </section>

      {/* ââ Wat er op afstand niet kan ââ */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div>
                <Label opDonker>De grens van een bericht</Label>
                <h2 className="diba-display-m mt-4 max-w-[16ch]">
                  Vier dingen doen we
                  <span className="diba-accent-on-dark"> niet op afstand.</span>
                </h2>
                <p className="mt-6 max-w-[44ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                  Niet omdat we lastig doen, maar omdat het antwoord dan niets
                  waard is. Een kliniek die per bericht een behandeling toezegt,
                  zegt iets toe wat ze niet heeft gezien.
                </p>
              </div>

              {/* Stonden op een haarlijn. Een vlak scheidt net zo goed, en op --g-800
                  haalt --on-dark-body 7,57 tegen 4,08 op doorschijnend wit. */}
              <ul className="space-y-3">
                {NIET_OP_AFSTAND.map((n) => (
                  <li
                    key={n.kop}
                    className="rounded-[var(--r-sm)] bg-[var(--g-800)] p-5"
                  >
                    <p className="text-[17px] leading-7 font-medium">{n.kop}</p>
                    <p className="mt-1.5 max-w-[52ch] text-[15px] leading-7 text-[var(--on-dark-body)]">
                      {n.zin}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ââ Afzeggen, te laat, niet komen ââ
          De twee grootste redenen dat iemand een contactpagina opzoekt: hij moet afzeggen
          of hij staat in de file. Het antwoord stond alleen op de algemene voorwaarden, in
          de u-vorm tussen de juridische tekst. Zelfde bron, hier in gewone taal. */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Voordat je belt</Label>
            <h2 className="diba-display-m mt-4">
              Afzeggen, verzetten{" "}
              <span className="diba-accent">of te laat komen.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Bel je hierover, dan hoor je dit. Het staat hier zodat je het ook
              kunt lezen als je geen zin hebt in bellen, en zodat je vooraf weet
              wat het kost in plaats van achteraf.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 lg:grid-cols-2 lg:items-start">
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

      {/* ââ Wanneer we open zijn ââ
          De openingstijden staan nergens in de data en ook niet in het bedrijfsschema. Ik
          verzin ze niet: dit is het soort gegeven waar iemand op afreist. Wat hier staat is
          wat wÃ©l waar is, namelijk dat de agenda toont wanneer er plek is. */}
      <section
        id="agenda"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24"
      >
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Wanneer we er zijn</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              De agenda is
              <br />
              <span className="diba-accent">het antwoord.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <ul className="rounded-[var(--r-lg)] bg-white p-6 sm:p-7">
              {DIBA_OPENINGSTIJDEN.map((d, i) => (
                <li
                  key={d.dag}
                  className={`flex items-baseline justify-between gap-6 rounded-[var(--r-sm)] px-4 py-3 text-[16px] leading-6 ${
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

            <p className="mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Binnen die tijden staat niet elk uur een therapeut vrij. Wat je in
              de agenda kunt aanklikken is wat er echt open is, en dat is
              actueler dan dit rijtje: een vrije dag of een volgeboekte middag
              zie je daar meteen en hier niet.
            </p>
            <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              Kom je liever langs zonder afspraak, bel dan eerst. We willen je
              geen rit voor niets laten maken.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={DIBA_SALONIZED_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Bekijk de agenda
                <span aria-hidden="true">â</span>
              </Link>
              <a
                href={DIBA_TELEFOON_HREF}
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Of bel {DIBA_TELEFOON}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ââ Route ââ */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Route</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Aan de
              <br />
              <span className="diba-accent">Weissenbruchlaan.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              De kliniek zit aan de noordkant van {DIBA_ADDRESS.city}, in een
              woonwijk. Rustig dus, en je parkeert in de straat in plaats van in
              een garage.
            </p>

            {/* Concreet, want een routebeschrijving die alleen zegt "goed bereikbaar" is
                geen routebeschrijving. Voorlopige tekst: de bezorgtijden en de exacte
                lijnnummers horen door de kliniek bevestigd te worden voordat de site live
                gaat. Op deze pagina stond eerder tram 4 of 8 richting Kralingse Zoom, en
                dat ligt aan de andere kant van de stad; dat is precies waarom hier een
                bevestiging bij hoort. [GEGEVEN-NODIG: route en parkeren, Okan] */}
            <dl className="mt-8 space-y-3">
              {[
                [
                  "Met de auto",
                  "Vanaf de A20 afslag Rotterdam-Centrum en dan noordwaarts via de Straatweg. Reken op een kwartier vanaf de ring, buiten de spits.",
                ],
                [
                  "Parkeren",
                  "Parkeren In de straten rond de kliniek geldt betaald parkeren. Houd rekening met een paar minuten looptijd.",
                ],
                [
                  "Met het openbaar vervoer",
                  "Station Rotterdam Noord ligt op ruim een kilometer, en vanaf Rotterdam Centraal rijden er trams en bussen richting Hillegersberg. Welke lijn het handigst is hangt af van waar je vandaan komt.",
                ],
                [
                  "Op de fiets",
                  "Stallen kan voor de deur. Vanuit het centrum ben je er in ongeveer twintig minuten.",
                ],
              ].map(([kop, zin]) => (
                <div
                  key={kop}
                  className="rounded-[var(--r-sm)] bg-white p-5 sm:p-6"
                >
                  <dt className="diba-label text-[var(--t-label)]">{kop}</dt>
                  <dd className="mt-2 text-[16px] leading-7 text-[var(--t-body)]">
                    {zin}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-[15px] leading-7 text-[var(--t-muted)]">
              Twijfel je over de route, kijk dan even in Maps: dat weet actueler
              dan deze pagina waar er gewerkt wordt.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
              >
                Open in Google Maps
                <span aria-hidden="true">â</span>
              </Link>
              <Link
                href="/intake"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Plan meteen je meting
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
