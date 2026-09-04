import type { TemplateVariant } from "@/types/studio";
import type { TemplateFitMap } from "./templateFit";

export interface AssignmentCandidate {
  business_id: string;
  studio_name: string;
  fit: TemplateFitMap;
  recommended_template: TemplateVariant;
  recommended_template_score: number;
}

export interface TemplateAssignmentRow {
  business_id: string;
  studio_name: string;
  recommended_template: TemplateVariant;
  recommended_template_score: number;
  assigned_template: TemplateVariant;
  template_assignment_score: number;
  template_assignment_reason: string;
  template_assignment_confidence: number;
}

export interface CityAssignmentResult {
  assignments: TemplateAssignmentRow[];
  total_fit: number;
  summary: string;
}

function recommended(fit: TemplateFitMap): { template: TemplateVariant; score: number } {
  const ranked = (Object.entries(fit) as Array<[TemplateVariant, number]>).sort(
    (a, b) => b[1] - a[1]
  );
  const top = ranked[0] ?? ["soft-movement", 50];
  return { template: top[0], score: top[1] };
}

function solveRecursive(
  candidates: AssignmentCandidate[],
  templates: TemplateVariant[],
  index: number,
  used: Set<TemplateVariant>,
  current: Map<string, TemplateVariant>,
  currentTotal: number,
  best: { total: number; map: Map<string, TemplateVariant> }
): void {
  if (index >= candidates.length) {
    if (currentTotal > best.total) {
      best.total = currentTotal;
      best.map = new Map(current);
    }
    return;
  }

  const row = candidates[index]!;
  for (const template of templates) {
    if (used.has(template)) continue;
    used.add(template);
    current.set(row.business_id, template);
    solveRecursive(
      candidates,
      templates,
      index + 1,
      used,
      current,
      currentTotal + row.fit[template],
      best
    );
    current.delete(row.business_id);
    used.delete(template);
  }
}

/**
 * Maximaliseert SUM(assigned_template_fit) onder unieke template constraint.
 */
export function solveCityTemplateAssignment(input: {
  candidates: AssignmentCandidate[];
  templates: TemplateVariant[];
}): CityAssignmentResult {
  const { candidates, templates } = input;
  if (!candidates.length) {
    return { assignments: [], total_fit: 0, summary: "Geen kandidaten" };
  }

  const withRecommended = candidates.map((row) => {
    const rec = recommended(row.fit);
    return {
      ...row,
      recommended_template: rec.template,
      recommended_template_score: rec.score,
    };
  });

  if (withRecommended.length === 1) {
    const only = withRecommended[0]!;
    const assigned = only.recommended_template;
    const score = only.fit[assigned];
    return {
      assignments: [
        {
          business_id: only.business_id,
          studio_name: only.studio_name,
          recommended_template: only.recommended_template,
          recommended_template_score: only.recommended_template_score,
          assigned_template: assigned,
          template_assignment_score: score,
          template_assignment_reason: "Eén prospect: beste individuele template fit.",
          template_assignment_confidence: 95,
        },
      ],
      total_fit: score,
      summary: "Single prospect: recommended template gebruikt.",
    };
  }

  if (withRecommended.length > templates.length) {
    throw new Error(
      `Meer prospects (${withRecommended.length}) dan beschikbare templates (${templates.length})`
    );
  }

  const best = { total: -1, map: new Map<string, TemplateVariant>() };
  solveRecursive(withRecommended, templates, 0, new Set(), new Map(), 0, best);

  const greedyFallback = new Map<string, TemplateVariant>();
  const usedGreedy = new Set<TemplateVariant>();
  for (const row of withRecommended) {
    const ranked = (Object.entries(row.fit) as Array<[TemplateVariant, number]>).sort(
      (a, b) => b[1] - a[1]
    );
    const pick = ranked.find(([tpl]) => !usedGreedy.has(tpl)) ?? ranked[0];
    if (pick) {
      greedyFallback.set(row.business_id, pick[0]);
      usedGreedy.add(pick[0]);
    }
  }

  const finalMap = best.total >= 0 ? best.map : greedyFallback;
  let total = 0;
  const assignments: TemplateAssignmentRow[] = withRecommended.map((row) => {
    const assigned = finalMap.get(row.business_id) ?? row.recommended_template;
    const score = row.fit[assigned];
    total += score;
    const sameAsRecommended = assigned === row.recommended_template;
    return {
      business_id: row.business_id,
      studio_name: row.studio_name,
      recommended_template: row.recommended_template,
      recommended_template_score: row.recommended_template_score,
      assigned_template: assigned,
      template_assignment_score: score,
      template_assignment_reason: sameAsRecommended
        ? "Aanbevolen template past ook het beste in de city-wide assignment."
        : `City solver koos ${assigned} i.p.v. ${row.recommended_template} voor hogere gezamenlijke fit.`,
      template_assignment_confidence: sameAsRecommended ? 88 : 76,
    };
  });

  return {
    assignments,
    total_fit: total,
    summary: `Optimale city assignment over ${assignments.length} prospects (total fit ${total}).`,
  };
}
