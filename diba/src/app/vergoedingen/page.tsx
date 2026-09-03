import type { Metadata } from "next";
import Link from "next/link";
import { FigmaCheckIcon } from "@/components/figma/FigmaTemplateUi";
import Label from "@/components/ui/Label";
import { INSURERS } from "@/data/insurers";
import { MISVERSTANDEN, ONZE_ROL, ROUTE } from "@/data/vergoeding-route";
import { ERKENNINGEN } from "@/data/team";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";
import BeeldVignet from "@/components/ui/BeeldVignet";
import { zoekmachineVelden } from "@/lib/seo";
import VerzekeraarLogo from "@/components/vergoedingen/VerzekeraarLogo";

/**
 * Vergoedingen.
 *
 * WAT HIER STOND EN WAAROM DAT DE VERKEERDE VOLGORDE WAS.
 *
 * Een raster met verzekeraarsnamen en twee algemene zinnen. Dat suggereert dat de naam van
 * je verzekeraar de vraag beantwoordt. Dat is niet zo: voor het overgrote deel van wat hier
 * gedaan wordt is het antwoord hetzelfde bij elke verzekeraar, namelijk niets, omdat
 * cosmetische zorg buiten het stelsel valt. De vraag die er wél toe doet komt eerder en
 * gaat niet over de behandeling maar over de klacht.
 *
 * Dus is de pagina een route geworden: drie vragen, en bij elke vraag staat wat er gebeurt
 * als het antwoord nee is. Die nee-tak is het echte nieuws en die ontbreekt normaal.
 *
 * WAAROM ER GEEN BEDRAGEN EN GEEN PAKKETNAMEN STAAN.
 *
 * Voorwaarden en maxima veranderen per jaar en per pakket. Een bedrag op een website is
 * binnen twaalf maanden onjuist, en bij geld is onjuist erger dan afwezig. Het mechaniek
 * verandert niet, dus dat staat er wel.
 *
 * DE MISVERSTANDEN ZIJN GEEN BIJZAAK.
 *
 * De eerste scheelt letterlijk geld: vergoeding uit een aanvullende verzekering gaat niet
 * van je eigen risico af. Mensen stellen behandeling uit omdat ze denken van wel.
 *
 * Ook opgeruimd: de hardgecodeerde hex (var(--g-900), var(--g-300), var(--g-700)) en de hover-rand met
 * schaduw. Kaarten in deze huisstijl zijn vlakken zonder lijn.
 *
 * [BESLUIT-OKAN] of de losse verzekeraarspagina's blijven. Ze staan er nog en linken door,
 * maar zonder actuele voorwaarden wekken ze de indruk dat wij het antwoord hebben.
 *
 * Eén donkergroen vlak: wat wij wel en niet doen (§5).
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/vergoedingen",
  titel: "Vergoedingen",
  omschrijving:
    "Is er een medische reden voor je klacht, dan is er een route naar vergoeding. Drie vragen op volgorde, en bij elke vraag waar je aan toe bent.",
});

export default function VergoedingenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Vergoedingen", url: `${DIBA_SITE_URL}/vergoedingen` },
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
              <span className="text-[var(--t-muted)]">Vergoedingen</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              Vergoeding door
              <br />
              <span className="diba-accent">je zorgverzekeraar</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Is er een medische reden voor je klacht, dan is er een route.
              Huidtherapie zit bij de meeste verzekeraars in het aanvullende
              pakket, en dan gaat het verder over jouw polis: welk pakket je
              hebt, welk maximum eraan hangt en of je huisarts een verwijzing
              moet schrijven.
            </p>

            {/* Rojda: "Ik zie juist al onze sterke punten niet terug." Dit is er een van,
                en op deze pagina is het geen keurmerkplaatje maar het antwoord op de vraag
                die iemand hier komt stellen: mag ik hierheen met mijn polis. */}
            <ul className="mt-8 space-y-3">
              {ERKENNINGEN.map((e) => (
                <li key={e.naam} className="flex gap-3">
                  <FigmaCheckIcon />
                  <span className="max-w-[48ch]">
                    <strong className="block text-[16px] font-medium leading-7 text-[var(--t-strong)]">
                      {e.naam}
                    </strong>
                    <span className="mt-0.5 block text-[15px] leading-7 text-[var(--t-body)]">
                      {e.zin}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Waar je het bedrag vindt</Label>
            <p className="mt-5 text-[19px] leading-8 text-[var(--t-body)]">
              Voorwaarden en maxima veranderen per jaar en per pakket.
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
              Jouw actuele bedrag staat dus in je eigen polis, en daar klopt het
              ook echt. Wat op deze pagina staat is hoe het werkt, en dat blijft
              van jaar tot jaar hetzelfde.
            </p>
          </div>
        </div>
      </section>

      {/* ── De route: drie vragen ── */}
      {/* Een pagina over vergoeding gaat over papier en polissen. Dit is de plek waar het
          gesprek daarover werkelijk plaatsvindt. */}
      <section className="px-5 pb-14 sm:px-9 lg:px-[7.5vw] lg:pb-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/balie-ontvangst.jpg"
            alt="De balie van Diba Clinics met het productschap op de achtergrond"
            onderschrift="Aan de balie, na afloop"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/9] lg:aspect-[21/9]"
          />
        </div>
      </section>

      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Drie vragen, op volgorde</Label>
            <h2 className="diba-display-m mt-4">
              Zo loopt de route <span className="diba-accent">naar ja.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Bij elke vraag staat waar je aan toe bent, ook als het antwoord de
              andere kant op valt. Die helft laten de meeste sites weg, en dat
              is precies de helft waar je iets aan hebt.
            </p>
          </div>

          <ol className="mt-10 space-y-4">
            {ROUTE.map((s) => (
              <li
                key={s.vraag}
                className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9 lg:p-11"
              >
                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
                  <div>
                    <p className="diba-label text-[var(--t-label)]">{s.stap}</p>
                    <p className="mt-4 text-[28px] leading-[1.08] font-normal tracking-[-.04em] text-balance sm:text-[32px]">
                      {s.vraag}
                    </p>
                    <p className="mt-5 max-w-[42ch] text-[15px] leading-7 text-[var(--t-muted)]">
                      {s.zin}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[var(--r-md)] bg-[var(--g-200)] p-6">
                      <p className="diba-label text-[var(--g-900)]">Bij ja</p>
                      <p className="mt-3 text-[15px] leading-7 text-[var(--g-900)]">
                        {s.nee}
                      </p>
                    </div>
                    <div className="rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
                      <p className="diba-label text-[var(--t-label)]">
                        Bij nee
                      </p>
                      <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                        {s.ja}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Wat wij wel en niet doen ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <div>
                <Label opDonker>Wie staat waarvoor aan de lat</Label>
                <h2 className="diba-display-m mt-4 max-w-[16ch]">
                  Samen krijg je het
                  <span className="diba-accent-on-dark"> rond.</span>
                </h2>
                <p className="mt-6 max-w-[44ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                  Een vergoeding komt rond als beide kanten hun deel doen. Hier
                  staat welk deel van ons is en welk deel van jou, zodat je het
                  vooraf weet en niet pas als de rekening er ligt.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[var(--r-md)] bg-white/10 p-6 sm:p-7">
                  <p className="diba-label diba-label-on-dark">Dit doen wij</p>
                  <ul className="mt-4 space-y-3">
                    {ONZE_ROL.wel.map((r) => (
                      <li
                        key={r}
                        className="text-[15px] leading-7 text-[var(--on-dark-body)]"
                      >
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[var(--r-md)] bg-white/10 p-6 sm:p-7">
                  <p className="diba-label diba-label-on-dark">Dit doe jij</p>
                  <ul className="mt-4 space-y-3">
                    {ONZE_ROL.jij.map((r) => (
                      /* Zelfde kleur als de linkerkolom. Het accentgroen zat hier omdat dit
                         de niet-lijst was en dus apart moest springen; nu zijn het twee
                         helften van dezelfde taak en horen ze er gelijk uit te zien. Het
                         scheelt ook contrast: 5,14 om 4,55 op dit vlak. */
                      <li
                        key={r}
                        className="text-[15px] leading-7 text-[var(--on-dark-body)]"
                      >
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Misverstanden ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Vier misverstanden</Label>
            <h2 className="diba-display-m mt-4">
              De eerste <span className="diba-accent">scheelt geld.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Mensen stellen behandeling uit op grond van iets wat niet klopt.
              Daarom staat die bovenaan.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {MISVERSTANDEN.map((m, i) => (
              <li
                key={m.kop}
                className={`rounded-[var(--r-lg)] p-7 sm:p-8 ${i === 0 ? "bg-[var(--g-200)]" : "bg-white"}`}
              >
                <p
                  className={`diba-label ${i === 0 ? "text-[var(--g-900)]" : "text-[var(--t-label)]"}`}
                >
                  Wat mensen denken
                </p>
                <p
                  className={`diba-card-title mt-3 ${i === 0 ? "text-[var(--g-900)]" : "text-[var(--t-strong)]"}`}
                >
                  {m.kop}
                </p>
                <p
                  className={`mt-4 text-[15px] leading-7 ${i === 0 ? "text-[var(--g-900)]" : "text-[var(--t-body)]"}`}
                >
                  {m.zin}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── De verzekeraars, nu op de juiste plek: als laatste ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Pas nu je verzekeraar</Label>
            <h2 className="diba-display-m mt-4">
              Kwam je door{" "}
              <span className="diba-accent">alle drie de vragen?</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Dan is dit het moment om je eigen polis erbij te pakken. Deze
              pagina&apos;s wijzen je naar de plek waar jouw voorwaarden staan;
              wat er precies in jouw pakket zit, zie je alleen daar.
            </p>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INSURERS.map((v) => (
              <li key={v.slug}>
                <Link
                  href={`/vergoedingen/${v.slug}`}
                  className="flex min-h-20 items-center gap-4 rounded-[var(--r-lg)] bg-white px-6 py-4 text-[16px] leading-6 text-[var(--t-strong)] transition-colors hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  {/* Het logo op vaste hoogte in een vak van vaste breedte. De verhoudingen
                      lopen van bijna vierkant tot drie keer zo breed als hoog; zonder dat
                      vak zou elke kaart een andere tekstinspringing krijgen. */}
                  <VerzekeraarLogo verzekeraar={v} hoogte={30} breedte={80} />
                  <span>{v.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/intake"
              className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
            >
              Start je intake
            </Link>
            <Link
              href="/prijzen"
              className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              Of bekijk eerst wat het kost
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
