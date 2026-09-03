import type { Metadata } from "next";
import Link from "next/link";
import Label from "@/components/ui/Label";
import Image from "next/image";
import { KWALITEITSREGISTER, TEAM, VAKGEBIEDEN } from "@/data/team";
import { reviewsVoorTeamlid } from "@/data/team-reviews";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * De teampagina.
 *
 * WAAROM DEZE PAGINA HET SLUITSTUK IS EN GEEN SMOELENBOEK.
 *
 * Op elke apparatuurpagina staat dezelfde zin: twee klinieken met hetzelfde apparaat
 * geven niet hetzelfde resultaat, want wat telt is de instelling en de hand die het
 * apparaat vasthoudt. Dat is een prettige zin om op te schrijven en hij is pas iets waard
 * als die hand ergens een naam krijgt. Dit is die plek.
 *
 * DE SIGNATUUR VAN DEZE PAGINA: HET VERSCHIL TUSSEN DE TWEE TITELS.
 *
 * In deze kliniek werken twee soorten specialist. Huidtherapeut is een wettelijk
 * beschermde opleidingstitel (artikel 34 Wet BIG); orthomoleculair huidspecialist is dat
 * niet. Dat verschil staat nergens op een kliniekwebsite en het is precies wat een klant
 * hoort te weten. Zie het commentaar bij `VAKGEBIEDEN` in `team.ts` voor de bronnen en
 * voor waarom dit een besluit van Okan is en niet van mij.
 *
 * BIO`S: er staan er nu, over de rol en niet over de persoon. Zie team.ts.
 * WAT ER NOG STEEDS NIET STAAT: bio's en portretten. Die verzin je niet over echte mensen. De
 * kaarten hieronder tonen wat de kliniek zelf publiceert, en meer niet.
 *
 * Eén donkergroen vlak: het blok over de twee titels (§5).
 */

export const metadata: Metadata = zoekmachineVelden({
  pad: "/team",
  titel: "Ons team",
  omschrijving:
    "De acht mensen die bij Diba Clinics werken, met per persoon het vakgebied en of de titel wettelijk beschermd is.",
});

export default function TeamPage() {
  const perVak = VAKGEBIEDEN.map((v) => ({
    ...v,
    leden: TEAM.filter((t) => t.vak === v.id),
  })).filter((v) => v.leden.length > 0);

  /* Wie er in de reviews bij naam genoemd wordt, meest genoemd eerst. Wie niet genoemd
     wordt valt weg in plaats van met een leeg vak te blijven staan: nul reviews tonen
     leest als een oordeel over die persoon en dat is het niet. */
  const genoemd = TEAM.map((lid) => ({
    lid,
    reviews: reviewsVoorTeamlid(lid.naam),
  }))
    .filter((x) => x.reviews.length > 0)
    .sort((a, b) => b.reviews.length - a.reviews.length);

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Team", url: `${DIBA_SITE_URL}/team` },
        ])}
      />

      {/* ── Hero: de belofte van de apparatuurpagina's, hier ingelost ── */}
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
              <span className="text-[var(--t-muted)]">Team</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[14ch]">
              De mensen die
              <br />
              <span className="diba-accent">je huid behandelen</span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Bij elk apparaat op deze site staat dezelfde zin: twee klinieken
              met hetzelfde apparaat geven niet hetzelfde resultaat, want wat
              telt is de instelling en de hand die het vasthoudt.
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--t-body)]">
              Dat is makkelijk gezegd. Hier staat wiens hand dat is.
            </p>
          </div>

          {/* De samenstelling in cijfers, want dat is wat je er als klant aan hebt. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10">
            <Label>Waar het team uit bestaat</Label>
            <dl className="mt-6 space-y-1">
              {perVak.map((v) => (
                <div
                  key={v.id}
                  className="-mx-4 flex min-h-14 items-center justify-between gap-4 rounded-[var(--r-md)] px-4"
                >
                  <dt className="text-[16px] leading-6 text-[var(--t-body)]">
                    {v.label}
                    {v.leden.length > 1 ? "en" : ""}
                  </dt>
                  <dd className="text-[24px] leading-none font-medium text-[var(--t-strong)] tabular-nums">
                    {v.leden.length}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-t border-[var(--g-050)] pt-5 text-[14px] leading-6 text-[var(--t-muted)]">
              Je kiest niet zelf bij wie je terechtkomt. Dat gaat op je vraag,
              en als je een voorkeur hebt kun je die gewoon noemen.
            </p>
          </div>
        </div>
      </section>

      {/* ── De signatuur: welke titel is beschermd ── */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-20">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <div>
                <Label opDonker>Wat een titel betekent</Label>
                <h2 className="diba-display-m mt-4 max-w-[16ch]">
                  Huidtherapeut of schoonheidsspecialist:{" "}
                  <span className="diba-accent-on-dark">het verschil</span>
                </h2>
                <p className="mt-6 max-w-[44ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                  Dit staat op geen enkele kliniekwebsite en het is precies wat
                  je hoort te weten voordat je op een stoel gaat zitten. Dus
                  staat het er.
                </p>
              </div>

              <ul className="space-y-5">
                {VAKGEBIEDEN.map((v) => (
                  <li
                    key={v.id}
                    className="border-b border-white/15 pb-5 last:border-b-0 last:pb-0"
                  >
                    <p className="flex flex-wrap items-center gap-3">
                      <span className="text-[18px] leading-7 font-medium">
                        {v.label}
                      </span>
                      <span
                        className={`diba-label rounded-[var(--r-pill)] px-3 py-1 ${
                          v.beschermd
                            ? "bg-[var(--on-dark-btn)] text-[var(--on-dark-btn-text)]"
                            : "bg-white/15 text-[var(--on-dark-body)]"
                        }`}
                      >
                        {v.beschermd
                          ? "Beschermde titel"
                          : "Geen beschermde titel"}
                      </span>
                    </p>
                    <p className="mt-2 max-w-[54ch] text-[15px] leading-7 text-[var(--on-dark-body)]">
                      {publicCopy(v.wat)}
                    </p>
                    <p className="mt-2 max-w-[54ch] text-[15px] leading-7 text-[var(--on-dark-body)]">
                      {publicCopy(v.opleiding)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── De mensen, per vak ── */}
      <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto space-y-14">
          {perVak.map((v) => (
            <div key={v.id}>
              <Label>
                {v.label} · {v.leden.length}
              </Label>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {v.leden.map((lid) => (
                  /* De kaart zelf heeft geen padding meer: het portret vult de bovenkant
                     tot alle drie de randen, en de tekst zit in een eigen blok eronder. Een
                     foto met marge eromheen leest als een plaatje in een kaartje; een foto
                     die de kaart begint leest als de persoon zelf.

                     Bij het aanwijzen zoomt het portret heel licht in en licht de naam op in
                     het merkgroen. Meer gebeurt er niet: het is een kaart met een mens erop
                     en geen bedieningselement. */
                  <li
                    key={lid.slug}
                    id={lid.slug}
                    className="group scroll-mt-[var(--anker-offset)] overflow-hidden rounded-[var(--r-lg)] bg-white transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(23,55,42,.10)]"
                  >
                    {lid.portret ? (
                      /* 4:5 en object-top: de opnamen zijn 2:3, dus er gaat onderaan iets
                         af. Van boven bijsnijden zou het voorhoofd raken. */
                      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--g-050)]">
                        <Image
                          src={lid.portret}
                          alt={`${lid.naam}, ${lid.functie}`}
                          fill
                          sizes="(min-width: 1280px) 23vw, (min-width: 640px) 46vw, 92vw"
                          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                        />
                      </div>
                    ) : null}

                    <div className="p-6 sm:p-7">
                      <p className="diba-card-title text-[var(--t-strong)] transition-colors duration-500 group-hover:text-[var(--g-700)]">
                        {lid.naam}
                      </p>
                      {/* De functie als label en niet als zin: hij herhaalt de kop van de
                          groep waarin deze kaart staat, dus hij hoort te ondersteunen en
                          niet mee te lezen met de bio. */}
                      <p className="diba-label mt-2 text-[var(--t-label)]">
                        {lid.functie}
                      </p>
                      {lid.bio ? (
                        <p className="mt-5 text-[15px] leading-7 text-[var(--t-body)]">
                          {publicCopy(lid.bio)}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Het register: een echte drempel, en we claimen niet wie erin staat. */}
          <div className="rounded-[var(--r-lg)] bg-white p-7 sm:p-9 lg:p-11">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
              <div>
                <Label>Bijhouden</Label>
                <p className="diba-display-s mt-4 max-w-[14ch]">
                  Een diploma is
                  <span className="diba-accent"> geen eindpunt.</span>
                </p>
              </div>
              <div>
                <p className="max-w-[58ch] text-[16px] leading-8 text-[var(--t-body)]">
                  Huidtherapeuten kunnen zich inschrijven in het{" "}
                  {KWALITEITSREGISTER.naam}. {KWALITEITSREGISTER.eisen}
                </p>
                <p className="mt-4 max-w-[58ch] text-[16px] leading-8 text-[var(--t-body)]">
                  Het register is vrijwillig, dus inschrijving zegt iets en het
                  ontbreken ervan zegt weinig. Wie van ons erin staat zetten we
                  erbij zodra we dat per persoon hebben nagelopen; een claim
                  daarover hoort gecontroleerd te zijn en niet aangenomen.
                </p>
                <a
                  href={KWALITEITSREGISTER.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="diba-label mt-7 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
                >
                  Het register bekijken
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Wie er bij naam genoemd wordt ──
          De teampagina had acht namen met acht functies en verder niets. Biografieën
          verzinnen kan niet: dit zijn echte mensen. Wat wel bestaat zijn klanten die uit
          zichzelf een naam noemen, en die quotes staan openbaar bij Salonized. Gekoppeld
          op het behandelveld ("Behandeling bij Iris") en niet op de tekst van de review,
          want dan belandt een toevallige naamsvermelding bij de verkeerde persoon. */}
      {genoemd.length > 0 ? (
        <section className="bg-[var(--g-025)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
          <div className="mx-auto">
            <div>
              <Label>Bij naam genoemd</Label>
              <h2 className="diba-display-m mt-4">
                Wat klanten schreven{" "}
                <span className="diba-accent">over wie hen hielp.</span>
              </h2>
              <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
                Toon hier alleen reviews die rechtstreeks uit Salonized komen.
                Laat de oorspronkelijke tekst staan en zorg dat de naam van een
                medewerker alleen wordt getoond wanneer die naam ook in de
                review of afspraak staat.
              </p>
            </div>

            <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {genoemd.map(({ lid, reviews }) => (
                <li
                  key={lid.slug}
                  className="flex flex-col rounded-[var(--r-lg)] bg-white p-7 sm:p-8"
                >
                  <p className="diba-card-title text-[var(--t-strong)]">
                    {lid.naam}
                  </p>
                  <p className="diba-label mt-2 text-[var(--t-label)]">
                    {lid.functie}
                  </p>
                  <p className="mt-4 text-[14px] leading-6 text-[var(--t-muted)] tabular-nums">
                    {reviews.length}{" "}
                    {reviews.length === 1
                      ? "review noemt deze naam"
                      : "reviews noemen deze naam"}
                  </p>
                  <blockquote className="mt-5 flex-1 text-[15px] leading-7 text-[var(--t-body)]">
                    {reviews[0].quote}
                  </blockquote>
                  <p className="mt-5 text-[14px] leading-6 text-[var(--t-muted)]">
                    {reviews[0].name}
                    {reviews[0].relativeDate
                      ? ` · ${reviews[0].relativeDate}`
                      : ""}
                  </p>
                </li>
              ))}
            </ul>

            <Link
              href="/reviews"
              className="diba-label mt-8 inline-flex min-h-11 items-center text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              Alle reviews, en waarom een 5,0 wantrouwen verdient
            </Link>
          </div>
        </section>
      ) : null}

      {/* ── Afsluiter ── */}
      <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>Bij wie kom je terecht</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              We plannen op
              <br />
              <span className="diba-accent">wat je nodig hebt</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              Wie je meting doet hangt af van waar je voor komt. Gaat het over
              acne of pigment, dan zit er vaak een voedingskant aan en schuift
              er iemand aan die daarnaar kijkt. Gaat het over laser of needling,
              dan doet een huidtherapeut het. Heb je een voorkeur, zeg het bij
              het maken van de afspraak; dat kan gewoon.
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
                Een voorkeur doorgeven
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
