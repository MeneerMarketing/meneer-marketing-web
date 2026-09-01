import type { Metadata } from "next";
import Link from "next/link";
import Toestemmingschakelaar from "@/components/consent/Toestemmingschakelaar";
import Label from "@/components/ui/Label";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE, DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";

/**
 * Cookiebeleid.
 *
 * WAT ER MIS WAS, EN DAT WAS MEER DAN COPY.
 *
 * De tekst beschreef netjes dat analytische cookies pas na akkoord laden. Dat klopte ook:
 * `Analytics.tsx` kijkt naar de toestemming voordat het iets inlaadt. Maar de balk had
 * alleen een akkoordknop, en de link ernaast heette "Instellingen" terwijl deze pagina geen
 * enkele instelling had. Weigeren kon dus niet, en voor wie niets deed kwam de balk elk
 * bezoek terug tot hij ja zei.
 *
 * En dan de zin die het hardst wrong: "Wilt u uw keuze wijzigen? Wis de sitegegevens van
 * dibaclinics.nl in uw browser." Dat is geen intrekmogelijkheid maar een omweg die niemand
 * loopt, en het maakte een gegeven toestemming in de praktijk definitief.
 *
 * Toestemming is alleen iets waard als nee zeggen net zo makkelijk is als ja zeggen, en als
 * je het daarna kunt intrekken. Allebei bestaan nu: twee gelijkwaardige knoppen op de balk,
 * en bovenaan deze pagina een schakelaar die je stand laat zien en omzet.
 *
 * WAAROM HIER TOCH "JE" STAAT.
 *
 * Deze pagina zei eerst "u", omdat een juridische tekst er nu eenmaal zo uitziet. Het
 * gevolg was dat de toon precies omsloeg op het moment dat iemand wil weten wat er met
 * zijn gegevens gebeurt, en dat is de verkeerde plek om afstandelijk te worden. De
 * stijlgids kent hier geen uitzondering, dus die is eruit.
 *
 * De verwijzerspagina houdt wel "u". Die richt zich op huisartsen en dermatologen, en
 * daar is het geen afstand maar de gangbare vorm tussen professionals.
 *
 * [BESLUIT-OKAN] het e-mailadres voor privacyvragen. Zolang dat er niet is, wijst de pagina
 * naar WhatsApp en dat staat er dan ook zo.
 */

export const metadata: Metadata = {
  title: "Cookiebeleid",
  description:
    "Welke cookies Diba Clinics gebruikt, wanneer ze laden en hoe je je keuze op elk moment kunt wijzigen. Geen advertentie-tracking.",
  robots: { index: true, follow: true },
};

const COOKIES = [
  {
    soort: "Noodzakelijk",
    altijd: true,
    wat: "Nodig om de site te laten werken. Hieronder valt het onthouden van de keuze die je op de cookiebalk maakt, want zonder dat zou de vraag bij elk bezoek terugkomen.",
    wanneer:
      "Altijd. Hier is geen toestemming voor nodig en er valt niets te weigeren.",
  },
  {
    soort: "Anonieme statistieken",
    altijd: false,
    wat: "Google Analytics 4, met een verkort IP-adres, en Microsoft Clarity. Daarmee zien we welke pagina's mensen helpen en waar ze vastlopen. Er worden geen advertentieprofielen opgebouwd en er wordt niets doorverkocht.",
    wanneer:
      "Alleen na je akkoord. Zolang dat er niet is, worden deze scripts niet ingeladen; ze staan dus niet uit maar zijn er niet.",
  },
] as const;

export default function CookiePage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Cookiebeleid", url: `${DIBA_SITE_URL}/cookiebeleid` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Cookiebeleid</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              Welke cookies
              <br />
              <span className="diba-accent">we gebruiken</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              De ene soort is nodig om de site te laten werken. De andere is
              anonieme statistiek, en die laadt alleen als je daar akkoord voor
              geeft. Advertentie-tracking staat er niet op.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Je keuze kun je op elk moment wijzigen, hiernaast. Niet door
              browsergegevens te wissen, gewoon met een knop.
            </p>
          </div>

          {/* De schakelaar staat bovenaan, want dat is waar mensen voor komen. */}
          <div className="flex flex-col justify-center">
            <Toestemmingschakelaar />
          </div>
        </div>
      </section>

      {/* ── De twee soorten ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Wat er precies staat</Label>
            <h2 className="diba-display-m mt-4">
              Welke cookies <span className="diba-accent">we gebruiken</span>
            </h2>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {COOKIES.map((c) => (
              <li
                key={c.soort}
                className="flex flex-col rounded-[var(--r-lg)] bg-white p-7 sm:p-9"
              >
                <p className="diba-label text-[var(--t-label)]">
                  {c.altijd ? "Altijd aan" : "Alleen met akkoord"}
                </p>
                <p className="diba-card-title mt-3 text-[var(--t-strong)]">
                  {c.soort}
                </p>
                <p className="mt-4 flex-1 text-[15px] leading-7 text-[var(--t-body)]">
                  {c.wat}
                </p>
                <p className="mt-5 rounded-[var(--r-md)] bg-[var(--g-050)] p-5 text-[15px] leading-7 text-[var(--t-body)]">
                  <span className="diba-label block text-[var(--t-label)]">
                    Wanneer
                  </span>
                  <span className="mt-2 block">{c.wanneer}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Hoe het werkt ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Hoe je keuze bewaard wordt</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Per browser,
              <br />
              <span className="diba-accent">op dit apparaat.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Je keuze wordt lokaal in deze browser opgeslagen en gaat niet mee
              naar onze servers. Gebruik je een ander apparaat of een andere
              browser, dan wordt de vraag daar opnieuw gesteld, want daar weten
              we het antwoord niet.
            </p>
            <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              Weiger je, dan verdwijnt de balk ook. Een balk die blijft
              terugkomen tot je ja zegt is geen keuze maar aandrang.
            </p>
            <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              Trek je je toestemming later in, dan stopt het laden vanaf dat
              moment. Wat er in de sessies daarvoor gemeten is, blijft bij die
              diensten staan; wil je dat ook verwijderd hebben, neem dan contact
              op.
            </p>
          </div>
        </div>
      </section>

      {/* ── Vragen ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Vragen hierover</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Stel ze
              <br />
              <span className="diba-accent">gewoon.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Heb je een vraag over wat er van je wordt vastgelegd, of wil je
              gegevens laten verwijderen, stuur dan een bericht. In het
              privacybeleid staat wat er verder met persoonsgegevens gebeurt en
              welke rechten je hebt.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Stuur een bericht
              </a>
              <Link
                href="/privacybeleid"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Naar het privacybeleid
              </Link>
            </div>
            <p className="mt-8 text-[14px] leading-6 text-[var(--t-muted)]">
              Dit beleid gaat over {DIBA_SITE.domain}.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
