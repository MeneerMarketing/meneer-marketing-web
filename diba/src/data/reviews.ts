import type { ReviewCardProps } from "@/components/ui/ReviewCard";
import {
  SALONIZED_REVIEWS,
  type SalonizedReviewEntry,
  type SalonizedReviewTopic,
} from "@/data/salonized-reviews";

export type ReviewTopic = "alle" | SalonizedReviewTopic;

export type ReviewTopicMeta = {
  readonly id: ReviewTopic;
  readonly label: string;
};

const TOPIC_LABELS: Record<SalonizedReviewTopic, string> = {
  acne: "Acne",
  littekens: "Littekens",
  pigment: "Pigment",
  rosacea: "Roodheid",
  laser: "Laserontharing",
  huidveroudering: "Huidveroudering",
  gezichtsbehandeling: "Gezichtsbehandeling",
  intake: "Huidconsult",
  algemeen: "Algemeen",
};

/**
 * De filterknoppen op /reviews komen uit de reviews zelf.
 *
 * Ze stonden hier als vaste lijst, en toen de tags werden nagelopen bleken twee ervan leeg:
 * over pigment en over rimpels schrijft niemand. Een knop die naar niets leidt is erger dan
 * een knop minder, en een vaste lijst gaat dat opnieuw doen zodra de reviews veranderen.
 */
export const REVIEW_TOPICS: readonly ReviewTopicMeta[] = [
  { id: "alle" as const, label: "Alles" },
  ...(Object.keys(TOPIC_LABELS) as SalonizedReviewTopic[])
    .filter((id) => SALONIZED_REVIEWS.some((r) => r.topics.includes(id)))
    .map((id) => ({ id, label: TOPIC_LABELS[id] })),
];

export type Review = ReviewCardProps & {
  readonly id: string;
  readonly topics: readonly Exclude<ReviewTopic, "alle">[];
  readonly relativeDate?: string;
};

export const REVIEWS: readonly Review[] = SALONIZED_REVIEWS.map(
  (entry: SalonizedReviewEntry): Review => ({
    id: entry.id,
    quote: entry.quote,
    name: entry.name,
    treatment: entry.treatment,
    stars: entry.stars,
    relativeDate: entry.relativeDate,
    topics: entry.topics,
  }),
);

export function reviewsForTopic(topic: ReviewTopic): readonly Review[] {
  if (topic === "alle") return REVIEWS;
  return REVIEWS.filter((r) => r.topics.includes(topic));
}

/** Primair onderwerp voor pill op kaart (voorkeur voor specifiek boven algemeen). */
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
