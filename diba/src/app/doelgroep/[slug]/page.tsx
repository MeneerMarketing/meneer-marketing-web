import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Label from "@/components/ui/Label";
import { DOELGROEPEN, doelgroepBySlug } from "@/data/doelgroep";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";

/**
 * De doelgroeppagina's.
 *
 * WAT DEZE VIER ANDERS DOEN DAN ELKE ANDERE DOELGROEPPAGINA.
 *
 * "Huidzorg voor mannen" is doorgaans dezelfde pagina als de gewone, met een grijzere
 * foto erboven en het woord "mannen" er een paar keer doorheen. Dat is marketing die
 * doet alsof er een aparte behandellijn bestaat.
 *
 * Hier staat de omgekeerde opzet: twee kolommen naast elkaar, wat er écht anders is en
 * wat er níet anders is, met bij elk punt de reden. De rechterkolom is even lang als de
 * linker en dat is geen opmaak maar de boodschap. Bij drie van de vier groepen is het
 * eerlijke antwoord dat de biologie hetzelfde werkt en alleen de instelling verschilt.
 *
 * Die tweekolomsvorm komt nergens anders op de site voor. Wel delen de vier pagina's hem
 * onderling, want het is één soort pagina en vier keer een andere vorm verzinnen zou
 * verbergen dat ze dezelfde vraag beantwoorden.
 *
 * Eén donkergroen vlak: wat je bij het maken van de afspraak moet melden (§5). Dat is
 * het enige blok waar iets van de bezoeker gevraagd wordt.
 */

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DOELGROEPEN.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const d = doelgroepBySlug(slug);
  if (!d) return {};
  return { title: d.meta, description: publicCopy(d.korteOmschrijving) };
}

/** "Huidzorg voor *mannen*" wordt een kop met het accentwoord in groen. */
function Sterkop({ tekst }: { tekst: string }) {
  const delen = tekst.split("*");
  return (
    <h1 className="diba-display-l mt-6 max-w-[15ch]">
      {delen.map((d, i) =>
        i % 2 === 1 ? (
          <span key={i} className="diba-accent">
            {d}
          </span>
        ) : (
          <span key={i}>{d}</span>
        ),
      )}
    </h1>
  );
}

export default async function DoelgroepPage({ params }: PageProps) {
  const { slug } = await params;
  const d = doelgroepBySlug(slug);
  if (!d) notFound();

  const anderen = DOELGROEPEN.filter((x) => x.slug !== d.slug);

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Voor wie", url: `${DIBA_SITE_URL}/doelgroep` },
          { name: d.meta, url: `${DIBA_SITE_URL}/doelgroep/${d.slug}` },
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
              <Link href="/doelgroep" className="hover:text-[var(--g-700)]">
                Voor wie
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">{d.meta}</span>
            </nav>

            <Sterkop tekst={d.titel} />

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              {publicCopy(d.korteOmschrijving)}
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Waar het op neerkomt</Label>
            <p className="mt-5 text-[19px] leading-8 text-[var(--t-body)]">
              {publicCopy(d.kernzin)}
            </p>
            <div className="mt-8">
              <Link
                href={d.begin.href}
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
              >
                {d.begin.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── De signatuur: anders naast niet anders ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Twee kolommen</Label>
            <h2 className="diba-display-m mt-4">
              Wat er anders is,{" "}
              <span className="diba-accent">en wat niet.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              De meeste pagina&apos;s voor een doelgroep doen alsof er een
              aparte behandellijn bestaat. Die bestaat niet. Wat er wél
              verschilt staat links, en rechts staat even nadrukkelijk wat er
              hetzelfde blijft.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2 lg:gap-6">
            <div>
              <p className="diba-label text-[var(--t-label)]">
                Dit is echt anders · {d.anders.length}
              </p>
              <ul className="mt-4 space-y-4">
                {d.anders.map((p) => (
                  <li
                    key={p.kop}
                    className="rounded-[var(--r-lg)] bg-white p-7 sm:p-8"
                  >
                    <p className="diba-card-title text-[var(--t-strong)]">
                      {p.kop}
                    </p>
                    <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                      {publicCopy(p.zin)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="diba-label text-[var(--t-label)]">
                Dit is precies hetzelfde · {d.nietAnders.length}
              </p>
              <ul className="mt-4 space-y-4">
                {d.nietAnders.map((p) => (
                  <li
                    key={p.kop}
                    className="rounded-[var(--r-lg)] bg-[var(--g-075)] p-7 sm:p-8"
                  >
                    <p className="diba-card-title text-[var(--t-strong)]">
                      {p.kop}
                    </p>
                    <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                      {publicCopy(p.zin)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Wat je moet melden ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <div>
                <Label opDonker>Bij het maken van de afspraak</Label>
                <h2 className="diba-display-m mt-4 max-w-[16ch]">
                  Zeg dit erbij,{" "}
                  <span className="diba-accent-on-dark">
                    {" "}
                    dan scheelt dat een keer.
                  </span>
                </h2>
                <p className="mt-6 max-w-[44ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                  Dit zijn de dingen die anders pas aan de balie boven tafel
                  komen, en dan is de afspraak al gepland.
                </p>
              </div>

              <ul className="space-y-4">
                {d.melden.map((m) => (
                  <li
                    key={m}
                    className="rounded-[var(--r-md)] bg-white/10 p-5 text-[16px] leading-7 text-[var(--on-dark-body)]"
                  >
                    {publicCopy(m)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── De andere drie ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Herken je jezelf hier niet in</Label>
            <h2 className="diba-display-m mt-4">
              Dan hoor je{" "}
              <span className="diba-accent">gewoon bij de rest.</span>
            </h2>
            <p className="max-w-[58ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Deze vier pagina&apos;s bestaan omdat er per groep iets te melden
              is, en niet omdat de rest ergens anders terechtkan. Alles begint
              bij dezelfde meting.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {anderen.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/doelgroep/${a.slug}`}
                  className="flex h-full flex-col rounded-[var(--r-lg)] bg-white p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                >
                  <span className="diba-card-title text-[var(--t-strong)]">
                    {a.meta}
                  </span>
                  <span className="mt-3 flex-1 text-[15px] leading-7 text-[var(--t-body)]">
                    {publicCopy(a.korteOmschrijving)}
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col rounded-[var(--r-lg)] bg-[var(--g-200)] p-7 transition-colors duration-200 hover:bg-[var(--g-300)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                <span className="diba-card-title text-[var(--g-900)]">
                  Iets anders
                </span>
                <span className="mt-3 flex-1 text-[15px] leading-7 text-[var(--g-900)]">
                  Speelt er bij jou iets wat hier niet tussen staat, stuur dan
                  een bericht. Dan hoor je meteen of het hier kan.
                </span>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
