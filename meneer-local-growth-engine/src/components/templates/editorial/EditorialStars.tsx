import type { EditorialStyle } from "@/components/templates/editorial/editorialModel";
import { formatRating } from "@/lib/studio";

interface Props {
  rating: number;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const SIZES: Record<NonNullable<Props["size"]>, string> = {
  xs: "text-[0.68rem]",
  sm: "text-[0.8rem]",
  md: "text-[0.95rem]",
  lg: "text-[1.25rem]",
};

/**
 * Sterren als typografische glyphs met een exacte vulling.
 * Zo klopt 4,6 ook echt visueel, zonder icon-library of losse SVG-paden.
 */
export function EditorialStars({ rating, size = "sm", className = "" }: Props) {
  const clamped = Math.max(0, Math.min(5, rating));
  const fill = `${(clamped / 5) * 100}%`;
  const style: EditorialStyle = { "--ed-star-fill": fill };

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className={`ed-stars ${SIZES[size]}`} aria-hidden>
        {"\u2605\u2605\u2605\u2605\u2605"}
        <span className="ed-stars-fill" style={style}>
          {"\u2605\u2605\u2605\u2605\u2605"}
        </span>
      </span>
      <span className="sr-only">{`${formatRating(clamped)} van 5`}</span>
    </span>
  );
}
