import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/ui/Label";
import { PCOS_KLACHTEN, PCOS_VERDELING } from "@/data/pcos";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";

/**
 * PCOS en de huid.
 *
 * WAAROM DIT GEEN BEHANDELPAGINA IS.
 *
 * Hier stond een ContentPageTemplate met drie `[COPY-NODIG]`-blokken. De verleiding bij zo
 * een pagina is om PCOS als doelgroep te behandelen en er een traject aan te hangen. Dat is
 * precies wat er niet mag: PCOS is een hormonale aandoening, wij stellen die diagnose niet
 * en behandelen die niet. Wat we wel kunnen is de zichtbare gevolgen op de huid aanpakken.
 *
 * Dus is de pagina een taakverdeling geworden. Drie kolommen: de arts, wij, en niemand. Die
 * derde is de eerlijkste van de pagina, want daar staat wat geen enkele kliniek kan en waar
 * de meeste folders juist wel iets beloven.
 *
 * DE VIERDE KLACHT IS DE BELANGRIJKSTE.
 *
 * Bij donkere verkleuring in huidplooien staat er dat we er niets aan doen en dat je ermee
 * naar de huisarts hoort te gaan. Dat is de enige plek op deze site waar we iemand actief
 * wegsturen van iets wat cosmetisch te behandelen zou zijn, en dat is met opzet zo
 * nadrukkelijk.
 *
 * WAT ER NIET STAAT.
 *
 * Geen zelftest en geen symptomenlijst waarmee je jezelf PCOS aanmeet. Herkenning is geen
 * vaststelling.
 *
 * [MEDISCHE-CHECK-ROJDA] alles in `pcos.ts`, zonder uitzondering. Dit is de enige pagina
 * waar een verkeerde zin iemand van een arts weg kan houden.
 *
 * Eén donkergroen vlak: wanneer je eerst ergens anders moet zijn (§5).
 */

export const metadata: Metadata = {
  title: "PCOS en huid",
  description:
    "Wat een huidkliniek bij PCOS wel kan doen, wat niet, en wanneer je eerst bij de huisarts hoort te zijn. Een taakverdeling, geen behandelaanbod.",
};

export default function PcosPage() {
  const metArts = PCOS_KLACHTEN.filter((k) => k.arts !== null);

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "PCOS en huid", url: `${DIBA_SITE_URL}/pcos` },
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
              <span className="text-[var(--t-muted)]">PCOS</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              PCOS behandelen
              <br />
              <span className="diba-accent">wij niet.</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Wat we wel kunnen is werken aan wat je erdoor op je huid ziet. Dat
              is iets anders, en dat verschil is het hele punt van deze pagina.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Wie met PCOS te maken heeft, heeft meestal al genoeg beloftes
              gehoord. Hieronder staat per klacht wat we kunnen doen, wat we niet
              kunnen doen en wanneer je ergens anders moet zijn.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Vooraf, en het staat er niet klein</Label>
            <p className="mt-5 text-[19px] leading-8 text-[var(--t-body)]">
              Op deze pagina staat geen zelftest en geen lijst waarmee je jezelf
              PCOS kunt aanmeten.
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
              Iets herkennen is niet hetzelfde als iets vaststellen. Die
              vaststelling doet je huisarts of gynaecoloog, met onderzoek dat wij
              niet doen en niet mogen doen.
            </p>
          </div>
        </div>
      </section>

      {/* ── De taakverdeling ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="max-w-[62ch]">
            <Label>Drie kolommen</Label>
            <h2 className="diba-display-m mt-4 max-w-[20ch]">
              Wie doet
              <br />
              <span className="diba-accent">wat.</span>
            </h2>
            <p className="mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              De derde kolom is de eerlijkste, en die ontbreekt op vrijwel elke
              kliniekwebsite. Daar staat wat niemand kan.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {PCOS_VERDELING.map((k) => (
              <li
                key={k.wie}
                className={`rounded-[var(--r-lg)] p-7 sm:p-9 ${
                  k.hier ? "bg-[var(--g-200)]" : "bg-white"
                }`}
              >
                <p
                  className={`diba-label ${k.hier ? "text-[var(--g-900)]" : "text-[var(--t-label)]"}`}
                >
                  {k.hier ? "Hier" : "Niet hier"}
                </p>
                <p
                  className={`diba-card-title mt-3 ${k.hier ? "text-[var(--g-900)]" : "text-[var(--t-strong)]"}`}
                >
                  {k.wie}
                </p>
                <p
                  className={`mt-4 text-[15px] leading-7 ${k.hier ? "text-[var(--g-900)]" : "text-[var(--t-body)]"}`}
                >
                  {k.wat}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Per klacht ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="max-w-[62ch]">
            <Label>Vier huidklachten</Label>
            <h2 className="diba-display-m mt-4 max-w-[20ch]">
              Wat we wel doen,
              <br />
              <span className="diba-accent">en wat niet.</span>
            </h2>
            <p className="mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Bij elke klacht staan allebei de kanten even nadrukkelijk. De ene
              zonder de andere is een verkooptekst.
            </p>
          </div>

          <ul className="mt-10 space-y-4">
            {PCOS_KLACHTEN.map((k) => (
              <li
                key={k.id}
                className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9 lg:p-11"
              >
                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
                  <div>
                    <p className="text-[26px] leading-[1.1] font-normal tracking-[-.04em] text-balance sm:text-[30px]">
                      {k.kop}
                    </p>
                    <p className="mt-4 max-w-[42ch] text-[15px] leading-7 text-[var(--t-muted)]">
                      {k.wat}
                    </p>
                    {k.href && k.link ? (
                      <Link
                        href={k.href}
                        className="diba-label mt-5 inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                      >
                        {k.link}
                        <span aria-hidden="true">›</span>
                      </Link>
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[var(--r-md)] bg-[var(--g-050)] p-6">
                      <p className="diba-label text-[var(--t-label)]">
                        Wat wij doen
                      </p>
                      <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                        {k.wij}
                      </p>
                    </div>
                    <div className="rounded-[var(--r-md)] bg-[var(--g-025)] p-6">
                      <p className="diba-label text-[var(--t-label)]">
                        Wat wij niet doen
                      </p>
                      <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                        {k.nietWij}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Eerst naar de arts ── */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-24">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <div>
                <Label opDonker>Eerst ergens anders</Label>
                <h2 className="diba-display-m mt-4 max-w-[16ch]">
                  Soms sturen we je
                  <span className="diba-accent-on-dark"> juist weg.</span>
                </h2>
                <p className="mt-6 max-w-[44ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                  Een huidkliniek ziet soms iets eerder dan er een diagnose
                  bestaat. Dan is de juiste stap niet een traject aanbieden maar
                  zeggen waar je wel moet zijn.
                </p>
                <Link
                  href="/dit-behandelen-wij-niet"
                  className="diba-label mt-8 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white"
                >
                  Wat we nog meer niet doen
                </Link>
              </div>

              <ul className="space-y-4">
                {metArts.map((k) => (
                  <li
                    key={k.id}
                    className="rounded-[var(--r-md)] bg-white/10 p-6 sm:p-7"
                  >
                    <p className="text-[17px] leading-7 font-medium">{k.kop}</p>
                    <p className="mt-3 text-[15px] leading-7 text-[var(--on-dark-accent)]">
                      {k.arts}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Afsluiter ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Als je toch wil beginnen</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Dan weten we
              <br />
              <span className="diba-accent">eerst wat er is.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Een traject begint met een meting, en bij PCOS is dat extra
              zinvol: je huid beweegt mee met periodes, dus zonder nulpunt is
              later niet te zien of iets werkte of dat het gewoon een rustige
              maand was.
            </p>
            <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              Loopt er al iets bij je huisarts of gynaecoloog, zeg dat dan bij de
              intake. Niet omdat wij daar iets mee doen, maar omdat het uitmaakt
              voor wat wij op welk moment aanraden.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Start je intake
              </Link>
              <Link
                href="/huidprofiel"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Of stel eerst je huidprofiel samen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
