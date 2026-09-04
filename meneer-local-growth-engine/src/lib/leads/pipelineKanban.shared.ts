import type {
  BusinessPreviewStatus,
  LeadStatus,
  OutreachMessage,
  OutreachMessageStatus,
  PipelineStageId,
  PreviewStatus,
} from "@/types/domain";

export type { PipelineStageId };

export interface PipelineStageDefinition {
  id: PipelineStageId;
  label: string;
  hint: string;
  accent: string;
}

export const PIPELINE_STAGES: PipelineStageDefinition[] = [
  {
    id: "discovered",
    label: "Discovered",
    hint: "Nieuw gevonden, preview nog niet klaar",
    accent: "border-slate-300",
  },
  {
    id: "preview_ready",
    label: "Preview klaar",
    hint: "Preview staat, mail nog niet opgesteld",
    accent: "border-sky-300",
  },
  {
    id: "mail_draft",
    label: "Mail draft",
    hint: "Outreach staat klaar of wacht op goedkeuring",
    accent: "border-violet-300",
  },
  {
    id: "sent",
    label: "Verzonden",
    hint: "Mail is verstuurd, nog niet geopend",
    accent: "border-amber-300",
  },
  {
    id: "opened",
    label: "Geopend",
    hint: "Mail geopend of geklikt, of e-mailreply",
    accent: "border-orange-400",
  },
  {
    id: "inbound",
    label: "Inbound",
    hint: "Formulier ingevuld of meeting gepland",
    accent: "border-emerald-400",
  },
  {
    id: "client",
    label: "Klant",
    hint: "Klant geworden",
    accent: "border-[#FF5722]",
  },
];

const OPENED_OUTREACH: OutreachMessageStatus[] = ["OPENED", "CLICKED", "REPLIED"];
const SENT_OUTREACH: OutreachMessageStatus[] = ["SENDING", "SENT", "DELIVERED", "BOUNCED"];
const DRAFT_OUTREACH: OutreachMessageStatus[] = [
  "DRAFT",
  "REVIEW_REQUIRED",
  "APPROVED",
  "READY",
  "SCHEDULED",
];

const OUTREACH_PROGRESS: Partial<Record<OutreachMessageStatus, number>> = {
  DRAFT: 1,
  REVIEW_REQUIRED: 1,
  READY: 1,
  APPROVED: 2,
  SCHEDULED: 2,
  SENDING: 3,
  SENT: 3,
  DELIVERED: 3,
  BOUNCED: 3,
  OPENED: 4,
  CLICKED: 4,
  REPLIED: 5,
};

function isPreviewReady(input: {
  leadStatus: LeadStatus;
  previewStatus: BusinessPreviewStatus;
  previewRecordStatus: PreviewStatus | null;
}): boolean {
  return (
    input.leadStatus === "PREVIEW_READY" ||
    input.leadStatus === "READY_FOR_OUTREACH" ||
    input.previewStatus === "READY" ||
    input.previewStatus === "APPROVED" ||
    input.previewRecordStatus === "READY" ||
    input.previewRecordStatus === "APPROVED"
  );
}

export function pickBestOutreachMessage(
  messages: OutreachMessage[]
): OutreachMessage | null {
  const live = messages.filter((m) => !m.is_test);
  if (live.length === 0) return null;

  return live.reduce<OutreachMessage | null>((best, current) => {
    if (!best) return current;
    const bestScore = OUTREACH_PROGRESS[best.status] ?? 0;
    const currentScore = OUTREACH_PROGRESS[current.status] ?? 0;
    if (currentScore !== bestScore) {
      return currentScore > bestScore ? current : best;
    }
    return new Date(current.updated_at).getTime() > new Date(best.updated_at).getTime()
      ? current
      : best;
  }, null);
}

export function resolvePipelineStage(input: {
  leadStatus: LeadStatus;
  previewStatus: BusinessPreviewStatus;
  previewRecordStatus: PreviewStatus | null;
  outreachStatus: OutreachMessageStatus | null;
}): PipelineStageId {
  if (input.leadStatus === "CLIENT") return "client";
  if (input.leadStatus === "INBOUND" || input.leadStatus === "MEETING") return "inbound";

  if (input.outreachStatus && OPENED_OUTREACH.includes(input.outreachStatus)) {
    return "opened";
  }
  if (input.leadStatus === "REPLIED") return "opened";

  if (input.outreachStatus && SENT_OUTREACH.includes(input.outreachStatus)) {
    return "sent";
  }
  if (input.leadStatus === "CONTACTED") return "sent";

  if (input.outreachStatus && DRAFT_OUTREACH.includes(input.outreachStatus)) {
    return "mail_draft";
  }

  if (isPreviewReady(input)) return "preview_ready";

  return "discovered";
}

export function isPipelineExcludedLead(leadStatus: LeadStatus): boolean {
  return leadStatus === "REJECTED" || leadStatus === "DO_NOT_CONTACT";
}
