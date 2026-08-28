import type { Metadata } from "next";
import Link from "next/link";
import BeeldVignet from "@/components/ui/BeeldVignet";
import Label from "@/components/ui/Label";
import { TEAM, VAKGEBIEDEN } from "@/data/team";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_EMAIL, DIBA_SITE_URL } from "@/lib/site";

/**
 * Werken bij Diba.
 *
 * ⚠ HERKOMST: de twee vacatures staan zo op dibaclinics.nl/werken-bij (augustus 2026). ⚠
 *
 * WAAROM DEZE PAGINA ANDERS IS OPGEBOUWD DAN DE REST.
 *
 * Elke andere pagina hier praat tegen iemand met een huidvraag. Deze praat tegen een
 * vakgenoot, en die wil iets anders weten: waar kom ik terecht, waar wordt mee gewerkt,
 * en hoe wordt hier over het vak gedacht. Vandaar dat de apparatuur er letterlijk bij
 * staat en de sollicitatieroute in twee regels klaar is.
 *
 * DE SIGNATUUR: WAT WE VAN JE VERWACHTEN, EN WAT NIET.
 *
 * Vacatureteksten vragen altijd om "een teamplayer met passie voor de huid". Wat een
 * kliniek eigenlijk van je verwacht staat er nooit, en wat ze júist niet verwacht al
 * helemaal niet. Op een site waar bij elke behandeling staat wat hij niet kan, hoort dat
 * hier ook te staan.
 *
 * [COPY-NODIG: arbeidsvoorwaarden, uren en salarisindicatie, van Okan] Die staan bewust
 * niet ingevuld. Een salaris verzinnen is erger dan het weglaten.
 *
 * Eén donkergroen vlak: het blok over wat we verwachten (§5).
 */

export const metadata: Metadata = {
  title: "Werken bij Diba",
  description:
    "Twee vacatures: allround schoonheidsspecialist of huidtherapeut, en een open sollicitatie. Waar je mee werkt en wat we van je verwachten.",
};

/** De twee vacatures zoals de kliniek ze publiceert. */
const VACATURES = [
  {
    slug: "huidtherapeut",
    titel: "Allround schoonheidsspecialist of huidtherapeut",
    zin: "Je doet metingen, je behandelt en je legt uit waarom iets wel of niet kan. De apparatuur staat er; wat telt is wat jij ermee doet.",
    onderwerp: "Sollicitatie allround schoonheidsspecialist of huidtherapeut",
  },
  {
    slug: "open",
    titel: "Open sollicitatie",
    zin: "Staat jouw vak er niet bij en denk je dat het hier past, stuur dan gewoon iets. Er wordt naar gekeken.",
    onderwerp: "Open sollicitatie",
  },
];

/**
 * Wat we verwachten en wat niet.
 *
 * De rechterkolom is het punt. Een kliniek die zegt wat ze níet van je vraagt, vertelt
 * daarmee hoe er gewerkt wordt, en dat is precies wat een goede kandidaat wil weten
 * voordat hij solliciteert.
 */
const VERWACHTING = {
  wel: [
    "Dat je duidelijk zegt wanneer een behandeling niet passend of niet veilig is. Goed advies kan ook betekenen dat je niet behandelt.",
    "Dat je meet voordat je begint, en dat je je instelling kunt uitleggen aan de klant en aan een collega.",
    "Dat je bijhoudt wat er in het vak verandert. Een diploma is een startpunt.",
  ],
  niet: [
    "Advies geven Medewerkers worden niet beoordeeld op de omzet per klant. Een behandeling of product wordt alleen geadviseerd wanneer de behandelaar denkt dat het iets toevoegt.",
    "Alles alleen kunnen. Er zijn twee vakgebieden in huis juist omdat één invalshoek vaak niet genoeg is.",
    "Meteen alle apparatuur beheersen. Inwerken op een nieuw apparaat hoort erbij en daar is tijd voor.",
  ],
};

export default function WerkenBijPage() {
  const huidtherapeuten = TEAM.filter((t) => t.vak === "huidtherapie").length;

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Werken bij", url: `${DIBA_SITE_URL}/werken-bij` },
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
              <span className="text-[var(--t-muted)]">Werken bij</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              Meten, uitleggen,
              <br />
              <span className="diba-accent">en soms nee zeggen.</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              We zijn met {TEAM.length}, waarvan {huidtherapeuten}{" "}
              huidtherapeuten. Er wordt gewerkt met laser, licht, needling en
              peelings, en elk traject begint met een meting. Dat laatste is
              geen slogan maar de volgorde waarin het hier gaat.
            </p>
          </div>

          {/* De vacatures meteen in beeld: daar kom je voor. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Open vacatures · {VACATURES.length}</Label>
            <ul className="mt-6 space-y-2">
              {VACATURES.map((v) => (
                <li key={v.slug}>
                  <a
                    href={`mailto:${DIBA_EMAIL}?subject=${encodeURIComponent(v.onderwerp)}`}
                    className="-mx-4 flex min-h-14 items-start justify-between gap-4 rounded-[var(--r-md)] px-4 py-4 transition-colors hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                  >
                    <span>
                      <span className="block text-[16px] leading-6 font-medium text-[var(--t-strong)]">
                        {v.titel}
                      </span>
                      <span className="mt-1 block text-[14px] leading-6 text-[var(--t-body)]">
                        {v.zin}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-[18px] leading-none text-[var(--g-300)]"
                    >
                      ›
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-[var(--g-050)] pt-5 text-[14px] leading-6 text-[var(--t-muted)]">
              Solliciteren gaat per mail naar {DIBA_EMAIL}. Een cv is genoeg om
              mee te beginnen; de rest bespreken we.
            </p>
          </div>
        </div>
      </section>

      {/* ── De signatuur: wat we verwachten en wat niet ── */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-20">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="max-w-[62ch]">
              <Label opDonker>Voordat je solliciteert</Label>
              <h2 className="diba-display-m mt-4 max-w-[20ch]">
                Wat we van je vragen,{" "}
                <span className="diba-accent-on-dark"> en wat juist niet.</span>
              </h2>
              <p className="mt-6 text-[16px] leading-7 text-[var(--on-dark-body)]">
                Elke vacature vraagt om een teamplayer met passie voor de huid.
                Wat een kliniek echt van je verwacht staat er nooit bij, en wat
                ze níet verwacht al helemaal niet. Op een site waar bij elke
                behandeling staat wat hij niet kan, hoort dat hier ook te staan.
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-14">
              <div>
                <Label opDonker>Dit verwachten we wel</Label>
                <ul className="mt-5 space-y-4">
                  {VERWACHTING.wel.map((w) => (
                    <li
                      key={w}
                      className="rounded-[var(--r-md)] bg-white/10 p-5 text-[15px] leading-7 text-[var(--on-dark-body)]"
                    >
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Label opDonker>Dit verwachten we niet</Label>
                <ul className="mt-5 space-y-4">
                  {VERWACHTING.niet.map((n) => (
                    <li
                      key={n}
                      className="rounded-[var(--r-md)] bg-white/10 p-5 text-[15px] leading-7 text-[var(--on-dark-body)]"
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Waar je mee werkt ── */}
      {/* Een vacaturepagina laat zelden zien hoe het er tussendoor aan toegaat, en dat is nu
          juist waar een sollicitant naar raadt. */}
      <section className="px-5 pb-14 sm:px-9 lg:px-[7.5vw] lg:pb-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/team-gang-koffie.jpg"
            alt="Twee behandelaars met koffie in de gang van de kliniek"
            onderschrift="Tussen twee afspraken door"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/10] lg:aspect-[2/1]"
          />
        </div>
      </section>

      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Waar je mee werkt</Label>
            <h2 className="diba-display-m mt-4">
              Twee vakken <span className="diba-accent">onder één dak.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Dat is geen indeling op papier. Bij acne en pigment zit er vaak
              een voedingskant aan het verhaal, en dan schuift er iemand aan die
              daarnaar kijkt. Bij laser en needling doet een huidtherapeut het.
              Je werkt dus regelmatig aan hetzelfde dossier vanuit een andere
              hoek.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {VAKGEBIEDEN.map((v) => (
              <li
                key={v.id}
                className="rounded-[var(--r-lg)] bg-white p-7 sm:p-8"
              >
                <p className="diba-card-title text-[var(--t-strong)]">
                  {v.label}
                </p>
                <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                  {v.wat}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/apparatuur"
              className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
            >
              Bekijk de apparatuur
            </Link>
            <Link
              href="/team"
              className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              Wie er nu werken
            </Link>
          </div>
        </div>
      </section>

      {/* ── Solliciteren ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Solliciteren</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Eén mail,
              <br />
              <span className="diba-accent">en dan bellen we.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Stuur je cv naar {DIBA_EMAIL} met de functie in de onderwerpregel.
              Een uitgebreide motivatiebrief hoeft niet; we bellen liever en
              stellen onze vragen zelf. Loopt het daarna door, dan kom je een
              dagdeel meekijken voordat een van beiden iets tekent.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {VACATURES.map((v, i) => (
                <a
                  key={v.slug}
                  href={`mailto:${DIBA_EMAIL}?subject=${encodeURIComponent(v.onderwerp)}`}
                  className={
                    i === 0
                      ? "diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
                      : "diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                  }
                >
                  {i === 0
                    ? "Solliciteer op deze functie"
                    : "Open sollicitatie sturen"}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
