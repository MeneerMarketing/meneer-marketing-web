import { EditorialStars } from "@/components/templates/editorial/EditorialStars";

interface Props {
  rating: string | null;
  ratingValue: number;
  reviewCount: number;
  location: string | null;
  phone: string | null;
}

/**
 * Smalle espresso-balk boven de header. Scrollt gewoon weg, want de header komt
 * er los van vast te staan. Alleen feiten uit de snapshot, en elk deel valt weg
 * zodra de ruimte te krap wordt.
 */
export function EditorialTopBar({
  rating,
  ratingValue,
  reviewCount,
  location,
  phone,
}: Props) {
  if (!rating && !location && !phone) return null;

  return (
    <div className="ed-deep relative z-50 -mb-px">
      <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-between gap-6 px-5 md:h-11 md:px-10 lg:px-16">
        {rating ? (
          <div className="flex min-w-0 items-center gap-2.5">
            <EditorialStars rating={ratingValue} size="xs" />
            {/* Op smalle schermen de korte vorm, anders kapt de telefoon hem af */}
            <span className="ed-label-xs truncate text-[var(--ed-fg-70)] sm:hidden">
              {reviewCount > 0 ? `${rating} (${reviewCount})` : rating}
            </span>
            <span className="ed-label-xs hidden truncate text-[var(--ed-fg-70)] sm:block">
              {reviewCount > 0
                ? `${rating} uit ${reviewCount} beoordelingen`
                : `${rating} van 5`}
            </span>
          </div>
        ) : (
          <span />
        )}

        {location ? (
          <span className="ed-label-xs hidden text-[var(--ed-fg-52)] lg:block">
            {location}
          </span>
        ) : null}

        {phone ? (
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="ed-label-xs ed-link shrink-0 whitespace-nowrap text-[var(--ed-fg-70)] transition-colors duration-500 hover:text-[var(--ed-fg)]"
          >
            {phone}
          </a>
        ) : null}
      </div>
    </div>
  );
}
