import Link from "next/link";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs } from "@/components/figma/FigmaTemplateUi";
import { DOELGROEPEN } from "@/data/doelgroep";
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

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11M9.5 4l4 4-4 4" />
    </svg>
  );
}

export type DoelgroepHubTemplateProps = {
  siteUrl: string;
};

export default function DoelgroepHubTemplate({ siteUrl }: DoelgroepHubTemplateProps) {
  return (
    <main className="pb-20">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: siteUrl },
          { name: "Doelgroepen", url: `${siteUrl}/doelgroep` },
        ])}
      />

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Doelgroepen" },
          ]}
        />
        <p className={figmaLabel}>Doelgroepen</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text="Huidzorg voor *jouw* situatie"
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-7 max-w-2xl ${figmaBody}`}>
          {publicCopy(
            "Verschillende huiden, verschillende vragen. Kies wat op u lijkt.",
          )}
        </p>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSectionTight}`}>
        <ul className="grid gap-4 md:grid-cols-2" data-reveal>
          {DOELGROEPEN.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/doelgroep/${d.slug}`}
                className={`${figmaCardWhite} group flex min-h-[160px] flex-col justify-between p-7 transition
                            hover:-translate-y-1 hover:border-[#95c592] hover:shadow-[0_14px_35px_rgba(35,100,62,.12)]
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                            focus-visible:outline-[#286943] motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
              >
                <span className="text-xl font-medium tracking-[-.03em] text-[#17372a]">{d.meta}</span>
                <span className={`mt-4 ${figmaBody}`}>{publicCopy(d.korteOmschrijving)}</span>
                <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.1em] text-[#286943]">
                  Lees meer <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-[#f2f7ef]" data-reveal>
        <div className={`${figmaInnerContainer} ${figmaSection} text-center`}>
          <Link href="/intake" className={figmaBtnPrimary}>
            Start je intake (4 min) ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
