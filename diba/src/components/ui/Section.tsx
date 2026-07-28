import type { ReactNode } from "react";

/**
 * Sectie-omhulsel (DIBA-RULES.md §5 en §7).
 *
 * Zet de huisstijl-marges (5 / 9 / 7,5vw) en de maximale contentbreedte op één plek,
 * zodat elke pagina vanzelf hetzelfde ritme houdt.
 *
 * `toon="donker"` is het donkergroene volvlak. Daar geldt een harde regel: **maximaal
 * twee per pagina**, en ze markeren altijd dezelfde twee momenten — het bewijs (de
 * meting) en de volgende stap (de intake). Een derde donker vlak betekent dat je iets
 * tot bewijs verklaart wat het niet is.
 */

export type SectionToon = "wit" | "zacht" | "mint" | "donker";

const tonen: Record<SectionToon, string> = {
  wit: "bg-[var(--g-010)]",
  zacht: "bg-[var(--g-025)]",
  mint: "bg-[var(--g-050)]",
  donker: "bg-[var(--g-700)] text-[var(--on-dark)]",
};

type SectionProps = {
  children: ReactNode;
  id?: string;
  toon?: SectionToon;
  /** Compactere verticale ruimte, voor tussenbanners. */
  smal?: boolean;
  className?: string;
  /** Extra klassen op de binnencontainer. */
  innerClassName?: string;
};

export default function Section({
  children,
  id,
  toon = "wit",
  smal = false,
  className = "",
  innerClassName = "",
}: SectionProps) {
  const ruimte = smal ? "py-10 lg:py-14" : "py-20 lg:py-28";
  return (
    <section
      id={id}
      className={`px-5 sm:px-9 lg:px-[7.5vw] ${ruimte} ${tonen[toon]} ${className}`.trim()}
    >
      <div className={`mx-auto max-w-[1800px] ${innerClassName}`.trim()}>{children}</div>
    </section>
  );
}
