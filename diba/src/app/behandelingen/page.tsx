import type { Metadata } from "next";
import Link from "next/link";
import Diepteschaal from "@/components/behandelingen/Diepteschaal";
import Huidreis from "@/components/behandelingen/Huidreis";
import Label from "@/components/ui/Label";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";

/**
 * De behandelingenpagina.
 *
 * DERDE VERSIE. De eerste was een raster met "[COPY-NODIG]" op de kaarten. De tweede was
 * goed geschreven maar bleef een brochure: twee tekstkolommen, een kaartje ernaast, een
 * cijferbalk die op elke pagina hetzelfde zegt. Terechte kritiek was dat het niet pakt.
 *
 * Deze versie heeft één idee en past dat over de hele pagina toe:
 *
 *     JE DAALT AF IN JE EIGEN HUID.
 *
 * De hero is geen tekstblok maar een sonde die je omlaag sleept. Hoe dieper je komt, hoe
 * minder behandelingen er nog bij zijn: bovenin vier, helemaal onderin één. Dat ene gebaar
 * legt de hele pagina uit voordat er één alinea gelezen is.
 *
 * Wat er daarna komt is dezelfde as, twee keer anders bekeken. De diepteschaal zet alle
 * vijf naast elkaar zodat je ze kunt vergelijken, en daar zie je de pointe: de balken
 * worden dieper en de hersteltijd wordt in exact dezelfde volgorde langer.
 *
 * Wat er bewust NIET meer op staat:
 *
 * - De cijferbalk. Dezelfde vier getallen als op elke andere pagina, midden in een
 *   afdaling. Dat onderbreekt precies wat de pagina probeert op te bouwen.
 * - Het kaartenraster. Dat was een derde manier om dezelfde vijf te tonen. De
 *   diepteschaal is de betere: elke kolom is een link, dus je verliest geen ingang.
 * - De sprongnavigatie. Op een pagina van vier secties is dat meubilair.
 *
 * Eén donkergroen vlak: de afsluiter. De rest is licht, want een afdaling die halverwege
 * donker wordt leest als een waarschuwing.
 */

export const metadata: Metadata = {
  title: "Behandelingen",
  description:
    "Je kiest geen behandeling, je kiest een diepte. Sleep door je huid en zie welke behandelingen daar komen, wat ze kosten en hoe lang je herstelt.",
};

export default function BehandelingenPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Behandelingen", url: `${DIBA_SITE_URL}/behandelingen` },
        ])}
      />

      {/* ── Hero: de kop is kort, de sonde doet het werk ── */}
      <section className="mx-auto max-w-[1800px] px-5 pt-12 sm:px-9 lg:px-[7.5vw] lg:pt-16">
        <nav aria-label="Kruimelpad" className="diba-label flex flex-wrap gap-2">
          <Link href="/" className="hover:text-[var(--g-700)]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--t-muted)]">Behandelingen</span>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <h1 className="diba-display-l max-w-[13ch]">
            Je kiest geen behandeling.
            <br />
            <span className="diba-accent">Je kiest een diepte.</span>
          </h1>

          <p className="max-w-[46ch] text-[17px] leading-8 text-[var(--t-body)]">
            Sleep de sonde door je huid naar beneden. Hoe dieper je komt, hoe minder
            behandelingen er nog bij zijn. Daar zit alles in: wat het kost, hoe lang je
            rood bent, en hoe vaak je terug moet.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-[1800px] px-5 pb-20 sm:px-9 lg:px-[7.5vw] lg:pb-28">
        <Huidreis />
      </section>

      {/* ── Alle vijf naast elkaar ── */}
      <section className="bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <Label>Naast elkaar</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Dieper duurt langer.
            <br />
            <span className="diba-accent">Altijd.</span>
          </h2>
          <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--t-body)]">
            Dezelfde vijf, nu alle vijf tegelijk. Klik een kolom aan voor de hele uitleg.
          </p>

          <Diepteschaal />
        </div>
      </section>

      {/* ── De eerlijke tegenhanger ── */}
      <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto grid max-w-[1800px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Wat hier niet staat</Label>
            <h2 className="diba-display-m mt-4 max-w-[14ch]">
              Welke de
              <br />
              <span className="diba-accent">beste is.</span>
            </h2>
          </div>

          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Die vraag heeft geen antwoord zonder jouw huid erbij. Dieper is niet beter,
              duurder is niet beter, en nieuwer al helemaal niet. Een behandeling is
              passend of niet passend, en dat verschilt per persoon en per moment.
            </p>
            <p className="mt-5 text-[17px] leading-8 text-[var(--t-body)]">
              Daarom staat er nergens op deze pagina een aanbeveling. Wat er wél staat is
              waar elke behandeling aankomt, zodat je zelf kunt zien waarom de een niet kan
              wat de ander wel kan.
            </p>
            <p className="mt-5 text-[17px] leading-8 text-[var(--t-body)]">
              Wat bij jou past hoor je na de meting. Soms is dat geen van de vijf.
            </p>
          </div>
        </div>
      </section>

      {/* ── Afsluiter ── */}
      <section className="px-5 pb-20 sm:px-9 lg:px-[7.5vw] lg:pb-28">
        <div className="mx-auto max-w-[1800px]">
          <div className="rounded-[var(--r-xl)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-14">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
              <div>
                <Label opDonker>Beginnen</Label>
                <h2 className="diba-display-m mt-4 max-w-[16ch]">
                  Eerst meten.
                  <br />
                  <span className="diba-accent-on-dark">Dan pas kiezen.</span>
                </h2>
              </div>

              <div>
                <p className="max-w-[50ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                  In Behandeling Nul kijken we onder vast licht wat er bij jou aan de hand
                  is. Daar komt uit welke diepte er nodig is, of dat er niets nodig is.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/intake"
                    className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Plan Behandeling Nul
                  </Link>
                  <Link
                    href="/huidproblemen"
                    className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/50 px-6 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Of begin bij je huidprobleem
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
