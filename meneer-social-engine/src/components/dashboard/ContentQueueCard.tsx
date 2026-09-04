import { TemplateRenderer, DEMO_TEMPLATE_DATA } from "@/components/templates/TemplateRenderer";
import { getFormatById } from "@/data/formats";
import type { ContentFormatId } from "@/services/types";

interface QueuePost {
  id: string;
  formatId: ContentFormatId;
  hook: string;
  caption: string;
  status: "draft" | "awaiting_approval" | "approved" | "scheduled";
  scheduledAt?: string;
  criticOverall?: number;
}

const STATUS_STYLE: Record<QueuePost["status"], { label: string; className: string }> = {
  draft: { label: "Concept", className: "bg-gray-100 text-gray-700" },
  awaiting_approval: { label: "Wacht op jou", className: "bg-amber-100 text-amber-900" },
  approved: { label: "Goedgekeurd", className: "bg-green-100 text-green-800" },
  scheduled: { label: "Ingepland", className: "bg-blue-100 text-blue-800" },
};

export function ContentQueueCard({ post }: { post: QueuePost }) {
  const format = getFormatById(post.formatId);
  const templateData = DEMO_TEMPLATE_DATA[post.formatId];
  const status = STATUS_STYLE[post.status];

  return (
    <div className="rounded-2xl border border-mm-surface bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row">
        {templateData ? (
          <div
            className="shrink-0 overflow-hidden rounded-xl border border-mm-surface bg-mm-bg"
            style={{ width: 216, height: 270 }}
          >
            <div
              className="origin-top-left"
              style={{ transform: "scale(0.2)", width: 1080, height: 1350 }}
            >
              <TemplateRenderer formatId={post.formatId} templateData={templateData} />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-mm-accent px-3 py-1 text-xs font-bold text-white">
              {format.name}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
              {status.label}
            </span>
            {post.criticOverall ? (
              <span className="text-xs text-mm-muted">Score {post.criticOverall}/100</span>
            ) : null}
            {post.scheduledAt ? (
              <span className="text-xs text-mm-muted">{post.scheduledAt}</span>
            ) : null}
          </div>

          <h3 className="mt-4 text-xl font-bold">{post.hook}</h3>
          <p className="mt-2 line-clamp-4 whitespace-pre-line text-sm text-mm-muted">
            {post.caption}
          </p>

          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            <button
              type="button"
              className="rounded-lg bg-mm-accent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-mm-accent/90"
            >
              Goedkeuren
            </button>
            <button
              type="button"
              className="rounded-lg border border-mm-surface px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-mm-bg"
            >
              Aanpassen
            </button>
            <button
              type="button"
              className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              Weg
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
