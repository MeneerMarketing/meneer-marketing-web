import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import type { PillarInternalLinks } from "@/lib/seo/internal-links";

interface PillarInternalLinksSectionProps {
  links: PillarInternalLinks;
}

function LinkGroup({
  title,
  items,
  accentClass,
}: {
  title: string;
  items: { href: string; label: string; hint?: string }[];
  accentClass: string;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`group flex items-start justify-between gap-3 rounded-xl border border-slate-200/90 bg-white px-4 py-3 transition hover:border-slate-300 hover:shadow-sm ${accentClass}`}
            >
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-snug text-slate-900 group-hover:text-[#FF5722]">
                  {item.label}
                </span>
                {item.hint ? (
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500 line-clamp-2">
                    {item.hint}
                  </span>
                ) : null}
              </span>
              <ArrowUpRight
                className="mt-0.5 size-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FF5722]"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Interne links hub: diensten, kennisbank en zoek-landings per pillar. */
export function PillarInternalLinksSection({ links }: PillarInternalLinksSectionProps) {
  const hasLinks =
    links.diensten.length > 0 ||
    links.kennisbank.length > 0 ||
    links.zoeken.length > 0;

  if (!hasLinks) return null;

  return (
    <section
      className="border-t border-slate-200 bg-slate-50/80"
      aria-labelledby="pillar-internal-links-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Verder lezen
          </p>
          <h2
            id="pillar-internal-links-heading"
            className="mt-3 max-w-xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            Gerelateerde diensten, artikelen en zoekpagina&apos;s
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            Doorlinken is geen trucje. Zo zie je wat bij dit blok hoort en waar je
            dieper kunt duiken.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <Reveal delay={0.04}>
            <LinkGroup title="Top diensten" items={links.diensten} accentClass="" />
          </Reveal>
          <Reveal delay={0.08}>
            <LinkGroup title="Kennisbank" items={links.kennisbank} accentClass="" />
          </Reveal>
          <Reveal delay={0.12}>
            <LinkGroup title="Zoeken per dienst" items={links.zoeken} accentClass="" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
