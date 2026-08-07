import type { Metadata } from "next";
import Link from "next/link";
import Ingangkiezer from "@/components/contact/Ingangkiezer";
import Label from "@/components/ui/Label";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_ADDRESS,
  DIBA_EMAIL,
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
 * Drie dingen, en geen van drieën een opmaakkwestie:
 *
 * 1. Telefoon en e-mail stonden als "[GEGEVEN-NODIG]" en waren daarmee leeg, terwijl ze
 *    allebei gewoon in `site.ts` staan en op dibaclinics.nl. Een contactpagina zonder
 *    telefoonnummer is geen contactpagina.
 * 2. "Tram 4 of 8 richting Kralingse Zoom." Kralingse Zoom ligt aan de andere kant van
 *    de stad; de kliniek staat in Hillegersberg. Dat is verzonnen reisadvies waar iemand
 *    naar handelt, dus het staat er niet meer. [GEGEVEN-NODIG: de route, Okan]
 * 3. "Behandeling Nul. Gratis, 4 minuten." Behandeling Nul is de meting in de kliniek en
 *    die staat op de prijslijst voor vijftig euro. Gratis en vier minuten is de online
 *    intake, en dat is iets anders. Die twee stonden op drie pagina's door elkaar.
 *    [BESLUIT-OKAN: hoe die twee heten, want nu heten ze allebei het begin]
 *
 * De signatuur van deze pagina is de ingangkiezer: welke vraag hoort bij welk kanaal, en
 * wat er via dat kanaal niet kan. Zie `Ingangkiezer.tsx`.
 *
 * Eén donkergroen vlak: het blok over wat er niet op afstand kan (§5).
 */

export const metadata: Metadata = {
  title: "Contact en route",
  description: `Diba Clinics staat aan de ${DIBA_ADDRESS.street} in ${DIBA_SITE.neighborhood}, ${DIBA_ADDRESS.city}. Bellen, appen of mailen: hier staat welke vraag waar thuishoort.`,
};

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

      {/* ── Hero: het adres, en meteen de drie manieren ── */}
      <section className="mx-auto max-w-[1800px] px-5 sm:px-9 lg:px-[7.5vw]">
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

            <h1 className="diba-display-l mt-6 max-w-[14ch]">
              {DIBA_SITE.neighborhood},
              <br />
              <span className="diba-accent">{DIBA_ADDRESS.city}.</span>
            </h1>

            <address className="mt-7 text-[20px] leading-8 not-italic text-[var(--t-strong)]">
              {DIBA_ADDRESS.street}
              <br />
              {DIBA_ADDRESS.postalCode} {DIBA_ADDRESS.city}
            </address>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              Je kunt bellen, appen, mailen of langskomen. Welke van die vier
              het snelst antwoord geeft hangt af van je vraag, en dat staat
              hieronder gewoon uitgeschreven.
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
                    className="-mx-4 flex min-h-14 items-center justify-between gap-4 rounded-[var(--r-md)] px-4 transition-colors hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
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

            <p className="mt-6 border-t border-[var(--g-050)] pt-5 text-[14px] leading-6 text-[var(--t-muted)]">
              Openingstijden staan hier nog niet. Bel of app gerust; dan hoor je
              meteen wanneer het uitkomt.
            </p>
          </div>
        </div>
      </section>

      {/* ── De ingangkiezer: de signatuur van deze pagina ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto max-w-[1800px]">
          <div className="max-w-[62ch]">
            <Label>Welke vraag, welk kanaal</Label>
            <h2 className="diba-display-m mt-4 max-w-[20ch]">
              Niet elk kanaal
              <br />
              <span className="diba-accent">past bij elke vraag.</span>
            </h2>
            <p className="mt-6 text-[17px] leading-8 text-[var(--t-body)]">
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

      {/* ── Wat er op afstand niet kan ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto max-w-[1800px]">
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

              <ul className="space-y-5">
                {NIET_OP_AFSTAND.map((n) => (
                  <li
                    key={n.kop}
                    className="border-b border-white/15 pb-5 last:border-b-0 last:pb-0"
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

      {/* ── Route ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid max-w-[1800px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
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
              De kliniek zit in {DIBA_SITE.neighborhood}, aan de noordkant van{" "}
              {DIBA_ADDRESS.city}. Wat de handigste route is met het openbaar
              vervoer en waar je het best parkeert, zetten we erbij zodra we het
              zeker weten. Liever niets dan een reisadvies dat niet klopt.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
              >
                Open in Google Maps
                <span aria-hidden="true">↗</span>
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
