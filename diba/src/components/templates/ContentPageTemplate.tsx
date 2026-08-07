import Link from "next/link";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs } from "@/components/figma/FigmaTemplateUi";
import { publicCopy } from "@/lib/copy-flags";
import { figmaBtnMint, figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaCardSoft,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
  figmaSectionTight,
} from "@/lib/figma-inner-layout";
import { SchemaMarkup, breadcrumbSchema } from "@/lib/schema";

export type ContentSection = {
  kop?: string;
  alineas: string[];
};

export type ContentPageTemplateProps = {
  h1: string;
  intro?: string;
  secties: ContentSection[];
  siteUrl: string;
  breadcrumbLabel: string;
  breadcrumbPath: string;
  whatsappHref?: string;
  primaireCta?: { label: string; href: string };
};

export default function ContentPageTemplate({
  h1,
  intro,
  secties,
  siteUrl,
  breadcrumbLabel,
  breadcrumbPath,
  whatsappHref,
  primaireCta,
}: ContentPageTemplateProps) {
  const pageTitle = publicCopy(h1.replace(/\*/g, ""));

  return (
    <main className="pb-20">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: siteUrl },
          { name: breadcrumbLabel, url: `${siteUrl}${breadcrumbPath}` },
        ])}
      />

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[{ label: "Home", href: "/" }, { label: pageTitle }]}
        />
        <p className={figmaLabel}>{breadcrumbLabel}</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text={h1}
          className="mt-4 max-w-4xl"
        />
        {intro ? (
          <p className={`mt-7 max-w-2xl ${figmaBody}`}>{publicCopy(intro)}</p>
        ) : null}
        {primaireCta ? (
          <div className="mt-9">
            <Link href={primaireCta.href} className={figmaBtnPrimary}>
              {publicCopy(primaireCta.label)} ↗
            </Link>
          </div>
        ) : null}
      </section>

      <section className={`${figmaInnerContainer} ${figmaSectionTight}`}>
        <div className="flex flex-col gap-6">
          {secties.map((sectie, index) => (
            <article
              key={sectie.kop ?? index}
              className={`${figmaCardSoft} p-7 sm:p-9 ${index % 2 === 1 ? "lg:ml-auto lg:max-w-[92%]" : "lg:max-w-[92%]"}`}
              data-reveal
            >
              {sectie.kop ? (
                <FigmaHeading
                  as="h2"
                  size="card"
                  text={sectie.kop}
                  className="max-w-2xl"
                />
              ) : null}
              <div
                className={`flex flex-col gap-4 ${sectie.kop ? "mt-5" : ""}`}
              >
                {sectie.alineas.map((alinea) => (
                  <p key={alinea} className={figmaBody}>
                    {publicCopy(alinea)}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {whatsappHref ? (
        <section className="px-5 pb-24 sm:px-9 lg:px-[7.5vw]" data-reveal>
          <div
            className={`mx-auto max-w-[1800px] ${figmaCardSoft} flex flex-col items-center gap-4 px-7 py-12 text-center sm:px-10`}
          >
            <p className="max-w-md text-[15px] leading-7 text-[#5f7765]">
              Twijfel je nog? Stel je vraag via WhatsApp. Je krijgt antwoord van
              een mens.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={figmaBtnMint}
            >
              Vraag stellen ↗
            </a>
          </div>
        </section>
      ) : null}
    </main>
  );
}
