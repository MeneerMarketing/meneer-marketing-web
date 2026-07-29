import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AcneTypeKiezer from "@/components/acne/AcneTypeKiezer";
import Button from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icon";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import {
  ACNE_FAQ,
  ACNE_MECHANISME,
  ACNE_TIJDLIJN,
  ACNE_WEL_NIET,
  ACNE_WIJ_DOEN_NIET,
} from "@/data/acne";
import { FIGMA_KENNISBANK_ACNE } from "@/data/figma-home-images";
import { publicCopy } from "@/lib/copy-flags";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Acne — eigen pagina, geen generiek pillar-sjabloon.
 *
 * Deze route staat bewust náást `huidproblemen/[slug]`; een statische route wint van een
 * dynamische. De reden: echt onderscheidende content komt niet uit een fabriek. De
 * andere achttien huidproblemen kunnen straks lenen van wat hier werkt.
 *
 * Wat deze pagina anders maakt dan de duizend andere acnepagina's:
 * - Acne wordt uitgesplitst in vijf beelden, want het type bepaalt wat helpt.
 * - De tijdlijn benoemt de dip in week 1–2 in plaats van hem te verzwijgen.
 * - Er staat een sectie in waarin we nee zeggen.
 * - Littekens komen ná rust, en dat staat er als klinische ordening.
 *
 * Twee donkergroene vlakken, niet meer (§5): het moment waarop we nee zeggen, en de
 * volgende stap. Geen italic accentwoorden; het accent zit in kleur, zoals op de
 * homepage.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda en de
 * pagina staat op noindex tot die check en de prijzen er zijn.
 */

export const metadata: Metadata = {
  title: "Acne behandelen in Rotterdam",
  ...NOG_IN_AANBOUW,
};

const PAD = "/huidproblemen/acne";

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
            De kop haalt de schaamte weg en is tegelijk klinisch juist. Dat is
            precies het snijpunt van "warm maar nooit soft" (A2). */}
        <section className="mx-auto max-w-[1800px] px-5 sm:px-9 lg:px-[7.5vw]">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="py-14 lg:py-20">
              <nav aria-label="Kruimelpad" className="diba-label flex flex-wrap gap-2">
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

              <h1 className="diba-display-l mt-6">
                Acne is niet vies.
                <br />
                <span className="diba-accent">Het is ontsteking.</span>
              </h1>

              <p className="mt-6 max-w-[46ch] text-[16px] leading-7 text-[var(--t-body)]">
                Daarom helpt harder poetsen niet. Wij kijken eerst welk type acne je hebt,
                meten de huid, en zeggen eerlijk wat er wel en niet aan te doen is.
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
        {/* ── Bewijsstrip: gedeelde component, één vaste vorm (§8) ── */}
        <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

        {/* ── Welke acne heb jij? ───────────────────────────────────────────
            De centrale sectie. Vijf beelden in plaats van één belofte. */}
        <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
          <div className="mx-auto max-w-[1800px]">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <Label>Herkenning</Label>
                <h2 className="diba-display-m mt-4">Welke acne heb jij?</h2>
              </div>
              <p className="max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
                Acne is geen één ding. Het type bepaalt wat er wél helpt, en soms bepaalt
                het dat je bij de arts hoort en niet bij ons. Kies het beeld dat het
                dichtst bij jouw huid komt.
              </p>
            </div>

            <AcneTypeKiezer />
          </div>
        </section>

        {/* ── Wat er in je huid gebeurt ─────────────────────────────────── */}
        <section className="bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
          <div className="mx-auto max-w-[1800px]">
            <Label>Wat er gebeurt</Label>
            <h2 className="diba-display-m mt-4 max-w-[24ch]">
              Vier stappen, en bij elke stap kun je ingrijpen.
            </h2>

            <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--r-md)] bg-[var(--g-100)] sm:grid-cols-2 lg:grid-cols-4">
              {ACNE_MECHANISME.map((s, i) => (
                <li key={s.stap} className="bg-white p-6 sm:p-7">
                  <span className="diba-label tabular-nums">0{i + 1}</span>
                  <h3 className="diba-card-title mt-8">{s.stap}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--t-body)]">{s.tekst}</p>
                </li>
              ))}
            </ol>

            <p className="mt-6 max-w-[68ch] text-sm leading-6 text-[var(--t-muted)]">
              Daarom werkt hard schrobben niet: je beschadigt de barrière bij stap twee,
              en dat maakt stap vier erger.
            </p>
          </div>
        </section>

        {/* ── De eerlijke tijdlijn ──────────────────────────────────────────
            De dip in week 1–2 staat er bewust in. Die is de reden dat mensen te
            vroeg stoppen, en hem verzwijgen zou tegen A5 ingaan. */}
        <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
          <div className="mx-auto max-w-[1800px]">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <Label>De eerlijke tijdlijn</Label>
                <h2 className="diba-display-m mt-4 max-w-[18ch]">
                  Eerst even slechter. Dan beter.
                </h2>
              </div>
              <p className="max-w-[62ch] text-[15px] leading-7 text-[var(--t-body)]">
                Dit is de volgorde die we bij de meeste mensen zien. Het is een indicatie,
                geen belofte: hoe snel het gaat verschilt per huid en per type. We meten
                het, dus je hoeft het niet op ons woord te geloven.
              </p>
            </div>

            {/* De Lijn (A4): één horizontale lijn met de meetmomenten erop. */}
            <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {ACNE_TIJDLIJN.map((t) => (
                <li key={t.periode} className="relative">
                  <div
                    className="mb-5 h-[1.5px] w-full bg-[var(--g-100)]"
                    aria-hidden="true"
                  >
                    <span
                      className={`block h-2.5 w-2.5 -translate-y-[5px] rounded-[var(--r-pill)] ${
                        t.isDip ? "bg-[var(--warn)]" : "bg-[var(--g-700)]"
                      }`}
                    />
                  </div>
                  <span className="diba-label">{t.periode}</span>
                  <h3 className="diba-card-title mt-2">{t.kop}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--t-body)]">{t.tekst}</p>
                  {t.isDip ? (
                    <p className="diba-label mt-3 text-[var(--warn)]">
                      Hier stoppen de meeste mensen
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Wat werkt en wat niet ─────────────────────────────────────── */}
        <section className="bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
          <div className="mx-auto max-w-[1800px]">
            <Label>Zonder omwegen</Label>
            <h2 className="diba-display-m mt-4 max-w-[22ch]">Wat werkt. En wat niet.</h2>

            <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
              <div className="rounded-[var(--r-md)] bg-white p-6 sm:p-8">
                <h3 className="diba-label text-[var(--g-700)]">Dit werkt</h3>
                <ul className="mt-5 space-y-3.5">
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
                <h3 className="diba-label text-[var(--warn)]">Dit raden we af</h3>
                <ul className="mt-5 space-y-3.5">
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
        <section className="bg-[var(--g-700)] px-5 py-20 text-[var(--on-dark)] sm:px-9 lg:px-[7.5vw] lg:py-28">
          <div className="mx-auto max-w-[1800px]">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <Label opDonker>Waar wij nee zeggen</Label>
                <h2 className="diba-display-m mt-4 max-w-[16ch]">
                  Eerst rust.
                  <br />
                  <span className="diba-accent-on-dark">Dan littekens.</span>
                </h2>
              </div>
              <p className="max-w-[60ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                Littekens behandelen op een huid die nog ontstoken is, maakt het beeld
                slechter. Dat is de belangrijkste reden dat we soms nee zeggen tegen een
                behandeling die je zelf al had uitgekozen.
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

            <p className="diba-label diba-label-on-dark mt-8">
              Dit staat ook in ons verbond ·{" "}
              <Link href="/ons-verbond" className="underline underline-offset-4">
                lees de tien weigeringen
              </Link>
            </p>
          </div>
        </section>

        {/* ── De Nulmeting bij acne ─────────────────────────────────────── */}
        <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
          <div className="mx-auto grid max-w-[1800px] gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <Label>De Nulmeting</Label>
              <h2 className="diba-display-m mt-4 max-w-[20ch]">
                Bij acne kijken we naar drie assen.
              </h2>
              <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
                De Eve-M-meting legt je huid vast voordat we beginnen. Bij acne zijn poriën,
                roodheid en textuur de assen die tellen. Na acht tot twaalf weken meten we
                opnieuw en leggen we de twee naast elkaar.
              </p>
              <Button href="/behandelingen/huidanalyse" variant="secundair" className="mt-8">
                Meer over De Nulmeting
              </Button>
            </div>

            <ul className="grid gap-3 sm:grid-cols-3">
              {[
                ["Poriën", "Grootte en dichtheid, objectief gemeten"],
                ["Roodheid", "Hoeveel ontsteking er zichtbaar is"],
                ["Textuur", "Oneffenheid en beginnende littekens"],
              ].map(([as, wat]) => (
                <li key={as} className="rounded-[var(--r-sm)] bg-[var(--g-050)] p-5">
                  <h3 className="diba-card-title">{as}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--t-body)]">{wat}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
          <div className="mx-auto grid max-w-[1800px] gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <Label>Goed om te weten</Label>
              <h2 className="diba-display-m mt-4 max-w-[16ch]">
                De vragen die we het vaakst krijgen.
              </h2>
            </div>

            <div className="border-t border-[var(--g-100)]">
              {ACNE_FAQ.map((item) => (
                <details key={item.vraag} className="group border-b border-[var(--g-100)] py-6">
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
                In de intake meten we je huid, bespreken we het type en hoor je hoeveel
                sessies we verwachten. Ook als het antwoord is dat je beter even wacht.
              </p>
              <Button href="/intake?topic=acne" variant="primair-op-donker" className="mt-8 w-fit">
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
