import DibaLeafMark from "@/components/ui/DibaLeafMark";

type FigmaSoftAccentProps = {
  /** traject = linksboven sectie · clinic = kaart rechtsboven · cta = donkergroen blok */
  variant: "traject" | "clinic" | "cta";
  className?: string;
};

/**
 * Het merkaccent op grote vlakken: het Diba-blad, groot en aangesneden door de rand.
 *
 * Verving de blur-orbs met ringen en losse stippen. Die lazen als toevallige vormen in
 * plaats van als merk, en decoratieve verlopen zijn sowieso verboden (§2). Eén blad per
 * vlak, altijd aangesneden, altijd zo licht dat de tekst wint.
 */

/**
 * Positionering volgt één regel: het blad wordt door de rand aangesneden, maar nooit
 * zo ver dat je de vorm niet meer herkent. Getest — bij meer dan ongeveer een kwart
 * eraf leest het als een vlek in plaats van als een blad.
 */
const varianten = {
  // Lichte sectie: blad in zacht salie, linksboven aangesneden.
  traject:
    "pointer-events-none absolute -left-10 -top-8 h-[180px] w-[180px] -rotate-[14deg] text-[var(--g-100)] sm:-left-12 sm:h-[240px] sm:w-[240px]",
  // Op de groene fotokaart: blad in wit, licht genoeg om de foto te laten spreken.
  clinic:
    "pointer-events-none absolute -right-6 -top-5 h-[190px] w-[190px] rotate-[12deg] text-white/25 sm:-right-8 sm:h-[240px] sm:w-[240px]",
  // Donkergroene CTA-band: blad in mint, heel ingehouden.
  cta: "pointer-events-none absolute -right-8 -top-10 h-[200px] w-[200px] rotate-[12deg] text-[var(--on-dark-accent)]/20 sm:-right-10 sm:h-[260px] sm:w-[260px]",
} as const;

export default function FigmaSoftAccent({ variant, className = "" }: FigmaSoftAccentProps) {
  return (
    <DibaLeafMark className={`${varianten[variant]} ${className}`.trim()} vein={false} />
  );
}
