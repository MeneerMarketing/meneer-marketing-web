import type { ReviewCardProps } from "@/components/ui/ReviewCard";
import {
  SALONIZED_REVIEWS,
  type SalonizedReviewEntry,
  type SalonizedReviewTopic,
} from "@/data/salonized-reviews";
import { ONDERWERPEN, verfijnOnderwerpen } from "@/data/review-onderwerpen";

export type ReviewTopic = "alle" | SalonizedReviewTopic;

export type ReviewTopicMeta = {
  readonly id: ReviewTopic;
  readonly label: string;
};

const TOPIC_LABELS = Object.fromEntries(
  ONDERWERPEN.map((o) => [o.id, o.label]),
) as Record<SalonizedReviewTopic, string>;

export type Review = ReviewCardProps & {
  readonly id: string;
  readonly topics: readonly Exclude<ReviewTopic, "alle">[];
  readonly relativeDate?: string;
};

/* De tags uit de bron, met "algemeen" vervangen door wat er in de tekst staat. Zie
   `review-onderwerpen.ts` voor hoe dat gaat en waarom. */
export const REVIEWS: readonly Review[] = SALONIZED_REVIEWS.map(
  (entry: SalonizedReviewEntry): Review => ({
    id: entry.id,
    quote: entry.quote,
    name: entry.name,
    treatment: entry.treatment,
    stars: entry.stars,
    relativeDate: entry.relativeDate,
    topics: verfijnOnderwerpen(entry.topics, entry.quote),
  }),
);

/**
 * De filterknoppen op de uitgelichte set komen uit de reviews zelf.
 *
 * Ze stonden hier als vaste lijst, en toen de tags werden nagelopen bleken twee ervan leeg:
 * over pigment en over rimpels schrijft niemand. Een knop die naar niets leidt is erger dan
 * een knop minder, en een vaste lijst gaat dat opnieuw doen zodra de reviews veranderen.
 */
export const REVIEW_TOPICS: readonly ReviewTopicMeta[] = [
  { id: "alle" as const, label: "Alles" },
  ...ONDERWERPEN.filter((o) =>
    REVIEWS.some((r) => r.topics.includes(o.id)),
  ).map((o) => ({ id: o.id, label: o.label })),
];

export function reviewsForTopic(topic: ReviewTopic): readonly Review[] {
  if (topic === "alle") return REVIEWS;
  return REVIEWS.filter((r) => r.topics.includes(topic));
}

/** Primair onderwerp voor de pil op de kaart: de klacht gaat voor het bezoek, en "kort en
    goed" komt alleen als er niets anders is. */
export function primaryReviewTopic(
  review: Review,
): Exclude<ReviewTopic, "alle"> {
  const specific = review.topics.find((t) => t !== "algemeen");
  return specific ?? "algemeen";
}

export function reviewTopicLabel(topic: Exclude<ReviewTopic, "alle">): string {
  return TOPIC_LABELS[topic];
}

export function reviewCountForTopic(topic: ReviewTopic): number {
  return reviewsForTopic(topic).length;
}
