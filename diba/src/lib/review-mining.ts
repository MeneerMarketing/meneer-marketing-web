import type { ReviewCardProps } from "@/components/ui/ReviewCard";
import { REVIEWS, type ReviewTopic } from "@/data/reviews";

const PILLAR_REVIEW_TOPICS: Record<string, Exclude<ReviewTopic, "alle">[]> = {
  acne: ["acne"],
  pigmentvlekken: ["pigment"],
  melasma: ["pigment"],
  huidverkleuring: ["pigment"],
  "donkere-kringen": ["pigment"],
  rosacea: ["rosacea"],
  huidveroudering: ["huidveroudering"],
  littekens: ["algemeen"],
  striae: ["algemeen"],
  porien: ["acne", "algemeen"],
  "droge-huid": ["algemeen"],
  "gevoelige-huid": ["rosacea", "algemeen"],
  huiduitslag: ["algemeen"],
  eczeem: ["algemeen"],
  psoriasis: ["algemeen"],
  keloiden: ["algemeen"],
  "huidkanker-naevi": ["algemeen"],
  cellulitis: ["algemeen"],
  symptoomzoeker: ["algemeen"],
};

/**
 * Review-mining v1: koppel Salonized-export aan pillars via topics.
 * Max 3 reviews per pillar, gefilterd op onderwerp.
 */
export function reviewsForPillar(slug: string, limit = 3): ReviewCardProps[] {
  const topics = PILLAR_REVIEW_TOPICS[slug] ?? ["algemeen"];
  const seen = new Set<string>();
  const result: ReviewCardProps[] = [];

  for (const topic of topics) {
    for (const review of REVIEWS) {
      if (!review.topics.includes(topic)) continue;
      if (seen.has(review.id)) continue;
      seen.add(review.id);
      result.push({
        quote: review.quote,
        name: review.name,
        treatment: review.treatment,
        stars: review.stars,
      });
      if (result.length >= limit) return result;
    }
  }

  return result;
}
