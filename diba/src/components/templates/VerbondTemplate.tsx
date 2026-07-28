import Link from "next/link";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs } from "@/components/figma/FigmaTemplateUi";
import DeLijn from "@/components/ui/DeLijn";
import { publicCopy } from "@/lib/copy-flags";
import { figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaCardWhite,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
  figmaSectionTight,
} from "@/lib/figma-inner-layout";
import { SchemaMarkup, breadcrumbSchema } from "@/lib/schema";

export type VerbondWeigering = {
  titel: string;
  tekst: string;
};

export type VerbondTemplateProps = {
  weigeringen: VerbondWeigering[];
  siteUrl: string;
};

export default function VerbondTemplate({ weigeringen, siteUrl }: VerbondTemplateProps) {
  return (
    <main className="pb-20">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: siteUrl },
          { name: "Ons verbond", url: `${siteUrl}/ons-verbond` },
        ])}
      />

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Ons verbond" },
          ]}
        />
        <p className={figmaLabel}>Ons verbond</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text="Het Diba *verbond*"
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-7 max-w-2xl ${figmaBody}`}>
          {publicCopy(
            "Tien keuzes die we bewust maken. Geen marketingtruc, geen uitzondering als het druk wordt.",
          )}
        </p>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSectionTight} pb-24`}>
        <div className={`${figmaCardWhite} mx-auto max-w-3xl p-7 sm:p-10`} data-reveal>
          <DeLijn length="full" dot={8} className="mb-8" />
          <ol className="flex flex-col gap-8">
            {weigeringen.map((w) => (
              <li
                key={w.titel}
                className="border-b border-[#e8f0e4] pb-8 last:border-b-0 last:pb-0"
              >
                <h2 className="text-xl font-medium tracking-[-.03em] text-[#17372a]">
                  {w.titel}
                </h2>
                <p className={`mt-3 ${figmaBody}`}>{publicCopy(w.tekst)}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 border-t border-[#e8f0e4] pt-8">
            <p className="text-[15px] italic leading-relaxed text-[#5f7765] [font-family:var(--font-accent)]">
              Eerlijk. Deskundig. Menselijk.
            </p>
            <p className={`mt-2 ${figmaBody}`}>
              Diba Clinics · Rotterdam · {publicCopy("[COPY-NODIG: ondertekening]")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f2f7ef]" data-reveal>
        <div className={`${figmaInnerContainer} ${figmaSection} text-center`}>
          <FigmaHeading as="h2" size="section" text="Past dit bij *u*?" className="mx-auto" />
          <p className={`mx-auto mt-5 max-w-xl ${figmaBody}`}>
            Als dit voelt als de kliniek waar u naartoe wilt: start met De Nulmeting. Zo niet: dat mag
            ook.
          </p>
          <div className="mt-8">
            <Link href="/intake" className={figmaBtnPrimary}>
              Start uw intake (4 min) ↗
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
