import Link from "next/link";
import { notFound } from "next/navigation";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs } from "@/components/figma/FigmaTemplateUi";
import { INSURERS, insurerBySlug } from "@/data/insurers";
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
import { PAGE_DEFAULTS } from "@/lib/page-defaults";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";
import { SchemaMarkup, breadcrumbSchema } from "@/lib/schema";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return INSURERS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const insurer = insurerBySlug(slug);
  if (!insurer) return { title: "Vergoedingen" };
  return {
    title: `Vergoeding ${insurer.name}`,
    description: `Wat ${insurer.name} vergoedt bij Diba Clinics.`,
    // De pagina bestaat wel maar telt nog geen 40 woorden, met lege kopjes.
    // Uit de index tot insurers.ts echte tekst per verzekeraar bevat.
    ...NOG_IN_AANBOUW,
  };
}

export default async function InsurerPage({ params }: PageProps) {
  const { slug } = await params;
  const insurer = insurerBySlug(slug);
  if (!insurer) notFound();

  return (
    <main className="pb-20">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: PAGE_DEFAULTS.siteUrl },
          { name: "Vergoedingen", url: `${PAGE_DEFAULTS.siteUrl}/vergoedingen` },
          {
            name: insurer.name,
            url: `${PAGE_DEFAULTS.siteUrl}/vergoedingen/${insurer.slug}`,
          },
        ])}
      />

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Vergoedingen", href: "/vergoedingen" },
            { label: insurer.name },
          ]}
        />
        <p className={figmaLabel}>Vergoedingen</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text={`Vergoeding bij *${insurer.name}*`}
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-7 max-w-2xl ${figmaBody}`}>
          {publicCopy(`[COPY-NODIG: vergoeding-intro ${insurer.name}]`)}
        </p>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSectionTight}`} data-reveal>
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <article className={`${figmaCardSoft} p-7 sm:p-9`}>
            <FigmaHeading as="h2" size="card" text="Wat *vergoed* wordt" />
            <p className={`mt-4 ${figmaBody}`}>
              {publicCopy(`[COPY-NODIG: vergoeding-details ${insurer.name}]`)}
            </p>
          </article>
          <article className={`${figmaCardSoft} p-7 sm:p-9`}>
            <FigmaHeading as="h2" size="card" text="Wat *niet* vergoed wordt" />
            <p className={`mt-4 ${figmaBody}`}>
              {publicCopy(
                `[COPY-NODIG: uitzonderingen ${insurer.name}] Eerlijkheid vooraf, zonder verrassingen achteraf.`,
              )}
            </p>
          </article>
          <p className={figmaBody}>
            {publicCopy("[COPY-NODIG: vergoedingen-disclaimer] Controleer altijd je eigen polis.")}
          </p>
        </div>
      </section>

      <section className="bg-[#f2f7ef]" data-reveal>
        <div className={`${figmaInnerContainer} ${figmaSection} text-center`}>
          <div className="flex flex-col items-center gap-3">
            <Link href="/intake" className={figmaBtnPrimary}>
              Check je vergoeding via intake ↗
            </Link>
            <Link
              href={PAGE_DEFAULTS.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={figmaBtnMint}
            >
              Vraag stellen via WhatsApp ↗
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
