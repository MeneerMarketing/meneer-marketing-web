import { Badge } from "@/components/ui";

export function auditStatusLabel(status: string | null | undefined): string {
  if (!status || status === "PENDING" || status === "NOT_AUDITED") {
    return "Niet geaudit";
  }
  switch (status) {
    case "COMPLETED":
      return "Voltooid";
    case "NEEDS_RETRY":
      return "Retry nodig";
    case "FAILED_TECHNICAL":
      return "Technische fout";
    case "BLOCKED":
      return "Geblokkeerd";
    default:
      return status.replaceAll("_", " ");
  }
}

export function AuditStatusBadge({
  status,
}: {
  status: string | null | undefined;
}) {
  if (!status || status === "PENDING" || status === "NOT_AUDITED") {
    return <Badge tone="neutral">Niet geaudit</Badge>;
  }
  if (status === "COMPLETED") {
    return <Badge tone="success">Voltooid</Badge>;
  }
  if (status === "NEEDS_RETRY" || status === "FAILED_TECHNICAL") {
    return <Badge tone="warn">Retry nodig</Badge>;
  }
  if (status === "BLOCKED") {
    return <Badge tone="danger">Geblokkeerd</Badge>;
  }
  return <Badge tone="neutral">{auditStatusLabel(status)}</Badge>;
}

export function formatSupportingCount(
  value: number | null | undefined,
  label: string
): string {
  if (value === null || value === undefined) {
    return `${label}: —`;
  }
  return `${label}: ${value}`;
}
