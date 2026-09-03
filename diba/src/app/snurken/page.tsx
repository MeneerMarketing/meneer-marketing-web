import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { behandelingVoorSlug } from "@/data/behandelingen";
import {
  ALARMSIGNALEN,
  SNURKBRONNEN,
  SNURKEN_FAQ,
  SNURKEN_WEL_NIET,
} from "@/data/snurken";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Snurken — een klacht die bij Diba terechtkomt zonder dat het over de huid gaat.
 *
 * Waarom deze pagina op het hoogste niveau staat en niet bij de huidproblemen, en waarom
 * hij bij de bron begint in plaats van bij het apparaat, staat in `src/data/snurken.ts`.
 *
 * WAT DEZE PAGINA ANDERS MAAKT DAN DE REST VAN DE SITE.
 *
 * Op elke andere pagina is de vraag hoe erg iets is. Hier is de vraag waar het zit, en die
 * heeft maar één antwoord waarop wij iets kunnen doen. Drie van de vier bronnen leiden hier
 * naar iemand anders. Dat is geen bescheidenheid maar rekenkunde: een laser op het zachte
 * gehemelte doet niets aan een verstopte neus, en wie dat toch verkoopt levert drie sessies
 * en geen resultaat.
 *
 * Vandaar dat de bronnenkaarten zichtbaar in twee soorten uiteenvallen, en dat de enige
 * groene de enige is waar wij aan zet zijn.
 *
 * DE ALARMSIGNALEN STAAN BOVEN DE BEHANDELING.
 *
 * Niet onderaan bij de kleine lettertjes. Slaapapneu is het enige op deze pagina dat
 * gevaarlijk is om te missen, en iemand die na twee schermen afhaakt moet het gelezen
 * hebben.
 *
 * COPY: concept in de Diba-stem. Medische beweringen zijn gemarkeerd voor Rojda.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/snurken",
  titel: "Snurken behandelen met laser in Rotterdam",
  omschrijving:
    "Snurken begint zelden in je keel alleen. Eerst kijken waar het geluid vandaan komt, dan pas of NightLase bij jou iets oplevert.",
});

const PAD = "/snurken";

const ANKERS = [
  { id: "bron", label: "Waar zit het" },
  { id: "alarm", label: "Wanneer eerst een arts" },
  { id: "behandeling", label: "Wat wij doen" },
  { id: "wel-niet", label: "Wat helpt" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function SnurkenPage() {
  const nightlase = behandelingVoorSlug("nightlase");

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Snurken", url: `${DIBA_SITE_URL}${PAD}` },
        ])}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
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
              <span className="text-[var(--t-muted)]">Snurken</span>
            </nav>

            {/* De kop stelt de vraag die de hele pagina ordent. Niet "wij behandelen
                snurken", want dat is pas het antwoord op de tweede vraag. */}
            <h1 className="diba-display-l mt-6">
              Snurken dat je
              <br />
              <span className="diba-accent">nachten verstoort</span>
            </h1>

            <p className="mt-6 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Er bestaat een laserbehandeling die het zachte gehemelte aanspant,
              en daar zijn wij goed in. Maar hij werkt alleen als het geluid
              daar ontstaat. Zit het in je neus, je tong of je kaakstand, dan
              levert hij niets op, en dat hoor je liever nu dan na drie sessies.
            </p>

            <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-[var(--t-body)]">
              Daarom begint deze pagina bij de bron en niet bij het apparaat.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#bron">Waar komt jouw geluid vandaan?</Button>
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
              src="/images/shoot/beh-fotona.jpg"
              alt="Fotona-laserbehandeling in de behandelkamer, met oogbescherming"
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

      {/* ── Waar het geluid ontstaat ───────────────────────────────────── */}
      <section
        id="bron"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Vier bronnen"
            raster="gelijk"
            kop="Vier plekken waar"
            accent="snurken kan ontstaan"
            intro="Dit is een wegwijzer en geen diagnose; het echte antwoord komt uit meekijken achter in je mond. Maar de herkenning hieronder brengt de meeste mensen al bij de juiste deur, en soms is dat niet de onze."
          />

          <ul className="mt-12 grid gap-5 lg:grid-cols-2">
            {SNURKBRONNEN.map((bron) => (
              <li
                key={bron.id}
                className={`flex flex-col rounded-[var(--r-md)] p-7 sm:p-8 ${
                  bron.binnenBereik
                    ? "bg-[var(--g-700)] text-[var(--on-dark)]"
                    : "bg-white"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3
                    className={`diba-card-title ${bron.binnenBereik ? "" : "text-[var(--t-strong)]"}`}
                  >
                    {bron.naam}
                  </h3>
                  {/* Het label zegt in woorden wat de kleur al zegt. Kleur alleen is
                      geen informatie voor wie hem niet ziet. */}
                  <span
                    className={`diba-label ${
                      bron.binnenBereik
                        ? "diba-label-on-dark"
                        : "text-[var(--t-muted)]"
                    }`}
                  >
                    {bron.binnenBereik ? "Hier zijn wij aan zet" : "Hier niet"}
                  </span>
                </div>

                <dl className="mt-5 space-y-4">
                  {(
                    [
                      ["Waar je het aan merkt", bron.herkenning],
                      ["Wat het betekent", bron.watHetBetekent],
                      ["Wat wij doen", bron.watWijDoen],
                    ] as const
                  ).map(([kop, tekst]) => (
                    <div key={kop}>
                      <dt
                        className={`diba-label ${
                          bron.binnenBereik
                            ? "diba-label-on-dark"
                            : "text-[var(--t-label)]"
                        }`}
                      >
                        {kop}
                      </dt>
                      <dd
                        className={`mt-1.5 text-[15px] leading-7 ${
                          bron.binnenBereik
                            ? "text-[var(--on-dark-body)]"
                            : "text-[var(--t-body)]"
                        }`}
                      >
                        {publicCopy(tekst)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── De grens ───────────────────────────────────────────────────── */}
      <section
        id="alarm"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Label>De grens die telt</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Snurken is niet
              <br />
              <span className="diba-accent">hetzelfde als apneu.</span>
            </h2>
            <p className="mt-6 max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]">
              Snurken is geluid. Bij slaapapneu stopt je ademhaling tijdens de
              slaap kortdurend, en dat is een medisch probleem met gevolgen voor
              je hart en je bloeddruk. Ze komen vaak samen voor.
            </p>
            <p className="mt-4 max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]">
              Het geluid zachter maken terwijl er ademstops onder zitten is het
              alarm uitzetten en het probleem laten staan. Daarom vragen we er
              altijd naar, en daarom staat dit hier en niet onderaan.
            </p>
          </div>

          {/* Geen score en geen uitslag: één keer ja is genoeg om ergens anders te
              beginnen, en dat staat er dan ook zo. */}
          <div className="rounded-[var(--r-md)] bg-[var(--warn-vlak)] p-7 sm:p-9">
            <p className="diba-label text-[var(--warn-text)]">
              Herken je hier iets van?
            </p>
            <ul className="mt-5 space-y-3">
              {ALARMSIGNALEN.map((signaal) => (
                <li
                  key={signaal}
                  className="text-[16px] leading-7 text-[var(--t-body)]"
                >
                  {publicCopy(signaal)}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[54ch] text-[15px] leading-7 text-[var(--t-body)]">
              Eén keer ja is genoeg om eerst bij je huisarts te beginnen. Er
              hoort dan slaaponderzoek bij, en dat regelt een arts en niet wij.
              Komt daar niets uit, dan kun je altijd nog terugkomen.
            </p>
          </div>
        </div>
      </section>

      {/* ── Wat wij doen ───────────────────────────────────────────────── */}
      <section
        id="behandeling"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="NightLase"
            kop="Warmte op het gehemelte,"
            accent="drie keer, met weken ertussen."
            intro="Als het geluid uit je zachte gehemelte komt, is dit wat we kunnen doen. Geen snijden, geen naalden, en niets dat je 's nachts in moet doen."
          />

          {nightlase ? (
            <>
              <ol className="mt-12 grid gap-5 lg:grid-cols-3">
                {(nightlase.stappen ?? []).map((stap, i) => (
                  <li
                    key={stap.kop}
                    className="flex flex-col rounded-[var(--r-md)] bg-white p-7 sm:p-8"
                  >
                    <span className="diba-label text-[var(--g-700)]">
                      Stap {i + 1}
                    </span>
                    <h3 className="diba-card-title mt-3">{stap.kop}</h3>
                    <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                      {publicCopy(stap.zin)}
                    </p>
                  </li>
                ))}
              </ol>

              {/* Herstel en sessies komen uit de behandelingentabel en niet uit een
                  tweede tekst hier. Twee bronnen voor hetzelfde gegeven lopen binnen een
                  maand uit elkaar. */}
              <dl className="mt-10 grid gap-5 sm:grid-cols-2">
                {(
                  [
                    ["Hoe lang je erover doet", nightlase.sessies],
                    ["Wat je erna merkt", nightlase.herstel],
                  ] as const
                ).map(([kop, tekst]) => (
                  <div
                    key={kop}
                    className="rounded-[var(--r-md)] bg-white p-7 sm:p-8"
                  >
                    <dt className="diba-label text-[var(--t-label)]">{kop}</dt>
                    <dd className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
                      {publicCopy(tekst)}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10">
                <Button href="/behandelingen/nightlase">
                  Alles over NightLase
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <WelNiet
        wel={SNURKEN_WEL_NIET.wel}
        niet={SNURKEN_WEL_NIET.niet}
        intro="Bij snurken zit de waarde vooral in wat er níét gebeurt. De helft van de mensen die hierover belt hoort van ons dat ze ergens anders moeten beginnen."
      />

      <PillarFaq items={SNURKEN_FAQ} onderwerp="snurken" />

      <PillarCta
        kop="Plan een intake"
        accent="bij Diba Clinics"
        tekst="In het eerste gesprek kijken we waar het geluid ontstaat en vragen we naar je nachten. Daarna weet je of dit bij jou iets oplevert, en wij ook."
        topic="snurken"
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
