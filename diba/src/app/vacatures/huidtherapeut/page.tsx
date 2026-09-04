import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import BeeldVignet from "@/components/ui/BeeldVignet";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { PillarFaq, SectieKop } from "@/components/pillar/PillarSecties";
import ProofBar from "@/components/ui/ProofBar";
import {
  vacatureBeschrijvingHtml,
  vacatureGeldigTot,
  vacatureKenmerk,
  vacatureVoorSlug,
} from "@/data/vacatures";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, jobPostingSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import {
  DIBA_ADDRESS,
  DIBA_EMAIL,
  DIBA_PROOF_STRIP_ITEMS,
  DIBA_SITE,
  DIBA_SITE_URL,
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Vacature huidtherapeut.
 *
 * WAAROM DEZE PAGINA BESTAAT NAAST /werken-bij.
 *
 * Op /werken-bij stond deze functie als kaartje met een mailto eronder. Dat werkt voor
 * iemand die de site al gevonden heeft. Wie "huidtherapeut vacature rotterdam" typt komt
 * daar nooit, want die pagina heet "Werken bij Diba" en gaat over drie functies tegelijk.
 * Een zoekmachine kan er dus niet uit opmaken dat hij over deze ene vacature gaat.
 *
 * WAT DEZE PAGINA DAARVOOR DOET.
 *
 * - Het adres is /vacatures/huidtherapeut: de zoekterm staat in het pad.
 * - De tabtitel is "Vacature huidtherapeut Rotterdam", precies wat mensen intypen.
 * - JobPosting-structuurdata, waarmee de vacature in Google for Jobs kan komen. Dat blok
 *   staat boven de gewone tien resultaten en trekt daar de kliks weg.
 * - Een FAQPage via PillarFaq, waarmee de vragen als uitklappers in het resultaat kunnen
 *   komen te staan.
 * - Een kruimelpad met BreadcrumbList, zodat het resultaat het pad toont in plaats van de
 *   kale URL.
 *
 * De sitemap pikt deze route zelf op; die leest de app-map uit.
 *
 * WAT ER NOG MIST.
 *
 * Het salaris. `baseSalary` is de sterkste aanbeveling die Google doet en vacatures mét
 * salaris doen het aantoonbaar beter, maar de schaal staat nergens en die verzin ik niet.
 * Zodra hij bekend is: invullen in `vacatures.ts` en doorgeven aan `jobPostingSchema`.
 */

const SLUG = "huidtherapeut";
const PAD = `/vacatures/${SLUG}`;

const vacature = vacatureVoorSlug(SLUG);

export const metadata: Metadata = zoekmachineVelden({
  pad: PAD,
  titel: vacature?.tabTitel ?? "Vacature huidtherapeut Rotterdam",
  omschrijving: vacature?.omschrijving ?? "",
});

const ANKERS = [
  { id: "wat-je-doet", label: "Wat je doet" },
  { id: "wat-we-vragen", label: "Wat we vragen" },
  { id: "sollicitatie", label: "Solliciteren" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function VacatureHuidtherapeutPage() {
  const v = vacature;
  if (!v) notFound();

  const url = `${DIBA_SITE_URL}${PAD}`;
  const mailto = `mailto:${DIBA_EMAIL}?subject=${encodeURIComponent(v.onderwerp)}`;

  /* De feiten die een sollicitant als eerste zoekt, en die een-op-een in de
     structuurdata terugkomen. Twee bronnen die uit elkaar lopen is erger dan geen. */
  const FEITEN = [
    { label: "Functie", waarde: v.functie },
    { label: "Dienstverband", waarde: "Parttime of fulltime" },
    { label: "Uren", waarde: v.urenPerWeek },
    { label: "Locatie", waarde: `${DIBA_ADDRESS.city}-Noord` },
  ];

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={jobPostingSchema({
          functie: v.functie,
          beschrijvingHtml: vacatureBeschrijvingHtml(v),
          kenmerk: vacatureKenmerk(v),
          geplaatst: v.geplaatst,
          geldigTot: vacatureGeldigTot(v),
          dienstverband: v.dienstverband,
          url,
          siteUrl: DIBA_SITE_URL,
          organisatie: {
            name: DIBA_SITE.legalName,
            logo: `${DIBA_SITE_URL}/images/diba-logo-dark.png`,
          },
          adres: {
            street: DIBA_ADDRESS.street,
            postalCode: DIBA_ADDRESS.postalCode,
            city: DIBA_ADDRESS.city,
            country: DIBA_ADDRESS.country,
          },
          opleidingsniveau: "bachelor degree",
          /* Starters zijn welkom, dus nul maanden. Zie de eerste vraag in de FAQ. */
          maandenErvaring: 0,
          vaardigheden: [
            "Huidtherapie",
            "Huidanalyse",
            "Laserbehandeling",
            "IPL",
            "Microneedling",
            "Chemische peelings",
            "Mesotherapie",
            "Acnebehandeling",
            "Pigmentbehandeling",
          ],
          branche: "Huidtherapie en huidverbetering",
          urenPerWeek: v.urenPerWeek,
        })}
      />
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Werken bij Diba", url: `${DIBA_SITE_URL}/werken-bij` },
          { name: `Vacature ${v.functie.toLowerCase()}`, url },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:py-20">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/werken-bij" className="hover:text-[var(--g-700)]">
                Werken bij Diba
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Huidtherapeut</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[21ch]">
              {v.paginaTitel.kop}{" "}
              <span className="diba-accent">{v.paginaTitel.accent}</span>
            </h1>

            {v.intro.map((alinea) => (
              <p
                key={alinea.slice(0, 40)}
                className="mt-6 max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]"
              >
                {publicCopy(alinea)}
              </p>
            ))}

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href={mailto}>Solliciteer op deze functie</Button>
              <Button
                href={DIBA_WHATSAPP_URL}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Eerst een vraag stellen
              </Button>
            </div>

            <p className="mt-6 text-[15px] leading-7 text-[var(--t-muted)]">
              Liever bellen? Dat kan op{" "}
              <a
                href={DIBA_TELEFOON_HREF}
                className="font-medium text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                {DIBA_TELEFOON}
              </a>
              .
            </p>
          </div>

          {/* De feiten waar een sollicitant als eerste naar zoekt. */}
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-10">
            <Label opDonker>In het kort</Label>
            <dl className="mt-6 divide-y divide-white/15">
              {FEITEN.map((f) => (
                <div
                  key={f.label}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4 first:pt-0 last:pb-0"
                >
                  <dt className="diba-label diba-label-on-dark">{f.label}</dt>
                  <dd className="text-[16px] leading-7 text-[var(--on-dark-accent)]">
                    {f.waarde}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-t border-white/15 pt-5 text-[14px] leading-6 text-[var(--on-dark-body)]">
              {DIBA_ADDRESS.line}. Geplaatst op{" "}
              <time dateTime={v.geplaatst}>
                {new Date(v.geplaatst).toLocaleDateString("nl-NL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              .
            </p>
          </div>
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      <nav
        aria-label="Op deze pagina"
        className="sticky top-[var(--nav-h)] z-20 bg-[var(--g-010)]/95 backdrop-blur"
      >
        <ul className="mx-auto flex gap-6 overflow-x-auto px-5 py-4 sm:px-9 lg:px-[7.5vw]">
          {ANKERS.map((a) => (
            <li key={a.id}>
              <a
                href={`#${a.id}`}
                className="diba-label whitespace-nowrap hover:text-[var(--g-700)]"
              >
                {a.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Wat je doet ── */}
      <section
        id="wat-je-doet"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De functie"
            kop="Wat je"
            accent="doet"
            raster="gelijk"
            intro="Je draait een eigen spreekuur: je meet, je stelt het plan op en je voert het zelf uit. Vier onderdelen die elke week terugkomen."
          />

          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {v.watJeDoet.map((w) => (
              <li
                key={w.kop}
                className="rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <h3 className="diba-card-title">{w.kop}</h3>
                {/* Vijf regelhoogtes gereserveerd, zodat de vier kaarten even hoog
                    blijven ook als een zin net omvalt. */}
                <p className="mt-3 min-h-[5lh] text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(w.zin)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-9 lg:px-[7.5vw] lg:py-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/team-gang-koffie.jpg"
            alt="Twee huidtherapeuten met koffie in de gang van Diba Clinics in Rotterdam"
            onderschrift="Tussen twee afspraken door"
            sizes="(min-width: 1024px) 86vw, 92vw"
            brandpunt={12}
            className="aspect-[16/10] lg:aspect-[2/1]"
          />
        </div>
      </section>

      {/* ── Wat we vragen en wat we bieden ── */}
      <section
        id="wat-we-vragen"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-050)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Over en weer"
            kop="Wat we vragen"
            accent="en bieden"
            intro="Links de eisen die er echt toe doen, rechts wat daar bij Diba tegenover staat. Beide lijsten zijn even lang, met opzet."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <Label>Wat we vragen</Label>
              <ul className="mt-5 space-y-3">
                {v.watWeVragen.map((eis) => (
                  <li
                    key={eis}
                    className="rounded-[var(--r-sm)] bg-white p-5 text-[16px] leading-7 text-[var(--t-body)]"
                  >
                    {publicCopy(eis)}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label>Wat we bieden</Label>
              <ul className="mt-5 space-y-3">
                {v.watWeBieden.map((punt) => (
                  <li
                    key={punt}
                    className="rounded-[var(--r-sm)] bg-[var(--g-700)] p-5 text-[16px] leading-7 text-[var(--on-dark-body)]"
                  >
                    {publicCopy(punt)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── De sollicitatie ── */}
      <section
        id="sollicitatie"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Hoe het gaat"
            kop="Van mail tot"
            accent="meeloopdag"
            raster="gelijk"
            intro="Drie stappen, en je weet vooraf wat er komt. Er zit geen assessment in en geen ronde met vijf mensen aan tafel."
          />

          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {v.sollicitatie.map((stap) => (
              <li
                key={stap.kop}
                className="rounded-[var(--r-md)] bg-white p-7 sm:p-8"
              >
                <p className="diba-card-title text-[var(--t-strong)]">
                  {stap.kop}
                </p>
                <p className="mt-3 min-h-[4lh] text-[15px] leading-7 text-[var(--t-body)]">
                  {publicCopy(stap.zin)}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button href={mailto}>Solliciteer op deze functie</Button>
            <Link
              href="/werken-bij"
              className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              Alle vacatures bij Diba
            </Link>
          </div>
        </div>
      </section>

      <PillarFaq items={v.faq} onderwerp="deze vacature" />

      {/* ── Afsluiter ── */}
      <section className="px-5 pt-16 sm:px-9 lg:px-[7.5vw] lg:pt-20">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <Label opDonker>Solliciteren</Label>
            <h2 className="diba-display-m mt-4 max-w-[22ch]">
              Stuur je cv, de rest{" "}
              <span className="diba-accent-on-dark">bespreken we</span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              Een motivatiebrief hoeft niet. Een paar regels over waar je nu
              werkt en wat je zoekt is genoeg, en binnen een week hoor je iets.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={mailto}
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white"
              >
                Mail je sollicitatie
              </a>
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/25 px-6 text-[var(--on-dark)] transition-colors hover:bg-white/10"
              >
                Stel een vraag via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
