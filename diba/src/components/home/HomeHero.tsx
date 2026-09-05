import Link from "next/link";
import HeroVideo from "@/components/home/HeroVideo";
import Button from "@/components/ui/Button";
import {
  FIGMA_HERO_PORTRAIT,
  FIGMA_HERO_PORTRAIT_ALT,
} from "@/lib/figma-home-layout";
import { DIBA_HOME_PROOF_ITEMS, type ProofStripItem } from "@/lib/site";

/**
 * De binnenkomer van de homepage.
 *
 * TWEE COMPOSITIES, NIET ÉÉN DIE MEEBUIGT.
 *
 * De vorige hero was een tweekolommer die op een telefoon uit elkaar viel: de foto ging
 * naar boven, de tekst eronder, en de vier cijfers stonden pas na een scroll in een losse
 * witte strook. Gemeten stond de onderkant van die cijfers op 1080 pixels, ruim onder een
 * scherm van 812. Wie op zijn telefoon binnenkwam zag dus een foto en een kop, en niets
 * waaruit blijkt dat dit een kliniek is met een verleden.
 *
 * Dit is geen hero die meebuigt maar twee ontwerpen die hetzelfde zeggen.
 *
 * MOBIEL. Beeld op 4:3, met daaroverheen een witte strook die de onderrand overlapt en de
 * vier cijfers naast elkaar draagt. Die overlap is het hele idee: de cijfers kosten geen
 * extra schermhoogte en staan tóch bovenaan. Daaronder de kop, één regel uitleg en één
 * knop die de volle breedte pakt. Alles samen past binnen de eerste schermhoogte, ook op
 * een toestel van 667 pixels.
 *
 * DESKTOP. Tekst links, staand beeld rechts, en de cijfers als brede rij onder allebei,
 * gescheiden door haarlijnen. Daar is ruimte voor de volledige labels en voor cijfers op
 * formaat, en daar eindigt de fold dus op bewijs in plaats van op een naad.
 *
 * WAT BLIJFT. Het ronde beeldvlak, de plaatsnaam en het groene zegel met "eerlijk advies".
 * Dat zegel is het herkenbaarste element van deze pagina; er wordt niets aan veranderd
 * behalve dat het op mobiel iets kleiner staat.
 *
 * DE KOP. "De huidkliniek in Rotterdam" en niet "Huidkliniek in Rotterdam" (Rojda,
 * 5 september 2026). Dat lidwoord is het verschil tussen een omschrijving en een claim, en
 * de claim is te dragen: sinds 2017 open, met 3.893 beoordelingen die openbaar staan.
 */

function getal(item: ProofStripItem) {
  const n = item.isJaartal
    ? String(item.value)
    : item.value.toLocaleString("nl-NL");
  return n + (item.suffix ?? "");
}

/**
 * De vier cijfers, in één vorm en twee maten.
 *
 * `compact` is de mobiele versie: korte labels, kleine cijfers, en hij overlapt het beeld
 * erboven. Zonder `compact` is het de brede band onder de hero, met de volledige labels.
 *
 * Waarom één component: het waren twee blokken met eigen opmaak, en toen de ene mooier
 * werd gevonden dan de andere bleek dat verschil nergens een reden voor te hebben.
 */
function Cijfers({ compact = false }: { compact?: boolean }) {
  return (
    <dl
      className={`grid grid-cols-4 rounded-[var(--r-md)] bg-white shadow-[0_6px_24px_-16px_rgba(23,55,42,.45)] ${
        compact ? "relative -mt-7 px-1 py-3" : "px-2 py-6"
      }`}
    >
      {DIBA_HOME_PROOF_ITEMS.map((item, i) => (
        <div
          key={item.label}
          className={`text-center ${compact ? "px-1" : "px-4"} ${
            i > 0 ? "border-l border-[var(--g-100)]" : ""
          }`}
        >
          <dd
            className={`leading-tight font-medium text-[var(--g-700)] tabular-nums ${
              compact
                ? "text-[15px] tracking-[-.03em]"
                : "text-[30px] tracking-[-.04em]"
            }`}
          >
            {getal(item)}
          </dd>
          <dt
            className={`text-[var(--t-muted)] ${
              compact ? "mt-1 text-[10px] leading-tight" : "diba-label mt-2"
            }`}
          >
            {compact ? (item.kort ?? item.label) : item.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}

export default function HomeHero() {
  return (
    <section id="top" className="bg-[var(--g-025)]">
      <div className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-7 pt-5 pb-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:pt-8 lg:pb-10">
          {/* ── Beeld ──
              Een opname en geen foto (Yasin, 5 september 2026): een stilstaand portret
              pakte niet. De foto blijft wel bestaan als poster, dus zolang de video laadt
              staat er precies wat er eerst stond.

              Het beeld liep even door tot de schermrand. Dat oogde royaal maar het klopte
              niet: de rechterrand viel dan nergens meer samen met de cijferkaart eronder,
              en die twee horen op één lijn te staan. Nu evenveel wit links als rechts.

              Staat in de bron vóór de tekst zodat het op mobiel bovenaan komt, en gaat op
              lg naar de tweede kolom. Op mobiel 4:3 en op desktop hoog: bewegend beeld op
              een telefoon mag het scherm niet opeten, want daaronder staan de cijfers. */}
          <div className="diba-hero-in relative order-1 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--r-lg)] rounded-bl-[4.5rem] bg-[var(--g-200)] sm:aspect-[16/9] lg:aspect-auto lg:h-[560px] lg:rounded-bl-[11rem]">
              <HeroVideo
                bestand="/videos/home-hero.mp4"
                poster={FIGMA_HERO_PORTRAIT}
                beschrijving={FIGMA_HERO_PORTRAIT_ALT}
              />
              {/* Alleen onderin, en neutraal donker. Een groene waas over een huid is bij
                  een huidkliniek precies het verkeerde: de kleur van iemands huid is hier
                  het onderwerp. */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[var(--foto-scrim)]/30 via-transparent to-transparent"
                aria-hidden="true"
              />
              <span className="diba-label absolute top-5 left-5 rounded-[var(--r-pill)] bg-white/90 px-4 py-2 text-[var(--g-700)] sm:top-7 sm:left-7">
                Rotterdam
              </span>
              {/* Op mobiel hoger, want daaronder komt de cijferstrook. */}
              <span className="diba-label absolute right-5 bottom-14 grid h-[72px] w-[72px] place-items-center rounded-[var(--r-pill)] bg-[var(--g-700)] text-center text-[10px] leading-4 text-white sm:right-7 sm:bottom-7 sm:h-24 sm:w-24 sm:text-[11px]">
                Eerlijk
                <br />
                advies
              </span>
            </div>

            {/* ── De cijferkaart, mobiel ──
                Overlapt de onderrand van het beeld. Daardoor kosten de vier cijfers
                nauwelijks schermhoogte en staan ze toch in het eerste scherm: gemeten op
                451 pixels, ruim boven de vouw van 812. */}
            <div className="lg:hidden">
              <Cijfers compact />
            </div>
          </div>

          {/* ── Tekst ── */}
          <div className="order-2 lg:order-1">
            {/* Dé met accent aigu. Het lidwoord met nadruk is de Nederlandse manier om
                te zeggen dat het niet zomaar een huidkliniek is, en dat is precies wat
                deze kop bedoelt (Yasin, 5 september 2026). */}
            <h1 className="diba-hero-in diba-display-xl max-w-[13ch]">
              Dé huidkliniek
              <br />
              <span className="diba-accent">in Rotterdam</span>
            </h1>

            <p className="diba-hero-in diba-hero-in-1 mt-4 max-w-[46ch] text-[16px] leading-7 text-[var(--t-body)] lg:mt-7">
              Sinds 2017 helpen onze huidtherapeuten je met acne, pigment,
              roodheid, littekens, huidveroudering en ongewenst haar. Tijdens de
              intake hoor je wat er bij jou mogelijk is.
            </p>

            {/* Op mobiel één knop over de volle breedte: één duidelijke stap. De tweede
                route staat eronder als link, want twee even zware knoppen onder elkaar
                maken van een keuze een aarzeling. */}
            <div className="diba-hero-in diba-hero-in-2 mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-4 lg:mt-9">
              <Button href="/intake" className="w-full sm:w-auto">
                Afspraak maken
              </Button>
              {/* De span en niet de knop zelf: `hidden` op de Button verliest van de
                  `inline-flex` in zijn basisklassen, want dat zijn twee utilities uit
                  dezelfde groep en dan wint de stylesheetvolgorde. Gemeten op 375 pixels
                  stond hij gewoon in beeld. */}
              <span className="hidden sm:inline-flex">
                <Button href="/behandelingen" variant="ghost">
                  Bekijk de behandelingen
                </Button>
              </span>
            </div>

            {/* Eén zin, op elk formaat. Hier stonden op mobiel twee losse links
                naast elkaar; twee gelijkwaardige zijpaden onder één hoofdknop maken van
                een keuze een rijtje. */}
            <p className="mt-4 text-[14px] leading-6 text-[var(--t-muted)] lg:mt-5">
              Weet je nog niet welke behandeling past?{" "}
              <Link
                href="/behandeling-op-advies"
                className="text-[var(--g-700)] underline underline-offset-4 transition-colors hover:text-[var(--g-800)]"
              >
                Boek een behandeling op advies
              </Link>
              .
            </p>
          </div>
        </div>

        {/* ── De cijferkaart, desktop ──
            Dezelfde vorm als op mobiel: wit, ronde hoeken, een zachte schaduw. Hier stond
            een kale rij met haarlijnen, en die las als een voetnoot bij de pagina in
            plaats van als het bewijs onder de claim. */}
        <div className="hidden pb-12 lg:block">
          <Cijfers />
        </div>
      </div>
    </section>
  );
}
