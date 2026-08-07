import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LaserHuidtypeRing from "@/components/laser/LaserHuidtypeRing";
import LaserPulseMap from "@/components/laser/LaserPulseMap";
import LaserSessieBoog from "@/components/laser/LaserSessieBoog";
import ReviewCard from "@/components/ui/ReviewCard";
import SalonizedScorePanel from "@/components/ui/SalonizedScorePanel";
import { LASER_LANDING_FAQ, LASER_USP_ROWS } from "@/data/laser-landing";
import { FIGMA_INTENT_LASER } from "@/data/figma-home-images";
import { reviewsForTopic } from "@/data/reviews";
import { publicCopy } from "@/lib/copy-flags";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL, DIBA_WHATSAPP_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Laserontharing Rotterdam | GentleMax Pro",
  description:
    "Laserontharing met GentleMax Pro in Hillegersberg. Bereken je prijs per zone, veilig voor huidtype I tot VI.",
  ...NOG_IN_AANBOUW,
};

const LASER_REVIEWS = reviewsForTopic("laser").slice(0, 3);

export default function LaserontharingPage() {
  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Laserontharing", url: `${DIBA_SITE_URL}/laserontharing` },
        ])}
      />

      {/* Hero */}
      <section className="mx-auto max-w-[1800px] px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="grid min-h-[520px] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="py-14 lg:py-20">
            <p className="text-[10px] font-medium uppercase tracking-[.14em] text-[#5d9564]">
              Laserontharing · GentleMax Pro
            </p>
            <h1 className="mt-5 max-w-3xl text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[.92] tracking-[-.07em]">
              Je prijs vooraf.
              <br />
              <span className="text-[#387849]">Je huidtype meegenomen.</span>
            </h1>
            <p className="mt-7 max-w-lg text-[16px] leading-7 text-[#5f7765]">
              Kies je zones in de configurator, zie direct je opbouw en plan een
              intake wanneer het plan klopt. Geen gokwerk, wel duidelijkheid.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/laserontharing/configurator"
                className="rounded-full bg-[#286943] px-6 py-4 text-[11px] font-medium uppercase tracking-[.13em] text-white transition hover:-translate-y-0.5 hover:bg-[#174e31]"
              >
                Bereken je laserprijs ↗
              </Link>
              <SalonizedScorePanel variant="compact" />
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-[#70a96d] lg:rounded-[2.5rem]">
            <Image
              src={FIGMA_INTENT_LASER.src}
              alt={FIGMA_INTENT_LASER.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-center mix-blend-multiply opacity-80"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(145deg,rgba(216,239,200,.75),rgba(30,85,54,.55))]"
              aria-hidden="true"
            />
            <p className="absolute left-7 top-7 rounded-full bg-white/90 px-4 py-2 text-[10px] uppercase tracking-[.12em] text-[#397249]">
              Hillegersberg · Rotterdam
            </p>
            <p className="absolute bottom-7 left-7 max-w-xs text-2xl tracking-[-.05em] text-white drop-shadow-[0_2px_12px_rgba(15,45,28,.35)]">
              Rustig in de stoel.
              <br />
              Scherp in de instelling.
            </p>
          </div>
        </div>
      </section>

      {/* USP strip */}
      <section className="border-y border-[#dce8d9] bg-white px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="mx-auto grid max-w-[1800px] divide-y divide-[#dce8d9] md:grid-cols-3 md:divide-x md:divide-y-0">
          {LASER_USP_ROWS.map(({ title, body }) => (
            <div key={title} className="py-8 md:px-6 md:first:pl-0">
              <h2 className="text-lg tracking-[-.04em] text-[#286943]">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#5f7765]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Zone map */}
      <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <p className="text-[10px] font-medium uppercase tracking-[.15em] text-[#5d9564]">
            Configurator
          </p>
          <h2 className="mt-4 max-w-2xl text-4xl tracking-[-.06em] sm:text-5xl">
            Waar wil je ontharen?
          </h2>
          <div className="mt-14">
            <LaserPulseMap />
          </div>
        </div>
      </section>

      {/* Huidtype */}
      <section className="bg-[#f2f7ef] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <p className="text-[10px] font-medium uppercase tracking-[.15em] text-[#5d9564]">
            Huidtype
          </p>
          <h2 className="mt-4 max-w-xl text-4xl tracking-[-.06em] sm:text-5xl">
            Fitzpatrick I tot VI.
          </h2>
          <div className="mt-12 rounded-[2rem] border border-[#dce8d9] bg-white p-7 sm:p-10">
            <LaserHuidtypeRing />
          </div>
        </div>
      </section>

      {/* Sessie boog */}
      <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto max-w-[1800px] lg:max-w-4xl">
          <LaserSessieBoog />
        </div>
      </section>

      {/* Reviews */}
      {LASER_REVIEWS.length > 0 ? (
        <section className="bg-white px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
          <div className="mx-auto max-w-[1800px]">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[.15em] text-[#5d9564]">
                  Reviews
                </p>
                <h2 className="mt-4 text-4xl tracking-[-.06em] sm:text-5xl">
                  Over laser bij Diba.
                </h2>
              </div>
              <Link
                href="/reviews"
                className="text-[11px] font-medium uppercase tracking-[.13em] text-[#286943] underline underline-offset-4"
              >
                Alle reviews ↗
              </Link>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {LASER_REVIEWS.map((r) => (
                <ReviewCard
                  key={r.id}
                  quote={r.quote}
                  name={r.name}
                  treatment={r.treatment}
                  stars={r.stars}
                  relativeDate={r.relativeDate}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      <section className="px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28">
        <div className="mx-auto max-w-[1800px] lg:grid lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[.15em] text-[#5d9564]">
              Goed om te weten
            </p>
            <h2 className="mt-4 text-4xl tracking-[-.06em] sm:text-5xl">
              Eerst even dit.
            </h2>
          </div>
          <div className="mt-10 border-t border-[#dce8d9] lg:mt-0">
            {LASER_LANDING_FAQ.map((item) => (
              <details
                key={item.id}
                className="group border-b border-[#dce8d9] py-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl tracking-[-.035em]">
                  <span>{item.question}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#edf6e8] text-[#367544] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-xl pt-4 text-[15px] leading-7 text-[#617968]">
                  {publicCopy(item.answer)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-5 mb-5 overflow-hidden rounded-[2.5rem] bg-[#286943] px-7 py-14 text-white sm:mx-9 sm:px-12 lg:mx-[7.5vw] lg:px-16 lg:py-20">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-10">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[.16em] text-[#bfe7ac]">
              Volgende stap
            </p>
            <h2 className="mt-5 max-w-xl text-4xl leading-[.95] tracking-[-.06em] sm:text-5xl">
              Configurator openen,
              <br />
              daarna intake plannen.
            </h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/laserontharing/configurator"
              className="rounded-full bg-[#d8f0c8] px-6 py-4 text-[11px] font-medium uppercase tracking-[.13em] text-[#174e31] transition hover:bg-white"
            >
              Naar configurator ↗
            </Link>
            <a
              href={DIBA_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/40 px-6 py-4 text-center text-[11px] font-medium uppercase tracking-[.13em] text-white transition hover:bg-white/10"
            >
              Vraag via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
