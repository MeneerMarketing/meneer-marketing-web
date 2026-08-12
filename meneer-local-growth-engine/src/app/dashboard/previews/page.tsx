import Link from "next/link";
import {
  Badge,
  DemoBanner,
  SectionTitle,
} from "@/components/dashboard/ui";
import {
  getBusinesses,
  getCities,
  getPreviews,
  getTemplates,
} from "@/lib/data/dashboard";

export default async function PreviewsPage() {
  const [previews, businesses, templates, cities] = await Promise.all([
    getPreviews(),
    getBusinesses(),
    getTemplates(),
    getCities(),
  ]);

  return (
    <div>
      <SectionTitle
        eyebrow="Previews"
        title="Concept websites"
        description="Live gegenereerde previews uit Supabase, inclusief automatische branding."
      />
      <DemoBanner />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {previews.map((preview) => {
          const business = businesses.find((b) => b.id === preview.business_id);
          const template = templates.find((t) => t.id === preview.template_id);
          const city = cities.find((c) => c.id === business?.city_id);
          const brand = preview.brand_profile_snapshot as
            | { confidence?: number }
            | undefined;
          const confidence =
            preview.template_selection_confidence ?? brand?.confidence ?? null;

          return (
            <article
              key={preview.id}
              className="flex flex-col border border-mm-border bg-white shadow-mm-card"
            >
              <div className="relative flex aspect-[16/10] items-end bg-gradient-to-br from-slate-800 via-slate-700 to-[#C2410C]/80 p-4">
                <div className="relative">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
                    {preview.template_variant}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-white">
                    {template?.name ?? preview.template_variant}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="sky">{preview.status}</Badge>
                  {business?.is_demo ? <Badge tone="demo">DEMO</Badge> : null}
                </div>
                <h2 className="mt-3 text-base font-extrabold text-slate-900">
                  {business?.studio_name ?? "Unknown"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {city?.name ?? "—"} · {preview.template_variant}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  {preview.generated_at
                    ? new Date(preview.generated_at).toLocaleString("nl-NL")
                    : new Date(preview.created_at).toLocaleString("nl-NL")}
                  {confidence != null
                    ? ` · branding/template ${Math.round(Number(confidence) * 100)}%`
                    : ""}
                </p>
                <div className="mt-auto flex gap-3 pt-4">
                  <a
                    href={`/preview/${preview.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-[#C2410C]"
                  >
                    Open preview ↗
                  </a>
                  {business ? (
                    <Link
                      href={`/dashboard/leads/${business.id}?tab=preview`}
                      className="text-sm font-semibold text-slate-500 hover:text-slate-800"
                    >
                      Lead
                    </Link>
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
