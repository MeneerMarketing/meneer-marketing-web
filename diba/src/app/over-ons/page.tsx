import type { Metadata } from "next";
import Link from "next/link";
import BeeldVignet from "@/components/ui/BeeldVignet";
import Label from "@/components/ui/Label";
import { APPARATUUR } from "@/data/apparatuur";
import { BEHANDELINGEN } from "@/data/behandelingen";
import { TEAM } from "@/data/team";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_ADDRESS,
  DIBA_PROOF,
  DIBA_SALONIZED_RATING,
  DIBA_SALONIZED_REVIEWS_URL,
  DIBA_SITE,
  DIBA_SITE_URL,
} from "@/lib/site";

/**
 * Over ons.
 *
 * WAAROM DEZE PAGINA OVER CIJFERS GAAT EN NIET OVER GEVOEL.
 *
 * Een over-onspagina schrijft zichzelf vol met passie voor de huid en oog voor detail.
 * Dat zegt niets, want elke kliniek schrijft het. Wat wel iets zegt zijn de vier getallen
 * die hier al vastliggen, en die staan op de proofstrip van elke pagina.
 *
 * De signatuur van deze pagina is wat daarop volgt: bij elk getal staat wat het níet
 * zegt. Achtendertighonderd reviews betekent dat veel mensen tevreden weggingen; het
 * betekent niet dat jouw behandeling gaat werken. Dat onderscheid maakt geen enkele
 * kliniek, en het is precies waarom deze site te vertrouwen is.
 *
 * WAT HIER NIET STAAT.
 *
 * Het persoonlijke oprichtingsverhaal. Rojda Sahin staat als founder op hun eigen site en
 * dat is een feit; hoe ze hier gekomen is, is haar verhaal en niet het mijne om te
 * schrijven. Op /ons-verhaal staat waar de kliniek voor staat, wat wel uit de werkwijze af
 * te leiden is. [COPY-NODIG: het persoonlijke verhaal van Rojda, van haarzelf]
 *
 * Eerder stond hier "3054 HG Rotterdam" hardgecodeerd. De echte postcode is 3054 LS en
 * staat in `site.ts`; die wordt nu ingelezen zodat hij op één plek klopt.
 *
 * Eén donkergroen vlak: wat de cijfers niet zeggen (§5).
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/over-ons",
  titel: "Over ons",
  omschrijving: `Diba Clinics in ${DIBA_SITE.neighborhood}, ${DIBA_ADDRESS.city}. Actief sinds ${DIBA_PROOF.activeSince}, ${TEAM.length} mensen, ${APPARATUUR.length} apparaten. En wat die cijfers niet zeggen.`,
});

/**
 * De cijfers, en wat je eraan hebt.
 *
 * Onder elk cijfer stond een regel die met "Niet dat ..." begon: waarom dit getal niets
 * over jou zegt. Vier keer, op de pagina waar iemand komt kijken of dit een serieuze
 * kliniek is. Er stond zelfs "Er zijn klinieken die al twintig jaar hetzelfde verkeerd
 * doen", en dat is een uithaal naar de buren.
 *
 * De verwachting die die kolom moest temperen blijft staan, maar als opbrengst. Bij
 * "geholpen klanten" is dat nog steeds dat een gemiddelde niets zegt over jouw huid;
 * alleen staat het er nu als de reden dat er gemeten wordt.
 *
 * De getallen zelf komen uit `DIBA_PROOF` en `DIBA_SALONIZED_*`; dat zijn de enige cijfers
 * die deze site mag noemen (§11).
 *
 * [MEDISCHE-CHECK-ROJDA] de uitspraken over wat er te verwachten valt.
 */
const CIJFERS = [
  {
    waarde: String(DIBA_PROOF.activeSince),
    label: "Actief sinds",
    zegt: "De kliniek draait sinds 2017, met een team dat elke dag met dezelfde huidklachten werkt.",
    watJeEraanHebt:
      "Ervaring met hoe een klacht zich over maanden ontwikkelt, en niet alleen met de behandeling van vandaag.",
  },
  {
    waarde: DIBA_PROOF.helpedClients,
    label: "Geholpen klanten",
    zegt: "Genoeg verschillende huiden om te weten hoe verschillend ze reageren.",
    watJeEraanHebt:
      "Jouw huid krijgt een eigen meting, want een gemiddelde zegt niets over hoe die van jou zal reageren.",
  },
  {
    waarde: DIBA_PROOF.treatmentsPerformed,
    label: "Behandelingen",
    zegt: "Routine op de apparatuur. Wie iets duizend keer heeft gedaan ziet eerder wanneer het anders loopt.",
    watJeEraanHebt:
      "De behandelaar merkt sneller wanneer een huid anders reageert dan verwacht, en stelt de aanpak dan bij.",
  },
  {
    waarde: DIBA_PROOF.clientReviews,
    label: "Klantreviews",
    zegt: `Gemiddeld een ${DIBA_SALONIZED_RATING.toFixed(1).replace(".", ",")}. Openbaar na te lezen, niet door ons geselecteerd.`,
    watJeEraanHebt:
      "Je leest hoe mensen de afspraak zelf ervaren hebben, met de behandeling erbij die ze kregen.",
  },
];

export default function OverOnsPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Over ons", url: `${DIBA_SITE_URL}/over-ons` },
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
              <span className="text-[var(--t-muted)]">Over ons</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[21ch]">
              Een huidkliniek
              <br />
              <span className="diba-accent">in Rotterdam.</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Sinds {DIBA_PROOF.activeSince}, aan de {DIBA_ADDRESS.street}. Met{" "}
              {TEAM.length} mensen, {APPARATUUR.length} apparaten en{" "}
              {BEHANDELINGEN.length} behandelingen waarvan de prijzen allemaal
              openbaar zijn.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Onze huidtherapeuten staan ingeschreven in het Kwaliteitsregister
              Paramedici en de kliniek is aangesloten bij ANBOS.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Waar we vandaan komen</Label>
            <address className="mt-5 text-[19px] leading-8 not-italic text-[var(--t-strong)]">
              {DIBA_ADDRESS.street}
              <br />
              {DIBA_ADDRESS.postalCode} {DIBA_ADDRESS.city}
            </address>
            <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
              We zitten aan de noordkant van {DIBA_ADDRESS.city}, in een
              woonwijk en niet in een winkelstraat. Dat is te merken aan het
              tempo.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/contact"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
              >
                Route en contact
              </Link>
              <Link
                href="/team"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Wie er werken
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── De signatuur: wat de cijfers niet zeggen ── */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-20">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="max-w-[62ch]">
              <Label opDonker>Vier getallen</Label>
              <h2 className="diba-display-m mt-4 max-w-[20ch]">
                Wat klanten{" "}
                <span className="diba-accent-on-dark">over ons schrijven</span>
              </h2>
              <p className="mt-6 text-[16px] leading-7 text-[var(--on-dark-body)]">
                Vier getallen die zeggen hoe lang we dit doen en hoe vaak. Bij
                elk staat wat het voor jouw afspraak betekent.
              </p>
            </div>

            <ul className="mt-12 grid gap-4 md:grid-cols-2">
              {CIJFERS.map((c) => (
                <li
                  key={c.label}
                  className="rounded-[var(--r-lg)] bg-white/10 p-7 sm:p-8"
                >
                  <p className="text-[36px] leading-none font-medium tracking-[-.05em] tabular-nums">
                    {c.waarde}
                  </p>
                  <p className="diba-label diba-label-on-dark mt-2">
                    {c.label}
                  </p>
                  <p className="mt-5 text-[15px] leading-7 text-[var(--on-dark-body)]">
                    {c.zegt}
                  </p>
                  <p className="mt-4 border-t border-white/15 pt-4 text-[15px] leading-7 text-[var(--on-dark-accent)]">
                    {c.watJeEraanHebt}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-[62ch] text-[15px] leading-7 text-[var(--on-dark-body)]">
              De reviews worden verzameld door Salonized. Wij kunnen ze niet
              selecteren of verwijderen, dus je leest ze allemaal.
            </p>
            <a
              href={DIBA_SALONIZED_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="diba-label mt-6 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white"
            >
              Lees ze bij de bron
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Wat er in huis is ── */}
      {/* Het einde van een afspraak, en daarmee van deze pagina: iemand die met haar
          tas de deur uit loopt. De rest van de site gaat over wat er binnen gebeurt; dit
          is het enige beeld waarop iemand weer weggaat. */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-20">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/behandelkamer-overzicht.jpg"
            alt="Behandelaar en client in een behandelkamer van Diba Clinics"
            onderschrift="Waar het werk gebeurt"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/10] lg:aspect-[21/9]"
          />
        </div>
      </section>

      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Wat er in huis is</Label>
            <h2 className="diba-display-m mt-4">
              Onze <span className="diba-accent">apparatuur en het team.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Een laser doet het werk niet alleen. Welke golflengte, welke
              pulsduur en welke energie er bij jouw huidtype horen, bepaalt de
              huidtherapeut aan de hand van de meting. Hieronder staat waar we
              mee werken en wie ermee werkt.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                getal: String(APPARATUUR.length),
                kop: "apparaten",
                zin: "Van huidscanner tot alexandrietlaser. Per apparaat staat welke techniek erin zit en waarvoor hij is.",
                href: "/apparatuur",
                link: "Bekijk de apparatuur",
              },
              {
                getal: String(BEHANDELINGEN.length),
                kop: "behandelingen",
                zin: "Allemaal met het tarief per sessie erbij, en per variant. Wat je online ziet, is wat je betaalt.",
                href: "/prijzen",
                link: "Naar de prijzen",
              },
              {
                getal: String(TEAM.length),
                kop: "mensen",
                zin: "Huidtherapeuten met een hbo-bachelor en inschrijving in het Kwaliteitsregister Paramedici, plus orthomoleculair huidspecialisten.",
                href: "/team",
                link: "Naar het team",
              },
            ].map((k) => (
              <li
                key={k.kop}
                className="flex flex-col rounded-[var(--r-lg)] bg-white p-7 sm:p-8"
              >
                <p className="diba-display-s text-[var(--t-strong)]">
                  {k.getal}{" "}
                  <span className="text-[var(--t-muted)]">{k.kop}</span>
                </p>
                <p className="mt-4 flex-1 text-[15px] leading-7 text-[var(--t-body)]">
                  {k.zin}
                </p>
                <Link
                  href={k.href}
                  className="diba-label mt-6 inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                >
                  {k.link}
                  <span aria-hidden="true">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Doorverwijzing naar het verhaal ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Waarom zo</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Waar deze kliniek
              <br />
              <span className="diba-accent">voor staat</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Waarom er hier eerst gemeten wordt, waarom prijzen openbaar staan
              en waarom er bij elke behandeling staat wat hij niet kan: dat is
              een ander verhaal dan een opsomming van wat er in huis is. Het
              staat op een eigen pagina, in vijf regels waar we ons aan houden.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/ons-verhaal"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Lees ons verhaal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
