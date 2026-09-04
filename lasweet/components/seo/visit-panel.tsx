import Link from "next/link";
import { MapPinIcon, ClockIcon, InstagramLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

interface VisitPanelProps {
  eyebrow?: string;
  title: string;
  body: string;
  crossLink: { href: string; label: string };
}

export function VisitPanel({
  eyebrow = "Kom langs",
  title,
  body,
  crossLink,
}: VisitPanelProps) {
  return (
    <section className="stripe-bg py-16 lg:py-24">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-stretch gap-8 px-5 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <Reveal className="h-full">
          <div className="flex h-full flex-col justify-between rounded-[2rem] border border-ink/10 bg-cream/90 p-7 md:p-10">
            <div>
              <span className="inline-block rounded-full border border-ink/10 bg-parchment px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                {eyebrow}
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-4xl">
                {title}
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-soft">
                {body}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/bestellen"
                className="inline-flex rounded-full bg-matcha px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-matcha-deep active:scale-[0.98]"
              >
                Bestel via DM
              </Link>
              <Link
                href={crossLink.href}
                className="inline-flex rounded-full border border-ink/20 px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-matcha hover:text-matcha-deep active:scale-[0.98]"
              >
                {crossLink.label}
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="h-full">
          <div className="flex h-full flex-col gap-4">
            <a
              href={SITE.mapsSearch}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-1 items-start gap-4 rounded-[1.75rem] border border-ink/10 bg-cream p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-beige-mist text-beige-deep">
                <MapPinIcon size={20} weight="fill" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                  Adres
                </p>
                <p className="mt-1 font-display text-xl font-bold text-ink">
                  {SITE.streetAddress}
                </p>
                <p className="text-ink-soft">
                  {SITE.postalCode} {SITE.addressLocality}
                </p>
                <p className="mt-2 text-sm font-semibold text-beige-deep transition-transform duration-300 group-hover:translate-x-1">
                  Open in Maps →
                </p>
              </div>
            </a>

            <div className="flex flex-1 items-start gap-4 rounded-[1.75rem] border border-ink/10 bg-cream p-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-beige-mist text-beige-deep">
                <ClockIcon size={20} weight="fill" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                  Walk-in
                </p>
                <p className="mt-1 font-display text-xl font-bold text-ink">
                  Zaterdag {SITE.walkInOpens}-{SITE.walkInCloses}
                </p>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {SITE.walkInNote}
                </p>
              </div>
            </div>

            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-1 items-start gap-4 rounded-[1.75rem] bg-matcha-deep p-6 text-cream transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cream/15">
                <InstagramLogoIcon size={20} weight="fill" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cream/70">
                  Bestellen
                </p>
                <p className="mt-1 font-display text-xl font-bold">
                  {SITE.handle}
                </p>
                <p className="text-sm text-cream/75">
                  DM je smaken, haal af in Enschede.
                </p>
              </div>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
