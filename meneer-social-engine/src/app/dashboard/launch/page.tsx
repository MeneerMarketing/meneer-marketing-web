import { LAUNCH_CONTENT_PLAN } from "@/data/launch-content-plan";
import { getFormatById } from "@/data/formats";
import { getSlideCount } from "@/lib/templates/registry";
import { TemplateRenderer, DEMO_TEMPLATE_DATA } from "@/components/templates/TemplateRenderer";

export default function LaunchPlanPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold">Launch Plan</h1>
        <p className="mt-2 text-mm-muted">
          De eerste dertig dagen. Captions zijn af, je kunt ze plakken.
        </p>
      </header>

      <div className="space-y-6">
        {LAUNCH_CONTENT_PLAN.map((post) => {
          const format = getFormatById(post.formatId);
          const demo = DEMO_TEMPLATE_DATA[post.formatId];

          return (
            <article
              key={post.title}
              className="overflow-hidden rounded-2xl border border-mm-surface bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-mm-surface p-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-mm-accent px-3 py-1 text-xs font-bold text-white">
                      {format.name}
                    </span>
                    {post.pinned ? (
                      <span className="rounded-full bg-mm-surface px-3 py-1 text-xs font-bold">
                        Vastgezet
                      </span>
                    ) : null}
                    <span className="text-xs text-mm-muted">
                      {format.mediaType} · {getSlideCount(post.formatId)} slides
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold">{post.hook}</h2>
                  <p className="mt-1 text-sm text-mm-muted">{post.angle}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-mm-muted">
                  {post.plannedFor}
                </span>
              </div>

              <div className="flex flex-col gap-6 p-6 lg:flex-row">
                {demo ? (
                  <div className="shrink-0 overflow-hidden rounded-xl border border-mm-surface bg-mm-bg">
                    <div
                      className="origin-top-left"
                      style={{ width: 216, height: 270 }}
                    >
                      <div
                        className="origin-top-left"
                        style={{ transform: "scale(0.2)", width: 1080, height: 1350 }}
                      >
                        <TemplateRenderer
                          formatId={post.formatId}
                          templateData={demo}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-mm-muted">
                    Caption
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">
                    {post.caption}
                  </p>
                  <p className="mt-4 text-sm text-mm-accent">
                    {post.hashtags.map((h) => `#${h}`).join(" ")}
                  </p>
                  {post.note ? (
                    <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      {post.note}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
