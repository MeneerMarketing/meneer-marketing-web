import { Badge } from "@/components/dashboard/ui";
import {
  confidenceLevelLabel,
  confidenceLevelTone,
  type EmailConfidenceLevel,
} from "@/services/email/emailConfidenceService";

export function EmailConfidenceBadge({
  level,
  score,
  reasons,
}: {
  level: EmailConfidenceLevel | null | undefined;
  score?: number | null;
  reasons?: string[] | null;
}) {
  if (!level) return null;

  return (
    <div className="mt-3 border-t border-mm-border pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          E-mail confidence
        </span>
        <Badge tone={confidenceLevelTone(level)}>
          {confidenceLevelLabel(level)}
          {score != null ? ` · ${score}` : ""}
        </Badge>
      </div>
      {reasons && reasons.length > 0 ? (
        <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs text-slate-500">
          {reasons.slice(0, 4).map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : null}
      {level === "skip" ? (
        <p className="mt-2 text-xs text-rose-700">
          Outreach blokkeert dit adres (geen MX of systeemadres).
        </p>
      ) : level === "low" ? (
        <p className="mt-2 text-xs text-amber-800">
          Laag vertrouwen. Check het adres handmatig vóór verzenden.
        </p>
      ) : null}
    </div>
  );
}
