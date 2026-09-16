import type { Metadata } from "next";
import Link from "@/components/ui/Linktaal";
import Label from "@/components/ui/Label";
import Veegrij from "@/components/ui/Veegrij";
import Image from "next/image";
import {
  KWALITEITSREGISTER,
  TEAM,
  TEAM_AANTAL,
  TEAM_SAMENSTELLING,
  VAKGEBIEDEN,
} from "@/data/team";
import { reviewsVoorTeamlid } from "@/data/team-reviews";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";
import LeesVerder from "@/components/ui/LeesVerder";
import { t, tc } from "@/lib/vertaal";
import { relatieveDatum } from "@/lib/relatieve-datum";
import { taalNu } from "@/lib/taalcontext";
import { reviewtekst } from "@/lib/reviewtaal";
import Vertaaldnoot from "@/components/reviews/Vertaaldnoot";

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
  omschrijving: `De ${TEAM_AANTAL} mensen die bij Diba Clinics werken, met per persoon het vakgebied en of de titel wettelijk beschermd is.`,
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
      <section className="bg-[var(--g-700)] text-[var(--on-dark)] px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <nav
              aria-label={tc("Kruimelpad")}
              className="diba-label diba-label-on-dark flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-white">
                {t("Home")}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--on-dark-body)]">{t("Team")}</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[21ch]">
              {t("De mensen die")}
              <br />
              <span className="diba-accent-on-dark">
                {t("je huid behandelen")}
              </span>
            </h1>

            <p className="mt-7 max-w-[54ch] text-[17px] leading-8 text-[var(--on-dark-body)]">
              {t(
                "Bij elk apparaat op deze site staat dezelfde zin: twee klinieken met hetzelfde apparaat geven niet hetzelfde resultaat, want wat telt is de instelling en de hand die het vasthoudt.",
              )}
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-8 text-[var(--on-dark-body)]">
              {t("Dat is makkelijk gezegd. Hier staat wiens hand dat is.")}
            </p>
          </div>

          {/* De samenstelling in cijfers, want dat is wat je er als klant aan hebt. */}
          <div className="flex flex-col justify-center rounded-[var(--r-lg)] bg-white p-8 sm:p-10 text-[var(--t-strong)]">
            <Label>{t("Waar het team uit bestaat")}</Label>
            {/* Alleen de behandelende vakken. De praktijkmanager stond hier als derde
                regel tussen, en dat maakt van een organiserende functie een vakgebied. */}
            {/* De aantallen komen uit TEAM_SAMENSTELLING (Rojda, 7 september 2026) en niet
                uit de lijst met namen: die telt er acht, omdat de schoonheidsspecialist
                nog geen kaart heeft. De cijfers kloppen dan alvast. */}
            <dl className="mt-6 space-y-1">
              {TEAM_SAMENSTELLING.map((s) => {
                const vak = VAKGEBIEDEN.find((v) => v.id === s.vak);
                if (!vak || !vak.behandelend) return null;
                return (
                  <div
                    key={s.vak}
                    className="-mx-4 flex min-h-14 items-center justify-between gap-4 rounded-[var(--r-md)] px-4"
                  >
                    <dt className="text-[16px] leading-6 text-[var(--t-body)]">
                      {/* Het meervoud hoort bij het woord en niet erachter geplakt: los
                          erachter leverde "Skin therapist" + "en" op, dus "Skin
                          therapisten". Zo gaat het hele woord door het woordenboek. */}
                      {tc(s.aantal > 1 ? `${vak.label}en` : vak.label)}
                    </dt>
                    <dd className="text-[24px] leading-none font-medium text-[var(--t-strong)] tabular-nums">
                      {s.aantal}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-6 border-t border-[var(--g-050)] pt-5 text-[14px] leading-6 text-[var(--t-muted)]">
              {t(
                "Je kiest niet zelf bij wie je terechtkomt. Dat gaat op je vraag, en als je een voorkeur hebt kun je die gewoon noemen.",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── De signatuur: welke titel is beschermd ── */}
      <section className="px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-20">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-050)] p-8 text-[var(--t-strong)] sm:p-12 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <div>
                <Label>{t("Wat een titel betekent")}</Label>
                <h2 className="diba-display-m mt-4 max-w-[16ch]">
                  {t("Het verschil in")}{" "}
                  <span className="diba-accent">{t("opleiding")}</span>
                </h2>
                <p className="mt-6 max-w-[44ch] text-[16px] leading-7 text-[var(--t-body)]">
                  {t(
                    "Wie je huid behandelt en wie meekijkt naar wat er van binnenuit meespeelt, zijn twee verschillende opleidingen. Zo weet je wie er bij welke vraag naast je staat.",
                  )}
                </p>
              </div>

              <ul className="space-y-5">
                {VAKGEBIEDEN.filter((v) => v.behandelend).map((v) => (
                  <li
                    key={v.id}
                    className="border-b border-[var(--g-100)] pb-5 last:border-b-0 last:pb-0"
                  >
                    <p className="flex flex-wrap items-center gap-3">
                      <span className="text-[18px] leading-7 font-medium">
                        {tc(v.label)}
                      </span>
                      {/* De badge alleen waar er iets te tonen valt.

                          Hij stond ook onder de twee titels die niet beschermd zijn, met
                          "Geen beschermde titel" erin. Een keurmerk dat "geen" zegt leest
                          als een waarschuwing bij je eigen mensen, en het feit staat een
                          regel lager alsnog. */}
                      {v.beschermd ? (
                        <span className="diba-label rounded-[var(--r-pill)] bg-[var(--g-700)] px-3 py-1 text-[var(--on-dark)]">
                          {t("Beschermde titel")}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-2 max-w-[54ch] text-[15px] leading-7 text-[var(--t-body)]">
                      {tc(v.wat)}
                    </p>
                    <p className="mt-2 max-w-[54ch] text-[15px] leading-7 text-[var(--t-body)]">
                      {tc(v.opleiding)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── De mensen, per vak ── */}
      <section className="bg-[var(--g-025)] px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto space-y-14">
          {perVak.map((v) => (
            <div key={v.id}>
              <Label>
                {tc(v.label)} ({v.leden.length})
              </Label>
              {/* Op een telefoon twee portretten naast elkaar en de bio pas vanaf sm: acht
                  kaarten van een heel scherm onder elkaar was zeven schermen scrollen voor
                  een lijst met namen (Yasin, 9 september 2026: mobiel korter). */}
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
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
                    className="group scroll-mt-[var(--anker-offset)] overflow-hidden rounded-[var(--r-lg)] bg-white transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(67,79,58,.10)]"
                  >
                    {lid.portret ? (
                      /* 4:5 en object-top: de opnamen zijn 2:3, dus er gaat onderaan iets
                         af. Van boven bijsnijden zou het voorhoofd raken. */
                      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--g-050)]">
                        <Image
                          src={lid.portret}
                          alt={`${tc(lid.naam)}, ${tc(lid.functie)}`}
                          fill
                          sizes="(min-width: 1280px) 23vw, (min-width: 640px) 46vw, 92vw"
                          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                        />
                      </div>
                    ) : (
                      /* Geen portret (Rojda, 8 september 2026: "bij Iris even geen foto").
                         Toch een vlak van dezelfde maat, anders zakt de kaart uit de rij en
                         leest het gat als een oordeel. Een monogram in het merkgroen en
                         "foto volgt": eerlijk over wat er nog niet is. */
                      <div
                        aria-hidden="true"
                        className="flex aspect-[4/5] flex-col items-center justify-center gap-3 bg-[var(--g-050)]"
                      >
                        <span className="diba-display-m text-[var(--g-300)]">
                          {lid.naam.charAt(0)}
                        </span>
                        <span className="diba-label text-[var(--t-muted)]">
                          {t("Foto volgt")}
                        </span>
                      </div>
                    )}

                    <div className="p-4 sm:p-7">
                      <p className="diba-card-title text-[var(--t-strong)] transition-colors duration-500 group-hover:text-[var(--g-700)]">
                        {tc(lid.naam)}
                      </p>
                      {/* De functie als label en niet als zin: hij herhaalt de kop van de
                          groep waarin deze kaart staat, dus hij hoort te ondersteunen en
                          niet mee te lezen met de bio. */}
                      <p className="diba-label mt-2 text-[var(--t-label)]">
                        {tc(lid.functie)}
                      </p>
                      {/* Hier stond `lid.bio`, een alinea per persoon. Tijdelijk weg.
                          Yasin, 15 september 2026: "die teksten moeten hun zelf allemaal
                          individueel schrijven voor hun zelf, dat komt later op de site."
                          De alinea's staan nog in `data/team.ts` zodat ze niet
                          kwijtraken; ze komen terug zodra iedereen zijn eigen tekst heeft
                          aangeleverd — dan per persoon, niet als geheel. */}
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
                <Label>{t("Bijhouden")}</Label>
                <p className="diba-display-s mt-4 max-w-[14ch]">
                  {t("Een diploma is")}{" "}
                  <span className="diba-accent">{t("geen eindpunt.")}</span>
                </p>
              </div>
              <div>
                <p className="max-w-[58ch] text-[16px] leading-8 text-[var(--t-body)]">
                  {t("Huidtherapeuten kunnen zich inschrijven in het")}{" "}
                  {tc(KWALITEITSREGISTER.naam)}. {tc(KWALITEITSREGISTER.eisen)}
                </p>
                <LeesVerder>
                  <p className="mt-4 max-w-[58ch] text-[16px] leading-8 text-[var(--t-body)]">
                    {t(
                      "Het register is vrijwillig, dus inschrijving zegt iets en het ontbreken ervan zegt weinig. Wie van ons erin staat zetten we erbij zodra we dat per persoon hebben nagelopen; een claim daarover hoort gecontroleerd te zijn en niet aangenomen.",
                    )}
                  </p>
                </LeesVerder>
                <a
                  href={KWALITEITSREGISTER.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="diba-label mt-7 inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
                >
                  {t("Het register bekijken")}
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
        <section className="bg-[var(--g-025)] px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
          <div className="mx-auto">
            <div>
              <Label>{t("Bij naam genoemd")}</Label>
              <h2 className="diba-display-m mt-4">
                {t("Wat klanten schreven")}{" "}
                <span className="diba-accent">{t("over wie hen hielp.")}</span>
              </h2>
            </div>

            <Veegrij
              label="Reviews waarin een naam valt"
              klasse="-mx-5 mt-8 sm:-mx-9 sm:mt-10 lg:-mx-[7.5vw]"
              breedte="w-[82%] max-w-[420px] sm:w-[46%] lg:w-[31%]"
              items={genoemd.map(({ lid, reviews }) => ({
                sleutel: lid.slug,
                naam: lid.naam,
                inhoud: (
                  <div className="flex h-full flex-col rounded-[var(--r-lg)] bg-white p-7 sm:p-8">
                    <p className="diba-card-title text-[var(--t-strong)]">
                      {tc(lid.naam)}
                    </p>
                    <p className="diba-label mt-2 text-[var(--t-label)]">
                      {tc(lid.functie)}
                    </p>
                    <p className="mt-4 text-[14px] leading-6 text-[var(--t-muted)] tabular-nums">
                      {reviews.length}{" "}
                      {reviews.length === 1
                        ? t("review noemt deze naam")
                        : t("reviews noemen deze naam")}
                    </p>
                    <blockquote className="mt-5 flex-1 text-[15px] leading-7 text-[var(--t-body)]">
                      {reviewtekst(
                        reviews[0].quote,
                        { en: reviews[0].quoteEn, es: reviews[0].quoteEs },
                        taalNu(),
                      )}
                    </blockquote>
                    <p className="mt-5 text-[14px] leading-6 text-[var(--t-muted)]">
                      {reviews[0].name}
                      {reviews[0].relativeDate
                        ? `, ${relatieveDatum(reviews[0].relativeDate, taalNu())}`
                        : ""}
                    </p>
                  </div>
                ),
              }))}
            />

            <Vertaaldnoot className="mt-6" />

            <Link
              href="/reviews"
              className="diba-label mt-8 inline-flex min-h-11 items-center text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              {t("Alle reviews, en hoe je ze het beste leest")}
            </Link>
          </div>
        </section>
      ) : null}

      {/* ── Afsluiter ── */}
      <section className="px-5 py-10 sm:py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Label>{t("Bij wie kom je terecht")}</Label>
            <h2 className="diba-display-m mt-4 max-w-[16ch]">
              {t("We plannen op")}
              <br />
              <span className="diba-accent">{t("wat je nodig hebt")}</span>
            </h2>
          </div>
          <div className="max-w-[58ch]">
            <p className="text-[17px] leading-8 text-[var(--t-body)]">
              {t(
                "Wie je meting doet hangt af van waar je voor komt. Gaat het over acne of pigment, dan zit er vaak een voedingskant aan en schuift er iemand aan die daarnaar kijkt. Gaat het over laser of needling, dan doet een huidtherapeut het. Heb je een voorkeur, zeg het bij het maken van de afspraak; dat kan gewoon.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/intake"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)]"
              >
                {t("Plan een huidconsult")}
              </Link>
              <a
                href={DIBA_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="diba-label text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
              >
                {t("Een voorkeur doorgeven")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
