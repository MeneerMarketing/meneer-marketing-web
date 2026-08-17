import Image from "next/image";

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
}

/** Header-logo: bewust groter zodat merknamen in previews leesbaar blijven. */
const logoClassNav =
  "h-11 w-auto max-w-[min(15rem,58vw)] object-contain object-left sm:h-12 sm:max-w-[17rem] md:h-[3.25rem] md:max-w-[19rem]";

const logoClassNavOnHero =
  "h-12 w-auto max-w-[min(16rem,62vw)] object-contain object-left sm:h-14 sm:max-w-[19rem] md:h-16 md:max-w-[21rem]";

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
}: Props) {
  const onHero = onMedia || variant === "cinematic";
  const logoClass =
    size === "footer"
      ? logoClassFooter
      : onHero
        ? logoClassNavOnHero
        : logoClassNav;
  if (logoUrl) {
    const onDark = onMedia || variant === "cinematic";
    const shadow = onDark ? "drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]" : "";
    const tone = onDark ? "brightness-0 invert" : "";
    const isSvg = /\.svg(\?|$)/i.test(logoUrl);

    if (isSvg) {
      return (
        <Image
          src={logoUrl}
          alt={studioName}
          width={320}
          height={96}
          unoptimized
          className={`${logoClass} ${shadow} ${tone} ${className}`}
          priority
        />
      );
    }

    return (
      <Image
        src={logoUrl}
        alt={studioName}
        width={320}
        height={96}
        className={`${logoClass} ${shadow} ${tone} ${className}`}
        priority
      />
    );
  }

  if (variant === "cinematic" && wordmark) {
    return (
      <span className={`cine-display cine-lower text-[1.6rem] text-[var(--cn-on-dark)] sm:text-[1.85rem] ${className}`}>
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
        className={`ed-serif relative z-10 min-w-0 truncate tracking-tight transition-colors duration-500 ${textSize} ${
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
