import { LAUNCH_CONTENT_PLAN } from "@/data/launch-content-plan";
import { getFormatById } from "@/data/formats";

export default function CalendarPage() {
  const byDate = LAUNCH_CONTENT_PLAN.reduce<Record<string, typeof LAUNCH_CONTENT_PLAN>>(
    (acc, post) => {
      const date = post.plannedFor;
      if (!acc[date]) acc[date] = [];
      acc[date].push(post);
      return acc;
    },
    {}
  );

  const dates = Object.keys(byDate).sort();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold">Kalender</h1>
        <p className="mt-2 text-mm-muted">Launchmaand, dertig dagen.</p>
      </header>

      <div className="space-y-3">
        {dates.map((date) => (
          <div
            key={date}
            className="rounded-2xl border border-mm-surface bg-white p-5 shadow-sm"
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-mm-accent">
              {new Date(date).toLocaleDateString("nl-NL", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h2>
            <ul className="mt-3 space-y-2">
              {byDate[date].map((p) => (
                <li
                  key={p.title}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-mm-bg px-4 py-3"
                >
                  <span className="font-medium">{p.hook}</span>
                  <span className="text-sm text-mm-muted">
                    {getFormatById(p.formatId).name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
