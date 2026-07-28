import Image from "next/image";
import Link from "next/link";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs } from "@/components/figma/FigmaTemplateUi";
import { publicCopy } from "@/lib/copy-flags";
import { figmaBtnMint, figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
  figmaSectionTight,
} from "@/lib/figma-inner-layout";
import { SchemaMarkup, breadcrumbSchema, physicianSchema } from "@/lib/schema";

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: { src: string; alt: string };
};

export type TeamTemplateProps = {
  leden: TeamMember[];
  whatsappHref: string;
  siteUrl: string;
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

export default function TeamTemplate({ leden, whatsappHref, siteUrl }: TeamTemplateProps) {
  return (
    <main className="pb-20">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: siteUrl },
          { name: "Team", url: `${siteUrl}/team` },
        ])}
      />
      {leden.map((m) => (
        <SchemaMarkup
          key={m.slug}
          data={physicianSchema({
            name: m.name,
            jobTitle: m.role,
            url: `${siteUrl}/team#${m.slug}`,
            image: `${siteUrl}${m.image.src}`,
            siteUrl,
          })}
        />
      ))}

      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Team" },
          ]}
        />
        <p className={figmaLabel}>Team</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text="Mensen boeken *mensen*"
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-7 max-w-2xl ${figmaBody}`}>
          {publicCopy(
            "U kiest zelf bij wie u start. Iedereen meet eerst, praat eerlijk en zegt ook nee als dat beter is.",
          )}
        </p>
      </section>

      <section className={`${figmaInnerContainer} ${figmaSectionTight}`}>
        <ul className="grid gap-12 md:grid-cols-2 md:gap-16">
          {leden.map((m) => (
            <li key={m.slug} id={m.slug} data-reveal>
              <div className="grid gap-6 md:grid-cols-5 md:gap-8">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#cbe5bf] md:col-span-2">
                  <Image
                    src={m.image.src}
                    alt={m.image.alt}
                    fill
                    sizes="(min-width: 768px) 240px, 100vw"
                    className="object-cover mix-blend-multiply opacity-90"
                  />
                </div>
                <div className="md:col-span-3">
                  <h2 className="text-2xl font-medium tracking-[-.04em] text-[#17372a] md:text-3xl">
                    {m.name}
                  </h2>
                  <p className="mt-2 text-[13px] font-semibold uppercase tracking-[.1em] text-[#286943]">
                    {m.role}
                  </p>
                  <p className={`mt-4 ${figmaBody}`}>{publicCopy(m.bio)}</p>
                  <p className="mt-6">
                    <Link
                      href="/intake"
                      className="inline-flex items-center gap-2 text-[14px] font-medium text-[#286943] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#286943]"
                    >
                      Boek bij {m.name.split(" ")[0]} <Arrow />
                    </Link>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-[#f2f7ef]" data-reveal>
        <div className={`${figmaInnerContainer} ${figmaSection} text-center`}>
          <FigmaHeading as="h2" size="section" text="Nog niet zeker *wie*?" className="mx-auto" />
          <p className={`mx-auto mt-5 max-w-xl ${figmaBody}`}>
            Start met Behandeling Nul. Wij koppelen u aan de therapeut die bij uw huid en vraag past.
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
              Liever eerst een vraag stellen ↗
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
