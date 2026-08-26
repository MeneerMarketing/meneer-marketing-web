import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AcneOnderDeHuid from "@/components/acne/AcneOnderDeHuid";
import PillarNav from "@/components/pillar/PillarNav";
import AcneTypeKiezer from "@/components/acne/AcneTypeKiezer";
import AcneZoneKaart from "@/components/acne/AcneZoneKaart";
import Button from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icon";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { ACNE_FAQ, ACNE_WEL_NIET, ACNE_WIJ_DOEN_NIET } from "@/data/acne";
import { FIGMA_KENNISBANK_ACNE } from "@/data/figma-home-images";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";
import { RASTER_SECTIEKOP, RASTER_SECTIEKOP_GELIJK } from "@/lib/raster";

/**
 * Acne — eigen pagina, geen generiek pillar-sjabloon.
 *
 * Deze route staat bewust náást `huidproblemen/[slug]`; een statische route wint van een
 * dynamische. Echt onderscheidende content komt niet uit een fabriek. Dit is het
 * sjabloon waar de andere achttien huidproblemen straks van lenen.
 *
 * De opbouw volgt hoe iemand met acne denkt, niet hoe een SEO-sjabloon is ingedeeld:
 *
 *   waar zit het  →  wat is het  →  hoe werkt het  →  wat helpt
 *   →  waar zeggen wij nee  →  hoe meten we  →  vragen  →  stap
 *
 * Drie onderdelen zijn interactief, en elk daarvan doet iets wat statische tekst niet kan:
 * - De acnekaart leest live mee wat jouw zones klinisch betekenen.
 * - De typekiezer neemt per beeld één misverstand weg.
 * - De doorsnede laat zien dat elk stadium een ándere lever heeft.
 *
 * Er was een vierde, de tijdlijn met "eerst even slechter". Die is er in augustus 2026
 * uitgehaald op aanwijzing van Rojda; zie de opmerking op de plek waar hij stond.
 *
 * Twee donkergroene vlakken, niet meer (§5): het moment waarop we nee zeggen, en de
 * volgende stap. Geen italic accentwoorden; het accent zit in kleur.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda; de
 * pagina staat op noindex tot die check en de prijzen er zijn.
 */

export const metadata: Metadata = {
  title: "Acne behandelen in Rotterdam",
};

const PAD = "/huidproblemen/acne";

const ANKERS = [
  { id: "waar", label: "Waar zit het" },
  { id: "welke", label: "Welk type" },
  { id: "onderhuid", label: "Onder je huid" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "nee", label: "Waar wij nee zeggen" },
  { id: "meten", label: "Hoe we meten" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function AcnePage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Huidproblemen", url: `${DIBA_SITE_URL}/huidproblemen` },
          { name: "Acne", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      {/* ── Hero ───────────────────────────────────────────────────────────
          De kop haalt de schaamte weg en is tegelijk klinisch juist: acne is een
          ontstekingsreactie, geen vuil. Dat is het snijpunt van "warm maar nooit
          soft" (A2), en het is de zin waar de rest van de pagina op rust. */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="py-14 lg:py-20">
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/huidproblemen" className="hover:text-[var(--g-700)]">
                Huidproblemen
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Acne</span>
            </nav>

            {/* Kop en eerste alinea zijn van Rojda, augustus 2026. De vorige kop
                ("Acne is niet vies. Het is ontsteking.") ontkende eerst een verwijt
                voordat hij iets beloofde; deze begint bij wat je komt halen. */}
            <h1 className="diba-display-l mt-6">
              Begrijp je acne.
              <br />
              <span className="diba-accent">Behandel gericht.</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Acne heeft niet één oorzaak en daarom ook niet één
              standaardbehandeling. We kijken naar jouw huid, de vorm en ernst
              van de acne en factoren die daarop van invloed zijn. Zo bepalen we
              welke aanpak bij jouw huid past.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              De meeste mensen stellen deze afspraak twee jaar uit. Snappen we.
            </p>

            {/* Kruisverwijzing naar wat er ná de acne overblijft. Wie hier komt voor de
                plekken en niet voor de puistjes hoort dat meteen te lezen. */}
            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Zit je vooral met wat er is achtergebleven? Dan begint het bij{" "}
              <Link
                href="/huidproblemen/acne-littekens"
                className="text-[var(--g-700)] underline underline-offset-4"
              >
                acnelittekens
              </Link>
              , want dat is vaak helemaal geen litteken.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="/intake?topic=acne">Start je intake (4 min)</Button>
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

          <div className="relative min-h-[300px] overflow-hidden rounded-[var(--r-md)] bg-[var(--g-200)] lg:min-h-[460px]">
            <Image
              src={FIGMA_KENNISBANK_ACNE.src}
              alt={FIGMA_KENNISBANK_ACNE.alt}
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      <PillarNav ankers={ANKERS} />

      {/* ── De acnekaart: het onderdeel dat deze pagina onderscheidt ────── */}
      <section
        id="waar"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <div className={RASTER_SECTIEKOP}>
            <div>
              <Label>De acnekaart</Label>
              <h2 className="diba-display-m mt-4 max-w-[16ch]">
                Waar het zit,
                <br />
                <span className="diba-accent">zegt wat het is.</span>
              </h2>
            </div>
            <p className="max-w-[64ch] text-[16px] leading-7 text-[var(--t-body)]">
              De kaaklijn wijst iets anders aan dan de T-zone. Bij wangen kan
              het van buiten komen, van je telefoon of je kussensloop, maar net
              zo goed hormonaal zijn. En acne op je rug of schouders is een zone
              op zich, met een eigen oorzaak. Tik aan waar het bij jou zit, dan
              lezen we mee. Je mag er meerdere kiezen.
            </p>
          </div>

          <AcneZoneKaart />
        </div>
      </section>

      {/* ── Welk type ──────────────────────────────────────────────────── */}
      <section
        id="welke"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <div className={RASTER_SECTIEKOP}>
            <div>
              <Label>Herkenning</Label>
              <h2 className="diba-display-m mt-4 max-w-[14ch]">
                Welke acne heb jij?
              </h2>
            </div>
            <p className="max-w-[64ch] text-[16px] leading-7 text-[var(--t-body)]">
              Acne is geen één ding. Het type bepaalt wat er wél helpt, en bij
              één van deze vijf bepaalt het dat je bij de arts hoort en niet bij
              ons. Dat staat er dan ook.
            </p>
          </div>

          <AcneTypeKiezer />
        </div>
      </section>

      {/* ── Onder je huid ──────────────────────────────────────────────── */}
      <section
        id="onderhuid"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <div className={RASTER_SECTIEKOP}>
            <div>
              <Label>Onder je huid</Label>
              <h2 className="diba-display-m mt-4 max-w-[18ch]">
                Vier stadia, vier verschillende knoppen.
              </h2>
            </div>
            <p className="max-w-[64ch] text-[16px] leading-7 text-[var(--t-body)]">
              Bij elk stadium kun je iets anders doen. Dat is precies waarom
              harder schrobben niet werkt: dat grijpt in op het tweede stadium
              en maakt het vierde erger. Klik erdoor en kijk wat er verandert.
            </p>
          </div>

          <AcneOnderDeHuid />
        </div>
      </section>

      {/* Hier stond "Eerst even slechter. Dan beter." met een tijdlijn van twaalf weken.

          Eruit op aanwijzing van Rojda, augustus 2026: een pagina die je binnenhaalt met
          de belofte dat het eerst erger wordt, laat mensen afhaken voordat ze een afspraak
          maken. Dat een huid tijdens een acnetraject door een mindere fase kan gaan is
          waar, maar het is iets om in het consult te vertellen, waar je erop kunt reageren
          en waar het over jouw huid gaat. Niet iets om een bezoeker als eerste te laten
          lezen.

          De component AcneTijdlijn blijft staan; hij is nergens anders in gebruik maar ook
          niet stuk, en dit is een redactionele keuze die morgen anders kan liggen. */}

      {/* ── Wat werkt en wat niet ──────────────────────────────────────── */}
      <section
        id="wel-niet"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          {/* Twee gelijke helften eronder, dus deze kop volgt die indeling. */}
          <div className={RASTER_SECTIEKOP_GELIJK}>
            <div>
              <Label>Zonder omwegen</Label>
              <h2 className="diba-display-m mt-4 max-w-[14ch]">
                Wat werkt. En wat niet.
              </h2>
            </div>
            <p className="max-w-[64ch] text-[16px] leading-7 text-[var(--t-body)]">
              De rechterkolom is de nuttigste van de twee. Bij elk kruisje staat
              waarom, want “niet doen” zonder reden onthoudt niemand.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="rounded-[var(--r-md)] bg-white p-6 sm:p-8">
              <h3 className="diba-label text-[var(--g-700)]">Dit werkt</h3>
              <ul className="mt-5 space-y-4">
                {ACNE_WEL_NIET.wel.map((r) => (
                  <li key={r} className="flex gap-3 text-[15px] leading-7">
                    <svg
                      viewBox="0 0 20 20"
                      className="mt-1.5 h-4 w-4 shrink-0 text-[var(--g-700)]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 10.5 8 14.5 16 5.5" />
                    </svg>
                    <span className="text-[var(--t-body)]">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[var(--r-md)] bg-white p-6 sm:p-8">
              <h3 className="diba-label text-[var(--warn-text)]">
                Dit raden we af
              </h3>
              <ul className="mt-5 space-y-4">
                {ACNE_WEL_NIET.niet.map((r) => (
                  <li key={r} className="flex gap-3 text-[15px] leading-7">
                    <svg
                      viewBox="0 0 20 20"
                      className="mt-1.5 h-4 w-4 shrink-0 text-[var(--warn)]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" />
                    </svg>
                    <span className="text-[var(--t-body)]">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Donkergroen 1 van 2: waar wij nee zeggen ───────────────────── */}
      <section
        id="nee"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-700)] px-5 py-20 text-[var(--on-dark)] sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <div className={RASTER_SECTIEKOP}>
            <div>
              <Label opDonker>Waar wij nee zeggen</Label>
              <h2 className="diba-display-m mt-4 max-w-[12ch]">
                Eerst rust.
                <br />
                <span className="diba-accent-on-dark">Dan littekens.</span>
              </h2>
            </div>
            <p className="max-w-[62ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Littekens behandelen op een huid die nog ontstoken is maakt het
              beeld slechter. Dat is de belangrijkste reden dat we soms nee
              zeggen tegen een behandeling die je zelf al had uitgekozen. Dat
              gesprek is niet leuk, en we voeren het liever nu dan achteraf.
            </p>
          </div>

          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-white/15 md:grid-cols-3">
            {ACNE_WIJ_DOEN_NIET.map((p) => (
              <li key={p.titel} className="bg-[var(--g-700)] p-6 sm:p-8">
                <h3 className="diba-card-title">{p.titel}</h3>
                <p className="mt-3 text-[15px] leading-7 text-[var(--on-dark-body)]">
                  {publicCopy(p.tekst)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── De Nulmeting bij acne ─────────────────────────────────────── */}
      <section
        id="meten"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <Label>De Nulmeting</Label>
            <h2 className="diba-display-m mt-4 max-w-[18ch]">
              Bij acne tellen vier assen.
            </h2>
            <p className="mt-6 max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]">
              De Eve-M-meting legt je huid vast voordat we beginnen. Bij acne
              zijn poriën, ontstekingen, roodheid en textuur de assen die
              tellen. Na acht tot twaalf weken meten we opnieuw en leggen we de
              twee naast elkaar.
            </p>
            <p className="mt-4 max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]">
              Dat is niet om je te overtuigen. Het is zodat we het kunnen zien
              als iets niet werkt, en dan iets anders kunnen doen.
            </p>
            <Button
              href="/behandelingen/huidanalyse"
              variant="secundair"
              className="mt-8"
            >
              Meer over De Nulmeting
            </Button>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3">
            {[
              [
                "Poriën",
                "Grootte en dichtheid, objectief gemeten in plaats van geschat",
              ],
              ["Roodheid", "Hoeveel actieve ontsteking er zichtbaar is"],
              [
                "Textuur",
                "Oneffenheid, en of er littekens beginnen te ontstaan",
              ],
            ].map(([as, wat]) => (
              <li
                key={as}
                className="rounded-[var(--r-sm)] bg-[var(--g-050)] p-5"
              >
                <h3 className="diba-card-title">{as}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--t-body)]">
                  {wat}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section
        id="vragen"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <Label>Goed om te weten</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              De vragen die we het vaakst krijgen.
            </h2>
          </div>

          <div className="border-t border-[var(--g-100)]">
            {ACNE_FAQ.map((item) => (
              <details key={item.vraag} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl tracking-[-.035em]">
                  <span>{item.vraag}</span>
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--r-pill)] bg-[var(--g-050)] text-[var(--g-700)] transition group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[68ch] pt-4 text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(item.antwoord)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Donkergroen 2 van 2: de volgende stap ─────────────────────── */}
      <section className="mx-5 mb-5 overflow-hidden rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[1.35fr_.65fr]">
          <div>
            <Label opDonker>Behandeling Nul</Label>
            <h2 className="diba-display-l mt-5">
              Eerst kijken.
              <br />
              <span className="diba-accent-on-dark">Dan pas plannen.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="max-w-sm text-[16px] leading-7 text-[var(--on-dark-body)]">
              In de intake meten we je huid, bespreken we het type en hoor je
              hoeveel sessies we verwachten. Ook als het antwoord is dat je
              beter even wacht.
            </p>
            <Button
              href="/intake?topic=acne"
              variant="primair-op-donker"
              className="mt-8 w-fit"
            >
              Start je intake (4 min)
            </Button>
            <a
              href={DIBA_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="diba-label diba-label-on-dark mt-4 inline-flex items-center gap-1.5 underline underline-offset-4"
            >
              Nog niet zeker? Stel je vraag
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
