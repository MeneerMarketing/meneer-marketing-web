import Image from "next/image";
import type { EditorialImage } from "@/components/templates/editorial/editorialModel";

interface Props {
  image: EditorialImage;
  sizes: string;
  className?: string;
  priority?: boolean;
  parallax?: boolean;
  tint?: boolean;
  hoverZoom?: boolean;
}

/**
 * Eén beeldbehandeling voor de hele template: lichte grade plus een
 * accentsluier. Foto's van echte studio's wisselen sterk in kwaliteit en
 * kleurtemperatuur; hierdoor blijft de pagina één geheel.
 */
export function EditorialFigure({
  image,
  sizes,
  className = "",
  priority = false,
  parallax = false,
  tint = true,
  hoverZoom = false,
}: Props) {
  const inner = parallax
    ? "ed-parallax absolute inset-0"
    : hoverZoom
      ? "absolute inset-0 transition-transform duration-[1300ms] ease-[var(--ease-premium)] group-hover:scale-[1.06]"
      : "absolute inset-0";

  return (
    <div
      className={`relative overflow-hidden ${hoverZoom ? "group" : ""} ${className}`}
    >
      <div className={inner}>
        <Image
          src={image.url}
          alt={image.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="ed-grade object-cover"
        />
      </div>
      {tint ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[var(--ed-accent)] opacity-[0.05] mix-blend-multiply"
        />
      ) : null}
    </div>
  );
}
