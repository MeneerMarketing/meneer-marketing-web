import Link from "next/link";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs } from "@/components/figma/FigmaTemplateUi";
import { publicCopy } from "@/lib/copy-flags";
import { figmaBtnMint, figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaCardWhite,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
  figmaSectionTight,
} from "@/lib/figma-inner-layout";
import { SchemaMarkup, breadcrumbSchema } from "@/lib/schema";

/** Canoniek openingscitaat Behandeling Nul (Addendum A9 / De Gracht §3) */
export const INTAKE_OPENING =
  "Is het nodig? Dat gaan we eerst uitzoeken. Soms is het antwoord nee, en dan hoor je dat ook.";

export type BeslisboomPad = {
  label: string;
  href: string;
  toelichting: string;
};

export type IsHetNodigTemplateProps = {
  siteUrl: string;
  whatsappHref: string;
  paden: BeslisboomPad[];
};

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

export default function IsHetNodigTemplate({
  siteUrl,
  whatsappHref,
  paden,
}: IsHetNodigTemplateProps) {
  return (
    <main className="pb-20">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: siteUrl },
          { name: "Is het nodig?", url: `${siteUrl}/is-het-nodig` },
        ])}
      />

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Is het nodig?" },
          ]}
        />
        <p className={figmaLabel}>Filosofie</p>
        <FigmaHeading as="h1" size="hero" text="Is het *nodig*?" className="mt-4 max-w-3xl" />
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[#17372a] [font-family:var(--font-accent)] italic font-light md:text-xl">
          {INTAKE_OPENING}
        </p>
        <p className={`mt-6 max-w-2xl ${figmaBody}`}>
          {publicCopy(
            "Bij Diba begint elke route met een eerlijke vraag. Alleen een antwoordpad dat klopt.",
          )}
        </p>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSectionTight}`} data-reveal>
        <FigmaHeading as="h2" size="section" text="Kies je *volgende* stap" />
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {paden.map((p) => {
            const external = p.href.startsWith("http");
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`${figmaCardWhite} group flex min-h-[120px] flex-col justify-between p-6 transition
                              hover:-translate-y-1 hover:border-[#95c592] hover:shadow-[0_14px_35px_rgba(35,100,62,.12)]
                              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                              focus-visible:outline-[#286943] motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
                >
                  <span className="text-[17px] font-medium text-[#17372a]">{p.label}</span>
                  <span className={`mt-3 ${figmaBody}`}>{publicCopy(p.toelichting)}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.1em] text-[#286943]">
                    Ga verder <Arrow />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="bg-[#f2f7ef]" data-reveal>
        <div className={`${figmaInnerContainer} ${figmaSection} text-center`}>
          <FigmaHeading as="h2" size="section" text="Behandeling *nul*" className="mx-auto" />
          <p className={`mx-auto mt-5 max-w-xl ${figmaBody}`}>
            Gratis, 4 minuten, online. U hoeft nog niets te boeken.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link href="/intake" className={figmaBtnPrimary}>
              Start je intake (4 min) ↗
            </Link>
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={figmaBtnMint}
            >
              Liever eerst een vraag stellen ↗
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
