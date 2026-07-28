import Link from "next/link";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs, FigmaCrossIcon } from "@/components/figma/FigmaTemplateUi";
import { WEIGER_CATEGORIEEN } from "@/data/weigeren";
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

export type DitBehandelenTemplateProps = {
  siteUrl: string;
  whatsappHref: string;
};

export default function DitBehandelenTemplate({
  siteUrl,
  whatsappHref,
}: DitBehandelenTemplateProps) {
  return (
    <main className="pb-20">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: siteUrl },
          {
            name: "Dit behandelen wij niet",
            url: `${siteUrl}/dit-behandelen-wij-niet`,
          },
        ])}
      />

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Dit behandelen wij niet" },
          ]}
        />
        <p className={figmaLabel}>Grenzen</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text="Dit behandelen wij *niet*"
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-7 max-w-2xl ${figmaBody}`}>
          Wat wij niet kunnen staat hier ook. Soms is het antwoord nee, en dat zeggen we vooraf.
        </p>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSectionTight} pb-24`}>
        <div className="flex flex-col gap-6">
          {WEIGER_CATEGORIEEN.map((cat) => (
            <article key={cat.id} className={`${figmaCardSoft} p-7 sm:p-10`} data-reveal>
              <FigmaHeading as="h2" size="card" text={cat.kop} />
              <p className={`mt-4 max-w-2xl ${figmaBody}`}>{publicCopy(cat.intro)}</p>
              <ul className="mt-6 flex flex-col gap-3">
                {cat.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-7 text-[#17372a]">
                    <FigmaCrossIcon />
                    {publicCopy(item)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f2f7ef]" data-reveal>
        <div className={`${figmaInnerContainer} ${figmaSection} text-center`}>
          <FigmaHeading as="h2" size="section" text="Twijfelt u of het *past*?" className="mx-auto" />
          <p className={`mx-auto mt-5 max-w-xl ${figmaBody}`}>
            Start met Behandeling Nul. Gratis, 4 minuten, eerlijk antwoord.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link href="/intake" className={figmaBtnPrimary}>
              Start uw intake (4 min) ↗
            </Link>
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={figmaBtnMint}
            >
              Stel uw vraag via WhatsApp ↗
            </Link>
            <Link
              href="/ons-verbond"
              className="text-[14px] font-medium text-[#286943] underline-offset-4 hover:underline"
            >
              Lees het Diba verbond →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
