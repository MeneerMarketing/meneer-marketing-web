import DeLijn from "./DeLijn";

/**
 * DIBA Heading — handtekening-batch 3.5 (Addendum A3/A11)
 * Het signatuur-patroon: CAPS Archivo + precies ÉÉN accentwoord in olijf Fraunces-italic.
 * Notatie: sterretjes rond het accentwoord — "EERLIJK ADVIES VOOR *jouw* HUID".
 * Het accentwoord is altijd het menselijke woord (jouw, echt, eerlijk, samen, nodig),
 * nooit het commerciële. Optioneel De Lijn onder het accentwoord (Addendum A4).
 *
 * Regels afgedwongen: maximaal één accent (extra sterretjes worden letterlijk getoond,
 * zodat de fout opvalt in review i.p.v. stilletjes een tweede accent te maken).
 */

export type HeadingProps = {
  /** Kop met *accentwoord*-notatie. Schrijf de kop in normale zin-case; CAPS komt uit CSS. */
  text: string;
  as?: "h1" | "h2" | "h3";
  /** De Lijn onder het accentwoord (aanbevolen voor hero-/paginatitels) */
  lijn?: boolean;
  className?: string;
};

const sizes: Record<NonNullable<HeadingProps["as"]>, string> = {
  h1: "text-[32px] leading-[1.1] md:text-[52px]",
  h2: "text-[24px] leading-[1.15] md:text-[36px]",
  h3: "text-[19px] leading-[1.25] md:text-[24px]",
};

export default function Heading({
  text,
  as = "h2",
  lijn = false,
  className = "",
}: HeadingProps) {
  const Tag = as;

  // Splits op het EERSTE *accent*; alles daarna blijft gewone tekst.
  const match = text.match(/^(.*?)\*(.+?)\*(.*)$/);
  const before = match ? match[1] : text;
  const accent = match ? match[2] : null;
  const after = match ? match[3] : "";

  return (
    <Tag
      className={`uppercase tracking-[0.04em] text-[var(--diba-green-900)]
                  [font-family:var(--font-display)] font-semibold
                  ${sizes[as]} ${className}`}
    >
      {before}
      {accent ? (
        <span className="relative inline-block normal-case tracking-normal">
          <span className="text-[var(--diba-green-700)] [font-family:var(--font-accent)] italic font-light">
            {accent}
          </span>
          {lijn ? (
            <DeLijn
              className="absolute -bottom-[0.12em] left-0 w-full"
              dot="end"
            />
          ) : null}
        </span>
      ) : null}
      {after}
    </Tag>
  );
}
