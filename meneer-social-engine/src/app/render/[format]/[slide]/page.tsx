import { notFound } from "next/navigation";
import { ContentFormatId } from "@/services/types";
import { getSlideCount } from "@/lib/templates/registry";
import { TemplateRenderer, DEMO_TEMPLATE_DATA } from "@/components/templates/TemplateRenderer";

export const dynamic = "force-dynamic";

/**
 * Kale render-route voor de PNG-export. Geen dashboard-chrome, exact 1080x1350,
 * zodat Playwright er een schone screenshot van kan maken.
 */
export default async function RenderSlidePage({
  params,
}: {
  params: Promise<{ format: string; slide: string }>;
}) {
  const { format, slide } = await params;

  const parsed = ContentFormatId.safeParse(format);
  if (!parsed.success) notFound();

  const formatId = parsed.data;
  const slideIndex = Number.parseInt(slide, 10);
  if (Number.isNaN(slideIndex) || slideIndex < 0 || slideIndex >= getSlideCount(formatId)) {
    notFound();
  }

  const data = DEMO_TEMPLATE_DATA[formatId];
  if (!data) notFound();

  return (
    <div id="slide-root" style={{ width: 1080, height: 1350 }}>
      <TemplateRenderer formatId={formatId} templateData={data} slideIndex={slideIndex} />
    </div>
  );
}
