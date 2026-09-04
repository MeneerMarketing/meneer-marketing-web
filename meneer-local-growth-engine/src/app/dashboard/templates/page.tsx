import {
  Badge,
  DemoBanner,
  SectionTitle,
} from "@/components/dashboard/ui";
import { getPreviews, getTemplates, getVerticals } from "@/lib/data/dashboard";

export default async function TemplatesPage() {
  const [templates, verticals, previews] = await Promise.all([
    getTemplates(),
    getVerticals(),
    getPreviews(),
  ]);

  return (
    <div>
      <SectionTitle
        eyebrow="Templates"
        title="Design packs"
        description="Live Supabase templates. Pilates pack actief."
      />
      <DemoBanner />

      <div className="mb-8 border border-mm-border bg-white p-5 shadow-mm-card">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Vertical packs
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["PILATES", "SKIN_CLINIC", "DENTAL", "BEAUTY", "REAL_ESTATE"].map((pack) => (
            <Badge key={pack} tone={pack === "PILATES" ? "brand" : "neutral"}>
              {pack}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {templates.map((template) => {
          const vertical = verticals.find((v) => v.id === template.vertical_id);
          const count = previews.filter((p) => p.template_id === template.id).length;
          const previewSlug = previews.find((p) => p.template_id === template.id)?.slug;

          return (
            <article key={template.id} className="border border-mm-border bg-white shadow-mm-card">
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 via-white to-[#FFEDD5] p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
                  {vertical?.name ?? "Vertical"}
                </p>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
                  {template.name}
                </h2>
                <p className="mt-2 text-sm text-slate-500">{template.description}</p>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-mm-border p-4">
                <div className="flex items-center gap-2">
                  <Badge tone={template.active ? "success" : "neutral"}>
                    {template.active ? "Active" : "Off"}
                  </Badge>
                  <span className="text-xs text-slate-500">{count} previews</span>
                </div>
                {previewSlug ? (
                  <a
                    href={`/preview/${previewSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-[#C2410C]"
                  >
                    Preview ↗
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
