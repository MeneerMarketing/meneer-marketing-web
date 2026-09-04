import Anthropic from "@anthropic-ai/sdk";
import { getBrandBrainPrompt } from "@/brand/brand-brain";
import { CriticScores, GeneratedPost } from "@/services/types";

const MIN_APPROVAL_SCORE = 75;

export async function critiquePost(post: GeneratedPost): Promise<CriticScores> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallbackScores(post);

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system: `${getBrandBrainPrompt()}

Je bent de Content Critic. Score de post 0-100 op: originality, meneer_fit, hook, shareability, commercial_value, ai_generic_risk.
overall = gemiddelde minus (ai_generic_risk * 0.3).
verdict = APPROVED als overall >= ${MIN_APPROVAL_SCORE}, anders REJECTED.
Antwoord alleen als JSON.`,
    messages: [
      {
        role: "user",
        content: JSON.stringify(post, null, 2),
      },
    ],
  });

  const text =
    message.content[0]?.type === "text" ? message.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return fallbackScores(post);

  return CriticScores.parse(JSON.parse(jsonMatch[0]));
}

function fallbackScores(post: GeneratedPost): CriticScores {
  const hookLen = post.caption.split("\n")[0]?.length ?? 0;
  const hook = hookLen > 10 && hookLen < 80 ? 85 : 60;
  const overall = Math.round((hook + 80 + 75 + 70 + 65) / 5);

  return {
    originality: 75,
    meneer_fit: 80,
    hook,
    shareability: 70,
    commercial_value: 65,
    ai_generic_risk: 15,
    overall,
    verdict: overall >= MIN_APPROVAL_SCORE ? "APPROVED" : "REJECTED",
    notes: "Fallback scoring (geen API key)",
  };
}

export { MIN_APPROVAL_SCORE };
