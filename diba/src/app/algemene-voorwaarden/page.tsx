import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/ui/Label";
import { AFSPRAKEN, SITUATIES, VAST } from "@/data/voorwaarden";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_NAP,
  DIBA_SITE_URL,
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Algemene voorwaarden.
 *
 * WAT HIER STOND.
 *
 * Vijf kopjes met daaronder alleen `[COPY-NODIG]`: annuleringsvoorwaarden, no-showbeleid,
 * betalingsvoorwaarden, medische disclaimer, aansprakelijkheid. Elke inhoudelijke bepaling
 * ontbrak.
 *
 * DE VORM: SITUATIES IN PLAATS VAN ARTIKELEN.
 *
 * Niemand leest "Artikel 4: Annulering", en dat is niet erg zolang er niets aan de hand is.
 * Maar de enige momenten waarop iemand op deze pagina komt zijn precies de momenten waarop
 * er wél iets aan de hand is: je moet afzeggen, je bent te laat, je hebt een rekening
 * gekregen die je niet verwachtte. Dus staan de situaties centraal, met bij elke situatie
 * wat er gebeurt, wat het kost en waarom die regel er is. Die laatste onderscheidt een
 * voorwaarde van een boete.
 *
 * DE GETALLEN ZIJN EEN VOORSTEL EN GEEN VASTSTELLING.
 *
 * Termijnen en bedragen zijn afspraken tussen de kliniek en de klant. Wat er nu staat zijn
 * gangbare waarden, in constanten in `voorwaarden.ts`: één plek wijzigen en de pagina volgt.
 * [BESLUIT-OKAN] elk van die waarden, want ze zijn bindend zodra de site live staat.
 *
 * WAT ER MET OPZET ONTBREEKT.
 *
 * Een aansprakelijkheidsparagraaf. Dat is juridisch werk waar een verkeerd woord geld kost,
 * en het hoort van een jurist te komen. Liever een pagina die iets niet behandelt dan een
 * pagina die er iets over beweert dat niet klopt. Het staat er ook zo op het scherm, want
 * een lezer die die paragraaf zoekt hoort te weten dat hij er nog niet is.
 *
 * Hier stond eerst "u", omdat een juridische tekst er zo uitziet. Dat liet de toon precies
 * omslaan waar iemand wil weten wat er met zijn gegevens gebeurt. De stijlgids kent hier
 * geen uitzondering, dus staat er nu "je", zoals op de rest van de site.
 *
 * Eén donkergroen vlak: wat altijd geldt (§5).
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/algemene-voorwaarden",
  titel: "Algemene voorwaarden",
  omschrijving:
    "Wat er gebeurt als je afzegt, te laat bent, of als een behandeling niet door kan gaan. Per situatie wat het kost en waarom de regel er is.",
  extra: {
    robots: { index: true, follow: true },
  },
});

export default function VoorwaardenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          {
            name: "Algemene voorwaarden",
            url: `${DIBA_SITE_URL}/algemene-voorwaarden`,
          },
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
              <span className="text-[var(--t-muted)]">
                Algemene voorwaarden
              </span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              De afspraken die
              <br />
              <span className="diba-accent">voor iedereen gelden</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Je komt hier waarschijnlijk omdat er iets aan de hand is. Je moet
              afzeggen, je bent te laat, of je hebt een bedrag gezien dat je
              niet verwachtte. Daarom staan hieronder situaties en geen
              artikelen.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Bij elke situatie staat wat het kost en waarom de regel er is. Dat
              laatste is het verschil tussen een voorwaarde en een boete.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>De korte versie</Label>
            <p className="mt-5 text-[19px] leading-8 text-[var(--t-body)]">
              Tot {AFSPRAKEN.annulerenUren} uur van tevoren afzeggen kost je
              niets, en je hoeft geen reden te geven.
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
              Daarna wordt een deel van het tarief in rekening gebracht, omdat
              de plek dan niet meer op te vullen is. Alle andere regels op deze
              pagina zijn varianten op die ene.
            </p>
          </div>
        </div>
      </section>

      {/* ── De situaties ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Acht situaties</Label>
            <h2 className="diba-display-m mt-4">
              Wat een behandeling <span className="diba-accent">kost</span>
            </h2>
          </div>

          <ul className="mt-10 space-y-4">
            {SITUATIES.map((s) => (
              <li
                key={s.id}
                className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9 lg:p-11"
              >
                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
                  <div>
                    <p className="text-[26px] leading-[1.1] font-normal tracking-[-.04em] text-balance sm:text-[30px]">
                      {s.kop}
                    </p>
                    <p className="mt-4 max-w-[42ch] text-[15px] leading-7 text-[var(--t-body)]">
                      {s.gebeurt}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[var(--r-md)] bg-[var(--g-200)] p-6">
                      <p className="diba-label text-[var(--g-900)]">
                        Wat het kost
                      </p>
                      <p className="mt-3 text-[15px] leading-7 text-[var(--g-900)]">
                        {s.kost}
                      </p>
                    </div>
                    <div className="rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
                      <p className="diba-label text-[var(--t-label)]">
                        Waarom deze regel
                      </p>
                      <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                        {s.waarom}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Wat altijd geldt ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="max-w-[62ch]">
              <Label opDonker>Wat altijd geldt</Label>
              <h2 className="diba-display-m mt-4 max-w-[20ch]">
                Drie dingen die{" "}
                <span className="diba-accent-on-dark"> nooit veranderen.</span>
              </h2>
              <p className="mt-6 text-[16px] leading-7 text-[var(--on-dark-body)]">
                Dit zijn geen bepalingen maar toezeggingen. Ze staan hier zodat
                ze ook meetellen wanneer je de voorwaarden erbij pakt.
              </p>
            </div>

            <ul className="mt-12 grid gap-4 md:grid-cols-3">
              {VAST.map((v) => (
                <li
                  key={v.kop}
                  className="rounded-[var(--r-lg)] bg-white/10 p-7 sm:p-8"
                >
                  <p className="text-[18px] leading-7 font-medium">{v.kop}</p>
                  <p className="mt-3 text-[15px] leading-7 text-[var(--on-dark-body)]">
                    {v.zin}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Wat hier nog niet staat ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Eerlijk over de gaten</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Wat hier
              <br />
              <span className="diba-accent">nog niet staat.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Een paragraaf over aansprakelijkheid. Die formulering is juridisch
              werk en hoort van een jurist te komen, niet van ons. Zolang hij er
              niet staat, doen we er ook geen halve uitspraak over: dan weet je
              tenminste dat hij ontbreekt in plaats van dat je iets leest waar
              je niets aan heeft.
            </p>
            <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              Ook de termijnen en bedragen op deze pagina zijn in deze versie
              nog een voorstel. Wat er bij je afspraak is afgesproken en op je
              bevestiging staat, gaat voor op wat hier staat.
            </p>
            <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              Heb je een vraag over deze voorwaarden, stel hem dan gewoon.{" "}
              {DIBA_NAP.name} is bereikbaar op {DIBA_TELEFOON} en via WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={DIBA_TELEFOON_HREF}
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Bel {DIBA_TELEFOON}
              </a>
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Of stuur een bericht
              </a>
            </div>
            <p className="mt-8 text-[14px] leading-6 text-[var(--t-muted)]">
              Zie ook het{" "}
              <Link
                href="/privacybeleid"
                className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                privacybeleid
              </Link>{" "}
              en het{" "}
              <Link
                href="/cookiebeleid"
                className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                cookiebeleid
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
