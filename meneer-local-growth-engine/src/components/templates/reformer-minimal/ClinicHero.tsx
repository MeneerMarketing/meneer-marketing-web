import Image from "next/image";
import { KenBurnsImage } from "@/components/motion/KenBurnsImage";
import {
  ClinicNav,
  type MegaMenu,
} from "@/components/templates/reformer-minimal/ClinicChrome";
import type { ClinicModel } from "@/components/templates/reformer-minimal/clinicModel";

interface Props {
  model: ClinicModel;
  menus: MegaMenu[];
}

/**
 * Hero met nav op beeld.
 * Eén volle overlay over de hele foto (of niets). Geen half vlak.
 */
export function ClinicHero({ model, menus }: Props) {
  const { heroImage, headline, lead, booking, city, studioName, logoUrl, logoLight, logoOnLightBackground, navLinks } = model;

  return (
    <section id="top" className="fc-plane-010 px-3 pb-3 pt-1 sm:px-4 sm:pb-4">
      <div className="relative h-[calc(100svh-5.5rem)] min-h-[560px] w-full">
        <div className="absolute inset-0 overflow-hidden rounded-[var(--fc-radius-lg)] sm:rounded-[var(--fc-radius-xl)]">
          {heroImage ? (
            <KenBurnsImage src={heroImage.url} alt={heroImage.alt} priority />
          ) : (
            <div className="absolute inset-0 bg-[var(--fc-dark)]" />
          )}

          {/* Neutraal scrim: geen merk-tint over lifestyle-foto's */}
          <div
            aria-hidden
            className="absolute inset-0 bg-black/45"
          />
        </div>

        <ClinicNav
          studioName={studioName}
          logoUrl={logoUrl}
          logoLight={logoLight}
          logoOnLightBackground={logoOnLightBackground}
          links={navLinks}
          booking={booking}
          menus={menus}
          onMedia
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-8 sm:px-8 sm:pb-10 lg:px-10 lg:pb-14">
          <div className="pointer-events-auto max-w-[34rem] sm:max-w-[42rem] lg:max-w-[52rem]">
            <p className="figma-label text-white/70">{city}</p>
            <h1 className="figma-hero-title mt-3 text-white">
              {headline.accent ? (
                <>
                  <span className="figma-hero-title-strong">
                    {headline.primary}
                  </span>{" "}
                  <span className="font-light">{headline.accent}</span>
                </>
              ) : (
                <span className="figma-hero-title-strong">
                  {headline.primary}
                </span>
              )}
            </h1>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-7 text-white/88 sm:text-[16px] sm:leading-8 lg:max-w-[54ch]">
              {lead}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={booking.href}
                {...(booking.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex h-11 items-center gap-1.5 rounded-full bg-[var(--fc-on-dark-btn)] px-5 text-[12px] font-medium text-[var(--fc-on-dark-btn-text)] transition-transform hover:-translate-y-0.5"
              >
                Afspraak maken
                <span aria-hidden>›</span>
              </a>
              <a
                href="#lessen"
                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/55 px-5 text-[12px] font-medium text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Onze lessen
                <span aria-hidden>›</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ClinicPortrait({
  image,
  className = "",
}: {
  image: ClinicModel["studioImage"];
  className?: string;
}) {
  if (!image) return null;
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-3 -z-10 rounded-[var(--fc-radius-lg)] bg-[var(--fc-wash)] sm:inset-4" />
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--fc-radius-lg)]">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
      </div>
    </div>
  );
}
