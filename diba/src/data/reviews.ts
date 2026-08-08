import type { ReviewCardProps } from "@/components/ui/ReviewCard";
import {
  SALONIZED_REVIEWS,
  type SalonizedReviewEntry,
} from "@/data/salonized-reviews";

export type ReviewTopic =
  | "alle"
  | "acne"
  | "pigment"
  | "rosacea"
  | "laser"
  | "huidveroudering"
  | "algemeen";

export type ReviewTopicMeta = {
  readonly id: ReviewTopic;
  readonly label: string;
};

export const REVIEW_TOPICS: readonly ReviewTopicMeta[] = [
  { id: "alle", label: "Alles" },
  { id: "acne", label: "Acne" },
  { id: "pigment", label: "Pigment" },
  { id: "rosacea", label: "Roodheid" },
  { id: "laser", label: "Laser" },
  { id: "huidveroudering", label: "Huidveroudering" },
  { id: "algemeen", label: "Algemeen" },
] as const;

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

const TOPIC_LABELS: Record<Exclude<ReviewTopic, "alle">, string> = {
  acne: "Acne",
  pigment: "Pigment",
  rosacea: "Roodheid",
  laser: "Laser",
  huidveroudering: "Huidveroudering",
  algemeen: "Algemeen",
};

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
