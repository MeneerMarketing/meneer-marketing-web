#!/usr/bin/env tsx
/**
 * Genereer maandplan via CLI.
 * Usage: npm run plan:month -- 2026-09
 */
import { planMonth } from "../src/services/contentPlanner";

const month = process.argv[2] ?? (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
})();

async function main() {
  console.log(`\n📅 Meneer Marketing contentplan: ${month}\n`);
  const plan = await planMonth({
    month,
    focusService: "websites from scratch",
    activeProjects: ["SkinComplete", "BestRest", "Hills Pilates"],
  });

  console.log("## Wekelijks ritme\n");
  for (const r of plan.weekly_rhythm) {
    console.log(`- ${r.day}: ${r.format_id} — ${r.note}`);
  }

  console.log(`\n## ${plan.ideas.length} ideeën\n`);
  for (const idea of plan.ideas) {
    console.log(`[${idea.format_id}] ${idea.planned_for ?? "?"}`);
    console.log(`  Hook: ${idea.hook}`);
    console.log(`  Angle: ${idea.angle}\n`);
  }
}

main().catch(console.error);
