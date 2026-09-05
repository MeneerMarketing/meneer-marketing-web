import type { Metadata } from "next";
import Link from "next/link";
import BeeldVignet from "@/components/ui/BeeldVignet";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import { APPARATUUR } from "@/data/apparatuur";
import { BEHANDELINGEN } from "@/data/behandelingen";
import { KENNISBANK } from "@/data/kennisbank";
import { BESTEMMINGEN } from "@/data/symptoomzoeker";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * De kennisbank.
 *
 * WAAROM DEZE PAGINA ER MOEST KOMEN.
 *
 * De homepage had een sectie "Diba kennisbank" met drie kaarten die eruitzagen als
 * artikelen. Ze linkten naar bestaande pagina's met een andere titel, en "Bekijk alles"
 * ging naar het huidprobleemoverzicht. Er was dus geen kennisbank; er was een belofte dat
 * er een was, en die klikte je stuk.
 *
 * WAAROM HET GEEN BLOG IS GEWORDEN.
 *
 * Artikelen schrijven zou betekenen dat er nieuwe medische teksten bijkomen die nog
 * nagekeken moeten worden, terwijl deze site al zeventien huidprobleempagina's, twaalf
 * apparaatpagina's en eenentwintig behandelpagina's heeft die precies dat doen. Het
 * probleem is niet dat er te weinig staat maar dat het niet te vinden is: er zitten
 * vijfentwintig eigen tools verspreid over de site, en wie niet toevallig op de goede
 * pagina belandt ziet er geen enkele van.
 *
 * DE SIGNATUUR: GEORDEND OP DE VRAAG, NIET OP DE BEHANDELING.
 *
 * Elke groep hieronder begint bij wat iemand zich afvraagt en niet bij wat wij aanbieden.
 * Bij elk stuk staat de vraag er letterlijk boven. Dat is ook waarom het laatste blok gaat
 * over hoe je een resultaatfoto beoordeelt: dat is bruikbaar bij elke kliniek, ook bij een
 * andere, en dat is precies waarom het hier hoort.
 *
 * Geen enkele omschrijving op deze pagina bevat een medische bewering die niet al ergens
 * anders op de site staat en daar is gemarkeerd voor controle. Deze pagina wijst, hij
 * beweert niet.
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/kennisbank",
  titel: "Kennisbank",
  omschrijving:
    "Alles wat op deze site wordt uitgelegd, geordend op de vraag die je stelt. Met de doorsnedes, testen en vergelijkers die verspreid over de site staan.",
});

export default function KennisbankPage() {
  const aantalStukken = KENNISBANK.reduce((n, g) => n + g.stukken.length, 0);

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Kennisbank", url: `${DIBA_SITE_URL}/kennisbank` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch lg:py-20">
          <div className="flex flex-col">
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Kennisbank</span>
            </nav>

            <div className="mt-8">
              <Label>Diba kennisbank</Label>
              <h1 className="diba-display-l mt-4">
                Alles wat we <span className="diba-accent">uitleggen</span>
              </h1>
            </div>

            <p className="mt-7 max-w-[62ch] text-[17px] leading-8 text-[var(--t-body)]">
              Alles wat hier wordt uitgelegd staat verspreid over{" "}
              {BESTEMMINGEN.length} huidprobleempagina&apos;s,{" "}
              {APPARATUUR.length} apparaatpagina&apos;s en{" "}
              {BEHANDELINGEN.length} behandelpagina&apos;s. Deze pagina brengt
              dat bij elkaar, geordend op de vraag die je stelt in plaats van op
              wat wij aanbieden.
            </p>

            <p className="mt-4 max-w-[62ch] text-[17px] leading-8 text-[var(--t-body)]">
              De doorsnedes, testen en vergelijkers staan er los bij. Die zijn
              het meeste werk en tegelijk het slechtst vindbaar, want ze staan
              halverwege een pagina waar je niet komt als je er niet naar zoekt.
            </p>

            <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-10">
              <Link
                href="/huidproblemen/symptoomzoeker"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                Weet je niet hoe het heet?
              </Link>
              <Link
                href="/huidproblemen"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                Alle huidproblemen
              </Link>
            </div>
          </div>

          <BeeldVignet
            src="/images/shoot/uitleg-huidlagen.jpg"
            alt="Behandelaar legt aan de hand van een doorsnedemodel van de huid uit wat er waar zit"
            onderschrift="Eerst begrijpen waar het zit"
            priority
            sizes="(min-width: 1024px) 42vw, 92vw"
            className="min-h-[320px] lg:min-h-[520px]"
          />
        </div>
      </section>

      <ProofBar items={DIBA_PROOF_STRIP_ITEMS} />

      {/* ── Het register ──

          Elke groep krijgt zijn eigen ondergrond. Vijf groepen achter elkaar op hetzelfde
          witte vlak lazen als één lange lijst waarin je je plek kwijtraakt; nu is elke
          groep een hoofdstuk dat je herkent voordat je de kop leest.

          De kaart is telkens het omgekeerde van de ondergrond: wit op groen, groen op wit.
          Dat is de huisregel zelf, gewoon consequent doorgevoerd. */}
      {KENNISBANK.map((groep) => {
        const opDonker = groep.tint === "donker";
        const vlak =
          groep.tint === "mint"
            ? "bg-[var(--g-050)]"
            : groep.tint === "zacht"
              ? "bg-[var(--g-025)]"
              : opDonker
                ? "bg-[var(--g-700)] text-[var(--on-dark)]"
                : "bg-[var(--g-010)]";
        const kaart = opDonker
          ? "bg-white/10 hover:bg-white/[0.16]"
          : groep.tint === "wit"
            ? "bg-[var(--g-050)] hover:bg-[var(--g-075)]"
            : "bg-white hover:shadow-[0_18px_44px_rgba(67,79,58,.09)]";

        return (
          <section
            key={groep.id}
            id={groep.id}
            className={`scroll-mt-[var(--anker-offset)] px-5 py-14 sm:px-9 lg:px-[7.5vw] lg:py-20 ${vlak}`}
          >
            <div className="mx-auto">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
                <div className="shrink-0">
                  {opDonker ? (
                    <Label opDonker>{groep.kop}</Label>
                  ) : (
                    <Label>{groep.kop}</Label>
                  )}
                </div>
                <p
                  className={`max-w-[58ch] text-[15px] leading-7 ${opDonker ? "text-[var(--on-dark-body)]" : "text-[var(--t-muted)]"}`}
                >
                  {groep.zin}
                </p>
              </div>

              <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {groep.stukken.map((stuk) => (
                  <li key={stuk.id} className="flex">
                    <Link
                      href={stuk.href}
                      className={`group flex h-full w-full flex-col rounded-[var(--r-lg)] p-7 transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] sm:p-8 ${kaart}`}
                    >
                      {/* De vraag staat boven de naam en niet eronder. Wie zoekt
                          herkent zijn eigen vraag eerder dan onze naam ervoor. */}
                      <p
                        className={`diba-label ${opDonker ? "text-[var(--on-dark-accent)]" : "text-[var(--t-label)]"}`}
                      >
                        {stuk.vraag}
                      </p>
                      <p
                        className={`diba-card-title mt-3 ${opDonker ? "text-[var(--on-dark)]" : "text-[var(--t-strong)]"}`}
                      >
                        {stuk.naam}
                      </p>
                      <p
                        className={`mt-4 text-[15px] leading-7 ${opDonker ? "text-[var(--on-dark-body)]" : "text-[var(--t-body)]"}`}
                      >
                        {stuk.zin}
                      </p>

                      {/* De pijl schuift op bij aanwijzen. Dat is de enige beweging op de
                          kaart, en hij zegt precies wat er gebeurt als je klikt. */}
                      <span
                        aria-hidden="true"
                        className={`diba-label mt-auto flex items-center gap-2 pt-7 ${opDonker ? "text-[var(--on-dark-accent)]" : "text-[var(--g-700)]"}`}
                      >
                        Bekijken
                        <svg
                          viewBox="0 0 16 16"
                          className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
                        </svg>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      {/* ── Alle huidproblemen ── */}
      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="shrink-0">
              <Label>Per huidprobleem</Label>
              <h2 className="diba-display-m mt-4">
                {BESTEMMINGEN.length} pagina&apos;s,{" "}
                <span className="diba-accent">elk met een eigen vraag.</span>
              </h2>
            </div>
            <p className="max-w-[46ch] text-[16px] leading-7 text-[var(--t-body)]">
              Elke pagina begint bij de vraag die er het vaakst over gesteld
              wordt. Die vraag staat hieronder, zodat je ziet waar je
              terechtkomt voordat je klikt.
            </p>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {BESTEMMINGEN.map((b) => (
              <li key={b.pad}>
                <Link
                  href={b.pad}
                  className="flex h-full flex-col rounded-[var(--r-md)] bg-white p-6 transition-shadow duration-500 hover:shadow-[0_14px_36px_rgba(67,79,58,.08)]"
                >
                  <span className="text-[17px] leading-7 font-medium text-[var(--t-strong)]">
                    {b.naam}
                  </span>
                  <span className="mt-1 text-[14px] leading-6 text-[var(--t-muted)]">
                    {b.eersteVraag}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Waar dit heen leidt ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <Label opDonker>Waar dit toe dient</Label>
              <h2 className="diba-display-m mt-4">
                Zodat je een gesprek{" "}
                <span className="diba-accent-on-dark">kunt voeren</span>
              </h2>
              <p className="mt-6 max-w-[46ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                Alles hierboven staat er zodat je een gesprek kunt voeren in
                plaats van een aanbod te moeten geloven. Ook als dat gesprek
                ergens anders plaatsvindt.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <p className="text-[16px] leading-7 text-[var(--on-dark-body)]">
                Het register telt nu {aantalStukken} onderdelen. Het groeit mee
                met de site: elke nieuwe pagina met een eigen tool hoort hier
                bij te komen, anders is hij weer onvindbaar.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href="/intake"
                  className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white"
                >
                  Plan een huidconsult
                </Link>
                <Link
                  href="/huidprofiel"
                  className="diba-label diba-label-on-dark underline underline-offset-4"
                >
                  Of vul eerst je huidprofiel in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
