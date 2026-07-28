/** Gedeelde Figma-homepage layout — klinisch, ruim, 1440px canvas. */

export const homeContainer =
  "mx-auto w-full max-w-[var(--diba-container-max)] px-[var(--hp-container-px)]";

export const homeSection = "py-[var(--hp-section-y)]";

export const homeHeaderGrid =
  "grid gap-[var(--space-6)] md:grid-cols-12 md:items-end md:gap-x-[var(--hp-header-gap)]";

export const homeHeaderLeft = "md:col-span-5";

export const homeHeaderRight = "md:col-span-7";

export const homeHeaderLeftNarrow = "md:col-span-4";

export const homeHeaderRightWide = "md:col-span-8";

export const homeCardGrid =
  "mt-[var(--space-10)] grid gap-[var(--hp-card-gap)]";

export const homeCardRadius = "rounded-[24px]";

export const homeTitleAfterLabel = "mt-[var(--space-3)]";

/** Hero-rechterkolom — grote radius linksonder, licht sage. */
export const homeHeroMediaShell =
  "relative w-full max-w-[540px] overflow-hidden rounded-bl-[9rem] bg-[var(--diba-hero-media-bg)] p-5 shadow-[0_20px_50px_rgba(15,45,28,.2)] sm:p-7 lg:max-w-[560px] lg:rounded-bl-[14rem] lg:p-8";

/** Huidscan-visual — strak licht kaartblok op donkere sectie. */
export const homeHuidscanCardShell =
  "relative w-full max-w-[540px] overflow-hidden rounded-[1.75rem] border border-white/20 bg-white p-5 shadow-[0_28px_64px_rgba(6,28,16,.32)] sm:p-6 lg:max-w-[560px] lg:rounded-[2rem] lg:p-7";
