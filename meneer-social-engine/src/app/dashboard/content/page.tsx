import { LAUNCH_CONTENT_PLAN } from "@/data/launch-content-plan";
import { ContentQueueCard } from "@/components/dashboard/ContentQueueCard";

/** Demo-queue tot Supabase gekoppeld is. */
const DEMO_QUEUE = LAUNCH_CONTENT_PLAN.slice(3, 7).map((item, i) => ({
  id: `demo-${i}`,
  formatId: item.formatId,
  hook: item.hook,
  caption: item.caption,
  status: i === 0 ? ("awaiting_approval" as const) : ("draft" as const),
  scheduledAt: item.plannedFor,
  criticOverall: [91, 84, 88, 79][i] ?? 80,
}));

export default function ContentQueuePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold">Content Queue</h1>
        <p className="mt-2 text-mm-muted">
          Bekijken, goedkeuren, inplannen. Alles onder de 75 is er al uit gegooid.
        </p>
      </header>

      <div className="space-y-4">
        {DEMO_QUEUE.map((post) => (
          <ContentQueueCard key={post.id} post={post} />
        ))}
      </div>

      <p className="text-sm text-mm-muted">
        Zodra Supabase gekoppeld is loopt deze lijst live. Nieuw maandplan genereren
        kan via <code className="rounded bg-mm-surface px-1">POST /api/content/plan</code>.
      </p>
    </div>
  );
}
