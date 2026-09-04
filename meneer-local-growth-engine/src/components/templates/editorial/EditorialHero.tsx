import Image from "next/image";
import type { EditorialModel } from "@/components/templates/editorial/editorialModel";

interface Props {
  model: EditorialModel;
  studioName: string;
  city: string;
  primaryService: string;
  secondary: { href: string; label: string } | null;
  /** Compacte kop op één regel (huidkliniek editorial). */
  headlineCompact?: boolean;
  chromeOffset?: boolean;
}

/**
 * Fullscreen beeldhero met transparante header erover.
 * Server-rendered: de kop komt woord voor woord binnen via CSS, de foto
 * zoomt langzaam in. Zonder beeld valt de hero terug op een typografische
 * variant, zodat een dunne snapshot niet leeg oogt.
 */
export function EditorialHero({
  model,
  studioName,
  city,
  primaryService,
  secondary,
  headlineCompact = false,
  chromeOffset = false,
}: Props) {
  const words = model.headlineWords;
  const lastIndex = words.length - 1;
  const hasMedia = Boolean(model.heroImage?.url);
  const heroSrc = model.heroImage?.url ?? "";
  const heroIsRemote = /^https?:\/\//i.test(heroSrc);

  const eyebrow = (
    <p
      className={`ed-label ed-enter ${
        hasMedia ? "text-white/75" : "text-[var(--ed-accent)]"
      }`}
      style={{ animationDelay: "120ms" }}
    >
      {model.eyebrow}
    </p>
  );

  const headline = (
    <h1
      className={`ed-serif mt-6 pb-1.5 ${
        hasMedia
          ? headlineCompact
            ? "max-w-none text-[clamp(1.85rem,3.6vw,3.5rem)] leading-[1.08] tracking-[-0.02em] text-white sm:text-[clamp(2rem,3.8vw,3.75rem)] md:whitespace-nowrap"
            : "max-w-[20ch] text-[clamp(2.7rem,6.6vw,6rem)] leading-[1.02] tracking-[-0.024em] text-white"
          : "ed-display"
      }`}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span
            className={`ed-word ${
              index === lastIndex && words.length >= 2
                ? hasMedia
                  ? "italic text-[#e7c9ad]"
                  : "italic text-[var(--ed-accent)]"
                : ""
            }`}
            style={{ animationDelay: `${180 + index * 75}ms` }}
          >
            {word}
          </span>
          {index < lastIndex ? " " : null}
        </span>
      ))}
    </h1>
  );

  const lead = (
    <p
      className={`ed-enter mt-7 max-w-[48ch] text-[1rem] leading-relaxed md:text-[1.1rem] ${
        hasMedia ? "text-white/85" : "text-[var(--ed-fg-70)]"
      }`}
      style={{ animationDelay: `${300 + words.length * 75}ms` }}
    >
      {model.lead}
    </p>
  );

  const actions = (
    <div
      className="ed-enter mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
      style={{ animationDelay: `${380 + words.length * 75}ms` }}
    >
      <a
        href={model.booking.href}
        {...(model.booking.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className={`ed-label ed-btn inline-flex items-center justify-center px-8 py-4 transition-colors duration-300 hover:text-white ${
          hasMedia
            ? "bg-white text-[#2a211a]"
            : "bg-[var(--ed-fg)] text-[var(--ed-bg)]"
        }`}
      >
        {model.booking.label}
      </a>
      {secondary ? (
        <a
          href={secondary.href}
          className={`ed-label inline-flex items-center justify-center px-8 py-4 transition-colors duration-300 ${
            hasMedia
              ? "border border-white/45 text-white hover:border-white hover:bg-white/10"
              : "border border-[var(--ed-line-strong)] text-[var(--ed-fg)] hover:border-[var(--ed-fg)] hover:bg-[var(--ed-bg-raised)]"
          }`}
        >
          {secondary.label}
        </a>
      ) : null}
    </div>
  );

  if (!hasMedia) {
    return (
      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 pb-20 pt-10 md:px-10 md:pb-24 md:pt-14 lg:grid-cols-12 lg:items-center lg:px-16">
          <div className="lg:col-span-7 lg:pr-10">
            {eyebrow}
            {headline}
            {lead}
            {actions}
          </div>
          <div className="lg:col-span-5">
            <div className="ed-tint ed-frame-in flex aspect-[4/5] flex-col justify-between border border-[var(--ed-line)] p-8">
              <span className="ed-label text-[var(--ed-accent)]">{city}</span>
              <span className="ed-serif ed-h2 text-[var(--ed-fg-88)]">
                {primaryService || studioName}
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="top"
      className={`relative min-h-[100dvh] overflow-hidden ${
        chromeOffset
          ? "-mt-[104px] md:-mt-[118px]"
          : "-mt-16 md:-mt-[74px]"
      }`}
    >
      <div className="absolute inset-0">
        <Image
          src={heroSrc}
          alt={model.heroImage!.alt}
          fill
          priority
          unoptimized={heroIsRemote}
          sizes="100vw"
          className="ed-grade animate-ken-burns object-cover object-center"
        />
        <div aria-hidden className="ed-scrim absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1440px] flex-col justify-end px-5 pb-36 pt-28 md:px-10 md:pb-32 lg:px-16">
        <div className="flex items-end justify-between gap-10">
          <div className="max-w-[46rem]">
            {eyebrow}
            {headline}
            {lead}
            {actions}
          </div>

          <div
            aria-hidden
            className="ed-enter hidden shrink-0 flex-col items-center gap-4 pb-2 text-white/70 lg:flex"
            style={{ animationDelay: `${520 + words.length * 75}ms` }}
          >
            <span className="ed-label [writing-mode:vertical-rl]">Scroll</span>
            <span className="ed-cue-track h-16 w-px bg-white/25" />
          </div>
        </div>
      </div>
    </section>
  );
}
