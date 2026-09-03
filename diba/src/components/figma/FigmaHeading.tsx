type FigmaHeadingProps = {
  /** Kop met optioneel *accent* in het midden. */
  text: string;
  as?: "h1" | "h2" | "h3";
  size?: "hero" | "section" | "card";
  className?: string;
};

const sizeClasses = {
  hero: "text-[clamp(2.35rem,5vw,4.25rem)] font-medium leading-[.93] tracking-[-.065em] sm:text-6xl lg:text-[4.25rem]",
  section:
    "text-3xl font-medium leading-[.98] tracking-[-.06em] sm:text-4xl lg:text-5xl",
  card: "text-xl font-medium tracking-[-.04em] sm:text-2xl",
} as const;

/** Figma-kop — sentence case, één groen accent (geen CAPS-Archivo). */
export default function FigmaHeading({
  text,
  as = "h2",
  size = "section",
  className = "",
}: FigmaHeadingProps) {
  const Tag = as;
  const match = text.match(/^(.*?)\*(.+?)\*(.*)$/);
  const before = match ? match[1] : text;
  const accent = match ? match[2] : null;
  const after = match ? match[3] : "";

  return (
    <Tag className={`text-[#17372a] ${sizeClasses[size]} ${className}`}>
      {before}
      {accent ? (
        <span className="text-[#387849] [font-family:var(--font-fraunces)] italic font-light">
          {accent}
        </span>
      ) : null}
      {after}
    </Tag>
  );
}
