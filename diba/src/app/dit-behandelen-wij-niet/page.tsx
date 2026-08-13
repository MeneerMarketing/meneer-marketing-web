import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/ui/Label";
import { WEIGER_SOORTEN, WEIGERINGEN } from "@/data/weigeren";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";

/**
 * Dit behandelen wij niet.
 *
 * WAT DEZE PAGINA ANDERS MAAKT DAN EEN DISCLAIMER.
 *
 * Een lijst met nee is een disclaimer: die dekt de kliniek in en helpt de bezoeker niet.
 * Wat deze pagina bruikbaar maakt is de tweede helft van elke regel: waar je dan wél
 * heen moet. Vandaar de vorm, en die komt nergens anders op de site voor: elke regel is
 * een doorverwijskaart met wat, waarom niet hier, en waarheen dan.
 *
 * DE DRIE SOORTEN NEE, EN WAAROM ZE UIT ELKAAR MOETEN.
 *
 *   arts     Hoort bij een arts. Buiten het vak van een huidtherapeut.
 *   aanbod   Bestaat, wij doen het gewoon niet.
 *   moment   Kan wel, alleen nu even niet. Bijna altijd tijdelijk.
 *
 * Wie die drie op één hoop gooit laat iemand met een veranderende moedervlek denken dat
 * het een kwestie van aanbod is. Dat is het verschil tussen een ongemak en een gemist
 * moment, en daarom staan ze hier apart met elk hun eigen inleiding.
 *
 * Eén donkergroen vlak: de artsengroep, want dat is de enige waar haast bij kan zitten
 * (§5).
 */

export const metadata: Metadata = {
  title: "Dit behandelen wij niet",
  description:
    "Wat hier niet gebeurt en waar je dan wel terechtkunt. Drie soorten nee: bij een arts, niet in ons aanbod, of nu even niet.",
};

export default function DitBehandelenWijNietPage() {
  const perSoort = WEIGER_SOORTEN.map((s) => ({
    ...s,
    items: WEIGERINGEN.filter((w) => w.soort === s.id),
  })).filter((s) => s.items.length > 0);

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          {
            name: "Dit behandelen wij niet",
            url: `${DIBA_SITE_URL}/dit-behandelen-wij-niet`,
          },
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
              <span className="text-[var(--t-muted)]">
                Dit behandelen wij niet
              </span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[14ch]">
              {WEIGERINGEN.length} keer nee,
              <br />
              <span className="diba-accent">en waar dan wel.</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Een lijst met dingen die we niet doen is een disclaimer. Die dekt
              ons in en helpt jou niet. Dus staat bij elke regel hieronder ook
              waar je wél terechtkunt.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Er zit verschil tussen die nee&apos;s, en dat verschil is het
              belangrijkste op deze pagina.
            </p>
          </div>

          {/* De drie soorten meteen als sprong, want ze zijn niet even dringend. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Drie soorten nee</Label>
            <ul className="mt-6 space-y-1">
              {perSoort.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-mx-4 flex min-h-14 items-center justify-between gap-4 rounded-[var(--r-md)] px-4 transition-colors hover:bg-[var(--g-050)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                  >
                    <span className="text-[16px] leading-6 font-medium text-[var(--t-strong)]">
                      {s.label}
                    </span>
                    <span className="shrink-0 text-[16px] leading-6 text-[var(--t-muted)] tabular-nums">
                      {s.items.length}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-[var(--g-050)] pt-5 text-[14px] leading-6 text-[var(--t-muted)]">
              Alleen bij de eerste groep kan haast zitten. De andere twee zijn
              een kwestie van waar of wanneer.
            </p>
          </div>
        </div>
      </section>

      {/* ── De drie groepen, elk met een eigen toon ── */}
      {perSoort.map((s) => {
        const dringend = s.id === "arts";
        return (
          <section
            key={s.id}
            id={s.id}
            className={`scroll-mt-[var(--anker-offset)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-20 ${
              s.id === "aanbod" ? "bg-[var(--g-025)]" : ""
            }`}
          >
            <div className="mx-auto">
              <div
                className={
                  dringend
                    ? "rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14"
                    : ""
                }
              >
                <div className="max-w-[62ch]">
                  {dringend ? (
                    <Label opDonker>{`${s.items.length} onderwerpen`}</Label>
                  ) : (
                    <Label>{`${s.items.length} onderwerpen`}</Label>
                  )}
                  <h2 className="diba-display-m mt-4 max-w-[20ch]">
                    {s.label}
                  </h2>
                  <p
                    className={`mt-6 text-[17px] leading-8 ${
                      dringend
                        ? "text-[var(--on-dark-body)]"
                        : "text-[var(--t-body)]"
                    }`}
                  >
                    {s.zin}
                  </p>
                </div>

                {/* De doorverwijskaarten: wat, waarom niet hier, waarheen dan. */}
                <ul className="mt-10 grid gap-4 lg:grid-cols-2">
                  {s.items.map((w) => (
                    <li
                      key={w.id}
                      className={`flex flex-col rounded-[var(--r-lg)] p-7 sm:p-8 ${
                        dringend ? "bg-white/10" : "bg-white"
                      }`}
                    >
                      <p
                        className={`diba-card-title ${
                          dringend ? "text-white" : "text-[var(--t-strong)]"
                        }`}
                      >
                        {publicCopy(w.wat)}
                      </p>
                      <p
                        className={`mt-3 text-[15px] leading-7 ${
                          dringend
                            ? "text-[var(--on-dark-body)]"
                            : "text-[var(--t-body)]"
                        }`}
                      >
                        {publicCopy(w.waarom)}
                      </p>

                      {/* Dit is waarom de pagina bestaat. */}
                      <div
                        className={`mt-5 flex-1 rounded-[var(--r-md)] p-5 ${
                          dringend ? "bg-[var(--g-800)]" : "bg-[var(--g-050)]"
                        }`}
                      >
                        <p
                          className={`diba-label ${
                            dringend
                              ? "diba-label-on-dark"
                              : "text-[var(--t-label)]"
                          }`}
                        >
                          Waar dan wel
                        </p>
                        <p
                          className={`mt-2 text-[15px] leading-7 ${
                            dringend
                              ? "text-[var(--on-dark-body)]"
                              : "text-[var(--t-body)]"
                          }`}
                        >
                          {publicCopy(w.waarheen)}
                        </p>
                      </div>

                      {/* ── Wat wij er wél bij doen ──
                          Zonder dit blok las elke kaart als een dichte deur, terwijl er
                          bij bijna elk punt wel iets is dat we doen. Iemand met eczeem
                          las "ga naar de huisarts" en was weg, terwijl we aan de droge
                          huid en de barrière naast die behandeling gewoon iets kunnen.

                          Het staat er bewust ná "waar dan wel" en niet ervoor: eerst het
                          juiste adres, dan pas wat wij nog betekenen. Bij de urgente
                          gevallen staat het er helemaal niet, want daar zou het de haast
                          verwateren. */}
                      {w.watWel ? (
                        <div
                          /* Op de donkere kaarten donkerder vullen en niet lichter.
                             Met white/10 werd het vlak rgb(46,96,70) en zat het label op
                             precies 4,50: het haalt de norm, maar zonder marge. Op
                             --g-900 haalt het 8,98 en de tekst 10,16. */
                          className={`mt-3 rounded-[var(--r-md)] p-5 ${
                            dringend ? "bg-[var(--g-900)]" : "bg-[var(--g-200)]"
                          }`}
                        >
                          <p
                            className={`diba-label ${
                              dringend
                                ? "diba-label-on-dark"
                                : "text-[var(--g-900)]"
                            }`}
                          >
                            Wat wij hier wél bij doen
                          </p>
                          <p
                            className={`mt-2 text-[15px] leading-7 ${
                              dringend
                                ? "text-[var(--on-dark-body)]"
                                : "text-[var(--g-900)]"
                            }`}
                          >
                            {publicCopy(w.watWel)}
                          </p>
                        </div>
                      ) : null}

                      {w.link ? (
                        <Link
                          href={w.link.href}
                          className={`diba-label mt-5 inline-flex items-center gap-1.5 underline underline-offset-4 ${
                            dringend
                              ? "text-[var(--on-dark-accent)]"
                              : "text-[var(--g-700)] hover:text-[var(--g-800)]"
                          }`}
                        >
                          {w.link.label}
                          <span aria-hidden="true">›</span>
                        </Link>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── Afsluiter ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Staat het er niet bij</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              Vraag het
              <br />
              <span className="diba-accent">gewoon even.</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Deze lijst is niet uitputtend en dat gaat hij ook nooit worden.
              Twijfel je of iets hier kan, stuur dan een bericht. Als het
              antwoord nee is hoor je dat meteen, met erbij waar je dan wel moet
              zijn. Dat scheelt jou een afspraak die niet doorgaat.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Stel je vraag
                <span aria-hidden="true">↗</span>
              </a>
              <Link
                href="/is-het-nodig"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Is behandelen eigenlijk wel nodig?
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
