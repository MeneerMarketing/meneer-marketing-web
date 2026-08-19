import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LaserHuidtypeRing from "@/components/laser/LaserHuidtypeRing";
import LaserPulseMap from "@/components/laser/LaserPulseMap";
import LaserSessieBoog from "@/components/laser/LaserSessieBoog";
import PillarNav from "@/components/pillar/PillarNav";
import { PillarFaq, SectieKop } from "@/components/pillar/PillarSecties";
import Label from "@/components/ui/Label";
import ReviewCard from "@/components/ui/ReviewCard";
import SalonizedScorePanel from "@/components/ui/SalonizedScorePanel";
import { FIGMA_INTENT_LASER } from "@/data/figma-home-images";
import { LASER_LANDING_FAQ, LASER_USP_ROWS } from "@/data/laser-landing";
import { reviewsForTopic } from "@/data/reviews";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";

/**
 * Laserontharing — de grootste commerciële pagina van de site.
 *
 * HERBOUWD, EN NIET ALLEEN QUA OPMAAK.
 *
 * Dit was de laatste pagina die nog buiten het ontwerpsysteem stond. Zes losse
 * hexkleuren, eigen kopformaten in plaats van de display-klassen, randen en
 * scheidingslijnen overal, en een eigen FAQ-implementatie naast die van de rest.
 * Daardoor week de belangrijkste pagina van de site zichtbaar af van de pagina's
 * eromheen, en week hij ook af bij elke huisstijlwijziging die daarna komt.
 *
 * Zwaarder woog wat er níet stond. Vier secties bestonden uit een label, een kop en
 * meteen een component: de configurator, het huidtype, de sessieboog en de reviews. Geen
 * enkele zin die uitlegt waarom je ernaar kijkt. Voor iemand die hier binnenkomt met de
 * vraag "kan dit bij mij en wat kost het" is dat vier keer een gereedschap zonder
 * gebruiksaanwijzing, en dat is meteen de reden dat deze pagina met 402 woorden de dunste
 * van alle grote pagina's was.
 *
 * Elke sectie heeft nu een introzin die één ding doet: zeggen welke vraag hij beantwoordt.
 *
 * WAT ER BEWUST BLIJFT.
 *
 * Het beeld in de hero, de drie punten in de strook en de volgorde van de secties. Die
 * volgorde is de trechter van deze pagina: waar wil je het, past het bij jouw huid, hoe
 * lang duurt het, wat zeggen anderen, en pas dan de vragen. Daar was niets mis mee.
 *
 * Eén donkergroen vlak: de afsluiter (§5).
 */

export const metadata: Metadata = {
  title: "Laserontharing Rotterdam | GentleMax Pro",
  description:
    "Laserontharing met GentleMax Pro in Hillegersberg. Bereken je prijs per zone, veilig voor huidtype I tot VI.",
  ...NOG_IN_AANBOUW,
};

const LASER_REVIEWS = reviewsForTopic("laser").slice(0, 3);

const ANKERS = [
  { id: "zones", label: "Waar je wilt ontharen" },
  { id: "huidtype", label: "Jouw huidtype" },
  { id: "sessies", label: "Hoeveel sessies" },
  { id: "reviews", label: "Reviews" },
  { id: "vragen", label: "Vragen" },
] as const;

export default function LaserontharingPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Laserontharing", url: `${DIBA_SITE_URL}/laserontharing` },
        ])}
      />

      {/* ── Hero ── */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="py-14 lg:py-20">
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">Laserontharing</span>
            </nav>

            <h1 className="diba-display-l mt-6 max-w-[15ch]">
              Je prijs vooraf.
              <br />
              <span className="diba-accent">Je huidtype meegenomen.</span>
            </h1>

            <p className="mt-7 max-w-[52ch] text-[17px] leading-8 text-[var(--t-body)]">
              Laserontharing wordt bijna overal per zone verkocht zonder dat je
              vooraf weet wat het bij jou wordt. Hier kies je je zones, zie je
              meteen je opbouw, en staat erbij wat een pakket vervangt.
            </p>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-8 text-[var(--t-body)]">
              Wat je niet vooraf krijgt is het aantal sessies. Dat hangt af van
              je huidtype en de zone, en dat hoor je na de meting in plaats van
              nu.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link
                href="/laserontharing/configurator"
                className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
              >
                Bereken je laserprijs
                <span aria-hidden="true">›</span>
              </Link>
              <SalonizedScorePanel variant="compact" />
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[var(--r-xl)] bg-[var(--g-400)]">
            <Image
              src={FIGMA_INTENT_LASER.src}
              alt={FIGMA_INTENT_LASER.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[var(--foto-scrim)]/68 via-[var(--foto-scrim)]/12 to-transparent"
              aria-hidden="true"
            />
            <p className="diba-label absolute top-7 left-7 rounded-[var(--r-pill)] bg-white/90 px-4 py-2 text-[var(--g-700)]">
              Hillegersberg · Rotterdam
            </p>
            <p className="diba-card-title-lg absolute bottom-7 left-7 max-w-xs text-white drop-shadow-[0_2px_12px_rgba(15,45,28,.35)]">
              Rustig in de stoel.
              <br />
              Scherp in de instelling.
            </p>
          </div>
        </div>
      </section>

      {/* ── De drie punten ──
          Stond op een strook met scheidingslijnen ertussen. Drie vlakken doen hetzelfde
          zonder één lijn, en dat is de huisregel. */}
      <section className="bg-white px-5 py-14 sm:px-9 lg:px-[7.5vw]">
        <ul className="mx-auto grid gap-4 md:grid-cols-3">
          {LASER_USP_ROWS.map(({ title, body }) => (
            <li
              key={title}
              className="rounded-[var(--r-md)] bg-[var(--g-025)] p-6 sm:p-7"
            >
              <p className="diba-card-title text-[var(--t-strong)]">{title}</p>
              <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <PillarNav ankers={ANKERS} />

      {/* ── Zones ── */}
      <section
        id="zones"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="De zones"
            kop="Waar wil je"
            accent="ontharen?"
            intro="Kies een gebied en je ziet welke zones daaronder vallen. In de configurator daarna wijs je ze los aan en zie je meteen wat je opbouw wordt, inclusief het moment waarop een pakket goedkoper is dan de losse zones."
          />
          <div className="mt-12">
            <LaserPulseMap />
          </div>
        </div>
      </section>

      {/* ── Huidtype ── */}
      <section
        id="huidtype"
        className="scroll-mt-[var(--anker-offset)] bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Huidtype"
            kop="Fitzpatrick I"
            accent="tot en met VI."
            intro="Je huidtype bepaalt niet óf laserontharing kan, maar met welke instelling. Het gaat daarbij om hoe je huid op zon reageert en niet om hoe hij eruitziet, en weet je het niet zeker, dan wordt het bij de intake bepaald."
          />
          <div className="mt-12 rounded-[var(--r-lg)] bg-white p-7 sm:p-10">
            <LaserHuidtypeRing />
          </div>
          <p className="mt-6 max-w-[76ch] text-[15px] leading-7 text-[var(--t-muted)]">
            De GentleMax Pro heeft twee golflengtes, en welke van de twee je
            krijgt hangt hiervan af. Dat is de enige technische keuze op deze
            site die rechtstreeks over veiligheid gaat.{" "}
            <Link
              href="/gentlemax-pro"
              className="text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              Zo werkt dat
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── Sessies ── */}
      <section
        id="sessies"
        className="scroll-mt-[var(--anker-offset)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
      >
        <div className="mx-auto">
          <SectieKop
            label="Het verloop"
            kop="Waarom het"
            accent="een reeks is."
            intro="Een haar is alleen te raken als hij in zijn groeifase zit, en dat doen ze niet allemaal tegelijk. Daarom werkt één sessie nooit en zit er tussen twee sessies weken. Dit is hoe zo'n reeks eruitziet."
          />
          <div className="mt-12 lg:max-w-4xl">
            <LaserSessieBoog />
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      {LASER_REVIEWS.length > 0 ? (
        <section
          id="reviews"
          className="scroll-mt-[var(--anker-offset)] bg-white px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
        >
          <div className="mx-auto">
            <SectieKop
              label="Reviews"
              kop="Wat anderen"
              accent="erover zeggen."
              intro="Deze komen uit Salonized en zijn niet door ons uitgekozen op inhoud. Wat er niet bij staat is een voor-en-na, want bij ontharing verandert vooral het licht op de foto en niet wat je ziet."
              raster="gelijk"
            />
            <ul className="mt-12 grid gap-4 md:grid-cols-3 md:items-start">
              {LASER_REVIEWS.map((r) => (
                <li key={r.id}>
                  <ReviewCard
                    quote={r.quote}
                    name={r.name}
                    treatment={r.treatment}
                    stars={r.stars}
                    relativeDate={r.relativeDate}
                  />
                </li>
              ))}
            </ul>
            <Link
              href="/resultaten"
              className="diba-label mt-8 inline-flex min-h-11 items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
            >
              Alle reviews en resultaten
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        </section>
      ) : null}

      {/* ── Vragen ──
          Stond hier als eigen implementatie met haarlijnen, naast de PillarFaq die de
          rest van de site gebruikt. Twee accordeons met hetzelfde doel lopen bij de
          eerste wijziging uit elkaar. */}
      <PillarFaq
        items={LASER_LANDING_FAQ.map((f) => ({
          vraag: f.question,
          antwoord: f.answer,
        }))}
      />

      {/* ── Afsluiter ── */}
      <section className="mx-5 mb-5 rounded-[var(--r-xl)] bg-[var(--g-700)] px-7 py-14 text-[var(--on-dark)] sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            <Label opDonker>Volgende stap</Label>
            <h2 className="diba-display-m mt-5 max-w-[18ch]">
              Eerst je opbouw,
              <br />
              <span className="diba-accent-on-dark">daarna pas een datum.</span>
            </h2>
            <p className="mt-6 max-w-[54ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
              In de configurator stel je zelf samen wat je wilt en zie je het
              bedrag per sessie. Je keuze staat daarna in de adresbalk, dus je
              kunt hem bewaren of doorsturen en er later op terugkomen.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/laserontharing/configurator"
              className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Naar de configurator
              <span aria-hidden="true">›</span>
            </Link>
            <a
              href={DIBA_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-800)] px-6 text-[var(--on-dark)] transition-colors hover:bg-[var(--g-900)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Eerst je vraag stellen
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
