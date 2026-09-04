import { TemplateRenderer, DEMO_TEMPLATE_DATA } from "@/components/templates/TemplateRenderer";
import { CONTENT_FORMATS } from "@/data/formats";
import { getSlideCount } from "@/lib/templates/registry";
import type { ContentFormatId } from "@/services/types";

const TIER_LABEL: Record<1 | 2 | 3, string> = {
  1: "Wekelijks vast",
  2: "Maandelijks, voelt als een gebeurtenis",
  3: "Wildcard",
};

export default function TemplatesPage() {
  const tiers: (1 | 2 | 3)[] = [1, 2, 3];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-extrabold">Templates</h1>
        <p className="mt-2 text-mm-muted">
          Alles op 1080×1350, in code. Het koppie kijkt per slide naar wat er
          besproken wordt.
        </p>
      </header>

      {tiers.map((tier) => {
        const formats = CONTENT_FORMATS.filter(
          (f) => f.tier === tier && DEMO_TEMPLATE_DATA[f.id]
        );
        if (formats.length === 0) return null;

        return (
          <section key={tier} className="space-y-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-mm-accent">
              {TIER_LABEL[tier]}
            </h2>

            {formats.map((format) => (
              <FormatPreview key={format.id} formatId={format.id} name={format.name} job={format.job} />
            ))}
          </section>
        );
      })}
    </div>
  );
}

function FormatPreview({
  formatId,
  name,
  job,
}: {
  formatId: ContentFormatId;
  name: string;
  job: string;
}) {
  const data = DEMO_TEMPLATE_DATA[formatId];
  if (!data) return null;

  const slides = getSlideCount(formatId);

  return (
    <div className="rounded-2xl border border-mm-surface bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="mt-1 text-sm text-mm-muted">{job}</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: slides }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 overflow-hidden rounded-xl border border-mm-surface bg-mm-bg"
            style={{ width: 270, height: 337 }}
          >
            <div
              className="origin-top-left"
              style={{ transform: "scale(0.25)", width: 1080, height: 1350 }}
            >
              <TemplateRenderer formatId={formatId} templateData={data} slideIndex={i} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
