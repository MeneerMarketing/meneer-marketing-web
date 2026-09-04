import type { FollowupTemplateId } from "@/types/domain";

export function followupTemplateLabel(template: FollowupTemplateId): string {
  switch (template) {
    case "check_in":
      return "Korte check-in";
    case "last_ping":
      return "Laatste ping";
    case "custom":
      return "Leeg sjabloon";
    default:
      return template;
  }
}

export const FOLLOWUP_TEMPLATE_OPTIONS: FollowupTemplateId[] = [
  "check_in",
  "last_ping",
  "custom",
];
