import { formatDate } from "@/lib/format";
import type { ActivityLogRow } from "@/lib/types";

export function ActivityTimeline({ events }: { events: ActivityLogRow[] }) {
  return (
    <section className="rounded-2xl border border-mm-border bg-white shadow-mm-card">
      <div className="border-b border-mm-border px-5 py-4">
        <h3 className="text-sm font-extrabold tracking-tight text-slate-900">Activiteit</h3>
      </div>
      <div className="p-5">
        {events.length === 0 ? (
          <p className="text-sm italic text-slate-400">Nog geen activiteit</p>
        ) : (
          <ol className="relative space-y-4 border-l border-slate-200 pl-4">
            {events.map((event) => (
              <li key={event.id} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#FF5722]" />
                <p className="text-sm font-bold text-slate-900">{event.title}</p>
                {event.detail ? (
                  <p className="mt-0.5 text-sm text-slate-600">{event.detail}</p>
                ) : null}
                <p className="mt-1 text-[11px] text-slate-400">
                  {formatDate(event.created_at)}
                  {event.event_type ? ` · ${event.event_type}` : ""}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
