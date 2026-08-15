import Link from "next/link";
import FigmaFaqList from "@/components/figma/FigmaFaqList";
import FigmaHeading from "@/components/figma/FigmaHeading";
import FigmaPillarHeroMedia from "@/components/figma/FigmaPillarHeroMedia";
import {
  FigmaBreadcrumbs,
  FigmaWelNietGrid,
} from "@/components/figma/FigmaTemplateUi";
import BeforeAfterSlider, {
  type BeforeAfterSliderProps,
} from "@/components/ui/BeforeAfterSlider";
import type { FaqItem } from "@/components/ui/FaqAccordion";
import ReviewCard, { type ReviewCardProps } from "@/components/ui/ReviewCard";
import StickyActionBar from "@/components/ui/StickyActionBar";
import { type ProofItem } from "@/components/ui/ProofStrip";
import { publicCopy } from "@/lib/copy-flags";
import { figmaBtnMint, figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaCardRadius,
  figmaCardSoft,
  figmaCardWhite,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
  figmaSectionTight,
} from "@/lib/figma-inner-layout";
import { SchemaMarkup, breadcrumbSchema, faqSchema } from "@/lib/schema";

export type PillarContent = {
  slug: string;
  titel: string;
  herkenning: string;
  beeld: { src: string; alt: string };
  uitleg: {
    kop: string;
    alineas: string[];
  };
  welNiet: {
    wel: string[];
    niet: string[];
  };
  pad: {
    naam: string;
    belofte: string;
    stappen: { titel: string; tekst: string }[];
    trajectPrijs?: number;
    perMonth?: number;
    losVanaf?: number;
  };
  resultaten: BeforeAfterSliderProps[];
  reviews: ReviewCardProps[];
  vergoeding: {
    tekst: string;
  };
  faq: FaqItem[];
  nazorgSlug?: string;
};

export type PillarTemplateProps = {
  content: PillarContent;
  proofItems: ProofItem[];
  whatsappHref: string;
  siteUrl: string;
};

const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const nf = new Intl.NumberFormat("nl-NL");

export default function PillarTemplate({
  content,
  proofItems,
  whatsappHref,
  siteUrl,
}: PillarTemplateProps) {
  const c = content;
  const pageUrl = `${siteUrl}/huidproblemen/${c.slug}`;
  /* Nazorg hoort bij wat er gedaan is en niet bij wat je hebt, dus staat het per
     behandeling op /nazorg en niet per huidprobleem hier. */
  const heeftNazorg = Boolean(c.nazorgSlug);
  const pageTitle = publicCopy(c.titel.replace(/\*/g, ""));

  return (
    <main className="pb-24 md:pb-0">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: siteUrl },
          { name: "Huidproblemen", url: `${siteUrl}/huidproblemen` },
          { name: pageTitle, url: pageUrl },
        ])}
      />
      {c.faq.length > 0 ? <SchemaMarkup data={faqSchema(c.faq)} /> : null}

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Huidproblemen", href: "/huidproblemen" },
            { label: pageTitle },
          ]}
        />

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div>
            <p className={figmaLabel}>Huidprobleem</p>
            <FigmaHeading as="h1" size="hero" text={c.titel} className="mt-4" />
            <p className={`mt-7 max-w-lg ${figmaBody}`}>
              {publicCopy(c.herkenning)}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/intake" className={figmaBtnPrimary}>
                Start je intake (4 min) ↗
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium uppercase tracking-[.13em] text-[var(--g-700)] underline underline-offset-4"
              >
                Vraag stellen ↗
              </a>
            </div>
          </div>
          <FigmaPillarHeroMedia src={c.beeld.src} alt={c.beeld.alt} />
        </div>
      </section>

      <section className="border-y border-[var(--g-100)] bg-white">
        <div
          className={`${figmaInnerContainer} grid divide-y divide-[var(--g-100)] md:grid-cols-4 md:divide-x md:divide-y-0`}
        >
          {proofItems.map((item) => (
            <div key={item.label} className="py-7 text-center">
              <strong className="block text-3xl tracking-[-.06em] text-[var(--g-700)]">
                {item.label === "Actief sinds"
                  ? item.value
                  : `${nf.format(item.value)}${item.suffix ?? ""}`}
              </strong>
              <span className="mt-2 block text-[10px] uppercase tracking-[.13em] text-[var(--diba-green-500)]">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div>
            <p className={figmaLabel}>Wat er speelt</p>
            <FigmaHeading
              as="h2"
              size="section"
              text={c.uitleg.kop}
              className="mt-4 max-w-md"
            />
          </div>
          <div className="flex flex-col gap-4">
            {c.uitleg.alineas.map((alinea) => (
              <p key={alinea} className={figmaBody}>
                {publicCopy(alinea)}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
        data-reveal
      >
        <div className="mx-auto">
          <p className={figmaLabel}>Eerlijk advies</p>
          <FigmaHeading
            as="h2"
            size="section"
            text="Wat wél werkt. En wat *eerlijk* gezegd niet"
            className="mt-4 max-w-2xl"
          />
          <div className="mt-12">
            <FigmaWelNietGrid
              wel={c.welNiet.wel.map((t) => publicCopy(t))}
              niet={c.welNiet.niet.map((t) => publicCopy(t))}
            />
          </div>
        </div>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <p className={figmaLabel}>Je traject</p>
        <FigmaHeading
          as="h2"
          size="section"
          text={`${c.pad.naam}: van meting naar *resultaat*`}
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-4 max-w-2xl ${figmaBody}`}>
          {publicCopy(c.pad.belofte)}
        </p>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {c.pad.stappen.map((stap) => (
            <article
              key={stap.titel}
              className={`${figmaCardSoft} flex h-full flex-col p-6 transition hover:bg-[var(--g-075)]`}
            >
              <h3 className="text-base font-medium tracking-[-.03em] text-[var(--g-900)]">
                {publicCopy(stap.titel)}
              </h3>
              <p className="mt-3 flex-1 text-[14px] leading-6 text-[var(--t-muted)]">
                {publicCopy(stap.tekst)}
              </p>
            </article>
          ))}
        </div>

        <div
          className={`mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3 ${figmaCardRadius} border border-[var(--g-100)] bg-[var(--g-050)] px-7 py-6 sm:px-8`}
        >
          {c.pad.trajectPrijs !== undefined ? (
            <p className="text-3xl font-medium tracking-[-.06em] text-[var(--g-900)]">
              {euro.format(c.pad.trajectPrijs)}
              {c.pad.perMonth !== undefined ? (
                <span className="ml-2 text-sm font-normal text-[var(--t-muted)]">
                  of {euro.format(c.pad.perMonth)}/mnd
                </span>
              ) : null}
            </p>
          ) : (
            <p className={`text-sm ${figmaBody}`}>
              Prijzen volgen na je intake
            </p>
          )}
          {c.pad.losVanaf !== undefined ? (
            <p className={`text-sm ${figmaBody}`}>
              Losse behandeling vanaf {euro.format(c.pad.losVanaf)}
            </p>
          ) : null}
          <Link href="/prijzen" className={`ml-auto ${figmaBtnMint}`}>
            Bekijk prijzen ↗
          </Link>
        </div>
      </section>

      {heeftNazorg ? (
        <section
          className="bg-[var(--g-025)] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28"
          data-reveal
        >
          <div className="mx-auto">
            <p className={figmaLabel}>Nazorg</p>
            <h2 className="mt-4 max-w-[20ch] text-3xl font-medium tracking-[-.06em] text-[var(--g-900)]">
              Wat mag wanneer weer
            </h2>
            <p className={`mt-6 max-w-2xl ${figmaBody}`}>
              Nazorg hangt af van de behandeling die je krijgt en niet van wat
              je hebt. Op de nazorgpagina staat per behandeling een rooster:
              vanaf wanneer je weer mag sporten, de zon in, make-up op, en
              waarom.
            </p>
            <Link
              href="/nazorg"
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--on-dark-btn)] px-6 text-[11px] font-semibold uppercase tracking-[.13em] text-[var(--on-dark-btn-text)] transition-colors hover:bg-[var(--g-200)]"
            >
              Naar de nazorg
            </Link>
          </div>
        </section>
      ) : null}

      {c.resultaten.length > 0 ? (
        <section
          className={`${figmaInnerContainer} ${figmaSectionTight}`}
          data-reveal
        >
          <p className={figmaLabel}>Resultaten</p>
          <FigmaHeading
            as="h2"
            size="section"
            text="Resultaten bij *echte* klanten"
            className="mt-4"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {c.resultaten.map((resultaat) => (
              <div
                key={resultaat.before.src}
                className={`overflow-hidden ${figmaCardRadius}`}
              >
                <BeforeAfterSlider {...resultaat} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {c.reviews.length > 0 ? (
        <section
          className={`${figmaInnerContainer} ${figmaSectionTight}`}
          data-reveal
        >
          <div className="grid gap-4 md:grid-cols-3">
            {c.reviews.map((review) => (
              <div
                key={review.name + review.treatment}
                className={`${figmaCardSoft} p-6 sm:p-7 [&_figure]:rounded-none [&_figure]:bg-transparent [&_figure]:p-0`}
              >
                <ReviewCard {...review} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section
        className={`${figmaInnerContainer} ${figmaSectionTight}`}
        data-reveal
      >
        <div
          className={`${figmaCardRadius} bg-[var(--g-700)] px-7 py-10 text-white sm:px-10 sm:py-12`}
        >
          <p className="text-[10px] font-medium uppercase tracking-[.16em] text-[var(--on-dark-label)]">
            Vergoeding
          </p>
          <FigmaHeading
            as="h2"
            size="card"
            text="Wat *jouw* verzekering vergoedt"
            className="mt-4 !text-white [&_span]:!text-[var(--on-dark-accent)]"
          />
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[var(--on-dark-body)]">
            {publicCopy(c.vergoeding.tekst)}
          </p>
          <Link
            href="/vergoedingen"
            className="mt-8 inline-block rounded-full border border-white/40 px-5 py-3 text-[11px] font-medium uppercase tracking-[.13em] text-white transition hover:bg-white/10"
          >
            Check je vergoeding ↗
          </Link>
        </div>
      </section>

      {c.faq.length > 0 ? (
        <section
          className={`${figmaInnerContainer} pb-28 pt-16 lg:pb-36`}
          data-reveal
        >
          <p className={figmaLabel}>Vragen</p>
          <FigmaHeading
            as="h2"
            size="section"
            text="Veelgestelde *vragen*"
            className="mt-4"
          />
          <div className="mt-10 max-w-3xl">
            <FigmaFaqList items={c.faq} />
          </div>
        </section>
      ) : null}

      <StickyActionBar whatsappHref={whatsappHref} intakeHref="/intake" />
    </main>
  );
}
