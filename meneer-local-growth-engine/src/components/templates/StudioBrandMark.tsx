"use client";

import Image from "next/image";
import { useState } from "react";

type BrandVariant = "editorial" | "clinic" | "cinematic";

interface Props {
  studioName: string;
  logoUrl: string | null;
  variant: BrandVariant;
  /** Hero-overlay: lichte tekst + subtiele schaduw op het logo. */
  onMedia?: boolean;
  className?: string;
  /** nav = header; footer = groter merkbeeld in de donkere footer. */
  size?: "nav" | "footer";
  /** Alleen cinematic: gesplitste wordmark als er geen logo is. */
  wordmark?: { head: string; tail: string };
  /** Licht merklogo op donkere hero — geen brightness/invert filter. */
  logoLight?: boolean;
  /** Witte JPG-achtergrond: multiply-blend i.p.v. invert (witte pixels verdwijnen). */
  logoOnLightBackground?: boolean;
}

/** Header-logo op lichte achtergrond. */
const logoClassNav =
  "h-11 w-auto max-w-[min(15rem,58vw)] object-contain object-left sm:h-12 sm:max-w-[17rem] md:h-[3.25rem] md:max-w-[19rem]";

/** Hero/nav op donker beeld: groter. */
const logoClassNavOnHero =
  "h-16 w-auto max-w-[min(8rem,32vw)] object-contain object-left sm:h-[4.5rem] sm:max-w-[9rem] md:h-24 md:max-w-[10.5rem] lg:h-[6.5rem] lg:max-w-[11.5rem]";

const logoClassFooter =
  "h-12 w-auto max-w-[min(16rem,58vw)] object-contain object-left md:h-14 md:max-w-[20rem] lg:h-16 lg:max-w-[22rem]";

export function StudioBrandMark({
  studioName,
  logoUrl,
  variant,
  onMedia = false,
  className = "",
  size = "nav",
  wordmark,
  logoLight = false,
  logoOnLightBackground = false,
}: Props) {
  const [logoFailed, setLogoFailed] = useState(false);
  const onHero = onMedia || variant === "cinematic";
  const logoClass =
    size === "footer"
      ? logoClassFooter
      : onHero
        ? logoClassNavOnHero
        : logoClassNav;

  if (logoUrl && !logoFailed) {
    const onDark = onMedia || variant === "cinematic";
    const shadow = onDark ? "drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)]" : "";
    const shouldInvert = onDark && !logoLight && !logoOnLightBackground;
    const shouldMultiply = onDark && logoOnLightBackground;
    const tone = shouldInvert
      ? "brightness-0 invert"
      : shouldMultiply
        ? "mix-blend-multiply"
        : "";

    return (
      <Image
        src={logoUrl}
        alt={studioName}
        width={400}
        height={400}
        unoptimized
        onError={() => setLogoFailed(true)}
        className={`${logoClass} block ${shadow} ${tone} ${className}`}
        priority
      />
    );
  }

  if (variant === "cinematic" && wordmark) {
    return (
      <span className={`cine-display cine-lower text-[1.85rem] text-[var(--cn-on-dark)] sm:text-[2.1rem] md:text-[2.35rem] ${className}`}>
        {wordmark.head}
        {wordmark.tail ? (
          <>
            {" "}
            <span className="cine-italic">{wordmark.tail}</span>
          </>
        ) : null}
        <span className="text-[var(--cn-on-dark-soft)]">.</span>
      </span>
    );
  }

  if (variant === "editorial") {
    const textSize =
      size === "footer"
        ? "text-[1.65rem] md:text-[2rem]"
        : onHero
          ? "text-[1.5rem] sm:text-[1.75rem] md:text-[2rem]"
          : "text-[1.4rem] md:text-[1.65rem]";
    return (
      <span
        className={`ed-serif relative z-10 block min-w-0 max-w-full truncate tracking-tight transition-colors duration-500 ${textSize} ${
          onMedia ? "text-white" : "text-[var(--ed-fg)]"
        } ${className}`}
      >
        {studioName}
      </span>
    );
  }

  return (
    <span
      className={`relative z-10 shrink-0 text-[1.05rem] font-medium tracking-tight lowercase ${
        onMedia ? "text-white" : "text-[var(--fc-ink)]"
      } ${className}`}
    >
      {studioName}
    </span>
  );
}
