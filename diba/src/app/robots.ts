import type { MetadataRoute } from "next";
import { DIBA_SITE_URL } from "@/lib/site";

/**
 * De crawlers van de taalmodellen, met naam genoemd.
 *
 * Ze mogen al onder `*`, dus hieronder verandert niets aan wat er vandaag gebeurt. Ze staan
 * er omdat het een besluit is en geen toevalligheid.
 *
 * Wie aangehaald wil worden in een antwoord van ChatGPT, Perplexity of Gemini moet door hun
 * crawler gelezen kunnen worden. Dat is precies de regel die iemand over een half jaar "voor
 * de veiligheid" dichtzet, zonder te weten dat hij daarmee de kliniek uit die antwoorden
 * haalt. Met de namen erbij is dat een zichtbare keuze in plaats van een zijeffect.
 *
 * Twee soorten, en het verschil doet ertoe:
 * - OAI-SearchBot, PerplexityBot en Google-Extended halen bronnen op om naar te verwijzen
 *   in een antwoord. Dat is waar we het voor doen.
 * - GPTBot en ClaudeBot verzamelen ook voor training. Dat is een andere afweging; wil de
 *   kliniek dat niet, dan haal je die twee hier weg en blijven de andere staan.
 */
const AI_CRAWLERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dev/"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/dev/"],
      })),
    ],
    sitemap: `${DIBA_SITE_URL}/sitemap.xml`,
  };
}
