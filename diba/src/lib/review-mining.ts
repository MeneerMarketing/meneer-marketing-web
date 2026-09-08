import type { ReviewCardProps } from "@/components/ui/ReviewCard";
import { REVIEWS, type ReviewTopic } from "@/data/reviews";

/* Voor klachten waar niemand over schrijft: de reviews over het bezoek die het meest
   zeggen. "Algemeen" was hier de terugvaloptie, maar dat zijn sinds de opdeling alleen
   nog de "Top!"-reviews, en die zeggen op een klachtpagina niets. */
const BEZOEK: readonly Exclude<ReviewTopic, "alle">[] = [
  "uitleg",
  "aandacht",
  "vakkundig",
];

const PILLAR_REVIEW_TOPICS: Record<string, Exclude<ReviewTopic, "alle">[]> = {
  acne: ["acne"],
  pigmentvlekken: ["pigment"],
  melasma: ["pigment"],
  huidverkleuring: ["pigment"],
  "donkere-kringen": ["pigment"],
  rosacea: ["rosacea"],
  huidveroudering: ["huidveroudering"],
  littekens: [...BEZOEK],
  striae: [...BEZOEK],
  porien: ["acne", ...BEZOEK],
  "droge-huid": [...BEZOEK],
  "gevoelige-huid": ["rosacea", ...BEZOEK],
  huiduitslag: [...BEZOEK],
  eczeem: [...BEZOEK],
  psoriasis: [...BEZOEK],
  keloiden: [...BEZOEK],
  "huidkanker-naevi": [...BEZOEK],
  symptoomzoeker: [...BEZOEK],
};

/**
 * Review-mining v1: koppel Salonized-export aan pillars via topics.
 * Max 3 reviews per pillar, gefilterd op onderwerp.
 */
export function reviewsForPillar(slug: string, limit = 3): ReviewCardProps[] {
  const topics = PILLAR_REVIEW_TOPICS[slug] ?? [...BEZOEK];
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
