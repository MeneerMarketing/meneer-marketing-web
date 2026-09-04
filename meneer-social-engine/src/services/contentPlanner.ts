import Anthropic from "@anthropic-ai/sdk";
import { getBrandBrainPrompt } from "@/brand/brand-brain";
import { CONTENT_FORMATS, MONTHLY_TARGETS } from "@/data/formats";
import { MonthlyPlan } from "@/services/types";
import type { ContentIdea } from "@/services/types";

const OUTPUT_SCHEMA = `{
  "month": "YYYY-MM",
  "ideas": [
    {
      "format_id": "DE_REKENING",
      "hook": "Deze knop kost je €840 per maand.",
      "angle": "Wat de post inhoudelijk doet",
      "project_slug": "optioneel",
      "planned_for": "YYYY-MM-DD"
    }
  ],
  "weekly_rhythm": [
    { "day": "Dinsdag", "format_id": "DE_REKENING", "note": "..." }
  ]
}`;

export interface PlanMonthInput {
  month: string;
  focusService?: string;
  recentWinners?: string[];
  activeProjects?: string[];
}

export async function planMonth(input: PlanMonthInput): Promise<MonthlyPlan> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallbackPlan(input.month);

  const client = new Anthropic({ apiKey });

  const formatBriefing = CONTENT_FORMATS.filter(
    (f) => MONTHLY_TARGETS[f.id] > 0
  )
    .map(
      (f) =>
        `${f.id} (${MONTHLY_TARGETS[f.id]}x, tier ${f.tier}): ${f.description}. Taak: ${f.job}`
    )
    .join("\n");

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: `${getBrandBrainPrompt()}

Je bent de contentplanner voor de Instagram van Meneer Marketing.
Lever uitsluitend JSON, geen markdown eromheen.

Formats en aantallen voor deze maand:
${formatBriefing}

Ritme: dinsdag De Rekening, donderdag Meneer Fixt, zaterdag Meneer Zegt.
Wisselaars om de week ertussen.

Focus deze maand: ${input.focusService ?? "websites from scratch"}
Actieve projecten: ${input.activeProjects?.join(", ") ?? "SkinComplete, BestRest, Hills Pilates"}
Formats die recent goed presteerden: ${input.recentWinners?.join(", ") ?? "nog geen data"}

Eisen aan elke hook:
- maximaal twaalf woorden
- concreet, geen categorie maar een specifiek geval
- bij De Rekening staat er altijd een bedrag in
- nooit een vraag als opening tenzij die echt scherp is`,
    messages: [
      {
        role: "user",
        content: `Maak het contentplan voor ${input.month}. Gebruik dit schema:\n${OUTPUT_SCHEMA}`,
      },
    ],
  });

  const text = message.content[0]?.type === "text" ? message.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return fallbackPlan(input.month);

  try {
    return MonthlyPlan.parse(JSON.parse(jsonMatch[0]));
  } catch {
    return fallbackPlan(input.month);
  }
}

function fallbackPlan(month: string): MonthlyPlan {
  const ideas: ContentIdea[] = [
    {
      format_id: "DE_REKENING",
      hook: "Deze knop kost je €840 per maand.",
      angle: "Belangrijkste knop onder de vouw, in de verkeerde kleur.",
      planned_for: `${month}-04`,
    },
    {
      format_id: "MENEER_FIXT",
      hook: "Deze hero krijgt vijftien minuten van me.",
      angle: "Eén element herbouwd, before en after naast elkaar.",
      project_slug: "bestrest",
      planned_for: `${month}-06`,
    },
    {
      format_id: "MENEER_ZEGT",
      hook: "Je hebt waarschijnlijk geen nieuwe website nodig.",
      angle: "Het probleem zit meestal op het eerste scherm.",
      planned_for: `${month}-08`,
    },
    {
      format_id: "MENEER_METER",
      hook: "Raad de score voordat ik hem laat zien.",
      angle: "Sitescore met de uitslag pas op de laatste slide.",
      planned_for: `${month}-11`,
    },
    {
      format_id: "MENEER_ONTLEEDT",
      hook: "Coolblue doet dit slim. Jij mag het jatten.",
      angle: "Concrete levertijd in plaats van een vage termijn.",
      planned_for: `${month}-18`,
    },
  ];

  return {
    month,
    ideas,
    weekly_rhythm: [
      { day: "Dinsdag", format_id: "DE_REKENING", note: "Carousel met bedrag" },
      { day: "Donderdag", format_id: "MENEER_FIXT", note: "Reel, één element" },
      { day: "Zaterdag", format_id: "MENEER_ZEGT", note: "Contraire mening" },
    ],
  };
}
