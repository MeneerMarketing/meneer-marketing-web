import type { Metadata } from "next";
import Link from "next/link";
import BeeldVignet from "@/components/ui/BeeldVignet";
import Label from "@/components/ui/Label";
import { DOELGROEPEN } from "@/data/doelgroep";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * De hub voor de vier doelgroepen.
 *
 * WAAROM DEZE PAGINA MET EEN VOORBEHOUD BEGINT.
 *
 * Een pagina die je in vier hokjes indeelt, suggereert dat er vier soorten huidzorg
 * bestaan. Die zijn er niet. Wat er wel is, zijn vier groepen met per stuk iets dat je
 * beter vooraf kunt weten, en dat is een veel kleiner verhaal dan een aparte behandellijn.
 *
 * Dus staat dat voorbehoud bovenaan en niet in de kleine lettertjes, en telt elke kaart
 * hieronder hoeveel er per groep écht anders is. Dat getal is nergens hoger dan drie.
 *
 * WAT ERBIJ IS GEKOMEN, EN WAAROM.
 *
 * Deze pagina telde de verschillen op ("bij elkaar zijn dat twaalf punten") en liet ze
 * vervolgens nergens zien. Om te weten of er iets bij zat dat op jou slaat, moest je vier
 * keer doorklikken en vier pagina's lezen. Een hub die je laat zoeken naar wat hij zelf
 * net heeft opgeteld, doet zijn werk niet.
 *
 * Nu staan de twaalf punten op de kaarten zelf. Dat maakt de belofte meteen controleerbaar:
 * je ziet in één scherm dat het een korte lijst is, precies zoals de tekst erboven beweert.
 *
 * En het beloftekaartje in de hero noemt "wat je moet melden, zodat het niet pas aan de
 * balie boven tafel komt". Dat stond dan wél weer vier klikken verderop. Die twaalf regels
 * staan nu onderaan bij elkaar, want ze zijn korter dan de uitleg eromheen en het is het
 * enige op deze pagina waar iemand iets mee móet.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/doelgroep",
  titel: "Voor wie",
  omschrijving:
    "Vier groepen met per stuk iets dat je beter vooraf kunt weten. Geen aparte behandellijnen: dezelfde lijst, een andere volgorde.",
});

export default function DoelgroepHubPage() {
  const totaalAnders = DOELGROEPEN.reduce((n, d) => n + d.anders.length, 0);

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Voor wie", url: `${DIBA_SITE_URL}/doelgroep` },
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
              <span className="text-[var(--t-muted)]">Voor wie</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[19ch]">
              Huidzorg die rekening houdt met{" "}
              <span className="diba-accent">jouw situatie</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Dezelfde huidklacht vraagt niet bij iedereen om dezelfde aanpak.
              Je leeftijd, huidtype, medicatie, hormonen en planning hebben
              invloed op wat verstandig en haalbaar is.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Daarom kijken we niet alleen naar wat er aan je huid te zien is,
              maar bespreken we ook wat er bij jou meespeelt. Hieronder staan
              vier situaties met bij elkaar {totaalAnders} punten waar we dan
              extra op letten.
            </p>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Wat er op elke pagina staat</Label>
            <ul className="mt-6 space-y-4">
              {[
                [
                  "Waar we extra op letten",
                  "Met de reden erbij, niet alleen de constatering.",
                ],
                [
                  "Wat er hetzelfde blijft",
                  "Even lang, en meestal het langste van de twee.",
                ],
                [
                  "Wat we graag vooraf weten",
                  "Zodat we tijdens de intake meteen verder kunnen.",
                ],
              ].map(([kop, zin]) => (
                <li key={kop}>
                  <p className="text-[16px] leading-6 font-medium text-[var(--t-strong)]">
                    {kop}
                  </p>
                  <p className="mt-1 text-[15px] leading-7 text-[var(--t-body)]">
                    {zin}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── De vier ── */}
      {/* Hier stond de EVE-M met "Dezelfde meting, voor iedereen". Okan: dat klinkt alsof
          iedereen standaard door de scanner gaat en de scanner de behandeling bepaalt. Nu
          een behandelaar die de huid bekijkt, met een onderschrift dat zegt wie er kiest. */}
      <section className="px-5 pb-14 sm:px-9 lg:px-[7.5vw] lg:pb-16">
        <div className="mx-auto">
          <BeeldVignet
            src="/images/shoot/eerlijk-advies-consult.jpg"
            alt="Behandelaar bekijkt de huid van een client tijdens het consult"
            onderschrift="Niet iedereen heeft hetzelfde nodig"
            sizes="(min-width: 1024px) 86vw, 92vw"
            className="aspect-[16/10] lg:aspect-[2/1]"
          />
          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Een huidmeting ondersteunt de beoordeling wanneer dat iets toevoegt.
            De behandelaar bekijkt je huid, luistert naar je verhaal en bepaalt
            daarna welke mogelijkheden bij je passen.
          </p>
        </div>
      </section>

      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <ul className="grid gap-4 md:grid-cols-2">
            {DOELGROEPEN.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/doelgroep/${d.slug}`}
                  className="flex h-full flex-col rounded-[var(--r-lg)] bg-white p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] sm:p-10"
                >
                  <span className="diba-label text-[var(--t-label)]">
                    Waar we op letten
                  </span>
                  <span className="diba-display-s mt-3 block text-[var(--t-strong)]">
                    {d.meta}
                  </span>
                  <span className="mt-4 text-[16px] leading-8 text-[var(--t-body)]">
                    {publicCopy(d.korteOmschrijving)}
                  </span>

                  {/* De punten zelf, niet alleen hun aantal. Dit is wat de kaart
                      beloofde en wat er tot nu toe vier klikken verderop stond. */}
                  <span className="mt-6 flex flex-1 flex-col gap-2">
                    {d.anders.map((a) => (
                      <span
                        key={a.kop}
                        className="rounded-[var(--r-sm)] bg-[var(--g-025)] px-4 py-3 text-[15px] leading-6 text-[var(--t-body)]"
                      >
                        {publicCopy(a.kop)}
                      </span>
                    ))}
                  </span>

                  <span className="diba-label mt-6 inline-flex items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4">
                    Met de reden erbij, en wat hetzelfde blijft
                    <span aria-hidden="true">›</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Wat je meldt ──
          Het beloftekaartje in de hero noemt dit als derde punt van elke pagina, en het is
          het enige op deze hele hub waar iemand iets mee moet. Het stond vier klikken
          verderop. Hier staat het bij elkaar, want zo is het ook korter dan de uitleg. */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div>
            <Label>Bij het maken van de afspraak</Label>
            <h2 className="diba-display-m mt-4 max-w-[22ch]">
              Wat we graag{" "}
              <span className="diba-accent">vooraf van je weten.</span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
              Sommige informatie heeft invloed op wat er die dag kan. Weten we
              het vooraf, dan kunnen we beter inschatten wat mogelijk is en
              staat de tijd van je afspraak meteen goed.
            </p>
            <p className="max-w-[62ch] mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              Je hoeft zelf niet te bepalen wat belangrijk is; daar vragen we
              tijdens de intake naar. Dit is waar het meestal om gaat.
            </p>
          </div>

          {/* items-start: de ene groep heeft langere regels dan de andere, en gelijk
              trekken levert onderin een halve lege kaart op. */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:items-start xl:grid-cols-4">
            {DOELGROEPEN.map((d) => (
              <div
                key={d.slug}
                className="rounded-[var(--r-lg)] bg-white p-6 sm:p-7"
              >
                <Label>{d.meta}</Label>
                <ul className="mt-4 space-y-3">
                  {d.melden.map((m) => (
                    <li
                      key={publicCopy(m)}
                      className="text-[15px] leading-7 text-[var(--t-body)]"
                    >
                      {publicCopy(m)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-[70ch] text-[15px] leading-7 text-[var(--t-muted)]">
            Herken je jezelf in meerdere situaties, of juist in geen van deze
            vier? Ook goed. Tijdens de intake bespreken we wat voor jou relevant
            is.
          </p>
        </div>
      </section>

      {/* ── Afsluiter ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>En verder</Label>
            <h2 className="diba-display-m mt-4 max-w-[20ch]">
              Staat jouw situatie er{" "}
              <span className="diba-accent">niet tussen?</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Dat hoeft ook niet. Deze pagina&apos;s beschrijven vier situaties
              waarin we vaak ergens extra rekening mee houden. Uiteindelijk
              wordt iedere huid afzonderlijk beoordeeld.
            </p>
            <p className="mt-4 text-[17px] leading-8 text-[var(--t-body)]">
              Tijdens de intake luisteren we naar je hulpvraag, bekijken we je
              huid en leggen we uit welke behandeling wel of niet passend is. Is
              behandelen op dat moment niet verstandig, dan zeggen we dat ook.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                Plan een huidconsult
              </Link>
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Eerst je vraag stellen
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
