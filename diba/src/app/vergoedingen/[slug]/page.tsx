import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BelOfApp from "@/components/ui/BelOfApp";
import Label from "@/components/ui/Label";
import { INSURERS, INSURERS_GEZIEN_OP, insurerBySlug } from "@/data/insurers";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { zoekmachineVelden } from "@/lib/seo";
import VerzekeraarLogo from "@/components/vergoedingen/VerzekeraarLogo";
import {
  DIBA_SITE_URL,
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Vergoeding per verzekeraar.
 *
 * WAT HIER STOND.
 *
 * Drie kopjes met daaronder `[COPY-NODIG]`, wat door de vlaggenfilter niets werd. Zes live
 * pagina's dus met lege kopjes, bereikbaar vanaf /vergoedingen, die een antwoord beloofden
 * dat er niet was. Ik heb dat gat zelf groter gemaakt door de hoofdpagina wel af te maken.
 *
 * WAAROM DEZE PAGINA'S MOGEN BLIJVEN BESTAAN.
 *
 * Niet omdat wij weten wat jouw polis doet, want dat weten we niet. Wel omdat de weg naar
 * dat antwoord per verzekeraar echt verschilt: de een vraagt een verwijzing van de huisarts,
 * de ander deelt één budget over acne en ontharing, de derde hanteert een leeftijdsgrens.
 * Dat is wat een eigen pagina rechtvaardigt. Zes keer dezelfde tekst met een andere naam
 * erboven zou een doorslagpagina zijn, en die verbieden de huisregels terecht.
 *
 * WAT ER MET OPZET NIET STAAT.
 *
 * Bedragen, maxima en pakketnamen. Die veranderen per jaar en per polis. Wat er wel staat
 * is waar je het zelf vindt, met een link naar de bron, en de datum waarop ik daar keek.
 *
 * [BESLUIT-OKAN] de regel onder "waar het hier op vastloopt" per verzekeraar. Die komt van
 * hun openbare pagina's en niet uit jullie declaratiepraktijk; wat jullie in de praktijk
 * terugzien weegt zwaarder.
 *
 * Eén donkergroen vlak: de vier vragen (§5).
 */

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return INSURERS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const insurer = insurerBySlug(slug);
  if (!insurer) return { title: "Vergoedingen" };
  return zoekmachineVelden({
    pad: `/vergoedingen/${insurer.slug}`,
    titel: `Vergoeding ${insurer.name}`,
    omschrijving: `Waar je bij ${insurer.name} vindt wat jouw polis vergoedt, en welke voorwaarde daar het vaakst in de weg zit. Wij kunnen je polis niet zien.`,
  });
}

export default async function InsurerPage({ params }: PageProps) {
  const { slug } = await params;
  const insurer = insurerBySlug(slug);
  if (!insurer) notFound();

  const anderen = INSURERS.filter((i) => i.slug !== insurer.slug);

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Vergoedingen", url: `${DIBA_SITE_URL}/vergoedingen` },
          {
            name: insurer.name,
            url: `${DIBA_SITE_URL}/vergoedingen/${insurer.slug}`,
          },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/vergoedingen" className="hover:text-[var(--g-700)]">
                Vergoedingen
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">{insurer.name}</span>
            </nav>

            <VerzekeraarLogo
              verzekeraar={insurer}
              hoogte={44}
              breedte={120}
              className="mt-6"
            />

            <h1 className="diba-display-l mt-5 max-w-[15ch]">
              {insurer.name}:
              <br />
              <span className="diba-accent">waar je het vindt.</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Wij kunnen niet zien wat er in jouw polis staat, en wij kunnen ook
              niets toezeggen namens {insurer.name}. Wat we wel kunnen is je
              precies vertellen waar je het antwoord vindt en welke voorwaarde
              daar het vaakst tussen zit.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Bedragen staan hier niet. Die veranderen per jaar en per pakket,
              en bij geld is onjuist erger dan afwezig.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Bij {insurer.name} zelf</Label>
            <p className="mt-5 text-[17px] leading-8 text-[var(--t-body)]">
              {insurer.waarTeVinden}
            </p>
            <a
              href={insurer.vergoedingenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="diba-label mt-7 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
            >
              Naar {insurer.name}
              <span aria-hidden="true">↗</span>
            </a>
            <p className="mt-5 text-[14px] leading-6 text-[var(--t-muted)]">
              Deze verwijzing is gecontroleerd in {INSURERS_GEZIEN_OP}. Wat daar
              staat gaat altijd voor op wat hier staat.
            </p>
            <p className="mt-3 text-[14px] leading-6 text-[var(--t-muted)]">
              Bedragen en pakketnamen staan er bewust niet bij.
            </p>
          </div>
        </div>
      </section>

      {/* ── Waar het hier op vastloopt ── */}
      {insurer.eigenaardigheid ? (
        <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
          <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <Label>Het addertje</Label>
              <h2 className="diba-display-m mt-4 max-w-[16ch]">
                Waar het <span className="diba-accent">op vastloopt</span>
              </h2>
            </div>
            <div className="max-w-[58ch]">
              <div className="rounded-[var(--r-lg)] bg-[var(--g-200)] p-7 sm:p-8">
                <p className="text-[17px] leading-8 text-[var(--g-900)]">
                  {insurer.eigenaardigheid}
                </p>
              </div>
              <p className="mt-6 text-[16px] leading-7 text-[var(--t-body)]">
                Dit is niet het bedrag maar de voorwaarde, en dat is bewust: een
                voorwaarde verandert veel minder vaak dan een maximum, en het is
                meestal de reden dat een declaratie wordt afgewezen.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Wat zij van de behandelaar eisen ──

          De belangrijkste sectie van deze pagina, en niet alleen omdat hij per verzekeraar
          verschilt. Het is het enige hier waar wij het antwoord op hebben en de bezoeker
          niet: of onze therapeut in het Kwaliteitsregister staat kan hij nergens opzoeken. */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>De behandelaar</Label>
            <h2 className="diba-display-m mt-4 max-w-[18ch]">
              Wat {insurer.name}
              <br />
              <span className="diba-accent">van ons vraagt</span>
            </h2>
          </div>
          <div className="max-w-[60ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              {insurer.eisAanBehandelaar}
            </p>
            <p className="mt-5 text-[16px] leading-7 text-[var(--t-body)]">
              Dit is het deel dat wij voor je kunnen nakijken. Vraag het even
              voordat je boekt, dan zeggen we of we aan deze eis voldoen.
            </p>
            <BelOfApp className="mt-6" />
          </div>
        </div>
      </section>

      {/* ── De weg naar je eigen bedrag ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Zelf opzoeken</Label>
            <h2 className="diba-display-m mt-4 max-w-[20ch]">
              Zo kom je bij{" "}
              <span className="diba-accent">jouw eigen bedrag</span>
            </h2>
            <p className="mt-6 max-w-[62ch] text-[17px] leading-8 text-[var(--t-body)]">
              Drie stappen, en je hebt het bedrag dat bij jouw polis hoort. Wij
              kunnen het niet voor je opzoeken: wat er in jouw pakket zit ziet
              alleen jij, achter je eigen inlog.
            </p>
          </div>

          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {insurer.zoVindJeHet.map((stap, i) => (
              <li
                key={stap}
                className="flex flex-col rounded-[var(--r-lg)] bg-white p-7 sm:p-8"
              >
                <span className="diba-label text-[var(--t-label)]">
                  Stap {i + 1}
                </span>
                <p className="mt-4 flex-1 text-[15px] leading-7 text-[var(--t-body)]">
                  {stap}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── De vier vragen ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="max-w-[62ch]">
              <Label opDonker>Wat je ze moet vragen</Label>
              <h2 className="diba-display-m mt-4 max-w-[20ch]">
                De vragen die er{" "}
                <span className="diba-accent-on-dark">
                  bij {insurer.name} toe doen
                </span>
              </h2>
              <p className="mt-6 text-[16px] leading-7 text-[var(--on-dark-body)]">
                Hieronder staat wat {insurer.name} er zelf over publiceert. Neem
                het mee als je belt en vraag het na voor jouw polis: wat voor
                het ene pakket geldt, hoeft voor het andere niet te gelden.
              </p>
            </div>

            {/* Geen genummerde badge. Deze vier vragen hebben geen volgorde, dus een
                cijfer erboven suggereert een stappenplan dat er niet is. De vraag zelf
                is de kop. */}
            <ul className="mt-12 grid gap-4 md:grid-cols-2">
              {insurer.antwoorden.map((v) => (
                <li
                  key={v.vraag}
                  className="rounded-[var(--r-lg)] bg-[var(--g-800)] p-7 sm:p-8"
                >
                  <p className="text-[17px] leading-7 font-medium">{v.vraag}</p>
                  <p className="mt-3 text-[15px] leading-7 text-[var(--on-dark-body)]">
                    {v.antwoord}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Eerst de hoofdvraag ──

          Hier stond de hele route uitgeschreven: drie kaarten met tweehonderdvijftig
          woorden over de vraag of er een medische reden is. Die vraag is niet
          verzekeraar-specifiek — hij geldt voor alle zes — en het hele verhaal staat al op
          /vergoedingen. Zes keer dezelfde tekst onder zes koppen is de doorslagpagina die
          de huisregels verbieden, en de link naar het origineel stond er al onder. */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto max-w-[62ch]">
          <Label>Voordat je belt</Label>
          <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
            Eén vraag komt hier nog vóór: of er een medische reden is. Zonder
            die reden vergoedt geen enkele verzekeraar iets, ook {insurer.name}{" "}
            niet, en voor het grootste deel van wat wij doen is dat het
            antwoord.
          </p>
          <Link
            href="/vergoedingen"
            className="diba-label mt-6 inline-flex min-h-11 items-center text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
          >
            De hele route, met wat er gebeurt als het antwoord nee is
          </Link>
        </div>
      </section>

      {/* ── Wat wij wel kunnen ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Wat wij wel kunnen</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Een factuur
              <br />
              <span className="diba-accent">die klopt.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Wij zetten op je factuur wat er precies gedaan is en door wie,
              zodat je die kunt indienen. Vraagt {insurer.name} om een
              registratienummer of om de kwalificatie van de behandelaar, dan
              krijg je dat van ons. Bel gerust voordat je boekt: dat scheelt je
              een afwijzing achteraf.
            </p>
            <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              Wat wij niet doen is rechtstreeks declareren of toezeggen dat iets
              vergoed wordt. Dat gesprek voer je met je verzekeraar, en wij
              zouden het antwoord moeten raden.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={DIBA_TELEFOON_HREF}
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
              >
                Bel {DIBA_TELEFOON}
              </a>
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Of stel je vraag via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── De andere verzekeraars ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <Label>Andere verzekeraars</Label>
          <h2 className="diba-display-m mt-4 max-w-[20ch]">
            Zit je niet bij
            <br />
            <span className="diba-accent">{insurer.name}?</span>
          </h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {anderen.map((i) => (
              <li key={i.slug}>
                <Link
                  href={`/vergoedingen/${i.slug}`}
                  className="flex min-h-16 items-center rounded-[var(--r-lg)] bg-white px-6 text-[16px] leading-6 text-[var(--t-strong)] transition-colors hover:bg-[var(--g-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  {i.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[62ch] text-[15px] leading-7 text-[var(--t-muted)]">
            Staat jouw verzekeraar er niet bij? De vier vragen hierboven werken
            overal, want ze gaan over voorwaarden die elke verzekeraar hanteert.
          </p>
        </div>
      </section>
    </main>
  );
}
