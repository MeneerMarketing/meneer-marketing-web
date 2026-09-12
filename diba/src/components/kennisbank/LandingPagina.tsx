import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import PillarNav from "@/components/pillar/PillarNav";
import {
  PillarCta,
  PillarFaq,
  SectieKop,
  WelNiet,
} from "@/components/pillar/PillarSecties";
import ReviewsBijOnderwerp from "@/components/reviews/ReviewsBijOnderwerp";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import LeesVerder from "@/components/ui/LeesVerder";
import { LANDINGS, landingNaam } from "@/data/landings";
import { euro, TWIJFEL_WHATSAPP, type Landing } from "@/data/landings/types";
import { publicCopy } from "@/lib/copy-flags";
import {
  behandelingSchema,
  breadcrumbSchema,
  dienstSchema,
  medischePaginaSchema,
  SchemaMarkup,
} from "@/lib/schema";
import {
  DIBA_ADDRESS,
  DIBA_OPENINGSTIJDEN,
  DIBA_SITE_URL,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Het sjabloon voor een landingspagina in de kennisbank.
 *
 * De eerste versie hiervan was de HydraFacial-pagina, met de hand gebouwd en op
 * 11 september 2026 goedgekeurd. Dit is die pagina met de inhoud eruit gehaald, zodat elke
 * volgende pagina precies dezelfde opbouw en dezelfde maten krijgt.
 *
 * DE VOLGORDE IS DE TRECHTER.
 *
 * 1. Het antwoord: wat het is, waar, hoe lang, wat het kost. Wie alleen dat zoekt is klaar,
 *    en dat is de bedoeling. Een pagina die pas na drie schermen antwoord geeft verliest van
 *    een pagina die het meteen doet, bij Google en bij een taalmodel.
 * 2. De werking, beginnend bij de huid en niet bij het apparaat.
 * 3. Het onderscheid: het apparaat, het merk of de titel. Geschreven zodat het ook bruikbaar
 *    is als je hier níet komt.
 * 4. Het tarief, met de intakeregeling er compleet bij.
 * 5. Wat wel en wat niet.
 * 6. De vergelijkingstabel met wat wij verder doen.
 * 7. Waar we staan en wie het doet.
 * 8. Reviews, vragen, de andere landingspagina's, en pas dan de uitnodiging.
 *
 * HET SCHEMA.
 *
 * BreadcrumbList, MedicalWebPage met de wijzigingsdatum, MedicalProcedure als de pagina over
 * één behandeling gaat, Service met een Offer per tarief, en FAQPage (die zit in
 * `PillarFaq`). De controleur staat bewust niet in MedicalWebPage: die naam komt er pas in
 * als Rojda de tekst echt heeft nagekeken. Zie `medischePaginaSchema`.
 *
 * TWEE DONKERGROENE VLAKKEN (§5): de hero en de afsluiter.
 */

const LINK =
  "text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]";
const LINK_OP_DONKER = "hover:text-white";
const LABELLINK =
  "diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]";

/** `[tekst](/pad)` in lopende tekst. Alleen interne paden. */
const LINKPATROON = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

/** Een alinea met de redactievlaggen eruit en de links erin. */
function metLinks(tekst: string): ReactNode[] {
  const schoon = publicCopy(tekst);
  const delen: ReactNode[] = [];
  let vanaf = 0;
  for (const m of schoon.matchAll(LINKPATROON)) {
    const begin = m.index ?? 0;
    if (begin > vanaf) delen.push(schoon.slice(vanaf, begin));
    delen.push(
      <Link key={`${m[2]}-${begin}`} href={m[2]} className={LINK}>
        {m[1]}
      </Link>,
    );
    vanaf = begin + m[0].length;
  }
  if (vanaf < schoon.length) delen.push(schoon.slice(vanaf));
  return delen;
}

/** Een cel die alleen uit een bedrag bestaat: "€ 180", "vanaf € 75". */
const BEDRAG = /^(vanaf\s+)?€\s?[\d.,]+$/i;

/** Dezelfde tekst zonder opmaak, voor het schema. */
function kaal(tekst: string): string {
  return publicCopy(tekst).replace(LINKPATROON, "$1");
}

const SECTIE =
  "scroll-mt-[var(--anker-offset)] px-5 py-12 sm:px-9 sm:py-20 lg:px-[7.5vw] lg:py-28";

export default function LandingPagina({ landing: l }: { landing: Landing }) {
  const pad = `/kennisbank/${l.slug}`;
  const url = `${DIBA_SITE_URL}${pad}`;
  const naam = landingNaam(l);
  const gewijzigd = new Date(l.gewijzigd).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const helft = Math.ceil(l.werking.alineas.length / 2);
  const links = l.werking.alineas.slice(0, helft);
  const rechts = l.werking.alineas.slice(helft);

  /* Een vraagpagina heeft geen eigen tarief, en dus ook geen anker ernaartoe. */
  const tarief = l.tarief;
  const soort = l.soort ?? "plaats";

  const ankers = [
    { id: "werking", label: l.werking.anker },
    { id: "onderscheid", label: l.onderscheid.anker },
    ...(tarief ? [{ id: "tarief", label: tarief.anker }] : []),
    { id: "wel-niet", label: "Voor wie" },
    { id: "vergelijking", label: l.vergelijking.anker },
    { id: "rotterdam", label: "Waar we zitten" },
    { id: "vragen", label: "Vragen" },
  ];

  /* De pillen onderaan staan in twee rijen: eerst de pagina's van dezelfde soort, dan die
     van de andere. Zonder dat onderscheid stonden er vraagpagina's onder de kop "Ook bij
     ons in Rotterdam", en dat is precies wat ze niet zijn. De tweede rij is er wel, want
     daarmee krijgt elke vraagpagina in één keer een verwijzing vanaf alle plaatspagina's. */
  const pilrijen = [
    {
      label: soort === "vraag" ? "Meer uitgezocht" : "Ook bij ons in Rotterdam",
      items: LANDINGS.filter(
        (x) => x.slug !== l.slug && (x.soort ?? "plaats") === soort,
      ),
    },
    {
      label: soort === "vraag" ? "Ook bij ons in Rotterdam" : "Ook uitgezocht",
      items: LANDINGS.filter((x) => (x.soort ?? "plaats") !== soort),
    },
  ].filter((rij) => rij.items.length);

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Kennisbank", url: `${DIBA_SITE_URL}/kennisbank` },
          { name: naam, url },
        ])}
      />
      <SchemaMarkup
        data={medischePaginaSchema({
          url,
          siteUrl: DIBA_SITE_URL,
          naam,
          omschrijving: kaal(l.antwoord),
          gewijzigd: l.gewijzigd,
          ...(l.schema.procedure
            ? { overProcedure: `${url}#behandeling` }
            : {}),
          beeld: `${DIBA_SITE_URL}${l.beeld.src}`,
        })}
      />
      {l.schema.procedure ? (
        <SchemaMarkup
          data={{
            ...behandelingSchema({
              name: l.schema.procedure.naam,
              description: kaal(l.schema.procedure.omschrijving),
              url,
              siteUrl: DIBA_SITE_URL,
            }),
            "@id": `${url}#behandeling`,
          }}
        />
      ) : null}
      {/* Een Service komt er alleen in met de tarieven erbij. Een aanbod zonder bedrag
          hoort niet in het schema, en een bedrag dat niet op de pagina staat al helemaal
          niet. Op een vraagpagina blijft het dus bij MedicalWebPage en FAQPage. */}
      {l.schema.dienst && tarief ? (
        <SchemaMarkup
          data={dienstSchema({
            naam: l.schema.dienst.naam,
            soort: l.schema.dienst.soort,
            omschrijving: kaal(l.antwoord),
            url,
            siteUrl: DIBA_SITE_URL,
            gebied: ["Rotterdam"],
            varianten: tarief.rijen.map((r) => ({
              naam: r.naam,
              prijs: r.prijs,
              ...(r.vanaf ? { zin: `Vanaf ${euro(r.prijs)}` } : {}),
            })),
          })}
        />
      ) : null}

      {/* ── Hero (donkergroen 1 van 2) ────────────────────────────────────── */}
      <section className="bg-[var(--g-700)] text-[var(--on-dark)]">
        <div className="mx-auto grid gap-6 px-5 pb-10 sm:px-9 sm:pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10 lg:px-[7.5vw] lg:pb-0">
          <div className="py-10 sm:py-14 lg:py-20 max-lg:pb-0">
            <nav
              aria-label="Kruimelpad"
              className="diba-label diba-label-on-dark flex flex-wrap gap-2"
            >
              <Link href="/" className={LINK_OP_DONKER}>
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/kennisbank" className={LINK_OP_DONKER}>
                Kennisbank
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--on-dark)]">{l.kruimel}</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[18ch]">
              {l.h1.kop}{" "}
              <span className="diba-accent-on-dark">{l.h1.accent}</span>
            </h1>

            {/* Het antwoordblok. Eén alinea die los van de pagina te lezen is, want zo
                wordt hij ook los aangehaald: in een uitgelicht resultaat bij Google en in
                een antwoord van een taalmodel. Daarom staat er geen inleidende zin voor en
                geen verwijzing naar "hieronder". */}
            <p className="mt-7 max-w-[56ch] text-[17px] leading-8 text-[var(--on-dark-body)]">
              {kaal(l.antwoord)}
            </p>

            <div className="diba-knoprij mt-8">
              <Button href="/afspraak" variant="primair-op-donker">
                Plan een afspraak
              </Button>
              <Button
                href={tarief ? "#tarief" : "/tarieven"}
                variant="secundair-op-donker"
              >
                Bekijk de tarieven
              </Button>
            </div>

            {/* De vier feiten: waarvoor iemand de pagina opent, en ze bevestigen het
                antwoordblok in plaats van het te herhalen. */}
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {l.feiten.map((f) => (
                <div key={f.kop} className="min-w-0">
                  <dt className="diba-label diba-label-on-dark">{f.kop}</dt>
                  <dd className="mt-1.5 text-[16px] leading-6 font-medium text-[var(--on-dark)]">
                    {f.waarde}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--r-lg)] max-lg:mb-10 lg:aspect-auto lg:h-[32rem] lg:self-end">
            <Image
              src={l.beeld.src}
              alt={l.beeld.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <PillarNav ankers={ankers} />

      {/* ── De werking ────────────────────────────────────────────────────── */}
      <section id="werking" className={`${SECTIE} bg-white`}>
        <SectieKop
          label={l.werking.label}
          kop={l.werking.kop}
          accent={l.werking.accent}
          intro={l.werking.intro}
          raster="gelijk"
        />
        <div className="mt-8 grid gap-6 sm:mt-12 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-5">
            {links.map((a, i) => (
              <p key={i} className="text-[17px] leading-8 text-[var(--t-body)]">
                {metLinks(a)}
              </p>
            ))}
          </div>
          <div className="space-y-5">
            {rechts.map((a, i) => (
              <p key={i} className="text-[17px] leading-8 text-[var(--t-body)]">
                {metLinks(a)}
              </p>
            ))}
            {l.werking.verder ? (
              <p className="text-[16px] leading-7 text-[var(--t-muted)]">
                {metLinks(l.werking.verder)}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── Het onderscheid ───────────────────────────────────────────────── */}
      <section id="onderscheid" className={`${SECTIE} bg-[var(--g-050)]`}>
        <SectieKop
          label={l.onderscheid.label}
          kop={l.onderscheid.kop}
          accent={l.onderscheid.accent}
          intro={l.onderscheid.intro}
          raster="gelijk"
        />
        <div className="mt-8 grid gap-8 sm:mt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="space-y-5">
            {l.onderscheid.alineas.map((a, i) => (
              <p key={i} className="text-[17px] leading-8 text-[var(--t-body)]">
                {metLinks(a)}
              </p>
            ))}
            {l.onderscheid.knop ? (
              <Button href={l.onderscheid.knop.href} variant="secundair">
                {l.onderscheid.knop.tekst}
              </Button>
            ) : null}
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--r-lg)] lg:aspect-[3/4]">
            <Image
              src={l.onderscheid.beeld.src}
              alt={l.onderscheid.beeld.alt}
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Tarief en afspraak, alleen op een plaatspagina ─────────────────── */}
      {tarief ? (
        <section id="tarief" className={`${SECTIE} bg-white`}>
          <SectieKop
            label={tarief.label}
            kop={tarief.kop}
            accent={tarief.accent}
            intro={tarief.intro}
            raster="gelijk"
          />

          <div className="mt-8 grid gap-6 sm:mt-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div>
              <ul className="space-y-3">
                {tarief.rijen.map((r) => (
                  <li
                    key={r.naam}
                    className="flex items-baseline justify-between gap-4 rounded-[var(--r-md)] bg-[var(--g-050)] px-5 py-4"
                  >
                    <span className="text-[16px] leading-6 font-medium">
                      {r.naam}
                    </span>
                    <span className="shrink-0 text-[18px] leading-6 font-medium tabular-nums">
                      {r.vanaf ? "vanaf " : ""}
                      {euro(r.prijs)}
                    </span>
                  </li>
                ))}
              </ul>
              {tarief.zin ? (
                <p className="mt-5 text-[15px] leading-7 text-[var(--t-muted)]">
                  {metLinks(tarief.zin)}
                </p>
              ) : null}
              <Link
                href="/tarieven"
                className={`${LABELLINK} mt-5 inline-flex`}
              >
                Alle tarieven van de kliniek
              </Link>
            </div>

            <div className="space-y-4">
              {tarief.afspraak.map((stap) => (
                <div
                  key={stap.kop}
                  className="rounded-[var(--r-md)] border border-[var(--g-100)] p-6"
                >
                  <h3 className="text-[17px] leading-6 font-medium">
                    {stap.kop}
                  </h3>
                  <p className="mt-2 text-[16px] leading-7 text-[var(--t-body)]">
                    {metLinks(stap.zin)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Wel en niet ───────────────────────────────────────────────────── */}
      <WelNiet
        wel={l.welNiet.wel}
        niet={l.welNiet.niet}
        intro={l.welNiet.intro}
      />

      {/* ── De vergelijking ───────────────────────────────────────────────────
          Een echte tabel en geen rij kaarten. Vergelijken doe je per kolom, en een tabel
          is het enige wat letterlijk overgenomen wordt als iemand de vraag aan een
          taalmodel stelt. Op een telefoon schuift hij binnen zijn eigen vlak. */}
      <section id="vergelijking" className={`${SECTIE} bg-white`}>
        <SectieKop
          label={l.vergelijking.label}
          kop={l.vergelijking.kop}
          accent={l.vergelijking.accent}
          intro={l.vergelijking.intro}
          raster="gelijk"
        />

        <div className="diba-schuifrij mt-8 sm:mt-12">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">{l.vergelijking.bijschrift}</caption>
            <thead>
              <tr className="border-b border-[var(--g-200)]">
                {l.vergelijking.kolommen.map((k, i) => (
                  <th
                    key={k}
                    scope="col"
                    className={`diba-label py-3 ${i < l.vergelijking.kolommen.length - 1 ? "pr-4" : ""}`}
                  >
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {l.vergelijking.rijen.map((r) => (
                <tr
                  key={r.naam}
                  className="border-b border-[var(--g-100)] align-top"
                >
                  <th scope="row" className="py-4 pr-4 font-medium">
                    {r.href ? (
                      <Link
                        href={r.href}
                        className={`inline-flex min-h-11 items-center text-[16px] leading-6 ${LINK}`}
                      >
                        {r.naam}
                      </Link>
                    ) : (
                      <span className="inline-flex min-h-11 items-center text-[16px] leading-6">
                        {r.naam}
                      </span>
                    )}
                  </th>
                  {r.cellen.map((c, i) => {
                    const tekst = publicCopy(c);
                    /* Alleen een cel die echt een bedrag is, krijgt de opmaak van een
                       bedrag: vet, cijfers onder elkaar en niet afbreken. Een zin met een
                       bedrag erin blijft een zin en breekt gewoon af. */
                    const bedrag = BEDRAG.test(tekst);
                    return (
                      <td
                        key={i}
                        className={`py-4 text-[15px] leading-7 ${
                          bedrag
                            ? "font-medium whitespace-nowrap text-[var(--t-strong)] tabular-nums"
                            : "max-w-[28rem] text-[var(--t-body)]"
                        } ${i < r.cellen.length - 1 ? "pr-4" : ""}`}
                      >
                        {tekst}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Waar we zitten en wie het doet ────────────────────────────────── */}
      <section id="rotterdam" className={`${SECTIE} bg-[var(--g-050)]`}>
        <SectieKop
          label="De kliniek"
          kop="Waar je ons vindt"
          accent="in Rotterdam"
          intro="Aan de noordkant van de stad, in een woonwijk en niet in een winkelstraat. Dat scheelt bij het parkeren en het is rustiger als je net behandeld bent."
          raster="gelijk"
        />

        <div className="mt-8 grid gap-6 sm:mt-12 lg:grid-cols-3 lg:gap-8">
          <div className="rounded-[var(--r-md)] bg-white p-6 sm:p-8">
            <Label>Adres</Label>
            <address className="mt-4 text-[17px] leading-8 not-italic">
              {DIBA_ADDRESS.street}
              <br />
              {DIBA_ADDRESS.postalCode} {DIBA_ADDRESS.city}
            </address>
            <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
              Je parkeert in de straat. De route vanaf de ring en met het
              openbaar vervoer staat op de contactpagina.
            </p>
            <Link href="/contact" className={`${LABELLINK} mt-5 inline-flex`}>
              Route en contact
            </Link>
          </div>

          <div className="rounded-[var(--r-md)] bg-white p-6 sm:p-8">
            <Label>Openingstijden</Label>
            <dl className="mt-4 space-y-1.5">
              {DIBA_OPENINGSTIJDEN.map((d) => (
                <div
                  key={d.dag}
                  className="flex items-baseline justify-between gap-4 text-[15px] leading-7"
                >
                  <dt className="text-[var(--t-body)]">{d.label}</dt>
                  <dd className="tabular-nums">
                    {d.van && d.tot ? `${d.van} tot ${d.tot}` : "Gesloten"}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[15px] leading-7 text-[var(--t-muted)]">
              De agenda is actueler dan dit rijtje: binnen openingstijden staat
              niet elk uur een behandelaar vrij.
            </p>
          </div>

          <div className="rounded-[var(--r-md)] bg-white p-6 sm:p-8">
            <Label>{l.wie.label}</Label>
            <p className="mt-4 text-[15px] leading-7 text-[var(--t-body)]">
              {metLinks(l.wie.zin)}
            </p>
            <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
              Wie er werkt, met welke titel en wat die titel precies inhoudt,
              staat met foto en al op de teampagina.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/team" className={LABELLINK}>
                Het team
              </Link>
              <Link href="/kwaliteit-en-registraties" className={LABELLINK}>
                Onze registraties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews, alleen als ze over dit onderwerp gaan ────────────────── */}
      {l.reviews ? (
        <ReviewsBijOnderwerp
          onderwerp={l.reviews.onderwerp}
          intro={l.reviews.intro}
          reeks={l.reviews.reeks}
        />
      ) : null}

      {/* ── Vragen ────────────────────────────────────────────────────────── */}
      <PillarFaq items={l.faq} onderwerp={naam} />

      {/* ── Twijfel, en de andere landingspagina's ────────────────────────── */}
      <section className="bg-white px-5 py-12 sm:px-9 sm:py-16 lg:px-[7.5vw]">
        <div className="mx-auto max-w-[70ch]">
          <Label>Twijfel je</Label>
          <h2 className="diba-display-m mt-4">
            {l.twijfel.voor}{" "}
            <span className="diba-accent">{l.twijfel.accent}</span>
            {l.twijfel.na ? ` ${l.twijfel.na}` : ""}
          </h2>
          <p className="mt-6 text-[17px] leading-8 text-[var(--t-body)]">
            {metLinks(l.twijfel.zin)}
          </p>
          <LeesVerder>
            <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              {TWIJFEL_WHATSAPP}
            </p>
          </LeesVerder>
          <p className="mt-8 text-[14px] leading-6 text-[var(--t-muted)]">
            Laatst bijgewerkt op {gewijzigd}. Tarieven en behandeltijden worden
            bij elke wijziging nagelopen.
          </p>

          {/* De andere landingspagina's. Een landingspagina waar niets naartoe wijst
              wordt traag gevonden en zelden herbezocht; dit rijtje geeft elke pagina een
              verwijzing vanaf alle andere, met de naam van de pagina als ankertekst. */}
          {pilrijen.map((rij) => (
            <nav
              key={rij.label}
              aria-label={rij.label}
              className="mt-12 border-t border-[var(--g-100)] pt-8"
            >
              <Label>{rij.label}</Label>
              <ul className="mt-4 flex flex-wrap gap-2">
                {rij.items.map((x) => (
                  <li key={x.slug} className="max-w-full">
                    <Link
                      href={`/kennisbank/${x.slug}`}
                      className="diba-label inline-flex min-h-11 max-w-full items-center rounded-[var(--r-pill)] border border-[var(--g-200)] px-4 whitespace-nowrap text-[var(--g-700)] transition-colors hover:border-[var(--g-700)] hover:bg-[var(--g-025)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                    >
                      {landingNaam(x)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </section>

      {/* ── De volgende stap (donkergroen 2 van 2) ────────────────────────── */}
      <PillarCta
        kop={l.cta.kop}
        accent={l.cta.accent}
        tekst={l.cta.tekst}
        topic={l.cta.topic}
        whatsappHref={DIBA_WHATSAPP_URL}
      />
    </main>
  );
}
