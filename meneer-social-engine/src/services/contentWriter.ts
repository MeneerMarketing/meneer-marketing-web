import Anthropic from "@anthropic-ai/sdk";
import { getBrandBrainPrompt, containsForbiddenPhrase } from "@/brand/brand-brain";
import { getFormatById } from "@/data/formats";
import { getSlideCount } from "@/lib/templates/registry";
import { ContentIdea, GeneratedPost } from "@/services/types";

/** Wat elk format van de writer verwacht in template_data. */
const FORMAT_BRIEFS: Record<string, string> = {
  DE_REKENING: `template_data: { amount, period, hook, problem, why, calculation: [{label, value}], fix, meneerNote }
De rekensom moet kloppen en navolgbaar zijn: bezoekers, huidige conversie, haalbare conversie, orderwaarde.
Verzin geen cijfers die onmogelijk zijn. Blijf aan de voorzichtige kant, dat is geloofwaardiger.`,
  MENEER_FIXT: `template_data: { hook, problemLabel, timeLabel, resultLabel, clientName }
Eén element, niet een hele site. De hook belooft een tijdsduur.`,
  MENEER_ZEGT: `template_data: { everyoneSays, meneerSays, explanation, verdict }
Eén idee per post. Als je er twee hebt, kies de scherpste.`,
  MENEER_METER: `template_data: { siteName, scores: [{label, value}], total, verdict, oneLiner }
Labels zijn altijd Design, Vindbaarheid, Conversie, Snelheid. De oneLiner is droog, niet gemeen.`,
  MENEER_ONTLEEDT: `template_data: { brand, hook, observation, whyItWorks, stealThis }
Toon is positief. Je geeft weg wat de lezer morgen kan toepassen.`,
  DE_OFFERTE: `template_data: { hook, lineItems: [{label, price, verdict}], total, meneerVerdict }
verdict is "ok", "duur" of "onzin". Nooit een bureau bij naam.`,
  BUREAU_BINGO: `template_data: { cells (9 stuks), punchline, selfAware }
selfAware neemt Meneer zelf mee in de grap.`,
  CASE_BUILD: `template_data: { clientName, eyebrow, title, metric, metricHint, tags }`,
};

export async function writePost(idea: ContentIdea): Promise<GeneratedPost> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallbackPost(idea);

  const format = getFormatById(idea.format_id);
  const slides = getSlideCount(idea.format_id);
  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: `${getBrandBrainPrompt()}

Je schrijft één Instagram-post voor Meneer Marketing.

Format: ${format.name} (${format.id})
Taak van dit format: ${format.job}
Aantal slides: ${slides}

${FORMAT_BRIEFS[idea.format_id] ?? ""}

Caption-regels:
- eerste regel is de hook, die staat los
- daarna korte alinea's, geen bullets met streepjes
- schrijf zoals iemand praat, niet zoals iemand adverteert
- sluit af met iets concreets dat de lezer kan doen, of een droge observatie
- maximaal vijf hashtags

Lever uitsluitend JSON:
{ "caption": "...", "hashtags": ["..."], "template_data": { ... } }`,
    messages: [
      {
        role: "user",
        content: `Hook: ${idea.hook}
Invalshoek: ${idea.angle}
Project: ${idea.project_slug ?? "geen"}`,
      },
    ],
  });

  const text = message.content[0]?.type === "text" ? message.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return fallbackPost(idea);

  try {
    const parsed = JSON.parse(jsonMatch[0]) as Omit<GeneratedPost, "format_id">;
    const post = GeneratedPost.parse({ ...parsed, format_id: idea.format_id });

    if (containsForbiddenPhrase(post.caption)) return fallbackPost(idea);

    return post;
  } catch {
    return fallbackPost(idea);
  }
}

function fallbackPost(idea: ContentIdea): GeneratedPost {
  return {
    format_id: idea.format_id,
    caption: `${idea.hook}\n\n${idea.angle}`,
    hashtags: ["onlinemarketing", "webdesign", "ondernemen"],
    template_data: { hook: idea.hook, angle: idea.angle },
  };
}
