import type { ReviewCardProps } from "@/components/ui/ReviewCard";

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
};

/**
 * Salonized-export structuur. Quotes zijn placeholders tot Okan levert.
 * Nooit verzonnen reviews — alleen [COPY-NODIG] tags.
 */
export const REVIEWS: readonly Review[] = [
  {
    id: "rev-1",
    quote: "[COPY-NODIG: echte review uit Salonized-export]",
    name: "[COPY-NODIG: klant 1]",
    treatment: "[COPY-NODIG: behandeling 1]",
    stars: 5,
    topics: ["acne"],
  },
  {
    id: "rev-2",
    quote: "[COPY-NODIG: echte review uit Salonized-export]",
    name: "[COPY-NODIG: klant 2]",
    treatment: "[COPY-NODIG: behandeling 2]",
    stars: 5,
    topics: ["pigment"],
  },
  {
    id: "rev-3",
    quote: "[COPY-NODIG: echte review uit Salonized-export]",
    name: "[COPY-NODIG: klant 3]",
    treatment: "[COPY-NODIG: behandeling 3]",
    stars: 5,
    topics: ["rosacea"],
  },
  {
    id: "rev-4",
    quote: "[COPY-NODIG: echte review uit Salonized-export]",
    name: "[COPY-NODIG: klant 4]",
    treatment: "[COPY-NODIG: behandeling 4]",
    stars: 5,
    topics: ["laser"],
  },
  {
    id: "rev-5",
    quote: "[COPY-NODIG: echte review uit Salonized-export]",
    name: "[COPY-NODIG: klant 5]",
    treatment: "[COPY-NODIG: behandeling 5]",
    stars: 5,
    topics: ["huidveroudering"],
  },
  {
    id: "rev-6",
    quote: "[COPY-NODIG: echte review uit Salonized-export]",
    name: "[COPY-NODIG: klant 6]",
    treatment: "[COPY-NODIG: behandeling 6]",
    stars: 5,
    topics: ["algemeen", "acne"],
  },
] as const;

export function reviewsForTopic(topic: ReviewTopic): readonly Review[] {
  if (topic === "alle") return REVIEWS;
  return REVIEWS.filter((r) => r.topics.includes(topic));
}
