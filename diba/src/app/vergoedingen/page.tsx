import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/ui/Label";
import { INSURERS } from "@/data/insurers";
import { MISVERSTANDEN, ONZE_ROL, ROUTE } from "@/data/vergoeding-route";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";

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
 * Ook opgeruimd: de hardgecodeerde hex (#17372a, #95c592, #286943) en de hover-rand met
 * schaduw. Kaarten in deze huisstijl zijn vlakken zonder lijn.
 *
 * [BESLUIT-OKAN] of de losse verzekeraarspagina's blijven. Ze staan er nog en linken door,
 * maar zonder actuele voorwaarden wekken ze de indruk dat wij het antwoord hebben.
 *
 * Eén donkergroen vlak: wat wij wel en niet doen (§5).
 */

export const metadata: Metadata = {
  title: "Vergoedingen",
  description:
    "Of er iets vergoed wordt hangt niet af van je verzekeraar maar van de vraag of er een medische reden is. Drie vragen, en wat er gebeurt als het antwoord nee is.",
};

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
              Je verzekeraar is
              <br />
              <span className="diba-accent">niet de eerste vraag.</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Voor het grootste deel van wat wij doen is het antwoord bij elke
              verzekeraar hetzelfde: er wordt niets vergoed. Dat is geen
              strengheid van jouw polis, het is hoe het stelsel is opgezet.
              Cosmetische zorg valt erbuiten.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              De vraag die er wel toe doet komt eerder, en gaat niet over de
              behandeling maar over de klacht.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Waarom hier geen bedragen staan</Label>
            <p className="mt-5 text-[19px] leading-8 text-[var(--t-body)]">
              Voorwaarden en maxima veranderen per jaar en per pakket.
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
              Een bedrag op een website is binnen twaalf maanden onjuist, en bij
              geld is onjuist erger dan afwezig. Wat niet verandert is hoe het
              werkt, en dat staat er wel.
            </p>
          </div>
        </div>
      </section>

      {/* ── De route: drie vragen ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="max-w-[62ch]">
            <Label>Drie vragen, op volgorde</Label>
            <h2 className="diba-display-m mt-4 max-w-[20ch]">
              En wat er gebeurt
              <br />
              <span className="diba-accent">bij nee.</span>
            </h2>
            <p className="mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Die nee-tak staat normaal nergens, en dat is precies de tak waar de
              meeste mensen in terechtkomen.
            </p>
          </div>

          <ol className="mt-10 space-y-4">
            {ROUTE.map((s) => (
              <li
                key={s.nr}
                className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9 lg:p-11"
              >
                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
                  <div>
                    <p className="diba-label text-[var(--t-label)]">
                      Vraag {s.nr}
                    </p>
                    <p className="mt-4 text-[28px] leading-[1.08] font-normal tracking-[-.04em] text-balance sm:text-[32px]">
                      {s.vraag}
                    </p>
                    <p className="mt-5 max-w-[42ch] text-[15px] leading-7 text-[var(--t-muted)]">
                      {s.zin}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[var(--r-md)] bg-[var(--g-200)] p-6">
                      <p className="diba-label text-[var(--g-900)]">Bij nee</p>
                      <p className="mt-3 text-[15px] leading-7 text-[var(--g-900)]">
                        {s.nee}
                      </p>
                    </div>
                    <div className="rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
                      <p className="diba-label text-[var(--t-label)]">Bij ja</p>
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
                  Wat wij hierin
                  <span className="diba-accent-on-dark"> niet kunnen.</span>
                </h2>
                <p className="mt-6 max-w-[44ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                  Klinieken laten dit graag in het midden, en dan is de
                  teleurstelling voor jou. Dus staat het hier zwart op wit.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[var(--r-md)] bg-white/10 p-6 sm:p-7">
                  <p className="diba-label diba-label-on-dark">Dat doen wij</p>
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
                  <p className="diba-label diba-label-on-dark">
                    Dat doen wij niet
                  </p>
                  <ul className="mt-4 space-y-3">
                    {ONZE_ROL.niet.map((r) => (
                      <li
                        key={r}
                        className="text-[15px] leading-7 text-[var(--on-dark-accent)]"
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
          <div className="max-w-[62ch]">
            <Label>Vier misverstanden</Label>
            <h2 className="diba-display-m mt-4 max-w-[20ch]">
              De eerste
              <br />
              <span className="diba-accent">scheelt geld.</span>
            </h2>
            <p className="mt-6 text-[17px] leading-8 text-[var(--t-body)]">
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
          <div className="max-w-[62ch]">
            <Label>Pas nu je verzekeraar</Label>
            <h2 className="diba-display-m mt-4 max-w-[20ch]">
              Kwam je door
              <br />
              <span className="diba-accent">alle drie de vragen?</span>
            </h2>
            <p className="mt-6 text-[17px] leading-8 text-[var(--t-body)]">
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
                  className="flex min-h-16 items-center rounded-[var(--r-lg)] bg-white px-6 text-[16px] leading-6 text-[var(--t-strong)] transition-colors hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  {v.name}
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
