import Link from "next/link";
import FigmaFaqList from "@/components/figma/FigmaFaqList";
import FigmaHeading from "@/components/figma/FigmaHeading";
import FigmaPillarHeroMedia from "@/components/figma/FigmaPillarHeroMedia";
import { FigmaBreadcrumbs, FigmaWelNietGrid } from "@/components/figma/FigmaTemplateUi";
import type { FaqItem } from "@/components/ui/FaqAccordion";
import PriceTable, { type PriceRow } from "@/components/ui/PriceTable";
import StickyActionBar from "@/components/ui/StickyActionBar";
import { publicCopy } from "@/lib/copy-flags";
import { figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaCardRadius,
  figmaCardWhite,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
  figmaSectionTight,
} from "@/lib/figma-inner-layout";
import { SchemaMarkup, behandelingSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";

export type BehandelContent = {
  slug: string;
  titel: string;
  intro: string;
  beeld: { src: string; alt: string };
  werking: { kop: string; alineas: string[] };
  welNiet: { wel: string[]; niet: string[] };
  prijzen: {
    caption: string;
    rows: PriceRow[];
  };
  gerelateerdeProblemen: { label: string; href: string }[];
  faq: FaqItem[];
};

export type BehandelTemplateProps = {
  content: BehandelContent;
  whatsappHref: string;
  siteUrl: string;
};

export default function BehandelTemplate({
  content,
  whatsappHref,
  siteUrl,
}: BehandelTemplateProps) {
  const c = content;
  const pageUrl = `${siteUrl}/behandelingen/${c.slug}`;
  const pageTitle = publicCopy(c.titel.replace(/\*/g, ""));

  return (
    <main className="pb-24 md:pb-0">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: siteUrl },
          { name: "Behandelingen", url: `${siteUrl}/behandelingen` },
          { name: pageTitle, url: pageUrl },
        ])}
      />
      <SchemaMarkup
        data={behandelingSchema({
          name: pageTitle,
          description: publicCopy(c.intro),
          url: pageUrl,
          siteUrl,
        })}
      />
      {c.faq.length > 0 ? <SchemaMarkup data={faqSchema(c.faq)} /> : null}

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Behandelingen", href: "/behandelingen" },
            { label: pageTitle },
          ]}
        />

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div>
            <p className={figmaLabel}>Behandeling</p>
            <FigmaHeading as="h1" size="hero" text={c.titel} className="mt-4" />
            <p className={`mt-7 max-w-lg ${figmaBody}`}>{publicCopy(c.intro)}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/intake" className={figmaBtnPrimary}>
                Start uw intake (4 min) ↗
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium uppercase tracking-[.13em] text-[#286943] underline underline-offset-4"
              >
                Vraag stellen ↗
              </a>
            </div>
          </div>
          <FigmaPillarHeroMedia src={c.beeld.src} alt={c.beeld.alt} badge="Behandeling" />
        </div>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div>
            <p className={figmaLabel}>Hoe het werkt</p>
            <FigmaHeading as="h2" size="section" text={c.werking.kop} className="mt-4 max-w-md" />
          </div>
          <div className="flex flex-col gap-4">
            {c.werking.alineas.map((alinea) => (
              <p key={alinea} className={figmaBody}>
                {publicCopy(alinea)}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f2f7ef] px-5 py-20 sm:px-9 lg:px-[7.5vw] lg:py-28" data-reveal>
        <div className="mx-auto max-w-[1800px]">
          <p className={figmaLabel}>Eerlijk advies</p>
          <FigmaHeading
            as="h2"
            size="section"
            text="Voor wie dit *werkt*. En voor wie niet"
            className="mt-4 max-w-2xl"
          />
          <div className="mt-12">
            <FigmaWelNietGrid
              wel={c.welNiet.wel.map(publicCopy)}
              niet={c.welNiet.niet.map(publicCopy)}
              welLabel="Geschikt"
              nietLabel="Niet geschikt"
            />
          </div>
        </div>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <p className={figmaLabel}>Prijzen</p>
        <FigmaHeading as="h2" size="section" text="Prijzen, *openbaar*" className="mt-4" />
        <div
          className={`mt-10 max-w-4xl overflow-x-auto ${figmaCardWhite} p-6 sm:p-8 [&_caption]:mb-6 [&_caption]:text-xl [&_caption]:font-medium [&_caption]:tracking-[-.04em] [&_caption]:text-[#17372a] [&_td]:text-[#17372a] [&_th]:text-[#5f7765] [&_thead]:border-[#dce8d9] [&_tr]:border-[#dce8d9]`}
        >
          <PriceTable caption={publicCopy(c.prijzen.caption)} rows={c.prijzen.rows} />
        </div>
      </section>

      {c.gerelateerdeProblemen.length > 0 ? (
        <section className={`${figmaInnerContainer} ${figmaSectionTight}`} data-reveal>
          <p className={figmaLabel}>Huidproblemen</p>
          <FigmaHeading
            as="h2"
            size="section"
            text="Welk huidprobleem past *hierbij*?"
            className="mt-4"
          />
          <ul className="mt-8 flex flex-wrap gap-3">
            {c.gerelateerdeProblemen.map((probleem) => (
              <li key={probleem.href}>
                <Link
                  href={probleem.href}
                  className="inline-flex min-h-11 items-center rounded-full border border-[#dce8d9] bg-[#f2f7ef] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[.1em] text-[#286943] transition hover:border-[#95c592] hover:bg-[#e9f5e4]"
                >
                  {probleem.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {c.faq.length > 0 ? (
        <section className={`${figmaInnerContainer} pb-28 pt-16 lg:pb-36`} data-reveal>
          <p className={figmaLabel}>Vragen</p>
          <FigmaHeading as="h2" size="section" text="Veelgestelde *vragen*" className="mt-4" />
          <div className="mt-10 max-w-3xl">
            <FigmaFaqList items={c.faq} />
          </div>
        </section>
      ) : null}

      <StickyActionBar whatsappHref={whatsappHref} intakeHref="/intake" />
    </main>
  );
}
