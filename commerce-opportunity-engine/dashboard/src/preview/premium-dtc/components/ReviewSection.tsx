import type { ReviewItem } from "../types";
import { ReviewStarRow, TrustStarsBadge } from "./TrustStarsBadge";

export function ReviewSection({
  kicker = "Reviews",
  title,
  rating,
  reviewCount,
  reviews,
}: {
  kicker?: string;
  title: string;
  rating?: number | null;
  reviewCount?: number | null;
  reviews: ReviewItem[];
}) {
  if (rating == null && reviews.length === 0) return null;

  return (
    <section className="pdtc-reviews" aria-labelledby="pdtc-reviews-title">
      <div className="pdtc-container">
        <div className="pdtc-reviews-head">
          <span className="pdtc-eyebrow">{kicker}</span>
          <h2 className="pdtc-display" id="pdtc-reviews-title">
            {title}
          </h2>
          {rating != null ? (
            <div className="pdtc-reviews-score">
              <TrustStarsBadge score={rating} size="md" />
              {reviewCount != null ? (
                <span className="pdtc-micro">{reviewCount} geverifieerde reviews</span>
              ) : null}
            </div>
          ) : null}
        </div>

        {reviews.length > 0 ? (
          <div className="pdtc-review-grid">
            {reviews.map((r) => (
              <blockquote key={`${r.author}-${r.text.slice(0, 24)}`} className="pdtc-review-card">
                <ReviewStarRow rating={r.rating} />
                <p>{r.text}</p>
                <cite>{r.author}</cite>
              </blockquote>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
